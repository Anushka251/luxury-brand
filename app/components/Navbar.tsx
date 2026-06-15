"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { cart } = useCart();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-6 flex justify-between items-center text-sm tracking-widest bg-ivory z-50">
        {/* LOGO */}
        <Link
          href="/home"
          className="hover:opacity-80 transition"
        >
          <span className="text-charcoal text-lg tracking-[0.35em] font-light">
            AVENOR
          </span>
        </Link>

        {/* MENU */}
        <div
          ref={menuRef}
          className="relative flex items-center"
        >
          {/* Hamburger */}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() =>
              setOpen((prev) => !prev)
            }
            className="
              relative
              flex flex-col justify-center items-center
              w-11 h-11
              rounded-md
              touch-manipulation
              select-none
              active:scale-95
              transition-transform
            "
          >
            <div className="w-5 h-[1.5px] bg-black mb-1"></div>
            <div className="w-5 h-[1.5px] bg-black mb-1"></div>
            <div className="w-5 h-[1.5px] bg-black"></div>

            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-white text-[10px] flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div
              className="
                absolute
                top-14
                right-0
                z-50
                bg-white
                border
                shadow-xl
                p-4
                flex
                flex-col
                gap-1
                min-w-[180px]
                text-xs
                tracking-widest
                animate-in
                fade-in
                zoom-in-95
                duration-150
              "
            >
              {/* SHOP */}
              <Link
                href="/shop"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  w-full
                  px-3
                  py-3
                  rounded
                  hover:bg-gray-100
                  active:bg-gray-200
                  transition
                "
              >
                SHOP
              </Link>

              {session ? (
                <>
                  {/* ACCOUNT */}
                  <Link
                    href="/account"
                    onClick={() =>
                      setOpen(false)
                    }
                    className="
                      w-full
                      px-3
                      py-3
                      rounded
                      hover:bg-gray-100
                      active:bg-gray-200
                      transition
                    "
                  >
                    ACCOUNT
                  </Link>

                  {/* LOGOUT */}
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);

                      signOut({
                        callbackUrl: "/home",
                      });
                    }}
                    className="
                      w-full
                      text-left
                      px-3
                      py-3
                      rounded
                      hover:bg-gray-100
                      active:bg-gray-200
                      transition
                    "
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    w-full
                    px-3
                    py-3
                    rounded
                    hover:bg-gray-100
                    active:bg-gray-200
                    transition
                  "
                >
                  LOGIN
                </Link>
              )}

              {/* BAG */}
              <Link
                href="/bag"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  w-full
                  px-3
                  py-3
                  rounded
                  hover:bg-gray-100
                  active:bg-gray-200
                  transition
                "
              >
                BAG ({count})
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
