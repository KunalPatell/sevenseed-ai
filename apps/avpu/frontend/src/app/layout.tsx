import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AVP University (AVPU) — AI-Powered Digital Learning Hub",
  description: "Experience the next generation of education. AVPU leverages AI tutoring agents, automatic placements matchers, admissions recommendations, and custom study plans.",
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
