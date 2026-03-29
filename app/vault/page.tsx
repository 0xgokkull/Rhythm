'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  History, 
  PieChart, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState('savings');

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
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">Financial Vaults</h1>
            <p className="text-lg text-slate-500 font-medium tracking-tight">Non-custodial asset governance & institutional yield monitoring.</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-[28px] text-slate-900 font-black text-sm hover:shadow-xl hover:bg-slate-50 transition-all duration-300">
              <History className="w-5 h-5 text-slate-400" />
              History
            </button>
            <button className="btn-web-primary h-auto py-4 px-8">
              <Plus className="w-5 h-5" />
              Deploy Vault
            </button>
          </div>
        </header>

        {/* High-Level Stats */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCardWeb variants={itemVariants} icon={<Wallet className="w-6 h-6" />} label="Total Principal" value="14,242.00" color="text-primary" />
          <StatCardWeb variants={itemVariants} icon={<TrendingUp className="w-6 h-6" />} label="Accrued Yield" value="456.12" color="text-emerald-500" />
          <StatCardWeb variants={itemVariants} icon={<PieChart className="w-6 h-6" />} label="Allocation" value="3 Active" color="text-secondary" />
          <StatCardWeb variants={itemVariants} icon={<ShieldCheck className="w-6 h-6" />} label="Security" value="High" color="text-accent" />
        </motion.div>

        {/* Wide Gallery View */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <VaultDetailCard 
            variants={itemVariants}
            name="Wealth Compounder" 
            balance="8,450.00" 
            type="Savings" 
            yield="12.5%" 
            status="Active"
            color="bg-primary"
            desc="Primary asset accumulation vault with automated yield re-investment protocols."
          />
          <VaultDetailCard 
            variants={itemVariants}
            name="Emergency Safety" 
            balance="4,667.00" 
            type="Safety" 
            yield="4.2%" 
            status="Stable"
            color="bg-accent"
            desc="High-liquidity vault for immediate capital access during emergency scenarios."
          />
        </motion.div>

        {/* Detailed Transaction Table (WIDE) */}
        <motion.section variants={itemVariants} className="card-web overflow-hidden group">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-white relative">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Recent Vault Interactions</h3>
            <button className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] hover:text-primary transition-colors">Export Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vault Name</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-all duration-300 group/row cursor-pointer">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm group-hover/row:scale-110 group-hover/row:border-primary/20 transition-all duration-300">
                          <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 tracking-tight leading-none mb-1">TX-9283-FS</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Mar 01, 2026</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-base font-bold text-slate-600 group-hover:text-primary transition-colors">Wealth Compounder</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-[0.2em]">Deposit</span>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-lg font-black text-slate-900 tracking-tighter">1,500.00 <span className="text-[10px] ml-1">F</span></span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <span className="text-sm font-black text-slate-600 uppercase tracking-tight">Confirmed</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <button className="p-3 text-slate-300 group-hover/row:text-primary transition-all duration-300 hover:bg-primary/5 rounded-xl">
                        <ExternalLink className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </motion.div>
    </PageTransition>
  );
}

function StatCardWeb({ icon, label, value, color, variants }: any) {
  return (
    <motion.div variants={variants} className="card-web p-8 flex flex-col gap-6 group">
      <div className={`w-14 h-14 rounded-2xl bg-white shadow-xl shadow-slate-100 flex items-center justify-center border border-slate-50 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black mb-1.5 leading-none">{label}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{value}{!isNaN(Number(value.replace(/,/g, ''))) && <span className="text-xs ml-1 opacity-40 italic">FLOW</span>}</p>
      </div>
    </motion.div>
  );
}

function VaultDetailCard({ name, balance, type, yield: yieldVal, status, color, desc, variants }: any) {
  return (
    <motion.div variants={variants} className="card-web group overflow-hidden">
      <div className="p-10 space-y-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm tracking-tight">{desc}</p>
          </div>
          <div className={`px-5 py-2.5 ${color} text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-current/20`}>
            {status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 group-hover:bg-white transition-colors duration-500">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3 leading-none">Available Principal</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{balance} <span className="text-xs italic opacity-30">FLOW</span></p>
          </div>
          <div className="p-8 bg-primary/5 rounded-[40px] border border-primary/10 group-hover:bg-primary/10 transition-colors duration-500">
            <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.2em] mb-3 leading-none">Net Annual Yield</p>
            <p className="text-4xl font-black text-primary tracking-tighter leading-none">{yieldVal}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <div className="flex -space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 group-hover:scale-110 transition-transform duration-500" />
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-xl">+5</div>
          </div>
          <button className="flex items-center gap-3 font-black text-sm text-primary group/btn uppercase tracking-widest">
            Configuration
            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-all duration-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
