const { ethers } = require('ethers');

/**
 * @title Orchestrator
 * @dev The Core System Brain for the Node.js backend.
 * Responsibility: Trigger on-chain controller, coordinate off-chain retries, maintain sync.
 */
class Orchestrator {
    constructor(relayer, controllerAddress, controllerAbi) {
        this.relayer = relayer;
        this.controllerAddress = controllerAddress;
        this.controllerAbi = controllerAbi;
    }

    /**
     * @dev Main entry point to initiate a split execution.
     */
    async initiateAutopilot(userAddress, amount) {
        console.log(`[Orchestrator] Starting orchestration for User: ${userAddress}, Amount: ${amount}`);
        
        try {
            // Trigger the on-chain AutomationController
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
            // This is where off-chain secondary retries would be logic-queued if needed.
            throw error;
        }
    }

    /**
     * @dev Scheduled maintenance or monitoring (Off-chain lifecycle).
     */
    async monitoringLoop() {
        // Logic: Check for failed executions in DB and trigger recovery if contract state allows.
        // Implementation: Check for AutomationController.userExecutionStates[address].status === Failed
    }
}

module.exports = Orchestrator;
