"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    alert("Account created");
    router.push("/login");
  };

  return (
    <main className="px-12 py-32 max-w-md mx-auto">
      <h1 className="text-2xl mb-6">SIGN UP</h1>

      <input
        className="w-full border p-3 mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="w-full border p-3 mb-6"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="w-full bg-black text-white py-3"
      >
        CREATE ACCOUNT
      </button>
    </main>
  );
}