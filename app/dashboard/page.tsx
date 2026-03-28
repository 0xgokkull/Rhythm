'use client';

import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, Zap, ArrowUpRight, ArrowDownLeft, MoreHorizontal, Info } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="max-w-md mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative rounded-full overflow-hidden border border-[#00EF8B33]">
              <Image src="/logo.png" alt="Rhythm" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs text-[#888888]">Good morning,</p>
              <h2 className="font-bold">Gokul</h2>
            </div>
          </div>
          <button className="glass p-2 rounded-full">
            <ShieldCheck className="w-5 h-5 text-[#00EF8B]" />
          </button>
        </header>

        {/* Today's Flow Card */}
        <section className="relative glass bg-gradient-to-br from-[#121212] to-black p-8 overflow-hidden group">
          <motion.div 
            className="absolute -right-20 -top-20 w-64 h-64 bg-[#00EF8B] opacity-5 blur-[100px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[#00EF8B]" fill="#00EF8B" />
              <p className="text-sm font-medium text-[#00EF8B] uppercase tracking-widest">Today's Flow</p>
            </div>
            <h1 className="text-5xl font-bold mb-6 tracking-tight">₹ 14,230</h1>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#00EF8B22] rounded-lg">
                  <ArrowDownLeft className="w-4 h-4 text-[#00EF8B]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#888888] uppercase">Inflow</p>
                  <p className="text-sm font-bold">₹ 50,000</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/5 rounded-lg">
                  <ArrowUpRight className="w-4 h-4 text-[#888888]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#888888] uppercase">Outflow</p>
                  <p className="text-sm font-bold text-[#888888]">₹ 35,770</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vaults Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold">Your Vaults</h3>
            <button className="text-[#00EF8B] text-sm font-medium">View all</button>
          </div>
          
          <div className="space-y-3">
            <VaultCard 
              name="Rainy Day (Savings)" 
              balance="₹ 45,000" 
              progress={45} 
              target="₹ 1,00,000"
              color="#00EF8B"
            />
            <VaultCard 
              name="Monthly Bills" 
              balance="₹ 12,500" 
              progress={80} 
              target="₹ 15,625"
              color="#FFD600"
            />
          </div>
        </section>

        {/* Next Autopilot Info */}
        <section className="glass p-5 border-dashed flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl">
            <Info className="w-5 h-5 text-[#888888]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Next Auto-Split</p>
            <p className="text-xs text-[#888888]">April 1st, 2026 • 09:00 AM</p>
          </div>
          <button className="text-xs font-bold text-[#00EF8B] bg-[#00EF8B11] px-3 py-2 rounded-xl">
            MANAGE
          </button>
        </section>

        {/* Activity Summary */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold">Recent History</h3>
            <MoreHorizontal className="w-5 h-5 text-[#888888]" />
          </div>
          <div className="space-y-1">
            <ActivityItem 
              title="Salary Deposit" 
              date="Mar 01" 
              amount="+₹ 50,000" 
              status="SUCCESS"
            />
            <ActivityItem 
              title="Auto-Split (Savings)" 
              date="Mar 01" 
              amount="-₹ 15,000" 
              status="SUCCESS"
            />
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function VaultCard({ name, balance, progress, target, color }: any) {
  return (
    <div className="glass p-5 group hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}11` }}>
            <Wallet className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <p className="font-bold">{name}</p>
            <p className="text-xs text-[#888888]">Target: {target}</p>
          </div>
        </div>
        <p className="font-bold">{balance}</p>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ActivityItem({ title, date, amount, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-1.5 bg-[#00EF8B] rounded-full" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-[10px] text-[#888888] font-medium tracking-wider uppercase">{date} • {status}</p>
        </div>
      </div>
      <p className={`text-sm font-bold ${amount.startsWith('+') ? 'text-[#00EF8B]' : 'text-white'}`}>
        {amount}
      </p>
    </div>
  );
}
