
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const FORM_URL = "https://forms.gle/6siEazkPdaVZfQwQA";

export default function PrivateFitting(): React.JSX.Element {
  return (
    <main className="w-full bg-ivory min-h-screen">

      {/* HERO BANNER */}
      <section className="flex justify-center px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="relative w-full max-w-6xl"
        >
          <Image
            src="/avenor-private-fitting.jpg"
            alt="AVENOR Private Fitting"
            width={1536}
            height={512}
            priority
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </section>

      {/* INTRODUCTION */}
      <section className="px-6 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.2 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p
            className="text-[10px] md:text-xs tracking-[0.45em] uppercase text-[#AF9685]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            An Exclusive Experience
          </p>

          <h1
            className="
              mt-6
              text-4xl
              md:text-6xl
              font-light
              tracking-[0.08em]
              text-[#AF9685]
            "
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Private Fitting
          </h1>

          <div className="w-16 h-px bg-[#AF9685] mx-auto mt-7 mb-8" />

          <p
            className="
              text-[#8C7968]
              text-lg
              md:text-xl
              leading-relaxed
              font-light
            "
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Crafted around you.
          </p>

          <p
            className="
              mt-6
              text-sm
              md:text-base
              leading-8
              text-[#8C7968]
              max-w-2xl
              mx-auto
            "
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            At AVENOR, every piece is thoughtfully created
            with attention to fit, detail and individuality.

            Share your measurements and delivery details
            with us to help us prepare your piece with
            precision and care.
          </p>
        </motion.div>
      </section>

      {/* FITTING DETAILS */}
      <section className="px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="
            max-w-2xl
            mx-auto
            border
            border-[#D8CBBB]
            px-7
            py-10
            md:px-14
            md:py-14
            text-center
          "
        >
          <h2
            className="
              text-2xl
              md:text-3xl
              font-light
              tracking-[0.08em]
              text-[#AF9685]
            "
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Your Fitting Details
          </h2>

          <p
            className="mt-5 text-sm leading-8 text-[#8C7968]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            To begin your private fitting, kindly complete
            the form with your body measurements and
            delivery information.
          </p>

          <div className="my-8 space-y-5 text-left max-w-sm mx-auto">

            {[
              "Personal and order details",
              "Body measurements",
              "Preferred fitting requirements",
              "Complete delivery address",
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                <span
                  className="text-sm text-[#AF9685]"
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                  }}
                >
                  0{index + 1}
                </span>

                <p className="text-sm tracking-wide text-[#8C7968]">
                  {item}
                </p>
              </div>
            ))}

          </div>

          <p
            className="text-xs text-[#AF9685] tracking-wide mb-8"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            Please provide all body measurements in inches.
          </p>

          {/* FORM BUTTON */}
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              justify-center
              w-full
              md:w-auto
              border
              border-[#AF9685]
              px-10
              py-4
              text-[10px]
              md:text-xs
              tracking-[0.3em]
              text-[#AF9685]
              hover:bg-[#AF9685]
              hover:text-white
              transition-all
              duration-500
            "
          >
            BEGIN YOUR PRIVATE FITTING
          </a>

          <p
            className="mt-5 text-[10px] tracking-widest text-[#AF9685]"
            style={{ fontFamily: '"Cormorant Garamond", serif' }}
          >
            A BESPOKE EXPERIENCE BY AVENOR
          </p>
        </motion.div>
      </section>

      {/* CLOSING STATEMENT */}
      <section className="px-6 pt-12 pb-24 text-center">

        <p
          className="
            text-sm
            md:text-base
            tracking-[0.3em]
            uppercase
            text-[#AF9685]
          "
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Made with intention. Made for you.
        </p>

        <div className="w-12 h-px bg-[#D8CBBB] mx-auto mt-7 mb-6" />

        <Link
          href="/"
          className="
            text-[10px]
            tracking-[0.35em]
            text-[#AF9685]
            hover:opacity-60
            transition
          "
        >
          RETURN TO AVENOR
        </Link>

      </section>

    </main>
  );
}
