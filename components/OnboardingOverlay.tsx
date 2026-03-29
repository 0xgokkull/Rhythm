'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Coins, RefreshCw, CheckCircle2, X } from 'lucide-react';

export default function OnboardingOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('rhythm_onboarding_seen');
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('rhythm_onboarding_seen', 'true');
  };

  const steps = [
    {
      icon: Coins,
      title: "Flow Deposit Detected",
      desc: "Rhythm monitors your account 24/7. When a deposit lands, the engine springs into action instantly.",
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: RefreshCw,
      title: "Automated Allocation",
      desc: "Funds are automatically split between your Savings, Bills, and Spend vaults based on your exact rules.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: CheckCircle2,
      title: "On-Chain Success",
      desc: "Every move is executed on-chain via Flow Scheduled Transactions. Secure, gasless, and verifiable.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden relative"
          >
            <button 
              onClick={handleDismiss}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-10 pt-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl text-white shadow-xl shadow-primary/20 mb-8">
                <Zap className="w-8 h-8 fill-current" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
                The Autopilot Loop
              </h2>
              <p className="text-slate-500 font-medium mb-12">
                Understand how Rhythm manages your capital in 3 simple steps.
              </p>

              <div className="space-y-6 text-left">
                {steps.map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`p-3 rounded-xl ${s.bg} ${s.color} shrink-0`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 tracking-tight">{s.title}</h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={handleDismiss}
                className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-base mt-12 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
              >
                Start Using Autopilot
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
