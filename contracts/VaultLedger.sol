pragma solidity ^0.8.20;

contract VaultLedger {
    struct Vault {
        uint256 savings;
        uint256 bills;
        uint256 spend;
        uint256 lastUpdated;
    }

    mapping(address => Vault) public accountVaults;
    address public executionEngine;
    bool    private _locked;

    modifier onlyEngine() {
        require(msg.sender == executionEngine, "Only ExecutionEngine");
        _;
    }

    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

    event VaultUpdated(address indexed user, uint256 savings, uint256 bills, uint256 spend);

    constructor(address _executionEngine) {
        executionEngine = _executionEngine;
    }

    function updateBalances(
        address _user,
        uint256 _savingsInc,
        uint256 _billsInc,
        uint256 _spendInc
    ) external onlyEngine nonReentrant {
        Vault storage v = accountVaults[_user];
        v.savings    += _savingsInc;
        v.bills      += _billsInc;
        v.spend      += _spendInc;
        v.lastUpdated = block.timestamp;
        emit VaultUpdated(_user, v.savings, v.bills, v.spend);
    }

    function getBalances(address _user)
        external view
        returns (uint256, uint256, uint256, uint256)
    {
        Vault memory v = accountVaults[_user];
        return (v.savings, v.bills, v.spend, v.lastUpdated);
    }

    
    function getTotalBalance(address _user) external view returns (uint256) {
        Vault memory v = accountVaults[_user];
        return v.savings + v.bills + v.spend;
    }
}
