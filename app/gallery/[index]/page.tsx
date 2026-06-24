"use client";

import Link from "next/link";
import { useState } from "react";

const images = [
  "/products/crimson-rose/1.jpg",
  "/products/crimson-rose/2.jpg",
  "/products/crimson-rose/3-v2.jpg",
  "/products/crimson-rose/4.jpg",
  "/products/crimson-rose/5.jpg",
  "/products/crimson-rose/6.jpg",
  "/products/crimson-rose/7.jpg",
  "/products/crimson-rose/8.jpg",
];

export default function GalleryPage({
  params,
}: {
  params: { index: string };
}) {
  const initialIndex = Math.min(
    Math.max(Number(params.index) || 0, 0),
    images.length - 1
  );

  const [index, setIndex] =
    useState(initialIndex);

  const prev = () => {
    setIndex((i) =>
      i === 0
        ? images.length - 1
        : i - 1
    );
  };

  const next = () => {
    setIndex((i) =>
      i === images.length - 1
        ? 0
        : i + 1
    );
  };

  return (
    <main className="fixed inset-0 z-[999] bg-ivory">
      {/* CLOSE */}
      <Link
        href="/product/crimson-rose"
        className="
          absolute
          top-6
          right-8
          z-20
          text-4xl
          font-light
          text-gray-500
          hover:text-black
          transition
        "
      >
        ×
      </Link>

      {/* LEFT ARROW */}
      <button
        onClick={prev}
        className="
          absolute
          left-6
          md:left-10
          top-1/2
          -translate-y-1/2
          z-20
          text-6xl
          font-light
          text-gray-500
          hover:text-black
          transition
        "
      >
        ‹
      </button>

      {/* IMAGE */}
      <div className="h-screen flex items-center justify-center px-20">
        <img
          src={images[index]}
          alt={`Image ${index + 1}`}
          className="
            max-w-[90vw]
            max-h-[90vh]
            object-contain
            select-none
          "
        />
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={next}
        className="
          absolute
          right-6
          md:right-10
          top-1/2
          -translate-y-1/2
          z-20
          text-6xl
          font-light
          text-gray-500
          hover:text-black
          transition
        "
      >
        ›
      </button>

      {/* COUNTER */}
      <div
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
        "
      >
        <p
          className="
            text-sm
            text-gray-500
            tracking-[0.2em]
            font-light
            select-none
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          {index + 1} / {images.length}
        </p>
      </div>
    </main>
  );
}
