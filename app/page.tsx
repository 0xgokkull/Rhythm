'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Mail, Loader2, Apple, Terminal, Shield, Zap, TrendingUp, Cpu } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'auth' | 'loading'>('auth');
  const [inputValue, setInputValue] = useState('');

  const handleNext = () => {
    setStep('loading');
    setTimeout(() => {
      router.push('/setup');
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-20">
      <AnimatePresence mode="wait">
        {step === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-6"
          >
            {/* Left Side: Brand & Value Prop */}
            <div className="space-y-12">
              <div className="space-y-6">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/40 mb-8"
                >
                  <Zap className="w-10 h-10 fill-current" />
                </motion.div>
                <h1 className="text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1]">
                  Your Flow, <br />
                  <span className="text-primary">on Autopilot.</span>
                </h1>
                <p className="text-2xl text-slate-500 font-light max-w-lg leading-relaxed">
                  The ultimate financial engine for the Flow ecosystem. 
                  Automate savings, bills, and yield in one click.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <FeatureMini icon={Shield} label="Non-Custodial" desc="Full asset control" />
                <FeatureMini icon={Cpu} label="Smart Execution" desc="Auto-split protocol" />
                <FeatureMini icon={TrendingUp} label="Yield Optimized" desc="Max capital efficiency" />
                <FeatureMini icon={Zap} label="Instant Flow" desc="On-chain settlements" />
              </div>
            </div>

            {/* Right Side: Auth Card */}
            <div className="card-web p-12 space-y-10 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Access Dashboard</h2>
                <p className="text-slate-500">Secure entry with institutional-grade auth.</p>
              </div>

              {/* Auth Form */}
              <div className="space-y-8">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Work Email or Phone" 
                    className="input-web pl-16 h-16"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleNext}
                  disabled={!inputValue}
                  className="btn-web-primary w-full h-16 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Rhythm
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-6 py-2">
                  <div className="h-[1px] flex-1 bg-slate-100" />
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">or SSO</span>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <SocialBtn icon={<Terminal className="w-5 h-5 text-slate-900" />} label="Terminal" />
                  <SocialBtn icon={<Apple className="w-5 h-5 text-slate-900" />} label="Apple" />
                </div>
              </div>

              <p className="text-center text-slate-400 text-sm leading-relaxed">
                By signing in, you agree to our <br />
                <span className="text-slate-600 font-bold hover:text-primary transition-colors cursor-pointer">Terms of Service</span> and <span className="text-slate-600 font-bold hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
              </p>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="relative w-24 h-24">
              <Loader2 className="w-24 h-24 text-primary animate-spin" />
              <motion.div 
                className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
                animate={{ scale: [1, 2, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Syncing Accounts</h3>
              <p className="text-xl text-slate-500 font-light">Decrypting secure vaults and connecting protocol nodes...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureMini({ icon: Icon, label, desc }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-white shadow-lg shadow-slate-200/50 rounded-2xl text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{label}</h4>
        <p className="text-xs text-slate-500 font-medium leading-tight">{desc}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }: any) {
  return (
    <button className="flex items-center justify-center gap-3 py-5 px-6 border border-slate-100 rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all font-bold text-sm text-slate-900">
      {icon}
      {label}
    </button>
  );
}
