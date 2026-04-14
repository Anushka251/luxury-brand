"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AccountPage() {
  const { data: session } = useSession();

  // NOT LOGGED IN
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-2xl tracking-widest">MY ACCOUNT</h1>
          <p className="text-sm text-gray-500">
            Sign in to access your account
          </p>

          <button
            onClick={() =>
              signIn("google", { callbackUrl: "/account" })
            }
            className="bg-black text-white px-10 py-3 tracking-widest"
          >
            LOGIN
          </button>
        </div>
      </main>
    );
  }

  // LOGGED IN
  return (
    <main className="px-12 py-32 max-w-4xl mx-auto">
      <h1 className="text-3xl font-light tracking-widest mb-16">
        MY ACCOUNT
      </h1>

      {/* USER INFO */}
      <div className="mb-16 space-y-2">
        <p className="text-lg">{session.user?.name}</p>
        <p className="text-sm text-gray-500">
          {session.user?.email}
        </p>
      </div>

      {/* MENU */}
      <div className="space-y-6 text-sm tracking-widest">
        <Link
          href="/account/orders"
          className="block hover:opacity-70 transition"
        >
          ORDERS
        </Link>

        <Link
          href="/account/address"
          className="block hover:opacity-70 transition"
        >
          ADDRESS
        </Link>

        <Link
          href="/account/change-password"
          className="block hover:opacity-70 transition"
        >
          CHANGE PASSWORD
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/home" })}
          className="block hover:opacity-70 transition text-left"
        >
          LOGOUT
        </button>
      </div>
    </main>
  );
}