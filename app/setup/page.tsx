'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronLeft, 
  PiggyBank, 
  Receipt, 
  ShoppingCart, 
  Sparkles,
  Zap,
  Target,
  BarChart4
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function SetupPage() {
  const router = useRouter();
  const [salary, setSalary] = useState('5,000');
  const [savings, setSavings] = useState(30);
  const [bills, setBills] = useState(40);

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

  const spending = 100 - savings - bills;

  const calculateAmount = (percent: number) => {
    const num = parseFloat(salary.replace(/[^0-9.]/g, '')) || 0;
    const val = (num * (percent / 100)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${val} FLOW`;
  };

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
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">Configure Autopilot</h1>
            <p className="text-lg text-slate-500 font-medium tracking-tight">Define your monthly institutional flow distribution protocol.</p>
          </div>
          <button 
            onClick={() => router.back()} 
            className="p-4 bg-white border border-slate-100 rounded-[28px] hover:shadow-xl hover:bg-slate-50 transition-all duration-300 flex items-center gap-3 text-slate-500 font-black text-sm uppercase tracking-widest"
          >
            <ChevronLeft className="w-5 h-5" />
            Control Center
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Configuration Controls */}
          <motion.div variants={itemVariants} className="space-y-10">
            <div className="card-web p-12 space-y-12 group/config">
              {/* Salary Input */}
              <div className="space-y-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Institutional Inflow (Monthly)</label>
                <div className="relative group/input">
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-200 group-focus-within/input:text-primary transition-colors duration-500">FLOW</span>
                  <input 
                    type="text" 
                    value={salary} 
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-[40px] pl-28 pr-10 py-10 text-6xl font-black text-slate-900 focus:outline-none focus:border-primary/30 focus:bg-white transition-all text-center tracking-tighter shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Distribution Sliders */}
              <div className="space-y-8 pt-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Protocol Distribution Weighting (%)</label>
                
                <RuleSliderWeb 
                  label="Wealth Vault" 
                  icon={<PiggyBank className="w-6 h-6" />} 
                  value={savings} 
                  onChange={setSavings} 
                  color="text-primary"
                  accent="accent-primary"
                  amount={calculateAmount(savings)}
                />

                <RuleSliderWeb 
                  label="Operational" 
                  icon={<Receipt className="w-6 h-6" />} 
                  value={bills} 
                  onChange={setBills} 
                  color="text-secondary"
                  accent="accent-secondary"
                  amount={calculateAmount(bills)}
                />

                <div className="p-8 bg-slate-50 rounded-[32px] flex items-center justify-between border border-slate-50 opacity-60 hover:opacity-100 transition-opacity duration-500 group/spending">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-white rounded-2xl text-slate-400 group-hover/spending:text-primary transition-colors duration-500">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-lg tracking-tight">Spending Residual</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">Automatic remainder</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{spending}%</p>
                    <p className="text-xs text-slate-500 font-black uppercase tracking-tight">{calculateAmount(spending)}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-web-primary w-full h-24 text-2xl font-black group shadow-3xl shadow-primary/20 tracking-tighter uppercase"
              >
                Activate Protocol
                <Zap className="w-8 h-8 fill-current group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: High-Scale Visualizer */}
          <motion.div variants={itemVariants} className="space-y-10 sticky top-30">
            <div className="card-web p-12 bg-slate-900 text-white border-none shadow-3xl shadow-slate-900/60 relative overflow-hidden h-[820px] flex flex-col group/visualizer">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" 
              />
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0], opacity: [0.1, 0.15, 0.1] }}
                transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px]" 
              />
              
              <div className="relative z-10 flex items-center justify-between mb-16">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">Real-time Visualization</h3>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Scale Analysis Vector</p>
                </div>
                <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl group-hover/visualizer:scale-110 transition-transform duration-700">
                  <BarChart4 className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Wide Visualizer Bar */}
              <div className="flex-1 flex flex-col gap-12 justify-center relative z-10">
                <div className="space-y-6">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    <span>Protocol Distribution Map</span>
                    <span className="text-primary animate-pulse">Live Protocol Active</span>
                  </div>
                  <div className="h-56 w-full bg-white/5 rounded-[48px] overflow-hidden flex border border-white/10 p-3 shadow-inner">
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${savings}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="h-full bg-gradient-to-br from-primary to-secondary rounded-[36px] flex items-center justify-center relative group/bar cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-[36px]" />
                      <span className="text-white font-black text-3xl tracking-tighter">{savings}%</span>
                      {savings > 15 && <div className="absolute -top-12 bg-white text-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity">Wealth Vault</div>}
                    </motion.div>
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${bills}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="h-full bg-white rounded-[36px] flex items-center justify-center mx-2 relative group/bar-white cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/bar-white:opacity-100 transition-opacity rounded-[36px]" />
                      <span className="text-slate-900 font-black text-3xl tracking-tighter">{bills}%</span>
                      {bills > 15 && <div className="absolute -top-12 bg-white text-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover/bar-white:opacity-100 transition-opacity">Operational</div>}
                    </motion.div>
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${spending}%` }}
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      className="h-full bg-white/10 rounded-[36px] flex items-center justify-center relative group/bar-dim cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/bar-dim:opacity-100 transition-opacity rounded-[36px]" />
                      <span className="text-white/40 font-black text-3xl tracking-tighter">{spending}%</span>
                      {spending > 15 && <div className="absolute -top-12 bg-white text-slate-900 px-4 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap opacity-0 group-hover/bar-dim:opacity-100 transition-opacity">Residual</div>}
                    </motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <PreviewDetail label="Wealth Accumulation" val={calculateAmount(savings)} color="bg-primary" />
                  <PreviewDetail label="Operational Coverage" val={calculateAmount(bills)} color="bg-white" />
                  <PreviewDetail label="Lifestyle Index" val={calculateAmount(spending)} color="bg-white/20" />
                </div>
              </div>

              <div className="mt-auto pt-12 border-t border-white/5 flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-[24px] bg-primary/20 flex items-center justify-center border border-primary/20 shadow-2xl group-hover/visualizer:scale-110 transition-transform duration-500">
                  <Sparkles className="w-8 h-8 text-primary shadow-glow" />
                </div>
                <p className="text-base text-slate-400 font-medium leading-relaxed tracking-tight group-hover/visualizer:text-slate-300 transition-colors duration-500">
                  Your current distribution parameters are optimized for <span className="text-white font-black tracking-tighter uppercase text-sm">Institutional Alpha Generation</span> across active protocols.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </PageTransition>
  );
}

