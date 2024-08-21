import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./nav";
import Footer from "./footer";
import { Providers } from "@/components/provider/ProfileProvider";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2racker | Debt Payment Planner by Prince Kwesi",
  description: "Stay Organized, Pay On Time, and Reduce Your Debt",
  icons: {
    icon: "./favicon.ico",
    apple: "../public/favicon/apple-touch-icon.png"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header>
            <Navigation />
          </header>
          <main>
            {children}
            <Script src='https://challenges.cloudflare.com/turnstile/v0/api.js' async defer></Script>
          </main>
          <footer>
            <Footer />
          </footer>
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
