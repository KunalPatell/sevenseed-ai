import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  title: "Sevenseed | Ecosystem of Intelligent Ventures",
  description: "Next-generation conglomerate driving AI, E-Commerce, Education, Health, and Automation ventures.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#030712] text-slate-100 antialiased min-h-screen pt-16">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
