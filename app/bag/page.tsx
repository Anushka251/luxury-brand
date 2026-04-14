"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function BagPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { data: session } = useSession();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="px-12 py-32 max-w-5xl mx-auto">
      <h1 className="text-4xl font-light mb-12">Your Bag</h1>

      {cart.length === 0 ? (
        <p>Your bag is empty.</p>
      ) : (
        <>
          {/* ITEMS */}
          <ul className="space-y-8">
            {cart.map((item) => (
              <li
                key={`${item.id}-${item.size}`}
                className="flex justify-between items-center border-b pb-6"
              >
                <div>
                  <p className="text-lg">{item.name}</p>

                  {item.size && (
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.size}
                    </p>
                  )}

                  <p className="text-sm text-muted mt-1">
                    ₹{item.price.toLocaleString()}
                  </p>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                      className="border px-3 py-1"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                      className="border px-3 py-1"
                    >
                      +
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="mt-4 text-sm underline"
                  >
                    Remove
                  </button>
                </div>

                <p className="text-lg">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          {/* SUMMARY */}
          <div className="mt-16 flex justify-between items-center">
            <p className="text-xl">
              Total: ₹{total.toLocaleString()}
            </p>

            <div className="flex flex-col items-end">
              
              {!session && (
                <p className="text-xs text-gray-500 mb-3">
                  Please sign in to proceed to checkout
                </p>
              )}

              {session ? (
                <Link href="/checkout">
                  <button className="bg-black text-white px-10 py-4 tracking-widest">
                    CHECKOUT
                  </button>
                </Link>
              ) : (
                <Link href="/auth"> {/* ✅ UPDATED */}
                  <button className="bg-black text-white px-10 py-4 tracking-widest hover:opacity-80 transition">
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