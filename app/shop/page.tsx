import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export default function Shop() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-32">

      {/* HEADER */}

      <div className="text-center mb-20">
        <p className="text-xs tracking-[0.35em] text-gray-400 mb-5">
          AVENOR COLLECTION
        </p>

        <h1
          className="
            text-5xl
            md:text-7xl
            font-light
            tracking-[0.08em]
            mb-8
          "
          style={{
            fontFamily: '"Cormorant Garamond", serif',
          }}
        >
          COLLECTION I
        </h1>

        <p className="max-w-xl mx-auto text-gray-500 leading-8">
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
            href={`/product/${p.id}`}
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

              <p className="text-[11px] tracking-[0.35em] uppercase text-gray-400">
                {p.type}
              </p>

              <h2
                className="
                  mt-4
                  text-5xl
                  md:text-6xl
                  font-light
                  tracking-[0.05em]
                  text-[#AF9685]
                  leading-none
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
                  text-sm
                  text-gray-500
                  leading-7
                  max-w-xs
                  mx-auto
                "
              >
                {p.description}
              </p>

              <p className="mt-6 text-xs tracking-[0.35em] text-gray-500">
                Made to Order • Individually Crafted
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
                DISCOVER THE COLLECTION
              </p>

            </div>
          </Link>
        ))}
      </section>

    </main>
  );
}
