// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RuleEngine
 * @dev Deterministic Config Layer for Rhythm.
 * Stores user split rules for savings, bills, and spend vaults.
 */
contract RuleEngine {
    struct Rule {
        uint8 savings;
        uint8 bills;
        uint8 version;
        uint256 updatedAt;
    }

    // Mapping of user address to their specific allocation rule
    mapping(address => Rule) public userRules;
    
    event RuleUpdated(address indexed user, uint8 savings, uint8 bills, uint8 version);

    /**
     * @dev Sets or updates the rule for a user.
     * @param _savings Percentage for savings (0-100)
     * @param _bills Percentage for bills (0-100)
     */
    function setRule(uint8 _savings, uint8 _bills) external {
        require(_savings + _bills <= 100, "Total split exceeds 100%");
        
        Rule storage rule = userRules[msg.sender];
        rule.savings = _savings;
        rule.bills = _bills;
        rule.version += 1;
        rule.updatedAt = block.timestamp;
        
        emit RuleUpdated(msg.sender, _savings, _bills, rule.version);
    }

    /**
     * @dev Simple getter for split amounts. Spend is calculated as remainder.
     */
    function getRule(address _user) external view returns (uint8, uint8, uint8) {
        Rule memory rule = userRules[_user];
        if (rule.version == 0) {
            return (30, 40, 30); // Default placeholder: 30% savings, 40% bills, 30% spend
        }
        uint8 spend = 100 - rule.savings - rule.bills;
        return (rule.savings, rule.bills, spend);
    }
}
