"use client";

import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // LOAD ADDRESSES
  useEffect(() => {
    const saved = localStorage.getItem("addresses");
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ADD NEW ADDRESS FLOW
  const handleAddNew = () => {
    localStorage.setItem("checkout_redirect", "true");
    router.push("/account/address");
  };

  // PAYMENT
  const handlePayment = () => {
    if (!selectedAddress) {
      alert("Select an address");
      return;
    }

    const order = {
      orderId: `AVN-${Date.now()}`,
      items: cart,
      total,
      address: selectedAddress,
      createdAt: new Date(),
    };

    const prev = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...prev, order]));

    alert("Order placed!");
  };

  return (
    <main className="max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-20">
      
      {/* LEFT: ADDRESS */}
      <section>
        <h2 className="text-xl mb-6 tracking-widest">
          SELECT ADDRESS
        </h2>

        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedAddress(addr)}
              className={`border p-4 cursor-pointer transition ${
                selectedAddress?.id === addr.id
                  ? "border-black"
                  : "border-gray-300"
              }`}
            >
              <p>{addr.name}</p>
              <p className="text-sm">{addr.address}</p>
              <p className="text-xs text-gray-500">
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>
          ))}
        </div>

        {/* ADD NEW */}
        <button
          onClick={handleAddNew}
          className="mt-6 text-sm underline"
        >
          + ADD NEW ADDRESS
        </button>
      </section>

      {/* RIGHT: ORDER SUMMARY (UNCHANGED) */}
      <section>
        <h2 className="text-2xl mb-6">Order Summary</h2>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr className="my-6" />

        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
        onClick={handlePayment}
        disabled={!selectedAddress}
        className={`
          w-full mt-8 py-4 tracking-widest text-white
          ${
            selectedAddress
              ? "bg-black hover:opacity-80 transition"
              : "bg-gray-300 cursor-not-allowed"
          }
        `}
      >
        PAY NOW
      </button>
      </section>
    </main>
  );
}