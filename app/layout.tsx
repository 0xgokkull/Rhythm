import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopHeader from "@/components/TopHeader";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rhythm — Dynamic Salary Autopilot",
  description: "Automate your financial flow with a wide-screen, premium dashboard.",
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <div className="flex min-h-screen bg-slate-50">
          {/* Sidebar - Fixed on Desktop */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <TopHeader />
            <main className="flex-1 overflow-y-auto">
              <div className="wide-container">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
