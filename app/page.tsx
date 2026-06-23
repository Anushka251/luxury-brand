"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home(): React.JSX.Element {
  return (
    <main className="w-full bg-ivory">
      {/* HERO IMAGE */}
      <section className="flex justify-center pt-24 px-6">
        <div className="relative w-full max-w-3xl">

          {/* HERO IMAGE FADE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src="/avenor-hero2.jpg"
              alt="AVENOR"
              width={900}
              height={1200}
              priority
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* AVENOR LOGO */}
          <div
            onClick={() => {
              document
                .getElementById("shop")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
              absolute
              left-1/2
              top-[38%]
              -translate-x-1/2
              -translate-y-1/2
              z-10
              cursor-pointer
            "
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1.4 }}
              className="
                text-[#CFB095]
                text-5xl
                sm:text-7xl
                md:text-8xl
                font-light
                tracking-tight
                hover:opacity-80
                transition-opacity
                duration-300
                select-none
                whitespace-nowrap
              "
              style={{
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              AVENOR
            </motion.h1>
          </div>
        </div>
      </section>

      {/* SHOP COLLECTION BUTTON */}
      <div
        id="shop"
        className="flex justify-center pt-12 pb-4"
      >
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

      {/* BRAND STATEMENT */}
      <div className="flex justify-center pt-8 pb-12">
        <p
          className="
            text-center
            text-[#AF9685]
            text-xs
            sm:text-sm
            tracking-[0.25em]
            uppercase
            font-light
          "
          style={{
            fontFamily: '"Cormorant Garamond", serif',
          }}
        >
          Quiet Luxury. Contemporary Fashion. Limited Drop.
        </p>
      </div>

      {/* CRIMSON ROSE */}
      <section className="flex justify-center px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.4 }}
          className="max-w-md w-full"
        >
          <Link
            href="/product/crimson-rose"
            className="
              block
              hover:opacity-90
              transition-opacity
              duration-500
            "
          >
            <Image
              src="/products/crimson-rose/cover.jpg"
              alt="Crimson Rose"
              width={700}
              height={950}
              className="w-full h-auto object-cover"
            />

            <div className="pt-6 text-center">
              <h2
                className="text-xl tracking-[0.2em] text-[#AF9685]"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                }}
              >
                CRIMSON ROSE
              </h2>

              <p className="mt-2 text-sm tracking-[0.15em] text-bronze">
                DISCOVER THE COLLECTION
              </p>
            </div>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
