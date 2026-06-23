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
