// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IExecutionEngine {
    function executeAutoSplit(address user, uint256 amount) external;
}

/**
 * @title AutomationController
 * @dev System brain: idempotency, stateful retry with backoff, circuit breaker.
 */
contract AutomationController {
    enum Status { Idle, Processing, Failed, Retrying, Success }

    struct ExecutionState {
        uint8   retryCount;
        Status  status;
        uint256 lastAttempt;
        uint256 nextRetryTime;   // enforced delay before next retry
        bytes32 executionId;     // idempotency key
    }

    mapping(address => ExecutionState) public userExecutionStates;
    // idempotency: reject duplicate execution IDs
    mapping(bytes32 => bool) public usedExecutionIds;

    address public executionEngine;
    address public relayer;
    bool    public systemPaused;

    uint8   public constant MAX_RETRIES  = 3;
    uint256 public constant BASE_DELAY   = 30;   // 30s base backoff
    uint256 public constant BACKOFF_MULT = 2;    // exponential: 30s, 60s, 120s

    modifier onlyRelayer() {
        require(msg.sender == relayer, "Only relayer");
        _;
    }

    modifier whenNotPaused() {
        require(!systemPaused, "Circuit breaker: system paused");
        _;
    }

    event ExecutionStarted(address indexed user, uint256 amount, bytes32 executionId);
    event ExecutionFailed(address indexed user, string reason, uint8 attempt);
    event RetryScheduled(address indexed user, uint8 attempt, uint256 nextRetryTime);
    event ExecutionCompleted(address indexed user, bytes32 executionId);
    event SystemPaused(bool state);

    constructor(address _relayer) {
        relayer = _relayer;
    }

    function setExecutionEngine(address _executionEngine) external {
        require(executionEngine == address(0), "Already set");
        executionEngine = _executionEngine;
    }

    /**
     * @dev Entry point. Idempotency key prevents double-execution.
     */
    function triggerExecution(
        address _user,
        uint256 _amount,
        bytes32 _executionId
    ) external onlyRelayer whenNotPaused {
        // Idempotency guard
        require(!usedExecutionIds[_executionId], "Duplicate execution ID");

        ExecutionState storage state = userExecutionStates[_user];

        // Don't allow new execution while one is in progress
        require(state.status != Status.Processing, "Execution in progress");

        // Enforce retry delay if retrying
        if (state.status == Status.Retrying) {
            require(block.timestamp >= state.nextRetryTime, "Retry delay not elapsed");
        }

        usedExecutionIds[_executionId] = true;
        state.executionId  = _executionId;
        state.status       = Status.Processing;
        state.lastAttempt  = block.timestamp;

        emit ExecutionStarted(_user, _amount, _executionId);

        try IExecutionEngine(executionEngine).executeAutoSplit(_user, _amount) {
            state.status     = Status.Success;
            state.retryCount = 0;
            state.nextRetryTime = 0;
            emit ExecutionCompleted(_user, _executionId);
        } catch Error(string memory reason) {
            _handleFailure(_user, reason);
        } catch {
            _handleFailure(_user, "Unknown error");
        }
    }

    function _handleFailure(address _user, string memory _reason) internal {
        ExecutionState storage state = userExecutionStates[_user];

        if (state.retryCount < MAX_RETRIES) {
            state.retryCount += 1;
            state.status = Status.Retrying;
            // Exponential backoff: 30s → 60s → 120s
            uint256 delay = BASE_DELAY * (BACKOFF_MULT ** (state.retryCount - 1));
            state.nextRetryTime = block.timestamp + delay;
            emit RetryScheduled(_user, state.retryCount, state.nextRetryTime);
        } else {
            state.status = Status.Failed;
            emit ExecutionFailed(_user, _reason, state.retryCount);
        }
    }

    function toggleCircuitBreaker(bool _pause) external onlyRelayer {
        systemPaused = _pause;
        emit SystemPaused(_pause);
    }
}
