"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">

      {/* Full-screen hero image */}
      <Image
        src="/logo-hero-g3.png"
        alt="AVENOR"
        fill
        priority
        className="object-cover"
      />

      {/* Dark overlay (optional) */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Button */}
      <div className="absolute inset-0 flex items-end justify-center pb-16">
        <Link
          href="/shop"
          className="
            border border-ivory/80
            px-10 py-4
            tracking-[0.2em]
            text-ivory
            hover:bg-ivory
            hover:text-maroon
            transition-all duration-300
          "
        >
          SHOP COLLECTION
        </Link>
      </div>

    </main>
  );
}
