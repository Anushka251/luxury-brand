import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crimson Rose | Avenor",
  description:
    "Discover Crimson Rose, a lace-up co-ord set by Avenor, crafted in luminous dual-tone satin and produced in strictly limited quantities.",
  alternates: {
    canonical:
      "https://avenorcollection.com/reserve/crimson-rose",
  },
  openGraph: {
    title: "Crimson Rose | Avenor",
    description:
      "Crimson Rose — a lace-up co-ord set by Avenor, crafted in luminous dual-tone satin.",
    url: "https://avenorcollection.com/reserve/crimson-rose",
    siteName: "Avenor",
    type: "website",
    images: [
      {
        url: "https://avenorcollection.com/products/crimson-rose/1.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/crimson-rose/2.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/crimson-rose/3-v2.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/crimson-rose/4.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/crimson-rose/5.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/crimson-rose/6.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/crimson-rose/7.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/crimson-rose/8.jpg",
        alt: "Crimson Rose lace-up co-ord set by Avenor",
      },
    ],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Crimson Rose",
  description:
    "Crimson Rose is a lace-up co-ord set by Avenor, crafted in luminous dual-tone satin and produced in strictly limited quantities.",
  image: [
    "https://avenorcollection.com/products/crimson-rose/1.jpg",
    "https://avenorcollection.com/products/crimson-rose/2.jpg",
    "https://avenorcollection.com/products/crimson-rose/3-v2.jpg",
    "https://avenorcollection.com/products/crimson-rose/4.jpg",
    "https://avenorcollection.com/products/crimson-rose/5.jpg",
    "https://avenorcollection.com/products/crimson-rose/6.jpg",
    "https://avenorcollection.com/products/crimson-rose/7.jpg",
    "https://avenorcollection.com/products/crimson-rose/8.jpg",
  ],
  brand: {
    "@type": "Brand",
    name: "Avenor",
  },
  category: "Lace-up Co-ord Set",
  offers: {
    "@type": "Offer",
    url: "https://avenorcollection.com/reserve/crimson-rose",
    priceCurrency: "INR",
    price: 8600,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
};

export default function CrimsonRoseLayout({
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
