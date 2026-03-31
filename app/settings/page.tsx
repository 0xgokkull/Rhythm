'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  Wallet, 
  LogOut, 
  Globe,
  Zap,
  Power,
  Mail,
  Key,
  Save,
  Loader2
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useBackend } from '@/context/BackendContext';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const backend = useBackend();
  const { rules, updateRules, isEnginePaused, toggleEngine, userAddress } = backend;

  const [savings, setSavings] = useState(0);
  const [bills, setBills] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (rules) {
      setSavings(rules.savings);
      setBills(rules.bills);
    }
  }, [rules]);

  const spend = 100 - savings - bills;
  const isValid = savings + bills <= 100 && savings >= 0 && bills >= 0;

  const handleSave = async () => {
    if (!isValid) return;
    setIsSaving(true);
    await updateRules(savings, bills);
    setIsSaving(false);
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <PageTransition>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <motion.header variants={itemVariants} className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">Settings</h1>
            <p className="text-xs text-slate-500 font-medium">Manage your smart contract rules and system preferences.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-red-500 bg-red-50 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </motion.header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          <div className="xl:col-span-5 space-y-5">
            <motion.div variants={itemVariants} className="card-web p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Account</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Main User</h3>
                  <p className="text-xs text-slate-500 font-medium">Testnet Account</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-[11px] text-primary font-black uppercase tracking-widest">Active</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <InfoRow icon={<Globe className="w-3.5 h-3.5" />} label="Network" value="Flow Testnet" badge="EVM" />
                <InfoRow icon={<Key className="w-3.5 h-3.5" />} label="Account ID" value={userAddress ? `${userAddress.slice(0, 7)}...${userAddress.slice(-5)}` : 'Disconnected'} mono />
                <InfoRow icon={<Wallet className="w-3.5 h-3.5" />} label="Wallet Type" value="Relayer Proxy" />
              </div>
            </motion.div>
          </div>

          <div className="xl:col-span-7 space-y-5">
            <motion.div variants={itemVariants} className="card-web overflow-hidden border-primary/20">
              <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between bg-primary/[0.02]">
                <h3 className="text-xs font-black text-primary uppercase tracking-widest">On-Chain Rule Configuration</h3>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Stored on Flow</span>
                </div>
              </div>
              
              <div className="p-6 space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Savings Vault Allocation</span>
                    <span className="text-sm font-black text-primary">{savings}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={savings} 
                    onChange={e => setSavings(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-slate-700">Bills Vault Allocation</span>
                    <span className="text-sm font-black text-emerald-600">{bills}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" value={bills} 
                    onChange={e => setBills(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-500">Spend Allocation (Remaining)</span>
                    <span className={`text-sm font-black ${spend < 0 ? 'text-red-500' : 'text-slate-700'}`}>{spend}%</span>
                  </div>
                  {spend < 0 && (
                    <p className="text-[11px] text-red-500 font-bold mt-2">Total allocation cannot exceed 100%.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={!isValid || isSaving || (rules?.savings === savings && rules?.bills === bills)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? 'Broadcasting Tx...' : 'Update Smart Contract'}
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card-web overflow-hidden">
              <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Autopilot Governance</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isEnginePaused ? 'bg-slate-300' : 'bg-primary animate-pulse'}`} />
                  <span className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                    {isEnginePaused ? 'Engine Paused' : 'Engine Active'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-black text-slate-900 tracking-tight">Active Monitoring</h5>
                    <p className="text-[12px] text-slate-500 font-medium">Pause the engine to suspend splits via the relayer layer.</p>
                  </div>
                  <button 
                    onClick={toggleEngine}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isEnginePaused ? 'bg-slate-200' : 'bg-primary'}`}
                  >
                    <motion.div 
                      animate={{ x: isEnginePaused ? 2 : 26 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
}

function InfoRow({ icon, label, value, badge, mono }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2.5 text-slate-400">
        {icon}
        <span className="text-xs text-slate-500 font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold text-slate-900 ${mono ? 'font-mono' : ''}`}>{value}</span>
        {badge && (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-black rounded border border-amber-200 uppercase tracking-widest">{badge}</span>
        )}
      </div>
    </div>
  );
}
