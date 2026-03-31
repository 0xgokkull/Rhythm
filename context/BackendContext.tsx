'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface TimelineEvent {
  tx_hash: string;
  execution_id: string;
  user_address: string;
  amount: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
  retry_count: number;
  error_message: string;
  stage: string;
  timestamp: number;
}

export interface VaultBalances {
  savings: string;
  bills: string;
  spend: string;
  total: string;
  updatedAt: number;
}

export interface SystemStatus {
  total_executions: number;
  success: number;
  failed: number;
  pending: number;
  failure_rate: string;
  avg_retry_count: number;
  relayer_active: boolean;
}

interface BackendState {
  vaults: VaultBalances | null;
  rules: { savings: number; bills: number; spend: number } | null;
  timeline: TimelineEvent[];
  systemStatus: SystemStatus | null;
  salary: number;
  isEnginePaused: boolean;
  isLoading: boolean;
  setSalary: (s: number) => void;
  toggleEngine: () => void;
  triggerExecution: (amount: number) => Promise<void>;
  updateRules: (savings: number, bills: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const BackendContext = createContext<BackendState | null>(null);

export function useBackend() {
  const ctx = useContext(BackendContext);
  if (!ctx) throw new Error('useBackend must be used within BackendProvider');
  return ctx;
}

const API_URL = 'http://localhost:4000';
const USER_ADDRESS = '0x6B015Df62da64A12dF2e13d2fFAb9BFd99a838a2';

export function BackendProvider({ children }: { children: ReactNode }) {
  const [vaults, setVaults] = useState<VaultBalances | null>(null);
  const [rules, setRules] = useState<{ savings: number; bills: number; spend: number } | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  
  const [salary, setSalary] = useState(500);
  const [isEnginePaused, setIsEnginePaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVaults = async () => {
    try {
      const res = await fetch(`${API_URL}/vault/${USER_ADDRESS}`);
      if (res.ok) setVaults(await res.json());
    } catch (e) {}
  };

  const fetchRules = async () => {
    try {
      const res = await fetch(`${API_URL}/rule/${USER_ADDRESS}`);
      if (res.ok) setRules(await res.json());
    } catch (e) {}
  };

  const fetchTimeline = async () => {
    try {
      const res = await fetch(`${API_URL}/activity/${USER_ADDRESS}`);
      if (res.ok) setTimeline(await res.json());
    } catch (e) {}
  };

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/system/status`);
      if (res.ok) setSystemStatus(await res.json());
    } catch (e) {}
  };

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchVaults(), fetchRules(), fetchTimeline(), fetchSystemStatus()]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const toggleEngine = () => setIsEnginePaused(p => !p);

  const triggerExecution = async (amount: number) => {
    if (isEnginePaused) return;
    try {
      await fetch(`${API_URL}/execution/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: USER_ADDRESS, amount })
      });
      setTimeout(refreshData, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  const updateRules = async (savings: number, bills: number) => {
    try {
      await fetch(`${API_URL}/rule/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savings, bills })
      });
      setTimeout(refreshData, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BackendContext.Provider value={{
      vaults, rules, timeline, systemStatus, salary, isEnginePaused, isLoading,
      setSalary, toggleEngine, triggerExecution, updateRules, refreshData
    }}>
      {children}
    </BackendContext.Provider>
  );
}
