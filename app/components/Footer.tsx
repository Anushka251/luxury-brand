"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-32 px-12 py-16 text-xs tracking-widest text-gray-500">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        {/* LEFT */}
        <div className="space-y-4">
          <Link
            href="/about"
            className="block hover:text-black transition"
          >
            ABOUT
          </Link>

          <Link
            href="/policies"
            className="block hover:text-black transition"
          >
            POLICIES
          </Link>

          <Link
            href="/support"
            className="block hover:text-black transition"
          >
            SUPPORT
          </Link>

          <Link
            href="/shipping"
            className="block hover:text-black transition"
          >
            SHIPPING
          </Link>

          <Link
            href="/returns"
            className="block hover:text-black transition"
          >
            RETURNS & EXCHANGES
          </Link>

          <Link
            href="/privacy"
            className="block hover:text-black transition"
          >
            PRIVACY
          </Link>

          <Link
            href="/terms"
            className="block hover:text-black transition"
          >
            TERMS & CONDITIONS
          </Link>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <a
            href="https://instagram.com/_anushka__meena_"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-black transition"
          >
            INSTAGRAM
          </a>

          <a
            href="https://pinterest.com/Avenorcollection"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-black transition"
          >
            PINTEREST
          </a>

          <a
            href="mailto:support@avenorcollection.com?subject=Avenor%20Inquiry"
            className="block hover:text-black transition"
          >
            CONTACT
          </a>
        </div>
      </div>

      {/* SIGNATURE */}
      <div
        className="
          text-center
          mt-24
          text-[32px]
          md:text-[42px]
          tracking-[0.38em]
          text-gray-500
          font-light
        "
        style={{
          fontFamily: '"Avenir Next", "Avenir", sans-serif',
        }}
      >
        AVENOR
        <span className="text-[12px] align-top ml-1">
          ™
        </span>
      </div>
    </footer>
  );
}
