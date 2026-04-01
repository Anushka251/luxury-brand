"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);

  const [shipping, setShipping] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isFormValid =
    shipping.name &&
    shipping.email &&
    shipping.phone &&
    shipping.address;

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!isFormValid) {
      alert("Please fill all shipping details");
      return;
    }

    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay failed to load");
      setLoading(false);
      return;
    }

    const orderRes = await fetch("/api/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        shipping,
      }),
    });

    const order = await orderRes.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
      amount: order.amount,
      currency: "INR",
      name: "ANAYA",
      description: "Order Payment",
      order_id: order.id,

      prefill: {
        name: shipping.name,
        email: shipping.email,
        contact: shipping.phone,
      },

      handler: async function (response: any) {
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            shipping,
          }),
        });

        const data = await verifyRes.json();

        if (data.success) {
          clearCart();
          setPlaced(true);
        } else {
          alert("Payment verification failed");
        }
      },

      theme: {
        color: "#000000",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    setLoading(false);
  };

  if (placed) {
    return (
      <main className="py-32 text-center">
        <h1 className="text-4xl font-light">Payment Successful</h1>
        <p className="mt-4">Thank you for shopping with ANAYA</p>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="py-32 text-center">
        <h1 className="text-3xl">Your bag is empty</h1>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-20">
      <section>
        <h2 className="text-2xl mb-6">Shipping Details</h2>

        <input
          className="w-full border p-3 mb-3"
          placeholder="Name"
          value={shipping.name}
          onChange={(e) =>
            setShipping({ ...shipping, name: e.target.value })
          }
        />

        <input
          className="w-full border p-3 mb-3"
          placeholder="Email"
          type="email"
          value={shipping.email}
          onChange={(e) =>
            setShipping({ ...shipping, email: e.target.value })
          }
        />

        <input
          className="w-full border p-3 mb-3"
          placeholder="Phone"
          value={shipping.phone}
          onChange={(e) =>
            setShipping({ ...shipping, phone: e.target.value })
          }
        />

        <input
          className="w-full border p-3 mb-3"
          placeholder="Address"
          value={shipping.address}
          onChange={(e) =>
            setShipping({ ...shipping, address: e.target.value })
          }
        />
      </section>

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
          disabled={loading || !isFormValid}
          className={`
            w-full py-4 mt-8 bg-black text-white
            ${(loading || !isFormValid) &&
              "opacity-50 cursor-not-allowed"}
          `}
        >
          {loading ? "PROCESSING..." : "PAY NOW"}
        </button>
      </section>
    </main>
  );
}
