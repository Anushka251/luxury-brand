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

  const [addressCount, setAddressCount] =
    useState(0);

  useEffect(() => {
    const loadAccount = async () => {
      if (!session?.user?.email)
        return;

      try {
        // Latest order
        const orderRes = await fetch(
          "/api/latest-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              email:
                session.user.email,
            }),
          }
        );

        const orderData =
          await orderRes.json();

        if (orderData.success) {
          setLatestOrder(
            orderData.order
          );
        }

        // Addresses
        const addressRes =
          await fetch(
            `/api/address?email=${encodeURIComponent(
              session.user.email
            )}`
          );

        const addressData =
          await addressRes.json();

        if (addressData.success) {
          setAddressCount(
            addressData.addresses.length
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadAccount();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm tracking-[0.4em] animate-pulse">
          AVENOR
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6">
          <h1 className="text-2xl tracking-[0.3em]">
            MY ACCOUNT
          </h1>

          <p className="text-sm text-gray-500">
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

  const hour =
    new Date().getHours();

  const greeting =
    hour < 12
      ? "GOOD MORNING"
      : hour < 18
      ? "GOOD AFTERNOON"
      : "GOOD EVENING";

  return (
    <main className="max-w-5xl mx-auto px-8 md:px-12 py-24">
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-xs tracking-[0.35em] text-gray-400">
          {greeting}
        </p>
      </div>

      {/* Header */}
      <div className="mb-16">
        <p className="text-sm tracking-[0.35em] text-gray-400 mb-4">
          AVENOR CLIENT
        </p>

        <h1 className="text-5xl md:text-6xl font-light tracking-[0.12em]">
          MY ACCOUNT
        </h1>
      </div>

      {/* User */}
      <div className="mb-16">
        <h2 className="text-3xl font-light mb-2">
          {session.user?.name}
        </h2>

        <p className="text-gray-500">
          {session.user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 border-y py-10 mb-16">
        <div>
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-2">
            ORDERS
          </p>

          <p className="text-3xl font-light">
            {latestOrder ? 1 : 0}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-2">
            ADDRESS
          </p>

          <p className="text-3xl font-light">
            {addressCount}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-2">
            MEMBER
          </p>

          <p className="text-3xl font-light">
            2026
          </p>
        </div>
      </div>

      {/* Latest Order */}
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
            <div className="grid md:grid-cols-[220px_1fr]">
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

              <div className="p-8 flex flex-col justify-center">
                <p className="text-xs tracking-[0.3em] text-gray-400 mb-4">
                  LATEST ORDER
                </p>

                <h3 className="text-3xl font-light mb-3">
                  {
                    latestOrder.items[0]
                      .name
                  }
                </h3>

                {latestOrder.items[0]
                  ?.size && (
                  <p className="text-gray-500 mb-2">
                    Size:{" "}
                    {
                      latestOrder
                        .items[0]
                        .size
                    }
                  </p>
                )}

                <p className="text-xl mb-4">
                  ₹
                  {latestOrder.total?.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-sm text-gray-400 tracking-wider">
                  VIEW ORDER →
                </p>
              </div>
            </div>
          </Link>
        )}

      {/* Navigation */}
      <div className="space-y-7 text-sm tracking-[0.25em]">
        <Link
          href="/account/orders"
          className="
            flex justify-between
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>ORDERS</span>
          <span>→</span>
        </Link>

        <Link
          href="/account/address"
          className="
            flex justify-between
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>ADDRESS</span>
          <span>→</span>
        </Link>

        <Link
          href="/account/change-password"
          className="
            flex justify-between
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          <span>CHANGE PASSWORD</span>
          <span>→</span>
        </Link>

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
          <span>LOGOUT</span>
          <span>→</span>
        </button>
      </div>

      {/* Signature */}
      <div className="pt-16 border-t mt-20 text-center">
        <p className="text-xs tracking-[0.35em] text-gray-400">
          AVENOR
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Quiet Luxury. Limited Pieces.
        </p>
      </div>
    </main>
  );
}
