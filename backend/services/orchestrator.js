const { ethers } = require('ethers');

class Orchestrator {
    constructor(relayer, controllerAddress, controllerAbi) {
        this.relayer = relayer;
        this.controllerAddress = controllerAddress;
        this.controllerAbi = controllerAbi;
    }

    
    async initiateAutopilot(userAddress, amount) {
        console.log(`[Orchestrator] Starting orchestration for User: ${userAddress}, Amount: ${amount}`);
        
        try {
            const receipt = await this.relayer.sendSponsoredTransaction(
                this.controllerAddress,
                this.controllerAbi,
                'triggerExecution',
                [userAddress, ethers.parseUnits(amount.toString(), 18)]
            );
            
            console.log(`[Orchestrator] Transaction successful: ${receipt.hash}`);
            return receipt;
            
        } catch (error) {
            console.error('[Orchestrator] Critical on-chain failure. Handled by failover layer.', error.message);
            throw error;
        }
    }

    
    async monitoringLoop() {
    }
}

module.exports = Orchestrator;
