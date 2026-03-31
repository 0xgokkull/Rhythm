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
  userAddress: string | null;
  isConnecting: boolean;
  setSalary: (s: number) => void;
  toggleEngine: () => void;
  triggerExecution: (amount: number) => Promise<void>;
  updateRules: (savings: number, bills: number) => Promise<void>;
  refreshData: () => Promise<void>;
  connectWallet: () => Promise<boolean>;
}

const BackendContext = createContext<BackendState | null>(null);

export function useBackend() {
  const ctx = useContext(BackendContext);
  if (!ctx) throw new Error('useBackend must be used within BackendProvider');
  return ctx;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://rhythm-zbcx.onrender.com';

const FLOW_TESTNET_CONFIG = {
  chainId: '0x221',
  chainName: 'Flow EVM Testnet',
  nativeCurrency: { name: 'FLOW', symbol: 'FLOW', decimals: 18 },
  rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
  blockExplorerUrls: ['https://evm-testnet.flowscan.io']
};

export function BackendProvider({ children }: { children: ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const [vaults, setVaults] = useState<VaultBalances | null>(null);
  const [rules, setRules] = useState<{ savings: number; bills: number; spend: number } | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  
  const [salary, setSalary] = useState(500);
  const [isEnginePaused, setIsEnginePaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) setUserAddress(accounts[0]);
        } catch(e) {}
      }
    };
    autoConnect();
  }, []);

  const connectWallet = async (): Promise<boolean> => {
    try {
      setIsConnecting(true);
      if (!(window as any).ethereum) throw new Error("No crypto wallet found");
      const provider = (window as any).ethereum;
      
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setUserAddress(accounts[0]);
      }

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: FLOW_TESTNET_CONFIG.chainId }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [FLOW_TESTNET_CONFIG],
          });
        } else {
          throw switchError;
        }
      }
      return true;
    } catch (e) {
      console.error("Wallet connection failed:", e);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const fetchVaults = useCallback(async () => {
    if (!userAddress) return;
    try {
      const res = await fetch(`${API_URL}/vault/${userAddress}`);
      if (res.ok) setVaults(await res.json());
      else console.warn('Vault fetch failed:', await res.text());
    } catch (e) {
      console.error('Network Error (Vault):', e);
    }
  }, [userAddress]);

  const fetchRules = useCallback(async () => {
    if (!userAddress) return;
    try {
      const res = await fetch(`${API_URL}/rule/${userAddress}`);
      if (res.ok) setRules(await res.json());
      else console.warn('Rule fetch failed:', await res.text());
    } catch (e) {
      console.error('Network Error (Rules):', e);
    }
  }, [userAddress]);

  const fetchTimeline = useCallback(async () => {
    if (!userAddress) return;
    try {
      const res = await fetch(`${API_URL}/activity/${userAddress}`);
      if (res.ok) setTimeline(await res.json());
      else console.warn('Activity fetch failed:', await res.text());
    } catch (e) {
      console.error('Network Error (Activity):', e);
    }
  }, [userAddress]);

  const fetchSystemStatus = useCallback(async () => {
    if (!userAddress) return;
    try {
      const res = await fetch(`${API_URL}/system/status/${userAddress}`);
      if (res.ok) setSystemStatus(await res.json());
      else console.warn('SystemStatus fetch failed:', await res.text());
    } catch (e) {
      console.error('Network Error (SystemStatus):', e);
    }
  }, [userAddress]);

  const refreshData = useCallback(async () => {
    if (!userAddress) return;
    setIsLoading(true);
    await Promise.all([fetchVaults(), fetchRules(), fetchTimeline(), fetchSystemStatus()]);
    setIsLoading(false);
  }, [userAddress, fetchVaults, fetchRules, fetchTimeline, fetchSystemStatus]);

  useEffect(() => {
    if (userAddress) {
      refreshData();
      const interval = setInterval(refreshData, 5000);
      return () => clearInterval(interval);
    }
  }, [refreshData, userAddress]);

  const toggleEngine = () => setIsEnginePaused(p => !p);

  const triggerExecution = async (amount: number) => {
    if (isEnginePaused || !userAddress) return;
    try {
      const res = await fetch(`${API_URL}/execution/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userAddress, amount })
      });
      if (!res.ok) console.error('Execution Trigger Failed:', await res.text());
      setTimeout(refreshData, 1000);
    } catch (e) {
      console.error('Network Error (Execution):', e);
    }
  };

  const updateRules = async (savings: number, bills: number) => {
    if (!userAddress) return;
    try {
      const res = await fetch(`${API_URL}/rule/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savings, bills, user: userAddress })
      });
      if (!res.ok) console.error('Rule Update Failed:', await res.text());
      setTimeout(refreshData, 1000);
    } catch (e) {
      console.error('Network Error (RuleUpdate):', e);
    }
  };

  return (
    <BackendContext.Provider value={{
      vaults, rules, timeline, systemStatus, salary, isEnginePaused, isLoading, userAddress, isConnecting,
      setSalary, toggleEngine, triggerExecution, updateRules, refreshData, connectWallet
    }}>
      {children}
    </BackendContext.Provider>
  );
}
