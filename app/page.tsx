"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Zap, Shield, Mail, Lock, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'auth' | 'loading'>('auth');
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-white">
      
      {/* Subtle ambient gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
      
      <AnimatePresence mode="wait">
        {step === 'auth' && (
          <motion.div
            key="auth"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full max-w-md px-6 relative z-10"
          >
            {/* Logo */}
            <motion.div variants={itemVariants} className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20 mb-6">
                <Zap className="w-7 h-7 fill-current" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome to Rhythm</h1>
              <p className="text-sm text-slate-500 font-medium">
                Your money runs on autopilot. Powered by <span className="text-primary font-bold">Flow</span>.
              </p>
            </motion.div>

            {/* Login Form */}
            <motion.form variants={itemVariants} onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary/40 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 active:scale-[0.98] group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.form>

            <motion.div variants={itemVariants} className="mt-6 space-y-4">
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">no wallet needed</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Feature icon={Shield} label="Non-custodial" />
                <Feature icon={Zap} label="Gasless" />
                <Feature icon={CheckCircle2} label="Auto-retry" />
              </div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-[10px] text-slate-400 font-medium mt-8 leading-relaxed">
              A wallet is created automatically for you on the Flow network.<br />
              No extensions. No gas fees. No friction.
            </motion.p>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Creating your account...</h3>
              <p className="text-xs text-slate-500">Setting up wallet on Flow • No gas fees</p>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Step label="Wallet" done />
              <div className="w-6 h-px bg-slate-200" />
              <Step label="Vaults" done />
              <div className="w-6 h-px bg-slate-200" />
              <Step label="Autopilot" active />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[10px] text-slate-300 font-bold">
        <Zap className="w-3 h-3 fill-current text-primary" />
        <span>Scheduled on-chain · Gasless execution · Powered by Flow</span>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, label }: any) {
  return (
    <div className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-[10px] text-slate-500 font-bold">{label}</span>
    </div>
  );
}

function Step({ label, done, active }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
        done ? 'bg-primary text-white' : active ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-slate-100 text-slate-400'
      }`}>
        {done ? <CheckCircle2 className="w-3 h-3" /> : ''}
      </div>
      <span className={`text-[10px] font-bold ${done ? 'text-primary' : active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}
