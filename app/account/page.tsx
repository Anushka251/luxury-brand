"use client";

import {
  useSession,
  signIn,
  signOut,
} from "next-auth/react";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

export default function AccountPage() {
  const { data: session, status } =
    useSession();

  const [latestOrder, setLatestOrder] =
    useState<any>(null);

  const [orderCount, setOrderCount] =
    useState(0);

  const [addressCount, setAddressCount] =
    useState(0);

  const [reservationCount, setReservationCount] =
    useState(0);

  useEffect(() => {
    const loadAccount = async () => {
      if (!session?.user?.email) return;

      try {
        /*
         * =====================================================
         * ORDERS
         * =====================================================
         */

        const orderRes = await fetch(
          `/api/orders?email=${encodeURIComponent(
            session.user.email
          )}`,
          {
            cache: "no-store",
          }
        );

        const orderData =
          await orderRes.json();

        if (orderData.success) {
          setOrderCount(
            orderData.orders.length
          );

          if (
            orderData.orders.length > 0
          ) {
            setLatestOrder(
              orderData.orders[0]
            );
          } else {
            setLatestOrder(null);
          }
        }

        /*
         * =====================================================
         * ADDRESSES
         * =====================================================
         */

        const addressRes =
          await fetch(
            `/api/address?email=${encodeURIComponent(
              session.user.email
            )}`,
            {
              cache: "no-store",
            }
          );

        const addressData =
          await addressRes.json();

        if (addressData.success) {
          setAddressCount(
            addressData.addresses.length
          );
        }

        /*
         * =====================================================
         * RESERVATIONS
         * =====================================================
         */

        const reservationRes =
          await fetch(
            `/api/reservations?email=${encodeURIComponent(
              session.user.email
            )}`,
            {
              cache: "no-store",
            }
          );

        const reservationData =
          await reservationRes.json();

        if (reservationRes.ok) {
          /*
           * Count all reservations belonging
           * to this account.
           */
          setReservationCount(
            reservationData.reservations?.length ??
              0
          );
        }
      } catch (error) {
        console.error(
          "Account loading error:",
          error
        );
      }
    };

    loadAccount();
  }, [session]);

  /*
   * =====================================================
   * LOADING
   * =====================================================
   */

  if (status === "loading") {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">
        <div className="
          text-sm
          tracking-[0.4em]
          animate-pulse
        ">
          AVENOR
        </div>
      </div>
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
        flex
        items-center
        justify-center
        px-6
      ">
        <div className="
          text-center
          space-y-6
        ">

          <h1 className="
            text-2xl
            tracking-[0.3em]
          ">
            MY ACCOUNT
          </h1>

          <p className="
            text-sm
            text-gray-500
          ">
            Sign in to access your account.
          </p>

          <button
            onClick={() =>
              signIn("google", {
                callbackUrl:
                  "/account",
              })
            }
            className="
              bg-black
              text-white
              px-10
              py-4
              tracking-[0.25em]
              text-sm
            "
          >
            LOGIN
          </button>

        </div>
      </main>
    );
  }

  /*
   * =====================================================
   * GREETING
   * =====================================================
   */

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? "GOOD MORNING"
      : hour < 18
      ? "GOOD AFTERNOON"
      : "GOOD EVENING";

  /*
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <main className="
      max-w-5xl
      mx-auto
      px-8
      md:px-12
      py-24
    ">

      {/* ================================================= */}
      {/* GREETING */}
      {/* ================================================= */}

      <div className="mb-6">

        <p className="
          text-xs
          tracking-[0.35em]
          text-gray-400
        ">
          {greeting}
        </p>

      </div>


      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="mb-16">

        <p className="
          text-sm
          tracking-[0.35em]
          text-gray-400
          mb-4
        ">
          AVENOR CLIENT
        </p>

        <h1 className="
          text-5xl
          md:text-6xl
          font-light
          tracking-[0.12em]
        ">
          MY ACCOUNT
        </h1>

      </div>


      {/* ================================================= */}
      {/* USER */}
      {/* ================================================= */}

      <div className="mb-16">

        <h2 className="
          text-3xl
          font-light
          mb-2
        ">
          {session.user?.name}
        </h2>

        <p className="text-gray-500">
          {session.user?.email}
        </p>

      </div>


      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-6
        border-y
        py-10
        mb-16
      ">

        {/* ORDERS */}

        <Link
          href="/account/orders"
          className="
            group
            block
          "
        >

          <p className="
            text-xs
            tracking-[0.3em]
            text-gray-400
            mb-2
            group-hover:text-black
            transition
          ">
            ORDERS
          </p>

          <p className="
            text-3xl
            font-light
          ">
            {orderCount}
          </p>

        </Link>


        {/* RESERVATIONS */}

        <Link
          href="/account/reservations"
          className="
            group
            block
          "
        >

          <p className="
            text-xs
            tracking-[0.3em]
            text-gray-400
            mb-2
            group-hover:text-black
            transition
          ">
            RESERVATIONS
          </p>

          <p className="
            text-3xl
            font-light
          ">
            {reservationCount}
          </p>

        </Link>


        {/* ADDRESS */}

        <Link
          href="/account/address"
          className="
            group
            block
          "
        >

          <p className="
            text-xs
            tracking-[0.3em]
            text-gray-400
            mb-2
            group-hover:text-black
            transition
          ">
            ADDRESS
          </p>

          <p className="
            text-3xl
            font-light
          ">
            {addressCount}
          </p>

        </Link>


        {/* MEMBER */}

        <div>

          <p className="
            text-xs
            tracking-[0.3em]
            text-gray-400
            mb-2
          ">
            MEMBER
          </p>

          <p className="
            text-3xl
            font-light
          ">
            2026
          </p>

        </div>

      </div>


      {/* ================================================= */}
      {/* RESERVATION ACCESS */}
      {/* ================================================= */}

      {reservationCount > 0 && (
        <Link
          href="/account/reservations"
          className="
            group
            block
            border
            border-[#D9C9BC]
            bg-[#F7F5F2]
            p-8
            md:p-10
            mb-16
            transition
            hover:shadow-sm
          "
        >

          <div className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-6
          ">

            <div>

              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                text-[#AF9685]
              ">
                Private Access
              </p>

              <h2 className="
                mt-4
                text-3xl
                font-light
              ">
                Your studio reservations
              </h2>

              <p className="
                mt-3
                text-sm
                leading-7
                text-gray-500
              ">
                View your reserved AVENOR
                pieces and private studio
                access.
              </p>

            </div>

            <p className="
              shrink-0
              text-sm
              tracking-[0.2em]
              text-gray-400
              transition
              group-hover:text-black
            ">
              VIEW RESERVATIONS →
            </p>

          </div>

        </Link>
      )}


      {/* ================================================= */}
      {/* LATEST ORDER */}
      {/* ================================================= */}

      {latestOrder &&
        latestOrder.items?.[0] && (
          <Link
            href="/account/orders"
            className="
              block
              border
              mb-16
              overflow-hidden
              hover:shadow-sm
              transition
            "
          >

            <div className="
              grid
              md:grid-cols-[220px_1fr]
            ">

              <img
                src={
                  latestOrder.items[0]
                    .image
                }
                alt={
                  latestOrder.items[0]
                    .name
                }
                className="
                  w-full
                  h-[280px]
                  object-cover
                "
              />

              <div className="
                p-8
                flex
                flex-col
                justify-center
              ">

                <p className="
                  text-xs
                  tracking-[0.3em]
                  text-gray-400
                  mb-4
                ">
                  LATEST ORDER
                </p>

                <h3 className="
                  text-3xl
                  font-light
                  mb-3
                ">
                  {
                    latestOrder.items[0]
                      .name
                  }
                </h3>

                {latestOrder.items[0]
                  ?.size && (
                  <p className="
                    text-gray-500
                    mb-2
                  ">
                    Size:{" "}
                    {
                      latestOrder
                        .items[0]
                        .size
                    }
                  </p>
                )}

                <p className="
                  text-xl
                  mb-4
                ">
                  ₹
                  {latestOrder.total?.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="
                  text-sm
                  text-gray-400
                  tracking-wider
                ">
                  VIEW ORDER →
                </p>

              </div>

            </div>

          </Link>
        )}


      {/* ================================================= */}
      {/* NAVIGATION */}
      {/* ================================================= */}

      <div className="
        space-y-7
        text-sm
        tracking-[0.25em]
      ">

        {/* ORDERS */}

        <Link
          href="/account/orders"
          className="
            flex
            justify-between
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>
            ORDERS
          </span>

          <span>
            →
          </span>
        </Link>


        {/* RESERVATIONS */}

        <Link
          href="/account/reservations"
          className="
            flex
            justify-between
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>
            RESERVATIONS
          </span>

          <span>
            →
          </span>
        </Link>


        {/* ADDRESS */}

        <Link
          href="/account/address"
          className="
            flex
            justify-between
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>
            ADDRESS
          </span>

          <span>
            →
          </span>
        </Link>


        {/* CHANGE PASSWORD */}

        <Link
          href="/account/change-password"
          className="
            flex
            justify-between
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>
            CHANGE PASSWORD
          </span>

          <span>
            →
          </span>
        </Link>


        {/* LOGOUT */}

        <button
          onClick={() =>
            signOut({
              callbackUrl:
                "/home",
            })
          }
          className="
            flex
            justify-between
            w-full
            text-left
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>
            LOGOUT
          </span>

          <span>
            →
          </span>
        </button>

      </div>


      {/* ================================================= */}
      {/* SIGNATURE */}
      {/* ================================================= */}

      <div className="
        pt-16
        border-t
        mt-20
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
          Silent luxury. Made To Order.
        </p>

      </div>

    </main>
  );
}
