"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-ivory">

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">

        <Image
          src="/logo-hero-g3.png"
          alt="AVENOR"
          width={400}
          height={300}
          priority
          className="mb-8 animate-fadeIn"
        />

        <p className="text-bronze text-sm md:text-base tracking-[0.15em] uppercase mb-10 max-w-md">
          Contemporary luxury crafted in limited quantities.
        </p>

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

      </section>

      {/* PRODUCT SECTION */}
      <section className="py-20 px-6 text-center bg-white">

        <h2 className="text-3xl tracking-[0.2em] text-maroon mb-4">
          CRIMSON ROSE
        </h2>

        <p className="text-xl text-bronze mb-6">
          ₹30,000
        </p>

        <p className="max-w-xl mx-auto text-gray-600 leading-8 mb-8">
          A limited-edition piece defined by fluid silhouettes,
          thoughtful detailing, and refined craftsmanship.
        </p>

        <Link
          href="/product/crimson-rose"
          className="
            border border-bronze
            px-8 py-3
            text-bronze
            tracking-[0.15em]
            hover:bg-maroon
            hover:text-ivory
            transition-all
          "
        >
          VIEW PRODUCT
        </Link>

      </section>

      {/* PHILOSOPHY */}
      <section className="py-20 px-6 text-center bg-ivory">

        <h2 className="text-2xl tracking-[0.2em] text-maroon mb-8">
          OUR PHILOSOPHY
        </h2>

        <p className="max-w-2xl mx-auto text-gray-700 leading-8">
          Avenor creates limited collections through intentional design,
          refined craftsmanship, and timeless elegance.
        </p>

      </section>

    </main>
  );
}
