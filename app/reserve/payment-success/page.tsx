"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type PaymentState =
  | "checking"
  | "success"
  | "pending"
  | "failed";

export default function PaymentSuccessPage() {
  const searchParams =
    useSearchParams();

  const orderId =
    searchParams.get("order_id");

  const [status, setStatus] =
    useState<PaymentState>("checking");

  const [message, setMessage] =
    useState(
      "Verifying your reservation payment..."
    );

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      setMessage(
        "No reservation order was found."
      );
      return;
    }

    async function verifyPayment() {
      try {
        const response = await fetch(
          "/api/reserve/confirm",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              orderId,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to verify payment."
          );
        }

        /*
         * Payment successfully verified.
         */
        if (
          data.paymentStatus ===
          "success"
        ) {
          setStatus("success");

          setMessage(
            "Your studio reservation has been confirmed."
          );

          /*
           * The temporary form data
           * is no longer needed.
           */
          sessionStorage.removeItem(
            "avenor_reservation"
          );

          return;
        }

        /*
         * Payment may still be processing.
         */
        if (
          data.paymentStatus ===
          "pending"
        ) {
          setStatus("pending");

          setMessage(
            "Your payment is being processed. Your reservation will be confirmed once Cashfree confirms the payment."
          );

          return;
        }

        /*
         * Payment failed.
         */
        setStatus("failed");

        setMessage(
          "Your reservation payment could not be confirmed."
        );
      } catch (error) {
        console.error(
          "Payment verification error:",
          error
        );

        setStatus("failed");

        setMessage(
          "We could not verify your payment. Please contact AVENOR before making another payment."
        );
      }
    }

    verifyPayment();
  }, [orderId]);

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">

        {/* BRAND */}

        <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
          AVENOR
        </p>

        {/* TITLE */}

        <h1
          className="mt-6 text-5xl font-light text-[#AF9685]"
          style={{
            fontFamily:
              "Cormorant Garamond, serif",
          }}
        >
          {status === "success"
            ? "Reservation Confirmed"
            : status === "checking"
            ? "Verifying Payment"
            : status === "pending"
            ? "Payment Processing"
            : "Payment Verification"}
        </h1>

        {/* STATUS ICON */}

        <div className="mt-10 flex justify-center">

          {status === "checking" && (
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D9C9BC] border-t-[#AF9685]" />
          )}

          {status === "success" && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#AF9685] text-2xl text-[#AF9685]">
              ✓
            </div>
          )}

          {status === "pending" && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9C9BC] text-2xl text-[#AF9685]">
              …
            </div>
          )}

          {status === "failed" && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9C9BC] text-2xl text-gray-500">
              !
            </div>
          )}

        </div>

        {/* MESSAGE */}

        <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-gray-500">
          {message}
        </p>

        {/* SUCCESS INFORMATION */}

        {status === "success" && (
          <div className="mx-auto mt-10 max-w-xl border border-[#D9C9BC] bg-[#F7F5F2] p-8 text-left">

            <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
              Studio Reservation
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-600">
              Your ₹2,000 studio reservation
              fee has been successfully
              received.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Your reserved consultation
              opportunity has been recorded
              with AVENOR before the public
              release.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Our atelier will contact you
              using the details provided in
              your reservation.
            </p>

            <p className="mt-6 text-xs leading-6 tracking-[0.08em] text-gray-400">
              Reservation fee:
              <span className="ml-1">
                ₹2,000
              </span>
            </p>

            {orderId && (
              <p className="mt-2 break-all text-xs leading-6 tracking-[0.08em] text-gray-400">
                Reservation reference:
                <span className="ml-1">
                  {orderId}
                </span>
              </p>
            )}

          </div>
        )}

        {/* PENDING INFORMATION */}

        {status === "pending" && (
          <div className="mx-auto mt-10 max-w-xl border border-[#D9C9BC] bg-[#F7F5F2] p-8">

            <p className="text-sm leading-7 text-gray-600">
              Please do not make another
              payment.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Cashfree may still be
              confirming your payment.
              Your reservation will be
              updated automatically once
              the payment is confirmed.
            </p>

          </div>
        )}

        {/* FAILED INFORMATION */}

        {status === "failed" && (
          <div className="mx-auto mt-10 max-w-xl border border-[#D9C9BC] bg-[#F7F5F2] p-8">

            <p className="text-sm leading-7 text-gray-600">
              Please do not immediately
              make another payment.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              If money has already been
              deducted from your account,
              your payment may still be
              processing.
            </p>

            {orderId && (
              <p className="mt-5 break-all text-xs leading-6 tracking-[0.08em] text-gray-400">
                Order reference:
                <span className="ml-1">
                  {orderId}
                </span>
              </p>
            )}

          </div>
        )}

        {/* FOOTER */}

        <p className="mt-12 text-xs leading-6 tracking-[0.15em] text-gray-400">
          AVENOR
          <br />
          Quiet luxury. Limited pieces.
          Thoughtfully crafted.
        </p>

      </div>
    </main>
  );
}
