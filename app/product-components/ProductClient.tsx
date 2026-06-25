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
  }, [
    addToCart,
    product,
    selectedSize,
  ]);

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

        <div className="mt-8 lg:mt-4 lg:w-[38%] lg:sticky lg:top-28">

          <p className="text-xs tracking-[0.35em] text-gray-400 mb-4">
            AVENOR COLLECTION
          </p>

          <h1
            className="
              text-4xl
              md:text-5xl
              font-light
              leading-none
              tracking-[0.05em]
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            {product.name}
          </h1>

          <p className="mt-8 text-3xl font-light">
            ₹
            {product.price.toLocaleString(
              "en-IN"
            )}
          </p>

          <p className="mt-3 text-xs tracking-[0.3em] text-gray-500">
            LIMITED TO {product.totalPieces} PIECES
          </p>

          {/* DESCRIPTION */}

          <div className="mt-12 border-t pt-8">

            <p className="text-xs tracking-[0.3em] text-gray-400 mb-5">
              DESCRIPTION
            </p>

            <p className="text-gray-600 leading-8">
              {product.description}
            </p>

          </div>

          {/* SIZE */}

          <div className="mt-12">

            <p className="text-xs tracking-[0.3em] text-gray-400 mb-6">
              SELECT SIZE
            </p>

            <div className="flex gap-3 flex-wrap">

              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setSelectedSize(size)
                  }
                  className={`
                    w-14
                    h-14
                    border
                    transition
                    text-sm
                    tracking-wider
                    ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:border-black"
                    }
                  `}
                >
                  {size}
                </button>
              ))}

            </div>

            {!selectedSize && (
              <p className="mt-4 text-xs text-gray-400">
                Select your size.
              </p>
            )}

          </div>

          {/* ADD TO BAG */}

          <button
            onClick={addToBag}
            disabled={!selectedSize}
            className={`
              w-full
              mt-12
              py-5
              tracking-[0.25em]
              border
              transition
              ${
                selectedSize
                  ? "border-black hover:bg-black hover:text-white"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            ADD TO BAG
          </button>

          {/* DESIGN */}

          <div className="mt-14 border-t pt-8">

            <p className="text-xs tracking-[0.3em] text-gray-400 mb-5">
              DESIGN
            </p>

            <p className="text-sm text-gray-600 leading-8 whitespace-pre-line">
              {product.detailDescription}
            </p>

          </div>

          <div className="mt-12 text-xs text-gray-400 tracking-[0.2em]">
            QUIET LUXURY • LIMITED DROP
          </div>

          <div className="h-12" />

        </div>

      </div>
    </div>
  );
}
