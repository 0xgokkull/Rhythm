const { ethers } = require('ethers');
const supabase = require('./supabase');
require('dotenv').config();

class EventIndexer {
    constructor(rpcUrl, contracts) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.contracts = contracts;
    }

    async verifyConnection() {
        try {
            const { error } = await supabase.from('executions').select('count').limit(1);
            if (error) {
                console.warn(`[Indexer] ⚠️  Supabase Configuration Issue: ${error.message}`);
                console.warn('[Indexer] Please ensure you have run the SQL initialization script in your Supabase dashboard.');
            } else {
                console.log('[Indexer] ✅  Supabase connection verified. Tables detected.');
            }
        } catch (e) {
            console.error('[Indexer] ❌ Critical Supabase Connection Failure:', e.message);
        }
    }

    async start() {
        console.log('[Indexer] Syncing Flow EVM events to Supabase Cloud...');
        await this.verifyConnection();
        
        const ruleContract = new ethers.Contract(
            this.contracts.RuleEngine.address, 
            this.contracts.RuleEngine.abi, 
            this.provider
        );
        
        ruleContract.on('RuleUpdated', async (user, savings, bills, version) => {
            console.log(`[Indexer] Rule Update for ${user}: ${savings}/${bills}`);
            try {
                const { error } = await supabase.from('users').upsert({
                    address: user.toLowerCase(),
                    savings_pct: Number(savings),
                    bills_pct: Number(bills),
                    last_updated: Date.now()
                });
                if (error) console.error('[Indexer] Sync Error (Rule):', error.message);
            } catch (e) {
                console.error('[Indexer] Exception Syncing Rule:', e.message);
            }
        });

        const ledgerContract = new ethers.Contract(
            this.contracts.VaultLedger.address, 
            this.contracts.VaultLedger.abi, 
            this.provider
        );
        
        ledgerContract.on('VaultUpdated', async (user, savings, bills, spend) => {
            console.log(`[Indexer] Vault State Sync for ${user}`);
            try {
                const total = await ledgerContract.getTotalBalance(user);
                const { error } = await supabase.from('vaults').upsert({
                    user_address: user.toLowerCase(),
                    savings: ethers.formatEther(savings),
                    bills: ethers.formatEther(bills),
                    spend: ethers.formatEther(spend),
                    total: ethers.formatEther(total),
                    updated_at: Date.now()
                });
                if (error) console.error('[Indexer] Sync Error (Vault):', error.message);
            } catch (e) {
                console.error('[Indexer] Exception Syncing Vault:', e.message);
            }
        });

        const controllerContract = new ethers.Contract(
            this.contracts.AutomationController.address, 
            this.contracts.AutomationController.abi, 
            this.provider
        );

        controllerContract.on('ExecutionCompleted', async (user, executionId) => {
            console.log(`[Indexer] Execution Sync for ${user}`);
            try {
                const { error } = await supabase.from('executions').update({
                    status: 'confirmed',
                    stage: 'confirmed',
                    confirmed_at: Date.now()
                }).eq('execution_id', executionId);
                if (error) console.error('[Indexer] Sync Error (Execution):', error.message);
            } catch (e) {
                console.error('[Indexer] Exception Syncing Execution:', e.message);
            }
        });

        controllerContract.on('ExecutionFailed', async (user, reason, attempt) => {
            console.log(`[Indexer] Execution Failure Logged for ${user}: ${reason}`);
        });

        controllerContract.on('RetryScheduled', async (user, attempt, nextRetryTime) => {
            console.log(`[Indexer] Retry Logged for ${user}: Attempt ${attempt}`);
        });
    }
}

module.exports = EventIndexer;
