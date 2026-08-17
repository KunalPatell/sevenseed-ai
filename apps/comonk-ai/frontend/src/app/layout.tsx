import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comonk AI — Enterprise Career Intelligence Platform",
  description: "Free AI-powered career intelligence: resume parsing, company matching, mock interviews, ATS optimization, and more — 100% free career tools.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="min-h-full bg-[#060609] text-[#eeeef8]">
        {children}
      </body>
    </html>
  );
}
