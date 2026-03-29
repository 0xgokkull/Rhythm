'use client';

import { motion, AnimatePresence } from 'framer-motion';
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
  Activity,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useSimulation, SystemStatus, EnginePhase } from '@/context/SimulationContext';

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
        {}
        <motion.div variants={itemVariants}>
          <AutopilotHero 
            status={sim.status}
            phase={sim.currentPhase}
            lastRun={sim.lastRun}
            lastAmount={sim.lastAmount}
            nextRun={sim.nextRun}
            retryCount={sim.retryCount}
            isPaused={sim.isEnginePaused}
            onSimulate={sim.simulateSalary}
          />
        </motion.div>

        {}
        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mb-1">Capital Automated</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {sim.rules.savings}% <span className="text-sm text-slate-400 font-bold">savings split</span>
              </h2>
              <p className="text-[12px] text-slate-500 font-medium mt-1">= {sim.autoSavedThisMonth} FLOW automated</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <PiggyBank className="w-5 h-5" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mb-1">Successful Allocations</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{sim.totalAutomated} <span className="text-sm text-slate-400 font-bold">executions</span></h2>
              <p className="text-[12px] text-slate-500 font-medium mt-1">Verified on Flow Blockchain</p>
            </div>
            <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mb-1">Autopilot Reliability</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{sim.successRate}%</h2>
              <p className="text-[12px] text-slate-500 font-medium mt-1">Recovered via retry layer</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>

        {}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {}
          <motion.div variants={itemVariants} className="xl:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Fund Allocation</h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Engine Active</span>
              </div>
            </div>
            
            <VaultCard 
              icon={PiggyBank}
              name="Savings" 
              purpose="Money you don't touch"
              balance={sim.vaults.savings}
              pct={sim.rules.savings}
              lastActivity={sim.vaults.lastActivity}
              lastUpdate={sim.vaults.lastUpdate}
              iconColor="text-primary"
              iconBg="bg-primary/5"
            />
            <VaultCard 
              icon={Receipt}
              name="Bills" 
              purpose="Reserved for expenses"
              balance={sim.vaults.bills}
              pct={sim.rules.bills}
              lastActivity={sim.vaults.lastActivity}
              lastUpdate={sim.vaults.lastUpdate}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <VaultCard 
              icon={ShoppingBag}
              name="Spend" 
              purpose="Free to use"
              balance={sim.vaults.spend}
              pct={sim.rules.spend}
              lastActivity={sim.vaults.lastActivity}
              lastUpdate={sim.vaults.lastUpdate}
              iconColor="text-slate-600"
              iconBg="bg-slate-50"
            />

            {}
            <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500 font-bold">Total Funds</span>
              <span className="text-base font-black text-slate-900">{totalFunds.toFixed(1)} FLOW <span className="text-[11px] text-slate-400 font-bold">(Testnet)</span></span>
            </div>
          </motion.div>

          {}
          <motion.div variants={itemVariants} className="xl:col-span-7">
            <div className="card-web p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">System activity</h3>
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

