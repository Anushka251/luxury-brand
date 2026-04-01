import { products } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductClient from "@/app/product-components/ProductClient";

interface Props {
  params: Promise<{ slug: string }>; // params is a promise
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params; // ✅ unwrap the promise

  const product = products.find((p) => p.id === slug); // exact match
  if (!product) return notFound();

  return <ProductClient product={product} />;
}