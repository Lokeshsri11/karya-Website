import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const posts = await getAllPosts();
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>https://usekarya.dev/blog/${p.slug}</link><guid>https://usekarya.dev/blog/${p.slug}</guid><pubDate>${new Date(p.date + "T00:00:00Z").toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`,
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Karya blog</title><link>https://usekarya.dev/blog</link><description>Notes from building Karya.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
