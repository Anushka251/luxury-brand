"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ReserveFormPage() {
  const searchParams = useSearchParams();
  const product = searchParams.get("product");

  const productName =
    product === "crimson-rose"
      ? "Crimson Rose"
      : product === "ivory-blush"
      ? "Ivory Blush"
      : "Selected Piece";

  const [fitPreference, setFitPreference] = useState("custom");

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            AVENOR
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
            }}
          >
            Studio Reservation Ledger
          </h1>

          <p className="mt-6 text-sm leading-8 text-gray-500">
            You are reserving a studio consultation for{" "}
            <strong>{productName}</strong>. Reservations are available
            before the public release and do not guarantee allocation.
          </p>
        </div>

        <form className="space-y-8">
          <div>
            <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
              Full Name
            </label>

            <input
              type="text"
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
              Digital Mail Address
            </label>

            <input
              type="email"
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
              Instagram Handle
            </label>

            <input
              type="text"
              placeholder="@username"
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
              Contact Number (For Atelier Updates)
            </label>

            <input
              type="tel"
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="block mb-4 text-xs uppercase tracking-[0.3em] text-gray-500">
              Fit Preference
            </label>

            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fit"
                  checked={fitPreference === "custom"}
                  onChange={() => setFitPreference("custom")}
                />
                <span>Custom Studio Measurements</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fit"
                  checked={fitPreference === "standard"}
                  onChange={() => setFitPreference("standard")}
                />
                <span>Standard Size</span>
              </label>
            </div>
          </div>

          {fitPreference === "standard" && (
            <div>
              <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                Standard Size
              </label>

              <select className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]">
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>
          )}

          <div>
            <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
              Occasion (Optional)
            </label>

            <input
              type="text"
              placeholder="Wedding, Gala, Reception..."
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <div>
            <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-gray-500">
              Additional Notes (Optional)
            </label>

            <textarea
              rows={5}
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-[#AF9685] py-4 uppercase tracking-[0.35em] text-[#AF9685] transition-all duration-300 hover:bg-[#AF9685] hover:text-white"
          >
            Reserve My Studio Slot
          </button>
        </form>

        <p className="mt-10 text-center text-xs leading-6 tracking-[0.15em] text-gray-400">
          Studio reservations close 48 hours before the public release.
          Once reservations close, the collection becomes available to
          all clients and pieces may sell out.
        </p>
      </div>
    </main>
  );
}
