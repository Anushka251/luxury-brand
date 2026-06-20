"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-ivory pt-24">

      {/* HERO IMAGE */}
      <div className="relative w-full h-screen">
        <Image
          src="/logo-hero-g3.png"
          alt="AVENOR"
          fill
          priority
          className="object-contain"
        />
      </div>

      {/* SHOP BUTTON */}
      <Link
        href="/shop"
        className="
          mt-32
          border border-bronze/80
          px-10 py-4
          tracking-[0.2em]
          text-bronze
          hover:bg-maroon
          hover:text-ivory
          transition-all duration-300
          mb-24
        "
      >
        SHOP COLLECTION
      </Link>

      {/* Content below */}
      <section className="bg-ivory py-32 text-center w-full">
        <h2 className="text-4xl tracking-[0.3em] text-bronze uppercase">
          AVENOR
        </h2>

        <p className="mt-6 max-w-xl mx-auto text-bronze/80 leading-8 tracking-[0.08em]">
          Quiet luxury. Limited pieces. Thoughtfully crafted.
        </p>
      </section>

    </main>
  );
}
