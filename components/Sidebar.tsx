'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  Settings, 
  LayoutPanelLeft,
  ChevronLeft,
  CreditCard,
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
      className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50 ${
        isCollapsed ? 'w-24' : 'w-72'
      }`}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 border-bottom mb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          {!isCollapsed && (
            <span className="text-2xl font-bold tracking-tight text-slate-900">Rhythm</span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${
                isActive ? 'nav-item-active' : 'nav-item'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'text-primary' : ''}`} />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-slate-100 italic">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-slate-400"
        >
          <ChevronLeft className={`w-6 h-6 transition-transform ${isCollapsed ? 'rotate-180 mx-auto' : ''}`} />
          {!isCollapsed && <span className="text-sm font-medium">Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
