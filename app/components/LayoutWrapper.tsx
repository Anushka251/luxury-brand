"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide only the navbar
  const hideNavbar =
    pathname === "/" || pathname === "/home";

  // Smaller spacing for shop page
  const isShop = pathname === "/shop";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main
        className={
          !hideNavbar
            ? isShop
              ? "pt-14"
              : "pt-24"
            : ""
        }
      >
        {children}
      </main>

      <Footer />
    </>
  );
}
