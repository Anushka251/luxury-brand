"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";

interface Props {
  product: Product;
  initialIndex: number;
}

export default function GalleryClient({
  product,
  initialIndex,
}: Props) {
  const [index, setIndex] = useState(initialIndex);

  const prev = () => {
    setIndex((i) =>
      i === 0 ? product.images.length - 1 : i - 1
    );
  };

  const next = () => {
    setIndex((i) =>
      i === product.images.length - 1 ? 0 : i + 1
    );
  };

  return (
    <main className="fixed inset-0 bg-white z-50">
      {/* Previous */}
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

      {/* Image */}
      <div className="h-screen flex items-center justify-center">
        <img
          src={product.images[index]}
          alt={`${product.name} ${index + 1}`}
          className="
            max-w-[90vw]
            max-h-[90vh]
            object-contain
          "
        />
      </div>

      {/* Next */}
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

      {/* Counter */}
      <p
        className="
          absolute
          bottom-8
          left-1/2
          -translate-x-1/2
          tracking-[0.2em]
        "
      >
        {index + 1} / {product.images.length}
      </p>

      {/* Close */}
      <Link
        href={`/product/${product.id}`}
        className="
          absolute
          top-8
          right-8
          text-4xl
        "
      >
        ×
      </Link>
    </main>
  );
}
