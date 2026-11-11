import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/Navbar";

export const metadata: Metadata = {
  title: "Sevenseed | Ecosystem of Intelligent Ventures",
  description: "Sevenseed is an AI venture studio building nine AI-native companies across six industries on one shared AI stack. Try the tools live.",
  openGraph: {
    title: "Sevenseed: AI-native companies from seed to scale",
    description: "Nine ventures, six industries, one shared AI stack. Every tool is live.",
    images: [{ url: "/media/sevenseed-tour-poster.jpg", width: 1600, height: 900 }],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preload" href="/media/fonts/plus-jakarta-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#07090d] text-slate-100 antialiased min-h-screen pt-16">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
