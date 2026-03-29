const { ethers } = require('ethers');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class EventIndexer {
    constructor(rpcUrl, contracts) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.contracts = contracts;
        this.db = new sqlite3.Database(path.join(__dirname, '../data/rhythm.sqlite'));
        this.initDb();
    }

    async initDb() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                address TEXT PRIMARY KEY,
                savings_pct INTEGER,
                bills_pct INTEGER,
                last_updated INTEGER
            )`);

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

    
    start() {
        console.log('[Indexer] Monitoring Flow EVM events...');
        
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

        const controllerContract = new ethers.Contract(
            this.contracts.AutomationController.address, 
            this.contracts.AutomationController.abi, 
            this.provider
        );
        controllerContract.on('ExecutionCompleted', (user) => {
            console.log(`[Indexer] Execution Cycle Success for ${user}`);
        });
    }
}

module.exports = EventIndexer;