function RuleSliderWeb({ label, icon, value, onChange, color, accent, amount }: any) {
  return (
    <div className="p-10 border-2 border-slate-50 rounded-[48px] hover:border-primary/30 transition-all duration-500 bg-white shadow-xl shadow-slate-100/50 space-y-8 group/slider">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className={`p-5 bg-slate-50 rounded-[28px] ${color} group-hover/slider:scale-110 group-hover/slider:bg-primary group-hover/slider:text-white transition-all duration-500`}>
            {icon}
          </div>
          <span className="font-black text-slate-900 text-2xl tracking-tighter">{label}</span>
        </div>
        <div className="text-right">
          <p className={`text-5xl font-black tracking-tighter ${color} leading-none mb-1`}>{value}<span className="text-lg opacity-40 ml-0.5">%</span></p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none">{amount}</p>
        </div>
      </div>
      <div className="relative py-4">
        <input 
          type="range" 
          min="0" 
          max="80" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full ${accent} h-4 bg-slate-50 rounded-full appearance-none cursor-pointer hover:h-5 transition-all outline-none border border-slate-100 shadow-inner`}
        />
      </div>
    </div>
  );
}

function PreviewDetail({ label, val, color }: any) {
  return (
    <div className="flex items-center justify-between p-8 bg-white/5 rounded-[40px] border border-white/5 group hover:bg-white/10 hover:border-white/10 transition-all duration-500 shadow-2xl">
      <div className="flex items-center gap-6">
        <div className={`w-4 h-4 rounded-full ${color} shadow-[0_0_20px_white] opacity-80`} />
        <span className="text-slate-400 font-black text-base uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-2xl font-black text-white tracking-tighter">{val}</span>
    </div>
  );
}

