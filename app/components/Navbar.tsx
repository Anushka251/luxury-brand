"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function Navbar() {
  const { cart } = useCart();

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

      {/* RIGHT LINKS */}
      <div className="flex gap-10 items-center">
        
        <Link href="/shop" className="hover:opacity-70 transition">
          SHOP
        </Link>

        {/* BAG */}
        <Link href="/bag" className="relative hover:opacity-70 transition">
          BAG
          {count > 0 && (
            <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </Link>

      </div>
    </nav>
  );
}