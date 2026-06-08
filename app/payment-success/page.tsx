"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");

  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/verify-order?order_id=${orderId}`
        );

        const data = await res.json();

        if (
          data.success &&
          data.order_status === "PAID"
        ) {
          setPaid(true);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    verifyPayment();
  }, [orderId]);

  if (loading) {
    return (
      <main className="max-w-3xl mx-auto py-32 px-8">
        <h1 className="text-3xl">
          Verifying Payment...
        </h1>
      </main>
    );
  }

  if (!paid) {
    return (
      <main className="max-w-3xl mx-auto py-32 px-8">
        <h1 className="text-4xl font-light mb-6">
          Payment Not Verified
        </h1>

        <p>
          We could not verify this payment.
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-32 px-8">
      <h1 className="text-4xl font-light mb-6">
        Payment Successful
      </h1>

      <p className="mb-8">
        Thank you for your order.
      </p>

      <div className="border p-6">
        <p className="text-sm text-gray-500">
          Order Number
        </p>

        <p className="text-lg font-medium mt-2">
          {orderId}
        </p>
      </div>

      <div className="mt-8">
        <p className="text-sm text-gray-600">
          A confirmation email will be sent to you shortly.
        </p>
      </div>
    </main>
  );
}