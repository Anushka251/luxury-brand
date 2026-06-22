"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-ivory">

      {/* HERO IMAGE */}
      <section className="flex justify-center pt-24 px-6">
        <div className="relative w-full max-w-3xl">

          <Image
            src="/avenor-hero2.jpg"
            alt="AVENOR"
            width={900}
            height={1200}
            priority
            className="w-full h-auto object-contain"
          />

          {/* AVENOR LOGO */}
          <Link
            href="/"
            className="absolute inset-0 flex items-end justify-center pb-32"
          >
            <h1
              className="
                text-[#b59d8d]
                text-5xl
                sm:text-7xl
                md:text-8xl
                font-light
                tracking-tight
                hover:opacity-80
                transition-opacity
                select-none
              "
              style={{
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              AVENOR
            </h1>
          </Link>

        </div>
      </section>

      {/* SHOP COLLECTION BUTTON */}
      <div className="flex justify-center pt-20 pb-8">
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
