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
        {/* Top Summary Cards */}
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <SummaryCard 
            variants={itemVariants}
            title="Total Net Worth" 
            value="14,242 FLOW" 
            change="+4.2%" 
            icon={Wallet} 
            color="text-primary" 
            bg="bg-primary/5" 
          />
          <SummaryCard 
            variants={itemVariants}
            title="Monthly Inflow" 
            value="5,000 FLOW" 
            change="+12.5%" 
            icon={TrendingUp} 
            color="text-emerald-500" 
            bg="bg-emerald-500/5" 
          />
          <SummaryCard 
            variants={itemVariants}
            title="Savings Rate" 
            value="38.5%" 
            change="Target: 40%" 
            icon={PieChart} 
            color="text-secondary" 
            bg="bg-secondary/5" 
          />
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          
          {/* Column 1: Vaults (4 cols) */}
          <motion.div variants={itemVariants} className="xl:col-span-4 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Active Vaults</h3>
              <button className="text-primary font-bold text-sm hover:underline tracking-tight">View All</button>
            </div>
            <div className="space-y-5">
              <VaultCardWeb 
                name="Wealth Compounder" 
                balance="8,450 FLOW" 
                type="Savings" 
                progress={65} 
                color="bg-gradient-to-r from-primary to-secondary"
              />
              <VaultCardWeb 
                name="Essential Bills" 
                balance="1,125 FLOW" 
                type="Operational" 
                progress={82} 
                color="bg-slate-900"
              />
              <VaultCardWeb 
                name="Emergency Fund" 
                balance="4,667 FLOW" 
                type="Safety" 
                progress={95} 
                color="bg-accent"
              />
            </div>
            <button className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[32px] text-slate-400 font-bold hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 group">
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
              Build New Vault
            </button>
          </motion.div>

          {/* Column 2: Chart & Performance (5 cols) */}
          <motion.div variants={itemVariants} className="xl:col-span-5 space-y-8">
            <div className="card-web p-10 h-[580px] flex flex-col group">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Portfolio Performance</h3>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Smart Engine Analysis</p>
                </div>
                <div className="flex p-1.5 bg-slate-50 rounded-2xl">
                  <button className="px-5 py-2.5 bg-white shadow-sm rounded-xl text-xs font-black text-primary">ALL</button>
                  <button className="px-5 py-2.5 text-xs font-black text-slate-400">1Y</button>
                  <button className="px-5 py-2.5 text-xs font-black text-slate-400">6M</button>
                </div>
              </div>
              
              {/* Mock Chart Visualization */}
              <div className="flex-1 relative flex items-end gap-3 px-2 pb-8">
                {[40, 55, 45, 70, 60, 85, 95, 80, 100].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${h}%`, opacity: 1 }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 1, ease: "easeOut" }}
                    className="flex-1 bg-slate-50 rounded-t-2xl relative group/bar cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-secondary rounded-t-2xl opacity-0 group-hover/bar:opacity-100 transition-all duration-500 shadow-lg shadow-primary/20" />
                    {i === 8 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-full font-black shadow-xl whitespace-nowrap"
                      >
                        14,242 FLOW
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-10 pt-10 border-t border-slate-50 mt-auto">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Projected ROI</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">12.8% <span className="text-sm text-emerald-500 font-bold">/ p.a.</span></p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Risk Adjusted</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">Peak <span className="text-sm text-primary font-bold">Safety</span></p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Stats & Feed (3 cols) */}
          <motion.div variants={itemVariants} className="xl:col-span-3 space-y-8">
            <div className="card-web p-8 space-y-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tighter">Institutional Feed</h3>
              <div className="space-y-8">
                <FeedItem 
                  title="Inflow Protocol" 
                  desc="Flow Testnet • Node 0x82" 
                  val="+5,000.00" 
                  time="2h ago" 
                  type="in" 
                />
                <FeedItem 
                  title="Vault Distribution" 
                  desc="Wealth Compounder" 
                  val="-1,500.00" 
                  time="2h ago" 
                  type="out" 
                />
                <FeedItem 
                  title="Gas Settlement" 
                  desc="Flow Network" 
                  val="-0.04" 
                  time="1d ago" 
                  type="out" 
                />
              </div>
              <button className="w-full btn-web-primary py-4 text-sm font-black tracking-tight group mt-4">
                Global History
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </button>
            </div>

            <div className="card-web p-8 bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
              <motion.div 
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2] 
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-8 -bottom-8 w-48 h-48 bg-primary/30 rounded-full blur-3xl" 
              />
              <ShieldCheck className="w-12 h-12 text-primary mb-6 group-hover:scale-110 transition-transform duration-500" />
              <h4 className="font-black text-xl tracking-tight mb-2">Smart Autopilot</h4>
              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
                Your capital is currently optimized for maximum yield across institutional protocol nodes.
              </p>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-[24px] flex items-center justify-between border border-white/5 shadow-2xl">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Efficiency</p>
                  <p className="text-2xl font-black tracking-tighter">98.4%</p>
                </div>
                <Zap className="w-6 h-6 text-primary fill-current" />
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </PageTransition>
  );
}

function SummaryCard({ title, value, change, icon: Icon, color, bg, variants }: any) {
  return (
    <motion.div variants={variants} className="card-web p-10 relative flex items-center justify-between group">
      <div className="space-y-4">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{title}</p>
        <div className="flex flex-col">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">{value}</h2>
          <span className={`text-sm font-black tracking-tight flex items-center gap-1 ${change.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
            {change.startsWith('+') && <ArrowUpRight className="w-3 h-3" />}
            {change}
          </span>
        </div>
      </div>
      <div className={`p-6 ${bg} ${color} rounded-[28px] group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-transparent hover:shadow-primary/20`}>
        <Icon className="w-8 h-8" />
      </div>
    </motion.div>
  );
}

function VaultCardWeb({ name, balance, type, progress, color }: any) {
  return (
    <div className="card-web p-8 hover:border-primary/30 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h4 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-primary transition-colors">{name}</h4>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{type}</p>
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tighter">{balance}</p>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <span>Allocation</span>
          <span className="text-slate-900">{progress}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-full ${color} rounded-full shadow-lg shadow-primary/20`}
          />
        </div>
      </div>
    </div>
  );
}

function FeedItem({ title, desc, val, time, type }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${type === 'in' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500`}>
          {type === 'in' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-base font-black text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors">{title}</p>
          <p className="text-[11px] text-slate-400 font-bold tracking-tight">{desc}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-base font-black tracking-tighter ${type === 'in' ? 'text-emerald-500' : 'text-slate-900'}`}>{type === 'in' ? '+' : '-'}{val} <span className="text-[10px] ml-0.5">F</span></p>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{time}</p>
      </div>
    </div>
  );
}
