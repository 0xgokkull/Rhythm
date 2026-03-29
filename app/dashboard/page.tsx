'use client';

import { motion } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  ArrowRight,
  Play,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Loader2,
  PiggyBank,
  Receipt,
  ShoppingBag,
  Percent,
  Activity
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useSimulation, SystemStatus } from '@/context/SimulationContext';

export default function DashboardPage() {
  const sim = useSimulation();
  const totalFunds = sim.vaults.savings + sim.vaults.bills + sim.vaults.spend;

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
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
        {/* ══════════════ AUTOPILOT HERO ══════════════ */}
        <motion.div variants={itemVariants}>
          <AutopilotHero 
            status={sim.status}
            lastRun={sim.lastRun}
            lastAmount={sim.lastAmount}
            nextRun={sim.nextRun}
            retryCount={sim.retryCount}
            onSimulate={sim.simulateSalary}
          />
        </motion.div>

        {/* ══════════════ AUTOMATION METRICS (behavior, not balance) ══════════════ */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Auto-Saved This Month</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {sim.rules.savings}% <span className="text-xs text-slate-400 font-bold">saved</span>
              </h2>
              <p className="text-[10px] text-slate-500 font-medium mt-1">= {sim.autoSavedThisMonth} FLOW</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <PiggyBank className="w-5 h-5" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Automated Transfers</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{sim.totalAutomated} <span className="text-xs text-slate-400 font-bold">completed</span></h2>
              <p className="text-[10px] text-slate-500 font-medium mt-1">All gasless on Flow</p>
            </div>
            <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Success Rate</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{sim.successRate}%</h2>
              <p className="text-[10px] text-slate-500 font-medium mt-1">Including retries</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>

        {/* ══════════════ VAULTS + ACTIVITY ══════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Vault Balances — % primary, FLOW secondary */}
          <motion.div variants={itemVariants} className="xl:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Fund Allocation</h3>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">user-controlled</span>
            </div>
            
            <VaultCard 
              icon={PiggyBank}
              name="Savings" 
              purpose="Money you don't touch"
              balance={sim.vaults.savings}
              pct={sim.rules.savings}
              total={totalFunds}
              iconColor="text-primary"
              iconBg="bg-primary/5"
            />
            <VaultCard 
              icon={Receipt}
              name="Bills" 
              purpose="Reserved for expenses"
              balance={sim.vaults.bills}
              pct={sim.rules.bills}
              total={totalFunds}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <VaultCard 
              icon={ShoppingBag}
              name="Spend" 
              purpose="Free to use"
              balance={sim.vaults.spend}
              pct={sim.rules.spend}
              total={totalFunds}
              iconColor="text-slate-600"
              iconBg="bg-slate-50"
            />

            {/* Total */}
            <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-bold">Total Funds</span>
              <span className="text-sm font-black text-slate-900">{totalFunds.toFixed(1)} FLOW <span className="text-[9px] text-slate-400 font-bold">(Testnet)</span></span>
            </div>
          </motion.div>

          {/* System Activity Timeline */}
          <motion.div variants={itemVariants} className="xl:col-span-7">
            <div className="card-web p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">System Activity</h3>
                <a href="/activity" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                  Full Timeline <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              
              <div className="space-y-0">
                {sim.timeline.slice(0, 6).map((event, idx) => (
                  <TimelineItem key={event.id} event={event} isLast={idx === Math.min(5, sim.timeline.length - 1)} />
                ))}
                {sim.timeline.length === 0 && (
                  <div className="text-center py-10">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">No activity yet — click "Simulate Deposit" to trigger your first split.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </PageTransition>
  );
}

/* ═══ AUTOPILOT HERO ═══ */
function AutopilotHero({ status, lastRun, lastAmount, nextRun, retryCount, onSimulate }: {
  status: SystemStatus; lastRun: string | null; lastAmount: string | null;
  nextRun: string; retryCount: number; onSimulate: () => void;
}) {
  const statusConfig: Record<SystemStatus, { icon: any; label: string; sublabel: string; color: string; bg: string; dot: string; pulse?: boolean }> = {
    idle: { icon: CheckCircle2, label: 'Autopilot Active', sublabel: 'Monitoring for deposits', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', pulse: true },
    detecting: { icon: Loader2, label: 'Deposit Detected', sublabel: 'Incoming funds identified', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', pulse: true },
    splitting: { icon: Loader2, label: 'Auto-Splitting Funds', sublabel: 'Allocating to vaults', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', pulse: true },
    failed: { icon: XCircle, label: 'Transaction Failed', sublabel: 'Retry engine engaging', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
    retrying: { icon: RotateCcw, label: `Retrying (${retryCount}/3)`, sublabel: 'Re-submitting to backup node', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', pulse: true },
    success: { icon: CheckCircle2, label: 'Split Completed', sublabel: 'All funds allocated', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  };

  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  const isProcessing = ['detecting', 'splitting', 'retrying'].includes(status);

  return (
    <div className={`card-web p-6 border ${cfg.bg} transition-all duration-500`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`relative p-3 rounded-xl ${cfg.bg}`}>
            <Icon className={`w-6 h-6 ${cfg.color} ${isProcessing ? 'animate-spin' : ''}`} />
            {cfg.pulse && (
              <div className={`absolute top-1 right-1 w-2.5 h-2.5 ${cfg.dot} rounded-full`}>
                <div className={`absolute inset-0 ${cfg.dot} rounded-full animate-ping opacity-75`} />
              </div>
            )}
          </div>
          
          <div>
            <h2 className={`text-lg font-bold ${cfg.color} tracking-tight`}>{cfg.label}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {lastRun 
                ? `Last: ${lastAmount} processed at ${lastRun}` 
                : cfg.sublabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Next scheduled</p>
            <p className="text-sm font-bold text-slate-700">{nextRun}</p>
          </div>
          
          <button
            onClick={onSimulate}
            disabled={isProcessing || status === 'failed'}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Simulate Deposit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ VAULT CARD — % primary, FLOW secondary ═══ */
function VaultCard({ icon: Icon, name, purpose, balance, pct, total, iconColor, iconBg }: any) {
  const pctOfTotal = total > 0 ? ((balance / total) * 100).toFixed(0) : '0';
  return (
    <div className="card-web p-5 flex items-center justify-between group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-105 transition-transform`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900 tracking-tight">{name}</h4>
          <p className="text-[10px] text-slate-500 font-medium">{purpose}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xl font-black text-slate-900 tracking-tight">{pct}% <span className="text-xs text-slate-400 font-bold">allocated</span></p>
        <p className="text-[10px] text-slate-500 font-medium">= {balance.toFixed(1)} FLOW</p>
      </div>
    </div>
  );
}

/* ═══ TIMELINE ITEM ═══ */
function TimelineItem({ event, isLast }: { event: any; isLast: boolean }) {
  const colors: Record<string, { dot: string; line: string }> = {
    success: { dot: 'bg-emerald-500', line: 'bg-emerald-200' },
    warning: { dot: 'bg-amber-500', line: 'bg-amber-200' },
    error: { dot: 'bg-red-500', line: 'bg-red-200' },
    info: { dot: 'bg-blue-500', line: 'bg-blue-200' },
    processing: { dot: 'bg-blue-500', line: 'bg-blue-200' },
  };
  const c = colors[event.status] || colors.info;

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center w-5 shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${c.dot} mt-1.5 shrink-0 ring-4 ring-white z-10`} />
        {!isLast && <div className={`w-px flex-1 ${c.line} -mt-0.5`} />}
      </div>
      <div className="pb-5 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{event.title}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{event.description}</p>
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest shrink-0 ml-4 mt-1">{event.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
