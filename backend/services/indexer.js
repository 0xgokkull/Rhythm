const { ethers } = require('ethers');
const supabase = require('./supabase');
require('dotenv').config();

class EventIndexer {
    constructor(rpcUrl, contracts) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.contracts = contracts;
    }

    start() {
        console.log('[Indexer] Syncing Flow EVM events to Supabase Cloud...');
        
        const ruleContract = new ethers.Contract(
            this.contracts.RuleEngine.address, 
            this.contracts.RuleEngine.abi, 
            this.provider
        );
        
        ruleContract.on('RuleUpdated', async (user, savings, bills, version) => {
            console.log(`[Indexer] Rule Update for ${user}: ${savings}/${bills}`);
            try {
                await supabase.from('users').upsert({
                    address: user.toLowerCase(),
                    savings_pct: Number(savings),
                    bills_pct: Number(bills),
                    last_updated: Date.now()
                });
            } catch (e) {
                console.error('[Indexer] Error Syncing Rule:', e.message);
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
                await supabase.from('vaults').upsert({
                    user_address: user.toLowerCase(),
                    savings: ethers.formatEther(savings),
                    bills: ethers.formatEther(bills),
                    spend: ethers.formatEther(spend),
                    total: ethers.formatEther(total),
                    updated_at: Date.now()
                });
            } catch (e) {
                console.error('[Indexer] Error Syncing Vault:', e.message);
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
                await supabase.from('executions').update({
                    status: 'confirmed',
                    stage: 'confirmed',
                    confirmed_at: Date.now()
                }).eq('execution_id', executionId);
            } catch (e) {
                console.error('[Indexer] Error Syncing Execution:', e.message);
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
