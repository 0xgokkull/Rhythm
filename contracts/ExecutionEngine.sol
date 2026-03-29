// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IRuleEngine {
    function getRule(address user) external view returns (uint8, uint8, uint8);
}

interface IVaultLedger {
    function updateBalances(address user, uint256 savingsInc, uint256 billsInc, uint256 spendInc) external;
    function getTotalBalance(address user) external view returns (uint256);
}

interface ITreasuryManager {
    function distributeFunds(address user, uint256 savings, uint256 bills, uint256 spend) external;
    function userDeposits(address user) external view returns (uint256);
}

/**
 * @title ExecutionEngine
 * @dev Pure stateless computation. Splits native FLOW by rule percentages.
 */
contract ExecutionEngine {
    IRuleEngine       public ruleEngine;
    IVaultLedger      public vaultLedger;
    ITreasuryManager  public treasuryManager;
    address           public automationController;

    modifier onlyController() {
        require(msg.sender == automationController, "Only AutomationController");
        _;
    }

    event SplitExecuted(address indexed user, uint256 totalAmount, uint256 savings, uint256 bills, uint256 spend);

    constructor(address _rules, address _ledger, address _treasury, address _controller) {
        ruleEngine           = IRuleEngine(_rules);
        vaultLedger          = IVaultLedger(_ledger);
        treasuryManager      = ITreasuryManager(_treasury);
        automationController = _controller;
    }

    function executeAutoSplit(address _user, uint256 _amount) external onlyController {
        require(_amount > 0, "Amount must be > 0");

        // Invariant: rule percentages must be valid
        (uint8 sPct, uint8 bPct, uint8 spPct) = ruleEngine.getRule(_user);
        require(uint256(sPct) + bPct + spPct <= 100, "Invalid rule: exceeds 100");

        // Invariant: treasury must hold sufficient funds
        require(treasuryManager.userDeposits(_user) >= _amount, "Insufficient treasury balance");

        // Stateless calculation
        uint256 sAmt  = (_amount * sPct)  / 100;
        uint256 bAmt  = (_amount * bPct)  / 100;
        uint256 spAmt = _amount - sAmt - bAmt; // precision-safe remainder

        // Update accounting layers
        vaultLedger.updateBalances(_user, sAmt, bAmt, spAmt);
        treasuryManager.distributeFunds(_user, sAmt, bAmt, spAmt);

        emit SplitExecuted(_user, _amount, sAmt, bAmt, spAmt);
    }
}
