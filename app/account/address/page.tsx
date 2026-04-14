"use client";

import { useState, useEffect } from "react";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  // LOAD
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("addresses");
      if (saved) setAddresses(JSON.parse(saved));
    };

    load();
    window.addEventListener("focus", load);

    return () => window.removeEventListener("focus", load);
  }, []);

  // VALIDATION
  const isValid =
    form.name &&
    form.phone.length === 10 &&
    form.address &&
    form.city &&
    form.state &&
    form.pincode.length === 6;

  // ADD ADDRESS
  const addAddress = () => {
    if (!isValid) {
      alert("Please fill all required fields correctly");
      return;
    }

    const newAddress = {
      id: Date.now().toString(),
      ...form,
    };

    const updated = [...addresses, newAddress];

    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));

    setForm({
      name: "",
      phone: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    });
  };

  const deleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    localStorage.setItem("addresses", JSON.stringify(updated));
  };

  return (
    <main className="px-12 py-32 max-w-4xl mx-auto">
      <h1 className="text-3xl mb-10 tracking-widest">ADDRESS</h1>

      {/* FORM */}
      <div className="space-y-4 mb-12">
        
        <input
          className="w-full border p-3"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full border p-3"
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
        />

        <textarea
          className="w-full border p-3"
          placeholder="Address Line"
          value={form.address}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <input
          className="w-full border p-3"
          placeholder="Landmark (Optional)"
          value={form.landmark}
          onChange={(e) =>
            setForm({ ...form, landmark: e.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-3"
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({ ...form, city: e.target.value })
            }
          />

          <input
            className="border p-3"
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm({ ...form, state: e.target.value })
            }
          />
        </div>

        <input
          className="w-full border p-3"
          placeholder="Postal Code"
          value={form.pincode}
          onChange={(e) =>
            setForm({
              ...form,
              pincode: e.target.value.replace(/\D/g, ""),
            })
          }
        />

        <button
          onClick={addAddress}
          className="bg-black text-white px-6 py-3 tracking-widest disabled:opacity-50"
          disabled={!isValid}
        >
          SAVE ADDRESS
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {addresses.length === 0 && (
          <p className="text-sm text-gray-500">
            No saved addresses
          </p>
        )}

        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="border p-4 flex justify-between"
          >
            <div className="text-sm">
              <p className="font-medium">{addr.name}</p>
              <p>{addr.phone}</p>
              <p>{addr.address}</p>
              {addr.landmark && <p>{addr.landmark}</p>}
              <p>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
            </div>

            <button
              onClick={() => deleteAddress(addr.id)}
              className="text-xs underline"
            >
              REMOVE
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}