"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  useSession,
  signIn,
} from "next-auth/react";

import { products } from "@/lib/products";

type Reservation = {
  _id: string;
  cashfreeOrderId: string;
  product: string;
  fullName?: string;
  email?: string;
  reservationFee: number;
  paymentStatus:
    | "pending"
    | "success"
    | "failed"
    | string;
  status?: string;
  createdAt?: string;
};

export default function ReservationsPage() {
  const {
    data: session,
    status,
  } = useSession();

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * =====================================================
   * LOAD RESERVATIONS
   * =====================================================
   */

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.email
    ) {
      return;
    }

    async function loadReservations() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/reservations?email=${encodeURIComponent(
              session.user.email!
            )}`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Unable to load reservations."
          );
        }

        setReservations(
          data?.reservations ?? []
        );
      } catch (error) {
        console.error(
          "Reservation loading error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load reservations."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, [
    status,
    session?.user?.email,
  ]);

  /*
   * =====================================================
   * SESSION LOADING
   * =====================================================
   */

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">

        <div className="
          mx-auto
          max-w-4xl
          text-center
        ">

          <p className="
            text-xs
            tracking-[0.4em]
            text-gray-400
            animate-pulse
          ">
            AVENOR
          </p>

        </div>

      </main>
    );
  }

  /*
   * =====================================================
   * NOT LOGGED IN
   * =====================================================
   */

  if (!session) {
    return (
      <main className="
        min-h-screen
        bg-[#FAF8F5]
        flex
        items-center
        justify-center
        px-6
      ">

        <div className="
          text-center
          max-w-md
        ">

          <p className="
            text-xs
            tracking-[0.35em]
            text-gray-400
          ">
            AVENOR
          </p>

          <h1 className="
            mt-5
            text-3xl
            font-light
            tracking-[0.15em]
          ">
            RESERVATIONS
          </h1>

          <p className="
            mt-5
            text-sm
            leading-7
            text-gray-500
          ">
            Sign in to access your
            private studio reservations.
          </p>

          <button
            onClick={() =>
              signIn(undefined, {
                callbackUrl:
                  "/account/reservations",
              })
            }
            className="
              mt-8
              bg-black
              text-white
              px-10
              py-4
              text-sm
              tracking-[0.25em]
            "
          >
            LOGIN
          </button>

        </div>

      </main>
    );
  }

  return (
    <main className="
      min-h-screen
      bg-[#FAF8F5]
      px-6
      py-20
    ">

      <div className="
        mx-auto
        max-w-5xl
      ">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-16">

          <Link
            href="/account"
            className="
              text-xs
              tracking-[0.3em]
              text-gray-400
              hover:text-black
              transition
            "
          >
            ← MY ACCOUNT
          </Link>

          <div className="
            mt-12
            text-center
          ">

            <p className="
              text-xs
              uppercase
              tracking-[0.35em]
              text-gray-400
            ">
              AVENOR CLIENT
            </p>

            <h1
              className="
                mt-5
                text-5xl
                md:text-6xl
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

            <p className="
              mx-auto
              mt-6
              max-w-xl
              text-sm
              leading-8
              text-gray-500
            ">
              Your private studio access
              and reservation history.
            </p>

          </div>

        </div>


        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (
          <div className="
            border-y
            py-20
            text-center
          ">

            <p className="
              text-xs
              tracking-[0.35em]
              text-gray-400
              animate-pulse
            ">
              LOADING RESERVATIONS
            </p>

          </div>
        )}


        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {!loading &&
          error && (
            <div className="
              mx-auto
              max-w-xl
              border
              border-[#D9C9BC]
              bg-[#F7F5F2]
              p-10
              text-center
            ">

              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                text-[#AF9685]
              ">
                Unable To Load
              </p>

              <p className="
                mt-5
                text-sm
                leading-7
                text-gray-500
              ">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="
                  mt-8
                  border
                  border-[#AF9685]
                  px-8
                  py-4
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  text-[#AF9685]
                  hover:bg-[#AF9685]
                  hover:text-white
                  transition
                "
              >
                Try Again
              </button>

            </div>
          )}


        {/* ================================================= */}
        {/* EMPTY */}
        {/* ================================================= */}

        {!loading &&
          !error &&
          reservations.length === 0 && (
            <div className="
              mx-auto
              max-w-xl
              border
              border-[#D9C9BC]
              bg-[#F7F5F2]
              p-10
              text-center
            ">

              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                text-[#AF9685]
              ">
                No Reservations
              </p>

              <h2 className="
                mt-5
                text-3xl
                font-light
              ">
                No studio reservations yet.
              </h2>

              <p className="
                mt-5
                text-sm
                leading-7
                text-gray-500
              ">
                Your private AVENOR studio
                access will appear here after
                you complete a reservation.
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
          !error &&
          reservations.length > 0 && (
            <div className="
              space-y-10
            ">

              {reservations.map(
                (reservation) => {

                  /*
                   * Find the exact product
                   * from lib/products.ts.
                   */

                  const product =
                    products.find(
                      (item) =>
                        item.id ===
                        reservation.product
                    );

                  /*
                   * Safety fallback if an old
                   * reservation contains a
                   * product that no longer
                   * exists.
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

                        <p className="
                          text-xs
                          uppercase
                          tracking-[0.3em]
                          text-[#AF9685]
                        ">
                          Reservation
                        </p>

                        <p className="
                          mt-4
                          text-sm
                          text-gray-500
                        ">
                          Reserved piece:
                          {" "}
                          {reservation.product}
                        </p>

                      </div>
                    );
                  }

                  const isSuccess =
                    reservation.paymentStatus ===
                    "success";

                  const isPending =
                    reservation.paymentStatus ===
                    "pending";

                  const isFailed =
                    reservation.paymentStatus ===
                    "failed";

                  /*
                   * Entire card is a link.
                   */

                  return (
                    <Link
                      key={
                        reservation._id
                      }
                      href={`/product/${product.id}`}
                      className="
                        group
                        block
                        overflow-hidden
                        border
                        border-[#D9C9BC]
                        bg-white
                        transition-shadow
                        duration-300
                        hover:shadow-md
                      "
                    >

                      <div className="
                        grid
                        grid-cols-1
                        md:grid-cols-[300px_1fr]
                      ">

                        {/* ================================================= */}
                        {/* PRODUCT IMAGE */}
                        {/* ================================================= */}

                        <div className="
                          relative
                          aspect-[3/4]
                          md:aspect-auto
                          md:min-h-[420px]
                          overflow-hidden
                          bg-[#F7F5F2]
                        ">

                          <Image
                            src={
                              product.coverImage
                            }
                            alt={
                              product.name
                            }
                            fill
                            sizes="
                              (max-width: 768px) 100vw,
                              300px
                            "
                            className="
                              object-contain
                              transition-transform
                              duration-700
                              group-hover:scale-[1.02]
                            "
                          />

                        </div>


                        {/* ================================================= */}
                        {/* DETAILS */}
                        {/* ================================================= */}

                        <div className="
                          flex
                          flex-col
                          justify-center
                          p-8
                          md:p-12
                        ">

                          {/* STATUS */}

                          <p className="
                            text-xs
                            uppercase
                            tracking-[0.3em]
                            text-[#AF9685]
                          ">
                            {isSuccess
                              ? "Private Access Confirmed"
                              : isPending
                              ? "Payment Processing"
                              : isFailed
                              ? "Payment Unsuccessful"
                              : "Studio Reservation"}
                          </p>


                          {/* PRODUCT NAME */}

                          <h2
                            className="
                              mt-5
                              text-4xl
                              md:text-5xl
                              font-light
                              text-[#111111]
                            "
                            style={{
                              fontFamily:
                                '"Cormorant Garamond", serif',
                            }}
                          >
                            {product.name}
                          </h2>


                          {/* TYPE */}

                          <p className="
                            mt-3
                            text-xs
                            uppercase
                            tracking-[0.2em]
                            text-gray-400
                          ">
                            {product.type}
                          </p>


                          {/* DESCRIPTION */}

                          <p className="
                            mt-6
                            text-sm
                            leading-7
                            text-gray-500
                            max-w-xl
                          ">
                            {product.description}
                          </p>


                          {/* PAYMENT DETAILS */}

                          <div className="
                            mt-8
                            space-y-4
                            border-t
                            border-[#eeeeee]
                            pt-6
                          ">

                            <div className="
                              flex
                              justify-between
                              gap-6
                              text-sm
                            ">

                              <span className="
                                text-gray-400
                              ">
                                Reservation Fee
                              </span>

                              <span className="
                                text-gray-700
                              ">
                                ₹
                                {Number(
                                  reservation.reservationFee
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                            </div>


                            <div className="
                              flex
                              justify-between
                              gap-6
                              text-sm
                            ">

                              <span className="
                                text-gray-400
                              ">
                                Status
                              </span>

                              {isSuccess && (
                                <span className="
                                  text-[#8C9A78]
                                  tracking-[0.12em]
                                ">
                                  CONFIRMED
                                </span>
                              )}

                              {isPending && (
                                <span className="
                                  text-[#AF9685]
                                  tracking-[0.12em]
                                ">
                                  PROCESSING
                                </span>
                              )}

                              {isFailed && (
                                <span className="
                                  text-gray-500
                                  tracking-[0.12em]
                                ">
                                  UNSUCCESSFUL
                                </span>
                              )}

                            </div>

                          </div>


                          {/* REFERENCE */}

                          <div className="
                            mt-6
                            text-xs
                            leading-6
                            text-gray-400
                          ">

                            Reservation Reference:

                            <br />

                            <span className="
                              break-all
                            ">
                              {
                                reservation.cashfreeOrderId
                              }
                            </span>

                          </div>


                          {/* LINK INDICATOR */}

                          <p className="
                            mt-8
                            text-xs
                            tracking-[0.3em]
                            text-gray-400
                            transition-colors
                            duration-300
                            group-hover:text-black
                          ">
                            VIEW PIECE →
                          </p>

                        </div>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>
          )}


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="
          mt-20
          border-t
          pt-12
          text-center
        ">

          <p className="
            text-xs
            tracking-[0.35em]
            text-gray-400
          ">
            AVENOR
          </p>

          <p className="
            mt-4
            text-sm
            text-gray-500
          ">
            Quiet luxury. Limited pieces.
            Thoughtfully crafted.
          </p>

        </div>

      </div>

    </main>
  );
}
