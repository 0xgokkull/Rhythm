"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { SimulationProvider } from "@/context/SimulationContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <SimulationProvider>
          <div className="flex h-screen bg-slate-50 overflow-hidden">
            {!isLanding && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
            
            <div 
              className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
                isLanding ? 'pl-0' : (isCollapsed ? 'pl-[72px]' : 'pl-[240px]')
              }`}
            >
              {!isLanding && <TopHeader isCollapsed={isCollapsed} />}
              <main className="flex-1 overflow-y-auto">
                <div className={`${isLanding ? '' : 'wide-container py-8'}`}>
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SimulationProvider>
      </body>
    </html>
  );
}
