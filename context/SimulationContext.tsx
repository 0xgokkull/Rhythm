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
  simulateSalary: () => void;
  resetSimulation: () => void;
  toggleEngine: () => void;
  setRules: (rules: { savings: number; bills: number; spend: number }) => void;
  setSalary: (salary: number) => void;
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
    },
  ]);

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

    const depositAmount = salary;
    const savingsAmt = parseFloat(((depositAmount * rules.savings) / 100).toFixed(1));
    const billsAmt = parseFloat(((depositAmount * rules.bills) / 100).toFixed(1));
    const spendAmt = parseFloat((depositAmount - savingsAmt - billsAmt).toFixed(1));

    // Phase 1: DETECTION
    setCurrentPhase('DETECTION');
    setStatus('detecting');
    setRetryCount(0);
    addEvent({
      title: `Deposit Detected — ${depositAmount} FLOW`,
      description: 'Triggering verification for incoming on-chain funds.',
      status: 'info',
      amount: `${depositAmount} FLOW`,
    });

    // Phase 2: VALIDATION
    setTimeout(() => {
      setCurrentPhase('VALIDATION');
      addEvent({
        title: 'Validating Flow Network State',
        description: 'Checking node availability and consensus health.',
        status: 'processing',
      });
    }, 2000);

    // Phase 3: ALLOCATION
    setTimeout(() => {
      setCurrentPhase('ALLOCATION');
      setStatus('splitting');
      addEvent({
        title: 'Initiating On-Chain Allocation',
        description: `Routing: ${rules.savings}% Savings · ${rules.bills}% Bills · ${rules.spend}% Spend`,
        status: 'processing',
        amount: `${depositAmount} FLOW`,
      });
    }, 4500);

    // Phase 4: Simulated Failure/RETRY_LOGIC
    setTimeout(() => {
      setCurrentPhase('RETRY_LOGIC');
      setStatus('failed');
      addEvent({
        title: 'Node Timeout Detected',
        description: 'Execution delayed by network congestion. Engaging retry layer.',
        status: 'error',
      });
    }, 7000);

    // Phase 5: RETRY
    setTimeout(() => {
      setStatus('retrying');
      setRetryCount(1);
      addEvent({
        title: 'Retry Engine Active (Try 1/3)',
        description: 'Re-routing execution to high-priority Flow access node.',
        status: 'warning',
        retryCount: 1,
      });
    }, 9000);

    // Phase 6: FINALIZING
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
        description: `Split completed via Flow Scheduled Transaction. ${savingsAmt} FLOW → Savings · ${billsAmt} FLOW → Bills.`,
        status: 'success',
        amount: `${depositAmount} FLOW`,
        vault: 'All Vaults',
      });
      
      // Reset phase after some time
      setTimeout(() => setCurrentPhase('IDLE'), 3000);
    }, 12000);
  }, [status, salary, rules, addEvent, isEnginePaused]);

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
      simulateSalary, resetSimulation, toggleEngine, setRules, setSalary,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}
