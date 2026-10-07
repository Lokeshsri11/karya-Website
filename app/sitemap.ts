import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/docs", "/roadmap", "/about", "/privacy", "/terms"].map((p) => ({ url: `https://usekarya.dev${p}` }));
}
