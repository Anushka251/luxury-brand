"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductGallery from "@/app/product-components/ProductGallery";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { products } from "@/lib/products";

type Reservation = {
  product: string;
  paymentStatus: string;
  status?: string;
};

export default function BlueCrystalReservationPage() {
  const { data: session, status: sessionStatus } =
    useSession();

  const [hasPrivateAccess, setHasPrivateAccess] =
    useState(false);

  const [checkingAccess, setCheckingAccess] =
    useState(true);

  const product = products.find(
    (item) => item.id === "blue-crystal"
  );

  /*
   * ==========================================
   * CHECK PRIVATE ACCESS
   * ==========================================
   *
   * This is only important during the
   * private_purchase phase.
   *
   * We check MongoDB through:
   *
   * /api/reservations?email=...
   *
   * A customer has private access only when:
   *
   * product === "blue-crystal"
   * AND
   * paymentStatus === "success"
   * AND
   * status === "confirmed"
   */

  useEffect(() => {
    if (
      sessionStatus === "loading"
    ) {
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

        const response =
          await fetch(
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
                "success" &&
              reservation.status ===
                "confirmed"
          );

        setHasPrivateAccess(
          confirmed
        );
      } catch (error) {
        console.error(
          "Private access check error:",
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
   * ==========================================
   * PRODUCT
   * ==========================================
   */

  if (!product) {
    return null;
  }

  /*
   * ==========================================
   * COLLECTION PHASE
   * ==========================================
   */

  const phase =
    product.collectionPhase;

  /*
   * ==========================================
   * BUTTON
   * ==========================================
   */

  let buttonText =
    "Reserve Private Access";

  let buttonHref =
    "/reserve/form/blue-crystal";

  let buttonDisabled = false;

  /*
   * ==========================================
   * PHASE 1
   * ==========================================
   *
   * Anyone can apply.
   */

  if (
    phase ===
    "private_access"
  ) {
    buttonText =
      "Reserve Private Access";

    buttonHref =
      "/reserve/form/blue-crystal";
  }

  /*
   * ==========================================
   * PHASE 2
   * ==========================================
   *
   * Only confirmed private-access
   * clients can purchase.
   */

  if (
    phase ===
    "private_purchase"
  ) {
    /*
     * Still checking account
     */

    if (
      sessionStatus ===
        "loading" ||
      checkingAccess
    ) {
      buttonText =
        "Checking Private Access";

      buttonDisabled = true;
    }

    /*
     * Logged in + confirmed
     */

    else if (
      session &&
      hasPrivateAccess
    ) {
      buttonText =
        "Claim Private Allocation";

      /*
       * IMPORTANT:
       *
       * This should eventually point to
       * your authenticated checkout route.
       *
       * For now this points to the product
       * page, where your purchase flow can
       * be connected.
       */

      buttonHref =
        `/product/${product.id}`;
    }

    /*
     * Not a private-access client
     */

    else {
      buttonText =
        "Reserved for Private Access";

      buttonDisabled = true;
    }
  }

  /*
   * ==========================================
   * PHASE 3
   * ==========================================
   *
   * Everyone can purchase.
   */

  if (
    phase ===
    "public"
  ) {
    buttonText =
      "Acquire From Collection";

    buttonHref =
      `/product/${product.id}`;
  }

  /*
   * ==========================================
   * PHASE 4
   * ==========================================
   */

  if (
    phase ===
    "sold_out"
  ) {
    buttonText =
      "Edition Exhausted";

    buttonDisabled = true;
  }

  /*
   * ==========================================
   * SIGN-IN FOR PRIVATE PURCHASE
   * ==========================================
   */

  function handlePrivatePurchase() {
    if (
      phase !==
      "private_purchase"
    ) {
      return;
    }

    if (!session) {
      signIn("google", {
        callbackUrl:
          `/reserve/blue-crystal`,
      });

      return;
    }

    if (!hasPrivateAccess) {
      return;
    }

    window.location.href =
      `/product/${product.id}`;
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-20">

        {/* ====================================== */}
        {/* GALLERY */}
        {/* ====================================== */}

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

        {/* ====================================== */}
        {/* PRODUCT INFORMATION */}
        {/* ====================================== */}

        <div className="max-w-2xl mx-auto pt-12 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Embroidered Mini Dress
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Blue Crystal
          </h1>

          <p className="mt-8 text-[15px] leading-8 text-[#6B625B]">
            Crafted in limited numbers and
            made exclusively to order, Blue
            Crystal is individually finished
            in our atelier for collectors who
            appreciate exceptional
            craftsmanship and timeless design.
            Each creation is priced at{" "}
            <strong>
              ₹33,000
            </strong>
            .
          </p>

          {/* ====================================== */}
          {/* PHASE MESSAGE */}
          {/* ====================================== */}

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
              <p className="text-xs uppercase tracking-[0.28em] text-[#AF9685]">
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

          {/* ====================================== */}
          {/* ACTION */}
          {/* ====================================== */}

          <div className="mt-8 flex justify-center">

            {phase ===
              "private_purchase" ? (
              <button
                type="button"
                disabled={
                  buttonDisabled
                }
                onClick={
                  handlePrivatePurchase
                }
                className={`
                  border
                  border-[#AF9685]
                  px-12
                  py-4
                  text-xs
                  uppercase
                  tracking-[0.35em]
                  transition-all
                  duration-300
                  ${
                    buttonDisabled
                      ? "cursor-not-allowed text-gray-400 border-gray-300"
                      : "text-[#AF9685] hover:bg-[#AF9685] hover:text-white"
                  }
                `}
              >
                {buttonText}
              </button>
            ) : (
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
            )}

          </div>

          {/* ====================================== */}
          {/* PRIVATE PURCHASE EXPLANATION */}
          {/* ====================================== */}

          {phase ===
            "private_purchase" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">

              {hasPrivateAccess
                ? "Your private access gives you priority to claim this limited piece before the collection opens publicly."
                : "This edition is currently reserved for clients with confirmed private access. Public access will follow if pieces remain available."}

            </p>
          )}

          {/* ====================================== */}
          {/* PRIVATE ACCESS EXPLANATION */}
          {/* ====================================== */}

          {phase ===
            "private_access" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              Studio reservations close before
              the private allocation window.
              Private access is available to
              clients who complete the studio
              reservation process.
            </p>
          )}

          {/* ====================================== */}
          {/* PUBLIC EXPLANATION */}
          {/* ====================================== */}

          {phase ===
            "public" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              The private allocation window has
              concluded. This edition is now
              available to all clients while
              pieces remain.
            </p>
          )}

          {/* ====================================== */}
          {/* SOLD OUT */}
          {/* ====================================== */}

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
