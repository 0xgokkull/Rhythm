'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
  ShieldCheck,
  Cpu
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useBackend } from '@/context/BackendContext';

export default function DashboardPage() {
  const backend = useBackend();
  const { vaults, rules, systemStatus, timeline, triggerExecution, salary, isEnginePaused } = backend;

  const totalFunds = vaults ? parseFloat(vaults.total) : 0;
  const isPending = systemStatus ? systemStatus.pending > 0 : false;
  const successExecutions = systemStatus ? systemStatus.success : 0;
  const failureRate = systemStatus ? systemStatus.failure_rate : '0%';
  const savingsRule = rules ? rules.savings : 0;
  
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
        <motion.div variants={itemVariants}>
          <AutopilotHero 
            isPending={isPending}
            isPaused={isEnginePaused}
            lastExecution={timeline[0]}
            onSimulate={() => triggerExecution(salary)}
          />
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mb-1">Capital Configured</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {savingsRule}% <span className="text-sm text-slate-400 font-bold">savings split</span>
              </h2>
              <p className="text-[12px] text-slate-500 font-medium mt-1">Active on Flow EVM</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <PiggyBank className="w-5 h-5" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mb-1">Successful Allocations</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{successExecutions} <span className="text-sm text-slate-400 font-bold">executions</span></h2>
              <p className="text-[12px] text-slate-500 font-medium mt-1">Verified on Flow Blockchain</p>
            </div>
            <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5" />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="card-web p-5 flex items-center justify-between group">
            <div>
              <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mb-1">Your Failure Rate</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{failureRate}</h2>
              <p className="text-[12px] text-slate-500 font-medium mt-1">Monitored via events</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <motion.div variants={itemVariants} className="xl:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Fund Allocation</h3>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-500 animate-pulse' : 'bg-primary'}`} />
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{isPending ? 'Processing' : 'Engine Active'}</span>
              </div>
            </div>
            
            <VaultCard 
              icon={PiggyBank}
              name="Savings" 
              balance={vaults ? parseFloat(vaults.savings) : 0}
              pct={rules ? rules.savings : 0}
              iconColor="text-primary"
              iconBg="bg-primary/5"
            />
            <VaultCard 
              icon={Receipt}
              name="Bills" 
              balance={vaults ? parseFloat(vaults.bills) : 0}
              pct={rules ? rules.bills : 0}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <VaultCard 
              icon={ShoppingBag}
              name="Spend" 
              balance={vaults ? parseFloat(vaults.spend) : 0}
              pct={rules ? rules.spend : 0}
              iconColor="text-slate-600"
              iconBg="bg-slate-50"
            />

            <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500 font-bold">Total Funds</span>
              <span className="text-base font-black text-slate-900">{totalFunds.toFixed(2)} FLOW <span className="text-[11px] text-slate-400 font-bold">(Testnet)</span></span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="xl:col-span-7">
            <div className="card-web p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Activity</h3>
                <a href="/activity" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                  Full Timeline <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              
              <div className="space-y-0">
                {timeline.slice(0, 6).map((event, idx) => (
                  <TimelineItem key={event.execution_id || idx} event={event} isLast={idx === Math.min(5, timeline.length - 1)} />
                ))}
                {timeline.length === 0 && (
                  <div className="text-center py-10">
                    <Clock className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">No activity yet — trigger an execution to test the system.</p>
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

function AutopilotHero({ isPending, isPaused, lastExecution, onSimulate }: any) {
  let label = 'Autopilot Active';
  let sublabel = 'Monitoring Flow network for deposits';
  let color = 'text-emerald-700';
  let bg = 'bg-emerald-50 border-emerald-200';
  let Icon = CheckCircle2;
  let pulse = false;

  if (isPending) {
    label = 'Processing Execution';
    sublabel = 'Waiting for Flow EVM confirmation...';
    color = 'text-blue-700';
    bg = 'bg-blue-50 border-blue-200';
    Icon = Loader2;
    pulse = true;
  } else if (lastExecution && lastExecution.status === 'failed') {
    label = 'Execution Failed';
    sublabel = lastExecution.error_message || 'Transaction reverted';
    color = 'text-red-700';
    bg = 'bg-red-50 border-red-200';
    Icon = XCircle;
  }

  return (
    <div className={`card-web p-6 border ${bg} transition-all duration-500 relative overflow-hidden group`}>
      <AnimatePresence>
        {!isPending && lastExecution && lastExecution.status === 'confirmed' && (
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

      {isPending && (
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-1/3 h-0.5 bg-white/40 blur-sm"
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pt-2">
        <div className="flex items-center gap-4">
          <div className={`relative p-3 rounded-xl ${bg}`}>
            <Icon className={`w-7 h-7 ${color} ${pulse ? 'animate-spin' : ''}`} />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className={`text-xl font-black ${color} tracking-tight`}>{label}</h2>
              {isPending && (
                <span className="px-2 py-0.5 bg-white/50 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/20">
                  PROCESSING
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">{sublabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Autopilot Reliability</p>
            <p className="text-base font-bold text-slate-700">Backed by Flow EVM</p>
          </div>
          
          <button
            onClick={onSimulate}
            disabled={isPending || isPaused}
            className="flex items-center gap-2 px-6 h-12 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isPaused ? (
              <>Engine Paused</>
            ) : isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                Trigger Split
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function VaultCard({ icon: Icon, name, balance, pct, iconColor, iconBg }: any) {
  return (
    <div className="card-web p-5 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900 tracking-tight">{name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[12px] text-emerald-600 font-black tracking-tight">{pct}% Target</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{balance.toFixed(2)} FLOW</p>
      </div>
    </div>
  );
}

function TimelineItem({ event, isLast }: { event: any; isLast: boolean }) {
  const isSuccess = event.status === 'confirmed';
  const isPending = event.status === 'pending' || event.status === 'submitted';
  const isFailed = event.status === 'failed';
  const { fetchTxDetails } = useBackend();
  const [isExpanded, setIsExpanded] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const toggleDetails = async () => {
    if (!isSuccess || !event.tx_hash) return;
    if (!isExpanded && !details) {
      setLoadingDetails(true);
      const res = await fetchTxDetails(event.tx_hash);
      if (res?.success && res.decoded) {
        setDetails(res.data);
      }
      setLoadingDetails(false);
    }
    setIsExpanded(!isExpanded);
  };

  const dotColor = isSuccess ? 'bg-emerald-500' : isFailed ? 'bg-red-500' : 'bg-blue-500';
  const lineColor = isSuccess ? 'bg-emerald-200' : isFailed ? 'bg-red-200' : 'bg-blue-200';

  const dateStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center w-5 shrink-0">
        <div className={`w-3 h-3 rounded-full ${dotColor} mt-1.5 shrink-0 ring-4 ring-white z-10 group-hover:scale-125 transition-transform`} />
        {!isLast && <div className={`w-px flex-1 ${lineColor} -mt-0.5`} />}
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
              {isSuccess ? `Split Execution Confirmed` : isPending ? `Execution Pending` : `Execution Failed`}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
              Target Volume: {event.amount} FLOW. Stage: {event.stage}.
            </p>
            
            {(event.tx_hash || event.retry_count > 0) && (
              <div className="flex flex-wrap items-center gap-2 mt-2.5">
                {event.tx_hash && (
                  <a 
                    href={`https://evm-testnet.flowscan.io/tx/${event.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100/50 hover:bg-emerald-100 transition-all cursor-pointer group/link shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShieldCheck className="w-3 h-3 transition-transform group-hover/link:rotate-12" />
                    <span className="text-[9px] font-black uppercase tracking-widest font-mono">
                      {event.tx_hash.substring(0, 10)}...
                    </span>
                  </a>
                )}
                {isSuccess && (
                  <>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/5 text-primary rounded-md border border-primary/10">
                      <Cpu className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">On-Chain Trigger</span>
                    </div>
                    <button 
                      onClick={toggleDetails}
                      className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200 hover:bg-slate-200 transition-all text-[9px] font-black uppercase tracking-widest"
                    >
                      {loadingDetails ? 'Decoding...' : isExpanded ? 'Hide Split' : 'View Split'}
                    </button>
                  </>
                )}
                {event.retry_count > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-700 rounded-md border border-amber-100/50">
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Retry {event.retry_count}</span>
                  </div>
                )}
              </div>
            )}

            {isExpanded && details && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Savings</p>
                  <p className="text-xs font-bold text-emerald-600">+{Number(details.savings).toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Bills</p>
                  <p className="text-xs font-bold text-blue-600">+{Number(details.bills).toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Spend</p>
                  <p className="text-xs font-bold text-slate-900">+{Number(details.spend).toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest shrink-0 ml-4 mt-1 bg-slate-50 px-2 py-0.5 rounded-full">{dateStr}</span>
        </div>
      </div>
    </div>
  );
}
