import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getEntry, getRenderableSlugs } from "@/lib/content";

// List every public route by hand. /design is deliberately left out.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await Promise.all(
    (await getRenderableSlugs("posts")).map(({ slug }) => getEntry("posts", slug)),
  );

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...posts.flatMap((post) =>
      post
        ? [{ url: `${site.url}${post.href}`, lastModified: new Date(post.meta.date) }]
        : [],
    ),
  ];
}
