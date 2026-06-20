"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-ivory">

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center pb-32">

        <Image
          src="/logo-hero-g3.png"
          alt="AVENOR"
          width={500}
          height={350}
          priority
          className="mb-10 animate-fadeIn"
        />

        <h1 className="text-4xl md:text-6xl tracking-[0.25em] text-maroon mb-6">
          AVENOR
        </h1>

        <p className="text-bronze uppercase tracking-[0.2em] text-sm md:text-base max-w-lg leading-8 mb-12">
          Contemporary fashion crafted in intentional luxury.
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

      {/* FEATURED PRODUCT */}
      <section className="bg-white py-28 px-6">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div className="flex justify-center">
            <Image
              src="/cover.jpg"
              alt="Crimson Rose"
              width={500}
              height={700}
              priority
              className="object-cover mx-auto"
            />
          </div>

          <div className="text-center md:text-left">

            <p className="uppercase tracking-[0.3em] text-sm text-bronze mb-4">
              Featured Piece
            </p>

            <h2 className="text-4xl text-maroon mb-4">
              Crimson Rose
            </h2>

            <p className="text-xl text-bronze mb-8">
              ₹30,000
            </p>

            <p className="text-gray-600 leading-8 max-w-md mb-10">
              A limited piece defined by fluid silhouettes,
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

          </div>

        </div>

      </section>

      {/* PHILOSOPHY */}
      <section className="bg-ivory py-32 px-6 text-center">

        <h2 className="text-2xl tracking-[0.25em] text-maroon mb-10">
          OUR PHILOSOPHY
        </h2>

        <p className="max-w-2xl mx-auto text-gray-700 leading-9">
          Avenor is a contemporary luxury house creating
          limited collections through intentional design,
          refined craftsmanship, and timeless elegance.
        </p>

      </section>

    </main>
  );
}
