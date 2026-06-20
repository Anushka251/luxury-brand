"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full">

      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <Image
          src="/logo-hero-g3.png"
          alt="AVENOR"
          fill
          priority
          className="object-cover"
        />

        {/* Optional overlay */}
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
      </section>

      {/* Content below */}
      <section className="bg-ivory py-32 text-center">
        <h2 className="text-3xl tracking-[0.2em]">
          AVENOR
        </h2>

        <p className="mt-6 max-w-xl mx-auto text-gray-600">
          Quiet luxury. Limited pieces. Thoughtfully crafted.
        </p>
      </section>

    </main>
  );
}
