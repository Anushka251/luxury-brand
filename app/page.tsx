"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-ivory min-h-screen flex flex-col items-center pt-16">

      {/* HERO IMAGE */}
      <section className="w-full flex justify-center px-6">
        <Image
          src="/logo-hero-g3.png"
          alt="AVENOR"
          width={900}
          height={1350}
          priority
          className="
            w-full
            max-w-[650px]
            h-auto
            object-contain
          "
        />
      </section>

      {/* SHOP BUTTON */}
      <Link
        href="/shop"
        className="
          mt-12
          mb-24
          border border-bronze/80
          px-10 py-4
          tracking-[0.25em]
          text-bronze
          hover:bg-maroon
          hover:text-ivory
          transition-all duration-500
        "
      >
        SHOP COLLECTION
      </Link>

      {/* BRAND SECTION */}
      <section className="w-full bg-ivory py-24 text-center px-6">
        <h2 className="text-4xl md:text-5xl tracking-[0.35em] text-bronze">
          AVENOR
        </h2>

        <p className="mt-8 max-w-xl mx-auto text-bronze/80 leading-8 tracking-[0.08em]">
          Quiet luxury. Limited pieces. Thoughtfully crafted.
        </p>
      </section>

    </main>
  );
}
