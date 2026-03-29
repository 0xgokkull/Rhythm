const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * @title EventIndexer
 * @dev Service to monitor contract events and maintain a normalized DB for frontend visibility.
 * Responsibility: Listen to contract logs, sync state, and provide an API for observability.
 */
class EventIndexer {
    constructor(rpcUrl, contracts) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.contracts = contracts; // Map of { address, abi, name }
        this.db = new sqlite3.Database(path.join(__dirname, '../data/rhythm.sqlite'));
        this.initDb();
    }

    async initDb() {
        this.db.serialize(() => {
            // Master users and their rules
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                address TEXT PRIMARY KEY,
                savings_pct INTEGER,
                bills_pct INTEGER,
                last_updated INTEGER
            )`);

            // Executions (The history of autopilot splits)
            this.db.run(`CREATE TABLE IF NOT EXISTS executions (
                tx_hash TEXT PRIMARY KEY,
                user_address TEXT,
                amount TEXT,
                status TEXT,
                timestamp INTEGER,
                retry_count INTEGER,
                split_savings TEXT,
                split_bills TEXT
            )`);

            // Vaults (Authoritative current state)
            this.db.run(`CREATE TABLE IF NOT EXISTS vaults (
                user_address TEXT PRIMARY KEY,
                savings TEXT,
                bills TEXT,
                spend TEXT,
                updated_at INTEGER
            )`);
            
            console.log('[Indexer] Local Database Initialized (Production Schema)');
        });
    }

    /**
     * @dev Start monitoring specific contract events.
     */
    start() {
        console.log('[Indexer] Monitoring Flow EVM events...');
        
        // Example: RuleEngine - RuleUpdated
        const ruleContract = new ethers.Contract(
            this.contracts.RuleEngine.address, 
            this.contracts.RuleEngine.abi, 
            this.provider
        );
        ruleContract.on('RuleUpdated', (user, savings, bills, version) => {
            console.log(`[Indexer] Rule Update for ${user}: ${savings}/${bills}`);
            this.db.run(`INSERT OR REPLACE INTO users (address, savings_pct, bills_pct, last_updated) 
                VALUES (?, ?, ?, ?)`, [user, savings, bills, Date.now()]);
        });

        // Example: VaultLedger - VaultUpdated
        const ledgerContract = new ethers.Contract(
            this.contracts.VaultLedger.address, 
            this.contracts.VaultLedger.abi, 
            this.provider
        );
        ledgerContract.on('VaultUpdated', (user, savings, bills, spend) => {
            console.log(`[Indexer] Vault State Sync for ${user}`);
            this.db.run(`INSERT OR REPLACE INTO vaults (user_address, savings, bills, spend, updated_at) 
                VALUES (?, ?, ?, ?, ?)`, [user, savings.toString(), bills.toString(), spend.toString(), Date.now()]);
        });

        // Example: AutomationController - ExecutionCompleted
        const controllerContract = new ethers.Contract(
            this.contracts.AutomationController.address, 
            this.contracts.AutomationController.abi, 
            this.provider
        );
        controllerContract.on('ExecutionCompleted', (user) => {
            console.log(`[Indexer] Execution Cycle Success for ${user}`);
            // Update execution record locally from block data if desired.
        });
    }
}

module.exports = EventIndexer;
