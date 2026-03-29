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
  return (
    <PageTransition>
      <div className="space-y-10">
        <header className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Settings</h1>
            <p className="text-slate-500 font-medium">Manage your protocol configurations and security.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all">
            <LogOut className="w-4 h-4 text-rose-500" />
            Terminate Session
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Profile & Status (4 cols) */}
          <div className="xl:col-span-4 space-y-8">
            <div className="card-web p-10 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-secondary/20" />
              <div className="relative z-10 w-24 h-24 rounded-3xl bg-white shadow-xl shadow-slate-200 p-[2px] mb-6 mt-8">
                <div className="w-full h-full rounded-[22px] bg-slate-50 flex items-center justify-center overflow-hidden">
                  <User className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Gokul Rhythm</h3>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1 mb-6">Standard Entity • Flow Ecosystem</p>
              
              <div className="w-full p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between mb-8 group cursor-pointer hover:border-primary/20 transition-all">
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">On-Chain ID</p>
                  <p className="text-xs font-bold text-slate-900 font-mono">0x4d5f...3e92</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>

              <div className="w-full p-8 bg-primary rounded-[32px] shadow-2xl shadow-primary/30 flex items-center justify-between group cursor-pointer overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-white/20 rounded-2xl text-white">
                    <Power className="w-6 h-6 fill-current" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-white/60 font-black uppercase tracking-widest">Protocol Status</p>
                    <p className="text-xl font-bold text-white">AUTOPILOT ON</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-white/20 rounded-full p-1 relative z-10">
                  <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-lg ml-auto" />
                </div>
              </div>
            </div>

            <div className="card-web p-8 flex items-center gap-6 group hover:border-primary/20 transition-all cursor-pointer">
              <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Security Audit</h4>
                <p className="text-xs text-slate-500 font-medium leading-tight">Last verified 18 minutes ago</p>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </div>

          {/* Right Column: Detailed Settings (8 cols) */}
          <div className="xl:col-span-8 space-y-8">
            <div className="card-web overflow-hidden border-none shadow-web-xl">
              <div className="p-8 border-b border-slate-50 bg-white">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">System Preferences</h3>
              </div>
              
              <div className="p-4 space-y-4 bg-slate-50/30">
                <SettingsSection title="Identity & Assets">
                  <SettingsRow icon={<User />} label="Personal Information" desc="Manage your legal identity and KYC status." />
                  <SettingsRow icon={<Wallet />} label="Withdrawal Addresses" desc="Whitelist external EOA and contract targets." badge="3 Targets" />
                  <SettingsRow icon={<Shield />} label="Protocol Guardians" desc="Configure multi-sig and recovery paths." />
                </SettingsSection>

                <SettingsSection title="Infrastructure">
                  <SettingsRow icon={<Globe />} label="Network Nodes" desc="Select your preferred Flow network endpoints." badge="Testnet" />
                  <SettingsRow icon={<Bell />} label="Notification Engine" desc="Configure webhooks and push alerts." />
                  <SettingsRow icon={<Lock />} label="Privacy Protocols" desc="Manage zero-knowledge proof settings." />
                </SettingsSection>

                <SettingsSection title="Device & Apps">
                  <SettingsRow icon={<Smartphone />} label="Connected Devices" desc="Review active sessions and authorized hardware." badge="2 Live" />
                  <SettingsRow icon={<ToggleRight />} label="Interface Theme" desc="Switch between standard, dark, and high-contrast." badge="Bright" />
                </SettingsSection>
              </div>
            </div>

            <div className="flex items-center justify-between px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Next.js 16.2.1 • Rhythm v1.0.4</span>
              <span className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary fill-current" />
                Optimized Build
              </span>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

function SettingsSection({ title, children }: any) {
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-4 pt-4">{title}</h4>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, desc, badge }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-white hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100 group cursor-pointer shadow-sm">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all">
          {icon}
        </div>
        <div>
          <h5 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{label}</h5>
          <p className="text-xs text-slate-400 font-medium leading-tight mt-1">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 pl-8">
        {badge && (
          <span className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">
            {badge}
          </span>
        )}
        <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-colors" />
      </div>
    </div>
  );
}
