import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sunset Lilac | Avenor",
  description:
    "Discover Sunset Lilac, an embroidered mini dress by Avenor, created in limited quantities with a focus on contemporary craftsmanship and quiet luxury.",
  alternates: {
    canonical:
      "https://avenorcollection.com/reserve/sunset-lilac",
  },
  openGraph: {
    title: "Sunset Lilac | Avenor",
    description:
      "Sunset Lilac — an embroidered mini dress by Avenor, created in limited quantities.",
    url: "https://avenorcollection.com/reserve/sunset-lilac",
    siteName: "Avenor",
    type: "website",
    images: [
      {
        url: "https://avenorcollection.com/products/sunset-lilac/1.jpg",
        width: 1200,
        height: 1600,
        alt: "Sunset Lilac embroidered mini dress by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/sunset-lilac/2.jpg",
        width: 1200,
        height: 1600,
        alt: "Sunset Lilac embroidered mini dress by Avenor",
      },
      {
        url: "https://avenorcollection.com/products/sunset-lilac/3.JPG",
        width: 1200,
        height: 1600,
        alt: "Sunset Lilac embroidered mini dress by Avenor",
      },
    ],
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Sunset Lilac",
  description:
    "Sunset Lilac is an embroidered mini dress by Avenor, created in limited quantities with a focus on contemporary craftsmanship and quiet luxury.",
  image: [
    "https://avenorcollection.com/products/sunset-lilac/1.jpg",
    "https://avenorcollection.com/products/sunset-lilac/2.jpg",
    "https://avenorcollection.com/products/sunset-lilac/3.JPG",
  ],
  brand: {
    "@type": "Brand",
    name: "Avenor",
  },
  category: "Embroidered Mini Dress",
  offers: {
    "@type": "Offer",
    url: "https://avenorcollection.com/reserve/sunset-lilac",
    priceCurrency: "INR",
    price: 8100,
    availability:
      "https://schema.org/InStock",
    itemCondition:
      "https://schema.org/NewCondition",
  },
};

export default function SunsetLilacLayout({
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
