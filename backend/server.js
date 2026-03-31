const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const crypto = require('crypto');
const supabase = require('./services/supabase');
const EventIndexer = require('./services/indexer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const RPC = process.env.RPC_URL || 'https://testnet.evm.nodes.onflow.org';

// CORS configuration - ensure it handles all origins for testing
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const ADDRESSES = {
  RuleEngine: '0x02a0Fc6088A441A6CE86Cf7d09c2a31245e67619',
  VaultLedger: '0xb96BFf5fE3ce64D29cAAcC253E2c90392be88085',
  TreasuryManager: '0x04F80c1DA4D8FCf676E7174e3BBA47BF367a73F9',
  ExecutionEngine: '0x338bBC23F6049fb0FD54a7A8d2e4e26952A0B448',
  AutomationController: '0xD93b31cc5B6E995744D0D3c7d09f5c2E340E3b10',
};

const ABIS = {
  RuleEngine: [
    'function setRule(uint8 _savings, uint8 _bills) external',
    'function getRule(address _user) external view returns (uint8, uint8, uint8)',
    'event RuleUpdated(address indexed user, uint8 savings, uint8 bills, uint256 version)'
  ],
  VaultLedger: [
    'function getBalances(address _user) external view returns (uint256, uint256, uint256, uint256)',
    'function getTotalBalance(address _user) external view returns (uint256)',
    'event VaultUpdated(address indexed user, uint256 savings, uint256 bills, uint256 spend)'
  ],
  AutomationController: [
    'function triggerExecution(address _user, uint256 _amount, bytes32 _executionId) external',
    'function userExecutionStates(address) external view returns (uint8 retryCount, uint8 status, uint256 lastAttempt, uint256 nextRetryTime, bytes32 executionId)',
    'event ExecutionStarted(address indexed user, uint256 amount, bytes32 executionId)',
    'event ExecutionCompleted(address indexed user, bytes32 executionId)',
    'event ExecutionFailed(address indexed user, string reason, uint8 attempt)',
    'event RetryScheduled(address indexed user, uint8 attempt, uint256 nextRetryTime)'
  ],
  TreasuryManager: [
    'function userDeposits(address) external view returns (uint256)',
    'function deposit() external payable'
  ]
};

const provider = new ethers.JsonRpcProvider(RPC);

// Safe Wallet Initialization - Prevents process crash if private key is invalid
let wallet = null;
try {
  if (process.env.RELAYER_PRIVATE_KEY) {
    wallet = new ethers.Wallet(process.env.RELAYER_PRIVATE_KEY, provider);
    console.log('[Relayer] ✅ Wallet initialized:', wallet.address);
  } else {
    console.warn('[Relayer] ⚠️  RELAYER_PRIVATE_KEY missing. Read-only mode active.');
  }
} catch (e) {
  console.error('[Relayer] ❌ Wallet initialization failed:', e.message);
}

const ruleEngine = new ethers.Contract(ADDRESSES.RuleEngine, ABIS.RuleEngine, wallet || provider);
const vaultLedger = new ethers.Contract(ADDRESSES.VaultLedger, ABIS.VaultLedger, provider);
const controller = new ethers.Contract(ADDRESSES.AutomationController, ABIS.AutomationController, wallet || provider);

const lastRequest = {};
function rateLimit(req, res, next) {
  const user = req.body?.user || req.params?.user;
  if (!user) return next();
  const now = Date.now();
  if (now - (lastRequest[user] || 0) < 15000) {
    return res.status(429).json({ error: 'Rate limit: wait 15s between executions' });
  }
  lastRequest[user] = now;
  next();
}

app.get('/health', async (_req, res) => {
  try {
    const block = await provider.getBlockNumber();
    res.json({ 
      status: 'active', 
      block, 
      rpc: RPC, 
      relayer: !!wallet,
      relayer_address: wallet ? wallet.address : null,
      memory: process.memoryUsage().rss / 1024 / 1024 + ' MB'
    });
  } catch (e) {
    res.status(500).json({ status: 'partial_outage', error: e.message });
  }
});

app.get('/rule/:user', async (req, res) => {
  try {
    const [savings, bills, spend] = await ruleEngine.getRule(req.params.user);
    const data = { savings: Number(savings), bills: Number(bills), spend: Number(spend) };
    const { error } = await supabase.from('users').upsert({
      address: req.params.user.toLowerCase(),
      savings_pct: data.savings,
      bills_pct: data.bills,
      last_updated: Date.now()
    });
    if (error) console.error(`Supabase Sync Warning (Rule): ${error.message}`);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/rule/set', rateLimit, async (req, res) => {
  if (!wallet) return res.status(400).json({ error: 'Relayer is not configured' });
  const { savings, bills, user } = req.body;
  if (savings + bills > 100) return res.status(400).json({ error: 'Rule sum exceeds 100' });
  try {
    const tx = await ruleEngine.setRule(savings, bills);
    await tx.wait(1);
    if (user) {
      const { error } = await supabase.from('users').upsert({
        address: user.toLowerCase(),
        savings_pct: savings,
        bills_pct: bills,
        last_updated: Date.now()
      });
      if (error) console.error(`Supabase Sync Warning (Rule Set): ${error.message}`);
    }
    res.json({ success: true, txHash: tx.hash });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/vault/:user', async (req, res) => {
  try {
    const [savings, bills, spend, updatedAt] = await vaultLedger.getBalances(req.params.user);
    const total = await vaultLedger.getTotalBalance(req.params.user);
    const unprocessed = await treasuryManager.userDeposits(req.params.user);
    const data = {
      savings: ethers.formatEther(savings),
      bills: ethers.formatEther(bills),
      spend: ethers.formatEther(spend),
      total: ethers.formatEther(total),
      unprocessed: ethers.formatEther(unprocessed),
      updatedAt: Number(updatedAt),
    };
    const { error } = await supabase.from('vaults').upsert({
      user_address: req.params.user.toLowerCase(),
      savings: data.savings,
      bills: data.bills,
      spend: data.spend,
      total: data.total,
      updated_at: Date.now()
    });
    if (error) console.error(`Supabase Sync Warning (Vault): ${error.message}`);
    res.json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/execution/trigger', rateLimit, async (req, res) => {
  const { user, amount } = req.body;
  if (!wallet) return res.status(400).json({ error: 'Relayer is not configured' });
  if (!user || !amount) return res.status(400).json({ error: 'user and amount required' });

  const executionId = '0x' + crypto.createHash('sha256').update(`${user.toLowerCase()}-${amount}-${Date.now()}`).digest('hex');
  const parsed = ethers.parseEther(String(amount));

  const { error: insErr } = await supabase.from('executions').insert({
    execution_id: executionId,
    user_address: user.toLowerCase(),
    amount: String(amount),
    status: 'pending',
    stage: 'Request initiated',
    timestamp: Date.now()
  });
  if (insErr) console.warn(`Supabase Sync Warning (Execution Trigger): ${insErr.message}`);

  try {
    const tx = await controller.triggerExecution(user, parsed, executionId);
    await supabase.from('executions').update({ tx_hash: tx.hash, status: 'submitted', stage: 'Logic Triggered' }).eq('execution_id', executionId);
    await tx.wait(1);
    await supabase.from('executions').update({ status: 'confirmed', stage: 'On-Chain Sync', confirmed_at: Date.now() }).eq('execution_id', executionId);
    res.json({ success: true, txHash: tx.hash, executionId });
  } catch (e) {
    await supabase.from('executions').update({ status: 'failed', error_message: e.message, stage: 'error' }).eq('execution_id', executionId);
    res.status(500).json({ error: e.message, executionId });
  }
});

app.get('/tx/:hash', async (req, res) => {
  try {
    const receipt = await provider.getTransactionReceipt(req.params.hash);
    if (!receipt) return res.status(404).json({ error: 'Transaction receipt not found' });
    
    // Look for VaultUpdated in the logs
    const vaultUpdatedTopic = '0x21b2d4f2fd79e83ec5517173b9e075e7a9e32f4a478939c3e9a7e089d81d2f8a';
    const log = receipt.logs.find(l => l.topics[0] === vaultUpdatedTopic);
    
    if (!log) return res.json({ success: true, decoded: false });
    
    const iface = new ethers.Interface(ABIS.VaultLedger);
    const parsed = iface.parseLog(log);
    
    res.json({
      success: true,
      decoded: true,
      data: {
        user: parsed.args[0],
        savings: ethers.formatEther(parsed.args[1]),
        bills: ethers.formatEther(parsed.args[2]),
        spend: ethers.formatEther(parsed.args[3]),
        timestamp: Number(receipt.timestamp || Date.now() / 1000)
      }
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/activity/:user', async (req, res) => {
  try {
    const { data: rows, error } = await supabase.from('executions').select('*').eq('user_address', req.params.user.toLowerCase()).order('timestamp', { ascending: false }).limit(20);
    if (error) throw new Error(`Supabase Activity Query Failed: ${error.message}`);
    
    const pendingRows = (rows || []).filter(r => r.status === 'pending' || r.status === 'submitted');
    for (const row of pendingRows) {
      if (row.tx_hash) {
        const receipt = await provider.getTransactionReceipt(row.tx_hash);
        if (receipt) {
          const status = receipt.status === 1 ? 'confirmed' : 'failed';
          await supabase.from('executions').update({ status, stage: status === 'confirmed' ? 'confirmed' : 'error', confirmed_at: Date.now() }).eq('tx_hash', row.tx_hash);
          row.status = status;
        }
      }
    }
    res.json(rows || []);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/system/status/:user', async (req, res) => {
  try {
    const { data: rows, error } = await supabase.from('executions').select('status, retry_count').eq('user_address', req.params.user.toLowerCase());
    if (error) throw new Error(`Supabase Status Query Failed: ${error.message}`);
    
    const total = rows?.length || 0;
    const success = rows?.filter(r => r.status === 'confirmed')?.length || 0;
    const failed = rows?.filter(r => r.status === 'failed')?.length || 0;
    const pending = rows?.filter(r => r.status === 'pending' || r.status === 'submitted')?.length || 0;
    const avgRetry = total > 0 ? (rows.reduce((s, r) => s + (r.retry_count || 0), 0) / total).toFixed(2) : 0;
    res.json({ total_executions: total, success, failed, pending, failure_rate: total > 0 ? ((failed / total) * 100).toFixed(1) + '%' : '0%', avg_retry_count: Number(avgRetry), relayer_active: !!wallet });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Global Error Handler - Prevents process crash and ensures CORS on errors
app.use((err, req, res, next) => {
  console.error('[Internal Error Catch]', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message,
    status: 500
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Rhythm Backend] :${PORT} | Flow EVM Testnet (Chain 545)`);
  try {
    const indexer = new EventIndexer(RPC, {
      RuleEngine: { address: ADDRESSES.RuleEngine, abi: ABIS.RuleEngine },
      VaultLedger: { address: ADDRESSES.VaultLedger, abi: ABIS.VaultLedger },
      AutomationController: { address: ADDRESSES.AutomationController, abi: ABIS.AutomationController }
    });
    indexer.start();
  } catch (e) {
    console.error('[Indexer] ❌ Failed to start indexer on boot:', e.message);
  }
});
