import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sunset Lilac | Avenor",
  description:
    "Discover Sunset Lilac, an embroidered mini dress by Avenor, created in limited quantities with a focus on contemporary craftsmanship and quiet luxury.",
  alternates: {
    canonical:
      "https://avenorcollection.com/reserve/sunset-lilac",
  },
};

export default function SunsetLilacLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
