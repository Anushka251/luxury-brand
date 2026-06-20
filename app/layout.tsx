import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./components/AuthProvider";
import Script from "next/script";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Avenor — Contemporary Luxury Fashion",
  description:
    "Avenor is a contemporary luxury house creating limited collections through intentional design, refined craftsmanship, and timeless elegance.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="beforeInteractive"
        />

        <AuthProvider>
          <CartProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
