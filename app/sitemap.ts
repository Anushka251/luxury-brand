import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://avenorcollection.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/reserve/crimson-rose`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/reserve/ivory-blush`,
      lastModified: new Date(),
    },
  ];
}
