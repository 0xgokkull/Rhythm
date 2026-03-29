'use client';

import { 
  Bell, 
  Search, 
  User,
  Zap
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function TopHeader({ isCollapsed }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  
  const getTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return 'Welcome Back';
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
  };

  return (
    <header className="h-16 px-8 flex items-center justify-between z-40 bg-white border-b border-slate-100 shrink-0">
      {/* Left: Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">{getTitle()}</h2>
        <span className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">/ Rhythm</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Testnet Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-lg">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          <span className="text-[11px] text-amber-700 font-bold uppercase tracking-widest">Testnet</span>
        </div>

        {/* Search */}
        <div className="relative group hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 w-60 h-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white hover:border-slate-300 transition-all">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors leading-none">Gokul</p>
            <p className="text-[11px] text-slate-400 font-bold leading-none mt-1">Flow Testnet</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center">
            <User className="w-4.5 h-4.5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
