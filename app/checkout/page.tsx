"use client";

import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CheckoutPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("addresses");

    if (saved) {
      setAddresses(JSON.parse(saved));
    }
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddNew = () => {
    localStorage.setItem("checkout_redirect", "true");
    router.push("/account/address");
  };

  const handlePayment = async () => {
  if (!selectedAddress) {
    alert("Select an address");
    return;
  }

  try {
    // Save checkout data for payment-success page
    localStorage.setItem(
      "pendingOrder",
      JSON.stringify({
        cart,
        address: selectedAddress,
        total,
      })
    );

    const res = await fetch("/api/cashfree", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: 1, // change back to total after testing
      }),
    });

    const data = await res.json();

    if (!data.payment_session_id) {
      console.error(data);

      alert(
        data.error ||
          data.message ||
          "Unable to create payment session"
      );

      return;
    }

    const cashfree = window.Cashfree({
      mode: "production",
    });

    await cashfree.checkout({
      paymentSessionId: data.payment_session_id,
      redirectTarget: "_self",
    });
  } catch (err) {
    console.error("Payment Error:", err);
    alert("Payment failed. Try again.");
  }
};

  return (
    <main className="max-w-6xl mx-auto px-8 py-24 grid md:grid-cols-2 gap-20">
      {/* ADDRESS SECTION */}
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

      {/* ORDER SUMMARY */}
      <section>
        <h2 className="text-2xl mb-6">
          Order Summary
        </h2>

        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex gap-4 border-b py-4"
          >
            {/* PRODUCT IMAGE */}
            <div className="relative w-20 h-28 flex-shrink-0">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* PRODUCT DETAILS */}
            <div className="flex-1">
              <p className="text-sm font-medium">
                {item.name}
              </p>

              {item.size && (
                <p className="text-xs text-gray-500 mt-1">
                  Size: {item.size}
                </p>
              )}

              <p className="text-sm mt-1">
                ₹{item.price.toLocaleString()}
              </p>

              {/* QUANTITY */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      item.quantity - 1
                    )
                  }
                  className="border px-2 py-1"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      item.size,
                      item.quantity + 1
                    )
                  }
                  className="border px-2 py-1"
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
              <button
                onClick={() =>
                  removeFromCart(
                    item.id,
                    item.size
                  )
                }
                className="text-xs underline mt-3"
              >
                Remove
              </button>
            </div>

            {/* ITEM TOTAL */}
            <div className="text-sm font-medium">
              ₹
              {(
                item.price * item.quantity
              ).toLocaleString()}
            </div>
          </div>
        ))}

        <hr className="my-6" />

        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span>
            ₹{total.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handlePayment}
          disabled={!selectedAddress}
          className={`w-full mt-8 py-4 text-white ${
            selectedAddress
              ? "bg-black hover:opacity-80"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          PAY NOW
        </button>
      </section>
    </main>
  );
}
