'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type SystemStatus = 'idle' | 'detecting' | 'splitting' | 'failed' | 'retrying' | 'success';

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
}

interface SimulationState {
  status: SystemStatus;
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
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [lastAmount, setLastAmount] = useState<string | null>(null);
  const [nextRun] = useState('Apr 1, 9:00 AM');
  const [retryCount, setRetryCount] = useState(0);
  const [successRate, setSuccessRate] = useState(100);
  const [totalAutomated, setTotalAutomated] = useState(3);
  const [autoSavedThisMonth, setAutoSavedThisMonth] = useState(150);
  const [salary, setSalaryState] = useState(500);
  const [rules, setRulesState] = useState({ savings: 30, bills: 40, spend: 30 });
  const [vaults, setVaults] = useState<VaultBalance>({ savings: 84.5, bills: 112.5, spend: 46.7 });
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
      description: '30% → Savings · 40% → Bills · 30% → Spend',
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
    if (status !== 'idle' && status !== 'success') return;

    const depositAmount = salary;
    const savingsAmt = parseFloat(((depositAmount * rules.savings) / 100).toFixed(1));
    const billsAmt = parseFloat(((depositAmount * rules.bills) / 100).toFixed(1));
    const spendAmt = parseFloat((depositAmount - savingsAmt - billsAmt).toFixed(1));

    // Phase 1: Detecting
    setStatus('detecting');
    setRetryCount(0);
    addEvent({
      title: `Deposit Detected — ${depositAmount} FLOW`,
      description: 'Incoming deposit identified on Flow network.',
      status: 'info',
      amount: `${depositAmount} FLOW`,
    });

    // Phase 2: Splitting
    setTimeout(() => {
      setStatus('splitting');
      addEvent({
        title: 'Initiating On-Chain Split',
        description: `Routing: ${rules.savings}% Savings · ${rules.bills}% Bills · ${rules.spend}% Spend`,
        status: 'processing',
        amount: `${depositAmount} FLOW`,
      });
    }, 1500);

    // Phase 3: Simulated Failure
    setTimeout(() => {
      setStatus('failed');
      addEvent({
        title: 'Transaction Failed — Node Timeout',
        description: 'Flow execution node returned timeout. Engaging retry engine.',
        status: 'error',
      });
    }, 3500);

    // Phase 4: Retry
    setTimeout(() => {
      setStatus('retrying');
      setRetryCount(1);
      addEvent({
        title: 'Retry Engine Triggered (Attempt 1/3)',
        description: 'Re-submitting transaction to backup access node.',
        status: 'warning',
        retryCount: 1,
      });
    }, 5000);

    // Phase 5: Success
    setTimeout(() => {
      setStatus('success');
      setRetryCount(0);
      setLastRun(formatTime(new Date()));
      setLastAmount(`${depositAmount} FLOW`);
      setTotalAutomated(prev => prev + 1);
      setAutoSavedThisMonth(prev => parseFloat((prev + savingsAmt).toFixed(1)));
      setSuccessRate(prev => Math.round((prev * 0.9 + 100 * 0.1)));

      setVaults(prev => ({
        savings: parseFloat((prev.savings + savingsAmt).toFixed(1)),
        bills: parseFloat((prev.bills + billsAmt).toFixed(1)),
        spend: parseFloat((prev.spend + spendAmt).toFixed(1)),
      }));

      addEvent({
        title: 'Split Completed Successfully',
        description: `${savingsAmt} FLOW → Savings · ${billsAmt} FLOW → Bills · ${spendAmt} FLOW → Spend`,
        status: 'success',
        amount: `${depositAmount} FLOW`,
        vault: 'All Vaults',
      });
    }, 7000);
  }, [status, salary, rules, addEvent]);

  const setRules = useCallback((newRules: { savings: number; bills: number; spend: number }) => {
    setRulesState(newRules);
  }, []);

  const setSalary = useCallback((newSalary: number) => {
    setSalaryState(newSalary);
  }, []);

  return (
    <SimulationContext.Provider value={{
      status, lastRun, lastAmount, nextRun, retryCount, successRate,
      totalAutomated, autoSavedThisMonth, timeline, vaults, salary, rules,
      simulateSalary, setRules, setSalary,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}
