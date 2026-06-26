"use client";

import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CheckoutPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(
          `/api/address?email=${encodeURIComponent(session.user.email)}`
        );
        const data = await res.json();

        if (data.success) {
          setAddresses(data.addresses);
          if (data.addresses.length > 0) {
            setSelectedAddress(data.addresses[0]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadAddresses();
  }, [session]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleAddNew = () => {
    router.push("/account/address");
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      alert("Select an address");
      return;
    }

    try {
      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          cart,
          address: selectedAddress,
          total,
          customerEmail: session?.user?.email || "",
          customerName: selectedAddress.name || "",
          customerPhone: selectedAddress.phone || "",
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
        alert(data.error || data.message || "Unable to create payment session");
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
    <main className="max-w-7xl mx-auto px-8 md:px-12 py-24">
      {/* HEADER */}
      <div className="mb-20">
        <p className="text-xs tracking-[0.35em] text-gray-400 mb-4">
          AVENOR CLIENT
        </p>
        <h1 className="text-5xl font-light tracking-[0.12em]">
          CHECKOUT
        </h1>
        <p className="text-gray-500 mt-4">
          Review your order and complete your purchase.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_430px] gap-24">
        {/* ADDRESS */}
        <section>
          <p className="text-xs tracking-[0.25em] text-gray-400 mb-8">
            DELIVERY ADDRESS
          </p>

          <div className="space-y-6">
            {addresses.length === 0 && (
              <p className="text-gray-500">No saved addresses yet.</p>
            )}
            
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr)}
                className={`border-b pb-6 cursor-pointer transition ${
                  selectedAddress?.id === addr.id
                    ? "border-black"
                    : "border-gray-300"
                }`}
              >
                <p className="text-lg">{addr.name}</p>
                <p className="text-gray-500 mt-2">{addr.phone}</p>
                <p className="mt-4">{addr.address}</p>
                {addr.landmark && <p>{addr.landmark}</p>}
                <p className="mt-2 text-gray-500">
                  {addr.city}, {addr.state}
                </p>
                <p className="text-gray-500">{addr.pincode}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleAddNew}
            className="mt-10 text-xs tracking-[0.25em] text-gray-500 hover:text-black"
          >
            + ADD NEW ADDRESS
          </button>
        </section>

        {/* ORDER SUMMARY */}
        <section>
          <p className="text-xs tracking-[0.25em] text-gray-400 mb-8">
            ORDER SUMMARY
          </p>

          <div className="space-y-12">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-6 border-b pb-10">
                <div className="relative w-[120px] h-[160px] flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-2xl font-light">{item.name}</p>
                  
                  {item.size && (
                    <p className="text-gray-500 mt-3">Size {item.size}</p>
                  )}

                  <p className="text-xl font-light mt-6">
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>

                  <div className="flex items-center gap-4 mt-8">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity - 1)
                      }
                      className="w-9 h-9 border flex items-center justify-center"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.size, item.quantity + 1)
                      }
                      className="w-9 h-9 border flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="mt-6 text-xs tracking-[0.2em] text-gray-500 hover:text-black"
                  >
                    REMOVE
                  </button>
                </div>

                <div>
                  <p className="text-xl font-light">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-10 border-t">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-xs tracking-[0.25em] text-gray-400 mb-3">
                  ORDER TOTAL
                </p>
                <p className="text-4xl font-light">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedAddress}
              className={`w-full py-5 tracking-[0.3em] border transition ${
                selectedAddress
                  ? "border-black hover:bg-black hover:text-white"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              COMPLETE PURCHASE
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
