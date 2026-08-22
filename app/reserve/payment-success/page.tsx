"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";

type PaymentState =
  | "checking"
  | "success"
  | "pending"
  | "failed";

type SavedReservation = {
  product?: string;
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");

  const [status, setStatus] =
    useState<PaymentState>("checking");

  const [message, setMessage] = useState(
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
         * PAYMENT SUCCESS
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
           * The temporary reservation
           * data is no longer needed.
           */

          sessionStorage.removeItem(
            "avenor_reservation"
          );

          return;
        }

        /*
         * PAYMENT PENDING
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
         * PAYMENT FAILED
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

  /*
   * RETRY PAYMENT
   */

  function handleRetryPayment() {
    const saved =
      sessionStorage.getItem(
        "avenor_reservation"
      );

    if (saved) {
      try {
        const reservation =
          JSON.parse(
            saved
          ) as SavedReservation;

        if (reservation.product) {
          window.location.href =
            `/reserve/${reservation.product}`;

          return;
        }
      } catch (error) {
        console.error(
          "Unable to read saved reservation:",
          error
        );
      }
    }

    /*
     * If the temporary reservation
     * data is unavailable, return
     * to the collection.
     */

    window.location.href =
      "/shop";
  }

  /*
   * RETURN TO COLLECTION
   */

  function handleReturnToCollection() {
    window.location.href =
      "/shop";
  }

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
            : "Payment Unsuccessful"}
        </h1>

        {/* STATUS ICON */}

        <div className="mt-10 flex justify-center">

          {/* CHECKING */}

          {status === "checking" && (
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D9C9BC] border-t-[#AF9685]" />
          )}

          {/* SUCCESS */}

          {status === "success" && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#AF9685] text-2xl text-[#AF9685]">
              ✓
            </div>
          )}

          {/* PENDING */}

          {status === "pending" && (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#D9C9BC] text-2xl text-[#AF9685]">
              …
            </div>
          )}

          {/* FAILED */}

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

        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {status === "success" && (
          <div className="mx-auto mt-10 max-w-xl border border-[#D9C9BC] bg-[#F7F5F2] p-8 text-left">

            <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
              Studio Reservation
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-600">
              Your ₹2,000 studio
              reservation fee has been
              successfully received.
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

        {/* ================================================= */}
        {/* PENDING */}
        {/* ================================================= */}

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

            {orderId && (
              <p className="mt-5 break-all text-xs leading-6 tracking-[0.08em] text-gray-400">
                Payment reference:
                <span className="ml-1">
                  {orderId}
                </span>
              </p>
            )}

          </div>
        )}

        {/* ================================================= */}
        {/* FAILED */}
        {/* ================================================= */}

        {status === "failed" && (
          <div className="mx-auto mt-10 max-w-xl">

            {/* FAILED INFORMATION */}

            <div className="border border-[#D9C9BC] bg-[#F7F5F2] p-8 text-left">

              <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                Payment Unsuccessful
              </p>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                Your ₹2,000 studio
                reservation payment was not
                successfully confirmed.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                Your studio slot has
                therefore not been confirmed.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                You may return to the
                reservation form and try the
                payment again.
              </p>

              {orderId && (
                <p className="mt-6 break-all text-xs leading-6 tracking-[0.08em] text-gray-400">
                  Payment reference:
                  <span className="ml-1">
                    {orderId}
                  </span>
                </p>
              )}

            </div>

            {/* RETRY */}

            <div className="mt-8 space-y-4">

              <button
                type="button"
                onClick={
                  handleRetryPayment
                }
                className="
                  w-full
                  border
                  border-[#AF9685]
                  py-4
                  uppercase
                  tracking-[0.3em]
                  text-[#AF9685]
                  transition-all
                  duration-300
                  hover:bg-[#AF9685]
                  hover:text-white
                "
              >
                Try Payment Again
              </button>

              <button
                type="button"
                onClick={
                  handleReturnToCollection
                }
                className="
                  w-full
                  py-4
                  uppercase
                  tracking-[0.3em]
                  text-gray-400
                  transition-colors
                  duration-300
                  hover:text-black
                "
              >
                Return to Collection
              </button>

            </div>

            {/* MONEY-DEDUCTED WARNING */}

            <p className="mt-8 text-xs leading-6 tracking-[0.08em] text-gray-400">
              If your bank account was
              charged despite this message,
              please do not make another
              payment immediately. Your
              payment may still be processing.
              Please contact AVENOR with
              your payment reference.
            </p>

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

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">

            <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
              AVENOR
            </p>

            <h1
              className="mt-6 text-5xl font-light text-[#AF9685]"
              style={{
                fontFamily:
                  "Cormorant Garamond, serif",
              }}
            >
              Verifying Payment
            </h1>

            <div className="mt-10 flex justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D9C9BC] border-t-[#AF9685]" />
            </div>

            <p className="mt-8 text-sm leading-7 text-gray-500">
              Please wait while we verify
              your reservation payment.
            </p>

          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
