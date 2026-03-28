'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, History, PieChart } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState('savings');

  return (
    <PageTransition>
      <div className="max-w-md mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">Vaults</h1>
          <p className="text-[#888888]">Non-custodial asset management</p>
        </header>

        {/* Tab Selector */}
        <div className="flex p-1 glass-pill bg-white/5">
          <button 
            onClick={() => setActiveTab('savings')}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'savings' ? 'bg-[#00EF8B] text-black' : 'text-[#888888]'}`}
          >
            SAVINGS
          </button>
          <button 
            onClick={() => setActiveTab('bills')}
            className={`flex-1 py-3 rounded-full text-sm font-bold transition-all ${activeTab === 'bills' ? 'bg-[#FFD600] text-black' : 'text-[#888888]'}`}
          >
            BILLS
          </button>
        </div>

        {/* Balance Display */}
        <div className="glass p-10 text-center relative overflow-hidden">
          <motion.div 
            layoutId="tab-glow"
            className={`absolute inset-0 opacity-10 blur-[80px] ${activeTab === 'savings' ? 'bg-[#00EF8B]' : 'bg-[#FFD600]'}`}
          />
          <p className="text-[#888888] text-sm uppercase tracking-widest mb-2 relative z-10">Total Balance</p>
          <h2 className="text-5xl font-bold tracking-tight mb-8 relative z-10 transition-all">
            {activeTab === 'savings' ? '₹ 45,000' : '₹ 12,500'}
          </h2>
          
          <div className="flex items-center justify-center gap-4 relative z-10">
            <button className="flex-1 bg-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
              <Plus className="w-5 h-5" /> Deposit
            </button>
            <button className="flex-1 bg-white/10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
              <ArrowUpRight className="w-5 h-5" /> Withdraw
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<PieChart className="w-4 h-4" />} label="Avg. Monthly" value="₹ 15,000" />
          <StatCard icon={<History className="w-4 h-4" />} label="Last Activity" value="2 days ago" />
        </div>

        {/* Transactions List */}
        <div className="space-y-4 pt-4">
          <h3 className="font-bold">Vault Transactions</h3>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-5 flex items-center justify-between group hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <ArrowDownLeft className="w-5 h-5 text-[#00EF8B]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Auto-Split Deposit</p>
                    <p className="text-[10px] text-[#888888] uppercase">Mar 01, 2026</p>
                  </div>
                </div>
                <p className="font-bold text-[#00EF8B]">+₹ 15,000</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="glass p-5 flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-xl text-[#00EF8B]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-[#888888] uppercase tracking-wider font-bold">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}
