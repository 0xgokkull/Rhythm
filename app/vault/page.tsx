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

  return (
    <PageTransition>
      <div className="space-y-10">
        <header className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Vaults</h1>
            <p className="text-slate-500 font-medium">Non-custodial asset governance & yield monitoring.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all">
              <History className="w-4 h-4" />
              History
            </button>
            <button className="btn-web-primary py-3 px-6 h-auto text-sm">
              <Plus className="w-4 h-4" />
              Deploy Vault
            </button>
          </div>
        </header>

        {/* High-Level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCardWeb icon={<Wallet className="w-5 h-5" />} label="Total Principal" value="14,242 FLOW" color="text-primary" />
          <StatCardWeb icon={<TrendingUp className="w-5 h-5" />} label="Accrued Yield" value="456 FLOW" color="text-emerald-500" />
          <StatCardWeb icon={<PieChart className="w-5 h-5" />} label="Allocation" value="3 Active" color="text-secondary" />
          <StatCardWeb icon={<ShieldCheck className="w-5 h-5" />} label="Security" value="High" color="text-accent" />
        </div>

        {/* Wide Gallery View */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <VaultDetailCard 
            name="Wealth Compounder" 
            balance="8,450 FLOW" 
            type="Savings" 
            yield="12.5%" 
            status="Active"
            color="bg-primary"
            desc="Primary asset accumulation vault with automated yield re-investment."
          />
          <VaultDetailCard 
            name="Emergency Safety" 
            balance="4,667 FLOW" 
            type="Safety" 
            yield="4.2%" 
            status="Stable"
            color="bg-accent"
            desc="High-liquidity vault for immediate capital access during emergencies."
          />
        </div>

        {/* Detailed Transaction Table (WIDE) */}
        <section className="card-web overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
            <h3 className="text-xl font-bold text-slate-900">Recent Vault Interactions</h3>
            <button className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">Export Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vault Name</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">TX-9283-FS</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Mar 01, 2026</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-semibold text-slate-700">Wealth Compounder</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">Deposit</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-slate-900">1,500 FLOW</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold text-slate-600">Confirmed</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button className="p-2 text-slate-300 group-hover:text-primary transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function StatCardWeb({ icon, label, value, color }: any) {
  return (
    <div className="card-web p-6 flex flex-col gap-4">
      <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function VaultDetailCard({ name, balance, type, yield: yieldVal, status, color, desc }: any) {
  return (
    <div className="card-web group overflow-hidden">
      <div className="p-8 space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">{desc}</p>
          </div>
          <div className={`px-4 py-2 ${color} text-white rounded-xl text-[10px] font-black uppercase tracking-widest`}>
            {status}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Available Balance</p>
            <p className="text-3xl font-black text-slate-900 tracking-tight">{balance}</p>
          </div>
          <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10">
            <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mb-2">Annual APY</p>
            <p className="text-3xl font-black text-primary tracking-tight">{yieldVal}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-bold text-white">+5</div>
          </div>
          <button className="flex items-center gap-2 font-bold text-sm text-primary group/btn">
            Configure Vault
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
