'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Activity, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Vault', icon: Wallet, path: '/vault' },
    { name: 'Setup', icon: Plus, path: '/setup', primary: true },
    { name: 'Activity', icon: Activity, path: '/activity' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  if (pathname === '/') return null; // Don't show on splash/auth

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-black to-transparent">
      <div className="glass-pill flex items-center justify-between px-4 py-2 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link key={item.path} href={item.path}>
                <div className="relative -top-8 bg-[#00EF8B] p-4 rounded-full shadow-lg shadow-[#00EF8B33] animate-pulse-glow">
                  <Plus className="w-6 h-6 text-black" strokeWidth={3} />
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.path} href={item.path} className="flex flex-col items-center gap-1 relative px-2">
              <Icon 
                className={`w-6 h-6 transition-colors duration-300 ${isActive ? 'text-[#00EF8B]' : 'text-[#888888]'}`} 
              />
              {isActive && (
                <motion.div 
                  layoutId="nav-dot"
                  className="absolute -bottom-1 w-1 h-1 bg-[#00EF8B] rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
