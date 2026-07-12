"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function IvoryBlushReservationPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Image
            src="/products/ivory-blush/cover.jpg"
            alt="Ivory Blush"
            width={900}
            height={1200}
            priority
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <div className="max-w-2xl mx-auto pt-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Dusty Gold Floral Embroidered Gown
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
            }}
          >
            Ivory Blush
          </h1>

          <p className="mt-8 text-[15px] leading-8 text-[#6B625B]">
            <strong>Ivory Blush</strong> is part of an upcoming collection.
            Crafted in limited numbers and made exclusively to order, each gown is individually finished
            in our atelier for collectors who appreciate exceptional
            craftsmanship and timeless design. Priced at{" "}
            <strong>₹50,000</strong>, you may reserve your studio
            consultation and production slot before the official launch.
            Reservations help us prioritize our first production batch and
            do not guarantee allocation.
          </p>

          <div className="mt-12 flex justify-center">
            <Link
              href="/reserve/form/ivory-blush"
              className="
                border
                border-[#AF9685]
                px-12
                py-4
                text-xs
                uppercase
                tracking-[0.35em]
                text-[#AF9685]
                transition-all
                duration-300
                hover:bg-[#AF9685]
                hover:text-white
              "
            >
              Reserve Your Slot
            </Link>
          </div>

          <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
            This collection is launching soon. Reserve your production
            slot before the official release. Once the collection
            launches, reservations will close and availability will be
            offered to all clients while limited production capacity
            remains.
          </p>
        </div>
      </section>
    </main>
  );
}
