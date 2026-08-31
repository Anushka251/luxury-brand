import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
} from "next/font/google";

import "./globals.css";

import LayoutWrapper from "./components/LayoutWrapper";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./components/AuthProvider";

import Script from "next/script";
import type { ReactNode } from "react";
import type { Metadata } from "next";

/*
 * =========================================================
 * FONTS
 * =========================================================
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const avenorFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300"],
  variable: "--font-avenor",
});

/*
 * =========================================================
 * AVENOR SEO / METADATA
 * =========================================================
 */

export const metadata: Metadata = {
  /*
   * Browser title + Google title
   */
  title: {
    default:
      "AVENOR — Modern Couture & Silent Luxury",
    template:
      "%s | AVENOR",
  },

  /*
   * Google search description
   */
  description:
    "AVENOR is a contemporary fashion house creating limited-edition couture through thoughtful design, refined craftsmanship, and quiet luxury. Discover the AVENOR collection.",

  /*
   * Search keywords
   */
  keywords: [
    "AVENOR",
    "AVENOR Collection",
    "modern couture",
    "silent luxury",
    "limited edition fashion",
    "contemporary fashion",
    "luxury fashion",
    "couture",
    "refined craftsmanship",
  ],

  /*
   * Canonical website
   */
  metadataBase:
    new URL(
      "https://avenorcollection.com"
    ),

  alternates: {
    canonical: "/",
  },

  /*
   * Search engine instructions
   */
  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      "max-image-preview":
        "large",

      "max-snippet": -1,

      "max-video-preview":
        -1,
    },
  },

  /*
   * Browser icon
   */
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  /*
   * =======================================================
   * OPEN GRAPH
   * =======================================================
   *
   * Used when AVENOR is shared on:
   * Instagram
   * WhatsApp
   * Facebook
   * iMessage
   * etc.
   */

  openGraph: {
    type: "website",

    url:
      "https://avenorcollection.com",

    siteName: "AVENOR",

    title:
      "AVENOR — Modern Couture & Silent Luxury",

    description:
      "A contemporary fashion house creating limited-edition couture through thoughtful design, refined craftsmanship, and quiet luxury.",

    locale: "en_IN",

    /*
     * If you have an OG image, place it at:
     *
     * /public/avenor-hero2.jpg
     *
     * Otherwise remove this images section.
     */

    images: [
      {
        url: "/avenor-hero2.jpg",

        width: 1200,

        height: 630,

        alt:
          "AVENOR — Modern Couture & Silent Luxury",
      },
    ],
  },

  /*
   * =======================================================
   * TWITTER / X
   * =======================================================
   */

  twitter: {
    card:
      "summary_large_image",

    title:
      "AVENOR — Modern Couture & Silent Luxury",

    description:
      "Limited-edition couture created through thoughtful design, refined craftsmanship, and quiet luxury.",

    images: [
      "/avenor-hero2.jpg",
    ],
  },

  /*
   * =======================================================
   * OTHER
   * =======================================================
   */

  applicationName:
    "AVENOR",

  creator:
    "AVENOR",

  publisher:
    "AVENOR",

  category:
    "fashion",
};

/*
 * =========================================================
 * ROOT LAYOUT
 * =========================================================
 */

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${avenorFont.variable}
          antialiased
        `}
      >

        {/* ================================================= */}
        {/* CASHFREE */}
        {/* ================================================= */}

        <Script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="beforeInteractive"
        />

        {/* ================================================= */}
        {/* AUTH */}
        {/* ================================================= */}

        <AuthProvider>

          {/* ================================================= */}
          {/* CART */}
          {/* ================================================= */}

          <CartProvider>

            {/* ================================================= */}
            {/* SITE */}
            {/* ================================================= */}

            <LayoutWrapper>
              {children}
            </LayoutWrapper>

          </CartProvider>

        </AuthProvider>

      </body>
    </html>
  );
}
