'use client';

import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function TopHeader() {
  const pathname = usePathname();
  
  // Format pathname for breadcrumb (e.g., /dashboard -> Dashboard)
  const getTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Welcome Back';
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  };

  return (
    <header className="glass-flow h-24 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-white/60">
      {/* Title / Breadcrumb */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">{getTitle()}</h2>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          <span>Rhythm</span>
          <span className="opacity-30">/</span>
          <span className="text-primary">{getTitle()}</span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-8">
        {/* Search */}
        <div className="relative group hidden xl:block">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-all duration-300" />
          <input 
            type="text" 
            placeholder="Search flow, transactions, vaults..." 
            className="input-web pl-14 w-96 h-14 bg-white/50 border-slate-100 hover:border-slate-200"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all duration-300 group shadow-sm hover:shadow-flow-ambient">
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
          <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-5 pl-8 border-l border-slate-100 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">Gokul Rhythm</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Standard User • Flow Testnet</p>
          </div>
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px] shadow-lg shadow-primary/10 group-hover:shadow-primary/20 transition-all duration-300">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                <User className="w-7 h-7 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-md border border-slate-50">
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
