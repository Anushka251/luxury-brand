"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home(): React.JSX.Element {
  return (
    <main className="w-full bg-ivory">

      {/* HERO */}

      <section className="flex justify-center px-4 pt-2">
        <div className="relative w-full max-w-6xl">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src="/avenor-hero2.jpg"
              alt="AVENOR"
              width={1200}
              height={1600}
              priority
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* LOGO */}

          <div
            onClick={() => {
              document
                .getElementById("shop")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
            className="
              absolute
              left-1/2
              top-[36%]
              -translate-x-1/2
              -translate-y-1/2
              z-10
              cursor-pointer
            "
          >
            <h1
              className="
                text-[#D7BE9A]
                text-[4rem]
                sm:text-[6rem]
                md:text-[7rem]
                lg:text-[8rem]
                font-light
                tracking-[0.04em]
                hover:opacity-85
                transition
                whitespace-nowrap
                select-none
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              AVENOR
            </h1>
          </div>

        </div>
      </section>

      {/* SHOP */}

      <div
        id="shop"
        className="flex justify-center pt-16 pb-6"
      >
        <Link
          href="/shop"
          className="
            border
            border-[#AF9685]
            px-12
            py-4
            text-sm
            tracking-[0.35em]
            text-[#AF9685]
            hover:bg-[#AF9685]
            hover:text-white
            transition-all
            duration-300
          "
        >
          SHOP COLLECTION
        </Link>
      </div>

      {/* STATEMENT */}

      <div className="flex justify-center pb-20">
        <p
          className="
            text-center
            text-[#AF9685]
            text-xs
            md:text-sm
            tracking-[0.35em]
            uppercase
            leading-8
            max-w-2xl
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          Quiet Luxury • Contemporary Fashion • Limited Drop
        </p>
      </div>

      {/* FEATURED PRODUCT */}

      <section className="flex justify-center px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.4 }}
          className="max-w-md w-full"
        >
          <Link
            href="/product/crimson-rose"
            className="
              block
              hover:opacity-95
              transition
            "
          >
            <Image
              src="/products/crimson-rose/cover.jpg"
              alt="Crimson Rose"
              width={700}
              height={950}
              className="
                w-full
                h-auto
                object-cover
              "
            />

            <div className="pt-8 text-center">

              <h2
                className="
                  text-4xl
                  md:text-5xl
                  font-light
                  tracking-[0.06em]
                  text-[#AF9685]
                  leading-none
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Crimson Rose
              </h2>

              <p className="mt-5 text-xs tracking-[0.35em] text-gray-500">
                DISCOVER THE COLLECTION
              </p>

            </div>
          </Link>
        </motion.div>
      </section>

    </main>
  );
}
