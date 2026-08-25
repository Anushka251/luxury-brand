"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

type ReservationStatus =
  | "pending"
  | "confirmed"
  | "purchase_open"
  | "purchased"
  | "sold_out";

type Reservation = {
  _id: string;
  cashfreeOrderId: string;
  product: string;
  fullName?: string;
  email?: string;
  reservationFee: number;
  paymentStatus: string;
  status?: ReservationStatus;
  createdAt?: string;
};

const productNames: Record<string, string> = {
  "crimson-rose": "Crimson Rose",
  "ivory-blush": "Ivory Blush",
  "blue-crystal": "Blue Crystal",
  "sunset-lilac": "Sunset Lilac",
};

const productImages: Record<string, string> = {
  "crimson-rose":
    "/products/crimson-rose/cover.jpg",

  "ivory-blush":
    "/products/ivory-blush/cover.jpg",

  "blue-crystal":
    "/products/blue-crystal/cover.JPG",

  "sunset-lilac":
    "/products/sunset-lilac/cover.jpg",
};

export default function ReservationsPage() {
  const { data: session, status } =
    useSession();

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * =========================================================
   * GET USER EMAIL SAFELY
   * =========================================================
   *
   * This prevents:
   *
   * "session is possibly null"
   *
   * during the Vercel TypeScript build.
   */

  const userEmail =
    session?.user?.email ?? "";

  /*
   * =========================================================
   * LOAD RESERVATIONS
   * =========================================================
   */

  useEffect(() => {
    if (!userEmail) {
      if (status !== "loading") {
        setLoading(false);
      }

      return;
    }

    async function loadReservations() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/reservations?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load reservations."
          );
        }

        const data =
          await response.json();

        setReservations(
          data.reservations ?? []
        );
      } catch (error) {
        console.error(
          "Reservation loading error:",
          error
        );

        setReservations([]);
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, [userEmail, status]);

  /*
   * =========================================================
   * SESSION LOADING
   * =========================================================
   */

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm tracking-[0.3em] text-gray-400">
            AVENOR
          </p>

          <p className="mt-8 text-sm text-gray-400">
            Loading...
          </p>

        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * NOT LOGGED IN
   * =========================================================
   */

  if (!session) {
    signIn(undefined, {
      callbackUrl:
        "/account/reservations",
    });

    return null;
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">

      <div className="mx-auto max-w-5xl">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            AVENOR
          </p>

          <h1
            className="mt-5 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Reservations
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-gray-500">
            Your private studio access and
            reservation history.
          </p>

        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div className="mt-20 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#D9C9BC] border-t-[#AF9685]" />

            <p className="mt-6 text-sm text-gray-400">
              Loading your reservations...
            </p>

          </div>
        )}

        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!loading &&
          reservations.length === 0 && (
            <div className="mx-auto mt-20 max-w-xl border border-[#D9C9BC] bg-[#F7F5F2] p-10 text-center">

              <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                No Reservations
              </p>

              <p className="mt-5 text-sm leading-7 text-gray-500">
                You do not have any
                confirmed AVENOR studio
                reservations yet.
              </p>

              <Link
                href="/shop"
                className="
                  mt-8
                  inline-block
                  border
                  border-[#AF9685]
                  px-8
                  py-4
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  text-[#AF9685]
                  transition-all
                  duration-300
                  hover:bg-[#AF9685]
                  hover:text-white
                "
              >
                View Collection
              </Link>

            </div>
          )}

        {/* ================================================= */}
        {/* RESERVATIONS */}
        {/* ================================================= */}

        {!loading &&
          reservations.length > 0 && (
            <div className="mt-16 space-y-10">

              {reservations.map(
                (reservation) => {

                  const name =
                    productNames[
                      reservation.product
                    ] ??
                    "Selected Piece";

                  const image =
                    productImages[
                      reservation.product
                    ];

                  /*
                   * =================================================
                   * RESERVATION STATE
                   * =================================================
                   */

                  const isPaymentSuccessful =
                    reservation.paymentStatus ===
                    "success";

                  const reservationStatus =
                    reservation.status ??
                    (
                      isPaymentSuccessful
                        ? "confirmed"
                        : "pending"
                    );

                  const isConfirmed =
                    isPaymentSuccessful &&
                    reservationStatus ===
                      "confirmed";

                  const isPurchaseOpen =
                    isPaymentSuccessful &&
                    reservationStatus ===
                      "purchase_open";

                  const isPurchased =
                    reservationStatus ===
                    "purchased";

                  const isSoldOut =
                    reservationStatus ===
                    "sold_out";

                  /*
                   * =================================================
                   * RESERVATION PAGE
                   * =================================================
                   *
                   * Example:
                   *
                   * /reserve/ivory-blush
                   * /reserve/crimson-rose
                   * /reserve/blue-crystal
                   * /reserve/sunset-lilac
                   */

                  const reservationUrl =
                    `/reserve/${reservation.product}`;

                  /*
                   * =================================================
                   * STATUS TEXT
                   * =================================================
                   */

                  let statusLabel =
                    "Reservation Pending";

                  let description =
                    "Your reservation payment is still being processed.";

                  if (isConfirmed) {
                    statusLabel =
                      "Private Access Confirmed";

                    description =
                      "Your private studio access for this AVENOR piece has been confirmed.";
                  }

                  if (isPurchaseOpen) {
                    statusLabel =
                      "Private Collection Access";

                    description =
                      "Your reserved piece is now available for private purchase.";
                  }

                  if (isPurchased) {
                    statusLabel =
                      "Purchased";

                    description =
                      "This reserved AVENOR piece has been purchased.";
                  }

                  if (isSoldOut) {
                    statusLabel =
                      "Out of Stock";

                    description =
                      "This piece is no longer available for purchase.";
                  }

                  /*
                   * =================================================
                   * STATUS COLOR
                   * =================================================
                   */

                  const statusClass =
                    isPurchaseOpen
                      ? "text-[#8C9A78]"
                      : isPurchased
                      ? "text-[#8C9A78]"
                      : isSoldOut
                      ? "text-gray-400"
                      : "text-[#AF9685]";

                  return (
                    <div
                      key={
                        reservation._id
                      }
                      className="
                        overflow-hidden
                        border
                        border-[#D9C9BC]
                        bg-white
                      "
                    >

                      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

                        {/* ================================================= */}
                        {/* PRODUCT IMAGE */}
                        {/* ================================================= */}

                        <Link
                          href={reservationUrl}
                          className="
                            relative
                            block
                            aspect-[3/4]
                            bg-[#F7F5F2]
                            md:aspect-auto
                            md:min-h-[380px]
                          "
                        >

                          {image && (
                            <Image
                              src={image}
                              alt={name}
                              fill
                              sizes="(max-width: 768px) 100vw, 280px"
                              className="
                                object-contain
                                transition-transform
                                duration-500
                                hover:scale-[1.02]
                              "
                            />
                          )}

                        </Link>

                        {/* ================================================= */}
                        {/* DETAILS */}
                        {/* ================================================= */}

                        <div className="p-8 md:p-12">

                          {/* STATUS */}

                          <p
                            className={`
                              text-xs
                              uppercase
                              tracking-[0.3em]
                              ${statusClass}
                            `}
                          >
                            {statusLabel}
                          </p>

                          {/* PRODUCT NAME */}

                          <h2
                            className="
                              mt-5
                              text-4xl
                              font-light
                              text-[#111]
                            "
                            style={{
                              fontFamily:
                                '"Cormorant Garamond", serif',
                            }}
                          >
                            {name}
                          </h2>

                          {/* DESCRIPTION */}

                          <p className="mt-5 text-sm leading-7 text-gray-500">
                            {description}
                          </p>

                          {/* ================================================= */}
                          {/* PURCHASE OPEN NOTICE */}
                          {/* ================================================= */}

                          {isPurchaseOpen && (
                            <div className="mt-7 border border-[#D9C9BC] bg-[#F7F5F2] p-6">

                              <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                                Reserved For You
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-600">
                                Your private purchasing
                                window is now open.
                                This piece has been
                                reserved for your
                                priority access.
                              </p>

                            </div>
                          )}

                          {/* ================================================= */}
                          {/* PURCHASED NOTICE */}
                          {/* ================================================= */}

                          {isPurchased && (
                            <div className="mt-7 border border-[#D9C9BC] bg-[#F7F5F2] p-6">

                              <p className="text-xs uppercase tracking-[0.3em] text-[#8C9A78]">
                                Purchase Complete
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-600">
                                Thank you for
                                purchasing your
                                reserved AVENOR
                                piece.
                              </p>

                            </div>
                          )}

                          {/* ================================================= */}
                          {/* SOLD OUT NOTICE */}
                          {/* ================================================= */}

                          {isSoldOut && (
                            <div className="mt-7 border border-[#E5E5E5] bg-[#FAFAFA] p-6">

                              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                Out of Stock
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-500">
                                This piece was not
                                purchased during
                                your private access
                                window and is now
                                unavailable.
                              </p>

                            </div>
                          )}

                          {/* ================================================= */}
                          {/* RESERVATION DETAILS */}
                          {/* ================================================= */}

                          <div className="mt-8 space-y-4 border-t border-[#eeeeee] pt-6">

                            {/* FEE */}

                            <div className="flex justify-between gap-6 text-sm">

                              <span className="text-gray-400">
                                Reservation Fee
                              </span>

                              <span className="text-gray-700">
                                ₹
                                {Number(
                                  reservation.reservationFee
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>

                            {/* STATUS */}

                            <div className="flex justify-between gap-6 text-sm">

                              <span className="text-gray-400">
                                Status
                              </span>

                              <span
                                className={
                                  isPurchaseOpen ||
                                  isPurchased
                                    ? "text-[#8C9A78]"
                                    : isSoldOut
                                    ? "text-gray-400"
                                    : "text-[#AF9685]"
                                }
                              >
                                {isPurchaseOpen
                                  ? "PRIVATE ACCESS"
                                  : isPurchased
                                  ? "PURCHASED"
                                  : isSoldOut
                                  ? "OUT OF STOCK"
                                  : isConfirmed
                                  ? "CONFIRMED"
                                  : "PENDING"}
                              </span>

                            </div>

                            {/* REFERENCE */}

                            <div className="text-xs leading-6 text-gray-400">

                              Reservation Reference:

                              <br />

                              <span className="break-all">
                                {
                                  reservation.cashfreeOrderId
                                }
                              </span>

                            </div>

                          </div>

                          {/* ================================================= */}
                          {/* ACTION */}
                          {/* ================================================= */}

                          {isPurchaseOpen && (
                            <Link
                              href={`/product/${reservation.product}`}
                              className="
                                mt-8
                                inline-block
                                border
                                border-[#AF9685]
                                px-10
                                py-4
                                text-xs
                                uppercase
                                tracking-[0.3em]
                                text-[#AF9685]
                                transition-all
                                duration-300
                                hover:bg-[#AF9685]
                                hover:text-white
                              "
                            >
                              Buy Now
                            </Link>
                          )}

                          {isPurchased && (
                            <Link
                              href="/account/orders"
                              className="
                                mt-8
                                inline-block
                                border
                                border-[#AF9685]
                                px-10
                                py-4
                                text-xs
                                uppercase
                                tracking-[0.3em]
                                text-[#AF9685]
                                transition-all
                                duration-300
                                hover:bg-[#AF9685]
                                hover:text-white
                              "
                            >
                              View Order
                            </Link>
                          )}

                          {isSoldOut && (
                            <span
                              className="
                                mt-8
                                inline-block
                                border
                                border-gray-300
                                px-10
                                py-4
                                text-xs
                                uppercase
                                tracking-[0.3em]
                                text-gray-400
                              "
                            >
                              Out of Stock
                            </span>
                          )}

                          {!isPurchaseOpen &&
                            !isPurchased &&
                            !isSoldOut && (
                              <Link
                                href={reservationUrl}
                                className="
                                  mt-8
                                  inline-block
                                  border
                                  border-[#AF9685]
                                  px-10
                                  py-4
                                  text-xs
                                  uppercase
                                  tracking-[0.3em]
                                  text-[#AF9685]
                                  transition-all
                                  duration-300
                                  hover:bg-[#AF9685]
                                  hover:text-white
                                "
                              >
                                View Piece
                              </Link>
                            )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

      </div>
    </main>
  );
}
