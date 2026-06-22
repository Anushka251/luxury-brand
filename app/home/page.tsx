"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home(): React.JSX.Element {
  const router = useRouter();

  return (
    <main className="w-full bg-ivory">
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
          <div
            onClick={() => router.refresh()}
            className="
              absolute
              left-1/2
              top-[38%]
              -translate-x-1/2
              -translate-y-1/2
              z-10
              cursor-pointer
              hover:scale-105
              active:scale-95
              transition-transform
              duration-200
            "
          >
            <h1
              className="
                text-ivory
                text-5xl
                sm:text-7xl
                md:text-8xl
                font-light
                tracking-tight
                hover:opacity-80
                transition-opacity
                select-none
                whitespace-nowrap
                drop-shadow-sm
              "
              style={{
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              AVENOR
            </h1>
          </div>
        </div>
      </section>

      {/* SHOP COLLECTION BUTTON */}
      <div className="flex justify-center pt-12 pb-4">
        <Link
          href="/shop"
          className="
            border border-bronze/80
            px-10 py-4
            tracking-[0.2em]
            text-bronze
            hover:bg-maroon
            hover:text-ivory
            transition-all
            duration-300
          "
        >
          SHOP COLLECTION
        </Link>
      </div>
    </main>
  );
}
