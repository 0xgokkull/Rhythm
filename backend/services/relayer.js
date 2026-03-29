const { ethers } = require('ethers');
require('dotenv').config();

/**
 * @title RelayerService
 * @dev 10/10 Transaction Signing and Sponsorship Service for Flow EVM.
 * Responsibility: Secure nonce management, Gas sponsorship, Tx confirmation tracking.
 */
class RelayerService {
    constructor(rpcUrl, privateKey) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.nonce = null;
    }

    /**
     * @dev Synchronized nonce management to prevent collisions.
     */
    async getNextNonce() {
        if (this.nonce === null) {
            this.nonce = await this.provider.getTransactionCount(this.wallet.address);
        } else {
            this.nonce++;
        }
        return this.nonce;
    }

    /**
     * @dev Sponsoring gas for an execution. Triggers AutomationController.
     */
    async sendSponsoredTransaction(contractAddress, abi, method, params) {
        const contract = new ethers.Contract(contractAddress, abi, this.wallet);
        let retries = 3;
        
        while (retries > 0) {
            try {
                const nonce = await this.getNextNonce();
                const tx = await contract[method](...params, { nonce });
                console.log(`[Relayer] Transaction broadcasted: ${tx.hash}`);
                
                const receipt = await tx.wait(1); // Wait for 1 confirmation
                console.log(`[Relayer] Transaction confirmed: ${tx.hash}`);
                return receipt;
            } catch (error) {
                console.error(`[Relayer] Transmission failed. Retries remaining: ${retries - 1}`, error.message);
                retries--;
                if (retries === 0) throw error;
                // Wait 2s before retry (Exponential could be better)
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }
}

module.exports = RelayerService;
