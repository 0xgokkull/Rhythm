'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw, AlertCircle, Calendar, Filter, ChevronRight } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function ActivityPage() {
  const activities = [
    { id: 1, type: 'SUCCESS', title: 'Salary Split (Savings)', amount: '₹ 15,000', date: 'Mar 01, 2026', time: '09:00 AM' },
    { id: 2, type: 'RETRY', title: 'Salary Split (Bills)', amount: '₹ 20,000', date: 'Mar 01, 2026', time: '09:05 AM', retryCount: 2 },
    { id: 3, type: 'SUCCESS', title: 'Manual Deposit', amount: '₹ 5,000', date: 'Feb 26, 2026', time: '02:30 PM' },
    { id: 4, type: 'FAILED', title: 'Card Payment (Netflix)', amount: '₹ 499', date: 'Feb 24, 2026', time: '11:15 AM' },
  ];

  return (
    <PageTransition>
      <div className="max-w-md mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
            <p className="text-[#888888]">Transaction monitoring & logs</p>
          </div>
          <button className="p-3 glass rounded-2xl hover:bg-white/5 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </header>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-xs font-bold text-[#888888] uppercase tracking-[0.2em] px-1">
            <Calendar className="w-3 h-3" />
            March 2026
          </div>
          
          <div className="space-y-3">
            {activities.map((item, idx) => (
              <ActivityCard key={item.id} item={item} idx={idx} />
            ))}
          </div>
        </div>

        {/* Retry Logs Summary */}
        <section className="glass p-6 bg-gradient-to-br from-[#FFD60011] to-transparent relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/5 rounded-2xl">
              <RotateCcw className="w-5 h-5 text-[#FFD600]" />
            </div>
            <div>
              <h3 className="font-bold">Retry Engine</h3>
              <p className="text-xs text-[#888888]">Automated transaction recovery</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 glass-pill bg-white/5 text-xs font-medium">
            <span className="text-[#888888]">Last retry was successful for </span>
            <span className="text-[#FFD600]">Bills Vault</span>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function ActivityCard({ item, idx }: any) {
  const getIcon = () => {
    switch (item.type) {
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-[#00EF8B]" />;
      case 'RETRY': return <RotateCcw className="w-5 h-5 text-[#FFD600]" />;
      case 'FAILED': return <AlertCircle className="w-5 h-5 text-[#FF4B4B]" />;
      default: return null;
    }
  };

  const getStatusBg = () => {
    switch (item.type) {
      case 'SUCCESS': return 'bg-[#00EF8B11]';
      case 'RETRY': return 'bg-[#FFD60011]';
      case 'FAILED': return 'bg-[#FF4B4B11]';
      default: return 'bg-white/5';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      className="glass p-5 flex items-center justify-between group hover:bg-white/5 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-2xl ${getStatusBg()}`}>
          {getIcon()}
        </div>
        <div>
          <p className="font-bold text-sm">{item.title}</p>
          <p className="text-[10px] text-[#888888] font-medium tracking-wider uppercase">
            {item.date} • {item.time} 
            {item.retryCount && <span className="text-[#FFD600] ml-2">RETRY #{item.retryCount}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-bold">{item.amount}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-[#333333] group-hover:text-[#888888] transition-colors" />
      </div>
    </motion.div>
  );
}
