// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VaultLedger
 * @dev State Authority Layer. Authoritative source of truth for user vault balances.
 * Protects balances with reentrancy guards and strict access control.
 */
contract VaultLedger {
    struct Vault {
        uint256 savings;
        uint256 bills;
        uint256 spend;
        uint256 lastUpdated;
    }

    mapping(address => Vault) public accountVaults;
    address public executionEngine;
    bool private _locked;

    // Access control: only ExecutionEngine can update balances
    modifier onlyEngine() {
        require(msg.sender == executionEngine, "Unauthorized: Only ExecutionEngine can update.");
        _;
    }

    // Protection against reentrancy
    modifier nonReentrant() {
        require(!_locked, "Reentrancy detected.");
        _locked = true;
        _;
        _locked = false;
    }

    event VaultUpdated(address indexed user, uint256 savings, uint256 bills, uint256 spend);

    /**
     * @dev Initialize with ExecutionEngine address.
     */
    constructor(address _executionEngine) {
        executionEngine = _executionEngine;
    }

    /**
     * @dev Core state mutation. Increases balances.
     */
    function updateBalances(
        address _user, 
        uint256 _savingsInc, 
        uint256 _billsInc, 
        uint256 _spendInc
    ) 
        external 
        onlyEngine 
        nonReentrant 
    {
        Vault storage v = accountVaults[_user];
        v.savings += _savingsInc;
        v.bills += _billsInc;
        v.spend += _spendInc;
        v.lastUpdated = block.timestamp;

        emit VaultUpdated(_user, v.savings, v.bills, v.spend);
    }

    /**
     * @dev Getter for user balances.
     */
    function getBalances(address _user) external view returns (uint256, uint256, uint256, uint256) {
        Vault memory v = accountVaults[_user];
        return (v.savings, v.bills, v.spend, v.lastUpdated);
    }
}
