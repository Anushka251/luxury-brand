
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { products } from "@/lib/products";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

declare global {
  interface Window {
    Cashfree?: (options: { mode: "sandbox" | "production" }) => {
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
  const [quantities, setQuantities] =
    useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [returnOrderId, setReturnOrderId] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (orderId) {
      setReturnOrderId(orderId);
      setMessage(
        "Payment completed or checkout closed. Please verify the payment status before treating the order as paid."
      );
    }
  }, []);

  const selected = products.filter(
    (p) => (quantities[p.id] || 0) > 0
  );

  const total = useMemo(
    () =>
      selected.reduce(
        (sum, p) => sum + p.price * quantities[p.id],
        0
      ),
    [selected, quantities]
  );

  const money = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  async function loadCashfree() {
    if (window.Cashfree) return;

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(
        'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(
          new Error("Unable to load Cashfree.")
        ), { once: true });

        if (window.Cashfree) resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Unable to load Cashfree checkout."));

      document.body.appendChild(script);
    });
  }

  async function startPayment() {
    if (!customer.trim()) {
      alert("Enter customer name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Enter a valid 10-digit Indian mobile number.");
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
          data.error || "Unable to create payment."
        );
      }

      if (!data.payment_session_id) {
        throw new Error("Cashfree payment session is missing.");
      }

      await loadCashfree();

      if (!window.Cashfree) {
        throw new Error("Cashfree checkout could not be initialized.");
      }

      const cashfree = window.Cashfree({
        mode: data.cashfreeMode === "sandbox"
          ? "sandbox"
          : "production",
      });

      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return <main className="p-10">Loading...</main>;
  }

  if (
    !ADMIN_EMAIL ||
    session?.user?.email?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
  ) {
    return (
      <main className="p-10 text-center">
        You are not authorized to access this page.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-12">
      <div className="mx-auto max-w-xl">

        <header className="mb-12 text-center">
          <h1
            className="text-4xl text-[#AF9685]"
            style={{
              fontFamily: '"Cormorant Garamond", serif',
            }}
          >
            AVENOR
          </h1>

          <p className="mt-3 text-xs tracking-[0.35em] text-gray-400">
            PRIVATE PAYMENT COUNTER
          </p>
        </header>

        <div className="space-y-8">

          {returnOrderId && (
            <section className="border border-[#D9C9BC] bg-white p-5">
              <p className="text-xs uppercase tracking-widest text-[#AF9685]">
                Payment return
              </p>
              <p className="mt-3 break-all text-sm text-gray-600">
                Reference: {returnOrderId}
              </p>
              <p className="mt-3 text-sm text-gray-600">
                {message}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Do not mark this order as paid until it has been verified with Cashfree.
              </p>
            </section>
          )}

          <section>
            <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
              Customer Name
            </label>

            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Enter customer name"
              className="w-full border border-[#D9C9BC] bg-white p-4 outline-none"
            />
          </section>

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
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              placeholder="10-digit mobile number"
              className="w-full border border-[#D9C9BC] bg-white p-4 outline-none"
            />
          </section>

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
                  <div>
                    <p className="text-gray-800">{p.name}</p>
                    <p className="mt-1 text-sm text-[#AF9685]">
                      {money(p.price)}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={quantities[p.id] || ""}
                    placeholder="0"
                    onChange={(e) => {
                      const raw = e.target.value;
                      const qty = raw === ""
                        ? 0
                        : Math.max(
                            0,
                            Math.min(100, Math.floor(Number(raw) || 0))
                          );

                      setQuantities((prev) => ({
                        ...prev,
                        [p.id]: qty,
                      }));
                    }}
                    className="w-20 border border-[#D9C9BC] bg-[#FAF8F5] p-3 text-center"
                  />
                </div>
              ))}
            </div>
          </section>

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
                  <span>
                    {p.name} × {quantities[p.id]}
                  </span>
                  <span>
                    {money(p.price * quantities[p.id])}
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

          {message && !returnOrderId && (
            <p className="border border-red-200 bg-white p-4 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={startPayment}
            disabled={loading || total <= 0}
            className="w-full bg-[#AF9685] py-5 text-xs tracking-[0.3em] text-white disabled:opacity-50"
          >
            {loading ? "OPENING CHECKOUT..." : "PROCEED TO PAYMENT"}
          </button>

          <p className="text-center text-xs text-gray-400">
            Secure payment powered by Cashfree
          </p>

        </div>
      </div>
    </main>
  );
}
