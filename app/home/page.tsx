"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-ivory pt-24">
      
      {/* HERO LOGO */}
      <Image
        src="/logo-hero.png"
        alt="AVENOR"
        width={400}
        height={300}
        priority
        className="mb-20 animate-fadeIn"
      />

      {/* CTA */}
      <Link
        href="/shop"
        className=" mt-24
  border border-bronze/80
  px-10 py-4
  tracking-[0.2em]
  text-bronze
  hover:bg-maroon hover:text-ivory
  transition-all duration-300 mb-24
"


      >
        SHOP COLLECTION
      </Link>

    </main>
  );
}
