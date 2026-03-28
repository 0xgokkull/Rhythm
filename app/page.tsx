'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Mail, Phone, Loader2 } from 'lucide-react';

export default function SplashPage() {
  const router = useRouter();
  const [step, setStep] = useState<'splash' | 'auth' | 'loading'>('splash');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('auth');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    setStep('loading');
    setTimeout(() => {
      router.push('/setup');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-8">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <div className="relative w-32 h-32 mb-6">
              <Image 
                src="/logo.png" 
                alt="Rhythm Logo" 
                fill 
                className="object-contain"
                priority
              />
              <motion.div 
                className="absolute inset-0 rounded-full bg-[#00EF8B] opacity-20 blur-2xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        )}

        {step === 'auth' && (
          <motion.div
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-3 tracking-tight">Welcome to Rhythm</h1>
              <p className="text-[#888888] text-lg">Your salary, on autopilot.</p>
            </div>

            <div className="space-y-6">
              <div className="glass p-1 flex items-center gap-2 pr-4">
                <div className="bg-[#121212] p-3 rounded-2xl">
                  <Mail className="w-5 h-5 text-[#888888]" />
                </div>
                <input 
                  type="text" 
                  placeholder="Email or Phone" 
                  className="flex-1 py-3 bg-transparent text-white text-lg"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!inputValue}
                className="w-full bg-[#00EF8B] text-black font-bold py-5 rounded-3xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-4 py-4">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[#555555] text-sm uppercase tracking-widest">or</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="glass py-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-black font-bold text-[10px]">G</span>
                  </div>
                  Google
                </button>
                <button className="glass py-4 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
                    <span className="text-black font-bold text-[10px]"></span>
                  </div>
                  Apple
                </button>
              </div>
            </div>

            <p className="mt-12 text-center text-[#555555] text-sm px-8">
              By continuing, you agree to our <span className="text-[#888888]">Terms</span> & <span className="text-[#888888]">Privacy</span>
            </p>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#00EF8B] animate-spin" />
              <motion.div 
                className="absolute inset-0 bg-[#00EF8B] opacity-20 blur-xl rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <p className="text-[#888888] animate-pulse">Setting up your secure vault...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