function AutopilotHero({ status, phase, lastRun, lastAmount, nextRun, retryCount, isPaused, onSimulate }: {
  status: SystemStatus; phase: EnginePhase; lastRun: string | null; lastAmount: string | null;
  nextRun: string; retryCount: number; isPaused: boolean; onSimulate: () => void;
}) {
  const statusConfig: Record<SystemStatus, { icon: any; label: string; sublabel: string; color: string; bg: string; dot: string; pulse?: boolean }> = {
    idle: { icon: CheckCircle2, label: 'Autopilot Active', sublabel: 'Monitoring Flow network for deposits', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500', pulse: true },
    detecting: { icon: Loader2, label: 'Income Detected', sublabel: 'Validating on-chain deposit...', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', pulse: true },
    splitting: { icon: Loader2, label: 'Allocating Capital', sublabel: 'Executing Flow Scheduled Transaction...', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', pulse: true },
    failed: { icon: XCircle, label: 'Node Timeout', sublabel: 'Transitioning to backup access node...', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-500' },
    retrying: { icon: RotateCcw, label: `Retry Engine Active`, sublabel: `Attempt ${retryCount}/3: Re-submitting to Flow`, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500', pulse: true },
    success: { icon: ShieldCheck, label: 'On-Chain Success', sublabel: 'Capital split and verified on-chain', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  };

  const phaseLabels: Record<EnginePhase, string> = {
    IDLE: 'READY',
    DETECTION: 'PHASE 1: DETECTION',
    VALIDATION: 'PHASE 2: VALIDATION',
    ALLOCATION: 'PHASE 3: ALLOCATION',
    RETRY_LOGIC: 'PHASE 4: RETRY LOGIC',
    FINALIZING: 'PHASE 5: FINALIZING'
  };

  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  const isProcessing = ['detecting', 'splitting', 'retrying'].includes(status);
  const isError = status === 'failed';

  return (
    <div className={`card-web p-6 border ${cfg.bg} transition-all duration-500 relative overflow-hidden group`}>
      {}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="absolute top-0 inset-x-0 h-6 bg-emerald-600 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-3 h-3 text-white" />
            <span className="text-[10px] text-white font-black uppercase tracking-widest">On-Chain execution confirmed via Flow</span>
          </motion.div>
        )}
      </AnimatePresence>
      {}
      {phase !== 'IDLE' && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-1/3 h-0.5 bg-white/40 blur-sm"
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`relative p-3 rounded-xl ${cfg.bg}`}>
            <Icon className={`w-7 h-7 ${cfg.color} ${isProcessing ? 'animate-spin' : ''}`} />
            {cfg.pulse && !isPaused && (
              <div className={`absolute top-1 right-1 w-2.5 h-2.5 ${cfg.dot} rounded-full`}>
                <div className={`absolute inset-0 ${cfg.dot} rounded-full animate-ping opacity-75`} />
              </div>
            )}
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className={`text-xl font-black ${cfg.color} tracking-tight`}>{cfg.label}</h2>
              {phase !== 'IDLE' && (
                <span className="px-2 py-0.5 bg-white/50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/20">
                  {phaseLabels[phase]}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lastRun && status === 'idle'
                ? `Last successful execution: ${lastAmount} at ${lastRun}` 
                : cfg.sublabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Autopilot Reliability</p>
            <p className="text-base font-bold text-slate-700">High-Availability</p>
          </div>
          
          <button
            onClick={onSimulate}
            disabled={isProcessing || isError || isPaused}
            className="flex items-center gap-2 px-6 h-12 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isPaused ? (
              <>Engine Paused</>
            ) : isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {status === 'retrying' ? `Retry Attempt ${retryCount}...` : 'Executing...'}
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                Simulate Deposit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function VaultCard({ icon: Icon, name, purpose, balance, pct, iconColor, iconBg, lastActivity, lastUpdate }: any) {
  return (
    <div className="card-web p-5 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900 tracking-tight">{name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[12px] text-emerald-600 font-black tracking-tight">{lastActivity}</p>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <p className="text-[12px] text-slate-400 font-medium">{lastUpdate}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{pct}%</p>
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">{balance.toFixed(1)} FLOW</p>
      </div>
    </div>
  );
}

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
        <div className={`w-3 h-3 rounded-full ${c.dot} mt-1.5 shrink-0 ring-4 ring-white z-10 group-hover:scale-125 transition-transform`} />
        {!isLast && <div className={`w-px flex-1 ${c.line} -mt-0.5`} />}
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{event.title}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{event.description}</p>
            
            {(event.txId || event.retryCount) && (
              <div className="flex items-center gap-3 mt-2">
                {event.txId && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100/50">
                    <ShieldCheck className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest font-mono">{event.txId}</span>
                  </div>
                )}
                {event.retryCount && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100/50">
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Retry L{event.retryCount} Active</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest shrink-0 ml-4 mt-1 bg-slate-50 px-2 py-0.5 rounded-full">{event.timestamp}</span>
        </div>
      </div>
    </div>
  );
}
