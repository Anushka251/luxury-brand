"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ChangePasswordPage() {
  const { data: session } = useSession();

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch(
      "/api/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          currentPassword,
          newPassword,
        }),
      }
    );

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Password updated");

    setCurrentPassword("");
    setNewPassword("");
  };

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="tracking-widest">
          LOGIN REQUIRED
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-8 md:px-12 py-24">

      <div className="mb-16">
        <p className="text-xs tracking-[0.35em] text-gray-400 mb-4">
          AVENOR CLIENT
        </p>

        <h1 className="text-5xl font-light tracking-[0.12em]">
          SECURITY
        </h1>

        <p className="text-gray-500 mt-4">
          Update your account password.
        </p>
      </div>

      <div className="space-y-10">

        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }
          className="
            w-full
            border-b
            border-gray-300
            py-4
            text-lg
            bg-transparent
            focus:outline-none
            focus:border-black
          "
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
          className="
            w-full
            border-b
            border-gray-300
            py-4
            text-lg
            bg-transparent
            focus:outline-none
            focus:border-black
          "
        />

        <button
          onClick={
            handleChangePassword
          }
          className="
            mt-6
            px-10
            py-4
            border
            border-black
            tracking-[0.2em]
            hover:bg-black
            hover:text-white
            transition
          "
        >
          UPDATE PASSWORD
        </button>

      </div>
    </main>
  );
}
