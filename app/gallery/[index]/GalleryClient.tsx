"use client";

import { useState } from "react";
import Link from "next/link";

export default function GalleryClient({
  images,
  initialIndex,
}: {
  images: string[];
  initialIndex: number;
}) {
  const [index, setIndex] = useState(
    Math.min(
      Math.max(initialIndex, 0),
      images.length - 1
    )
  );

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
    <main className="fixed inset-0 bg-ivory z-[999]">
      <Link
        href="/product/crimson-rose"
        className="
          absolute
          top-6
          right-8
          text-4xl
          text-gray-500
          hover:text-black
          z-20
        "
      >
        ×
      </Link>

      <button
        onClick={prev}
        className="
          absolute
          left-8
          top-1/2
          -translate-y-1/2
          text-6xl
          text-gray-500
          hover:text-black
          z-20
        "
      >
        ‹
      </button>

      <div className="h-screen flex items-center justify-center px-20">
        <img
          src={images[index]}
          alt=""
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
          text-gray-500
          hover:text-black
          z-20
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
          text-sm
          tracking-[0.2em]
          text-gray-500
        "
      >
        {index + 1} / {images.length}
      </p>
    </main>
  );
}
