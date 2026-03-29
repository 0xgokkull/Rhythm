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
  Clock
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
            <p className="text-xs text-slate-500 font-medium">Non-custodial. You own everything. Withdraw anytime.</p>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">User-Controlled</span>
          </div>
        </motion.header>

        {/* Total Balance — % focus, FLOW secondary */}
        <motion.div variants={itemVariants} className="card-web p-6 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Allocated Funds</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">100% <span className="text-sm text-slate-400 font-bold">across 3 vaults</span></h2>
            <p className="text-xs text-slate-500 font-medium mt-1">= {totalFunds.toFixed(1)} FLOW <span className="text-[9px] text-slate-400">(Testnet)</span></p>
          </div>
          <div className="flex gap-1 h-3 w-48 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${(sim.vaults.savings / totalFunds) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-primary rounded-full" 
            />
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${(sim.vaults.bills / totalFunds) * 100}%` }}
              transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
              className="bg-secondary rounded-full" 
            />
            <motion.div 
              initial={{ width: 0 }} animate={{ width: `${(sim.vaults.spend / totalFunds) * 100}%` }}
              transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              className="bg-slate-300 rounded-full" 
            />
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
            total={totalFunds}
            earnings={parseFloat((sim.vaults.savings * 0.04).toFixed(1))}
            safety="High"
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
            total={totalFunds}
            earnings={parseFloat((sim.vaults.bills * 0.02).toFixed(1))}
            safety="Medium"
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
            total={totalFunds}
            earnings={0}
            safety="Flexible"
            iconColor="text-slate-600"
            iconBg="bg-slate-50"
          />
        </motion.div>

        {/* Recent Vault Activity */}
        <motion.div variants={itemVariants} className="card-web p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900">Recent Vault Activity</h3>
            <a href="/activity" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              Full Timeline <ArrowRight className="w-3 h-3" />
            </a>
          </div>
          <div className="space-y-3">
            {sim.timeline.filter(e => e.status === 'success' && e.amount).slice(0, 3).map(event => (
              <div key={event.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 tracking-tight">{event.title}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{event.description}</p>
                  </div>
                </div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{event.timestamp}</span>
              </div>
            ))}
            {sim.timeline.filter(e => e.status === 'success' && e.amount).length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No vault transactions yet.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Flow attribution */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 py-3">
          <Zap className="w-3 h-3 text-primary fill-current" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Vaults backed by Flow Cadence resources · Non-custodial
          </span>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}

function VaultDetailCard({ variants, icon: Icon, name, why, balance, pct, total, earnings, safety, iconColor, iconBg }: any) {
  const actualPct = total > 0 ? ((balance / total) * 100).toFixed(0) : '0';
  return (
    <motion.div variants={variants} className="card-web p-6 space-y-5 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-105 transition-transform`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{name}</h3>
            <p className="text-[10px] text-slate-500 font-medium italic">{why}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">{pct}% <span className="text-sm text-slate-400 font-bold">allocated</span></p>
        <p className="text-xs text-slate-500 font-medium">= {balance.toFixed(1)} FLOW</p>
        <p className="text-[9px] text-primary font-bold uppercase tracking-widest mt-1">Withdraw anytime</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Earnings</p>
          <p className="text-sm font-black text-emerald-600">{earnings > 0 ? `+${earnings} FLOW` : '—'}</p>
        </div>
        <div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Safety</p>
          <p className="text-sm font-black text-slate-900">{safety}</p>
        </div>
      </div>
    </motion.div>
  );
}
