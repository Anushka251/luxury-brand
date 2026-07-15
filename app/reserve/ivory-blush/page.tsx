"use client";

import Image from "next/image";
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
            <strong>Ivory Blush</strong> is part of our upcoming
            collection. Crafted in limited numbers and made exclusively
            to order, each gown is individually finished in our atelier
            for collectors who appreciate exceptional craftsmanship and
            timeless design. Priced at <strong>₹50,000</strong>, this
            piece will become available when the collection officially
            launches.
          </p>

          <div className="mt-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-[#AF9685]">
              Launching Soon
            </p>
          </div>

          <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
            This collection is launching soon. Availability will begin
            with the official release. Until then,
            <strong> Ivory Blush </strong>
            remains an exclusive preview of AVENOR&apos;s upcoming
            collection.
          </p>
        </div>
      </section>
    </main>
  );
}
