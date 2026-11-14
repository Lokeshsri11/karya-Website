import type { Metadata } from "next";
import BlogIndex from "@/components/blog/BlogIndex";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Karya",
  description: "Notes from building Karya: the agent loop, the sandbox, undo and budgets, and what ships in each milestone.",
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
};

export default async function Blog() {
  return <BlogIndex posts={await getAllPosts()} />;
}
