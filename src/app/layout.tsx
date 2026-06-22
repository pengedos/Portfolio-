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
  title: "John Eric Malonosan — Logistics & Supply Chain Developer",
  description: "Portfolio of John Eric Malonosan: developer of Inventory Management PWA, Accounts Receivable Dashboard, and Freight Shipment Tracker.",
  keywords: ["John Eric Malonosan", "logistics developer", "supply chain", "freight tracker", "inventory management", "portfolio"],
  authors: [{ name: "John Eric Malonosan" }],
  openGraph: {
    title: "John Eric Malonosan — Portfolio",
    description: "Logistics & supply chain developer portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "John Eric Malonosan — Portfolio",
    description: "Logistics & supply chain developer portfolio",
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
