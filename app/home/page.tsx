"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-ivory">

      {/* HERO IMAGE */}
      <section className="flex justify-center pt-24 px-6">
        <Image
          src="/avenor-hero2.jpg"
          alt="AVENOR"
          width={900}
          height={1200}
          priority
          className="w-full max-w-3xl h-auto object-contain"
        />
      </section>

      {/* SHOP COLLECTION BUTTON */}
      <div className="flex justify-center py-24">
        <Link
          href="/shop"
          className="
            border border-bronze/80
            px-10 py-4
            tracking-[0.2em]
            text-bronze
            hover:bg-maroon
            hover:text-ivory
            transition-all duration-300
          "
        >
          SHOP COLLECTION
        </Link>
      </div>

    </main>
  );
}
