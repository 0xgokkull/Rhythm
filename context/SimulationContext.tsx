'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type SystemStatus = 'idle' | 'detecting' | 'splitting' | 'failed' | 'retrying' | 'success';
export type EnginePhase = 'IDLE' | 'DETECTION' | 'VALIDATION' | 'ALLOCATION' | 'RETRY_LOGIC' | 'FINALIZING';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'info' | 'processing';
  amount?: string;
  vault?: string;
  retryCount?: number;
  txId?: string;
}

export interface VaultBalance {
  savings: number;
  bills: number;
  spend: number;
  lastUpdate: string;
  lastActivity: string;
}

interface SimulationState {
  status: SystemStatus;
  currentPhase: EnginePhase;
  isEnginePaused: boolean;
  lastRun: string | null;
  lastAmount: string | null;
  nextRun: string;
  retryCount: number;
  successRate: number;
  totalAutomated: number;
  autoSavedThisMonth: number;
  timeline: TimelineEvent[];
  vaults: VaultBalance;
  salary: number;
  rules: { savings: number; bills: number; spend: number };
  simulationSpeed: number;
  retryDepth: number;
  executionFrequency: 'Monthly' | 'Bi-weekly' | 'Manual';
  simulateSalary: () => void;
  resetSimulation: () => void;
  toggleEngine: () => void;
  setRules: (rules: { savings: number; bills: number; spend: number }) => void;
  setSalary: (salary: number) => void;
  setSimulationParams: (params: { speed?: number; depth?: number; freq?: 'Monthly' | 'Bi-weekly' | 'Manual' }) => void;
}

const SimulationContext = createContext<SimulationState | null>(null);

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}

