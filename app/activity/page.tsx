'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle, 
  Calendar, 
  Filter, 
  ChevronRight,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function ActivityPage() {
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

  const activities = [
    { id: 1, type: 'SUCCESS', title: 'Vault Distribution', amount: '+1,500.00', date: 'Mar 01, 2026', time: '09:00 AM', vault: 'Wealth Compounder' },
    { id: 2, type: 'RETRY', title: 'Treasury Split', amount: '+2,000.00', date: 'Mar 01, 2026', time: '09:05 AM', vault: 'Operational', retryCount: 2 },
    { id: 3, type: 'SUCCESS', title: 'Manual Deposit', amount: '+500.00', date: 'Feb 26, 2026', time: '02:30 PM', vault: 'Emergency' },
    { id: 4, type: 'FAILED', title: 'Contract Interaction', amount: '-4.99', date: 'Feb 24, 2026', time: '11:15 AM', vault: 'Spending' },
    { id: 5, type: 'SUCCESS', title: 'Protocol Yield', amount: '+42.50', date: 'Feb 22, 2026', time: '10:00 AM', vault: 'Wealth Compounder' },
  ];

  return (
    <PageTransition>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        <header className="flex items-center justify-between pb-8 border-b border-slate-50">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">On-Chain Ledger</h1>
            <p className="text-lg text-slate-500 font-medium tracking-tight">Comprehensive institutional monitoring of all protocol flows.</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-100 rounded-[28px] text-slate-900 font-black text-sm hover:shadow-xl hover:bg-slate-50 transition-all duration-300">
              <Download className="w-5 h-5 text-slate-400" />
              Export
            </button>
            <button className="btn-web-primary h-auto py-4 px-8">
              <RefreshCw className="w-5 h-5" />
              Sync Node
            </button>
          </div>
        </header>

        {/* Filters & Tools */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="relative group flex-1 md:w-[480px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-primary transition-colors duration-300" />
              <input 
                type="text" 
                placeholder="Search transactions, vaults, or node IDs..." 
                className="w-full h-16 bg-white border border-slate-100 rounded-[32px] pl-16 pr-8 text-base focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-bold tracking-tight shadow-sm"
              />
            </div>
            <button className="p-5 bg-white border border-slate-100 rounded-[28px] hover:bg-slate-50 transition-all text-slate-400 hover:text-primary hover:shadow-xl group">
              <Filter className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-2">
            <FilterPill label="All" active />
            <FilterPill label="Inflow" />
            <FilterPill label="Outflow" />
            <FilterPill label="Finalized" />
            <FilterPill label="Pending" />
          </div>
        </motion.div>

        {/* Wide Explorer Table */}
        <motion.section variants={itemVariants} className="card-web overflow-hidden group/ledger">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Protocol Intent</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flow Entity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Execution Vector</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Value</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verification</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activities.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-all duration-300 group/row cursor-pointer">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-2xl ${item.amount.startsWith('-') ? 'bg-slate-50 text-slate-400' : 'bg-emerald-50 text-emerald-500'} group-hover/row:scale-110 group-hover/row:bg-primary group-hover/row:text-white transition-all duration-500`}>
                          {item.amount.startsWith('-') ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 leading-tight tracking-tight group-hover/row:text-primary transition-colors">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5 opacity-60">On-Chain Settlement</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-base font-bold text-slate-600 tracking-tight">{item.vault}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col">
                        <span className="text-base font-black text-slate-900 tracking-tight leading-none mb-1">{item.date}</span>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.time}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`text-lg font-black tracking-tighter ${item.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-900'}`}>
                        {item.amount} <span className="text-[10px] ml-0.5 opacity-40">F</span>
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <StatusBadge type={item.type} retryCount={item.retryCount} />
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="p-3 text-slate-200 hover:text-primary transition-all duration-300 hover:bg-primary/5 rounded-xl">
                        <MoreVertical className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Retry Engine Summary (WIDE) */}
        <motion.section variants={itemVariants} className="card-web p-12 bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -right-16 -bottom-16 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" 
          />
          <div className="flex items-center justify-between relative z-10 w-full">
            <div className="flex items-center gap-10">
              <div className="p-6 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/5 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                <RotateCcw className="w-10 h-10 text-primary animate-spin-slow stroke-[1.5]" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tighter mb-1">Autonomous Retry Engine</h3>
                <p className="text-lg text-slate-400 font-medium max-w-xl leading-relaxed tracking-tight">
                  Monitoring <span className="text-primary font-black">1 pending transaction</span> in the Operational vault. 
                  Protocol retries will continue until absolute on-chain finality is achieved.
                </p>
              </div>
            </div>
            <button className="px-10 py-5 bg-primary text-white font-black text-sm uppercase tracking-[0.2em] rounded-[28px] hover:bg-white hover:text-primary transition-all duration-500 shadow-2xl shadow-primary/20 hover:shadow-white/10 active:scale-95">
              Protocol Visualizer
            </button>
          </div>
        </motion.section>
      </motion.div>
    </PageTransition>
  );
}

function FilterPill({ label, active }: any) {
  return (
    <button className={`px-8 py-3.5 rounded-full text-xs font-black transition-all duration-500 whitespace-nowrap uppercase tracking-widest ${
      active ? 'bg-primary text-white shadow-xl shadow-primary/30 active:scale-95' : 'bg-white border border-slate-100 text-slate-400 hover:border-primary/20 hover:bg-slate-50'
    }`}>
      {label}
    </button>
  );
}

function StatusBadge({ type, retryCount }: any) {
  const configs: any = {
    SUCCESS: { icon: CheckCircle2, text: 'Finalized', color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
    RETRY: { icon: RefreshCw, text: `Retrying (${retryCount}x)`, color: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-500' },
    FAILED: { icon: AlertCircle, text: 'Rejected', color: 'bg-rose-50 text-rose-600', dot: 'bg-rose-500' },
  };

  const config = configs[type] || configs.SUCCESS;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full ${config.color} border border-current/5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
      <div className={`w-2 h-2 rounded-full ${config.dot} shadow-[0_0_10px_currentColor]`} />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{config.text}</span>
    </div>
  );
}


