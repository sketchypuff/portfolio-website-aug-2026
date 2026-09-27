import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// List every public route by hand. /design is deliberately left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
