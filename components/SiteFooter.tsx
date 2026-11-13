import Link from "next/link";
import Mark from "./Mark";
import { COMPANY, FOUNDERS } from "./company";

const EMAILS = FOUNDERS.map((f) => f.email);
const link = "text-fg-2 no-underline hover:text-fg";

export default function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto my-0 flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-[14px] px-6 pt-9 pb-0 mobile:gap-3 mobile:px-5 mobile:pt-8">
        <span className="font-serif text-[19px] leading-[1.3] text-fg-2 mobile:text-[17px]">
          Questions or ideas? <em className="text-accent">Write to us.</em>
        </span>
        <span className="flex flex-wrap gap-[10px] font-mono text-[13px]">
          {EMAILS.map((e) => (
            <a
              key={e}
              href={`mailto:${e}`}
              className="inline-flex items-center gap-2 border border-line-2 px-3 py-[6px] text-fg no-underline [transition:background_.2s,color_.2s,border-color_.2s] hover:border-accent hover:bg-bg-2 hover:text-accent"
            >
              {e}
              <span className="text-accent">↗</span>
            </a>
          ))}
        </span>
      </div>
      <div className="mx-auto my-0 flex max-w-[1100px] flex-wrap items-baseline gap-x-7 gap-y-[14px] px-6 pt-10 pb-7 font-mono text-[13px] text-fg-3 mobile:gap-x-[22px] mobile:gap-y-3 mobile:px-5 mobile:pt-8 mobile:pb-11">
        <span className="flex items-center gap-[10px] text-fg">
          <Mark size={26} />
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
      <div className="mx-auto my-0 flex max-w-[1100px] flex-wrap gap-x-6 gap-y-2 border-t border-line px-6 pt-[18px] pb-10 font-mono text-[12.5px] text-fg-3">
        <span>
          © {COMPANY.foundedYear} Karya · built by {FOUNDERS.map((f, i) => (
            <span key={f.name}>
              {i > 0 && " & "}
              <a href={f.linkedin} className={link}>
                {f.name}
              </a>
            </span>
          ))}
        </span>
        <span>
          {COMPANY.location} · founded {COMPANY.founded}
        </span>
      </div>
    </footer>
  );
}
