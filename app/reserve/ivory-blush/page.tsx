"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProductGallery from "@/app/product-components/ProductGallery";

type Reservation = {
  product: string;
  paymentStatus: string;
};

export default function IvoryBlushReservationPage() {
  const { data: session } = useSession();

  const [isReserved, setIsReserved] = useState(false);
  const [checkingReservation, setCheckingReservation] =
    useState(true);

  useEffect(() => {
    async function checkReservation() {
      if (!session?.user?.email) {
        setIsReserved(false);
        setCheckingReservation(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/reservations?email=${encodeURIComponent(
            session.user.email
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to check reservation."
          );
        }

        const data = await response.json();

        const reservations: Reservation[] =
          data.reservations ?? [];

        const confirmed = reservations.some(
          (reservation) =>
            reservation.product === "ivory-blush" &&
            reservation.paymentStatus === "success"
        );

        setIsReserved(confirmed);
      } catch (error) {
        console.error(
          "Ivory Blush reservation check error:",
          error
        );

        setIsReserved(false);
      } finally {
        setCheckingReservation(false);
      }
    }

    checkReservation();
  }, [session]);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-20">

        {/* GALLERY */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          <ProductGallery
            id="ivory-blush"
            name="Ivory Blush"
            galleryBase="reserve"
            images={[
              "/products/ivory-blush/1.jpg",
              "/products/ivory-blush/2.jpg",
              "/products/ivory-blush/3.jpg",
              "/products/ivory-blush/4.jpg",
              "/products/ivory-blush/5.JPG",
              "/products/ivory-blush/6.jpg",
              "/products/ivory-blush/7.jpg",
              "/products/ivory-blush/8.jpg",
            ]}
          />
        </motion.div>

        {/* PRODUCT INFORMATION */}

        <div className="max-w-2xl mx-auto pt-12 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Dusty Gold Floral Embroidered Gown
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Ivory Blush
          </h1>

          <p className="mt-8 text-[15px] leading-8 text-[#6B625B]">
            Crafted in limited numbers and made
            exclusively to order, Ivory Blush is
            individually finished in our atelier
            for collectors who appreciate
            exceptional craftsmanship and
            timeless design. Each creation is
            priced at <strong>₹50,000</strong>.
          </p>

          <p className="mt-4 text-[15px] leading-8 text-[#6B625B]">
            Studio reservations are available
            prior to the public release and
            provide private access to the
            collection before it opens publicly.
            Allocation remains subject to
            availability.
          </p>

          {/* BUTTON */}

          <div className="mt-12 flex justify-center">

            {checkingReservation ? (
              <div
                className="
                  border
                  border-[#D9C9BC]
                  px-12
                  py-4
                  text-xs
                  uppercase
                  tracking-[0.35em]
                  text-gray-400
                "
              >
                Checking Access...
              </div>
            ) : isReserved ? (
              <Link
                href="/product/ivory-blush"
                className="
                  border
                  border-[#AF9685]
                  bg-[#AF9685]
                  px-12
                  py-4
                  text-xs
                  uppercase
                  tracking-[0.35em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#111111]
                  hover:border-[#111111]
                "
              >
                PRIVATE ACCESS CONFIRMED
              </Link>
            ) : (
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
                BOOK STUDIO SLOT
              </Link>
            )}

          </div>

          {/* CONFIRMED MESSAGE */}

          {isReserved && !checkingReservation && (
            <p className="mt-6 text-[11px] leading-6 tracking-[0.18em] text-[#AF9685]">
              YOUR PRIVATE ACCESS TO IVORY BLUSH
              HAS BEEN CONFIRMED.
            </p>
          )}

          {/* NORMAL MESSAGE */}

          {!isReserved && !checkingReservation && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              Studio reservations close 48 hours
              before the collection is released
              publicly. After reservations close,
              this piece will become available to
              all clients on a first-come,
              first-served basis and may sell out.
            </p>
          )}

        </div>
      </section>
    </main>
  );
}
