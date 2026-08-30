"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProductGallery from "@/app/product-components/ProductGallery";
import { products } from "@/lib/products";

type Reservation = {
  product: string;
  paymentStatus: string;
  status?: string;
};

export default function BlueCrystalReservationPage() {
  const {
    data: session,
    status: sessionStatus,
  } = useSession();

  const [hasPrivateAccess, setHasPrivateAccess] =
    useState(false);

  const [checkingAccess, setCheckingAccess] =
    useState(true);

  /*
   * =========================================================
   * PRODUCT
   * =========================================================
   */

  const product = products.find(
    (item) => item.id === "blue-crystal"
  );

  /*
   * =========================================================
   * SAFETY CHECK
   * =========================================================
   */

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6">
        <div className="max-w-xl text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            AVENOR
          </p>

          <h1
            className="mt-5 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Piece Not Found
          </h1>

          <p className="mt-6 text-sm leading-7 text-gray-500">
            This piece is currently unavailable
            from the collection.
          </p>

          <Link
            href="/shop"
            className="
              mt-8
              inline-block
              border
              border-[#AF9685]
              px-10
              py-4
              text-xs
              uppercase
              tracking-[0.3em]
              text-[#AF9685]
              transition-all
              duration-300
              hover:bg-[#AF9685]
              hover:text-white
            "
          >
            View Collection
          </Link>

        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * CHECK PRIVATE ACCESS
   * =========================================================
   *
   * A customer has private access only when:
   *
   * product === "blue-crystal"
   *
   * AND
   *
   * paymentStatus === "confirmed"
   *
   * AND
   *
   * status === "confirmed"
   */

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    const email =
      session?.user?.email ?? "";

    if (!email) {
      setHasPrivateAccess(false);
      setCheckingAccess(false);
      return;
    }

    async function checkPrivateAccess() {
      try {
        setCheckingAccess(true);

        const response = await fetch(
          `/api/reservations?email=${encodeURIComponent(
            email
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to check private access."
          );
        }

        const data =
          await response.json();

        const reservations:
          Reservation[] =
          data.reservations ?? [];

        const confirmed =
          reservations.some(
            (reservation) =>
              reservation.product ===
                "blue-crystal" &&
              reservation.paymentStatus ===
                "confirmed" &&
              reservation.status ===
                "confirmed"
          );

        setHasPrivateAccess(
          confirmed
        );
      } catch (error) {
        console.error(
          "Blue Crystal private access check error:",
          error
        );

        setHasPrivateAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    }

    checkPrivateAccess();
  }, [
    session,
    sessionStatus,
  ]);

  /*
   * =========================================================
   * COLLECTION PHASE
   * =========================================================
   */

  const phase =
    product.collectionPhase;

  /*
   * =========================================================
   * BUTTON STATE
   * =========================================================
   */

  let buttonText =
    "Reserve Private Access";

  let buttonHref =
    "/reserve/form/blue-crystal";

  let buttonDisabled = false;

  /*
   * =========================================================
   * PHASE 1 — PRIVATE ACCESS
   * =========================================================
   */

  if (
    phase ===
    "private_access"
  ) {
    buttonText =
      "Reserve Private Access";

    buttonHref =
      "/reserve/form/blue-crystal";

    buttonDisabled = false;
  }

  /*
   * =========================================================
   * PHASE 2 — PRIVATE PURCHASE
   * =========================================================
   */

  if (
    phase ===
    "private_purchase"
  ) {
    if (
      sessionStatus === "loading" ||
      checkingAccess
    ) {
      buttonText =
        "Checking Private Access";

      buttonDisabled = true;
    } else if (
      session &&
      hasPrivateAccess
    ) {
      buttonText =
        "Claim Private Allocation";

      buttonHref =
        "/product/blue-crystal";

      buttonDisabled = false;
    } else {
      buttonText =
        "Reserved for Private Access";

      buttonDisabled = true;
    }
  }

  /*
   * =========================================================
   * PHASE 3 — PUBLIC
   * =========================================================
   */

  if (
    phase ===
    "public"
  ) {
    buttonText =
      "Acquire From Collection";

    buttonHref =
      "/product/blue-crystal";

    buttonDisabled = false;
  }

  /*
   * =========================================================
   * PHASE 4 — SOLD OUT
   * =========================================================
   */

  if (
    phase ===
    "sold_out"
  ) {
    buttonText =
      "Edition Exhausted";

    buttonDisabled = true;
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">

      <section className="mx-auto max-w-5xl px-6 pt-10 pb-20">

        {/* ================================================= */}
        {/* GALLERY */}
        {/* ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1.2,
          }}
        >
          <ProductGallery
            id="blue-crystal"
            name="Blue Crystal"
            galleryBase="reserve"
            images={[
              "/products/blue-crystal/1.JPG",
              "/products/blue-crystal/2.JPG",
              "/products/blue-crystal/3.jpg",
            ]}
          />
        </motion.div>

        {/* ================================================= */}
        {/* PRODUCT INFORMATION */}
        {/* ================================================= */}

        <div className="mx-auto max-w-2xl pt-12 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            {product.type}
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            {product.name}
          </h1>

          <p className="mt-8 text-[15px] leading-8 text-[#6B625B]">
            {product.description}
          </p>

          <p className="mt-5 text-sm tracking-[0.08em] text-gray-500">
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </p>

          {/* ================================================= */}
          {/* COLLECTION PHASE */}
          {/* ================================================= */}

          <div className="mt-10">

            {phase ===
              "private_access" && (
              <p className="text-xs uppercase tracking-[0.28em] text-[#AF9685]">
                Private Access Applications Open
              </p>
            )}

            {phase ===
              "private_purchase" && (
              <p className="text-xs uppercase tracking-[0.28em] text-[#AF9685]">
                Private Allocation Window
              </p>
            )}

            {phase ===
              "public" && (
              <p className="text-xs uppercase tracking-[0.28em] text-[#8C9A78]">
                Now Available From The Collection
              </p>
            )}

            {phase ===
              "sold_out" && (
              <p className="text-xs uppercase tracking-[0.28em] text-gray-400">
                Edition Exhausted
              </p>
            )}

          </div>

          {/* ================================================= */}
          {/* ACTION */}
          {/* ================================================= */}

          <div className="mt-12 flex justify-center">

            <Link
              href={
                buttonDisabled
                  ? "#"
                  : buttonHref
              }
              aria-disabled={
                buttonDisabled
              }
              onClick={(event) => {
                if (
                  buttonDisabled
                ) {
                  event.preventDefault();
                }
              }}
              className={`
                border
                px-12
                py-4
                text-xs
                uppercase
                tracking-[0.35em]
                transition-all
                duration-300
                ${
                  buttonDisabled
                    ? "cursor-not-allowed border-gray-300 text-gray-400"
                    : "border-[#AF9685] text-[#AF9685] hover:bg-[#AF9685] hover:text-white"
                }
              `}
            >
              {buttonText}
            </Link>

          </div>

          {/* ================================================= */}
          {/* PRIVATE PURCHASE MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "private_purchase" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              {hasPrivateAccess
                ? "Your private access gives you priority to claim this limited piece before the collection opens publicly."
                : "This edition is currently reserved for clients with confirmed private access. Public access will follow if pieces remain available."}
            </p>
          )}

          {/* ================================================= */}
          {/* PRIVATE ACCESS MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "private_access" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              Studio reservations close 48 hours
              before the collection is released
              publicly. Clients who complete the
              reservation process receive priority
              access before the public release.
            </p>
          )}

          {/* ================================================= */}
          {/* PUBLIC MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "public" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              The private allocation window has
              concluded. Blue Crystal is now
              available to all clients while
              pieces remain.
            </p>
          )}

          {/* ================================================= */}
          {/* SOLD OUT MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "sold_out" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              This limited edition has been
              fully acquired and is no longer
              available.
            </p>
          )}

        </div>
      </section>
    </main>
  );
}
