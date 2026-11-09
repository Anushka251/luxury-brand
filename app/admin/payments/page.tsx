
"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";

type PaymentQR = {
  payment_link_url: string;
  payment_qr: string;
  link_id: string;
};

export default function PaymentCounter() {
  const [customer, setCustomer] = useState("");
  const [quantities, setQuantities] = useState<
    Record<string, number>
  >({});
  const [payment, setPayment] = useState<PaymentQR | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedProducts = products.filter(
    (product) => (quantities[product.id] || 0) > 0
  );

  const total = useMemo(
    () =>
      selectedProducts.reduce(
        (sum, product) =>
          sum + product.price * quantities[product.id],
        0
      ),
    [selectedProducts, quantities]
  );

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  function updateQuantity(id: string, value: string) {
    const quantity = Math.max(
      0,
      Math.min(10, Math.floor(Number(value) || 0))
    );

    setQuantities((previous) => ({
      ...previous,
      [id]: quantity,
    }));

    setPayment(null);
  }

  async function generateQR() {
    if (!customer.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (selectedProducts.length === 0) {
      alert("Please select at least one product.");
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
            items: selectedProducts.map((product) => ({
              productId: product.id,
              quantity: quantities[product.id],
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to generate payment QR."
        );
      }

      setPayment(data);
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
            className="text-4xl font-light tracking-wide text-[#AF9685]"
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

          {/* CUSTOMER */}

          <section>
            <label className="mb-2 block text-xs uppercase tracking-[0.25em] text-gray-500">
              Customer Name
            </label>

            <input
              value={customer}
              onChange={(e) => {
                setCustomer(e.target.value);
                setPayment(null);
              }}
              placeholder="Enter full name"
              className="w-full border border-[#D9C9BC] bg-white px-4 py-4 outline-none focus:border-[#AF9685]"
            />
          </section>

          {/* PRODUCTS */}

          <section>
            <h2 className="mb-5 text-xs uppercase tracking-[0.25em] text-gray-500">
              Select Products
            </h2>

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 border border-[#D9C9BC] bg-white p-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-gray-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-sm text-[#AF9685]">
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="1"
                    value={quantities[product.id] || ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateQuantity(
                        product.id,
                        e.target.value
                      )
                    }
                    className="w-16 border border-[#D9C9BC] bg-[#FAF8F5] p-3 text-center outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* BILL */}

          <section className="border border-[#D9C9BC] bg-[#F7F5F2] p-6">

            <p className="text-xs uppercase tracking-[0.25em] text-[#AF9685]">
              Purchase Summary
            </p>

            <div className="mt-5 space-y-3">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span>
                    {product.name} × {quantities[product.id]}
                  </span>

                  <span>
                    {formatPrice(
                      product.price * quantities[product.id]
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="my-5 border-t border-[#D9C9BC]" />

            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Total Payable
            </p>

            <p className="mt-3 text-4xl font-light text-[#AF9685]">
              {formatPrice(total)}
            </p>

          </section>

          {/* GENERATE */}

          <button
            type="button"
            onClick={generateQR}
            disabled={loading || total <= 0}
            className="w-full border border-[#AF9685] bg-[#AF9685] py-5 text-xs tracking-[0.3em] text-white transition hover:bg-[#967B69] disabled:opacity-50"
          >
            {loading
              ? "GENERATING PAYMENT QR..."
              : "GENERATE PAYMENT QR"}
          </button>

          {/* QR */}

          {payment && (
            <section className="border border-[#D9C9BC] bg-white p-7 text-center">

              <h2 className="text-2xl text-[#AF9685]">
                AVENOR
              </h2>

              <p className="mt-4 text-xs uppercase tracking-widest text-gray-400">
                Amount Payable
              </p>

              <p className="mt-2 text-4xl text-[#AF9685]">
                {formatPrice(total)}
              </p>

              <div className="mt-7 flex justify-center">
                <img
                  src={payment.payment_qr}
                  alt="Cashfree payment QR"
                  className="h-64 w-64 object-contain"
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Ask the customer to scan and complete payment.
              </p>

              <a
                href={payment.payment_link_url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block border border-[#AF9685] px-6 py-3 text-xs tracking-widest text-[#AF9685]"
              >
                OPEN PAYMENT LINK
              </a>

              <p className="mt-4 text-xs text-gray-400">
                Payment reference: {payment.link_id}
              </p>

            </section>
          )}

        </div>
      </div>
    </main>
  );
}
