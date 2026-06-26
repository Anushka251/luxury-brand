"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AddressPage() {
  const { data: session } = useSession();
  
  const [addresses, setAddresses] =
    useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
  const loadAddresses = async () => {
    if (!session?.user?.email) return;

    try {
      const res = await fetch(
        `/api/address?email=${encodeURIComponent(
          session.user.email
        )}`
      );

      const data = await res.json();

      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadAddresses();
}, [session]);

  const isValid =
    form.name &&
    form.phone.length === 10 &&
    form.address &&
    form.city &&
    form.state &&
    form.pincode.length === 6;

  const addAddress = async () => {
  if (!isValid || !session?.user?.email) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    const res = await fetch("/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session.user.email,
        ...form,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setAddresses(data.addresses);

      setForm({
        name: "",
        phone: "",
        address: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
      });
    } else {
      alert(data.message || "Failed to save address.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

    const newAddress = {
      id: Date.now().toString(),
      ...form,
    };

    const updated = [
      ...addresses,
      newAddress,
    ];

    setAddresses(updated);

    localStorage.setItem(
      "addresses",
      JSON.stringify(updated)
    );

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

  const deleteAddress = async (id: string) => {
  try {
    const res = await fetch("/api/address", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (data.success) {
      setAddresses(data.addresses);
    } else {
      alert(data.message || "Failed to delete address.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }
};

  return (
    <main className="max-w-5xl mx-auto px-8 md:px-12 py-24">

      <div className="mb-16">
        <p className="text-xs tracking-[0.35em] text-gray-400 mb-4">
          AVENOR CLIENT
        </p>

        <h1 className="text-5xl font-light tracking-[0.12em]">
          ADDRESS BOOK
        </h1>

        <p className="text-gray-500 mt-4">
          Manage your delivery locations.
        </p>
      </div>

      {/* FORM */}

      <div className="space-y-8 mb-20">

        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          className="
            w-full
            border-b
            border-gray-300
            py-4
            text-lg
            bg-transparent
            focus:outline-none
            focus:border-black
          "
        />

        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone:
                e.target.value.replace(
                  /\D/g,
                  ""
                ),
            })
          }
          className="
            w-full
            border-b
            border-gray-300
            py-4
            text-lg
            bg-transparent
            focus:outline-none
            focus:border-black
          "
        />

        <textarea
          placeholder="Address"
          rows={3}
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address:
                e.target.value,
            })
          }
          className="
            w-full
            border-b
            border-gray-300
            py-4
            text-lg
            bg-transparent
            resize-none
            focus:outline-none
            focus:border-black
          "
        />

        <input
          placeholder="Landmark (Optional)"
          value={form.landmark}
          onChange={(e) =>
            setForm({
              ...form,
              landmark:
                e.target.value,
            })
          }
          className="
            w-full
            border-b
            border-gray-300
            py-4
            text-lg
            bg-transparent
            focus:outline-none
            focus:border-black
          "
        />

        <div className="grid md:grid-cols-2 gap-8">

          <input
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm({
                ...form,
                city:
                  e.target.value,
              })
            }
            className="
              border-b
              border-gray-300
              py-4
              text-lg
              bg-transparent
              focus:outline-none
              focus:border-black
            "
          />

          <input
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm({
                ...form,
                state:
                  e.target.value,
              })
            }
            className="
              border-b
              border-gray-300
              py-4
              text-lg
              bg-transparent
              focus:outline-none
              focus:border-black
            "
          />

        </div>

        <input
          placeholder="Postal Code"
          value={form.pincode}
          onChange={(e) =>
            setForm({
              ...form,
              pincode:
                e.target.value.replace(
                  /\D/g,
                  ""
                ),
            })
          }
          className="
            w-full
            border-b
            border-gray-300
            py-4
            text-lg
            bg-transparent
            focus:outline-none
            focus:border-black
          "
        />

        <button
          onClick={addAddress}
          disabled={!isValid}
          className="
            mt-6
            px-10
            py-4
            border
            border-black
            tracking-[0.2em]
            hover:bg-black
            hover:text-white
            transition
            disabled:opacity-40
          "
        >
          SAVE ADDRESS
        </button>

      </div>

      {/* SAVED ADDRESSES */}

      <div>

        <p className="text-xs tracking-[0.3em] text-gray-400 mb-10">
          SAVED ADDRESSES
        </p>

        {addresses.length === 0 && (
          <p className="text-gray-500">
            No saved addresses.
          </p>
        )}

        <div className="space-y-10">

          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="
                border-b
                pb-8
                flex
                justify-between
                items-start
              "
            >
              <div className="space-y-2">

                <p className="text-lg">
                  {addr.name}
                </p>

                <p className="text-gray-500">
                  {addr.phone}
                </p>

                <p>
                  {addr.address}
                </p>

                {addr.landmark && (
                  <p>
                    {addr.landmark}
                  </p>
                )}

                <p>
                  {addr.city},{" "}
                  {addr.state} —{" "}
                  {addr.pincode}
                </p>

              </div>

              <button
                onClick={() =>
                  deleteAddress(
                    addr.id
                  )
                }
                className="
                  text-xs
                  tracking-[0.2em]
                  text-gray-500
                  hover:text-black
                "
              >
                REMOVE
              </button>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}
