"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext"; // client component

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide navbar on home page
  const hideNavbar = pathname === "/" || pathname === "/home";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-ivory text-charcoal`}
      >
        <CartProvider>
          {!hideNavbar && <Navbar />}
          <main className={!hideNavbar ? "pt-24" : ""}>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
