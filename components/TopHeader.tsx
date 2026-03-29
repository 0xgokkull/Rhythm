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
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      {/* Title / Breadcrumb */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{getTitle()}</h2>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span>Rhythm</span>
          <span>/</span>
          <span className="text-primary">{getTitle()}</span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="h-11 w-80 bg-slate-50 border border-slate-100 rounded-full pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-medium"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group">
          <Bell className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-4 pl-6 border-l border-slate-100 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Gokul Rhythm</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Standard User • Flow Testnet</p>
          </div>
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px]">
              <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                <User className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
