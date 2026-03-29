'use client';

import { motion } from 'framer-motion';
import { 
  Wallet, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft, 
  MoreHorizontal, 
  TrendingUp, 
  Clock, 
  PieChart, 
  ArrowRight,
  Plus
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <PageTransition>
      <div className="space-y-10">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard 
            title="Total Net Worth" 
            value="14,242 FLOW" 
            change="+4.2%" 
            icon={Wallet} 
            color="text-primary" 
            bg="bg-primary/5" 
          />
          <SummaryCard 
            title="Monthly Inflow" 
            value="5,000 FLOW" 
            change="+12.5%" 
            icon={TrendingUp} 
            color="text-emerald-500" 
            bg="bg-emerald-500/5" 
          />
          <SummaryCard 
            title="Savings Rate" 
            value="38.5%" 
            change="Target: 40%" 
            icon={PieChart} 
            color="text-secondary" 
            bg="bg-secondary/5" 
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Vaults (4 cols) */}
          <div className="xl:col-span-4 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-slate-900">Active Vaults</h3>
              <button className="text-primary font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              <VaultCardWeb 
                name="Wealth Compounder" 
                balance="8,450 FLOW" 
                type="Savings" 
                progress={65} 
                color="bg-primary"
              />
              <VaultCardWeb 
                name="Essential Bills" 
                balance="1,125 FLOW" 
                type="Operational" 
                progress={82} 
                color="bg-secondary"
              />
              <VaultCardWeb 
                name="Emergency Fund" 
                balance="4,667 FLOW" 
                type="Safety" 
                progress={95} 
                color="bg-accent"
              />
            </div>
            <button className="w-full py-5 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Build New Vault
            </button>
          </div>

          {/* Column 2: Chart & Performance (5 cols) */}
          <div className="xl:col-span-5 space-y-6">
            <div className="card-web p-8 h-[520px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Portfolio Performance</h3>
                  <p className="text-sm text-slate-400 font-medium">Historical growth vs goals</p>
                </div>
                <div className="flex p-1 bg-slate-50 rounded-xl">
                  <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-xs font-bold text-primary">ALL</button>
                  <button className="px-4 py-2 text-xs font-bold text-slate-400">1Y</button>
                  <button className="px-4 py-2 text-xs font-bold text-slate-400">6M</button>
                </div>
              </div>
              
              {/* Mock Chart Visualization */}
              <div className="flex-1 relative flex items-end gap-2 px-2 pb-6">
                {[40, 55, 45, 70, 60, 85, 95, 80, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="flex-1 bg-primary/10 rounded-t-xl relative group"
                  >
                    <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                    {i === 8 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-bold">14k FLOW</div>}
                  </motion.div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-100 mt-auto">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Projected ROI</p>
                  <p className="text-2xl font-bold text-slate-900">12.8% <span className="text-sm text-emerald-500 font-medium">/ p.a.</span></p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Risk Adjusted</p>
                  <p className="text-2xl font-bold text-slate-900">High <span className="text-sm text-primary font-medium">Efficiency</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Stats & Feed (3 cols) */}
          <div className="xl:col-span-3 space-y-6">
            <div className="card-web p-6 space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Feed</h3>
              <div className="space-y-6">
                <FeedItem 
                  title="Inflow Protocol" 
                  desc="Flow Testnet • 0x82...f9" 
                  val="+5,000 FLOW" 
                  time="2h ago" 
                  type="in" 
                />
                <FeedItem 
                  title="Vault Distribution" 
                  desc="Wealth Compounder Vault" 
                  val="-1,500 FLOW" 
                  time="2h ago" 
                  type="out" 
                />
                <FeedItem 
                  title="Gas Settlement" 
                  desc="Flow Network" 
                  val="-0.04 FLOW" 
                  time="1d ago" 
                  type="out" 
                />
              </div>
              <button className="w-full btn-web-primary py-3 text-sm flex items-center justify-center gap-2 group mt-4">
                Global History
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="card-web p-6 bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              <ShieldCheck className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-bold text-lg mb-1">Smart Autopilot</h4>
              <p className="text-xs text-slate-400 font-medium mb-6 leading-relaxed">
                Your capital is currently being optimized for maximum yield across 3 protocol nodes.
              </p>
              <div className="bg-white/10 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Efficiency</p>
                  <p className="text-lg font-bold">98.4%</p>
                </div>
                <Zap className="w-5 h-5 text-primary fill-current" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

function SummaryCard({ title, value, change, icon: Icon, color, bg }: any) {
  return (
    <div className="card-web p-8 relative flex items-center justify-between group">
      <div className="space-y-2">
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h2>
          <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className={`p-5 ${bg} ${color} rounded-[24px] group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
}

function VaultCardWeb({ name, balance, type, progress, color }: any) {
  return (
    <div className="card-web p-6 hover:border-primary/20 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{name}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{type}</p>
        </div>
        <p className="text-lg font-bold text-slate-900">{balance}</p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Utilization</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${color} rounded-full`}
          />
        </div>
      </div>
    </div>
  );
}

function FeedItem({ title, desc, val, time, type }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${type === 'in' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'} group-hover:scale-110 transition-transform`}>
          {type === 'in' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">{title}</p>
          <p className="text-[10px] text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${type === 'in' ? 'text-emerald-500' : 'text-slate-900'}`}>{val}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase">{time}</p>
      </div>
    </div>
  );
}
