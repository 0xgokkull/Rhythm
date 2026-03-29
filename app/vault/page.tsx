'use client';

import { motion } from 'framer-motion';
import { 
  PiggyBank,
  Receipt,
  ShoppingBag,
  Shield,
  ArrowRight,
  Zap,
  ArrowUpRight,
  Clock,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useSimulation } from '@/context/SimulationContext';

export default function VaultPage() {
  const sim = useSimulation();
  const totalFunds = sim.vaults.savings + sim.vaults.bills + sim.vaults.spend;

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
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
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">Your Vaults</h1>
            <p className="text-xs text-slate-500 font-medium italic">Programmable capital. Non-custodial security. Powered by Flow.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[12px] text-emerald-600 font-black uppercase tracking-widest">On-Chain Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-[12px] text-primary font-bold uppercase tracking-widest">Self-Custodial</span>
            </div>
          </div>
        </motion.header>

        {/* Total Balance — % focus, FLOW secondary */}
        <motion.div variants={itemVariants} className="card-web p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mb-1">Portfolio Allocation</p>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">100% <span className="text-base text-slate-400 font-bold">Allocated</span></h2>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm text-primary font-black">{totalFunds.toFixed(1)} FLOW</p>
              <span className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">Verified on Flow Testnet</span>
            </div>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
              <span>Strategy Distribution</span>
              <span>Balanced Mode</span>
            </div>
            <div className="flex gap-1.5 h-4 w-full rounded-full overflow-hidden bg-slate-100/50 p-1">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${(sim.rules.savings)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-primary rounded-full relative group" 
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Savings: {sim.rules.savings}%</div>
              </motion.div>
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${(sim.rules.bills)}%` }}
                transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
                className="bg-emerald-500 rounded-full relative group" 
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Bills: {sim.rules.bills}%</div>
              </motion.div>
              <motion.div 
                initial={{ width: 0 }} animate={{ width: `${(sim.rules.spend)}%` }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                className="bg-slate-300 rounded-full relative group" 
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Spend: {sim.rules.spend}%</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Vault Cards — behavior first */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VaultDetailCard 
            variants={itemVariants}
            icon={PiggyBank}
            name="Savings"
            why="Money you don't touch"
            balance={sim.vaults.savings}
            pct={sim.rules.savings}
            lastActivity={sim.vaults.lastActivity}
            lastUpdate={sim.vaults.lastUpdate}
            earnings={parseFloat((sim.vaults.savings * 0.04).toFixed(1))}
            safety="Cadence Resource"
            iconColor="text-primary"
            iconBg="bg-primary/5"
          />
          <VaultDetailCard 
            variants={itemVariants}
            icon={Receipt}
            name="Bills"
            why="Reserved for expenses"
            balance={sim.vaults.bills}
            pct={sim.rules.bills}
            lastActivity={sim.vaults.lastActivity}
            lastUpdate={sim.vaults.lastUpdate}
            earnings={parseFloat((sim.vaults.bills * 0.02).toFixed(1))}
            safety="Auto-Allocated"
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <VaultDetailCard 
            variants={itemVariants}
            icon={ShoppingBag}
            name="Spend"
            why="Free to use"
            balance={sim.vaults.spend}
            pct={sim.rules.spend}
            lastActivity={sim.vaults.lastActivity}
            lastUpdate={sim.vaults.lastUpdate}
            earnings={0}
            safety="Flow Native"
            iconColor="text-slate-600"
            iconBg="bg-slate-50"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Resilience Indicator */}
          <motion.div variants={itemVariants} className="card-web p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">System Resilience</h3>
              </div>
              <p className="text-xl font-black text-slate-900 mb-2">Autopilot Reliability: {sim.successRate}%</p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                The Rhythm retry engine has successfully recovered <span className="text-primary font-bold">2 automated executions</span> this month during network timeouts. No funds were delayed.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="bg-emerald-50 text-emerald-600 text-[11px] font-black px-2 py-1 rounded tracking-widest uppercase">Nodes Active: 14</div>
              <div className="bg-primary/5 text-primary text-[11px] font-black px-2 py-1 rounded tracking-widest uppercase">Status: Nominal</div>
            </div>
          </motion.div>

          {/* Recent Vault Activity */}
          <motion.div variants={itemVariants} className="card-web p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">On-Chain Activity</h3>
              <a href="/activity" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                Full Ledger <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <div className="space-y-4">
              {sim.timeline.filter(e => e.status === 'success' && e.amount).slice(0, 3).map(event => (
                <div key={event.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Zap className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900 tracking-tight">{event.title}</p>
                      <p className="text-[12px] text-emerald-600 font-bold tracking-tight">On-chain confirmation complete</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-black tracking-widest uppercase">{event.timestamp}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Legend */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-6 py-6 border-t border-slate-50">
          <LegendItem icon={Zap} label="Scheduled execution" color="text-primary" />
          <LegendItem icon={Shield} label="Non-custodial vaults" color="text-emerald-600" />
          <LegendItem icon={CheckCircle2} label="Gasless automation" color="text-blue-600" />
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}

function LegendItem({ icon: Icon, label, color }: any) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="text-[12px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}

function VaultDetailCard({ variants, icon: Icon, name, why, balance, pct, iconColor, iconBg, lastActivity, lastUpdate, earnings, safety }: any) {
  return (
    <motion.div variants={variants} className="card-web p-6 space-y-5 group hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{name}</h3>
            <p className="text-[12px] text-slate-500 font-medium italic">{why}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[12px] text-emerald-600 font-black uppercase tracking-widest">{lastActivity}</p>
          <p className="text-[12px] text-slate-400 font-bold tracking-widest uppercase">{lastUpdate}</p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{pct}%</p>
          <div className="text-right">
            <p className="text-base font-bold text-slate-700">{balance.toFixed(1)} FLOW</p>
            <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Testnet Balance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Est. Yield</p>
          <p className="text-base font-black text-emerald-600">{earnings > 0 ? `+${earnings} FLOW` : '—'}</p>
        </div>
        <div>
          <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Asset Type</p>
          <p className="text-base font-black text-slate-900 tracking-tight shrink-0">{safety}</p>
        </div>
      </div>
    </motion.div>
  );
}
