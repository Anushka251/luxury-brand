"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

type Props = {
  product: string;
};

export default function ReserveForm({
  product,
}: Props) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    signIn(undefined, {
      callbackUrl: window.location.pathname,
    });

    return null;
  }

  const productName =
    product === "crimson-rose"
      ? "Crimson Rose"
      : product === "ivory-blush"
      ? "Ivory Blush"
      : "Selected Piece";

  const [fitPreference, setFitPreference] =
    useState("custom");

  const [instagram, setInstagram] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [standardSize, setStandardSize] =
    useState("");

  const [occasion, setOccasion] =
    useState("");

  const [notes, setNotes] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const response = await fetch(
      "/api/reserve",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          product,
          fullName: session.user?.name,
          email: session.user?.email,
          instagram,
          phone,
          fitPreference,
          standardSize,
          occasion,
          notes,
        }),
      }
    );

    if (response.ok) {
      window.location.href =
        "/reserve/success";
    } else {
      alert(
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            AVENOR
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily:
                "Cormorant Garamond, serif",
            }}
          >
            Studio Reservation Ledger
          </h1>

          <p className="mt-6 text-sm leading-8 text-gray-500">
            You are reserving a
            studio consultation for{" "}
            <strong>{productName}</strong>.
            Reservations are
            available before the
            public release and do
            not guarantee
            allocation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-8"
        >
          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Full Name
            </label>

            <input
              type="text"
              value={session.user?.name ?? ""}
              readOnly
              className="
                w-full
                cursor-not-allowed
                border
                border-[#D9C9BC]
                bg-[#F7F5F2]
                px-4
                py-4
                text-gray-500
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Digital Mail Address
            </label>

            <input
              type="email"
              value={session.user?.email ?? ""}
              readOnly
              className="
                w-full
                cursor-not-allowed
                border
                border-[#D9C9BC]
                bg-[#F7F5F2]
                px-4
                py-4
                text-gray-500
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Instagram Handle
            </label>

            <input
              type="text"
              placeholder="@username"
              value={instagram}
              onChange={(e) =>
                setInstagram(e.target.value)
              }
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Contact Number (For Atelier Updates)
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="mb-4 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Fit Preference
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fit"
                  checked={
                    fitPreference ===
                    "custom"
                  }
                  onChange={() =>
                    setFitPreference(
                      "custom"
                    )
                  }
                />

                <span>
                  Custom Studio
                  Measurements
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fit"
                  checked={
                    fitPreference ===
                    "standard"
                  }
                  onChange={() =>
                    setFitPreference(
                      "standard"
                    )
                  }
                />

                <span>
                  Standard Size
                </span>
              </label>
            </div>
          </div>

          {fitPreference ===
            "standard" && (
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
                Standard Size
              </label>

              <select
                value={standardSize}
                onChange={(e) =>
                  setStandardSize(
                    e.target.value
                  )
                }
                className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
              >
                <option value="">
                  Select Size
                </option>

                <option value="XS">
                  XS
                </option>
                <option value="S">
                  S
                </option>
                <option value="M">
                  M
                </option>
                <option value="L">
                  L
                </option>
                <option value="XL">
                  XL
                </option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Occasion (Optional)
            </label>

            <input
              type="text"
              placeholder="Wedding, Gala, Reception..."
              value={occasion}
              onChange={(e) =>
                setOccasion(
                  e.target.value
                )
              }
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Additional Notes
              (Optional)
            </label>

            <textarea
              rows={5}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value
                )
              }
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <button
            type="submit"
            className="
              w-full
              border
              border-[#AF9685]
              py-4
              uppercase
              tracking-[0.35em]
              text-[#AF9685]
              transition-all
              duration-300
              hover:bg-[#AF9685]
              hover:text-white
            "
          >
            Reserve My Studio Slot
          </button>
        </form>

        <p className="mt-10 text-center text-xs leading-6 tracking-[0.15em] text-gray-400">
          Studio reservations
          close 48 hours before
          the public release.
          Once reservations
          close, the collection
          becomes available to
          all clients and pieces
          may sell out.
        </p>
      </div>
    </main>
  );
}
