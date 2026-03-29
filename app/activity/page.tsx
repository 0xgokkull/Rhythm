'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle, 
  XCircle, 
  Zap,
  Play,
  Info,
  Loader2,
  Clock
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useSimulation } from '@/context/SimulationContext';

export default function ActivityPage() {
  const sim = useSimulation();

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
        {/* Header */}
        <motion.header variants={itemVariants} className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">System Timeline</h1>
            <p className="text-xs text-slate-500 font-medium">Every action your autopilot takes, verified on-chain.</p>
          </div>
          <button
            onClick={sim.simulateSalary}
            disabled={!['idle', 'success'].includes(sim.status)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Simulate Deposit
          </button>
        </motion.header>

        {/* Reliability Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-4">
          <StatCard label="Total Runs" value={sim.totalAutomated.toString()} />
          <StatCard label="Success Rate" value={`${sim.successRate}%`} />
          <StatCard label="Retry Engaged" value="1" />
          <StatCard label="System Status" value={sim.status === 'idle' || sim.status === 'success' ? 'Online' : 'Processing'} isStatus />
        </motion.div>

        {/* Full Timeline */}
        <motion.div variants={itemVariants} className="card-web p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Execution Log</h3>
          
          {sim.timeline.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">No activity yet — click "Simulate Salary" to trigger your first split.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {sim.timeline.map((event, idx) => (
                <TimelineRow key={event.id} event={event} isLast={idx === sim.timeline.length - 1} index={idx} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Flow Attribution */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 py-4">
          <Zap className="w-3.5 h-3.5 text-primary fill-current" />
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            All transactions scheduled on-chain · Gasless execution · Powered by Flow
          </span>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
}

function StatCard({ label, value, isStatus }: { label: string; value: string; isStatus?: boolean }) {
  return (
    <div className="card-web p-4">
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-lg font-black tracking-tight ${isStatus ? (value === 'Online' ? 'text-emerald-600' : 'text-amber-600') : 'text-slate-900'}`}>
        {isStatus && <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${value === 'Online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />}
        {value}
      </p>
    </div>
  );
}

function TimelineRow({ event, isLast, index }: { event: any; isLast: boolean; index: number }) {
  const statusMap: Record<string, { icon: any; dot: string; bg: string; text: string }> = {
    success: { icon: CheckCircle2, dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700' },
    warning: { icon: RotateCcw, dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700' },
    error: { icon: XCircle, dot: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-700' },
    info: { icon: Info, dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
    processing: { icon: Loader2, dot: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  };

  const cfg = statusMap[event.status] || statusMap.info;
  const Icon = cfg.icon;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex gap-4 group"
    >
      {/* Vertical timeline */}
      <div className="flex flex-col items-center w-8 shrink-0">
        <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 z-10`}>
          <Icon className={`w-4 h-4 ${cfg.text} ${event.status === 'processing' ? 'animate-spin' : ''}`} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-100 -mt-0.5" />}
      </div>
      
      {/* Content */}
      <div className={`pb-5 flex-1 min-w-0`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 tracking-tight leading-tight">{event.title}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-relaxed">{event.description}</p>
            {event.amount && (
              <span className={`inline-block mt-1.5 text-[10px] font-bold px-2.5 py-1 rounded-md ${cfg.bg} ${cfg.text} uppercase tracking-widest`}>
                {event.amount}
              </span>
            )}
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest shrink-0 mt-1">{event.timestamp}</span>
        </div>
      </div>
    </motion.div>
  );
}
