import type { MetadataRoute } from "next";
import { getAllPosts, TAGS } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const pages = ["", "/docs", "/roadmap", "/blog", "/about", "/privacy", "/terms", ...Object.keys(TAGS).map((t) => `/blog/tag/${t}`)];
  return [
    ...pages.map((p) => ({ url: `https://usekarya.dev${p}` })),
    ...posts.map((p) => ({ url: `https://usekarya.dev/blog/${p.slug}`, lastModified: p.date })),
  ];
}
