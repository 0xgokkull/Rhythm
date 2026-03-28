'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, PiggyBank, Receipt, ShoppingCart, Sparkles } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function SetupPage() {
  const router = useRouter();
  const [salary, setSalary] = useState('50000');
  const [savings, setSavings] = useState(30);
  const [bills, setBills] = useState(40);

  const spending = 100 - savings - bills;

  const calculateAmount = (percent: number) => {
    const num = parseFloat(salary.replace(/[^0-9]/g, '')) || 0;
    return (num * (percent / 100)).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
  };

  return (
    <PageTransition>
      <div className="max-w-md mx-auto">
        <header className="flex items-center gap-4 mb-10">
          <button onClick={() => router.back()} className="p-2 glass rounded-xl">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Setup Autopilot</h1>
        </header>

        <section className="space-y-8">
          {/* Salary Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#888888] px-1 uppercase tracking-wider">Monthly Salary</label>
            <div className="glass p-6 text-center">
              <span className="text-4xl font-bold flex items-center justify-center gap-2">
                ₹ <input 
                  type="text" 
                  value={salary} 
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-40 text-center"
                />
              </span>
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-6">
            <label className="text-sm font-medium text-[#888888] px-1 uppercase tracking-wider">Rule Distribution</label>
            
            <RuleSlider 
              label="Savings" 
              icon={<PiggyBank className="w-5 h-5" />} 
              value={savings} 
              onChange={setSavings} 
              color="#00EF8B"
              amount={calculateAmount(savings)}
            />

            <RuleSlider 
              label="Bills" 
              icon={<Receipt className="w-5 h-5" />} 
              value={bills} 
              onChange={setBills} 
              color="#FFD600"
              amount={calculateAmount(bills)}
            />

            <div className="glass p-6 flex items-center justify-between opacity-60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-white/50" />
                </div>
                <div>
                  <p className="font-semibold">Spending (Auto)</p>
                  <p className="text-xs text-[#888888]">Everything else</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{spending}%</p>
                <p className="text-xs text-[#888888]">{calculateAmount(spending)}</p>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <motion.div 
            layout
            className="glass bg-gradient-to-br from-[#00EF8B22] to-transparent p-6 relative overflow-hidden group"
          >
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-[#00EF8B33] group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold mb-4">Autopilot Preview</h3>
            <div className="flex items-end gap-2 h-20 mb-4">
              <div style={{ height: `${savings}%` }} className="flex-1 bg-[#00EF8B] rounded-t-lg transition-all duration-500" />
              <div style={{ height: `${bills}%` }} className="flex-1 bg-[#FFD600] rounded-t-lg transition-all duration-500" />
              <div style={{ height: `${spending}%` }} className="flex-1 bg-white/20 rounded-t-lg transition-all duration-500" />
            </div>
            <p className="text-sm text-[#888888]">
              Your salary will be split automatically every 1st of the month.
            </p>
          </motion.div>

          {/* Action */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-[#00EF8B] text-black font-bold py-5 rounded-3xl flex items-center justify-center gap-2 group shadow-lg shadow-[#00EF8B22] hover:scale-[1.02] active:scale-[0.98] transition-all mt-8"
          >
            Activate Autopilot
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>
      </div>
    </PageTransition>
  );
}

function RuleSlider({ label, icon, value, onChange, color, amount }: any) {
  return (
    <div className="glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-xl">
            {icon}
          </div>
          <span className="font-semibold">{label}</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg" style={{ color }}>{value}%</p>
          <p className="text-xs text-[#888888]">{amount}</p>
        </div>
      </div>
      <input 
        type="range" 
        min="0" 
        max="80" 
        value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-[#00EF8B] h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}
