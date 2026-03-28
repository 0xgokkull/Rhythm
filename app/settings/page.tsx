'use client';

import { motion } from 'framer-motion';
import { Settings, User, Bell, Shield, Wallet, Power, LogOut, ChevronRight, ToggleRight, ExternalLink } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function SettingsPage() {
  return (
    <PageTransition>
      <div className="max-w-md mx-auto space-y-8">
        <header className="space-y-2 px-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-[#888888]">Account and autopilot controls</p>
        </header>

        {/* Profile Card */}
        <div className="glass p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#00EF8B] to-[#FFD600] p-1">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Gokul Rhythm</h3>
            <p className="text-xs text-[#888888]">0x4d5f...3e92 • Flow Network</p>
          </div>
          <button className="p-2 glass rounded-xl group-hover:bg-white/5 transition-colors">
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        {/* Autopilot Master Switch */}
        <section className="glass p-6 bg-[#00EF8B11] border-[#00EF8B33]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00EF8B22] rounded-2xl">
                <Power className="w-5 h-5 text-[#00EF8B]" />
              </div>
              <div>
                <h3 className="font-bold">Autopilot Status</h3>
                <p className="text-xs text-[#888888]">Currently active & splitting</p>
              </div>
            </div>
            <div className="relative w-12 h-6 bg-[#00EF8B] rounded-full p-1 cursor-pointer">
              <motion.div 
                layout
                className="w-4 h-4 bg-black rounded-full shadow-sm ml-auto"
              />
            </div>
          </div>
        </section>

        {/* Settings Groups */}
        <div className="space-y-6">
          <SettingsGroup title="General">
            <SettingsItem icon={<User className="w-5 h-5" />} label="Account Info" />
            <SettingsItem icon={<Wallet className="w-5 h-5" />} label="Payout Rules" badge="CUSTOM" />
            <SettingsItem icon={<Bell className="w-5 h-5" />} label="Notifications" />
          </SettingsGroup>

          <SettingsGroup title="Security">
            <SettingsItem icon={<Shield className="w-5 h-5" />} label="Vault Protection" badge="ON" />
            <SettingsItem icon={<ToggleRight className="w-5 h-5" />} label="Biometric Access" />
          </SettingsGroup>

          <SettingsGroup title="Support">
            <SettingsItem icon={<LogOut className="w-5 h-5 text-[#FF4B4B]" />} label="Logout" color="#FF4B4B" />
          </SettingsGroup>
        </div>

        <p className="text-center text-[10px] text-[#333333] font-bold uppercase tracking-[0.2em] pt-4">
          Rhythm v1.0.4 • Build 82376
        </p>
      </div>
    </PageTransition>
  );
}

function SettingsGroup({ title, children }: any) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] text-[#555555] font-bold uppercase tracking-[0.2em] px-4">{title}</h4>
      <div className="space-y-0.5">
        {children}
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, badge, color }: any) {
  return (
    <div className="glass p-5 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer rounded-2xl overflow-hidden">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform" style={{ color: color || '#888888' }}>
          {icon}
        </div>
        <span className={`font-semibold text-sm ${color ? `text-[${color}]` : ''}`}>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {badge && (
          <span className="text-[10px] font-bold bg-[#00EF8B22] text-[#00EF8B] px-2 py-1 rounded-lg">
            {badge}
          </span>
        )}
        <ChevronRight className="w-4 h-4 text-[#333333] group-hover:text-[#888888] transition-colors" />
      </div>
    </div>
  );
}
