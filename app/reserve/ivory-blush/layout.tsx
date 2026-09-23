import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ivory Blush | Avenor",
  description:
    "Discover Ivory Blush, a dusty gold floral embroidered gown by Avenor, crafted with intricate embroidery and produced in limited quantities.",
  alternates: {
    canonical:
      "https://avenorcollection.com/reserve/ivory-blush",
  },
  openGraph: {
    title: "Ivory Blush | Avenor",
    description:
      "Ivory Blush — a dusty gold floral embroidered gown by Avenor, created in limited quantities.",
    url: "https://avenorcollection.com/reserve/ivory-blush",
    siteName: "Avenor",
    type: "website",
    images: [
      {
        url: "https://avenorcollection.com/products/ivory-blush/1.jpg",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/ivory-blush/2.jpg",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/ivory-blush/3.jpg",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/ivory-blush/4.jpg",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/ivory-blush/5.JPG",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/ivory-blush/6.jpg",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/ivory-blush/7.jpg",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/ivory-blush/8.jpg",
        alt: "Ivory Blush dusty gold floral embroidered gown by Avenor",
      },
    ],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Ivory Blush",
  description:
    "Ivory Blush is a dusty gold floral embroidered gown by Avenor, crafted with intricate embroidery and produced in limited quantities.",
  image: [
    "https://avenorcollection.com/products/ivory-blush/1.jpg",
    "https://avenorcollection.com/products/ivory-blush/2.jpg",
    "https://avenorcollection.com/products/ivory-blush/3.jpg",
    "https://avenorcollection.com/products/ivory-blush/4.jpg",
    "https://avenorcollection.com/products/ivory-blush/5.JPG",
    "https://avenorcollection.com/products/ivory-blush/6.jpg",
    "https://avenorcollection.com/products/ivory-blush/7.jpg",
    "https://avenorcollection.com/products/ivory-blush/8.jpg",
  ],
  brand: {
    "@type": "Brand",
    name: "Avenor",
  },
  category: "Dusty Gold Floral Embroidered Gown",
  offers: {
    "@type": "Offer",
    url: "https://avenorcollection.com/reserve/ivory-blush",
    priceCurrency: "INR",
    price: 14600,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
};

export default function IvoryBlushLayout({
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
