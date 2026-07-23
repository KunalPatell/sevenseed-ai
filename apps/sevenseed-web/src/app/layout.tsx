import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sevenseed AI — Startup Super-Suite",
  description: "Unified Free AI Operating Platform for Indian Startups & Founders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
