"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="fixed top-0 w-full px-12 py-6 flex justify-between items-center text-sm tracking-widest bg-ivory z-50">
      
      {/* LOGO */}
      <Link href="/home" className="hover:opacity-80 transition">
        <span className="text-charcoal text-lg tracking-[0.35em] font-light">
          AVENOR
        </span>
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* HAMBURGER */}
        <button
          onClick={() => setOpen(!open)}
          className="space-y-1"
        >
          <div className="w-5 h-[1px] bg-black"></div>
          <div className="w-5 h-[1px] bg-black"></div>
          <div className="w-5 h-[1px] bg-black"></div>
        </button>

      </div>

      {/* DROPDOWN MENU */}
      {open && (
        <div className="absolute top-20 right-10 bg-white border p-6 flex flex-col gap-4 text-xs tracking-widest shadow-lg items-start min-w-[160px]">
          
          {/* USER / LOGIN */}
          {session ? (
            <>
              <span className="text-gray-400">
                {session.user?.name?.split(" ")[0]}
              </span>

              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="hover:opacity-70 transition"
              >
                ACCOUNT
              </Link>

              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: "/home" });
                }}
                className="text-left w-full hover:opacity-70 transition"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link
              href="/auth"   // ✅ UPDATED
              onClick={() => setOpen(false)}
              className="hover:opacity-70 transition"
            >
              LOGIN
            </Link>
          )}

          {/* NAV LINKS */}
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="hover:opacity-70 transition"
          >
            SHOP
          </Link>

          <Link
            href="/bag"
            onClick={() => setOpen(false)}
            className="hover:opacity-70 transition"
          >
            BAG ({count})
          </Link>

        </div>
      )}
    </nav>
  );
}