import type { Metadata } from "next";
import "./globals.css";
import { CyberGridBackground } from "@/components/ui/CyberGridBackground";
import { ParticleCanvas } from "@/components/ui/ParticleCanvas";

export const metadata: Metadata = {
  title: "GOD - Global Opportunity & Data Intelligence",
  description: "Institutional Financial & Multi-Asset Intelligence Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030712] text-slate-100 antialiased min-h-screen flex flex-col relative selection:bg-cyan-500/30 selection:text-cyan-200">
        <CyberGridBackground />
        <ParticleCanvas />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
