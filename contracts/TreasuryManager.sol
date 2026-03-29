// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC20 (Mock for Flow USDC)
 */
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title TreasuryManager
 * @dev Handles USDC flow. Only moves tokens. Logic is handled elsewhere.
 * Prevents mixing of funds and calculation logic.
 */
contract TreasuryManager {
    IERC20 public usdc;
    address public executionEngine;

    modifier onlyEngine() {
        require(msg.sender == executionEngine, "Only ExecutionEngine can move funds.");
        _;
    }

    event FundsPulled(address indexed user, uint256 amount);
    event FundsDistributed(address indexed user, uint256 savings, uint256 bills, uint256 spend);

    constructor(address _usdc, address _executionEngine) {
        usdc = IERC20(_usdc);
        executionEngine = _executionEngine;
    }

    /**
     * @dev Pulls USDC from user to this contract. User must have approved this TM first.
     */
    function pullFunds(address _user, uint256 _amount) external onlyEngine {
        require(usdc.transferFrom(_user, address(this), _amount), "USDC Transfer failed.");
        emit FundsPulled(_user, _amount);
    }

    /**
     * @dev Distributes USDC into sub-accounts or simply marks it withinVaultLedger.
     * In a real system, these would be separate sub-vaults or internal accounts.
     * For now, this distributes from TM to VaultLedger-protected records.
     */
    function distributeFunds(
        address _user, 
        uint256 _savings, 
        uint256 _bills, 
        uint256 _spend
    ) 
        external 
        onlyEngine 
    {
        uint256 total = _savings + _bills + _spend;
        // Logic: Funds are held in this TreasuryManager contract, 
        // with accounting updated in VaultLedger by the ExecutionEngine.
        emit FundsDistributed(_user, _savings, _bills, _spend);
    }
}
