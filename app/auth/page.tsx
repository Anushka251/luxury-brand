"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loading state

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // ✅ no default page
    });

    if (res?.error) {
      setError(
        "Your details don’t seem to match. Try again or create an account."
      );
      setLoading(false);
      return;
    }

    // ✅ smooth redirect
    window.location.href = "/account";
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    await signIn("google", {
      callbackUrl: "/account", // ✅ direct redirect (no flash)
      redirect: true,
    });
  };

  return (
    <main className="px-12 py-32 max-w-md mx-auto space-y-8">

      <h1 className="text-2xl tracking-widest text-center">
        AVENOR
      </h1>

      {/* GOOGLE LOGIN */}
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full border py-3 tracking-widest hover:bg-black hover:text-white transition disabled:opacity-50"
      >
        {loading ? "PLEASE WAIT..." : "CONTINUE WITH GOOGLE"}
      </button>

      <div className="text-center text-xs text-gray-400">
        OR
      </div>

      {/* EMAIL LOGIN */}
      <div className="space-y-4">

        <input
          className="w-full border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          className="w-full border p-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-xs text-red-500 text-center">
            {error}{" "}
            <Link href="/signup" className="underline">
              Create one
            </Link>
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-3 tracking-widest disabled:opacity-50"
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </div>

      {/* SIGNUP */}
      <p className="text-xs text-center text-gray-500">
        Don’t have an account?{" "}
        <Link href="/signup" className="underline">
          CREATE ONE
        </Link>
      </p>

    </main>
  );
}