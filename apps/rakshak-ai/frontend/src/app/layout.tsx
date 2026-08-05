import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rakshak AI — Vision Security & Workplace Safety Suite",
  description: "AI-powered vision security suite featuring live mask detection, facial attendance recognition.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#070507] text-[#faf5f6] antialiased">
        {children}
      </body>
    </html>
  );
}
