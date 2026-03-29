const express = require('express');
const cors    = require('cors');
const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();
const crypto  = require('crypto');
const path    = require('path');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 4000;
const RPC  = process.env.RPC_URL || 'https://testnet.evm.nodes.onflow.org';

app.use(express.json());
app.use(cors());

const ADDRESSES = {
  RuleEngine:           '0x02a0Fc6088A441A6CE86Cf7d09c2a31245e67619',
  VaultLedger:          '0xb96BFf5fE3ce64D29cAAcC253E2c90392be88085',
  TreasuryManager:      '0x04F80c1DA4D8FCf676E7174e3BBA47BF367a73F9',
  ExecutionEngine:      '0x338bBC23F6049fb0FD54a7A8d2e4e26952A0B448',
  AutomationController: '0xD93b31cc5B6E995744D0D3c7d09f5c2E340E3b10',
};

const RULE_ENGINE_ABI = [
  'function setRule(uint8 _savings, uint8 _bills) external',
  'function getRule(address _user) external view returns (uint8, uint8, uint8)',
];

const VAULT_LEDGER_ABI = [
  'function getBalances(address _user) external view returns (uint256, uint256, uint256, uint256)',
  'function getTotalBalance(address _user) external view returns (uint256)',
];

const AUTOMATION_ABI = [
  'function triggerExecution(address _user, uint256 _amount, bytes32 _executionId) external',
  'function userExecutionStates(address) external view returns (uint8 retryCount, uint8 status, uint256 lastAttempt, uint256 nextRetryTime, bytes32 executionId)',
  'event ExecutionStarted(address indexed user, uint256 amount, bytes32 executionId)',
  'event ExecutionCompleted(address indexed user, bytes32 executionId)',
  'event ExecutionFailed(address indexed user, string reason, uint8 attempt)',
  'event RetryScheduled(address indexed user, uint8 attempt, uint256 nextRetryTime)',
];

const provider   = new ethers.JsonRpcProvider(RPC);
const wallet     = process.env.RELAYER_PRIVATE_KEY
  ? new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider)
  : null;

const ruleEngine  = new ethers.Contract(ADDRESSES.RuleEngine,   RULE_ENGINE_ABI,  wallet || provider);
const vaultLedger = new ethers.Contract(ADDRESSES.VaultLedger,  VAULT_LEDGER_ABI, provider);
const controller  = new ethers.Contract(ADDRESSES.AutomationController, AUTOMATION_ABI, wallet || provider);

const db = new sqlite3.Database(path.join(__dirname, 'data/rhythm.sqlite'));
db.run(`CREATE TABLE IF NOT EXISTS executions (
  tx_hash       TEXT PRIMARY KEY,
  execution_id  TEXT UNIQUE,
  user_address  TEXT,
  amount        TEXT,
  status        TEXT,
  retry_count   INTEGER DEFAULT 0,
  error_message TEXT,
  stage         TEXT DEFAULT 'trigger',
  timestamp     INTEGER
)`);

const lastRequest = {};
function rateLimit(req, res, next) {
  const user = req.body?.user || req.params?.user;
  if (!user) return next();
  const now  = Date.now();
  const last = lastRequest[user] || 0;
  if (now - last < 30_000) {
    return res.status(429).json({ error: 'Rate limit: wait 30s between executions' });
  }
  lastRequest[user] = now;
  next();
}

app.get('/health', async (_req, res) => {
  try {
    const block = await provider.getBlockNumber();
    res.json({ ok: true, block, rpc: RPC, contracts: ADDRESSES });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/rule/:user', async (req, res) => {
  try {
    const [savings, bills, spend] = await ruleEngine.getRule(req.params.user);
    res.json({ savings: Number(savings), bills: Number(bills), spend: Number(spend) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/rule/set', rateLimit, async (req, res) => {
  if (!wallet) return res.status(400).json({ error: 'No relayer key configured' });
  const { savings, bills } = req.body;
  if (savings + bills > 100) return res.status(400).json({ error: 'Rule sum exceeds 100' });
  try {
    const tx = await ruleEngine.setRule(savings, bills);
    await tx.wait(1);
    res.json({ success: true, txHash: tx.hash });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/vault/:user', async (req, res) => {
  try {
    const [savings, bills, spend, updatedAt] = await vaultLedger.getBalances(req.params.user);
    const total = await vaultLedger.getTotalBalance(req.params.user);
    res.json({
      savings:   ethers.formatEther(savings),
      bills:     ethers.formatEther(bills),
      spend:     ethers.formatEther(spend),
      total:     ethers.formatEther(total),
      updatedAt: Number(updatedAt),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/execution/trigger', rateLimit, async (req, res) => {
  if (!wallet) return res.status(400).json({ error: 'No relayer key configured' });
  const { user, amount } = req.body;
  if (!user || !amount) return res.status(400).json({ error: 'user and amount required' });

  const executionId = '0x' + crypto.createHash('sha256')
    .update(`${user}-${amount}-${Date.now()}`)
    .digest('hex');

  const parsed = ethers.parseEther(String(amount));

  db.run(`INSERT OR IGNORE INTO executions VALUES (?,?,?,?,?,?,?,?,?)`,
    [null, executionId, user, String(amount), 'pending', 0, null, 'trigger', Date.now()]);

  try {
    const tx = await controller.triggerExecution(user, parsed, executionId);
    db.run(`UPDATE executions SET tx_hash=?, status='submitted', stage='broadcast' WHERE execution_id=?`,
      [tx.hash, executionId]);

    await tx.wait(1);
    db.run(`UPDATE executions SET status='success', stage='confirmed' WHERE execution_id=?`, [executionId]);
    res.json({ success: true, txHash: tx.hash, executionId });
  } catch (e) {
    db.run(`UPDATE executions SET status='failed', error_message=?, stage='error' WHERE execution_id=?`,
      [e.message, executionId]);
    res.status(500).json({ error: e.message, executionId });
  }
});

app.get('/activity/:user', (req, res) => {
  db.all(
    `SELECT * FROM executions WHERE user_address=? ORDER BY timestamp DESC LIMIT 20`,
    [req.params.user],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    }
  );
});

app.listen(PORT, () => {
  console.log(`[Rhythm Backend] :${PORT} | Flow EVM Testnet (Chain 545)`);
  console.log(`[Contracts] RuleEngine       → ${ADDRESSES.RuleEngine}`);
  console.log(`[Contracts] VaultLedger      → ${ADDRESSES.VaultLedger}`);
  console.log(`[Contracts] TreasuryManager  → ${ADDRESSES.TreasuryManager}`);
  console.log(`[Contracts] ExecutionEngine  → ${ADDRESSES.ExecutionEngine}`);
  console.log(`[Contracts] AutoController   → ${ADDRESSES.AutomationController}`);
  console.log(`[Relayer]   ${wallet ? wallet.address : 'NOT CONFIGURED (read-only mode)'}`);
});
