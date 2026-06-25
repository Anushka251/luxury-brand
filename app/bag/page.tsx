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
    <main className="max-w-5xl mx-auto px-6 md:px-10 py-24">

      {/* HEADER */}

      <div className="mb-16">
        <h1 className="text-5xl font-light mb-4">
          Your Bag
        </h1>

        <p className="text-gray-500">
          Review your selected pieces.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="py-20">
          <p className="text-gray-500 mb-8">
            Your bag is currently empty.
          </p>

          <Link
            href="/shop"
            className="
              border
              border-black
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
          <div className="space-y-16">

            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="
                  flex
                  flex-col
                  md:flex-row
                  gap-8
                  border-b
                  pb-12
                "
              >

                {/* IMAGE */}

                <Link
                  href={`/product/${item.slug}`}
                  className="flex-shrink-0"
                >
                  <div className="relative w-[240px] h-[320px] md:w-[280px] md:h-[380px]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>

                {/* DETAILS */}

                <div className="flex flex-col justify-between flex-1">

                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                    >
                      <h2 className="text-4xl font-light hover:opacity-70 transition">
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
                  </div>

                  <div>

                    <div className="flex items-center gap-5 mb-8">

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
                        text-xs
                        tracking-[0.2em]
                        text-gray-500
                        hover:text-black
                      "
                    >
                      REMOVE
                    </button>

                  </div>

                </div>

                {/* ITEM TOTAL */}

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

          <div className="mt-16 border-t pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">

            <div>
              <p className="text-xs tracking-[0.25em] text-gray-400 mb-3">
                TOTAL
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
                <p className="text-sm text-gray-500 mb-4">
                  Sign in to continue.
                </p>
              )}

              {session ? (
                <Link href="/checkout">
                  <button
                    className="
                      bg-black
                      text-white
                      px-10
                      py-4
                      tracking-[0.25em]
                      hover:opacity-90
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
                      bg-black
                      text-white
                      px-10
                      py-4
                      tracking-[0.25em]
                      hover:opacity-90
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
