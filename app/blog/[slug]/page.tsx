import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { TAGS, formatDate, getAllPosts, getPost } from "@/lib/blog";

export const dynamicParams = false;
export const generateStaticParams = async () => (await getAllPosts()).map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const { title, summary, date, author } = post.meta;
  return {
    title: `${title} | Karya`,
    description: summary,
    authors: [{ name: author.name }],
    openGraph: { type: "article", title, description: summary, publishedTime: date, url: `/blog/${post.meta.slug}` },
    twitter: { card: "summary_large_image", title, description: summary },
  };
}

const sideLink = "block border-l border-line py-1 pr-0 pl-3 text-fg-2 no-underline hover:text-fg";

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const { meta, Content } = post;
  const all = await getAllPosts();
  const i = all.findIndex((p) => p.slug === meta.slug);
  const newer = i > 0 ? all[i - 1] : undefined;
  const older = i >= 0 && i < all.length - 1 ? all[i + 1] : undefined;
  const a = meta.author;
  const initials = a.name.split(" ").map((w) => w[0]).join("");

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteNav active="blog" />

      <div className="bg-grid border-b border-line">
        <div className="relative mx-auto my-0 max-w-275 px-6 pt-16 pb-14 mobile:px-5 mobile:pt-10 mobile:pb-10">
          <div className="font-mono text-[13px] text-fg-3">
            <Link href="/blog" className="text-fg-3 no-underline hover:text-accent">blog</Link> / {TAGS[meta.tags[0]]}
          </div>
          <h1 className="mt-4.5 mb-6 max-w-[15ch] font-display text-[clamp(40px,6vw,76px)] leading-[0.98] font-medium tracking-[-0.03em]">{meta.title}</h1>
          <p className="m-0 max-w-[56ch] font-serif text-[clamp(18px,2vw,22px)] leading-normal text-fg-2">{meta.summary}</p>
          <div className="mt-8 flex flex-col items-start gap-3 font-mono text-[13px] text-fg-2">
            <span className="flex items-center gap-2.5 border border-line-2 bg-bg-2 py-0.75 pr-2.5 pl-0.75 text-fg">
              <span aria-hidden="true" className="inline-flex h-7 w-7 items-center justify-center border border-line-2 bg-bg text-[12px] text-accent">{initials}</span>
              {a.name}
            </span>
            <div className="absolute bottom-0 left-6 flex translate-y-1/2 flex-wrap items-center gap-x-2 gap-y-1 border border-line bg-bg px-3 py-1.5 text-[12.5px] text-fg-2 mobile:left-5">
              <span>{formatDate(meta.date)}</span>
              <span aria-hidden="true">·</span>
              <span>{meta.readMinutes} min read</span>
              {meta.tags.map((t) => (
                <Fragment key={t}>
                  <span aria-hidden="true">·</span>
                  <Link href={`/blog/tag/${t}`} className="text-fg-3 no-underline hover:text-accent">{TAGS[t]}</Link>
                </Fragment>
              ))}
              {meta.milestone && (<><span aria-hidden="true">·</span><span>{meta.milestone}</span></>)}
              {meta.draft && (<><span aria-hidden="true">·</span><span className="text-no">draft · hidden in production</span></>)}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto my-0 flex max-w-275 flex-wrap items-start gap-x-16 gap-y-0 px-6 mobile:px-5">
        <aside className="sticky top-15.5 max-w-55 flex-[1_0_200px] px-0 pt-12 pb-6 font-mono text-[13px] leading-normal narrow:static narrow:max-w-none narrow:flex-[1_0_100%] narrow:pt-8 mobile:hidden">
          {meta.headings.length > 0 && (
            <>
              <div className="mb-2.5 text-fg-3">on this page</div>
              <nav className="flex flex-col gap-0.5">
                {meta.headings.map((h) => (
                  <a key={h.id} href={`#${h.id}`} className={sideLink}>{h.text}</a>
                ))}
              </nav>
            </>
          )}
        </aside>

        <article className="max-w-175 min-w-0 flex-[999_1_480px] pt-12 pb-24 mobile:pt-8">
          <Content />

          <div className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-4 border border-line-2 bg-bg-2 px-5.5 py-5">
            <span aria-hidden="true" className="inline-flex h-13 w-13 items-center justify-center border border-line-2 font-mono text-[15px] text-accent">{initials}</span>
            <div className="min-w-0 flex-[1_1_260px]">
              <div className="font-display text-[22px] font-medium">{a.name}</div>
              <div className="mt-0.5 font-mono text-[13px] text-accent">{a.role}</div>
            </div>
            <div className="flex gap-4 font-mono text-[13px]">
              <a href={a.github} className="text-fg-2 no-underline hover:text-fg">GitHub ↗</a>
              <a href={a.x} className="text-fg-2 no-underline hover:text-fg">X ↗</a>
            </div>
          </div>

          {(newer || older) && (
            <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
              {older ? (
                <Link href={`/blog/${older.slug}`} className="flex flex-col gap-2 border border-line px-5 py-4.5 text-fg no-underline hover:border-accent hover:text-fg">
                  <span className="font-mono text-[12.5px] text-fg-3">← older</span>
                  <span className="font-display text-[20px] leading-[1.3]">{older.title}</span>
                </Link>
              ) : <span />}
              {newer && (
                <Link href={`/blog/${newer.slug}`} className="flex flex-col gap-2 border border-line px-5 py-4.5 text-right text-fg no-underline hover:border-accent hover:text-fg">
                  <span className="font-mono text-[12.5px] text-fg-3">newer →</span>
                  <span className="font-display text-[20px] leading-[1.3]">{newer.title}</span>
                </Link>
              )}
            </div>
          )}
        </article>
      </div>
      <SiteFooter />
    </div>
  );
}
