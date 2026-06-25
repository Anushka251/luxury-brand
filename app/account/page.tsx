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

  useEffect(() => {
    const fetchLatestOrder =
      async () => {
        if (
          !session?.user?.email
        )
          return;

        try {
          const res = await fetch(
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

          const data =
            await res.json();

          if (data.success) {
            setLatestOrder(
              data.order
            );
          }
        } catch (error) {
          console.error(
            error
          );
        }
      };

    fetchLatestOrder();
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
      <div className="mb-20">
        <p className="text-sm tracking-[0.4em] text-gray-400 mb-4">
          AVENOR CLIENT
        </p>

        <h1 className="text-5xl md:text-6xl font-light tracking-[0.12em]">
          MY ACCOUNT
        </h1>
      </div>

      {/* User */}
      <div className="mb-20">
        <h2 className="text-3xl font-light mb-3">
          {session.user?.name}
        </h2>

        <p className="text-gray-500 text-lg">
          {session.user?.email}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 border-y py-10 mb-20">

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
            1
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
      {latestOrder && (
        <Link
          href="/account/orders"
          className="
            block
            border
            p-8
            mb-20
            hover:shadow-sm
            transition
          "
        >
          <p className="text-xs tracking-[0.3em] text-gray-400 mb-6">
            LATEST ORDER
          </p>

          <div className="flex gap-6 items-center">

            {latestOrder.items?.[0]
              ?.image && (
              <img
                src={
                  latestOrder
                    .items[0]
                    .image
                }
                alt={
                  latestOrder
                    .items[0]
                    .name
                }
                className="
                  w-28
                  h-36
                  object-cover
                "
              />
            )}

            <div>
              <h3 className="text-2xl font-light">
                {
                  latestOrder
                    .items[0]
                    ?.name
                }
              </h3>

              {latestOrder
                .items[0]
                ?.size && (
                <p className="text-gray-500 mt-2">
                  Size:{" "}
                  {
                    latestOrder
                      .items[0]
                      .size
                  }
                </p>
              )}

              <p className="text-gray-500 mt-2">
                ₹
                {latestOrder.total?.toLocaleString(
                  "en-IN"
                )}
              </p>

              <p className="text-sm text-gray-400 mt-4">
                View latest purchase
              </p>
            </div>

          </div>
        </Link>
      )}

      {/* Navigation */}
      <div className="space-y-8 text-sm tracking-[0.25em] mb-20">

        <Link
          href="/account/orders"
          className="
            block
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          ORDERS
        </Link>

        <Link
          href="/account/address"
          className="
            block
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          ADDRESS
        </Link>

        <Link
          href="/account/change-password"
          className="
            block
            border-b
            pb-4
            hover:opacity-60
            transition
          "
        >
          CHANGE PASSWORD
        </Link>

        <button
          onClick={() =>
            signOut({
              callbackUrl:
                "/home",
            })
          }
          className="
            block
            border-b
            pb-4
            text-left
            hover:opacity-60
            transition
          "
        >
          LOGOUT
        </button>

      </div>

      {/* Footer Message */}
      <div className="pt-12 text-center">
        <p className="text-gray-400 tracking-[0.35em] text-sm mb-5">
          PRIVATE CLIENT
        </p>

        <p className="text-gray-500 leading-8 max-w-md mx-auto">
          Access future collections,
          limited releases, and
          private client experiences.
        </p>
      </div>

    </main>
  );
}
