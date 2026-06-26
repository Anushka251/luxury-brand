"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    const res = await signIn(
      "credentials",
      {
        email,
        password,
        redirect: false,
      }
    );

    if (res?.error) {
      setError(
        "Incorrect email or password."
      );

      setLoading(false);
      return;
    }

    window.location.href =
      "/account";
  };

  const handleGoogleLogin =
    async () => {
      setLoading(true);

      await signIn("google", {
        callbackUrl: "/account",
      });
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
        LOGIN
      </h1>

      <p className="text-gray-500 leading-8 mb-16">
        Sign in to access your
        orders, saved addresses,
        future collections and
        exclusive client releases.
      </p>

      {/* Google */}

      <button
        onClick={
          handleGoogleLogin
        }
        disabled={loading}
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
          mb-10
          disabled:opacity-50
        "
      >
        {loading
          ? "PLEASE WAIT..."
          : "CONTINUE WITH GOOGLE"}
      </button>

      <div className="flex items-center mb-10">

        <div className="flex-1 border-t" />

        <p className="px-5 text-xs tracking-[0.3em] text-gray-400">
          OR
        </p>

        <div className="flex-1 border-t" />

      </div>

      {/* Email */}

      <div className="mb-12">

        <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
          EMAIL
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          disabled={loading}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
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

      <div className="mb-4">

        <label className="block text-xs tracking-[0.3em] text-gray-400 mb-4">
          PASSWORD
        </label>

        <input
          type="password"
          placeholder="Your password"
          value={password}
          disabled={loading}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
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
