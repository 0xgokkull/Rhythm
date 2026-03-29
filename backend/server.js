const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

// ── Deployed Contract Addresses (Flow EVM Testnet) ──────────────────────────
const ADDRESSES = {
  RuleEngine:           '0xd3215799fB97296853BC07203c369e2611be55f3',
  VaultLedger:          '0xd41B3eBDC73Dc92816e7B397726A9caF09319840',
  TreasuryManager:      '0xc9624F90c36357093AA96c689AaC423c16249C99',
  ExecutionEngine:      '0xC92D970130c0F54eE24Cf81Cc4cB74925a9022d8',
  AutomationController: '0x472e1f2F3a237Ea213D5144c945B6Cfc75190F6a',
};

// ── Minimal ABIs (only what the API needs) ───────────────────────────────────
const RULE_ENGINE_ABI = [
  'function setRule(uint8 _savings, uint8 _bills) external',
  'function getRule(address _user) external view returns (uint8, uint8, uint8)',
  'event RuleUpdated(address indexed user, uint8 savings, uint8 bills, uint8 version)',
];

const VAULT_LEDGER_ABI = [
  'function getBalances(address _user) external view returns (uint256, uint256, uint256, uint256)',
  'event VaultUpdated(address indexed user, uint256 savings, uint256 bills, uint256 spend)',
];

const AUTOMATION_CONTROLLER_ABI = [
  'function triggerExecution(address _user, uint256 _amount) external',
  'function userExecutionStates(address) external view returns (uint8 retryCount, uint8 status, uint256 lastAttempt)',
  'event ExecutionStarted(address indexed user, uint256 amount)',
  'event ExecutionCompleted(address indexed user)',
  'event ExecutionFailed(address indexed user, string reason)',
  'event RetryScheduled(address indexed user, uint8 attempt)',
];

// ── Provider + Wallet ────────────────────────────────────────────────────────
const provider = new ethers.JsonRpcProvider('https://testnet.evm.nodes.onflow.org');
const wallet   = process.env.RELAYER_PRIVATE_KEY
  ? new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider)
  : null;

const ruleEngine  = new ethers.Contract(ADDRESSES.RuleEngine,   RULE_ENGINE_ABI,   wallet || provider);
const vaultLedger = new ethers.Contract(ADDRESSES.VaultLedger,  VAULT_LEDGER_ABI,  provider);
const controller  = new ethers.Contract(ADDRESSES.AutomationController, AUTOMATION_CONTROLLER_ABI, wallet || provider);

// ── SQLite (Activity log) ────────────────────────────────────────────────────
const db = new sqlite3.Database(path.join(__dirname, 'data/rhythm.sqlite'), (err) => {
  if (err) console.error('[DB] Failed to open:', err.message);
});

db.run(`CREATE TABLE IF NOT EXISTS executions (
  tx_hash      TEXT PRIMARY KEY,
  user_address TEXT,
  amount       TEXT,
  status       TEXT,
  timestamp    INTEGER
)`);

// ── Endpoints ────────────────────────────────────────────────────────────────

// GET /health — quick system check
app.get('/health', async (_req, res) => {
  try {
    const block = await provider.getBlockNumber();
    res.json({ ok: true, block, contracts: ADDRESSES });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /vault/:user — live vault balances from chain
app.get('/vault/:user', async (req, res) => {
  try {
    const [savings, bills, spend, updatedAt] = await vaultLedger.getBalances(req.params.user);
    res.json({
      savings:   ethers.formatUnits(savings, 6),
      bills:     ethers.formatUnits(bills,   6),
      spend:     ethers.formatUnits(spend,   6),
      updatedAt: Number(updatedAt),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /rule/:user — on-chain split rule
app.get('/rule/:user', async (req, res) => {
  try {
    const [savings, bills, spend] = await ruleEngine.getRule(req.params.user);
    res.json({ savings: Number(savings), bills: Number(bills), spend: Number(spend) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /rule/set — update split rule (relayer-sponsored)
app.post('/rule/set', async (req, res) => {
  if (!wallet) return res.status(400).json({ error: 'No relayer key configured' });
  const { savings, bills } = req.body;
  try {
    const tx = await ruleEngine.setRule(savings, bills);
    await tx.wait(1);
    res.json({ success: true, txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /execution/trigger — trigger autopilot split
app.post('/execution/trigger', async (req, res) => {
  if (!wallet) return res.status(400).json({ error: 'No relayer key configured' });
  const { user, amount } = req.body;
  try {
    const parsed = ethers.parseUnits(String(amount), 6);
    const tx = await controller.triggerExecution(user, parsed);
    db.run(`INSERT OR IGNORE INTO executions VALUES (?, ?, ?, ?, ?)`,
      [tx.hash, user, String(amount), 'pending', Date.now()]);
    await tx.wait(1);
    db.run(`UPDATE executions SET status='success' WHERE tx_hash=?`, [tx.hash]);
    res.json({ success: true, txHash: tx.hash });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /activity/:user — execution history from local DB
app.get('/activity/:user', (req, res) => {
  db.all(`SELECT * FROM executions WHERE user_address=? ORDER BY timestamp DESC LIMIT 20`,
    [req.params.user], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows || []);
    });
});

app.listen(PORT, () => {
  console.log(`[Rhythm Backend] Running on :${PORT}`);
  console.log(`[Contracts] RuleEngine       → ${ADDRESSES.RuleEngine}`);
  console.log(`[Contracts] VaultLedger      → ${ADDRESSES.VaultLedger}`);
  console.log(`[Contracts] TreasuryManager  → ${ADDRESSES.TreasuryManager}`);
  console.log(`[Contracts] ExecutionEngine  → ${ADDRESSES.ExecutionEngine}`);
  console.log(`[Contracts] AutoController   → ${ADDRESSES.AutomationController}`);
});
