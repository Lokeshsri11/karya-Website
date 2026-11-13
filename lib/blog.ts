import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import type { ComponentType } from "react";
import { FOUNDERS } from "@/components/company";

// The only tags a post may use. A typo in a post's header fails the build.
export const TAGS = {
  engineering: "engineering",
  "design-notes": "design notes",
  milestones: "milestones",
} as const;
export type Tag = keyof typeof TAGS;

export interface PostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  author: (typeof FOUNDERS)[number];
  tags: Tag[];
  milestone?: string;
  draft: boolean;
  readMinutes: number;
  headings: { id: string; text: string }[];
}

const DIR = path.join(process.cwd(), "content/blog");
const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

function fail(slug: string, msg: string): never {
  throw new Error(`content/blog/${slug}.mdx: ${msg}`);
}

function parse(slug: string, fm: Record<string, unknown> | undefined): Omit<PostMeta, "readMinutes" | "headings" | "slug"> {
  if (!fm) fail(slug, "missing the --- header block");
  const str = (k: string) => (typeof fm[k] === "string" && (fm[k] as string).trim() ? (fm[k] as string).trim() : fail(slug, `"${k}" is required`));
  const date = fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : String(fm.date ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fail(slug, `"date" must look like 2026-11-14`);
  const author = FOUNDERS.find((f) => f.id === fm.author);
  if (!author) fail(slug, `"author" must be one of: ${FOUNDERS.map((f) => f.id).join(", ")}`);
  const tags = Array.isArray(fm.tags) ? (fm.tags as string[]) : fail(slug, `"tags" must be a list`);
  if (!tags.length) fail(slug, `"tags" needs at least one tag`);
  for (const t of tags) if (!(t in TAGS)) fail(slug, `unknown tag "${t}". Allowed: ${Object.keys(TAGS).join(", ")}`);
  return {
    title: str("title"),
    summary: str("summary"),
    date,
    author,
    tags: tags as Tag[],
    milestone: typeof fm.milestone === "string" ? fm.milestone : undefined,
    draft: fm.draft === true,
  };
}

// h2 ids match what rehype-slug puts on the rendered headings.
function headingsOf(source: string) {
  const slugger = new GithubSlugger();
  return [...source.matchAll(/^## (.+)$/gm)].map((m) => {
    const text = m[1].replace(/[`*_]/g, "").trim();
    return { id: slugger.slug(text), text };
  });
}

async function load(slug: string) {
  const mod = (await import(`@/content/blog/${slug}.mdx`)) as { default: ComponentType; frontmatter?: Record<string, unknown> };
  const source = fs.readFileSync(path.join(DIR, `${slug}.mdx`), "utf8");
  const body = source.replace(/^---[\s\S]*?\n---/, "");
  const meta: PostMeta = {
    slug,
    ...parse(slug, mod.frontmatter),
    readMinutes: Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220)),
    headings: headingsOf(body),
  };
  return { meta, Content: mod.default };
}

export function slugs() {
  return fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, "")) : [];
}

// Newest first. Drafts are visible in `next dev` only.
export async function getAllPosts(): Promise<PostMeta[]> {
  const all = await Promise.all(slugs().map(async (s) => (await load(s)).meta));
  return all.filter((p) => SHOW_DRAFTS || !p.draft).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string) {
  if (!slugs().includes(slug)) return null;
  const post = await load(slug);
  return SHOW_DRAFTS || !post.meta.draft ? post : null;
}

export function formatDate(d: string) {
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
