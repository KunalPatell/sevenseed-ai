import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AVP Charitable Trust — AI for Social Impact & Welfare",
  description: "AVP Charitable Trust is a registered non-profit organization in Gujarat, India, delivering transparent education, healthcare, and community welfare programs.",
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
      <body className="min-h-full bg-[#070405] text-[#faf5f6]">
        {children}
      </body>
    </html>
  );
}
