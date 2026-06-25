"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function BagPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const { data: session } =
    useSession();

  const total = cart.reduce(
    (sum, item) =>
      sum +
      item.price *
        item.quantity,
    0
  );

  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      {/* HEADER */}

      <div className="mb-20">
        <p className="text-xs tracking-[0.35em] text-gray-400 mb-4">
          AVENOR CLIENT
        </p>

        <h1 className="text-5xl font-light tracking-[0.12em]">
          YOUR BAG
        </h1>

        <p className="text-gray-500 mt-4">
          Review your selected pieces.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-20">
          <p className="text-gray-500 mb-10">
            Your bag is currently empty.
          </p>

          <Link
            href="/shop"
            className="
              border
              px-8
              py-4
              tracking-[0.2em]
              hover:bg-black
              hover:text-white
              transition
            "
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-20">

            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="
                  border-b
                  pb-16
                  flex
                  flex-col
                  md:flex-row
                  gap-10
                "
              >

                {/* IMAGE */}

                <Link
                  href={`/product/${item.slug}`}
                >
                  <div className="relative w-[240px] h-[320px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* DETAILS */}

                <div className="flex-1">

                  <Link
                    href={`/product/${item.slug}`}
                  >
                    <h2 className="text-3xl font-light hover:opacity-70 transition">
                      {item.name}
                    </h2>
                  </Link>

                  {item.size && (
                    <p className="text-gray-500 mt-4">
                      Size {item.size}
                    </p>
                  )}

                  <p className="text-2xl font-light mt-8">
                    ₹
                    {item.price.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {/* QUANTITY */}

                  <div className="flex items-center gap-5 mt-10">

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      className="
                        w-10
                        h-10
                        border
                        flex
                        items-center
                        justify-center
                      "
                    >
                      −
                    </button>

                    <span className="text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      className="
                        w-10
                        h-10
                        border
                        flex
                        items-center
                        justify-center
                      "
                    >
                      +
                    </button>

                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.size
                      )
                    }
                    className="
                      mt-10
                      text-xs
                      tracking-[0.2em]
                      text-gray-500
                      hover:text-black
                    "
                  >
                    REMOVE
                  </button>

                </div>

                {/* TOTAL */}

                <div className="md:text-right">

                  <p className="text-2xl font-light">
                    ₹
                    {(
                      item.price *
                      item.quantity
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>
            ))}

          </div>

          {/* SUMMARY */}

          <div className="mt-20 border-t pt-12 flex flex-col md:flex-row justify-between gap-10">

            <div>
              <p className="text-xs tracking-[0.25em] text-gray-400 mb-4">
                ORDER TOTAL
              </p>

              <p className="text-4xl font-light">
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end">

              {!session && (
                <p className="text-sm text-gray-500 mb-5">
                  Sign in to continue.
                </p>
              )}

              {session ? (
                <Link href="/checkout">
                  <button
                    className="
                      border
                      border-black
                      px-10
                      py-4
                      tracking-[0.25em]
                      hover:bg-black
                      hover:text-white
                      transition
                    "
                  >
                    CHECKOUT
                  </button>
                </Link>
              ) : (
                <Link href="/auth">
                  <button
                    className="
                      border
                      border-black
                      px-10
                      py-4
                      tracking-[0.25em]
                      hover:bg-black
                      hover:text-white
                      transition
                    "
                  >
                    LOGIN TO CHECKOUT
                  </button>
                </Link>
              )}

            </div>

          </div>

        </>
      )}
    </main>
  );
}
