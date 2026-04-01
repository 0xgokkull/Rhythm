import { Outfit } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import RootLayoutWrapper from "./RootLayoutWrapper";
import logo from "./logo.png";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#00BA7A",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Rhythm | Automated DeFi Execution on Flow",
    template: "%s | Rhythm"
  },
  description: "Rhythm is the premier DeFi automation layer for Flow EVM. Automatically split, manage, and execute vault distributions across savings, bills, and spending buckets with 24/7 on-chain indexing.",
  keywords: ["Rhythm", "Flow EVM", "DeFi Automation", "Smart Execution", "Flow Blockchain", "Treasury Management", "Yield Optimizer"],
  authors: [{ name: "Rhythm Protocol" }],
  metadataBase: new URL("https://rhythm.finance"),
  icons: {
    icon: logo.src,
    shortcut: logo.src,
    apple: logo.src,
  },
  openGraph: {
    title: "Rhythm | Smart DeFi Automation",
    description: "Manage your assets effortlessly with Flow's smart automation engine. Real-time indexing and automated execution for the modern DeFi user.",
    type: "website",
    siteName: "Rhythm",
    images: [
      {
        url: logo.src,
        width: 800,
        height: 800,
        alt: "Rhythm Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rhythm | Automated DeFi",
    description: "Multi-bucket treasury at your fingertips on Flow EVM.",
    images: [logo.src],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} font-outfit antialiased bg-slate-50`} suppressHydrationWarning>
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
      </body>
    </html>
  );
}
