"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const handleResetPassword = async () => {
    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Password updated successfully");

    window.location.href = "/auth";
  };

  return (
    <main className="px-12 py-32 max-w-md mx-auto">
      <h1 className="text-2xl tracking-widest mb-10">
        RESET PASSWORD
      </h1>

      <input
        type="password"
        placeholder="New Password"
        className="w-full border p-3 mb-6"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleResetPassword}
        className="w-full bg-black text-white py-3 tracking-widest"
      >
        UPDATE PASSWORD
      </button>
    </main>
  );
}