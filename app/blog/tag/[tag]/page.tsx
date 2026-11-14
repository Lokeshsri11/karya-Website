import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogIndex from "@/components/blog/BlogIndex";
import { TAGS, getAllPosts, type Tag } from "@/lib/blog";

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(TAGS).map((tag) => ({ tag }));

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  return { title: `${TAGS[tag as Tag] ?? tag} | Karya blog` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  if (!(tag in TAGS)) notFound();
  const posts = (await getAllPosts()).filter((p) => p.tags.includes(tag as Tag));
  return <BlogIndex posts={posts} tag={tag as Tag} />;
}
