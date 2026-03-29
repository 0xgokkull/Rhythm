"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Zap, Shield, Laptop, Coins, Globe, Cpu } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState<'auth' | 'loading'>('auth');

  const handleConnect = () => {
    setStep('loading');
    setTimeout(() => {
      router.push('/dashboard');
    }, 2500);
  };

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
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#01281A] relative overflow-hidden selection:bg-primary/30">
      
      {/* Flow Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2" />
      
      <AnimatePresence mode="wait">
        {step === 'auth' && (
          <motion.div
            key="auth"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-7xl px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"
          >
            {/* Left: Branding */}
            <div className="space-y-12">
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-flow-glow" />
                  <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">Flow Mainnet Phase 1</span>
                </div>
                <h1 className="text-8xl font-black text-white tracking-tighter leading-[0.9] flex flex-col">
                  <span>Rhythm</span>
                  <span className="text-primary tracking-[-0.05em] flex items-center gap-4 italic h-[1.1em]">
                    Autopilot
                    <Zap className="w-16 h-16 fill-current mt-2" />
                  </span>
                </h1>
                <p className="text-2xl text-white/40 font-medium max-w-xl leading-relaxed tracking-tight">
                  The institutional asset engine for the Flow ecosystem. 
                  Automate on-chain distribution with non-custodial precision.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-8 pr-12">
                <FeatureSmall icon={Shield} title="Secure Enclave" />
                <FeatureSmall icon={Coins} title="Yield Optimization" />
                <FeatureSmall icon={Globe} title="Global Liquidity" />
                <FeatureSmall icon={Cpu} title="Smart Execution" />
              </motion.div>
            </div>

            {/* Right: Connection Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[64px] p-16 space-y-12 relative group"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-white tracking-tighter">Enter Terminal</h2>
                <p className="text-lg text-white/40 font-medium tracking-tight">Connect your identity to the Flow network infrastructure.</p>
              </div>

              <div className="space-y-6">
                <button
                  onClick={handleConnect}
                  className="w-full h-24 bg-primary text-[#01281A] rounded-[32px] font-black text-2xl flex items-center justify-center gap-4 hover:scale-[1.02] hover:shadow-[0_0_60px_-10px_rgba(0,239,139,0.5)] transition-all duration-500 active:scale-95 group/btn"
                >
                  <Laptop className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                  Connect Wallet
                  <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </button>

                <p className="text-center text-white/20 text-xs font-medium px-8 leading-relaxed">
                  By connecting, you certify that you are authorized to manage these assets under the 
                  <span className="text-white/40 hover:text-primary transition-colors cursor-pointer"> Rhythm Protocol Terms</span>.
                </p>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">v1.0.4-BETA</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-12"
          >
            <div className="relative">
              <Loader2 className="w-40 h-40 text-primary animate-spin-slow stroke-[1]" />
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-pulse" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-4xl font-black text-white tracking-tighter">Handshaking...</h3>
              <p className="text-xl text-white/30 font-medium">Syncing secure enclave with Flow testnet nodes</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-12 text-white/10 text-xs font-black uppercase tracking-[0.5em] flex items-center gap-6">
        <span>Institutional</span>
        <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
        <span>Non-Custodial</span>
        <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
        <span>Autonomous</span>
      </div>
    </div>
  );
}

function FeatureSmall({ icon: Icon, title }: any) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-500">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-sm text-white/40 font-bold group-hover:text-white transition-colors duration-500">{title}</span>
    </div>
  );
}
