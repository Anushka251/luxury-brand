import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blue Crystal | Avenor",
  description:
    "Discover Blue Crystal, an intricately embroidered mini dress by Avenor with a luminous crystal-like finish, produced in limited quantities.",
  alternates: {
    canonical:
      "https://avenorcollection.com/reserve/blue-crystal",
  },
  openGraph: {
    title: "Blue Crystal | Avenor",
    description:
      "Blue Crystal — an intricately embroidered mini dress by Avenor with a luminous, jewel-like character.",
    url: "https://avenorcollection.com/reserve/blue-crystal",
    siteName: "Avenor",
    type: "website",
    images: [
      {
        url: "https://avenorcollection.com/products/blue-crystal/1.JPG",
        alt: "Blue Crystal embroidered mini dress by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/blue-crystal/2.JPG",
        alt: "Blue Crystal embroidered mini dress by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/blue-crystal/3.jpg",
        alt: "Blue Crystal embroidered mini dress by Avenor",
      },
    ],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Blue Crystal",
  description:
    "Blue Crystal is an intricately embroidered mini dress by Avenor with a luminous, jewel-like character, produced in limited quantities.",
  image: [
    "https://avenorcollection.com/products/blue-crystal/1.JPG",
    "https://avenorcollection.com/products/blue-crystal/2.JPG",
    "https://avenorcollection.com/products/blue-crystal/3.jpg",
  ],
  brand: {
    "@type": "Brand",
    name: "Avenor",
  },
  category: "Embroidered Mini Dress",
  offers: {
    "@type": "Offer",
    url: "https://avenorcollection.com/reserve/blue-crystal",
    priceCurrency: "INR",
    price: 9800,
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
  },
};

export default function BlueCrystalLayout({
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
