import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plum Aurum | Avenor",
  description:
    "Discover Plum Aurum, a refined Avenor dress combining muted plum tones, champagne shimmer, and delicate embellishment in a limited-edition design.",
  alternates: {
    canonical:
      "https://avenorcollection.com/reserve/plum-aurum",
  },
  openGraph: {
    title: "Plum Aurum | Avenor",
    description:
      "Plum Aurum — a refined Avenor dress combining muted plum tones, champagne shimmer, and delicate embellishment.",
    url: "https://avenorcollection.com/reserve/plum-aurum",
    siteName: "Avenor",
    type: "website",
    images: [
      {
        url: "https://avenorcollection.com/products/plum-aurum/1.jpg",
        alt: "Plum Aurum dress by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/plum-aurum/2.jpg",
        alt: "Plum Aurum dress by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/plum-aurum/3.jpg",
        alt: "Plum Aurum dress by Avenor",
      },
    ],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Plum Aurum",
  description:
    "Plum Aurum is a refined Avenor dress combining muted plum tones, champagne shimmer, and delicate embellishment, produced in limited quantities.",
  image: [
    "https://avenorcollection.com/products/plum-aurum/1.jpg",
    "https://avenorcollection.com/products/plum-aurum/2.jpg",
    "https://avenorcollection.com/products/plum-aurum/3.jpg",
  ],
  brand: {
    "@type": "Brand",
    name: "Avenor",
  },
  category: "Embellished Dress",
};

export default function PlumAurumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {children}
    </>
  );
}
