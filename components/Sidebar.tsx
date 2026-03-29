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
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Vaults', href: '/vault' },
  { icon: History, label: 'Activity', href: '/activity' },
  { icon: LayoutPanelLeft, label: 'Setup', href: '/setup' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`bg-white border-r border-slate-50 transition-all duration-500 ease-in-out flex flex-col z-50 relative ${
        isCollapsed ? 'w-24' : 'w-80'
      }`}
    >
      {/* Logo Section */}
      <div className="h-24 flex items-center px-8 border-b border-slate-50 mb-6">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20"
          >
            <Zap className="w-7 h-7 fill-current" />
          </motion.div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black tracking-tighter text-slate-900"
            >
              Rhythm
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={item.href}
                className={`${
                  isActive ? 'nav-item-active shadow-flow-ambient' : 'nav-item'
                } ${isCollapsed ? 'justify-center px-0' : 'px-8'}`}
              >
                <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                {!isCollapsed && <span className="text-sm tracking-tight">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="ml-auto w-2 h-2 rounded-full bg-primary shadow-flow-glow" 
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className="p-6 border-t border-slate-50">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all duration-300 text-slate-400 group"
        >
          <ChevronLeft className={`w-6 h-6 transition-transform duration-500 group-hover:text-primary ${isCollapsed ? 'rotate-180 mx-auto' : ''}`} />
          {!isCollapsed && <span className="text-sm font-bold tracking-tight group-hover:text-slate-600 transition-colors">Minimize View</span>}
        </button>
      </div>
    </aside>
  );
}
