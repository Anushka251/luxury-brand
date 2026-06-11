"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const cashfreeOrderId =
          searchParams.get("order_id") || "";

        setOrderId(cashfreeOrderId);

        const pendingOrder =
          localStorage.getItem("pendingOrder");

        if (!pendingOrder) {
          setLoading(false);
          return;
        }

        const orderData = JSON.parse(pendingOrder);

        // Prevent duplicate order creation
        const duplicateKey = `saved_order_${cashfreeOrderId}`;

        if (localStorage.getItem(duplicateKey)) {
          setLoading(false);
          return;
        }

        const orderNumber =
          "ORD-" + Date.now();

        const res = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            orderNumber,
            cashfreeOrderId,

            customerEmail:
              orderData.customerEmail,

            customerName:
              orderData.customerName,

            customerPhone:
              orderData.customerPhone,

            shippingAddress:
              orderData.address,

            items: orderData.cart,

            total: orderData.total,

            paymentStatus: "PAID",
          }),
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem(
            duplicateKey,
            "true"
          );

          // Clear guest cart
          localStorage.removeItem("cart");

          // Clear logged-in user's cart in DB
          if (orderData.customerEmail) {
            try {
              await fetch("/api/cart", {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  email:
                    orderData.customerEmail,
                  cart: [],
                }),
              });
            } catch (error) {
              console.error(
                "Failed to clear DB cart:",
                error
              );
            }
          }

          // Remove pending order
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
  }, [searchParams]);

  return (
    <main className="max-w-3xl mx-auto py-32 px-8">
      <h1 className="text-4xl font-light mb-6">
        Payment Successful
      </h1>

      {loading ? (
        <p>Processing your order...</p>
      ) : (
        <>
          <p className="mb-8">
            Thank you for your order.
          </p>

          <div className="border p-6">
            <p className="text-sm text-gray-500">
              Order Number
            </p>

            <p className="text-lg font-medium mt-2">
              {orderId ||
                "Order ID not available"}
            </p>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-600">
              A confirmation email will
              be sent to you shortly.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
