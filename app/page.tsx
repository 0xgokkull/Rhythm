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

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-20 relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'auth' && (
          <motion.div
            key="auth"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-24 items-center px-10 relative z-10"
          >
            {/* Left Side: Brand & Value Prop */}
            <div className="space-y-16">
              <motion.div className="space-y-8" variants={itemVariants}>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-primary/30 mb-12"
                >
                  <Zap className="w-12 h-12 fill-current" />
                </motion.div>
                <h1 className="text-8xl font-black tracking-[-0.04em] text-slate-900 leading-[0.95]">
                  Your Flow, <br />
                  <span className="text-primary italic">on Autopilot.</span>
                </h1>
                <p className="text-2xl text-slate-500 font-medium max-w-xl leading-relaxed">
                  The ultimate financial engine for the Flow ecosystem. 
                  Automate savings, bills, and yield with institutional precision.
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
                variants={itemVariants}
              >
                <FeatureMini icon={Shield} label="Non-Custodial" desc="Full asset control via Secure Enclave" />
                <FeatureMini icon={Cpu} label="Smart Execution" desc="Automated on-chain distribution" />
                <FeatureMini icon={TrendingUp} label="Yield Optimized" desc="Maximum capital efficiency protocols" />
                <FeatureMini icon={Zap} label="Instant Flow" desc="High-throughput net settlements" />
              </motion.div>
            </div>

            {/* Right Side: Auth Card */}
            <motion.div 
              variants={itemVariants}
              className="card-web p-16 space-y-12 relative group"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors duration-1000" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[100px] -z-10 group-hover:bg-accent/20 transition-colors duration-1000" />
              
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Access Dashboard</h2>
                <p className="text-lg text-slate-500 font-medium tracking-tight">Connect your identity to the Flow network.</p>
              </div>

              {/* Auth Form */}
              <div className="space-y-10">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                    <Mail className="w-6 h-6 text-slate-300 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Work Email or Phone" 
                    className="input-web pl-20 h-20 text-xl"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleNext}
                  disabled={!inputValue}
                  className="btn-web-primary w-full h-20 text-xl group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Rhythm
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                </button>

                <div className="flex items-center gap-8 py-2">
                  <div className="h-[1px] flex-1 bg-slate-100" />
                  <span className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Institutional SSO</span>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <SocialBtn icon={<Terminal className="w-6 h-6 text-slate-900" />} label="Terminal" />
                  <SocialBtn icon={<Apple className="w-6 h-6 text-slate-900" />} label="Apple" />
                </div>
              </div>

              <p className="text-center text-slate-400 text-sm leading-relaxed font-medium">
                By signing in, you agree to our <br />
                <span className="text-primary font-bold hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary font-bold hover:underline cursor-pointer">Privacy Policy</span>
              </p>
            </motion.div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-16"
          >
            <div className="relative w-32 h-32">
              <Loader2 className="w-32 h-32 text-primary animate-spin-slow stroke-[1.5]" />
              <motion.div 
                className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full"
                animate={{ scale: [1, 2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div className="text-center space-y-6">
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter">Syncing Accounts</h3>
              <p className="text-2xl text-slate-400 font-light max-w-lg">Decrypting secure vaults and connecting to Flow nodes...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeatureMini({ icon: Icon, label, desc }: any) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="p-4 bg-white shadow-xl shadow-slate-100 rounded-2xl text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-extrabold text-slate-900 text-lg leading-tight mb-1">{label}</h4>
        <p className="text-sm text-slate-500 font-medium leading-snug tracking-tight">{desc}</p>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }: any) {
  return (
    <button className="flex items-center justify-center gap-4 py-6 px-8 border-2 border-slate-50 rounded-[28px] hover:bg-white hover:border-primary/20 hover:shadow-xl transition-all duration-500 font-black text-sm text-slate-900 active:scale-95">
      {icon}
      {label}
    </button>
  );
}
