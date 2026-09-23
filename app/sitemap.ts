import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://avenorcollection.com/",
      lastModified: new Date(),
    },
    {
      url: "https://avenorcollection.com/shop",
      lastModified: new Date(),
    },
    {
      url: "https://avenorcollection.com/reserve/crimson-rose",
      lastModified: new Date(),
    },
    {
      url: "https://avenorcollection.com/reserve/blue-crystal",
      lastModified: new Date(),
    },
    {
      url: "https://avenorcollection.com/reserve/ivory-blush",
      lastModified: new Date(),
    },
    {
      url: "https://avenorcollection.com/reserve/sunset-lilac",
      lastModified: new Date(),
    },
  ];
}
