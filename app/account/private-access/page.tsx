"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
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
    | "confirmed"
    | "purchased"
    | "refunded"
    | "closed";
  status:
    | "pending"
    | "confirmed"
    | "purchased"
    | "refunded";
};

type CollectionPhase =
  | "private_access"
  | "private_purchase"
  | "public"
  | "sold_out";

export default function PrivateAccessPage() {
  const {
    data: session,
    status: sessionStatus,
  } = useSession();

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * =========================================================
   * USER EMAIL
   * =========================================================
   */

  const userEmail =
    session?.user?.email ?? "";

  /*
   * =========================================================
   * LOAD USER RESERVATIONS
   * =========================================================
   */

  useEffect(() => {
    if (sessionStatus === "loading") {
      return;
    }

    if (!userEmail) {
      setReservations([]);
      setLoading(false);
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

        setReservations(
          data.reservations ?? []
        );
      } catch (error) {
        console.error(
          "Private access loading error:",
          error
        );

        setReservations([]);
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, [userEmail, sessionStatus]);

  /*
   * =========================================================
   * RESERVATION LOOKUP
   * =========================================================
   */

  const reservationMap = useMemo(() => {
    const map = new Map<
      string,
      Reservation
    >();

    for (const reservation of reservations) {
      /*
       * If a customer has multiple records for
       * the same piece, prefer the most useful
       * active state.
       */

      const existing =
        map.get(reservation.product);

      if (!existing) {
        map.set(
          reservation.product,
          reservation
        );
        continue;
      }

      const priority = (
        item: Reservation
      ) => {
        if (
          item.status === "purchased"
        ) {
          return 5;
        }

        if (
          item.status === "confirmed" &&
          item.paymentStatus ===
            "confirmed"
        ) {
          return 4;
        }

        if (
          item.status === "pending"
        ) {
          return 3;
        }

        if (
          item.status === "refunded"
        ) {
          return 1;
        }

        return 0;
      };

      if (
        priority(reservation) >
        priority(existing)
      ) {
        map.set(
          reservation.product,
          reservation
        );
      }
    }

    return map;
  }, [reservations]);

  /*
   * =========================================================
   * AUTHENTICATION
   * =========================================================
   */

  if (sessionStatus === "loading") {
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">
        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            AVENOR
          </p>

          <div
            className="
              mx-auto
              mt-16
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
            Opening your private studio...
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
    return (
      <main className="min-h-screen bg-[#FAF8F5] px-6 py-20">
        <div className="mx-auto max-w-xl text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            AVENOR
          </p>

          <h1
            className="
              mt-6
              text-5xl
              font-light
              text-[#AF9685]
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Private Studio
          </h1>

          <p className="mt-6 text-sm leading-8 text-gray-500">
            Sign in to view pieces available
            for private reservation and
            your secured access.
          </p>

          <Link
            href="/api/auth/signin?callbackUrl=/account/private-access"
            className="
              mt-10
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
            Sign In
          </Link>

        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * COLLECTION DATA
   * =========================================================
   */

  const privateAccessPieces =
    products.filter(
      (product) =>
        product.collectionPhase ===
        "private_access"
    );

  const privatePurchasePieces =
    products.filter(
      (product) =>
        product.collectionPhase ===
        "private_purchase"
    );

  const publicPieces =
    products.filter(
      (product) =>
        product.collectionPhase ===
        "public"
    );

  /*
   * =========================================================
   * CUSTOMER STATES
   * =========================================================
   */

  const confirmedReservations =
    reservations.filter(
      (reservation) =>
        reservation.status ===
          "confirmed" &&
        reservation.paymentStatus ===
          "confirmed"
    );

  const pendingReservations =
    reservations.filter(
      (reservation) =>
        reservation.status ===
        "pending"
    );

  /*
   * =========================================================
   * ALREADY RESERVED
   * =========================================================
   */

  const reservedProducts =
    confirmedReservations
      .map((reservation) =>
        products.find(
          (product) =>
            product.id ===
            reservation.product
        )
      )
      .filter(
        (
          product
        ): product is (typeof products)[number] =>
          Boolean(product)
      );

  /*
   * =========================================================
   * STILL AVAILABLE TO RESERVE
   * =========================================================
   */

  const availableToReserve =
    privateAccessPieces.filter(
      (product) =>
        !reservationMap.has(
          product.id
        )
    );

  /*
   * =========================================================
   * HELPER
   * =========================================================
   */

  function getReservation(
    productId: string
  ) {
    return reservationMap.get(
      productId
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[#FAF8F5]">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section className="px-6 pb-20 pt-20">

        <div className="mx-auto max-w-5xl text-center">

          <p className="text-xs uppercase tracking-[0.45em] text-gray-400">
            AVENOR PRIVATE STUDIO
          </p>

          <h1
            className="
              mt-7
              text-6xl
              font-light
              leading-none
              text-[#AF9685]
              md:text-7xl
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Your Private Collection
          </h1>

          <p className="
            mx-auto
            mt-8
            max-w-2xl
            text-sm
            leading-8
            text-gray-500
          ">
            A private view of the pieces
            currently moving through the
            AVENOR studio.
            Reserve the pieces that speak
            to you before their private
            window closes.
          </p>

          <div className="
            mx-auto
            mt-10
            h-px
            max-w-xs
            bg-[#D9C9BC]
          " />

          <p className="
            mt-8
            text-[11px]
            uppercase
            tracking-[0.3em]
            text-[#AF9685]
          ">
            Limited pieces · Private access ·
            Priority allocation
          </p>

        </div>

      </section>


      {/* ===================================================== */}
      {/* PERSONAL SUMMARY */}
      {/* ===================================================== */}

      {!loading && (
        <section className="px-6 pb-24">

          <div className="
            mx-auto
            grid
            max-w-5xl
            grid-cols-1
            gap-px
            border
            border-[#D9C9BC]
            bg-[#D9C9BC]
            md:grid-cols-3
          ">

            {/* RESERVED */}

            <div className="
              bg-[#FAF8F5]
              px-8
              py-10
              text-center
            ">

              <p className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-gray-400
              ">
                Secured For You
              </p>

              <p className="
                mt-4
                text-4xl
                font-light
                text-[#AF9685]
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
              >
                {confirmedReservations.length}
              </p>

              <p className="
                mt-2
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-500
              ">
                Reserved Pieces
              </p>

            </div>


            {/* AVAILABLE */}

            <div className="
              bg-[#FAF8F5]
              px-8
              py-10
              text-center
            ">

              <p className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-gray-400
              ">
                Still Open
              </p>

              <p className="
                mt-4
                text-4xl
                font-light
                text-[#AF9685]
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
              >
                {availableToReserve.length}
              </p>

              <p className="
                mt-2
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-500
              ">
                Pieces To Reserve
              </p>

            </div>


            {/* PRIVATE PURCHASE */}

            <div className="
              bg-[#FAF8F5]
              px-8
              py-10
              text-center
            ">

              <p className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-gray-400
              ">
                Private Window
              </p>

              <p className="
                mt-4
                text-4xl
                font-light
                text-[#8C9A78]
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
              >
                {privatePurchasePieces.length}
              </p>

              <p className="
                mt-2
                text-xs
                uppercase
                tracking-[0.2em]
                text-gray-500
              ">
                Pieces In Private Purchase
              </p>

            </div>

          </div>

        </section>
      )}


      {/* ===================================================== */}
      {/* PRIVATE ACCESS */}
      {/* ===================================================== */}

      {availableToReserve.length > 0 && (
        <section className="px-6 pb-28">

          <div className="mx-auto max-w-5xl">

            <div className="mb-12 text-center">

              <p className="
                text-xs
                uppercase
                tracking-[0.4em]
                text-[#AF9685]
              ">
                Studio Reservations
              </p>

              <h2
                className="
                  mt-5
                  text-5xl
                  font-light
                  text-[#111]
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Pieces Still Available
              </h2>

              <p className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-8
                text-gray-500
              ">
                These pieces are currently
                accepting private reservations.
                Once a private window closes,
                access may move to the next
                stage of the collection.
              </p>

            </div>


            <div className="
              grid
              grid-cols-1
              gap-12
              md:grid-cols-2
            ">

              {availableToReserve.map(
                (product) => (
                  <article
                    key={product.id}
                    className="
                      group
                      overflow-hidden
                      border
                      border-[#D9C9BC]
                      bg-white
                    "
                  >

                    {/* IMAGE */}

                    <Link
                      href={`/reserve/${product.id}`}
                      className="
                        relative
                        block
                        aspect-[4/5]
                        overflow-hidden
                        bg-[#F7F5F2]
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
                          (max-width: 768px) 100vw,
                          50vw
                        "
                        className="
                          object-contain
                          transition-transform
                          duration-1000
                          group-hover:scale-[1.025]
                        "
                      />

                    </Link>


                    {/* INFO */}

                    <div className="
                      px-7
                      py-9
                      text-center
                    ">

                      <p className="
                        text-[10px]
                        uppercase
                        tracking-[0.3em]
                        text-gray-400
                      ">
                        {product.type}
                      </p>

                      <h3
                        className="
                          mt-4
                          text-4xl
                          font-light
                          text-[#AF9685]
                        "
                        style={{
                          fontFamily:
                            '"Cormorant Garamond", serif',
                        }}
                      >
                        {product.name}
                      </h3>

                      <p className="
                        mx-auto
                        mt-5
                        max-w-md
                        text-sm
                        leading-7
                        text-gray-500
                      ">
                        {product.description}
                      </p>

                      <p className="
                        mt-5
                        text-sm
                        tracking-[0.1em]
                        text-gray-600
                      ">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="
                        mt-7
                        text-[10px]
                        uppercase
                        tracking-[0.3em]
                        text-[#AF9685]
                      ">
                        Private reservations open
                      </p>

                      <Link
                        href={`/reserve/${product.id}`}
                        className="
                          mt-6
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
                          duration-500
                          hover:bg-[#AF9685]
                          hover:text-white
                        "
                      >
                        Reserve This Piece
                      </Link>

                    </div>

                  </article>
                )
              )}

            </div>

          </div>

        </section>
      )}


      {/* ===================================================== */}
      {/* ALREADY RESERVED */}
      {/* ===================================================== */}

      {reservedProducts.length > 0 && (
        <section className="
          border-y
          border-[#D9C9BC]
          bg-[#F7F5F2]
          px-6
          py-28
        ">

          <div className="mx-auto max-w-5xl">

            <div className="text-center">

              <p className="
                text-xs
                uppercase
                tracking-[0.4em]
                text-[#AF9685]
              ">
                Your Private Access
              </p>

              <h2
                className="
                  mt-5
                  text-5xl
                  font-light
                  text-[#111]
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Reserved For You
              </h2>

              <p className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-8
                text-gray-500
              ">
                These pieces are already secured
                within your private studio access.
              </p>

            </div>


            <div className="
              mt-14
              grid
              grid-cols-1
              gap-10
              md:grid-cols-2
            ">

              {reservedProducts.map(
                (product) => (
                  <article
                    key={product.id}
                    className="
                      overflow-hidden
                      border
                      border-[#D9C9BC]
                      bg-[#FAF8F5]
                    "
                  >

                    <Link
                      href={`/reserve/${product.id}`}
                      className="
                        relative
                        block
                        aspect-[4/5]
                        overflow-hidden
                        bg-[#F7F5F2]
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
                          (max-width: 768px) 100vw,
                          50vw
                        "
                        className="
                          object-contain
                        "
                      />

                    </Link>


                    <div className="
                      px-7
                      py-9
                      text-center
                    ">

                      <p className="
                        text-[10px]
                        uppercase
                        tracking-[0.35em]
                        text-[#8C9A78]
                      ">
                        Private Access Reserved
                      </p>

                      <h3
                        className="
                          mt-4
                          text-4xl
                          font-light
                          text-[#AF9685]
                        "
                        style={{
                          fontFamily:
                            '"Cormorant Garamond", serif',
                        }}
                      >
                        {product.name}
                      </h3>

                      <p className="
                        mt-5
                        text-sm
                        leading-7
                        text-gray-500
                      ">
                        Your ₹2,000 reservation
                        has been confirmed.
                        Private access is secured
                        for this piece.
                      </p>

                      <Link
                        href={`/reserve/${product.id}`}
                        className="
                          mt-7
                          inline-block
                          border
                          border-[#D9C9BC]
                          px-9
                          py-4
                          text-xs
                          uppercase
                          tracking-[0.3em]
                          text-[#AF9685]
                          transition-all
                          duration-500
                          hover:bg-[#AF9685]
                          hover:text-white
                        "
                      >
                        View Private Access
                      </Link>

                    </div>

                  </article>
                )
              )}

            </div>

          </div>

        </section>
      )}


      {/* ===================================================== */}
      {/* PRIVATE PURCHASE */}
      {/* ===================================================== */}

      {privatePurchasePieces.length > 0 && (
        <section className="px-6 py-28">

          <div className="mx-auto max-w-5xl">

            <div className="text-center">

              <p className="
                text-xs
                uppercase
                tracking-[0.4em]
                text-[#8C9A78]
              ">
                Private Purchasing Window
              </p>

              <h2
                className="
                  mt-5
                  text-5xl
                  font-light
                  text-[#111]
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Now Available
              </h2>

              <p className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-8
                text-gray-500
              ">
                These pieces have entered their
                private purchasing window.
                Confirmed private-access clients
                receive priority before public
                release.
              </p>

            </div>


            <div className="
              mt-14
              grid
              grid-cols-1
              gap-12
              md:grid-cols-2
            ">

              {privatePurchasePieces.map(
                (product) => {

                  const reservation =
                    getReservation(
                      product.id
                    );

                  const confirmed =
                    reservation?.status ===
                      "confirmed" &&
                    reservation?.paymentStatus ===
                      "confirmed";

                  return (
                    <article
                      key={product.id}
                      className="
                        overflow-hidden
                        border
                        border-[#D9C9BC]
                        bg-white
                      "
                    >

                      <Link
                        href={`/product/${product.id}`}
                        className="
                          relative
                          block
                          aspect-[4/5]
                          overflow-hidden
                          bg-[#F7F5F2]
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
                            (max-width: 768px) 100vw,
                            50vw
                          "
                          className="
                            object-contain
                          "
                        />

                      </Link>


                      <div className="
                        px-7
                        py-9
                        text-center
                      ">

                        <p className="
                          text-[10px]
                          uppercase
                          tracking-[0.35em]
                          text-[#8C9A78]
                        ">
                          {confirmed
                            ? "Reserved Client Access"
                            : "Private Collection"}
                        </p>

                        <h3
                          className="
                            mt-4
                            text-4xl
                            font-light
                            text-[#AF9685]
                          "
                          style={{
                            fontFamily:
                              '"Cormorant Garamond", serif',
                          }}
                        >
                          {product.name}
                        </h3>

                        <p className="
                          mt-5
                          text-sm
                          leading-7
                          text-gray-500
                        ">
                          {confirmed
                            ? "Your private access is secured. You may now view the piece and continue to the private purchasing experience."
                            : "This piece is currently within its private purchasing window."}
                        </p>

                        <Link
                          href={`/product/${product.id}`}
                          className="
                            mt-7
                            inline-block
                            border
                            border-[#AF9685]
                            px-9
                            py-4
                            text-xs
                            uppercase
                            tracking-[0.3em]
                            text-[#AF9685]
                            transition-all
                            duration-500
                            hover:bg-[#AF9685]
                            hover:text-white
                          "
                        >
                          {confirmed
                            ? "View Private Allocation"
                            : "View Piece"}
                        </Link>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          </div>

        </section>
      )}


      {/* ===================================================== */}
      {/* PUBLIC COLLECTION */}
      {/* ===================================================== */}

      {publicPieces.length > 0 && (
        <section className="
          border-t
          border-[#D9C9BC]
          px-6
          py-24
        ">

          <div className="
            mx-auto
            max-w-5xl
            text-center
          ">

            <p className="
              text-xs
              uppercase
              tracking-[0.4em]
              text-gray-400
            ">
              Public Collection
            </p>

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
              Now Open
            </h2>

            <p className="
              mx-auto
              mt-5
              max-w-xl
              text-sm
              leading-8
              text-gray-500
            ">
              These pieces have entered the
              public collection and are available
              while pieces remain.
            </p>

            <Link
              href="/shop"
              className="
                mt-8
                inline-block
                text-xs
                uppercase
                tracking-[0.3em]
                text-[#AF9685]
                transition-opacity
                hover:opacity-60
              "
            >
              Explore The Collection →
            </Link>

          </div>

        </section>
      )}


      {/* ===================================================== */}
      {/* FOOTER MESSAGE */}
      {/* ===================================================== */}

      <section className="
        px-6
        pb-24
        pt-10
      ">

        <div className="
          mx-auto
          max-w-2xl
          text-center
        ">

          <div className="
            mx-auto
            h-px
            w-20
            bg-[#D9C9BC]
          " />

          <p
            className="
              mt-10
              text-3xl
              font-light
              leading-relaxed
              text-[#AF9685]
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Some pieces are meant to
            be discovered privately.
          </p>

          <p className="
            mt-5
            text-xs
            leading-7
            tracking-[0.15em]
            text-gray-400
          ">
            AVENOR
            <br />
            Quiet luxury. Limited pieces.
            Thoughtfully crafted.
          </p>

        </div>

      </section>

    </main>
  );
}
