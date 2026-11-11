
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { products } from "@/lib/products";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

declare global {
  interface Window {
    Cashfree?: (options: {
      mode: "sandbox" | "production";
    }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget: "_self";
      }) => Promise<unknown>;
    };
  }
}

export default function PaymentCounter() {
  const { data: session, status } = useSession();

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");

  const [quantities, setQuantities] = useState<
    Record<string, number>
  >({});

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info"
  >("info");

  const [returnOrderId, setReturnOrderId] = useState("");

  /*
  =========================================================
  AUTHENTICATION
  =========================================================
  */

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  /*
  =========================================================
  SELECTED PRODUCTS
  =========================================================
  */

  const selected = products.filter(
    (p) => (quantities[p.id] || 0) > 0
  );

  /*
  =========================================================
  TOTAL CALCULATION
  =========================================================
  */

  const total = useMemo(() => {
    return selected.reduce(
      (sum, p) =>
        sum + p.price * quantities[p.id],
      0
    );
  }, [selected, quantities]);

  /*
  =========================================================
  CURRENCY FORMAT
  =========================================================
  */

  const money = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  /*
  =========================================================
  LOAD CASHFREE SDK
  =========================================================
  */

  async function loadCashfree(): Promise<void> {
    if (window.Cashfree) return;

    await new Promise<void>((resolve, reject) => {
      const scriptUrl =
        "https://sdk.cashfree.com/js/v3/cashfree.js";

      const existing = document.querySelector(
        `script[src="${scriptUrl}"]`
      ) as HTMLScriptElement | null;

      if (existing) {
        if (window.Cashfree) {
          resolve();
          return;
        }

        existing.addEventListener(
          "load",
          () => resolve(),
          { once: true }
        );

        existing.addEventListener(
          "error",
          () => reject(
            new Error("Unable to load Cashfree.")
          ),
          { once: true }
        );

        return;
      }

      const script = document.createElement("script");

      script.src = scriptUrl;
      script.async = true;

      script.onload = () => resolve();

      script.onerror = () =>
        reject(
          new Error(
            "Unable to load Cashfree checkout."
          )
        );

      document.body.appendChild(script);
    });
  }

  /*
  =========================================================
  VERIFY PAYMENT AFTER CASHFREE REDIRECT
  =========================================================
  */

  useEffect(() => {
    if (status !== "authenticated") return;

    const params = new URLSearchParams(
      window.location.search
    );

    const orderId = params.get("order_id");

    if (!orderId) return;

    setReturnOrderId(orderId);
    setMessage("Verifying payment with Cashfree...");
    setMessageType("info");

    let cancelled = false;

    async function verifyPayment() {
      try {
        const response = await fetch(
          `/api/admin/payments/verify?order_id=${encodeURIComponent(
            orderId!
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Payment verification failed."
          );
        }

        if (data.paid) {
          setMessage(
            data.message ||
              "Payment successfully verified."
          );

          setMessageType("success");
        } else {
          setMessage(
            "Payment has not been confirmed by Cashfree. Please check the transaction before accepting another payment."
          );

          setMessageType("error");
        }
      } catch (error) {
        if (cancelled) return;

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to verify payment."
        );

        setMessageType("error");
      }
    }

    verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [status]);

  /*
  =========================================================
  START PAYMENT
  =========================================================
  */

  async function startPayment() {
    if (!customer.trim()) {
      alert("Enter customer name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert(
        "Enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (!selected.length || total <= 0) {
      alert("Select at least one product.");
      return;
    }

    setLoading(true);
    setMessage("");
    setReturnOrderId("");

    try {
      /*
      CREATE PAYMENT SESSION
      */

      const response = await fetch(
        "/api/admin/payments/session",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customerName: customer.trim(),

            customerPhone: phone,

            items: selected.map((p) => ({
              productId: p.id,
              quantity: quantities[p.id],
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to create payment."
        );
      }

      if (!data.payment_session_id) {
        throw new Error(
          "Cashfree payment session is missing."
        );
      }

      /*
      LOAD CASHFREE
      */

      await loadCashfree();

      if (!window.Cashfree) {
        throw new Error(
          "Cashfree checkout could not be initialized."
        );
      }

      /*
      OPEN CASHFREE CHECKOUT
      */

      const cashfree = window.Cashfree({
        mode:
          data.cashfreeMode === "sandbox"
            ? "sandbox"
            : "production",
      });

      await cashfree.checkout({
        paymentSessionId:
          data.payment_session_id,

        redirectTarget: "_self",
      });

    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  /*
  =========================================================
  LOADING SCREEN
  =========================================================
  */

  if (
    status === "loading" ||
    status === "unauthenticated"
  ) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-sm tracking-widest text-[#AF9685]">
          AVENOR
        </p>
      </main>
    );
  }

  /*
  =========================================================
  ADMIN ACCESS CHECK
  =========================================================
  */

  if (
    !ADMIN_EMAIL ||
    session?.user?.email?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
  ) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-10">
        <p className="text-center text-gray-600">
          You are not authorized to access this page.
        </p>
      </main>
    );
  }

  /*
  =========================================================
  MAIN PAYMENT COUNTER
  =========================================================
  */

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-12">

      <div className="mx-auto max-w-xl">

        {/* HEADER */}

        <header className="mb-12 text-center">

          <h1
            className="text-4xl text-[#AF9685]"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            AVENOR
          </h1>

          <p className="mt-3 text-xs tracking-[0.35em] text-gray-400">
            PRIVATE PAYMENT COUNTER
          </p>

          <p className="mt-2 text-xs tracking-widest text-gray-400">
            EXHIBITION SALES
          </p>

        </header>

        <div className="space-y-8">

          {/* PAYMENT RETURN STATUS */}

          {returnOrderId && (
            <section className="border border-[#D9C9BC] bg-white p-5">

              <p className="text-xs uppercase tracking-widest text-[#AF9685]">
                Payment Verification
              </p>

              <p className="mt-3 break-all text-xs text-gray-500">
                Reference: {returnOrderId}
              </p>

              <p
                className={`mt-4 text-sm ${
                  messageType === "success"
                    ? "text-green-700"
                    : messageType === "error"
                    ? "text-red-700"
                    : "text-gray-600"
                }`}
              >
                {message}
              </p>

            </section>
          )}

          {/* CUSTOMER NAME */}

          <section>

            <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
              Customer Name
            </label>

            <input
              type="text"
              value={customer}
              onChange={(e) =>
                setCustomer(e.target.value)
              }
              placeholder="Enter customer name"
              className="w-full border border-[#D9C9BC] bg-white p-4 outline-none focus:border-[#AF9685]"
            />

          </section>

          {/* CUSTOMER PHONE */}

          <section>

            <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
              Customer Phone
            </label>

            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
              placeholder="10-digit mobile number"
              className="w-full border border-[#D9C9BC] bg-white p-4 outline-none focus:border-[#AF9685]"
            />

          </section>

          {/* PRODUCT SELECTION */}

          <section>

            <h2 className="mb-5 text-xs uppercase tracking-widest text-gray-500">
              Select Products
            </h2>

            <div className="space-y-3">

              {products.map((p) => (

                <div
                  key={p.id}
                  className="flex items-center justify-between gap-4 border border-[#D9C9BC] bg-white p-4"
                >

                  <div className="min-w-0">

                    <p className="text-gray-800">
                      {p.name}
                    </p>

                    <p className="mt-1 text-sm text-[#AF9685]">
                      {money(p.price)}
                    </p>

                  </div>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={
                      quantities[p.id] || ""
                    }
                    placeholder="0"
                    onChange={(e) => {
                      const raw = e.target.value;

                      const qty =
                        raw === ""
                          ? 0
                          : Math.max(
                              0,
                              Math.min(
                                100,
                                Math.floor(
                                  Number(raw) || 0
                                )
                              )
                            );

                      setQuantities((prev) => ({
                        ...prev,
                        [p.id]: qty,
                      }));
                    }}
                    className="w-20 border border-[#D9C9BC] bg-[#FAF8F5] p-3 text-center outline-none focus:border-[#AF9685]"
                  />

                </div>

              ))}

            </div>

            <p className="mt-3 text-xs text-gray-400">
              Enter the quantity of each selected piece.
            </p>

          </section>

          {/* PURCHASE SUMMARY */}

          <section className="border border-[#D9C9BC] bg-[#F7F5F2] p-6">

            <p className="text-xs uppercase tracking-widest text-[#AF9685]">
              Purchase Summary
            </p>

            <div className="mt-5 space-y-3">

              {selected.map((p) => (

                <div
                  key={p.id}
                  className="flex justify-between gap-3 text-sm"
                >

                  <span className="text-gray-700">
                    {p.name} × {quantities[p.id]}
                  </span>

                  <span className="whitespace-nowrap text-gray-800">
                    {money(
                      p.price * quantities[p.id]
                    )}
                  </span>

                </div>

              ))}

              {selected.length === 0 && (
                <p className="text-sm text-gray-400">
                  No products selected.
                </p>
              )}

            </div>

            <div className="my-5 border-t border-[#D9C9BC]" />

            <p className="text-xs uppercase tracking-widest text-gray-500">
              Total Payable
            </p>

            <p className="mt-3 text-4xl text-[#AF9685]">
              {money(total)}
            </p>

          </section>

          {/* ERROR / INFORMATION MESSAGE */}

          {message && !returnOrderId && (

            <div
              className={`border bg-white p-4 text-sm ${
                messageType === "error"
                  ? "border-red-200 text-red-700"
                  : "border-[#D9C9BC] text-gray-600"
              }`}
            >
              {message}
            </div>

          )}

          {/* PAYMENT BUTTON */}

          <button
            type="button"
            onClick={startPayment}
            disabled={
              loading ||
              total <= 0 ||
              Boolean(returnOrderId)
            }
            className="w-full bg-[#AF9685] py-5 text-xs tracking-[0.3em] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "OPENING CHECKOUT..."
              : "PROCEED TO PAYMENT"}
          </button>

          {/* FOOTER */}

          <footer className="pt-5 text-center">

            <p className="text-xs tracking-widest text-gray-400">
              SECURE PAYMENT POWERED BY CASHFREE
            </p>

            <p className="mt-4 text-xs tracking-[0.3em] text-[#AF9685]">
              AVENOR COLLECTION
            </p>

          </footer>

        </div>

      </div>

    </main>
  );
}
