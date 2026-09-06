import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOD — Global Opportunity Detector",
  description: "Web3 AI Trading & Opportunity Intelligence Platform (100% Real Data)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
