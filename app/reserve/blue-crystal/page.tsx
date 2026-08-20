"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductGallery from "@/app/product-components/ProductGallery";

export default function BlueCrystalReservationPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <ProductGallery
            id="blue-crystal"
            name="Blue Crystal"
            galleryBase="reserve"
            images={[
              "/products/blue-crystal/1.JPG",
              "/products/blue-crystal/2.JPG",
              "/products/blue-crystal/3.JPG",
            ]}
          />
        </motion.div>

        <div className="max-w-2xl mx-auto pt-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Embroidered Mini Dress
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
            }}
          >
            Blue Crystal
          </h1>

          <p className="mt-8 text-[15px] leading-8 text-[#6B625B]">
            Crafted in limited numbers and made exclusively to order,
            Blue Crystal is individually finished in our atelier for
            collectors who appreciate exceptional craftsmanship and
            timeless design. Each creation is priced at{" "}
            <strong>₹33,000</strong>. Studio reservations are available
            prior to the public release and serve as an expression of
            interest only. Allocation will remain subject to availability
            once the collection opens.
          </p>

          <div className="mt-12 flex justify-center">
            <Link
              href="/reserve/form/blue-crystal"
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
              Book Studio Slot
            </Link>
          </div>

          <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
            Studio reservations close 48 hours before the collection is
            released publicly. After reservations close, this piece will
            become available to all clients on a first-come,
            first-served basis and may sell out.
          </p>
        </div>
      </section>
    </main>
  );
}
