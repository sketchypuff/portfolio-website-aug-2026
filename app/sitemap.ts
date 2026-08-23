import type { MetadataRoute } from "next";
import { getPosts, getProjects } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  const staticRoutes = ["", "/about", "/projects", "/blog", "/resume"].map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const postRoutes = posts.map((entry) => ({
    url: `${site.url}/blog/${entry.slug}`,
    lastModified: new Date(entry.meta.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  // Link-out projects have no page of ours to index.
  const projectRoutes = projects
    .filter((entry) => !entry.meta.external)
    .map((entry) => ({
      url: `${site.url}/projects/${entry.slug}`,
      lastModified: new Date(entry.meta.date),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
