"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };

  total: number;

  cart: {
    name: string;
    slug: string;
    size?: string;
    image?: string;
    images?: string[];
  }[];
}

export default function PaymentSuccessPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);

  const [orderData, setOrderData] =
    useState<OrderData | null>(null);

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const cashfreeOrderId =
          new URLSearchParams(
            window.location.search
          ).get("order_id") || "";

        setOrderId(cashfreeOrderId);

        const pendingOrder =
          localStorage.getItem(
            "pendingOrder"
          );

        if (!pendingOrder) {
          setLoading(false);
          return;
        }

        const parsedOrder =
          JSON.parse(pendingOrder);

        setOrderData(parsedOrder);

        const duplicateKey =
          `saved_order_${cashfreeOrderId}`;

        if (
          localStorage.getItem(
            duplicateKey
          )
        ) {
          setLoading(false);
          return;
        }

        const orderNumber =
          "ORD-" + Date.now();

        const res = await fetch(
          "/api/orders",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              orderNumber,
              cashfreeOrderId,

              customerEmail:
                parsedOrder.customerEmail,

              customerName:
                parsedOrder.customerName,

              customerPhone:
                parsedOrder.customerPhone,

              shippingAddress:
                parsedOrder.address,

              items:
                parsedOrder.cart,

              total:
                parsedOrder.total,

              paymentStatus:
                "PAID",
            }),
          }
        );

        const data =
          await res.json();

        if (data.success) {
          localStorage.setItem(
            duplicateKey,
            "true"
          );

          localStorage.removeItem(
            "cart"
          );

          if (
            parsedOrder.customerEmail
          ) {
            await fetch(
              "/api/cart",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  email:
                    parsedOrder.customerEmail,
                  cart: [],
                }),
              }
            );
          }

          localStorage.removeItem(
            "pendingOrder"
          );
        }
      } catch (error) {
        console.error(
          "Payment success error:",
          error
        );
      }

      setLoading(false);
    };

    saveOrder();
  }, []);

  const item =
    orderData?.cart?.[0];

  const productImage =
    item?.image ||
    item?.images?.[0];

  return (
    <main className="min-h-screen bg-[#f7f5f2] py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14">
          <p className="tracking-[0.4em] text-sm mb-4">
            AVENOR
          </p>

          <h1 className="text-5xl font-light mb-4">
            Payment Successful
          </h1>

          <p className="text-gray-600">
            Thank you for your order.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-500">
            Processing your order...
          </div>
        ) : (
          <div className="space-y-8">

            {/* ORDER NUMBER */}
            <div className="bg-white border p-8">
              <p className="text-sm text-gray-500 uppercase tracking-widest">
                Order Number
              </p>

              <p className="text-2xl font-light mt-3 break-all">
                {orderId ||
                  "Order ID unavailable"}
              </p>
            </div>

            {/* PRODUCT */}
            {item && (
              <Link
                href={`/product/${item.slug}`}
                className="
                  block
                  bg-white
                  border
                  p-6
                  hover:shadow-md
                  transition
                "
              >
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-5">
                  Ordered Item
                </p>

                <div className="flex gap-6 items-center">
                  {productImage && (
                    <img
                      src={productImage}
                      alt={item.name}
                      className="
                        w-32
                        h-44
                        object-cover
                      "
                    />
                  )}

                  <div>
                    <h2 className="text-2xl font-light">
                      {item.name}
                    </h2>

                    {item.size && (
                      <p className="text-gray-500 mt-2">
                        Size: {item.size}
                      </p>
                    )}

                    <p className="mt-4 text-lg">
                      ₹
                      {orderData?.total?.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                      Tap to view product
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      Limited to 12 pieces.
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* SHIPPING */}
            <div className="bg-white border p-8">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-5">
                Shipping Address
              </p>

              <div className="space-y-2 text-gray-700">
                <p className="font-medium">
                  {orderData?.address?.name}
                </p>

                <p>
                  {orderData?.address?.phone}
                </p>

                <p>
                  {orderData?.address?.address}
                </p>

                <p>
                  {orderData?.address?.city},
                  {" "}
                  {orderData?.address?.state}
                </p>

                <p>
                  {orderData?.address?.pincode}
                </p>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white border p-8">
              <p className="text-sm text-gray-500 uppercase tracking-widest">
                Total Paid
              </p>

              <p className="text-3xl font-light mt-3">
                ₹
                {orderData?.total?.toLocaleString(
                  "en-IN"
                )}
              </p>

              <p className="text-green-700 mt-2 text-sm">
                Payment Completed
              </p>
            </div>

            {/* EMAIL */}
            <p className="text-center text-gray-500">
              A confirmation email will
              be sent shortly.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/shop"
                className="
                  border
                  px-8
                  py-4
                  text-center
                  tracking-widest
                  text-sm
                  hover:bg-black
                  hover:text-white
                  transition
                "
              >
                CONTINUE SHOPPING
              </Link>

              <Link
                href="/account/orders"
                className="
                  bg-black
                  text-white
                  px-8
                  py-4
                  text-center
                  tracking-widest
                  text-sm
                  hover:opacity-90
                  transition
                "
              >
                VIEW ORDERS
              </Link>
            </div>

            <p className="text-center text-sm text-gray-400 tracking-wider pt-8">
              Quiet Luxury. Limited Pieces.
            </p>

          </div>
        )}
      </div>
    </main>
  );
}
