import { products } from "@/lib/products";
import Link from "next/link";
import Image from "next/image";

export default function Shop() {
  return (
    <main className="px-12 py-24 max-w-7xl mx-auto">
      <div className="mb-24">
        <h1 className="text-4xl tracking-wide font-light">SHOP</h1>
        <p className="text-muted mt-4 max-w-md">
          A curated selection of timeless pieces designed with intention.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-32">
        {products.map((p) => (
          <Link key={p.id} href={`/product/${p.id}`} className="group cursor-pointer">
            <div className="relative h-[520px] mb-8 overflow-hidden rounded-lg">
              <Image
                src={p.coverImage}
                alt={p.name}
                fill
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h2 className="text-lg tracking-wide">{p.name}</h2>
            <p className="text-muted mt-2 tracking-wide">₹{p.price.toLocaleString()}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
