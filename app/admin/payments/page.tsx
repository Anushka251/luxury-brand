
"use client";

import { useMemo, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { QRCodeSVG } from "qrcode.react";
import { products } from "@/lib/products";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function PaymentCounter() {
  const { data: session, status } = useSession();

  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [quantities, setQuantities] =
    useState<Record<string, number>>({});
  const [payment, setPayment] = useState<{
    payment_link_url: string;
    payment_link_id: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

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

  if (status === "loading") {
    return <main className="p-10">Loading...</main>;
  }

  if (!session) {
    signIn();
    return null;
  }

  if (
    !ADMIN_EMAIL ||
    session.user?.email?.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
  ) {
    return (
      <main className="p-10 text-center">
        You are not authorized to access this page.
      </main>
    );
  }

  async function generateQR() {
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
    setPayment(null);

    try {
      const response = await fetch(
        "/api/admin/payments/create",
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
        throw new Error(data.error || "Payment creation failed.");
      }

      setPayment({
        payment_link_url: data.payment_link_url,
        payment_link_id: data.payment_link_id,
      });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
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

          <section>
            <label className="mb-2 block text-xs uppercase tracking-widest text-gray-500">
              Customer Name
            </label>

            <input
              value={customer}
              onChange={(e) => {
                setCustomer(e.target.value);
                setPayment(null);
              }}
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
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                setPayment(null);
              }}
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
                    max="10"
                    step="1"
                    value={quantities[p.id] || ""}
                    placeholder="0"
                    onChange={(e) => {
                      const qty = Math.max(
                        0,
                        Math.min(10, Math.floor(Number(e.target.value) || 0))
                      );

                      setQuantities((prev) => ({
                        ...prev,
                        [p.id]: qty,
                      }));

                      setPayment(null);
                    }}
                    className="w-16 border border-[#D9C9BC] bg-[#FAF8F5] p-3 text-center"
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
            </div>

            <div className="my-5 border-t border-[#D9C9BC]" />

            <p className="text-xs uppercase tracking-widest text-gray-500">
              Total Payable
            </p>

            <p className="mt-3 text-4xl text-[#AF9685]">
              {money(total)}
            </p>
          </section>

          <button
            type="button"
            onClick={generateQR}
            disabled={loading || total <= 0}
            className="w-full bg-[#AF9685] py-5 text-xs tracking-[0.3em] text-white disabled:opacity-50"
          >
            {loading ? "GENERATING..." : "GENERATE PAYMENT QR"}
          </button>

          {payment && (
            <section className="border border-[#D9C9BC] bg-white p-7 text-center">

              <h2 className="text-2xl text-[#AF9685]">
                AVENOR
              </h2>

              <p className="mt-5 text-sm text-gray-500">
                Amount Payable
              </p>

              <p className="mt-2 text-4xl text-[#AF9685]">
                {money(total)}
              </p>

              <div className="mt-7 flex justify-center">
                <QRCodeSVG
                  value={payment.payment_link_url}
                  size={240}
                  level="H"
                  marginSize={2}
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Ask the customer to scan and pay.
              </p>

              <a
                href={payment.payment_link_url}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block border border-[#AF9685] px-6 py-3 text-xs tracking-widest text-[#AF9685]"
              >
                OPEN CASHFREE CHECKOUT
              </a>

              <p className="mt-4 break-all text-xs text-gray-400">
                Reference: {payment.payment_link_id}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
