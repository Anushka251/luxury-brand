import { products } from "@/lib/products";
import { notFound } from "next/navigation";
import GalleryClient from "./GalleryClient";

interface Props {
  params: Promise<{
    slug: string;
    index: string;
  }>;
}

export default async function GalleryPage({
  params,
}: Props) {
  const { slug, index } = await params;

  const product = products.find(
    (p) => p.id === slug
  );

  if (!product) {
    return notFound();
  }

  return (
    <GalleryClient
      product={product}
      initialIndex={Number(index)}
    />
  );
}
