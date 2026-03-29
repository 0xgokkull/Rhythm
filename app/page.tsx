"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Loader2, 
  Zap, 
  Shield, 
  CheckCircle2, 
  Wallet,
  Coins,
  Cpu,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2400);
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-primary/10 selection:text-primary">
      
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] opacity-40" />
      </div>

      {/* Hero Section */}
      <main className="relative z-10 pt-16 pb-32">
        <div className="wide-container">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[12px] font-black text-primary uppercase tracking-widest">Built on Flow Testnet</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
              Money on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">Autopilot.</span>
            </motion.h1>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
              The first high-fidelity simulation of institutional-grade DeFi automation. 
              Setup your split rules, deposit FLOW, and watch the engine handle the rest.
            </motion.p>

            {/* CTA Area */}
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="group relative h-20 px-12 bg-primary text-white rounded-2xl font-black text-xl flex items-center justify-center gap-4 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 active:scale-95"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Launching Autopilot...
                  </>
                ) : (
                  <>
                    <Zap className="w-7 h-7 fill-current" />
                    Start Autopilot
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-slate-400 font-black uppercase tracking-widest">Flow Native</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span className="text-sm text-slate-400 font-black uppercase tracking-widest">Automated Splits</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-slate-400 font-black uppercase tracking-widest">Auto-Retry Layer</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32"
          >
            <FeatureCard 
              icon={Coins}
              title="Deposit Detected"
              desc="System monitors your Flow account and detects deposits in real-time."
            />
            <FeatureCard 
              icon={RefreshCw}
              title="On-Chain Splitting"
              desc="Automated allocation into Savings, Bills, and Spend vaults per your rules."
            />
            <FeatureCard 
              icon={TrendingUp}
              title="Engine Resilience"
              desc="Built-in retry logic ensures execution even during network congestion."
            />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-50">
        <div className="wide-container flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm font-black uppercase tracking-widest">
            <Zap className="w-4 h-4 text-primary fill-current" />
            <span>Rhythm Autopilot · Institutional DeFi</span>
          </div>
          <p className="text-slate-300 text-[12px] font-black uppercase tracking-[0.25em]">
            Powered by Flow Blockchain · Gasless Execution
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div variants={itemVariants} className="card-web p-8 text-left group">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">{title}</h3>
      <p className="text-lg text-slate-500 font-medium leading-relaxed leading-relaxed">{desc}</p>
    </motion.div>
  );
}
