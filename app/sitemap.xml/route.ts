export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://avenorcollection.com/</loc>
  </url>
  <url>
    <loc>https://avenorcollection.com/shop</loc>
  </url>
  <url>
    <loc>https://avenorcollection.com/reserve/crimson-rose</loc>
  </url>
  <url>
    <loc>https://avenorcollection.com/reserve/ivory-blush</loc>
  </url>
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
