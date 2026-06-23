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
    // Prevent browser from restoring old scroll position
    window.history.scrollRestoration = "manual";

    // Always start pages from the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  // Hide navbar on landing pages
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
