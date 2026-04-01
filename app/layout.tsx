"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // 👈 ADD THIS
import { usePathname } from "next/navigation";
import { CartProvider } from "./context/CartContext";

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

  // Hide navbar & footer on home page
  const hideLayout = pathname === "/" || pathname === "/home";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-ivory text-charcoal`}
      >
        <CartProvider>

          {/* NAVBAR */}
          {!hideLayout && <Navbar />}

          {/* PAGE CONTENT */}
          <main className={!hideLayout ? "pt-24" : ""}>
            {children}
          </main>

          {/* FOOTER */}
          {!hideLayout && <Footer />}

        </CartProvider>
      </body>
    </html>
  );
}