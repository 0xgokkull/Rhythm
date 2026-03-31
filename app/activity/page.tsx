'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  XCircle, 
  Zap,
  Play,
  Info,
  Loader2,
  Clock
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useBackend } from '@/context/BackendContext';

export default function ActivityPage() {
  const backend = useBackend();
  const { timeline, systemStatus, triggerExecution, salary, isEnginePaused } = backend;

  const totalRuns = systemStatus ? systemStatus.total_executions : 0;
  const failureRateStr = systemStatus ? systemStatus.failure_rate : '0%';
  const successRate = 100 - parseFloat(failureRateStr);
  const isPending = systemStatus ? systemStatus.pending > 0 : false;
  const avgRetry = systemStatus ? systemStatus.avg_retry_count : 0;

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
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
        <motion.header variants={itemVariants} className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">System Timeline</h1>
            <p className="text-xs text-slate-500 font-medium">Every action your autopilot takes, verified on-chain.</p>
          </div>
          <button
            onClick={() => triggerExecution(salary)}
            disabled={isPending || isEnginePaused}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Trigger Split
          </button>
        </motion.header>

        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
          <StatCard label="Total Runs" value={totalRuns.toString()} />
          <StatCard label="Success Rate" value={`${successRate.toFixed(1)}%`} />
          <StatCard label="Avg Retry" value={avgRetry.toString()} />
          <StatCard 
            label="System Status" 
            value={isPending ? 'Processing' : (isEnginePaused ? 'Paused' : 'Online')} 
            isStatus 
            statusColor={isPending ? 'amber' : (isEnginePaused ? 'red' : 'emerald')}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="card-web p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Execution Log</h3>
          
          {timeline.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">No activity yet — click "Trigger Split" to test.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {timeline.map((event, idx) => (
                <TimelineRow key={event.execution_id || idx} event={event} isLast={idx === timeline.length - 1} index={idx} />
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 py-4">
          <Zap className="w-3.5 h-3.5 text-primary fill-current" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            All transactions scheduled on Flow EVM Testnet
          </span>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}

function StatCard({ label, value, isStatus, statusColor }: { label: string; value: string; isStatus?: boolean; statusColor?: string }) {
  let colorClass = 'text-slate-900';
  let dotClass = '';
  
  if (isStatus) {
    if (statusColor === 'emerald') { colorClass = 'text-emerald-600'; dotClass = 'bg-emerald-500'; }
    if (statusColor === 'amber') { colorClass = 'text-amber-600'; dotClass = 'bg-amber-500 animate-pulse'; }
    if (statusColor === 'red') { colorClass = 'text-red-600'; dotClass = 'bg-red-500'; }
  }

  return (
    <div className="card-web p-4">
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-black tracking-tight ${colorClass}`}>
        {isStatus && <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${dotClass}`} />}
        {value}
      </p>
    </div>
  );
}

function TimelineRow({ event, isLast, index }: { event: any; isLast: boolean; index: number }) {
  let Icon = Info;
  let dotBg = 'bg-blue-500';
  let iconBg = 'bg-blue-50';
  let textColor = 'text-blue-700';
  let title = 'Execution Pending';
  let description = `Amount: ${event.amount} FLOW. Stage: ${event.stage}.`;

  if (event.status === 'confirmed') {
    Icon = CheckCircle2;
    dotBg = 'bg-emerald-500';
    iconBg = 'bg-emerald-50';
    textColor = 'text-emerald-700';
    title = 'Execution Confirmed';
    description = `Splits executed on-chain for ${event.amount} FLOW.`;
  } else if (event.status === 'failed') {
    Icon = XCircle;
    dotBg = 'bg-red-500';
    iconBg = 'bg-red-50';
    textColor = 'text-red-700';
    title = 'Execution Failed';
    description = event.error_message || 'Transaction reverted.';
  } else if (event.status === 'pending' || event.status === 'submitted') {
    Icon = Loader2;
  }

  const isProcessing = event.status === 'pending' || event.status === 'submitted';
  const dateStr = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-4 group"
    >
      <div className="flex flex-col items-center w-8 shrink-0">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0 z-10`}>
          <Icon className={`w-4 h-4 ${textColor} ${isProcessing ? 'animate-spin' : ''}`} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-100 -mt-0.5" />}
      </div>
      
      <div className={`pb-5 flex-1 min-w-0`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{title}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{description}</p>
            
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md ${iconBg} ${textColor} uppercase tracking-widest`}>
                {event.amount} FLOW
              </span>
              
              {event.tx_hash && (
                <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 uppercase tracking-widest">
                  TX: {event.tx_hash.substring(0, 10)}...
                </span>
              )}

              {event.retry_count > 0 && (
                <span className="inline-block text-[10px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 uppercase tracking-widest flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Retry: {event.retry_count}
                </span>
              )}
            </div>
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest shrink-0 mt-1">{dateStr}</span>
        </div>
      </div>
    </motion.div>
  );
}
