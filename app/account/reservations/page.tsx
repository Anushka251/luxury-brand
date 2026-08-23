"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

type Reservation = {
  _id: string;
  cashfreeOrderId: string;
  product: string;
  fullName?: string;
  email?: string;
  reservationFee: number;
  paymentStatus: string;
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

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          Loading...
        </div>
      </main>
    );
  }

  if (!session) {
    signIn(undefined, {
      callbackUrl:
        "/account/reservations",
    });

    return null;
  }

  useEffect(() => {
    async function loadReservations() {
      try {
        const response = await fetch(
          "/api/reservations",
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
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">

      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

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

        {/* LOADING */}

        {loading && (
          <div className="mt-20 text-center text-sm text-gray-400">
            Loading your reservations...
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          reservations.length === 0 && (
            <div className="mx-auto mt-20 max-w-xl border border-[#D9C9BC] bg-[#F7F5F2] p-10 text-center">

              <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                No Reservations
              </p>

              <p className="mt-5 text-sm leading-7 text-gray-500">
                You do not have any confirmed
                AVENOR studio reservations yet.
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

        {/* RESERVATIONS */}

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

                        {/* IMAGE */}

                        <Link
                          href={`/product/${reservation.product}`}
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
                            src={image}
                            alt={name}
                            fill
                            className="
                              object-contain
                              transition-transform
                              duration-500
                              hover:scale-[1.02]
                            "
                          />
                        </Link>

                        {/* DETAILS */}

                        <div className="p-8 md:p-12">

                          <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
                            Private Access
                            Confirmed
                          </p>

                          <h2
                            className="mt-5 text-4xl font-light text-[#111]"
                            style={{
                              fontFamily:
                                '"Cormorant Garamond", serif',
                            }}
                          >
                            {name}
                          </h2>

                          <p className="mt-5 text-sm leading-7 text-gray-500">
                            Your private studio
                            reservation for this
                            AVENOR piece has been
                            confirmed.
                          </p>

                          <div className="mt-8 space-y-4 border-t border-[#eeeeee] pt-6">

                            <div className="flex justify-between gap-6 text-sm">
                              <span className="text-gray-400">
                                Reservation Fee
                              </span>

                              <span className="text-gray-700">
                                ₹
                                {reservation.reservationFee.toLocaleString()}
                              </span>
                            </div>

                            <div className="flex justify-between gap-6 text-sm">
                              <span className="text-gray-400">
                                Status
                              </span>

                              <span className="text-[#8C9A78]">
                                CONFIRMED
                              </span>
                            </div>

                            <div className="text-xs leading-6 text-gray-400">
                              Reference:
                              <br />
                              <span className="break-all">
                                {
                                  reservation.cashfreeOrderId
                                }
                              </span>
                            </div>

                          </div>

                          <Link
                            href={`/product/${reservation.product}`}
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
                            View Piece
                          </Link>

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
