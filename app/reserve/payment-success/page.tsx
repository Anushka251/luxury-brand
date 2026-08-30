"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/products";

type PaymentState =
  | "checking"
  | "success"
  | "pending"
  | "failed";

type SavedReservation = {
  orderId?: string;
  product?: string;
  fullName?: string;
  email?: string;
};

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  /*
   * Cashfree redirects back with:
   *
   * ?order_id=...
   */

  const orderId =
    searchParams.get("order_id");

  const [status, setStatus] =
    useState<PaymentState>("checking");

  const [message, setMessage] = useState(
    "Verifying your reservation payment..."
  );

  const [productId, setProductId] =
    useState<string>("");

  /*
   * =========================================================
   * FIND PRODUCT
   * =========================================================
   */

  const product = products.find(
    (item) => item.id === productId
  );

  /*
   * =========================================================
   * VERIFY PAYMENT
   * =========================================================
   */

  useEffect(() => {
    /*
     * ---------------------------------------------------------
     * READ SAVED RESERVATION
     * ---------------------------------------------------------
     */

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
          setProductId(
            reservation.product
          );
        }
      } catch (error) {
        console.error(
          "Could not read saved reservation:",
          error
        );
      }
    }

    /*
     * ---------------------------------------------------------
     * NO ORDER ID
     * ---------------------------------------------------------
     */

    if (!orderId) {
      setStatus("failed");

      setMessage(
        "No reservation order was found."
      );

      return;
    }

    /*
     * ---------------------------------------------------------
     * VERIFY WITH SERVER
     * ---------------------------------------------------------
     */

    async function verifyPayment() {
      try {
        setStatus("checking");

        setMessage(
          "Verifying your reservation payment..."
        );

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

        console.log(
          "Reservation payment verification:",
          data
        );

        /*
         * -------------------------------------------------------
         * SERVER ERROR
         * -------------------------------------------------------
         */

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Unable to verify payment."
          );
        }

        /*
         * -------------------------------------------------------
         * PAYMENT STATUS
         * -------------------------------------------------------
         *
         * NEW AVENOR STANDARD:
         *
         * paymentStatus = "confirmed"
         * status        = "confirmed"
         *
         * We also accept "success" here temporarily
         * so an older confirm endpoint does not break
         * the payment result page during migration.
         */

        const paymentStatus =
          String(
            data.paymentStatus ??
              data.payment_status ??
              data.order_status ??
              ""
          ).toLowerCase();

        /*
         * -------------------------------------------------------
         * SUCCESS
         * -------------------------------------------------------
         */

        if (
          paymentStatus ===
            "confirmed" ||
          paymentStatus ===
            "success" ||
          paymentStatus ===
            "paid"
        ) {
          setStatus("success");

          setMessage(
            "Your private studio access has been confirmed."
          );

          return;
        }

        /*
         * -------------------------------------------------------
         * PENDING
         * -------------------------------------------------------
         */

        if (
          paymentStatus ===
            "pending" ||
          paymentStatus ===
            "processing" ||
          paymentStatus ===
            "active"
        ) {
          setStatus("pending");

          setMessage(
            "Your payment is being processed. Your private access will be confirmed once the payment is verified."
          );

          return;
        }

        /*
         * -------------------------------------------------------
         * FAILED
         * -------------------------------------------------------
         */

        if (
          paymentStatus ===
            "failed" ||
          paymentStatus ===
            "failure" ||
          paymentStatus ===
            "cancelled" ||
          paymentStatus ===
            "cancelled_by_user"
        ) {
          setStatus("failed");

          setMessage(
            "Your reservation payment was not completed."
          );

          return;
        }

        /*
         * -------------------------------------------------------
         * UNKNOWN
         * -------------------------------------------------------
         *
         * Do not pretend an unknown response
         * is successful.
         */

        console.warn(
          "Unknown reservation payment status:",
          paymentStatus
        );

        setStatus("pending");

        setMessage(
          "Your payment is still being verified. Please do not make another payment."
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
   * =========================================================
   * RETRY PAYMENT
   * =========================================================
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
            `/reserve/form/${reservation.product}`;

          return;
        }
      } catch (error) {
        console.error(
          "Unable to read reservation:",
          error
        );
      }
    }

    window.location.href =
      "/shop";
  }

  /*
   * =========================================================
   * RETURN TO COLLECTION
   * =========================================================
   */

  function handleReturnToCollection() {
    window.location.href =
      "/shop";
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">

      <div className="mx-auto max-w-2xl text-center">

        {/* ================================================= */}
        {/* BRAND */}
        {/* ================================================= */}

        <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
          AVENOR
        </p>

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <h1
          className="mt-6 text-5xl font-light text-[#AF9685]"
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          {status === "success"
            ? "Private Access Confirmed"
            : status === "checking"
            ? "Verifying Payment"
            : status === "pending"
            ? "Payment Processing"
            : "Payment Unsuccessful"}
        </h1>

        {/* ================================================= */}
        {/* STATUS ICON */}
        {/* ================================================= */}

        <div className="mt-10 flex justify-center">

          {status === "checking" && (
            <div
              className="
                h-10
                w-10
                animate-spin
                rounded-full
                border-2
                border-[#D9C9BC]
                border-t-[#AF9685]
              "
            />
          )}

          {status === "success" && (
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-[#AF9685]
                text-2xl
                text-[#AF9685]
              "
            >
              ✓
            </div>
          )}

          {status === "pending" && (
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-[#D9C9BC]
                text-2xl
                text-[#AF9685]
              "
            >
              …
            </div>
          )}

          {status === "failed" && (
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                border
                border-[#D9C9BC]
                text-2xl
                text-gray-500
              "
            >
              !
            </div>
          )}

        </div>

        {/* ================================================= */}
        {/* MESSAGE */}
        {/* ================================================= */}

        <p className="mx-auto mt-8 max-w-xl text-sm leading-8 text-gray-500">
          {message}
        </p>

        {/* ================================================= */}
        {/* RESERVED PIECE */}
        {/* ================================================= */}

        {product && (
          <div className="mx-auto mt-12 max-w-md">

            <p className="text-xs uppercase tracking-[0.35em] text-[#AF9685]">
              {status === "success"
                ? "Private Access"
                : "Selected Piece"}
            </p>

            <Link
              href={`/reserve/${product.id}`}
              className="group mt-6 block"
            >

              <div
                className="
                  relative
                  w-full
                  overflow-hidden
                  border
                  border-[#D9C9BC]
                  bg-[#F7F5F2]
                "
              >
                <Image
                  src={product.coverImage}
                  alt={product.name}
                  width={800}
                  height={1000}
                  priority
                  sizes="(max-width: 768px) 90vw, 420px"
                  className="
                    block
                    h-auto
                    w-full
                    object-contain
                    transition-transform
                    duration-700
                    group-hover:scale-[1.015]
                  "
                />
              </div>

              <h2
                className="
                  mt-7
                  text-4xl
                  font-light
                  text-[#AF9685]
                  transition-opacity
                  duration-300
                  group-hover:opacity-60
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                {product.name}
              </h2>

              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-gray-400">
                {product.type}
              </p>

              <p
                className="
                  mt-5
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  text-gray-400
                  transition-colors
                  duration-300
                  group-hover:text-black
                "
              >
                View Reserved Piece →
              </p>

            </Link>

          </div>
        )}

        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {status === "success" && (
          <div
            className="
              mx-auto
              mt-10
              max-w-xl
              border
              border-[#D9C9BC]
              bg-[#F7F5F2]
              p-8
              text-left
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-[0.3em]
                text-[#AF9685]
              "
            >
              Private Access Confirmed
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-600">
              Your ₹2,000 studio reservation
              fee has been successfully
              received.
            </p>

            {product && (
              <p className="mt-3 text-sm leading-7 text-gray-600">
                Your private access has been
                recorded for{" "}
                <strong>
                  {product.name}
                </strong>
                .
              </p>
            )}

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Your reservation gives you
              priority access before the
              public release.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Our atelier will contact you
              using the details provided
              during your reservation.
            </p>

            <p
              className="
                mt-6
                text-xs
                leading-6
                tracking-[0.08em]
                text-gray-400
              "
            >
              Reservation fee:
              <span className="ml-1">
                ₹2,000
              </span>
            </p>

            {orderId && (
              <p
                className="
                  mt-2
                  break-all
                  text-xs
                  leading-6
                  tracking-[0.08em]
                  text-gray-400
                "
              >
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
          <div
            className="
              mx-auto
              mt-10
              max-w-xl
              border
              border-[#D9C9BC]
              bg-[#F7F5F2]
              p-8
            "
          >

            <p className="text-sm leading-7 text-gray-600">
              Please do not make another
              payment.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Your payment may still be
              processing or being verified.
              Your private access will be
              updated once the payment is
              confirmed.
            </p>

            {orderId && (
              <p
                className="
                  mt-5
                  break-all
                  text-xs
                  leading-6
                  tracking-[0.08em]
                  text-gray-400
                "
              >
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

            <div
              className="
                border
                border-[#D9C9BC]
                bg-[#F7F5F2]
                p-8
                text-left
              "
            >

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  text-[#AF9685]
                "
              >
                Payment Unsuccessful
              </p>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                Your ₹2,000 studio reservation
                payment could not be confirmed.
              </p>

              {product && (
                <p className="mt-4 text-sm leading-7 text-gray-500">
                  The selected piece was{" "}
                  <strong>
                    {product.name}
                  </strong>
                  .
                </p>
              )}

              <p className="mt-4 text-sm leading-7 text-gray-500">
                Your private access has not
                been confirmed at this time.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                If your bank account was charged,
                please do not make another
                payment immediately.
              </p>

              {orderId && (
                <p
                  className="
                    mt-6
                    break-all
                    text-xs
                    leading-6
                    tracking-[0.08em]
                    text-gray-400
                  "
                >
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

            <p
              className="
                mt-8
                text-xs
                leading-6
                tracking-[0.08em]
                text-gray-400
              "
            >
              If your bank account was charged
              despite this message, please do
              not make another payment immediately.
              Your payment may still be processing.
              Please contact AVENOR with your
              payment reference.
            </p>

          </div>
        )}

        {/* ================================================= */}
        {/* RETURN TO COLLECTION */}
        {/* ================================================= */}

        {status === "success" && (
          <Link
            href="/shop"
            className="
              mt-10
              inline-block
              py-4
              text-xs
              uppercase
              tracking-[0.3em]
              text-gray-400
              transition-colors
              duration-300
              hover:text-black
            "
          >
            Return to Collection →
          </Link>
        )}

        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <p
          className="
            mt-12
            text-xs
            leading-6
            tracking-[0.15em]
            text-gray-400
          "
        >
          AVENOR
          <br />
          Quiet luxury. Limited pieces.
          Thoughtfully crafted.
        </p>

      </div>
    </main>
  );
}

/*
 * =========================================================
 * PAGE
 * =========================================================
 */

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
                  '"Cormorant Garamond", serif',
              }}
            >
              Verifying Payment
            </h1>

            <div className="mt-10 flex justify-center">

              <div
                className="
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-2
                  border-[#D9C9BC]
                  border-t-[#AF9685]
                "
              />

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
