"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");

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
          {orderId || "Order ID not available"}
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