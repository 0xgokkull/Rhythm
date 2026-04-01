"use client";

import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import OnboardingOverlay from "@/components/OnboardingOverlay";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BackendProvider } from "@/context/BackendContext";

export default function RootLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <BackendProvider>
      {!isLanding && <OnboardingOverlay />}
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {!isLanding && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
        
        <div 
          className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
            isLanding ? 'pl-0' : (isCollapsed ? 'pl-[80px]' : 'pl-[280px]')
          }`}
        >
          {!isLanding && <TopHeader isCollapsed={isCollapsed} />}
          <main className="flex-1 overflow-y-auto">
            <div className={`${isLanding ? '' : 'wide-container py-4'}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </BackendProvider>
  );
}
