import { products } from "@/lib/products";
import { notFound } from "next/navigation";
import ProductClient from "@/app/product-components/ProductClient";

interface Props {
  params: { id: string }; // must be string
}

export default function ShopProductPage({ params }: Props) {
  const { id } = params; // get the id from the route

  // Find the product by ID
  const product = products.find((p) => p.id === id);

  if (!product) return notFound(); // show 404 if not found

  return <ProductClient product={product} />;
}
