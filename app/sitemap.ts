import type { MetadataRoute } from "next";

const BASE_URL = "https://sayeret-nachal.org.il";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${BASE_URL}/about`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/activities`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/memorial`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/donate`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/contact`, priority: 0.7, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/shop`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `${BASE_URL}/register`, priority: 0.8, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/login`, priority: 0.6, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
    { url: `${BASE_URL}/accessibility`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return publicPages.map(({ url, priority, changeFrequency }) => ({
    url,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
