// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IExecutionEngine {
    function executeAutoSplit(address user, uint256 amount) external;
}

/**
 * @title AutomationController
 * @dev System Brain. Manages the lifecycle of an execution, handle retries, 
 * and controls system-level pausing (Circuit Breaker).
 */
contract AutomationController {
    enum Status { Idle, Processing, Failed, Retrying, Success }

    struct ExecutionState {
        uint8 retryCount;
        Status status;
        uint256 lastAttempt;
    }

    mapping(address => ExecutionState) public userExecutionStates;
    address public executionEngine;
    address public relayer;
    bool public systemPaused;

    uint8 public constant MAX_RETRIES = 3;
    uint256 public constant BASE_DELAY = 120; // Seconds

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Authorized relayers only.");
        _;
    }

    modifier whenNotPaused() {
        require(!systemPaused, "Circuit Breaker: System is paused.");
        _;
    }

    event ExecutionStarted(address indexed user, uint256 amount);
    event ExecutionFailed(address indexed user, string reason);
    event RetryScheduled(address indexed user, uint8 attempt);
    event ExecutionCompleted(address indexed user);
    event SystemPaused(bool state);

    constructor(address _relayer) {
        relayer = _relayer;
    }

    function setExecutionEngine(address _executionEngine) external {
        // Simple security: only initial deployer or owner can set this
        require(executionEngine == address(0), "Already set.");
        executionEngine = _executionEngine;
    }

    /**
     * @dev Core entry point for the off-chain relayer/orchestrator.
     * Starts the split cycle and handles the state transitions.
     */
    function triggerExecution(address _user, uint256 _amount) external onlyRelayer whenNotPaused {
        ExecutionState storage state = userExecutionStates[_user];
        require(state.status != Status.Processing, "Execution already in progress.");

        state.status = Status.Processing;
        state.lastAttempt = block.timestamp;
        emit ExecutionStarted(_user, _amount);

        try IExecutionEngine(executionEngine).executeAutoSplit(_user, _amount) {
            state.status = Status.Success;
            state.retryCount = 0;
            emit ExecutionCompleted(_user);
        } catch Error(string memory reason) {
            handleExecutionFailure(_user, reason);
        } catch {
            handleExecutionFailure(_user, "Unknown lower-level error.");
        }
    }

    /**
     * @dev Internal failure handling with retry logic.
     * Computes exponential delay based on retryCount.
     */
    function handleExecutionFailure(address _user, string memory _reason) internal {
        ExecutionState storage state = userExecutionStates[_user];
        
        if (state.retryCount < MAX_RETRIES) {
            state.retryCount += 1;
            state.status = Status.Retrying;
            emit RetryScheduled(_user, state.retryCount);
        } else {
            state.status = Status.Failed;
            emit ExecutionFailed(_user, _reason);
        }
    }

    /**
     * @dev Utility: Circuit Breaker for emergency situations.
     */
    function toggleCircuitBreaker(bool _pause) external onlyRelayer {
        systemPaused = _pause;
        emit SystemPaused(_pause);
    }
}
