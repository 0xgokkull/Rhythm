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
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center shrink-0 border-b border-slate-100 transition-all duration-500 ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}>
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
            <Zap className="w-4.5 h-4.5 fill-current" />
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-black tracking-tight text-slate-900"
            >
              Rhythm
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-4 space-y-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 group relative ${
                isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
              } ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} transition-colors`} />
              {!isCollapsed && (
                <span className="text-[13px] font-semibold tracking-tight">
                  {item.label}
                </span>
              )}
              {/* Tooltip on collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className={`shrink-0 border-t border-slate-100 ${isCollapsed ? 'p-2' : 'p-3'}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center rounded-xl hover:bg-slate-50 transition-all duration-200 text-slate-400 hover:text-slate-600 group ${
            isCollapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2.5'
          }`}
        >
          <ChevronLeft className={`w-[18px] h-[18px] transition-transform duration-300 shrink-0 ${isCollapsed ? 'rotate-180' : ''}`} />
          {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
