pragma solidity ^0.8.20;

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

    
    function deposit() external payable {
        require(msg.value > 0, "Must send FLOW");
        userDeposits[msg.sender] += msg.value;
        emit FundsPulled(msg.sender, msg.value);
    }

    
    function distributeFunds(
        address _user,
        uint256 _savings,
        uint256 _bills,
        uint256 _spend
    ) external onlyEngine {
        uint256 total = _savings + _bills + _spend;
        require(userDeposits[_user] >= total, "Insufficient treasury balance");
        userDeposits[_user] -= total;
        emit FundsDistributed(_user, _savings, _bills, _spend);
    }

    
    function totalBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
