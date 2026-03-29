// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TreasuryManager
 * @dev Native FLOW custody layer. No ERC-20. Uses msg.value.
 */
contract TreasuryManager {
    address public executionEngine;
    mapping(address => uint256) public userDeposits;

    modifier onlyEngine() {
        require(msg.sender == executionEngine, "Only ExecutionEngine");
        _;
    }

    event FundsPulled(address indexed user, uint256 amount);
    event FundsDistributed(address indexed user, uint256 savings, uint256 bills, uint256 spend);

    constructor(address _executionEngine) {
        executionEngine = _executionEngine;
    }

    /**
     * @dev Users deposit native FLOW here.
     */
    function deposit() external payable {
        require(msg.value > 0, "Must send FLOW");
        userDeposits[msg.sender] += msg.value;
        emit FundsPulled(msg.sender, msg.value);
    }

    /**
     * @dev Called by ExecutionEngine to confirm split distribution accounting.
     * Funds remain in contract; VaultLedger tracks sub-balances.
     */
    function distributeFunds(
        address _user,
        uint256 _savings,
        uint256 _bills,
        uint256 _spend
    ) external onlyEngine {
        uint256 total = _savings + _bills + _spend;
        // Invariant: treasury must hold enough for this user
        require(userDeposits[_user] >= total, "Insufficient treasury balance");
        userDeposits[_user] -= total;
        emit FundsDistributed(_user, _savings, _bills, _spend);
    }

    /**
     * @dev Total FLOW held in this contract.
     */
    function totalBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
