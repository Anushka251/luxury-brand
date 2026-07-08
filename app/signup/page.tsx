"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
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
        name,
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

    router.push("/auth");
  };

  return (
    <main className="max-w-xl mx-auto px-8 py-24">
      {/* Header */}

      <p className="mb-5 text-xs tracking-[0.35em] text-gray-400">
        AVENOR CLIENT
      </p>

      <h1
        className="
          mb-5
          text-5xl
          font-light
          tracking-[0.08em]
          md:text-6xl
        "
      >
        CREATE ACCOUNT
      </h1>

      <p className="mb-16 leading-8 text-gray-500">
        Create your Avenor account to access your orders,
        saved addresses, future collections and exclusive
        client releases.
      </p>

      {/* Full Name */}

      <div className="mb-12">
        <label className="mb-4 block text-xs tracking-[0.3em] text-gray-400">
          FULL NAME
        </label>

        <input
          type="text"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full
            border-0
            border-b
            border-gray-300
            bg-transparent
            py-4
            text-lg
            outline-none
            transition
            focus:border-black
          "
        />
      </div>

      {/* Email */}

      <div className="mb-12">
        <label className="mb-4 block text-xs tracking-[0.3em] text-gray-400">
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
            text-lg
            outline-none
            transition
            focus:border-black
          "
        />
      </div>

      {/* Password */}

      <div className="mb-16">
        <label className="mb-4 block text-xs tracking-[0.3em] text-gray-400">
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
            text-lg
            outline-none
            transition
            focus:border-black
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
          transition-all
          duration-300
          hover:bg-black
          hover:text-white
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
          href="/auth"
          className="
            mt-4
            inline-block
            text-sm
            tracking-[0.25em]
            transition
            hover:opacity-60
          "
        >
          LOGIN
        </Link>
      </div>
    </main>
  );
}
