
"use client";

import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const products = [
  { id: "crimson-rose", name: "Crimson Rose", price: 8600 },
  { id: "ivory-blush", name: "Ivory Blush", price: 14600 },
  { id: "blue-crystal", name: "Blue Crystal", price: 9800 },
  { id: "sunset-lilac", name: "Sunset Lilac", price: 8100 },
  { id: "plum-aurum", name: "Plum Aurum", price: 7700 },
];

export default function PaymentCounter() {
  const [customer, setCustomer] = useState("");
  const [quantities, setQuantities] = useState<
    Record<string, number>
  >({});
  const [paymentUrl, setPaymentUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    return products.reduce(
      (sum, product) =>
        sum +
        product.price *
          (quantities[product.id] || 0),
      0
    );
  }, [quantities]);

  const selectedProducts = products.filter(
    (product) => (quantities[product.id] || 0) > 0
  );

  async function generateQR() {
    if (!customer.trim()) {
      alert("Enter customer name");
      return;
    }

    if (!selectedProducts.length) {
      alert("Select at least one product");
      return;
    }

    setLoading(true);
    setPaymentUrl("");

    try {
      const response = await fetch(
        "/api/admin/payments/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerName: customer,
            items: selectedProducts.map((p) => ({
              productId: p.id,
              quantity: quantities[p.id],
            })),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment creation failed");
      }

      setPaymentUrl(data.payment_link_url);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] px-5 py-10">
      <div className="mx-auto max-w-xl">

        <h1 className="text-center text-3xl text-[#AF9685]">
          AVENOR
        </h1>

        <p className="mt-2 text-center text-xs tracking-[0.3em] text-gray-400">
          PRIVATE PAYMENT COUNTER
        </p>

        <div className="mt-10 space-y-6">

          <div>
            <label className="text-xs uppercase tracking-widest text-gray-500">
              Customer Name
            </label>

            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Enter full name"
              className="mt-2 w-full border border-[#D9C9BC] bg-white p-4"
            />
          </div>

          <div>
            <h2 className="mb-4 text-xs uppercase tracking-widest text-gray-500">
              Select Products
            </h2>

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-3 border border-[#D9C9BC] bg-white p-4"
                >
                  <div>
                    <p>{product.name}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={quantities[product.id] || 0}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        Math.floor(Number(e.target.value) || 0)
                      );

                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: value,
                      }));
                    }}
                    className="w-16 border border-[#D9C9BC] p-2 text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#D9C9BC] bg-[#F7F5F2] p-6">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              Total Amount
            </p>

            <p className="mt-3 text-4xl text-[#AF9685]">
              ₹{total.toLocaleString("en-IN")}
            </p>

            <p className="mt-2 text-xs text-gray-400">
              {selectedProducts.length} product types selected
            </p>
          </div>

          <button
            onClick={generateQR}
            disabled={loading || total <= 0}
            className="w-full bg-[#AF9685] py-4 text-sm tracking-widest text-white disabled:opacity-50"
          >
            {loading ? "GENERATING..." : "GENERATE PAYMENT QR"}
          </button>

          {paymentUrl && (
            <div className="border border-[#D9C9BC] bg-white p-6 text-center">

              <h2 className="text-xl text-[#AF9685]">
                AVENOR
              </h2>

              <p className="mt-4 text-sm text-gray-500">
                Amount Payable
              </p>

              <p className="mt-2 text-3xl">
                ₹{total.toLocaleString("en-IN")}
              </p>

              <div className="mt-6 flex justify-center">
                <QRCodeSVG
                  value={paymentUrl}
                  size={220}
                  level="H"
                />
              </div>

              <p className="mt-5 text-sm text-gray-500">
                Scan to complete your payment securely.
              </p>

              <a
                href={paymentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-block border border-[#AF9685] px-6 py-3 text-sm text-[#AF9685]"
              >
                OPEN PAYMENT LINK
              </a>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}
