'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Settings, 
  LayoutPanelLeft,
  ChevronLeft,
  Zap
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Vaults', href: '/vault' },
  { icon: History, label: 'Activity', href: '/activity' },
  { icon: LayoutPanelLeft, label: 'Setup', href: '/setup' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }: any) {
  const pathname = usePathname();

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col z-50 ${
        isCollapsed ? 'w-[80px]' : 'w-[280px]'
      }`}
    >
      {}
      <div className={`h-20 flex items-center shrink-0 border-b border-slate-100 transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-lg shadow-primary/10">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-black tracking-tighter text-slate-900"
            >
              Rhythm
            </motion.span>
          )}
        </Link>
      </div>

      {}
      <nav className={`flex-1 py-4 space-y-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-xl transition-all duration-200 group relative ${
                isCollapsed ? 'justify-center p-3' : 'px-4 py-3'
              } ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-[20px] h-[20px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} transition-colors`} />
              {!isCollapsed && (
                <span className="text-sm font-bold tracking-tight">
                  {item.label}
                </span>
              )}
              {}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {}
      <div className={`shrink-0 border-t border-slate-100 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center rounded-xl hover:bg-slate-50 transition-all duration-200 text-slate-400 hover:text-slate-600 group ${
            isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
          }`}
        >
          <ChevronLeft className={`w-[20px] h-[20px] transition-transform duration-300 shrink-0 ${isCollapsed ? 'rotate-180' : ''}`} />
          {!isCollapsed && <span className="text-sm font-bold tracking-tight">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
