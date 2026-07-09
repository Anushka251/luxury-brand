import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export default function Shop() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32">
      {/* HEADER */}

      <div className="mb-20 text-center">
        <p className="mb-5 text-xs tracking-[0.35em] text-gray-400">
          AVENOR COLLECTION
        </p>

        <h1
          className="
            mb-8
            text-5xl
            md:text-7xl
            font-light
            tracking-[0.08em]
          "
          style={{
            fontFamily: '"Cormorant Garamond", serif',
          }}
        >
          COLLECTION I
        </h1>

        <p className="max-w-xl mx-auto leading-8 text-gray-500">
          A study in silhouette, craftsmanship, and quiet luxury.
          Produced in limited quantities.
        </p>
      </div>

      {/* PRODUCTS */}

      <section
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-y-24
          gap-x-20
          justify-items-center
        "
      >
        {products.map((p) => (
          <Link
            key={p.id}
            href={
              p.id === "crimson-rose"
                ? "/reserve/crimson-rose"
                : "/reserve/ivory-blush"
            }
            scroll={true}
            className="group w-full max-w-md"
          >
            {/* IMAGE */}

            <div className="relative aspect-[3/4] overflow-hidden bg-[#f8f8f8]">
              <Image
                src={p.coverImage}
                alt={p.name}
                fill
                priority
                className="
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-[1.02]
                "
              />
            </div>

            {/* DETAILS */}

            <div className="pt-10 text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] text-gray-400">
                {p.type}
              </p>

              <h2
                className="
                  mt-4
                  text-5xl
                  md:text-6xl
                  font-light
                  tracking-[0.05em]
                  leading-none
                  text-[#AF9685]
                "
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                }}
              >
                {p.name}
              </h2>

              <p
                className="
                  mt-5
                  mx-auto
                  max-w-xs
                  text-sm
                  leading-7
                  text-gray-500
                "
              >
                {p.description}
              </p>

              <p
                className="
                  mt-8
                  text-sm
                  tracking-[0.35em]
                  text-gray-400
                  transition-colors
                  duration-300
                  group-hover:text-black
                "
              >
                {p.id === "ivory-blush"
                  ? "UPCOMING COLLECTION"
                  : "DISCOVER THE COLLECTION"}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* FOOTER */}

      <div className="mt-32 border-t pt-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.45em] text-gray-400">
          MADE TO ORDER • INDIVIDUALLY CRAFTED • LIMITED QUANTITIES
        </p>
      </div>
    </main>
  );
}
