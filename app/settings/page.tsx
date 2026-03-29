'use client';

import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Wallet, 
  LogOut, 
  ChevronRight, 
  ExternalLink,
  Globe,
  Lock,
  Zap,
  Power,
  Mail,
  Key,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useSimulation } from '@/context/SimulationContext';

export default function SettingsPage() {
  const sim = useSimulation();
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
        {/* Header */}
        <motion.header variants={itemVariants} className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">Settings</h1>
            <p className="text-xs text-slate-500 font-medium">Manage your account and autopilot preferences.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-red-500 bg-red-50 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-100 transition-all">
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </motion.header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* LEFT — Profile & Account (5 cols) */}
          <div className="xl:col-span-5 space-y-5">
            {/* Profile Card */}
            <motion.div variants={itemVariants} className="card-web p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Account</h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Gokul</h3>
                  <p className="text-xs text-slate-500 font-medium">gokul@rhythm.flow</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-[11px] text-primary font-black uppercase tracking-widest">Autopilot On</span>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value="gokul@rhythm.flow" />
                <InfoRow icon={<Globe className="w-3.5 h-3.5" />} label="Network" value="Flow Testnet" badge="Testnet" />
                <InfoRow icon={<Key className="w-3.5 h-3.5" />} label="Account ID" value="0x4d5f...3e92" mono />
              </div>
            </motion.div>

            {/* Wallet */}
            <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Wallet className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Flow Wallet</h4>
                  <p className="text-[12px] text-slate-500 font-bold font-mono">0x4d5f...3e92 · Auto-created</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
            </motion.div>

            {/* Help & Support */}
            <motion.div variants={itemVariants} className="card-web p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Support</h3>
              <div className="space-y-1">
                <HelpRow icon={<HelpCircle className="w-4 h-4" />} label="Help Center" desc="Guides and FAQs" />
                <HelpRow icon={<Mail className="w-4 h-4" />} label="Contact Us" desc="support@rhythm.flow" />
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Preferences (7 cols) */}
          <div className="xl:col-span-7 space-y-5">
            {/* Preferences list */}
            <motion.div variants={itemVariants} className="card-web overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preferences</h3>
              </div>
              <div className="divide-y divide-slate-50">
                <SettingsRow icon={<Bell className="w-4 h-4" />} label="Notifications" desc="Split alerts and retry confirmations" />
                <SettingsRow icon={<Shield className="w-4 h-4" />} label="Security" desc="Password, recovery, 2FA" />
                <SettingsRow icon={<Lock className="w-4 h-4" />} label="Privacy" desc="Data visibility and export" />
              </div>
            </motion.div>

            {/* Autopilot Governance */}
            <motion.div variants={itemVariants} className="card-web overflow-hidden border-primary/20 bg-primary/[0.02]">
              <div className="px-6 py-4 border-b border-primary/10 flex items-center justify-between">
                <h3 className="text-xs font-black text-primary uppercase tracking-widest">Autopilot Governance</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${sim.isEnginePaused ? 'bg-slate-300' : 'bg-primary animate-pulse'}`} />
                  <span className="text-[12px] text-slate-500 font-black uppercase tracking-widest">
                    {sim.isEnginePaused ? 'Engine Paused' : 'Engine Active'}
                  </span>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-black text-slate-900 tracking-tight">Active Monitoring</h5>
                    <p className="text-[12px] text-slate-500 font-medium">Pause the engine to stop automatic deposits splits.</p>
                  </div>
                  <button 
                    onClick={sim.toggleEngine}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${sim.isEnginePaused ? 'bg-slate-200' : 'bg-primary'}`}
                  >
                    <motion.div 
                      animate={{ x: sim.isEnginePaused ? 2 : 26 }}
                      className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    <h5 className="text-base font-black text-slate-900 tracking-tight">Simulation Persistence</h5>
                    <p className="text-[12px] text-slate-500 font-medium">Clear all simulation history and reset vault balances.</p>
                  </div>
                  <button 
                    onClick={sim.resetSimulation}
                    className="px-4 py-2 border border-amber-200 text-amber-700 bg-amber-50 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Engine
                  </button>
                </div>

                <div className="p-4 bg-white/50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Retry Depth Configuration</span>
                    <span className="text-[11px] text-primary font-black uppercase tracking-widest">L3 Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-primary' : 'bg-slate-100'}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold italic text-center">Engine automatically attempts recovery up to 3 node layers deep.</p>
                </div>
              </div>
            </motion.div>

            {/* Danger zone */}
            <motion.div variants={itemVariants} className="card-web overflow-hidden border-red-100">
              <div className="px-6 py-4 border-b border-red-50">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest">Danger Zone</h3>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">Delete Account</p>
                  <p className="text-[10px] text-slate-500 font-medium">Permanently remove your account and all vaults</p>
                </div>
                <button className="px-4 py-2 text-red-500 bg-red-50 border border-red-100 rounded-lg font-bold text-sm hover:bg-red-100 transition-all">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 py-3">
          <Zap className="w-3 h-3 text-primary fill-current" />
          <span className="text-[12px] text-slate-400 font-black uppercase tracking-widest">
            Rhythm v1.0 · Powered by Flow
          </span>
        </motion.div>
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

function HelpRow({ icon, label, desc }: any) {
  return (
    <div className="flex items-center justify-between py-3 px-1 hover:bg-slate-50 rounded-lg transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all">{icon}</div>
        <div>
          <p className="text-base font-black text-slate-900 group-hover:text-primary transition-colors">{label}</p>
          <p className="text-[12px] text-slate-500 font-medium">{desc}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
    </div>
  );
}

function SettingsRow({ icon, label, desc, badge, badgeColor }: any) {
  return (
    <div className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-all border border-slate-100">
          {icon}
        </div>
        <div>
          <h5 className="text-base font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{label}</h5>
          <p className="text-[12px] text-slate-500 font-medium">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className={`px-2.5 py-1 text-[11px] font-black rounded-md uppercase tracking-widest border ${badgeColor || 'text-amber-700 bg-amber-50 border-amber-200'}`}>
            {badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
