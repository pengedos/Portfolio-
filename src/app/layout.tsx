import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "John Eric Malonosan | Freight & Logistics Specialist",
  description: "Freight & Logistics Specialist with 13+ years across multi-modal freight, carrier management, dispatch coordination, track & trace, and OTIF delivery across US, UK, AUS, and NZ markets. ISO 9001:2015 certified.",
  keywords: ["John Eric Malonosan", "freight specialist", "logistics coordinator", "freight dispatcher", "track and trace", "carrier management", "OTIF delivery", "portfolio"],
  authors: [{ name: "John Eric Malonosan" }],
  openGraph: {
    title: "John Eric Malonosan | Freight & Logistics Specialist",
    description: "Freight & Logistics Specialist — 13+ years across multi-modal freight, carrier management, and OTIF delivery.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "John Eric Malonosan | Freight & Logistics Specialist",
    description: "Freight & Logistics Specialist — 13+ years across multi-modal freight, carrier management, and OTIF delivery.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
