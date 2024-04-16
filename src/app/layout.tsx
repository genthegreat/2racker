import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "./nav";
import Footer from "./footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "2racker App",
  description: "Payment Plane Tracker by Prince Kwesi",
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
        <header>
          <Navigation />
        </header>
        <h1 className="overline text-2xl mt-4">Prince&#39;s Portfolio</h1>
        <main>
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
