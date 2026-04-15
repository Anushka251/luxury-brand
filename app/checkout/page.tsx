"use client";

import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ✅ FIX: Tell TypeScript Razorpay exists
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // ✅ Load Razorpay script safely
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    const saved = localStorage.getItem("addresses");
    if (saved) setAddresses(JSON.parse(saved));
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddNew = () => {
    localStorage.setItem("checkout_redirect", "true");
    router.push("/account/address");
  };

  // ✅ FINAL PAYMENT FUNCTION
  const handlePayment = async () => {
    if (!selectedAddress) {
      alert("Select an address");
      return;
    }

    try {
      // 1. Create order
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const data = await res.json();

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      // 2. Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Avenor",
        description: "Order Payment",
        order_id: data.id,

        handler: function (response: any) {
          const order = {
            orderId: data.id,
            items: cart,
            total,
            address: selectedAddress,
            payment: response,
            createdAt: new Date(),
          };

          const prev = JSON.parse(localStorage.getItem("orders") || "[]");
          localStorage.setItem("orders", JSON.stringify([...prev, order]));

          alert("Payment successful!");
          router.push("/account/orders");
        },

        theme: {
          color: "#000000",
        },
      };

      // 3. Open Razorpay
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-20">
      
      {/* LEFT */}
      <section>
        <h2 className="text-xl mb-6 tracking-widest">
          SELECT ADDRESS
        </h2>

        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              onClick={() => setSelectedAddress(addr)}
              className={`border p-4 cursor-pointer ${
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

        <button
          onClick={handleAddNew}
          className="mt-6 text-sm underline"
        >
          + ADD NEW ADDRESS
        </button>
      </section>

      {/* RIGHT */}
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
            w-full mt-8 py-4 text-white
            ${
              selectedAddress
                ? "bg-black hover:opacity-80"
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