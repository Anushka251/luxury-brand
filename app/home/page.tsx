"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-ivory">

        {/* HERO IMAGE */}
        <section className="relative h-screen w-full">
          <Image
            src="/avenor-hero1.jpg"
            alt="AVENOR"
            fill
            priority
            className="object-cover"
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

      <Footer />
    </>
  );
}
