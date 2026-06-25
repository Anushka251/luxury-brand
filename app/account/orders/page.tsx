"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session } = useSession();

  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!session?.user?.email)
        return;

      try {
        const res = await fetch(
          `/api/orders?email=${session.user.email}`
        );

        const data =
          await res.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    loadOrders();
  }, [session]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-8 py-32">
        <p className="tracking-[0.4em] text-sm">
          AVENOR
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-8 md:px-12 py-24">

      <div className="mb-20">
        <p className="text-sm tracking-[0.35em] text-gray-400 mb-4">
          AVENOR CLIENT
        </p>

        <h1 className="text-5xl font-light tracking-[0.12em]">
          MY ORDERS
        </h1>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-24">

          {orders.map((order) => (
            <div
              key={order._id}
              className="border-b pb-20"
            >

              {/* ORDER NUMBER */}
              <p className="text-xs tracking-[0.3em] text-gray-400 mb-10">
                {order.orderNumber}
              </p>

              {/* ITEMS */}
              {order.items.map(
                (item: any) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="
                      flex
                      flex-col
                      md:flex-row
                      gap-10
                    "
                  >

                    {/* IMAGE */}
                    <Link
                      href={`/product/${item.slug}`}
                      className="block"
                    >
                      <div className="relative w-[260px] h-[340px]">
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

                      <p className="text-gray-500 mt-4">
                        Size {item.size}
                      </p>

                      <p className="text-gray-500 mt-2">
                        Quantity {item.quantity}
                      </p>

                      <p className="text-2xl font-light mt-8">
                        ₹
                        {item.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="text-sm text-gray-400 mt-8 tracking-[0.2em]">
                        LIMITED PIECE
                      </p>

                    </div>

                  </div>
                )
              )}

              {/* SHIPPING */}
              <div className="mt-16 pt-10 border-t">

                <div className="grid md:grid-cols-2 gap-12">

                  <div>
                    <p className="text-xs tracking-[0.25em] text-gray-400 mb-4">
                      SHIPPING
                    </p>

                    <p>
                      {
                        order
                          .shippingAddress
                          ?.name
                      }
                    </p>

                    <p className="mt-2">
                      {
                        order
                          .shippingAddress
                          ?.address
                      }
                    </p>

                    <p>
                      {
                        order
                          .shippingAddress
                          ?.city
                      }
                      ,{" "}
                      {
                        order
                          .shippingAddress
                          ?.state
                      }
                    </p>

                    <p>
                      {
                        order
                          .shippingAddress
                          ?.pincode
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs tracking-[0.25em] text-gray-400 mb-4">
                      PAYMENT
                    </p>

                    <p>
                      {
                        order
                          .paymentStatus
                      }
                    </p>

                    <p className="text-3xl font-light mt-4">
                      ₹
                      {order.total.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </main>
  );
}
