"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session } = useSession();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `/api/orders?email=${session.user.email}`
        );

        const data = await res.json();

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
      <main className="px-12 py-32 max-w-4xl mx-auto">
        <h1 className="text-3xl font-light">
          Loading Orders...
        </h1>
      </main>
    );
  }

  return (
    <main className="px-12 py-32 max-w-5xl mx-auto">
      <h1 className="text-3xl font-light mb-10 tracking-widest">
        MY ORDERS
      </h1>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">
          No orders yet.
        </p>
      ) : (
        <div className="space-y-10">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-6"
            >
              <div className="mb-6">
                <p className="text-xs text-gray-500">
                  ORDER NUMBER
                </p>

                <p className="font-medium">
                  {order.orderNumber}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-xs text-gray-500">
                  DELIVER TO
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.name
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.address
                  }
                </p>

                <p>
                  {
                    order.shippingAddress
                      ?.city
                  }
                  ,{" "}
                  {
                    order.shippingAddress
                      ?.state
                  }{" "}
                  -{" "}
                  {
                    order.shippingAddress
                      ?.pincode
                  }
                </p>
              </div>

              <div className="space-y-4">
                {order.items.map(
                  (item: any) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4"
                    >
                      <div className="relative w-24 h-32">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="underline"
                        >
                          {item.name}
                        </Link>

                        <p>
                          Size: {item.size}
                        </p>

                        <p>
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>

                        <p>
                          ₹
                          {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <p>
                  Status:{" "}
                  {order.paymentStatus}
                </p>

                <p>
                  Total: ₹
                  {order.total.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
