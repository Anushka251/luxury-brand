"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Password reset link sent to your email");
  };

  return (
    <main className="px-12 py-32 max-w-md mx-auto">
      <h1 className="text-2xl tracking-widest mb-10">
        FORGOT PASSWORD
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full border p-3 mb-6"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleForgotPassword}
        className="w-full bg-black text-white py-3 tracking-widest"
      >
        SEND RESET LINK
      </button>
    </main>
  );
}