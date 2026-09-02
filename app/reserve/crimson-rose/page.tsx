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

export default function CrimsonRoseReservationPage() {
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
    (item) => item.id === "crimson-rose"
  );

  /*
   * =========================================================
   * CHECK PRIVATE ACCESS
   * =========================================================
   *
   * Database is the source of truth.
   *
   * Customer has private access ONLY when:
   *
   * product === "crimson-rose"
   * paymentStatus === "confirmed"
   * status === "confirmed"
   *
   * We do NOT rely on sessionStorage.
   */

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    const email =
      session?.user?.email ?? "";

    /*
     * No logged-in customer
     */

    if (!email) {
      setHasPrivateAccess(false);
      setCheckingAccess(false);
      return;
    }

    let cancelled = false;

    async function checkPrivateAccess() {
      try {
        setCheckingAccess(true);

        const response = await fetch(
          `/api/reservations?email=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
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

        const reservations: Reservation[] =
          Array.isArray(
            data.reservations
          )
            ? data.reservations
            : [];

        /*
         * Find a CONFIRMED reservation
         * specifically for Crimson Rose.
         */

        const confirmed =
          reservations.some(
            (reservation) =>
              reservation.product ===
                "crimson-rose" &&
              String(
                reservation.paymentStatus
              ).toLowerCase() ===
                "confirmed" &&
              String(
                reservation.status ?? ""
              ).toLowerCase() ===
                "confirmed"
          );

        if (!cancelled) {
          setHasPrivateAccess(
            confirmed
          );
        }
      } catch (error) {
        console.error(
          "Crimson Rose private access check error:",
          error
        );

        if (!cancelled) {
          setHasPrivateAccess(false);
        }
      } finally {
        if (!cancelled) {
          setCheckingAccess(false);
        }
      }
    }

    checkPrivateAccess();

    return () => {
      cancelled = true;
    };
  }, [
    session,
    sessionStatus,
  ]);

  /*
   * =========================================================
   * REFRESH ACCESS WHEN CUSTOMER RETURNS
   * =========================================================
   *
   * Useful when payment was completed in another
   * page/tab and the customer returns here.
   */

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    const email =
      session?.user?.email ?? "";

    if (!email) {
      return;
    }

    async function refreshAccess() {
      try {
        const response = await fetch(
          `/api/reservations?email=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        const reservations: Reservation[] =
          Array.isArray(
            data.reservations
          )
            ? data.reservations
            : [];

        const confirmed =
          reservations.some(
            (reservation) =>
              reservation.product ===
                "crimson-rose" &&
              String(
                reservation.paymentStatus
              ).toLowerCase() ===
                "confirmed" &&
              String(
                reservation.status ?? ""
              ).toLowerCase() ===
                "confirmed"
          );

        setHasPrivateAccess(
          confirmed
        );
      } catch (error) {
        console.error(
          "Crimson Rose private access refresh error:",
          error
        );
      }
    }

    function handleFocus() {
      refreshAccess();
    }

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [
    session,
    sessionStatus,
  ]);

  /*
   * =========================================================
   * PRODUCT SAFETY CHECK
   * =========================================================
   */

  if (!product) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FAF8F5]
          flex
          items-center
          justify-center
          px-6
        "
      >
        <div className="max-w-xl text-center">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-gray-400
            "
          >
            AVENOR
          </p>

          <h1
            className="
              mt-5
              text-5xl
              font-light
              text-[#AF9685]
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Piece Not Found
          </h1>

          <p
            className="
              mt-6
              text-sm
              leading-7
              text-gray-500
            "
          >
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
    "/reserve/form/crimson-rose";

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
        "View Your Reservation";

      buttonHref =
        "/account/reservations";

      buttonDisabled = false;
    } else {
      buttonText =
        "Reserve Private Access";

      buttonHref =
        "/reserve/form/crimson-rose";

      buttonDisabled = false;
    }
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
        "/product/crimson-rose";

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
      "/product/crimson-rose";

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

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main
      className="
        min-h-screen
        bg-[#FAF8F5]
      "
    >

      <section
        className="
          mx-auto
          max-w-5xl
          px-6
          pt-10
          pb-20
        "
      >

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
            id="crimson-rose"
            name="Crimson Rose"
            galleryBase="reserve"
            images={[
              "/products/crimson-rose/1.jpg",
              "/products/crimson-rose/2.jpg",
              "/products/crimson-rose/3-v2.jpg",
              "/products/crimson-rose/4.jpg",
              "/products/crimson-rose/5.jpg",
              "/products/crimson-rose/6.jpg",
              "/products/crimson-rose/7.jpg",
              "/products/crimson-rose/8.jpg",
            ]}
          />

        </motion.div>


        {/* ================================================= */}
        {/* PRODUCT INFORMATION */}
        {/* ================================================= */}

        <div
          className="
            mx-auto
            max-w-2xl
            pt-12
            text-center
          "
        >

          {/* PRODUCT TYPE */}

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-gray-400
            "
          >
            {product.type}
          </p>


          {/* PRODUCT NAME */}

          <h1
            className="
              mt-4
              text-5xl
              font-light
              text-[#AF9685]
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            {product.name}
          </h1>


          {/* DESCRIPTION */}

          <p
            className="
              mt-8
              text-[15px]
              leading-8
              text-[#6B625B]
            "
          >
            {product.detailDescription}
          </p>


          {/* PRICE */}

          <p
            className="
              mt-5
              text-sm
              tracking-[0.08em]
              text-gray-500
            "
          >
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </p>


          {/* ================================================= */}
          {/* EDITION SIZE */}
          {/* ================================================= */}

          <p
            className="
              mt-4
              text-xs
              uppercase
              tracking-[0.28em]
              text-[#AF9685]
            "
          >
            Edition of {product.totalPieces}
          </p>


          {/* ================================================= */}
          {/* COLLECTION PHASE */}
          {/* ================================================= */}

          <div className="mt-10">

            {/* PRIVATE ACCESS */}

            {phase ===
              "private_access" && (
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.28em]
                  text-[#AF9685]
                "
              >
                {hasPrivateAccess
                  ? "Private Access Reserved"
                  : "Private Access Applications Open"}
              </p>
            )}


            {/* PRIVATE PURCHASE */}

            {phase ===
              "private_purchase" && (
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.28em]
                  text-[#AF9685]
                "
              >
                {hasPrivateAccess
                  ? "Your Private Allocation Window"
                  : "Private Allocation Window"}
              </p>
            )}


            {/* PUBLIC */}

            {phase ===
              "public" && (
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.28em]
                  text-[#8C9A78]
                "
              >
                Now Available From The Collection
              </p>
            )}


            {/* SOLD OUT */}

            {phase ===
              "sold_out" && (
              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.28em]
                  text-gray-400
                "
              >
                Edition Exhausted
              </p>
            )}

          </div>


          {/* ================================================= */}
          {/* ACTION */}
          {/* ================================================= */}

          <div
            className="
              mt-12
              flex
              justify-center
            "
          >

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
          {/* PRIVATE ACCESS MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "private_access" && (
            <p
              className="
                mt-8
                text-[11px]
                leading-6
                tracking-[0.18em]
                text-gray-400
              "
            >
              {hasPrivateAccess
                ? "Your ₹2,000 reservation has been successfully confirmed. Your private access is secured for this piece."
                : "Studio reservations close before the private allocation window. Clients who complete the reservation process receive priority access before the collection opens publicly."}
            </p>
          )}


          {/* ================================================= */}
          {/* PRIVATE PURCHASE MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "private_purchase" && (
            <p
              className="
                mt-8
                text-[11px]
                leading-6
                tracking-[0.18em]
                text-gray-400
              "
            >
              {hasPrivateAccess
                ? "Your private access gives you priority to claim this limited piece before the collection opens publicly."
                : "This edition is currently reserved for clients with confirmed private access. Public access will follow if pieces remain available."}
            </p>
          )}


          {/* ================================================= */}
          {/* PUBLIC MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "public" && (
            <p
              className="
                mt-8
                text-[11px]
                leading-6
                tracking-[0.18em]
                text-gray-400
              "
            >
              The private allocation window has
              concluded. This edition is now
              available to all clients while
              pieces remain.
            </p>
          )}


          {/* ================================================= */}
          {/* SOLD OUT MESSAGE */}
          {/* ================================================= */}

          {phase ===
            "sold_out" && (
            <p
              className="
                mt-8
                text-[11px]
                leading-6
                tracking-[0.18em]
                text-gray-400
              "
            >
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
