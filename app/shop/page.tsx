import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export default function Shop() {
  return (
    <main className="px-6 pt-10 pb-20 max-w-7xl mx-auto">
      <section className="flex justify-center items-center">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="group w-full max-w-md"
          >
            {/* PRODUCT IMAGE */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
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

            {/* PRODUCT DETAILS */}
            <div className="pt-6 text-center">
              <h2
                className="
                  text-2xl
                  tracking-[0.2em]
                  text-[#AF9685]
                  font-light
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                {p.name.toUpperCase()}
              </h2>

              <p className="mt-3 text-sm tracking-[0.18em] text-bronze">
                DISCOVER THE COLLECTION
              </p>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
