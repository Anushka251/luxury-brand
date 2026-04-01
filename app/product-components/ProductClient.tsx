"use client";

import { useCallback, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/lib/products";
import ProductGallery from "./ProductGallery";

export default function ProductClient({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const sizes = ["XS", "S", "M", "L", "XL"];

  const addToBag = useCallback(() => {
    if (!selectedSize) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.coverImage,
      quantity: 1,
      slug: product.id,
      size: selectedSize,
    });
  }, [addToCart, product, selectedSize]);

  return (
    <div className="max-w-4xl mx-auto mt-16 px-6">
      <ProductGallery images={product.images} name={product.name} />

      <div className="mt-8">
        <h1 className="text-4xl font-light tracking-wide">
          {product.name}
        </h1>

        <p className="mt-4 text-xl">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-xs tracking-widest text-gray-500">
          LIMITED TO {product.totalPieces} PIECES
        </p>

        <p className="mt-6 text-muted">{product.description}</p>

        {/* SIZE SELECTOR */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs tracking-widest text-gray-500">
              SIZE
            </p>

            {!selectedSize && (
              <span className="text-xs text-gray-400">
                Select a size
              </span>
            )}
          </div>

          <div className="flex gap-4">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`
                  text-sm px-4 py-2 border rounded-md transition
                  ${
                    selectedSize === size
                      ? "border-black text-black"
                      : "border-gray-300 text-gray-500 hover:border-black"
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ADD TO BAG */}
        <button
          onClick={addToBag}
          disabled={!selectedSize}
          className={`
            mt-8 px-12 py-4 border transition font-medium tracking-widest
            ${
              selectedSize
                ? "border-black hover:bg-black hover:text-white"
                : "border-gray-300 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          ADD TO BAG
        </button>

        {/* 🔥 NEW DETAILS SECTION */}
        <div className="mt-12 border-t pt-8">
          <p className="text-xs tracking-widest text-gray-500 mb-4">
            DESIGN
          </p>

          <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">
            {product.detailDescription}
          </p>
        </div>

        <div className="mt-8" />
      </div>
    </div>
  );
}