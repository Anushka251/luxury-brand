export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  detailDescription: string; // 👈 NEW
  coverImage: string;
  images: string[];
  totalPieces: number;
};

export const products: Product[] = [
  {
    id: "crimson-rose",
    name: "Crimson Rose",
    price: 30000,
    description: "A corset silhouette crafted in dual tone satin.",
    
    detailDescription: `
Crafted in a dual-tone satin finish that shifts from vibrant red to muted purple under changing light. Crimson Rose features a corset silhouette designed to contour the form with precision.

Each garment is made in-house in limited quantities, ensuring attention to detail and individuality. The piece is designed to balance softness with structure, creating a refined yet striking presence.
    `,

    coverImage: "/products/ivory-coat/cover.jpg",
    images: [
      "/products/ivory-coat/1.jpg",
      "/products/ivory-coat/2.jpg",
      "/products/ivory-coat/3.jpg",
      "/products/ivory-coat/4.jpg",
    ],
    totalPieces: 12,
  },
];