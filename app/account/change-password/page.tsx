"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ChangePasswordPage() {
  const { data: session } = useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("/api/change-password", {
      method: "POST",
      body: JSON.stringify({
        email: session?.user?.email,
        currentPassword,
        newPassword,
      }),
    });

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
        <p>Login required</p>
      </main>
    );
  }

  return (
    <main className="px-12 py-32 max-w-md mx-auto">
      <h1 className="text-2xl tracking-widest mb-10">
        CHANGE PASSWORD
      </h1>

      <div className="space-y-4">
        <input
          type="password"
          placeholder="Current Password"
          className="w-full border p-3"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-3"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <button
          onClick={handleChangePassword}
          className="w-full bg-black text-white py-3 tracking-widest"
        >
          UPDATE PASSWORD
        </button>
      </div>
    </main>
  );
}