"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

export default function Navbar(): React.JSX.Element {
  const { cart } = useCart();

  const { data: session } =
    useSession();

  const [open, setOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const count = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  useEffect(() => {
    function handleClickOutside(
      event: PointerEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              bg-black/5
              z-40
            "
            onClick={() =>
              setOpen(false)
            }
          />
        )}
      </AnimatePresence>

      <motion.nav
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="
          fixed
          top-0
          left-0
          w-full
          px-6
          md:px-12
          py-4
          flex
          justify-between
          items-center
          bg-ivory
          border-b
          border-gray-100
          z-50
        "
      >
        {/* LOGO */}

        <Link
          href="/home"
          className="
            hover:opacity-70
            transition
          "
        >
          <span
            className="
              text-lg
              md:text-xl
              tracking-[0.38em]
              font-light
              text-charcoal
            "
          >
            AVENOR
          </span>
        </Link>

        {/* MENU */}

        <div
          ref={menuRef}
          className="relative"
        >
          <button
            onClick={() =>
              setOpen(!open)
            }
            aria-label="Menu"
            className="
              relative
              w-10
              h-10
              flex
              flex-col
              justify-center
              items-center
              gap-[5px]
            "
          >
            <span className="w-5 h-[1px] bg-black" />
            <span className="w-5 h-[1px] bg-black" />
            <span className="w-5 h-[1px] bg-black" />

            {count > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[16px]
                  h-[16px]
                  rounded-full
                  bg-black
                  text-white
                  text-[9px]
                  flex
                  items-center
                  justify-center
                "
              >
                {count}
              </span>
            )}
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{
                  duration: 0.2,
                }}
                className="
                  absolute
                  top-14
                  right-0
                  min-w-[220px]
                  bg-white
                  border
                  border-gray-200
                  shadow-xl
                  py-4
                  z-50
                "
              >
                <Link
                  href="/shop"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    block
                    px-8
                    py-4
                    text-xs
                    tracking-[0.25em]
                    hover:bg-gray-50
                    transition
                  "
                >
                  SHOP
                </Link>

                <Link
                  href="/bag"
                  onClick={() =>
                    setOpen(false)
                  }
                  className="
                    block
                    px-8
                    py-4
                    text-xs
                    tracking-[0.25em]
                    hover:bg-gray-50
                    transition
                  "
                >
                  BAG ({count})
                </Link>

                {session ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() =>
                        setOpen(false)
                      }
                      className="
                        block
                        px-8
                        py-4
                        text-xs
                        tracking-[0.25em]
                        hover:bg-gray-50
                        transition
                      "
                    >
                      ACCOUNT
                    </Link>

                    <button
                      onClick={() => {
                        setOpen(false);

                        signOut({
                          callbackUrl:
                            "/home",
                        });
                      }}
                      className="
                        block
                        w-full
                        text-left
                        px-8
                        py-4
                        text-xs
                        tracking-[0.25em]
                        hover:bg-gray-50
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
                      block
                      px-8
                      py-4
                      text-xs
                      tracking-[0.25em]
                      hover:bg-gray-50
                      transition
                    "
                  >
                    LOGIN
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </>
  );
}
