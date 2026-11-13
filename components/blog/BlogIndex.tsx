import Link from "next/link";
import SiteNav from "../SiteNav";
import SiteFooter from "../SiteFooter";
import { TAGS, formatDate, type PostMeta, type Tag } from "@/lib/blog";

const filterBtn = "border px-3 py-[5px] no-underline";

export default function BlogIndex({ posts, tag }: { posts: PostMeta[]; tag?: Tag }) {
  // the newest post is featured on the main index only
  const featured = !tag ? posts[0] : undefined;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteNav active="blog" />
      <main className="mx-auto my-0 max-w-[1100px] px-6 pt-14 pb-28 mobile:px-5 mobile:pt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="min-w-0 flex-[1_1_520px]">
            <div className="font-mono text-[13px] text-fg-3">blog{tag ? ` / ${TAGS[tag]}` : ""}</div>
            <h1 className="mt-4 mb-5 max-w-[13ch] font-serif text-[clamp(44px,6vw,72px)] leading-[0.98] font-normal tracking-[-0.03em]">
              Notes from building <em className="text-accent">kārya.</em>
            </h1>
            <p className="m-0 max-w-[58ch] font-serif text-[20px] leading-[1.6] text-fg-2">
              How the agent loop, the sandbox and undo are being built, what we got wrong on the way, and what ships in each milestone.
            </p>
          </div>
          <div className="flex flex-col gap-[10px] font-mono text-[13px]">
            <a href="/blog/rss.xml" className="inline-flex items-center gap-2 border border-line-2 px-[14px] py-2 text-fg no-underline hover:border-accent hover:text-accent">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
              RSS feed
            </a>
            <span className="text-fg-3">new posts at each milestone</span>
          </div>
        </div>

        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-14 gap-y-8 border border-accent bg-bg-2 p-9 text-fg no-underline hover:text-fg mobile:p-5"
          >
            <div className="flex min-w-0 flex-col gap-[18px]">
              <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[10px] font-mono text-[12.5px]">
                <span className="bg-accent px-[10px] py-[3px] text-accent-ink">latest</span>
                <span className="text-fg-2">{TAGS[featured.tags[0]]}</span>
                <span className="text-fg-3">
                  {formatDate(featured.date)} · {featured.readMinutes} min read
                </span>
                {featured.draft && <span className="border border-no px-2 py-[2px] text-no">draft</span>}
              </div>
              <h2 className="m-0 font-serif text-[clamp(32px,4vw,48px)] leading-[1.04] font-normal tracking-[-0.025em]">{featured.title}</h2>
              <p className="m-0 max-w-[52ch] font-serif text-[18px] leading-[1.6] text-fg-2">{featured.summary}</p>
              <span className="font-mono text-[13px] text-fg-2">{featured.author.name} · read the post →</span>
            </div>
          </Link>
        )}

        <div className="mt-[72px] flex flex-wrap items-center justify-between gap-4 border-b border-line-2 pb-4">
          <h2 className="m-0 font-serif text-[32px] leading-[1.15] font-normal">{tag ? `Posts tagged ${TAGS[tag]}` : "All posts"}</h2>
          <div className="flex flex-wrap gap-2 font-mono text-[12.5px]">
            <Link href="/blog" className={`${filterBtn} ${!tag ? "border-accent text-accent" : "border-line-2 text-fg-2 hover:text-accent"}`}>
              all
            </Link>
            {(Object.keys(TAGS) as Tag[]).map((t) => (
              <Link key={t} href={`/blog/tag/${t}`} className={`${filterBtn} ${tag === t ? "border-accent text-accent" : "border-line-2 text-fg-2 hover:text-accent"}`}>
                {TAGS[t]}
              </Link>
            ))}
          </div>
        </div>

        {posts.length === 0 && <p className="mt-10 font-mono text-[13.5px] text-fg-3">No posts yet.</p>}
        <div className="flex flex-col">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-wrap gap-x-10 gap-y-[10px] border-b border-line py-7 text-fg no-underline hover:text-fg">
              <div className="flex flex-[0_0_160px] flex-col gap-[6px] font-mono text-[12.5px]">
                <span className="text-fg-3">{formatDate(p.date)}</span>
                <span className="text-fg-2">{p.tags.map((t) => TAGS[t]).join(" · ")}</span>
              </div>
              <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-[10px]">
                <h3 className="m-0 font-serif text-[28px] leading-[1.2] font-normal tracking-[-0.01em] group-hover:text-accent">
                  {p.title}
                  {p.draft && <span className="ml-3 border border-no px-2 py-[2px] align-middle font-mono text-[12px] tracking-normal text-no">draft</span>}
                </h3>
                <p className="m-0 max-w-[64ch] font-serif text-[17px] leading-[1.55] text-fg-2">{p.summary}</p>
              </div>
              <div className="flex-none self-start font-mono text-[12.5px] text-fg-3">{p.readMinutes} min</div>
            </Link>
          ))}
        </div>

        <div className="mt-[72px] flex flex-wrap items-center gap-x-10 gap-y-5 border border-line-2 px-8 py-7 mobile:px-5">
          <div className="min-w-0 flex-[1_1_360px]">
            <div className="font-serif text-[26px] leading-[1.25]">Get the next post when a milestone ships.</div>
            <div className="mt-[6px] font-mono text-[13px] text-fg-3">one email per milestone, or follow the RSS feed</div>
          </div>
          <a
            href="mailto:lokesh@usekarya.dev?subject=Tell%20me%20when%20Karya%20ships%20a%20milestone"
            className="border border-accent bg-accent px-[18px] py-3 font-mono text-[13.5px] font-medium text-accent-ink no-underline hover:bg-transparent hover:text-accent"
          >
            Notify me
          </a>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
