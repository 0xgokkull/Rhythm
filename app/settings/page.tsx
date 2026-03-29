'use client';

import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Wallet, 
  Power, 
  LogOut, 
  ChevronRight, 
  ToggleRight, 
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Globe,
  Lock,
  Zap
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function SettingsPage() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <PageTransition>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        <header className="flex items-center justify-between pb-8 border-b border-slate-50">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">System Configuration</h1>
            <p className="text-lg text-slate-500 font-medium tracking-tight">Manage your institutional protocol configurations and asset security.</p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-[28px] text-slate-900 font-black text-sm hover:shadow-xl hover:bg-slate-50 transition-all duration-300">
            <LogOut className="w-5 h-5 text-rose-500" />
            Terminate Protocol
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Profile & Status (4 cols) */}
          <motion.div variants={itemVariants} className="xl:col-span-4 space-y-10">
            <div className="card-web p-12 flex flex-col items-center text-center relative overflow-hidden group/profile">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:h-40 transition-all duration-700" />
              <div className="relative z-10 w-32 h-32 rounded-[40px] bg-white shadow-2xl shadow-slate-200 p-[2px] mb-8 mt-12 group-hover:scale-110 transition-transform duration-700">
                <div className="w-full h-full rounded-[38px] bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100">
                  <User className="w-16 h-16 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Gokul Rhythm</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-10 opacity-60">Verified Institutional Entity</p>
              
              <div className="w-full p-8 bg-slate-50 rounded-[40px] border border-slate-50 flex items-center justify-between mb-8 group cursor-pointer hover:bg-white hover:border-primary/20 transition-all duration-500 hover:shadow-xl">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2 leading-none">Flow Ledger ID</p>
                  <p className="text-sm font-black text-slate-900 font-mono tracking-tight">0x4d5f...3e92</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </div>

              <div className="w-full p-10 bg-slate-900 rounded-[48px] shadow-3xl shadow-slate-900/40 flex items-center justify-between group cursor-pointer overflow-hidden relative border border-white/5 active:scale-95 transition-all">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" 
                />
                <div className="flex items-center gap-6 relative z-10">
                  <div className="p-4 bg-white/5 backdrop-blur-md rounded-[24px] border border-white/10 text-primary shadow-2xl">
                    <Power className="w-8 h-8 fill-current stroke-[1.5]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] mb-1 leading-none">Protocol State</p>
                    <p className="text-2xl font-black text-white tracking-tighter">AUTOPILOT</p>
                  </div>
                </div>
                <div className="w-16 h-8 bg-white/5 rounded-full p-1.5 relative z-10 border border-white/5">
                  <motion.div layout className="w-5 h-5 bg-primary rounded-full shadow-glow ml-auto" />
                </div>
              </div>
            </div>

            <div className="card-web p-10 flex items-center gap-8 group hover:border-primary/20 transition-all duration-500 cursor-pointer hover:shadow-xl">
              <div className="p-5 bg-emerald-50 text-emerald-500 rounded-[28px] border border-emerald-100 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg tracking-tight leading-none mb-1.5">Security Audit</h4>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Verified • 18m ago</p>
              </div>
              <ChevronRight className="w-6 h-6 ml-auto text-slate-200 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>

          {/* Right Column: Detailed Settings (8 cols) */}
          <motion.div variants={itemVariants} className="xl:col-span-8 space-y-10">
            <div className="card-web overflow-hidden border-none shadow-web-xl bg-white/40 backdrop-blur-xl">
              <div className="p-10 border-b border-slate-50 relative bg-white">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">System Preferences</h3>
                <div className="absolute bottom-0 left-10 right-10 h-[2px] bg-primary/20" />
              </div>
              
              <div className="p-6 space-y-6">
                <SettingsSection title="Identity & Asset Governance">
                  <SettingsRow icon={<User className="w-6 h-6" />} label="Entity Information" desc="Review institutional identity and verified KYC vectors." />
                  <SettingsRow icon={<Wallet className="w-6 h-6" />} label="Protocol Targets" desc="Whitelist secondary EOA and contract targets for outflows." badge="3 Targets" />
                  <SettingsRow icon={<Shield className="w-6 h-6" />} label="Guardians" desc="Configure institutional multi-sig and key recovery paths." />
                </SettingsSection>

                <SettingsSection title="Protocol Infrastructure">
                  <SettingsRow icon={<Globe className="w-6 h-6" />} label="Network Nodes" desc="Select high-availability Flow network entry points." badge="Testnet" />
                  <SettingsRow icon={<Bell className="w-6 h-6" />} label="Alert Engine" desc="Configure real-time webhooks and critical push vectors." />
                  <SettingsRow icon={<Lock className="w-6 h-6" />} label="Privacy Layers" desc="Manage zero-knowledge protocol visibility settings." />
                </SettingsSection>

                <SettingsSection title="Terminal Environment">
                  <SettingsRow icon={<Smartphone className="w-6 h-6" />} label="Entity Instances" desc="Review authorized hardware sessions and node access." badge="2 Nodes" />
                  <SettingsRow icon={<ToggleRight className="w-6 h-6" />} label="Interface Engine" desc="Switch between standard, obsidian, and high-precision modes." badge="Lumina" />
                </SettingsSection>
              </div>
            </div>

            <div className="flex items-center justify-between px-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <span>Next.js 16.2.1 • Rhythm Protocol v1.0.4</span>
              <span className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary fill-current" />
                Alpha Optimized Build
              </span>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </PageTransition>
  );
}

function SettingsSection({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] px-6 pt-6">{title}</h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, desc, badge }: any) {
  return (
    <div className="flex items-center justify-between p-8 bg-white hover:bg-slate-50/50 rounded-[40px] transition-all duration-500 border border-slate-50 hover:border-primary/10 group cursor-pointer shadow-sm hover:shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-8 pl-2">
        <div className="p-5 bg-slate-50 rounded-[28px] text-slate-400 group-hover:text-primary group-hover:bg-white group-hover:scale-110 transition-all duration-500 shadow-sm border border-slate-100/50">
          {icon}
        </div>
        <div>
          <h5 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors duration-500">{label}</h5>
          <p className="text-sm text-slate-500 font-medium tracking-tight mt-1 leading-none">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-8 pr-2">
        {badge && (
          <span className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl">
            {badge}
          </span>
        )}
        <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-primary group-hover:translate-x-2 transition-all duration-500" />
      </div>
    </div>
  );
}
