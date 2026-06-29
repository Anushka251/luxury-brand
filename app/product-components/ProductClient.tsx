"use client";

import Link from "next/link";
import {
  useCallback,
  useState,
  useEffect,
} from "react";
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

  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
  ];

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
    <div className="max-w-7xl mx-auto px-4 lg:px-2">
      {/* PRODUCT SECTION */}

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12">
        {/* GALLERY */}

        <div className="lg:w-[62%]">
          <ProductGallery
            images={product.images}
            name={product.name}
          />
        </div>

        {/* DETAILS */}

        <div className="mt-8 lg:mt-4 lg:w-[38%] lg:sticky lg:top-28">
          <p className="text-xs tracking-[0.35em] text-gray-400 mb-4">
            AVENOR COLLECTION
          </p>

          <h1
            className="
              text-5xl
              md:text-6xl
              font-light
              leading-none
              tracking-[0.04em]
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
            Made to Order • Individually Crafted
          </p>

          {/* DESCRIPTION */}

          <div className="mt-12 border-t pt-8">
            <p className="text-xs tracking-[0.3em] text-gray-400 mb-5">
              DESCRIPTION
            </p>

            <p className="text-gray-600 leading-9">
              {product.description}
            </p>
          </div>

          {/* SIZE */}

          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs tracking-[0.3em] text-gray-400">
                SELECT SIZE
              </p>

              <Link
                href="/size-chart"
                className="
                  text-[11px]
                  tracking-[0.25em]
                  uppercase
                  text-gray-400
                  hover:text-black
                  transition
                "
              >
                Size Chart
              </Link>
            </div>

            <div className="flex gap-3 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() =>
                    setSelectedSize(
                      size
                    )
                  }
                  className={`
                    w-14
                    h-14
                    border
                    transition-all
                    duration-300
                    text-sm
                    tracking-wider
                    ${
                      selectedSize ===
                      size
                        ? "bg-black text-white border-black"
                        : "border-gray-300 hover:border-black hover:bg-gray-50"
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

          {/* BOOK YOUR PIECE */}

          <button
            onClick={addToBag}
            disabled={!selectedSize}
            className={`
              w-full
              mt-12
              py-5
              tracking-[0.25em]
              border
              transition-all
              duration-300
              ${
                selectedSize
                  ? "border-black hover:bg-black hover:text-white"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            BOOK YOUR PIECE
          </button>
        </div>
      </div>

      {/* DESIGN SECTION */}

      <div className="mt-28 border-t pt-20 pb-28">
        <p className="text-xs tracking-[0.35em] text-gray-400 text-center mb-6">
          DESIGN
        </p>

        <h2
          className="
            text-5xl
            md:text-7xl
            font-light
            text-center
            mb-12
          "
          style={{
            fontFamily:
              '"Cormorant Garamond", serif',
          }}
        >
          Crafted with intention.
        </h2>

        <div className="max-w-xl mx-auto">
          <p
            className="
              text-lg
              text-gray-600
              leading-10
              whitespace-pre-line
              text-center
            "
          >
            {product.detailDescription}
          </p>

          <div className="mt-20 text-center">
            <p className="text-[11px] tracking-[0.45em] uppercase text-gray-400">
              QUIET LUXURY • CONTEMPORARY FASHION • LIMITED DROP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
