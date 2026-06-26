"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Account created successfully.");

    router.push("/login");
  };

  return (
    <main className="max-w-xl mx-auto px-8 py-24">

      {/* Header */}

      <p className="text-xs tracking-[0.35em] text-gray-400 mb-5">
        AVENOR CLIENT
      </p>

      <h1
        className="
          text-5xl
          md:text-6xl
          font-light
          tracking-[0.08em]
          mb-5
        "
      >
        CREATE ACCOUNT
      </h1>

      <p className="text-gray-500 leading-8 mb-16">
        Create your Avenor account to access your orders,
        saved addresses, future collections and exclusive
        client releases.
      </p>

      {/* Email */}

      <div className="mb-12">

        <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
          EMAIL
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="
            w-full
            border-0
            border-b
            border-gray-300
            bg-transparent
            py-4
            outline-none
            text-lg
            focus:border-black
            transition
          "
        />

      </div>

      {/* Password */}

      <div className="mb-16">

        <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
          PASSWORD
        </label>

        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="
            w-full
            border-0
            border-b
            border-gray-300
            bg-transparent
            py-4
            outline-none
            text-lg
            focus:border-black
            transition
          "
        />

      </div>

      {/* Button */}

      <button
        onClick={handleSignup}
        className="
          w-full
          border
          border-black
          py-5
          tracking-[0.3em]
          hover:bg-black
          hover:text-white
          transition-all
          duration-300
        "
      >
        CREATE ACCOUNT
      </button>

      {/* Login */}

      <div className="mt-10 text-center">

        <p className="text-sm text-gray-500">
          Already have an account?
        </p>

        <Link
          href="/login"
          className="
            inline-block
            mt-4
            tracking-[0.25em]
            text-sm
            hover:opacity-60
            transition
          "
        >
          LOGIN
        </Link>

      </div>

    </main>
  );
}
