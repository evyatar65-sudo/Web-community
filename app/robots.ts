import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/activities", "/memorial", "/donate", "/contact"],
        disallow: ["/admin", "/members", "/forum", "/archive", "/alumni-benefits", "/profile"],
      },
    ],
    sitemap: "https://sayeret-nachal.org.il/sitemap.xml",
  };
}
