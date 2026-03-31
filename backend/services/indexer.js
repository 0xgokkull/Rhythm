const { ethers } = require('ethers');
const supabase = require('./supabase');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const STATE_FILE = '/data/indexer_state.json';
const FALLBACK_STATE_FILE = path.join(__dirname, '../.indexer_state.json');

class EventIndexer {
    constructor(rpcUrl, contracts) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.contracts = contracts;
        this.lastBlock = 0;
        this.isScanning = false;
        
        // Initialize Interfaces for parsing logs
        this.interfaces = {};
        for (const [name, config] of Object.entries(contracts)) {
            this.interfaces[name] = new ethers.Interface(config.abi);
        }
    }

    async loadState() {
        try {
            let targetFile = STATE_FILE;
            if (!fs.existsSync(STATE_FILE)) {
                if (fs.existsSync(FALLBACK_STATE_FILE)) {
                    targetFile = FALLBACK_STATE_FILE;
                } else {
                    this.lastBlock = await this.provider.getBlockNumber();
                    console.log(`[Indexer] 🆕 No state file found. Starting from: ${this.lastBlock}`);
                    await this.saveState();
                    return;
                }
            }

            const data = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
            this.lastBlock = data.lastBlock || 0;
            console.log(`[Indexer] 💾 Loaded state from ${targetFile}. lastBlock: ${this.lastBlock}`);
        } catch (e) {
            console.warn('[Indexer] ⚠️ State load fallback:', e.message);
            this.lastBlock = await this.provider.getBlockNumber();
        }
    }

    async saveState() {
        const data = JSON.stringify({ lastBlock: this.lastBlock, updatedAt: Date.now() });
        try {
            // Attempt primary (Persistent Disk)
            const dir = path.dirname(STATE_FILE);
            if (fs.existsSync(dir)) {
                fs.writeFileSync(STATE_FILE, data);
                return;
            }
            
            // Attempt fallback (Local Disk)
            fs.writeFileSync(FALLBACK_STATE_FILE, data);
        } catch (e) {
            console.error('[Indexer] ❌ All state save attempts failed:', e.message);
        }
    }

    async verifyConnection() {
        try {
            const { error } = await supabase.from('executions').select('count', { count: 'exact', head: true });
            if (error) {
                console.warn(`[Indexer] ⚠️  Supabase Configuration Issue: ${error.message}`);
                console.warn('[Indexer] Please ensure the SQL migrations have been run.');
            } else {
                console.log('[Indexer] ✅ Supabase connection verified.');
            }
        } catch (e) {
            console.error('[Indexer] ❌ Supabase Failure:', e.message);
        }
    }

    async poll() {
        if (this.isScanning) return;
        this.isScanning = true;

        try {
            const currentBlock = await this.provider.getBlockNumber();
            if (currentBlock <= this.lastBlock) {
                this.isScanning = false;
                return;
            }

            // Scan in chunks of 1000 blocks to prevent RPC timeouts
            const toBlock = Math.min(this.lastBlock + 1000, currentBlock);
            console.log(`[Indexer] 🔍 Scanning: ${this.lastBlock + 1} -> ${toBlock}`);

            const logs = await this.provider.getLogs({
                fromBlock: this.lastBlock + 1,
                toBlock: toBlock,
                address: Object.values(this.contracts).map(c => c.address)
            });

            for (const log of logs) {
                await this.processLog(log);
            }

            this.lastBlock = toBlock;
            await this.saveState();

        } catch (e) {
            console.error('[Indexer] ❌ Polling Cycle Error:', e.message);
        } finally {
            this.isScanning = false;
        }
    }

    async processLog(log) {
        try {
            // Find which contract this log belongs to
            const contractName = Object.keys(this.contracts).find(
                name => this.contracts[name].address.toLowerCase() === log.address.toLowerCase()
            );
            if (!contractName) return;

            const iface = this.interfaces[contractName];
            const parsed = iface.parseLog(log);
            if (!parsed) return;

            console.log(`[Indexer] ⚡ Event: ${contractName}.${parsed.name}`);

            if (parsed.name === 'RuleUpdated') {
                const [user, savings, bills, version] = parsed.args;
                await supabase.from('users').upsert({
                    address: user.toLowerCase(),
                    savings_pct: Number(savings),
                    bills_pct: Number(bills),
                    last_updated: Date.now()
                });
            } 
            
            else if (parsed.name === 'VaultUpdated') {
                const [user, savings, bills, spend] = parsed.args;
                const ledgerContract = new ethers.Contract(this.contracts.VaultLedger.address, this.contracts.VaultLedger.abi, this.provider);
                const total = await ledgerContract.getTotalBalance(user);
                await supabase.from('vaults').upsert({
                    user_address: user.toLowerCase(),
                    savings: ethers.formatEther(savings),
                    bills: ethers.formatEther(bills),
                    spend: ethers.formatEther(spend),
                    total: ethers.formatEther(total),
                    updated_at: Date.now()
                });
            }

            else if (parsed.name === 'ExecutionCompleted') {
                const [user, executionId] = parsed.args;
                await supabase.from('executions').update({
                    status: 'confirmed',
                    stage: 'confirmed',
                    confirmed_at: Date.now()
                }).eq('execution_id', executionId);
            }
        } catch (e) {
            console.error('[Indexer] Event Processing Exception:', e.message);
        }
    }

    async start() {
        console.log('[Indexer] Production Event Engine starting...');
        await this.verifyConnection();
        await this.loadState();

        // Start the polling loop
        const loop = async () => {
            await this.poll();
            setTimeout(loop, 12000); // 12 second intervals match block times
        };
        loop();
    }
}

module.exports = EventIndexer;
