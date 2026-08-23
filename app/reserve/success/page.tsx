"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/lib/products";

export default function ReservationSuccessPage() {
  const [productId, setProductId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved =
        sessionStorage.getItem(
          "avenor_reservation"
        );

      if (saved) {
        const reservation =
          JSON.parse(saved);

        if (reservation.product) {
          setProductId(
            reservation.product
          );
        }
      }
    } catch (error) {
      console.error(
        "Unable to read reservation:",
        error
      );
    }

    setLoading(false);
  }, []);

  const product = products.find(
    (item) => item.id === productId
  );

  /*
   * Reserve page for this particular product.
   *
   * Example:
   * ivory-blush → /reserve/ivory-blush
   * blue-crystal → /reserve/blue-crystal
   */

  const reserveUrl = product
    ? `/reserve/${product.id}`
    : "/shop";

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-20">

      <div className="max-w-2xl w-full text-center">

        {/* BRAND */}

        <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
          AVENOR
        </p>

        {/* TITLE */}

        <h1
          className="mt-6 text-5xl font-light text-[#AF9685]"
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          Reservation Received
        </h1>

        {/* MESSAGE */}

        <p className="mt-8 text-[15px] leading-8 text-[#6B625B]">
          Thank you for your interest in AVENOR.
          <br />
          <br />
          Your Studio Reservation has been
          successfully recorded. Your private
          access to the selected piece has been
          registered with AVENOR.
        </p>

        {/* ================================================= */}
        {/* RESERVED PRODUCT */}
        {/* ================================================= */}

        {!loading && product && (
          <div className="mx-auto mt-12 max-w-md">

            <p className="text-xs uppercase tracking-[0.35em] text-[#AF9685]">
              Private Access
            </p>

            {/* CLICKABLE IMAGE */}

            <Link
              href={reserveUrl}
              className="group block mt-6"
            >
              <div className="
                relative
                w-full
                overflow-hidden
                border
                border-[#D9C9BC]
                bg-[#F7F5F2]
              ">
                <Image
                  src={product.coverImage}
                  alt={product.name}
                  width={800}
                  height={1000}
                  priority
                  className="
                    block
                    h-auto
                    w-full
                    object-contain
                    transition-transform
                    duration-700
                    group-hover:scale-[1.015]
                  "
                />
              </div>

              {/* PRODUCT NAME */}

              <h2
                className="
                  mt-7
                  text-4xl
                  font-light
                  text-[#AF9685]
                  transition-opacity
                  duration-300
                  group-hover:opacity-60
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                {product.name}
              </h2>

              {/* PRODUCT TYPE */}

              <p className="
                mt-3
                text-xs
                uppercase
                tracking-[0.3em]
                text-gray-400
              ">
                {product.type}
              </p>

              {/* LINK */}

              <p className="
                mt-5
                text-xs
                uppercase
                tracking-[0.25em]
                text-gray-400
                transition-colors
                duration-300
                group-hover:text-black
              ">
                View Reserved Piece →
              </p>
            </Link>

          </div>
        )}

        {/* FALLBACK */}

        {!loading && !product && (
          <p className="mt-10 text-sm text-gray-400">
            Your reservation has been recorded.
          </p>
        )}

        {/* INFORMATION */}

        <div className="
          mx-auto
          mt-12
          max-w-xl
          border
          border-[#D9C9BC]
          bg-[#F7F5F2]
          p-8
          text-left
        ">

          <p className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-[#AF9685]
          ">
            Private Studio Access
          </p>

          <p className="
            mt-5
            text-sm
            leading-7
            text-gray-600
          ">
            Your reservation has been recorded
            prior to the public release. You will
            receive priority access to the selected
            piece according to AVENOR's release
            schedule.
          </p>

          <p className="
            mt-4
            text-sm
            leading-7
            text-gray-500
          ">
            Our atelier will contact you using the
            details provided during your
            reservation.
          </p>

          <p className="
            mt-4
            text-sm
            leading-7
            text-gray-500
          ">
            Please note that a reservation does not
            itself guarantee final garment
            allocation. Pieces remain subject to
            availability.
          </p>

        </div>

        {/* RETURN TO COLLECTION */}

        <div className="mt-12">

          <Link
            href="/shop"
            className="
              inline-block
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
            Return to Collection
          </Link>

        </div>

        {/* FOOTER */}

        <p className="
          mt-12
          text-xs
          leading-6
          tracking-[0.15em]
          text-gray-400
        ">
          AVENOR
          <br />
          Quiet luxury. Limited pieces.
          Thoughtfully crafted.
        </p>

      </div>
    </main>
  );
}
