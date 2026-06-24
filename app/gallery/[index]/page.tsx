import GalleryClient from "./GalleryClient";

const images = [
  "/products/crimson-rose/1.jpg",
  "/products/crimson-rose/2.jpg",
  "/products/crimson-rose/3-v2.jpg",
  "/products/crimson-rose/4.jpg",
  "/products/crimson-rose/5.jpg",
  "/products/crimson-rose/6.jpg",
  "/products/crimson-rose/7.jpg",
  "/products/crimson-rose/8.jpg",
];

export default async function Page({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = await params;

  return (
    <GalleryClient
      images={images}
      initialIndex={Number(index)}
    />
  );
}
