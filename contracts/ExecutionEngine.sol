// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRuleEngine {
    function getRule(address user) external view returns (uint8, uint8, uint8);
}

interface IVaultLedger {
    function updateBalances(address user, uint256 savingsInc, uint256 billsInc, uint256 spendInc) external;
}

interface ITreasuryManager {
    function pullFunds(address user, uint256 amount) external;
    function distributeFunds(address user, uint256 savings, uint256 bills, uint256 spend) external;
}

/**
 * @title ExecutionEngine
 * @dev Pure computation layer for the Rhythm DeFi System. 
 * Orchestrates the split across rule engine, ledger, and treasury managers.
 */
contract ExecutionEngine {
    IRuleEngine public ruleEngine;
    IVaultLedger public vaultLedger;
    ITreasuryManager public treasuryManager;
    address public automationController;

    modifier onlyController() {
        require(msg.sender == automationController, "Only AutomationController can trigger splits.");
        _;
    }

    event SplitExecuted(address indexed user, uint256 totalAmount, uint256 savings, uint256 bills, uint256 spend);

    constructor(address _rules, address _ledger, address _treasury, address _controller) {
        ruleEngine = IRuleEngine(_rules);
        vaultLedger = IVaultLedger(_ledger);
        treasuryManager = ITreasuryManager(_treasury);
        automationController = _controller;
    }

    /**
     * @dev Main entry point. Stateless calculation for split logic.
     * Computes the split first, then triggers state updates in target contracts.
     */
    function executeAutoSplit(address _user, uint256 _amount) external onlyController {
        require(_amount > 0, "Amount must be greater than zero.");

        // 1. Fetch deterministic rules
        (uint8 sPct, uint8 bPct, uint8 spPct) = ruleEngine.getRule(_user);

        // 2. Perform stateless calculation (Split Computation)
        uint256 sAmt = (_amount * sPct) / 100;
        uint256 bAmt = (_amount * bPct) / 100;
        uint256 spAmt = _amount - sAmt - bAmt; // Precision safe allocation

        // 3. Coordinate State Mutation (Delegated updates)
        // A. Move USDC funds via Treasury Manager
        treasuryManager.pullFunds(_user, _amount);
        
        // B. Update balances in State Authority (Vault Ledger)
        vaultLedger.updateBalances(_user, sAmt, bAmt, spAmt);

        // C. Complete distribution record
        treasuryManager.distributeFunds(_user, sAmt, bAmt, spAmt);

        emit SplitExecuted(_user, _amount, sAmt, bAmt, spAmt);
    }
}
