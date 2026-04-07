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
  const hideLayout = pathname === "/" || pathname === "/home";

  return (
    <>
      {!hideLayout && <Navbar />}

      <main className={!hideLayout ? "pt-24" : ""}>
        {children}
      </main>

      {!hideLayout && <Footer />}
    </>
  );
}