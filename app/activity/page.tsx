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
  const activities = [
    { id: 1, type: 'SUCCESS', title: 'Vault Distribution (Savings)', amount: '1,500 FLOW', date: 'Mar 01, 2026', time: '09:00 AM', vault: 'Wealth Compounder' },
    { id: 2, type: 'RETRY', title: 'Treasury Split (Bills)', amount: '2,000 FLOW', date: 'Mar 01, 2026', time: '09:05 AM', vault: 'Operational', retryCount: 2 },
    { id: 3, type: 'SUCCESS', title: 'Manual Deposit', amount: '500 FLOW', date: 'Feb 26, 2026', time: '02:30 PM', vault: 'Emergency' },
    { id: 4, type: 'FAILED', title: 'Contract Interaction', amount: '4.99 FLOW', date: 'Feb 24, 2026', time: '11:15 AM', vault: 'Spending' },
    { id: 5, type: 'SUCCESS', title: 'Protocol Yield', amount: '42 FLOW', date: 'Feb 22, 2026', time: '10:00 AM', vault: 'Wealth Compounder' },
  ];

  return (
    <PageTransition>
      <div className="space-y-10">
        <header className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transaction Ledger</h1>
            <p className="text-slate-500 font-medium">Comprehensive monitoring of all on-chain protocol flows.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm hover:bg-slate-50 transition-all">
              <Download className="w-4 h-4" />
              Download CSV
            </button>
            <button className="btn-web-primary py-3 px-6 h-auto text-sm">
              <RefreshCw className="w-4 h-4" />
              Sync Ledger
            </button>
          </div>
        </header>

        {/* Filters & Tools */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group flex-1 md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search transactions, vaults, or IDs..." 
                className="w-full h-12 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-medium"
              />
            </div>
            <button className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all text-slate-500">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <FilterPill label="All" active />
            <FilterPill label="Inflow" />
            <FilterPill label="Outflow" />
            <FilterPill label="Success" />
            <FilterPill label="Retrying" />
          </div>
        </div>

        {/* Wide Explorer Table */}
        <section className="card-web overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Type</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vault Entity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activities.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${item.amount.startsWith('-') ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'} group-hover:scale-110 transition-transform`}>
                          {item.amount.startsWith('-') ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">On-Chain Settlement</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-semibold text-slate-700">{item.vault}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{item.date}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{item.time}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-sm font-black ${item.amount.startsWith('+') ? 'text-emerald-500' : 'text-slate-900'}`}>
                        {item.amount}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <StatusBadge type={item.type} retryCount={item.retryCount} />
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-primary transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Retry Engine Summary (WIDE) */}
        <section className="card-web p-8 bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20 relative overflow-hidden flex items-center justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
          <div className="flex items-center gap-8 relative z-10">
            <div className="p-5 bg-white/10 rounded-3xl">
              <RotateCcw className="w-8 h-8 text-primary animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">Autonomous Retry Engine</h3>
              <p className="text-slate-400 font-medium max-w-lg">
                The protocol is currently monitoring 1 pending transaction in the Operational vault. 
                Retries will continue until absolute finality is achieved.
              </p>
            </div>
          </div>
          <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all relative z-10">
            Monitor Node
          </button>
        </section>
      </div>
    </PageTransition>
  );
}

function FilterPill({ label, active }: any) {
  return (
    <button className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-200'
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
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.color}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span className="text-[10px] font-black uppercase tracking-widest">{config.text}</span>
    </div>
  );
}
