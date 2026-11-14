import Link from "next/link";
import Mark from "./Mark";
import { COMPANY, FOUNDERS } from "./company";

const link = "text-accent-ink no-underline underline-offset-4 hover:underline";

export default function SiteFooter() {
  return (
    <footer className="bg-accent text-accent-ink">
      <div className="mx-auto my-0 grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-x-16 gap-y-12 px-6 py-[clamp(72px,10vw,136px)] mobile:gap-10 mobile:px-5 mobile:py-16">
        <div>
          <div className="font-mono text-[13px]">write to us</div>
          <h2 className="mt-5 mb-0 max-w-[11ch] font-display text-[clamp(48px,7.4vw,108px)] leading-[0.95] font-medium tracking-[-0.04em] mobile:text-[44px]">
            Questions or <em>ideas?</em>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-7">
          {FOUNDERS.map((f) => (
            <a
              key={f.email}
              href={`mailto:${f.email}`}
              className="box-border flex w-full max-w-[460px] items-center justify-between gap-4 border-2 border-accent-ink px-5 py-4 font-mono text-[clamp(14px,1.4vw,17px)] text-accent-ink no-underline [box-shadow:0_8px_0_var(--accent-ink)] [transition:transform_.09s,box-shadow_.09s,background_.2s,color_.2s] hover:bg-accent-ink hover:text-accent active:[box-shadow:0_0_0_var(--accent-ink)] active:[transform:translateY(8px)]"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[12px] opacity-80">{f.name}</span>
                <span className="[overflow-wrap:anywhere]">{f.email}</span>
              </span>
              <span className="text-[22px]">↗</span>
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto my-0 flex max-w-[1200px] flex-wrap items-center gap-x-7 gap-y-[14px] border-t-2 border-accent-ink px-6 pt-8 pb-7 font-mono text-[13px] mobile:gap-x-[22px] mobile:gap-y-3 mobile:px-5">
        <span className="flex items-center gap-[10px]">
          <Mark size={26} mono />
          <span className="font-serif text-[21px] font-medium tracking-[-0.02em]">kārya</span>
        </span>
        <Link href="/docs" className={link}>
          Docs
        </Link>
        <Link href="/about" className={link}>
          About
        </Link>
        <a href={COMPANY.repo} className={link}>
          GitHub
        </a>
        <Link href="/roadmap" className={link}>
          Roadmap
        </Link>
        <Link href="/privacy" className={link}>
          Privacy
        </Link>
        <Link href="/terms" className={link}>
          Terms
        </Link>
        <span className="ml-auto mobile:mt-2 mobile:ml-0 mobile:flex-[1_0_100%]">pre-1.0 · kārya, work done as duty</span>
      </div>
      <div className="mx-auto my-0 flex max-w-[1200px] flex-wrap gap-x-6 gap-y-2 px-6 pt-0 pb-10 font-mono text-[12.5px] mobile:px-5">
        <span>
          © {COMPANY.foundedYear} Karya · built by{" "}
          {FOUNDERS.map((f, i) => (
            <span key={f.name}>
              {i > 0 && " & "}
              <a href={f.linkedin} className={link}>
                {f.name}
              </a>
            </span>
          ))}
        </span>
      </div>
    </footer>
  );
}
