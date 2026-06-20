"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full">

      {/* Hero Section */}
      <section className="relative h-screen w-full bg-ivory">
        <Image
          src="/logo-hero-g3.png"
          alt="AVENOR"
          fill
          priority
          className="object-contain"
        />

        {/* Button */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2">
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