function generateId() {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SystemStatus>('idle');
  const [currentPhase, setCurrentPhase] = useState<EnginePhase>('IDLE');
  const [isEnginePaused, setIsEnginePaused] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [lastAmount, setLastAmount] = useState<string | null>(null);
  const [nextRun] = useState('Apr 1, 9:00 AM');
  const [retryCount, setRetryCount] = useState(0);
  const [successRate, setSuccessRate] = useState(98.5);
  const [totalAutomated, setTotalAutomated] = useState(3);
  const [autoSavedThisMonth, setAutoSavedThisMonth] = useState(150);
  const [salary, setSalaryState] = useState(500);
  const [rules, setRulesState] = useState({ savings: 30, bills: 40, spend: 30 });
  const [vaults, setVaults] = useState<VaultBalance>({ 
    savings: 84.5, 
    bills: 112.5, 
    spend: 46.7,
    lastUpdate: '2 mins ago',
    lastActivity: '+15.2 FLOW via split'
  });
  
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: 'init-1',
      timestamp: 'Mar 28, 09:00 AM',
      title: 'Autopilot Initialized',
      description: 'System configured. Monitoring for deposits on Flow.',
      status: 'info',
    },
    {
      id: 'init-2',
      timestamp: 'Mar 28, 09:01 AM',
      title: 'Deposit Detected — 500 FLOW',
      description: 'Incoming deposit identified on Flow network.',
      status: 'success',
      amount: '500 FLOW',
    },
    {
      id: 'init-3',
      timestamp: 'Mar 28, 09:02 AM',
      title: 'Auto-Split Executed',
      description: 'On-chain execution complete via Flow Scheduled Transaction.',
      status: 'success',
      amount: '500 FLOW',
      txId: '0xabc...123',
    },
  ]);
  
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [retryDepth, setRetryDepth] = useState(3);
  const [executionFrequency, setExecutionFrequency] = useState<'Monthly' | 'Bi-weekly' | 'Manual'>('Monthly');

  const addEvent = useCallback((event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    setTimeline(prev => [{
      ...event,
      id: generateId(),
      timestamp: formatTime(new Date()),
    }, ...prev]);
  }, []);

  const simulateSalary = useCallback(() => {
    if (isEnginePaused) return;
    if (status !== 'idle' && status !== 'success') return;

    const baseSpeed = 1000 / simulationSpeed;
    const depositAmount = salary;
    const savingsAmt = parseFloat(((depositAmount * rules.savings) / 100).toFixed(1));
    const billsAmt = parseFloat(((depositAmount * rules.bills) / 100).toFixed(1));
    const spendAmt = parseFloat((depositAmount - savingsAmt - billsAmt).toFixed(1));
    const txId = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;

    // Phase 1: DETECTION
    setCurrentPhase('DETECTION');
    setStatus('detecting');
    setRetryCount(0);
    addEvent({
      title: `Deposit Detected — ${depositAmount} FLOW`,
      description: 'Triggering verification for incoming on-chain funds. Monitoring Flow network state...',
      status: 'info',
      amount: `${depositAmount} FLOW`,
    });

    // Phase 2: VALIDATION
    setTimeout(() => {
      setCurrentPhase('VALIDATION');
      addEvent({
        title: 'Verifying Path Efficiency',
        description: 'Analyzing node health and congestion layers. Execution priority set to High.',
        status: 'processing',
      });
    }, baseSpeed * 2);

    // Phase 3: ALLOCATION (Initial Attempt)
    setTimeout(() => {
      setCurrentPhase('ALLOCATION');
      setStatus('splitting');
      addEvent({
        title: 'Initiating On-Chain Allocation',
        description: `Split Engine routing capital...`,
        status: 'processing',
        amount: `${depositAmount} FLOW`,
      });
    }, baseSpeed * 4.5);

    // Phase 4: Intentional Friction (RETRY_LOGIC)
    setTimeout(() => {
      setCurrentPhase('RETRY_LOGIC');
      setStatus('failed');
      addEvent({
        title: 'Execution Interrupted',
        description: 'Network congestion detected below threshold. Engaging Flow Retry engine.',
        status: 'error',
      });
    }, baseSpeed * 7);

    // Phase 5: RETRY 1
    setTimeout(() => {
      setStatus('retrying');
      setRetryCount(1);
      addEvent({
        title: 'Retry Engine Active (1/3)',
        description: 'Escalating to secondary Flow Access Node...',
        status: 'warning',
        retryCount: 1,
      });
    }, baseSpeed * 9);

    // Phase 6: RETRY 2 (Friction Depth)
    setTimeout(() => {
      setRetryCount(2);
      addEvent({
        title: 'Finalizing Path Stability (2/3)',
        description: 'Waiting for Flow block consensus. Verification layer active.',
        status: 'processing',
        retryCount: 2,
      });
    }, baseSpeed * 11);

    // Phase 7: FINALIZING
    setTimeout(() => {
      setCurrentPhase('FINALIZING');
      setStatus('success');
      setRetryCount(0);
      const now = new Date();
      setLastRun(formatTime(now));
      setLastAmount(`${depositAmount} FLOW`);
      setTotalAutomated(prev => prev + 1);
      setAutoSavedThisMonth(prev => parseFloat((prev + savingsAmt).toFixed(1)));
      setSuccessRate(prev => Math.round((prev * 0.95 + 100 * 0.05)));

      setVaults(prev => ({
        savings: parseFloat((prev.savings + savingsAmt).toFixed(1)),
        bills: parseFloat((prev.bills + billsAmt).toFixed(1)),
        spend: parseFloat((prev.spend + spendAmt).toFixed(1)),
        lastUpdate: 'Just now',
        lastActivity: `+${savingsAmt} FLOW via auto-split`
      }));

      addEvent({
        title: 'Autopilot Success',
        description: `Split completed via Flow Scheduled Transaction. On-chain execution verified.`,
        status: 'success',
        amount: `${depositAmount} FLOW`,
        txId,
        vault: 'All Vaults',
      });
      
      setTimeout(() => setCurrentPhase('IDLE'), 3000);
    }, baseSpeed * 14);
  }, [status, salary, rules, addEvent, isEnginePaused, simulationSpeed, retryDepth]);

  const setSimulationParams = useCallback((params: any) => {
    if (params.speed !== undefined) setSimulationSpeed(params.speed);
    if (params.depth !== undefined) setRetryDepth(params.depth);
    if (params.freq !== undefined) setExecutionFrequency(params.freq);
  }, []);

  const resetSimulation = useCallback(() => {
    setStatus('idle');
    setCurrentPhase('IDLE');
    setRetryCount(0);
    setTimeline([
      {
        id: 'init-1',
        timestamp: formatTime(new Date()),
        title: 'Autopilot Reset',
        description: 'Simulation state cleared. System idle.',
        status: 'info',
      }
    ]);
    setVaults({ 
      savings: 0, 
      bills: 0, 
      spend: 0,
      lastUpdate: 'Never',
      lastActivity: 'None'
    });
    setTotalAutomated(0);
    setAutoSavedThisMonth(0);
    setSuccessRate(100);
  }, []);

  const toggleEngine = useCallback(() => {
    setIsEnginePaused(prev => !prev);
  }, []);

  const setRules = useCallback((newRules: { savings: number; bills: number; spend: number }) => {
    setRulesState(newRules);
  }, []);

  const setSalary = useCallback((newSalary: number) => {
    setSalaryState(newSalary);
  }, []);

  return (
    <SimulationContext.Provider value={{
      status, currentPhase, isEnginePaused, lastRun, lastAmount, nextRun, retryCount, successRate,
      totalAutomated, autoSavedThisMonth, timeline, vaults, salary, rules,
      simulationSpeed, retryDepth, executionFrequency,
      simulateSalary, resetSimulation, toggleEngine, setRules, setSalary, setSimulationParams,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}
