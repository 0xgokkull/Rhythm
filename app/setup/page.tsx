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
      <div className="space-y-10">
        <header className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Configure Autopilot</h1>
            <p className="text-slate-500 font-medium">Define your monthly flow distribution protocol.</p>
          </div>
          <button 
            onClick={() => router.back()} 
            className="p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-500 font-bold text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Configuration Controls */}
          <div className="space-y-8">
            <div className="card-web p-10 space-y-8">
              {/* Salary Input */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Monthly Inflow (Expected)</label>
                <div className="relative group">
                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-xl font-black text-slate-300 group-focus-within:text-primary transition-colors">FLOW</span>
                  <input 
                    type="text" 
                    value={salary} 
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] pl-24 pr-8 py-8 text-4xl font-bold text-slate-900 focus:outline-none focus:border-primary transition-all text-center"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Distribution Sliders */}
              <div className="space-y-6 pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Rule Distribution (%)</label>
                
                <RuleSliderWeb 
                  label="Wealth Vault (Savings)" 
                  icon={<PiggyBank className="w-5 h-5" />} 
                  value={savings} 
                  onChange={setSavings} 
                  color="text-primary"
                  accent="accent-primary"
                  amount={calculateAmount(savings)}
                />

                <RuleSliderWeb 
                  label="Operational (Bills)" 
                  icon={<Receipt className="w-5 h-5" />} 
                  value={bills} 
                  onChange={setBills} 
                  color="text-secondary"
                  accent="accent-secondary"
                  amount={calculateAmount(bills)}
                />

                <div className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between border border-slate-100 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl text-slate-400">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Spending (Residual)</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Automatic remainder</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900">{spending}%</p>
                    <p className="text-xs text-slate-500 font-bold uppercase">{calculateAmount(spending)}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-web-primary w-full h-20 text-xl font-bold group shadow-2xl shadow-primary/30"
              >
                Activate Protocol
                <Zap className="w-6 h-6 fill-current group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: High-Scale Visualizer */}
          <div className="space-y-8 sticky top-30">
            <div className="card-web p-10 bg-slate-900 text-white border-none shadow-3xl shadow-slate-900/40 relative overflow-hidden h-[740px] flex flex-col">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
              
              <div className="relative z-10 flex items-center justify-between mb-12">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Real-time Visualization</h3>
                  <p className="text-slate-400 font-medium">How your capital expands monthly</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl">
                  <BarChart4 className="w-6 h-6 text-primary" />
                </div>
              </div>

              {/* Wide Visualizer Bar */}
              <div className="flex-1 flex flex-col gap-8 justify-center">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>Protocol Distribution Map</span>
                    <span className="text-primary">Live Preview</span>
                  </div>
                  <div className="h-40 w-full bg-white/5 rounded-[40px] overflow-hidden flex border border-white/10 p-2">
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${savings}%` }}
                      className="h-full bg-primary rounded-[32px] flex items-center justify-center relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                      <span className="text-white font-black text-xl">{savings}%</span>
                    </motion.div>
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${bills}%` }}
                      className="h-full bg-secondary rounded-[32px] flex items-center justify-center mx-1 relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                      <span className="text-white font-black text-xl">{bills}%</span>
                    </motion.div>
                    <motion.div 
                      layout
                      initial={{ width: 0 }}
                      animate={{ width: `${spending}%` }}
                      className="h-full bg-white/10 rounded-[32px] flex items-center justify-center relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]" />
                      <span className="text-white/40 font-black text-xl">{spending}%</span>
                    </motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <PreviewDetail label="Wealth Accumulation" val={calculateAmount(savings)} color="bg-primary" />
                  <PreviewDetail label="Operational Coverage" val={calculateAmount(bills)} color="bg-secondary" />
                  <PreviewDetail label="Lifestyle Index" val={calculateAmount(spending)} color="bg-white/20" />
                </div>
              </div>

              <div className="mt-auto pt-10 border-t border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  Your distribution is optimized for <span className="text-white font-bold tracking-tight">Maximum Asset Compounding</span> based on your current inflow.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}

function RuleSliderWeb({ label, icon, value, onChange, color, accent, amount }: any) {
  return (
    <div className="p-8 border border-slate-100 rounded-[32px] hover:border-primary/20 transition-all bg-white shadow-sm space-y-6 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-4 bg-slate-50 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <span className="font-bold text-slate-900 text-lg">{label}</span>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-black ${color}`}>{value}%</p>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">{amount}</p>
        </div>
      </div>
      <input 
        type="range" 
        min="0" 
        max="80" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full ${accent} h-3 bg-slate-100 rounded-full appearance-none cursor-pointer hover:h-4 transition-all`}
      />
    </div>
  );
}

function PreviewDetail({ label, val, color }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${color} shadow-[0_0_12px_rgba(255,255,255,0.2)]`} />
        <span className="text-slate-400 font-bold text-sm tracking-tight">{label}</span>
      </div>
      <span className="text-xl font-bold text-white">{val}</span>
    </div>
  );
}
