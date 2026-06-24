"use client";

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

export default function GalleryPage() {
  const [index, setIndex] = useState(0);

  const prev = () => {
    setIndex((i) =>
      i === 0 ? images.length - 1 : i - 1
    );
  };

  const next = () => {
    setIndex((i) =>
      i === images.length - 1 ? 0 : i + 1
    );
  };

  return (
    <main className="fixed inset-0 bg-white z-50">
      <button
        onClick={prev}
        className="
          absolute
          left-8
          top-1/2
          -translate-y-1/2
          text-6xl
          font-light
        "
      >
        ‹
      </button>

      <div className="h-screen flex items-center justify-center">
        <img
          src={images[index]}
          className="
            max-w-[90vw]
            max-h-[90vh]
            object-contain
          "
        />
      </div>

      <button
        onClick={next}
        className="
          absolute
          right-8
          top-1/2
          -translate-y-1/2
          text-6xl
          font-light
        "
      >
        ›
      </button>

      <p
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          tracking-[0.2em]
        "
      >
        {index + 1} / {images.length}
      </p>

      <a
        href="/product/crimson-rose"
        className="
          absolute
          top-8
          right-8
          text-4xl
        "
      >
        ×
      </a>
    </main>
  );
}
