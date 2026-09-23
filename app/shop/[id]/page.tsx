import { products } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductClient from "@/app/product-components/ProductClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ShopProductPage({ params }: Props) {
  const { id } = await params;

  // Find the product by ID
  const product = products.find((p) => p.id === id);

  if (!product) return notFound();

  return <ProductClient product={product} />;
}
