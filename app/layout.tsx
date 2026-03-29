"use client";

import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";
import { useState } from "react";
import { usePathname } from "next/navigation";

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
        <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
          {/* Sidebar - Fixed (Hidden on Landing) */}
          {!isLanding && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
          
          {/* Main Content Area - Pushed by Sidebar width (No push on Landing) */}
          <div 
            className={`flex-1 flex flex-col min-w-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isLanding ? 'pl-0' : (isCollapsed ? 'pl-24' : 'pl-80')
            }`}
          >
            {!isLanding && <TopHeader />}
            <main className="flex-1">
              <div className={`${isLanding ? '' : 'wide-container py-12'}`}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
