pragma solidity ^0.8.20;

contract RuleEngine {
    struct Rule {
        uint8 savings;
        uint8 bills;
        uint8 version;
        uint256 updatedAt;
    }

    mapping(address => Rule) public userRules;
    
    event RuleUpdated(address indexed user, uint8 savings, uint8 bills, uint8 version);

    
    function setRule(uint8 _savings, uint8 _bills) external {
        require(_savings + _bills <= 100, "Total split exceeds 100%");
        
        Rule storage rule = userRules[msg.sender];
        rule.savings = _savings;
        rule.bills = _bills;
        rule.version += 1;
        rule.updatedAt = block.timestamp;
        
        emit RuleUpdated(msg.sender, _savings, _bills, rule.version);
    }

    
    function getRule(address _user) external view returns (uint8, uint8, uint8) {
        Rule memory rule = userRules[_user];
        if (rule.version == 0) {
            return (30, 40, 30);
        }
        uint8 spend = 100 - rule.savings - rule.bills;
        return (rule.savings, rule.bills, spend);
    }
}
