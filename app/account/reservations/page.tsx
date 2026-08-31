"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { products } from "@/lib/products";

type ReservationStatus =
  | "pending"
  | "confirmed"
  | "purchased"
  | "refunded";

type PaymentStatus =
  | "pending"
  | "confirmed"
  | "purchased"
  | "refunded"
  | "closed";

type Reservation = {
  _id: string;

  cashfreeOrderId: string;

  product: string;

  fullName?: string;

  email?: string;

  reservationFee: number;

  paymentStatus: PaymentStatus;

  status: ReservationStatus;

  orderNumber?: string;

  refundStatus?:
    | "not_required"
    | "pending"
    | "processed"
    | "failed";

  refundAmount?: number;

  refundedAt?: string;

  createdAt?: string;
};

export default function ReservationsPage() {
  const {
    data: session,
    status,
  } = useSession();

  const [
    reservations,
    setReservations,
  ] = useState<Reservation[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
   * =========================================================
   * USER EMAIL
   * =========================================================
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

    let cancelled = false;

    async function loadReservations() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/reservations?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            method: "GET",
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

        if (!cancelled) {
          setReservations(
            Array.isArray(
              data.reservations
            )
              ? data.reservations
              : []
          );
        }
      } catch (error) {
        console.error(
          "Reservation loading error:",
          error
        );

        if (!cancelled) {
          setReservations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReservations();

    return () => {
      cancelled = true;
    };
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

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

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
            className="
              mt-5
              text-5xl
              font-light
              text-[#AF9685]
            "
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

            <div
              className="
                mx-auto
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-[#D9C9BC]
                border-t-[#AF9685]
              "
            />

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
            <div
              className="
                mx-auto
                mt-20
                max-w-xl
                border
                border-[#D9C9BC]
                bg-[#F7F5F2]
                p-10
                text-center
              "
            >

              <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                No Reservations
              </p>

              <p className="mt-5 text-sm leading-7 text-gray-500">
                You do not have any
                AVENOR studio reservations
                yet.
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

                  /*
                   * =================================================
                   * FIND PRODUCT
                   * =================================================
                   */

                  const product =
                    products.find(
                      (item) =>
                        item.id ===
                        reservation.product
                    );

                  /*
                   * =================================================
                   * PRODUCT NO LONGER EXISTS
                   * =================================================
                   */

                  if (!product) {
                    return (
                      <div
                        key={
                          reservation._id
                        }
                        className="
                          border
                          border-[#D9C9BC]
                          bg-white
                          p-8
                        "
                      >

                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                          Reservation
                        </p>

                        <p className="mt-4 text-sm leading-7 text-gray-500">
                          This reserved piece
                          is no longer available
                          in the collection.
                        </p>

                      </div>
                    );
                  }

                  /*
                   * =================================================
                   * NORMALISE DATABASE STATUS
                   * =================================================
                   */

                  const paymentStatus =
                    String(
                      reservation.paymentStatus ??
                        ""
                    ).toLowerCase();

                  const reservationStatus =
                    String(
                      reservation.status ??
                        ""
                    ).toLowerCase();

                  /*
                   * =================================================
                   * RESERVATION STATES
                   * =================================================
                   */

                  const hasPrivateAccess =
                    paymentStatus ===
                      "confirmed" &&
                    reservationStatus ===
                      "confirmed";

                  const isPurchased =
                    reservationStatus ===
                    "purchased";

                  const isRefunded =
                    reservationStatus ===
                      "refunded" ||
                    paymentStatus ===
                      "refunded";

                  const isPending =
                    reservationStatus ===
                    "pending";

                  /*
                   * =================================================
                   * COLLECTION PHASE
                   * =================================================
                   */

                  const phase =
                    product.collectionPhase;

                  /*
                   * =================================================
                   * PRIVATE PURCHASE AVAILABLE
                   * =================================================
                   *
                   * Only a customer with a confirmed
                   * reservation can reach the actual
                   * product/purchase page during the
                   * private allocation window.
                   */

                  const privatePurchaseAvailable =
                    phase ===
                      "private_purchase" &&
                    hasPrivateAccess;

                  /*
                   * =================================================
                   * PUBLIC PURCHASE
                   * =================================================
                   */

                  const publicPurchaseAvailable =
                    phase === "public";

                  /*
                   * =================================================
                   * SOLD OUT
                   * =================================================
                   */

                  const editionExhausted =
                    phase === "sold_out";

                  /*
                   * =================================================
                   * WAITING FOR PRIVATE PURCHASE
                   * =================================================
                   *
                   * IMPORTANT:
                   *
                   * The customer has paid and is confirmed,
                   * but the private purchase window has NOT
                   * opened yet.
                   *
                   * They remain on the reservation page.
                   */

                  const waitingForPrivateWindow =
                    phase ===
                      "private_access" &&
                    hasPrivateAccess;

                  /*
                   * =================================================
                   * STATUS LABEL
                   * =================================================
                   */

                  let statusLabel =
                    "Reservation Pending";

                  let description =
                    "Your reservation payment is still being processed.";

                  /*
                   * =================================================
                   * CONFIRMED RESERVATION
                   * =================================================
                   */

                  if (
                    hasPrivateAccess
                  ) {
                    statusLabel =
                      "Private Access Confirmed";

                    description =
                      "Your ₹2,000 studio reservation has been successfully confirmed. Your private access is secured for this piece.";
                  }

                  /*
                   * =================================================
                   * WAITING FOR PRIVATE PURCHASE
                   * =================================================
                   */

                  if (
                    waitingForPrivateWindow
                  ) {
                    statusLabel =
                      "Private Access Secured";

                    description =
                      "Your ₹2,000 reservation has been successfully confirmed. Your private access is secured for this piece. Your private purchasing window will open during the private collection release.";
                  }

                  /*
                   * =================================================
                   * PRIVATE PURCHASE OPEN
                   * =================================================
                   */

                  if (
                    privatePurchaseAvailable
                  ) {
                    statusLabel =
                      "Private Collection Access";

                    description =
                      "Your private purchasing window is now open. You have priority access to claim this limited piece before public release.";
                  }

                  /*
                   * =================================================
                   * PUBLIC
                   * =================================================
                   */

                  if (
                    publicPurchaseAvailable &&
                    hasPrivateAccess
                  ) {
                    statusLabel =
                      "Collection Now Open";

                    description =
                      "The collection is now publicly available. Your private access has already been secured.";
                  }

                  /*
                   * =================================================
                   * PUBLIC WITHOUT PRIVATE ACCESS
                   * =================================================
                   */

                  if (
                    publicPurchaseAvailable &&
                    !hasPrivateAccess &&
                    !isPurchased &&
                    !isRefunded
                  ) {
                    statusLabel =
                      "Collection Now Open";

                    description =
                      "The collection is now publicly available while pieces remain.";
                  }

                  /*
                   * =================================================
                   * PURCHASED
                   * =================================================
                   */

                  if (
                    isPurchased
                  ) {
                    statusLabel =
                      "Purchased";

                    description =
                      "This AVENOR piece has been successfully purchased.";
                  }

                  /*
                   * =================================================
                   * SOLD OUT
                   * =================================================
                   */

                  if (
                    editionExhausted &&
                    !isPurchased &&
                    !isRefunded
                  ) {
                    statusLabel =
                      "Edition Exhausted";

                    description =
                      "This limited edition has sold out and is no longer available for purchase.";
                  }

                  /*
                   * =================================================
                   * REFUNDED
                   * =================================================
                   */

                  if (
                    isRefunded
                  ) {
                    statusLabel =
                      "Reservation Refunded";

                    description =
                      "Your private reservation opportunity has ended without a purchase and the reservation fee has been marked for refund.";
                  }

                  /*
                   * =================================================
                   * STATUS COLOR
                   * =================================================
                   */

                  let statusClass =
                    "text-[#AF9685]";

                  if (
                    hasPrivateAccess ||
                    privatePurchaseAvailable ||
                    publicPurchaseAvailable ||
                    isPurchased
                  ) {
                    statusClass =
                      "text-[#8C9A78]";
                  }

                  if (
                    editionExhausted ||
                    isRefunded
                  ) {
                    statusClass =
                      "text-gray-400";
                  }

                  /*
                   * =================================================
                   * ACTION
                   * =================================================
                   */

                  let action = null;

                  /*
                   * =================================================
                   * PRIVATE PURCHASE
                   * =================================================
                   *
                   * ONLY NOW does the customer
                   * get sent to the actual product page.
                   */

                  if (
                    privatePurchaseAvailable
                  ) {
                    action = (
                      <Link
                        href={`/product/${product.id}`}
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
                        Claim Private Allocation
                      </Link>
                    );
                  }

                  /*
                   * =================================================
                   * PUBLIC PURCHASE
                   * =================================================
                   */

                  else if (
                    publicPurchaseAvailable
                  ) {
                    action = (
                      <Link
                        href={`/product/${product.id}`}
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
                        Acquire From Collection
                      </Link>
                    );
                  }

                  /*
                   * =================================================
                   * SOLD OUT
                   * =================================================
                   */

                  else if (
                    editionExhausted
                  ) {
                    action = (
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
                        Edition Exhausted
                      </span>
                    );
                  }

                  /*
                   * =================================================
                   * PURCHASED
                   * =================================================
                   */

                  else if (
                    isPurchased
                  ) {
                    action = (
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
                    );
                  }

                  /*
                   * =================================================
                   * REFUNDED
                   * =================================================
                   */

                  else if (
                    isRefunded
                  ) {
                    action = (
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
                        Reservation Closed
                      </span>
                    );
                  }

                  /*
                   * =================================================
                   * WAITING FOR PRIVATE PURCHASE
                   * =================================================
                   *
                   * IMPORTANT:
                   *
                   * This link goes to /reserve/[product].
                   *
                   * It NEVER goes to /product/[product]
                   * before the purchase window opens.
                   */

                  else if (
                    waitingForPrivateWindow
                  ) {
                    action = (
                      <Link
                        href={`/reserve/${product.id}`}
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
                        View Private Access
                      </Link>
                    );
                  }

                  /*
                   * =================================================
                   * PENDING
                   * =================================================
                   */

                  else if (
                    isPending
                  ) {
                    action = (
                      <Link
                        href={`/reserve/${product.id}`}
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
                        View Reservation
                      </Link>
                    );
                  }

                  /*
                   * =================================================
                   * CARD
                   * =================================================
                   */

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

                      <div
                        className="
                          grid
                          grid-cols-1
                          md:grid-cols-[280px_1fr]
                        "
                      >

                        {/* ========================================= */}
                        {/* IMAGE */}
                        {/* ========================================= */}

                        {/*
                         * =================================================
                         * VERY IMPORTANT
                         * =================================================
                         *
                         * The reservation image ALWAYS goes to:
                         *
                         * /reserve/[product]
                         *
                         * It does NOT go to:
                         *
                         * /product/[product]
                         *
                         * This prevents customers from entering the
                         * purchase page before the private purchase
                         * window opens.
                         */}

                        <Link
                          href={`/reserve/${product.id}`}
                          className="
                            relative
                            block
                            aspect-[3/4]
                            bg-[#F7F5F2]
                            md:aspect-auto
                            md:min-h-[380px]
                          "
                        >

                          <Image
                            src={
                              product.coverImage
                            }
                            alt={
                              product.name
                            }
                            fill
                            sizes="
                              (max-width: 768px)
                              100vw,
                              280px
                            "
                            className="
                              object-contain
                              transition-transform
                              duration-500
                              hover:scale-[1.02]
                            "
                          />

                        </Link>

                        {/* ========================================= */}
                        {/* DETAILS */}
                        {/* ========================================= */}

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
                            {product.name}
                          </h2>

                          {/* PRODUCT TYPE */}

                          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-gray-400">
                            {product.type}
                          </p>

                          {/* DESCRIPTION */}

                          <p className="mt-5 text-sm leading-7 text-gray-500">
                            {description}
                          </p>

                          {/* ========================================= */}
                          {/* PRIVATE PURCHASE OPEN */}
                          {/* ========================================= */}

                          {privatePurchaseAvailable && (
                            <div
                              className="
                                mt-7
                                border
                                border-[#D9C9BC]
                                bg-[#F7F5F2]
                                p-6
                              "
                            >

                              <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                                Reserved For You
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-600">
                                Your private
                                purchasing window
                                is now open.
                              </p>

                              <p className="mt-3 text-sm leading-7 text-gray-500">
                                Confirmed private
                                access clients
                                are being
                                prioritised before
                                this piece is
                                released publicly.
                              </p>

                            </div>
                          )}

                          {/* ========================================= */}
                          {/* PRIVATE ACCESS WAITING */}
                          {/* ========================================= */}

                          {waitingForPrivateWindow && (
                            <div
                              className="
                                mt-7
                                border
                                border-[#D9C9BC]
                                bg-[#F7F5F2]
                                p-6
                              "
                            >

                              <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                                Private Access Secured
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-600">
                                Your reservation
                                has been
                                successfully
                                confirmed.
                              </p>

                              <p className="mt-3 text-sm leading-7 text-gray-500">
                                You will receive
                                priority access
                                when the private
                                purchasing window
                                opens.
                              </p>

                            </div>
                          )}

                          {/* ========================================= */}
                          {/* PUBLIC RELEASE */}
                          {/* ========================================= */}

                          {publicPurchaseAvailable && (
                            <div
                              className="
                                mt-7
                                border
                                border-[#D9C9BC]
                                bg-[#F7F5F2]
                                p-6
                              "
                            >

                              <p className="text-xs uppercase tracking-[0.3em] text-[#8C9A78]">
                                Collection Open
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-600">
                                The collection
                                is now open to
                                all clients.
                              </p>

                            </div>
                          )}

                          {/* ========================================= */}
                          {/* SOLD OUT */}
                          {/* ========================================= */}

                          {editionExhausted && (
                            <div
                              className="
                                mt-7
                                border
                                border-[#E5E5E5]
                                bg-[#FAFAFA]
                                p-6
                              "
                            >

                              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                Edition Exhausted
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-500">
                                This limited
                                edition has been
                                fully allocated
                                and is no longer
                                available for
                                purchase.
                              </p>

                            </div>
                          )}

                          {/* ========================================= */}
                          {/* PURCHASED */}
                          {/* ========================================= */}

                          {isPurchased && (
                            <div
                              className="
                                mt-7
                                border
                                border-[#D9C9BC]
                                bg-[#F7F5F2]
                                p-6
                              "
                            >

                              <p className="text-xs uppercase tracking-[0.3em] text-[#8C9A78]">
                                Purchase Complete
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-600">
                                Your reserved
                                AVENOR piece has
                                been purchased
                                successfully.
                              </p>

                              {reservation.orderNumber && (
                                <p className="mt-4 text-xs tracking-[0.08em] text-gray-400">
                                  Order:
                                  {" "}
                                  {
                                    reservation.orderNumber
                                  }
                                </p>
                              )}

                            </div>
                          )}

                          {/* ========================================= */}
                          {/* REFUNDED */}
                          {/* ========================================= */}

                          {isRefunded && (
                            <div
                              className="
                                mt-7
                                border
                                border-[#E5E5E5]
                                bg-[#FAFAFA]
                                p-6
                              "
                            >

                              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                                Reservation Refunded
                              </p>

                              <p className="mt-4 text-sm leading-7 text-gray-500">
                                Your private
                                purchasing
                                opportunity has
                                ended without a
                                purchase.
                              </p>

                              {reservation.refundAmount &&
                                reservation.refundAmount >
                                  0 && (
                                  <p className="mt-4 text-xs tracking-[0.08em] text-gray-400">
                                    Refund:
                                    {" "}
                                    ₹
                                    {Number(
                                      reservation.refundAmount
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                )}

                            </div>
                          )}

                          {/* ========================================= */}
                          {/* RESERVATION DETAILS */}
                          {/* ========================================= */}

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

                            {/* ACCESS */}

                            <div className="flex justify-between gap-6 text-sm">

                              <span className="text-gray-400">
                                Access
                              </span>

                              <span
                                className={
                                  hasPrivateAccess
                                    ? "text-[#8C9A78]"
                                    : isPurchased
                                    ? "text-[#8C9A78]"
                                    : isRefunded
                                    ? "text-gray-400"
                                    : "text-[#AF9685]"
                                }
                              >
                                {hasPrivateAccess
                                  ? "PRIVATE ACCESS"
                                  : isPurchased
                                  ? "PURCHASED"
                                  : isRefunded
                                  ? "CLOSED"
                                  : "PENDING"}
                              </span>

                            </div>

                            {/* COLLECTION */}

                            <div className="flex justify-between gap-6 text-sm">

                              <span className="text-gray-400">
                                Collection
                              </span>

                              <span className="text-gray-700">

                                {phase ===
                                "private_access"
                                  ? "PRIVATE ACCESS"
                                  : phase ===
                                    "private_purchase"
                                  ? "PRIVATE PURCHASE"
                                  : phase ===
                                    "public"
                                  ? "PUBLIC"
                                  : "SOLD OUT"}

                              </span>

                            </div>

                            {/* REFERENCE */}

                            <div className="text-xs leading-6 text-gray-400">

                              Reservation
                              Reference:

                              <br />

                              <span className="break-all">
                                {
                                  reservation.cashfreeOrderId
                                }
                              </span>

                            </div>

                          </div>

                          {/* ========================================= */}
                          {/* ACTION */}
                          {/* ========================================= */}

                          {action}

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
