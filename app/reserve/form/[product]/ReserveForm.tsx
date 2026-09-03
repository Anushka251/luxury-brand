"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

type Props = {
  product: string;
};

export default function ReserveForm({ product }: Props) {
  const { data: session, status } = useSession();

  const [fitPreference, setFitPreference] = useState("custom");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [standardSize, setStandardSize] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ==========================================
     SESSION LOADING
  ========================================== */

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  /* ==========================================
     REQUIRE LOGIN
  ========================================== */

  if (!session) {
    signIn(undefined, {
      callbackUrl: window.location.pathname,
    });

    return null;
  }

  /* ==========================================
     CUSTOMER INFORMATION
  ========================================== */

  const userName = session.user?.name ?? "";
  const userEmail = session.user?.email ?? "";

  /* ==========================================
     PRODUCT NAME
  ========================================== */

  const productName =
    product === "crimson-rose"
      ? "Crimson Rose"
      : product === "ivory-blush"
      ? "Ivory Blush"
      : product === "blue-crystal"
      ? "Blue Crystal"
      : product === "sunset-lilac"
      ? "Sunset Lilac"
      : "Selected Piece";

  /* ==========================================
     SUBMIT RESERVATION
  ========================================== */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    /* Validate phone */

    if (!phone.trim()) {
      alert("Please enter your contact number.");
      return;
    }

    /* Validate standard size */

    if (fitPreference === "standard" && !standardSize) {
      alert("Please select your standard size.");
      return;
    }

    setIsLoading(true);

    try {
      /* ========================================
         CREATE RESERVATION + CASHFREE ORDER
      ======================================== */

      const response = await fetch("/api/reserve", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          product,
          fullName: userName,
          email: userEmail,
          instagram,
          phone,
          fitPreference,
          standardSize,
          occasion,
          notes,
        }),
      });

      const data = await response.json();

      /* ========================================
         API ERROR
      ======================================== */

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create reservation."
        );
      }

      /* ========================================
         PAYMENT SESSION CHECK
      ======================================== */

      if (!data.payment_session_id) {
        throw new Error(
          "Payment session was not created."
        );
      }

      /* ========================================
         SAVE RESERVATION INFORMATION
      ======================================== */

      sessionStorage.setItem(
        "avenor_reservation",
        JSON.stringify({
          orderId: data.order_id,
          reservationId: data.reservation_id,
          product,
          fullName: userName,
          email: userEmail,
          instagram,
          phone,
          fitPreference,
          standardSize,
          occasion,
          notes,
        })
      );

      /* ========================================
         LOAD CASHFREE SDK
      ======================================== */

      if (!(window as any).Cashfree) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");

          script.src =
            "https://sdk.cashfree.com/js/v3/cashfree.js";

          script.onload = () => resolve();

          script.onerror = () =>
            reject(
              new Error("Unable to load Cashfree.")
            );

          document.body.appendChild(script);
        });
      }

      /* ========================================
         INITIALIZE CASHFREE
      ======================================== */

      const cashfree = (window as any).Cashfree({
        mode:
          process.env.NEXT_PUBLIC_CASHFREE_MODE ===
          "sandbox"
            ? "sandbox"
            : "production",
      });

      /* ========================================
         OPEN CASHFREE CHECKOUT
      ======================================== */

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (error) {
      console.error(
        "Reservation payment error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-6 py-16">
      <div className="mx-auto max-w-2xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-12 text-center">

          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            AVENOR
          </p>

          <h1
            className="mt-4 text-5xl font-light text-[#AF9685]"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Studio Reservation Ledger
          </h1>

          <p className="mt-6 text-sm leading-8 text-gray-500">
            You are requesting private access to{" "}
            <strong>{productName}</strong>.
          </p>

          <p className="mt-4 text-sm leading-8 text-gray-500">
            Your private-access reservation is
            available before the public release and
            gives you priority access during the
            private purchasing window.
          </p>

          <p className="mt-5 text-sm font-medium text-[#AF9685]">
            Your private access is secured only after
            successful payment of the ₹500 reservation fee.
          </p>

        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-8"
        >

          {/* FULL NAME */}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Full Name
            </label>

            <input
              type="text"
              value={userName}
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

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Digital Mail Address
            </label>

            <input
              type="email"
              value={userEmail}
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

          {/* INSTAGRAM */}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Instagram Handle

              <span className="ml-2 normal-case tracking-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <input
              type="text"
              placeholder="@username"
              value={instagram}
              onChange={(e) =>
                setInstagram(e.target.value)
              }
              className="
                w-full
                border
                border-[#D9C9BC]
                bg-white
                px-4
                py-4
                outline-none
                focus:border-[#AF9685]
              "
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Contact Number (For Atelier Updates)
            </label>

            <input
              type="tel"
              required
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="
                w-full
                border
                border-[#D9C9BC]
                bg-white
                px-4
                py-4
                outline-none
                focus:border-[#AF9685]
              "
            />
          </div>

          {/* FIT PREFERENCE */}

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
                    fitPreference === "custom"
                  }
                  onChange={() =>
                    setFitPreference("custom")
                  }
                />

                <span>
                  Custom Studio Measurements
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fit"
                  checked={
                    fitPreference === "standard"
                  }
                  onChange={() =>
                    setFitPreference("standard")
                  }
                />

                <span>
                  Standard Size
                </span>
              </label>

            </div>
          </div>

          {/* STANDARD SIZE */}

          {fitPreference === "standard" && (
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
                Standard Size
              </label>

              <select
                value={standardSize}
                onChange={(e) =>
                  setStandardSize(e.target.value)
                }
                className="
                  w-full
                  border
                  border-[#D9C9BC]
                  bg-white
                  px-4
                  py-4
                  outline-none
                  focus:border-[#AF9685]
                "
              >
                <option value="">
                  Select Size
                </option>

                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>
          )}

          {/* OCCASION */}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Occasion (Optional)
            </label>

            <input
              type="text"
              placeholder="Wedding, Gala, Reception..."
              value={occasion}
              onChange={(e) =>
                setOccasion(e.target.value)
              }
              className="
                w-full
                border
                border-[#D9C9BC]
                bg-white
                px-4
                py-4
                outline-none
                focus:border-[#AF9685]
              "
            />
          </div>

          {/* NOTES */}

          <div>
            <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-500">
              Additional Notes (Optional)
            </label>

            <textarea
              rows={5}
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              className="
                w-full
                border
                border-[#D9C9BC]
                bg-white
                px-4
                py-4
                outline-none
                focus:border-[#AF9685]
              "
            />
          </div>

          {/* ==========================================
              RESERVATION FEE
          ========================================== */}

          <div className="border border-[#D9C9BC] bg-[#F7F5F2] p-6">

            <p className="text-xs uppercase tracking-[0.3em] text-[#AF9685]">
              Private Access Reservation
            </p>

            <p className="mt-4 text-sm leading-7 text-gray-600">
              A{" "}
              <strong>₹500 reservation fee</strong>{" "}
              is required to secure your private access.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Your private access is confirmed only
              after the payment has been successfully
              verified.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Once confirmed, you receive priority
              access to this piece during its private
              purchasing window before the public release.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              If the piece becomes fully sold out during
              the private purchasing window before you
              are able to purchase it, your ₹500 reservation
              fee will be returned.
            </p>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              If you choose not to purchase while your
              private purchasing window is open, the
              reservation fee is not refundable.
            </p>

            <p className="mt-4 text-xs leading-6 tracking-[0.08em] text-gray-400">
              Private access does not guarantee that a
              piece will remain available. Quantities are
              strictly limited and allocations are subject
              to availability.
            </p>

          </div>

          {/* ==========================================
              PAYMENT BUTTON
          ========================================== */}

          <button
            type="submit"
            disabled={isLoading}
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
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isLoading
              ? "Opening Secure Payment..."
              : "Continue to Payment — ₹500"}
          </button>

        </form>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <p className="mt-10 text-center text-xs leading-6 tracking-[0.15em] text-gray-400">
          Private access closes before the collection
          enters its private purchasing window.

          <br />

          Once the private window ends, the collection
          may open publicly and pieces may sell out.
        </p>

      </div>
    </main>
  );
}
