'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PiggyBank,
  Receipt,
  ShoppingBag,
  Zap,
  ArrowRight,
  Settings2,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useSimulation } from '@/context/SimulationContext';

const PRESETS = [
  { id: 'conservative', label: 'Conservative', desc: 'Low risk, steady growth', savings: 20, bills: 50, spend: 30 },
  { id: 'balanced', label: 'Balanced', desc: 'Recommended for most users', savings: 30, bills: 40, spend: 30 },
  { id: 'aggressive', label: 'Aggressive', desc: 'Maximize your savings', savings: 40, bills: 35, spend: 25 },
];

export default function SetupPage() {
  const sim = useSimulation();
  const [deposit, setDeposit] = useState(sim.salary.toString());
  const [activePreset, setActivePreset] = useState('balanced');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savings, setSavings] = useState(sim.rules.savings);
  const [bills, setBills] = useState(sim.rules.bills);
  const [saved, setSaved] = useState(false);

  const spend = 100 - savings - bills;
  const numDeposit = parseFloat(deposit) || 0;
  const savingsAmt = parseFloat(((numDeposit * savings) / 100).toFixed(1));
  const billsAmt = parseFloat(((numDeposit * bills) / 100).toFixed(1));
  const spendAmt = parseFloat((numDeposit - savingsAmt - billsAmt).toFixed(1));

  const selectPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id);
    setSavings(preset.savings);
    setBills(preset.bills);
  };

  const handleSave = () => {
    sim.setRules({ savings, bills, spend });
    sim.setSalary(numDeposit);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
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
        <motion.header variants={itemVariants} className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-0.5">Configure Autopilot</h1>
            <p className="text-xs text-slate-500 font-medium">Set your split rules. Funds auto-allocate on every deposit.</p>
          </div>
        </motion.header>

        {}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {}
          <div className="xl:col-span-7 space-y-5">

            {}
            <motion.div variants={itemVariants} className="card-web p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Test Deposit Amount</label>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[11px] text-amber-700 font-bold uppercase tracking-widest">Demo / Testnet</span>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-2xl font-black text-slate-900 focus:outline-none focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all tracking-tight pr-24"
                  placeholder="500"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 uppercase tracking-widest">FLOW</span>
              </div>
            </motion.div>

            {}
            <motion.div variants={itemVariants} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-900">Choose a Strategy</h3>
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                  <Settings2 className="w-3 h-3" />
                  {showAdvanced ? 'Hide' : 'Advanced'}
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset)}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      activePreset === preset.id 
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' 
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-slate-900">{preset.label}</span>
                      {activePreset === preset.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-[12px] text-slate-500 font-medium mb-3">{preset.desc}</p>
                    <div className="flex gap-1 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary rounded-full" style={{ width: `${preset.savings}%` }} />
                      <div className="bg-secondary rounded-full" style={{ width: `${preset.bills}%` }} />
                      <div className="bg-slate-300 rounded-full" style={{ width: `${100 - preset.savings - preset.bills}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {}
            {showAdvanced && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                <SliderRow label="Savings" icon={<PiggyBank className="w-4 h-4" />} value={savings} onChange={(v: number) => { if (v + bills <= 100) setSavings(v); }} />
                <SliderRow label="Bills" icon={<Receipt className="w-4 h-4" />} value={bills} onChange={(v: number) => { if (v + savings <= 100) setBills(v); }} />
                <div className="card-web p-4 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-100"><ShoppingBag className="w-4 h-4 text-slate-400" /></div>
                    <span className="text-sm font-bold text-slate-600">Spend (remainder)</span>
                  </div>
                  <span className="text-lg font-black text-slate-400">{spend}%</span>
                </div>
              </motion.div>
            )}

            {}
            <motion.div variants={itemVariants}>
              <button 
                onClick={handleSave}
                className={`w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                  saved ? 'bg-emerald-500 text-white' : 'bg-primary text-white hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5'
                }`}
              >
                {saved ? <><CheckCircle2 className="w-4 h-4" /> Rules Saved</> : <><ArrowRight className="w-4 h-4" /> Save Autopilot Rules</>}
              </button>
            </motion.div>
          </div>

          {}
          <div className="xl:col-span-5 space-y-5 xl:sticky xl:top-8">

            {}
            {numDeposit > 0 && (
              <motion.div variants={itemVariants} className="p-6 bg-primary text-white rounded-3xl shadow-lg shadow-primary/20">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-5">
                  Outcome Preview
                </h3>
                <p className="text-[12px] text-white/40 font-black uppercase tracking-widest mb-4">From {numDeposit} FLOW deposit</p>
                
                <div className="space-y-4">
                  <OutcomeRow icon={PiggyBank} label="Savings" pct={savings} amount={savingsAmt} />
                  <OutcomeRow icon={Receipt} label="Bills" pct={bills} amount={billsAmt} />
                  <OutcomeRow icon={ShoppingBag} label="Spend" pct={spend} amount={spendAmt} />
                </div>
                
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[12px] text-white/40 font-black uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    On every deposit
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-white/40 font-black tracking-widest uppercase">
                    <Zap className="w-3.5 h-3.5 fill-current text-secondary" />
                    Gasless
                  </div>
                </div>
              </motion.div>
            )}

            {}
            <motion.div variants={itemVariants} className="card-web p-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4">How Autopilot Works</h4>
              <div className="space-y-3">
                <StepItem num="1" text="Deposit lands in your account" />
                <StepItem num="2" text="System auto-detects the deposit" />
                <StepItem num="3" text="Funds split into vaults by your rules" />
                <StepItem num="4" text="If it fails, retry engine kicks in" />
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary fill-current" />
                <span className="text-[12px] text-slate-400 font-black uppercase tracking-widest">Powered by Flow · Gasless</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </PageTransition>
  );
}

function SliderRow({ label, icon, value, onChange }: any) {
  return (
    <div className="card-web p-4 flex items-center gap-4">
      <div className="flex items-center gap-3 w-28 shrink-0">
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">{icon}</div>
        <span className="text-sm font-bold text-slate-900">{label}</span>
      </div>
      <input type="range" min="0" max="80" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className="flex-1 accent-[#01281A] h-2 bg-slate-100 rounded-full appearance-none cursor-pointer" />
      <span className="text-lg font-black text-slate-900 w-14 text-right">{value}%</span>
    </div>
  );
}

function OutcomeRow({ icon: Icon, label, pct, amount }: any) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-white/10 rounded-xl">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <span className="text-base font-semibold text-white/90">{label}</span>
      </div>
      <div className="text-right">
        <span className="text-2xl font-black">{pct}%</span>
        <p className="text-sm text-white/50 font-medium tracking-tight">= {amount} FLOW</p>
      </div>
    </div>
  );
}

function StepItem({ num, text }: { num: string; text: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="w-7 h-7 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-xs font-black text-primary shrink-0">{num}</div>
      <span className="text-sm text-slate-600 font-medium">{text}</span>
    </div>
  );
}
