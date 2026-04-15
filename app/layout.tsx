import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./components/AuthProvider";
import Script from "next/script"; // ✅ ADD THIS

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata = {
  title: "Avenor | Luxury Fashion Brand",
  description: "Luxury fashion by Avenor",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        {/* ✅ RAZORPAY SCRIPT (VERY IMPORTANT) */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
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