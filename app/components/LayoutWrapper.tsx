"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  // Hide only the navbar
  const hideNavbar =
    pathname === "/" || pathname === "/home";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <main className={!hideNavbar ? "pt-14" : ""}>
        {children}
      </main>

      <Footer />
    </>
  );
}
