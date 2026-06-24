"use client";

import { useCallback, useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { Product } from "@/lib/products";
import ProductGallery from "./ProductGallery";

export default function ProductClient({
  product,
}: {
  product: Product;
}) {
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] =
    useState<string | null>(null);

  // Scroll to top when product page opens
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

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
    <div className="max-w-7xl mx-auto -mt-2 px-4 lg:px-2">
      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-10">

        {/* LEFT: GALLERY */}
        <div className="lg:w-[62%]">
          <ProductGallery
            images={product.images}
            name={product.name}
          />
        </div>

        {/* RIGHT: DETAILS */}
        <div className="mt-8 lg:mt-6 lg:w-[38%]">
          <h1
            className="text-5xl font-light tracking-wide"
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            {product.name}
          </h1>

          <p className="mt-4 text-2xl">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="mt-2 text-xs tracking-[0.25em] text-gray-500">
            LIMITED TO {product.totalPieces} PIECES
          </p>

          <p className="mt-6 text-gray-600 leading-8">
            {product.description}
          </p>

          {/* SIZE SELECTOR */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xs tracking-widest text-gray-500">
                SIZE
              </p>

              {!selectedSize && (
                <span className="text-xs text-gray-400">
                  Select a size
                </span>
              )}
            </div>

            <div className="flex gap-4 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    text-sm
                    px-4
                    py-2
                    border
                    rounded-md
                    transition
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
              mt-8
              px-12
              py-4
              border
              transition
              font-medium
              tracking-[0.2em]
              ${
                selectedSize
                  ? "border-black hover:bg-black hover:text-white"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            ADD TO BAG
          </button>

          {/* DETAILS */}
          <div className="mt-12 border-t pt-8">
            <p className="text-xs tracking-[0.25em] text-gray-500 mb-4">
              DESIGN
            </p>

            <p className="text-sm text-gray-600 leading-8 whitespace-pre-line">
              {product.detailDescription}
            </p>
          </div>

          <div className="h-12" />
        </div>
      </div>
    </div>
  );
}
