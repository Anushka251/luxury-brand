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
  paymentStatus: PaymentStatus | string;
  status?: ReservationStatus;
  orderNumber?: string;
  refundStatus?: string;
  refundAmount?: number;
  refundedAt?: string;
  createdAt?: string;
};

export default function ReservationsPage() {
  const { data: session, status } = useSession();

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * =========================================================
   * GET USER EMAIL SAFELY
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
                   * If the product no longer
                   * exists in products.ts,
                   * don't break the page.
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

                        <p className="mt-4 text-sm text-gray-500">
                          This reserved piece
                          is no longer available
                          in the collection.
                        </p>
                      </div>
                    );
                  }

                  /*
                   * =================================================
                   * PAYMENT / RESERVATION STATE
                   * =================================================
                   *
                   * IMPORTANT:
                   *
                   * Your new schema uses:
                   *
                   * paymentStatus:
                   * pending
                   * confirmed
                   * purchased
                   * refunded
                   * closed
                   *
                   * reservation status:
                   * pending
                   * confirmed
                   * purchased
                   * refunded
                   */

                  const hasPrivateAccess =
                    reservation.paymentStatus ===
                      "confirmed" &&
                    reservation.status ===
                      "confirmed";

                  const isPurchased =
                    reservation.status ===
                    "purchased";

                  const isRefunded =
                    reservation.status ===
                    "refunded" ||
                    reservation.paymentStatus ===
                    "refunded";

                  const isPending =
                    !hasPrivateAccess &&
                    !isPurchased &&
                    !isRefunded;

                  /*
                   * =================================================
                   * COLLECTION PHASE
                   * =================================================
                   *
                   * This comes from lib/products.ts.
                   *
                   * private_access
                   * private_purchase
                   * public
                   * sold_out
                   */

                  const phase =
                    product.collectionPhase;

                  /*
                   * =================================================
                   * PRIVATE PURCHASE
                   * =================================================
                   *
                   * Only customers with confirmed
                   * private access can purchase.
                   */

                  const privatePurchaseAvailable =
                    phase ===
                      "private_purchase" &&
                    hasPrivateAccess;

                  /*
                   * =================================================
                   * PUBLIC PURCHASE
                   * =================================================
                   *
                   * Everyone can purchase during
                   * the public phase.
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
                   * RESERVATION WINDOW
                   * =================================================
                   *
                   * Customer has reserved but
                   * collection is not yet open.
                   */

                  const waitingForPrivateWindow =
                    phase ===
                      "private_access" &&
                    hasPrivateAccess;

                  /*
                   * =================================================
                   * STATUS TEXT
                   * =================================================
                   */

                  let statusLabel =
                    "Reservation Pending";

                  let description =
                    "Your reservation payment is still being processed.";

                  if (hasPrivateAccess) {
                    statusLabel =
                      "Private Access Confirmed";

                    description =
                      "Your ₹2,000 studio reservation has been confirmed. You have priority access to this piece.";
                  }

                  if (
                    privatePurchaseAvailable
                  ) {
                    statusLabel =
                      "Private Collection Access";

                    description =
                      "Your private purchasing window is now open. This piece is available exclusively to confirmed private-access clients.";
                  }

                  if (
                    waitingForPrivateWindow
                  ) {
                    statusLabel =
                      "Private Access Secured";

                    description =
                      "Your private access is confirmed. Your purchasing window will open during the private collection release.";
                  }

                  if (
                    publicPurchaseAvailable &&
                    hasPrivateAccess
                  ) {
                    statusLabel =
                      "Collection Now Open";

                    description =
                      "The collection is now publicly available. Your private access has already been secured.";
                  }

                  if (isPurchased) {
                    statusLabel =
                      "Purchased";

                    description =
                      "This AVENOR piece has been successfully purchased.";
                  }

                  if (editionExhausted) {
                    statusLabel =
                      "Edition Exhausted";

                    description =
                      "This limited edition has sold out and is no longer available for purchase.";
                  }

                  if (isRefunded) {
                    statusLabel =
                      "Reservation Refunded";

                    description =
                      "Your private reservation opportunity has ended and your reservation fee has been marked for refund.";
                  }

                  /*
                   * =================================================
                   * STATUS COLOR
                   * =================================================
                   */

                  let statusClass =
                    "text-[#AF9685]";

                  if (
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
                   * PRIVATE PURCHASE
                   *
                   * Confirmed private-access
                   * customer gets:
                   *
                   * CLAIM PRIVATE ALLOCATION
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
                   * PUBLIC
                   *
                   * Anyone can purchase.
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
                   * SOLD OUT
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
                   * PURCHASED
                   */

                  else if (isPurchased) {
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
                   * REFUNDED
                   */

                  else if (isRefunded) {
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
                   * PRIVATE ACCESS PHASE
                   *
                   * They have reserved,
                   * but the private purchasing
                   * window has not opened yet.
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
                   * PENDING PAYMENT
                   */

                  else if (isPending) {
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
                          href={`/product/${product.id}`}
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
                            sizes="(max-width: 768px) 100vw, 280px"
                            className="
                              object-contain
                              transition-transform
                              duration-500
                              hover:scale-[1.02]
                            "
                          />

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

                          {/* ================================================= */}
                          {/* PRIVATE PURCHASE NOTICE */}
                          {/* ================================================= */}

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

                          {/* ================================================= */}
                          {/* PRIVATE ACCESS WAITING */}
                          {/* ================================================= */}

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

                          {/* ================================================= */}
                          {/* PUBLIC RELEASE */}
                          {/* ================================================= */}

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

                          {/* ================================================= */}
                          {/* SOLD OUT */}
                          {/* ================================================= */}

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

                          {/* ================================================= */}
                          {/* PURCHASED */}
                          {/* ================================================= */}

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

                          {/* ================================================= */}
                          {/* REFUNDED */}
                          {/* ================================================= */}

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

                          {/* ================================================= */}
                          {/* RESERVATION DETAILS */}
                          {/* ================================================= */}

                          <div className="mt-8 space-y-4 border-t border-[#eeeeee] pt-6">

                            {/* RESERVATION FEE */}

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

                            {/* CUSTOMER STATUS */}

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

                            {/* COLLECTION PHASE */}

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

                          {/* ================================================= */}
                          {/* ACTION */}
                          {/* ================================================= */}

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
