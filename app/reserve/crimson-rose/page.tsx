"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductGallery from "@/app/product-components/ProductGallery";
import { products } from "@/lib/products";

export default function CrimsonRoseReservationPage() {
  /*
   * =========================================================
   * FIND PRODUCT
   * =========================================================
   */

  const product = products.find(
    (item) => item.id === "crimson-rose"
  );

  /*
   * =========================================================
   * PRODUCT SAFETY CHECK
   * =========================================================
   *
   * Array.find() can technically return undefined.
   * Handle that before accessing product.id,
   * product.name, etc.
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
   * COLLECTION PHASE
   * =========================================================
   */

  const phase =
    product.collectionPhase;

  /*
   * =========================================================
   * BUTTON
   * =========================================================
   */

  let buttonText =
    "Reserve Private Access";

  let buttonHref =
    "/reserve/form/crimson-rose";

  let buttonDisabled = false;

  /*
   * =========================================================
   * PRIVATE ACCESS
   * =========================================================
   *
   * Customers can apply for a studio
   * reservation during this phase.
   */

  if (
    phase ===
    "private_access"
  ) {
    buttonText =
      "Reserve Private Access";

    buttonHref =
      "/reserve/form/crimson-rose";

    buttonDisabled = false;
  }

  /*
   * =========================================================
   * PRIVATE PURCHASE
   * =========================================================
   *
   * The reservation page itself does not
   * grant purchase access.
   *
   * The authenticated product page handles
   * the private-access verification.
   */

  if (
    phase ===
    "private_purchase"
  ) {
    buttonText =
      "Private Allocation Window";

    buttonHref =
      `/product/${product.id}`;

    buttonDisabled = false;
  }

  /*
   * =========================================================
   * PUBLIC
   * =========================================================
   */

  if (
    phase ===
    "public"
  ) {
    buttonText =
      "Acquire From Collection";

    buttonHref =
      `/product/${product.id}`;

    buttonDisabled = false;
  }

  /*
   * =========================================================
   * SOLD OUT
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

          <div className="mt-8 flex justify-center">

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
          {/* PRIVATE ACCESS */}
          {/* ================================================= */}

          {phase ===
            "private_access" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              Studio reservations close before
              the private allocation window.
              Clients who complete the
              reservation process receive
              priority access before the
              collection opens publicly.
            </p>
          )}

          {/* ================================================= */}
          {/* PRIVATE PURCHASE */}
          {/* ================================================= */}

          {phase ===
            "private_purchase" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              The private allocation window is
              currently open. Confirmed private
              access clients receive priority to
              claim this limited piece before
              public release.
            </p>
          )}

          {/* ================================================= */}
          {/* PUBLIC */}
          {/* ================================================= */}

          {phase ===
            "public" && (
            <p className="mt-8 text-[11px] leading-6 tracking-[0.18em] text-gray-400">
              The private allocation window has
              concluded. This edition is now
              available to all clients while
              pieces remain.
            </p>
          )}

          {/* ================================================= */}
          {/* SOLD OUT */}
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
