"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide on home page
  if (pathname === "/home") return null;

  return (
    <footer className="w-full border-t mt-32 px-12 py-16 text-xs tracking-widest text-gray-500">
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        {/* LEFT */}
        <div className="space-y-4">
          <Link href="/about" className="block hover:text-black transition">
            ABOUT
          </Link>

          <Link href="/policies" className="block hover:text-black transition">
            POLICIES
          </Link>

          <Link href="/support" className="block hover:text-black transition">
            SUPPORT
          </Link>

          <Link href="/returns" className="block hover:text-black transition">
            RETURNS & REFUNDS
          </Link>
        </div>

        {/* RIGHT (SOCIALS) */}
        <div className="space-y-4">
          <a
            href="https://instagram.com/anushka__m25"
            target="_blank"
            className="block hover:text-black transition"
          >
            INSTAGRAM
          </a>

          <a
            href="https://pinterest.com/Avenorcollection"
            target="_blank"
            className="block hover:text-black transition"
          >
            PINTEREST
          </a>

          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=support@avenorcollection.com"
            target="_blank"
            className="block hover:text-black transition"
          >
            CONTACT
          </a>
        </div>

      </div>

      {/* SIGNATURE */}
      <div className="text-center mt-16 text-[10px] tracking-[0.3em] text-gray-400">
        AVENOR
      </div>

    </footer>
  );
}