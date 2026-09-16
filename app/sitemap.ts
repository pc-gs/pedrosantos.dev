import type { MetadataRoute } from "next";
import { getAllProjects } from "@/content/projects";
import { getAllPosts } from "@/lib/blog";
import { getAllLogEntries } from "@/lib/log";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pedrosantos.dev";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/log`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/now`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/uses`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const logRoutes: MetadataRoute.Sitemap = getAllLogEntries().map((e) => ({
    url: `${baseUrl}/log/${e.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...logRoutes, ...postRoutes, ...projectRoutes];
}
