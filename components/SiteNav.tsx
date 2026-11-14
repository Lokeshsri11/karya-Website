"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Mark from "./Mark";

type Theme = "dark" | "light";

export default function SiteNav({ active = "home" }: { active?: "home" | "docs" | "roadmap" | "blog" | "about" }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let t: Theme = "dark";
    try {
      t = (localStorage.getItem("karya-theme") as Theme) || (document.documentElement.dataset.theme as Theme) || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    } catch {}
    document.documentElement.dataset.theme = t;
    setTheme(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth > 720 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const toggle = () => {
    const t: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("karya-theme", t);
    } catch {}
    setTheme(t);
  };

  const close = () => setOpen(false);
  const isLight = theme === "light";

  // Links in the open mobile panel become full-width rows.
  const row = open ? "mobile:w-full mobile:justify-between mobile:py-[13px] mobile:px-0" : "";
  const rowLine = open ? "mobile:border-b mobile:border-line" : "";
  const navLink = (on: boolean) => `${on ? "text-fg" : "text-fg-2"} no-underline hover:text-fg ${row} ${rowLine}`;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg">
      <div className="mx-auto my-0 flex max-w-[1100px] flex-wrap items-center gap-x-6 gap-y-3 px-6 py-[14px]">
        <Link href="/" aria-label="Karya home" onClick={close} className="flex items-center gap-[10px] text-fg no-underline">
          <Mark size={30} />
          <span className="font-display text-[24px] leading-none font-medium tracking-[-0.02em]">kārya</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
          className="ml-auto hidden h-[30px] w-9 cursor-pointer flex-col items-center justify-center gap-1 border border-line-2 bg-bg-2 p-0 text-fg mobile:inline-flex"
        >
          {open ? (
            <span className="font-mono text-[15px] leading-none">✕</span>
          ) : (
            <>
              <span className="block h-[1.5px] w-4 bg-current" />
              <span className="block h-[1.5px] w-4 bg-current" />
              <span className="block h-[1.5px] w-4 bg-current" />
            </>
          )}
        </button>
        <nav
          id="site-menu"
          className={`ml-auto flex flex-none flex-wrap items-center gap-x-[22px] gap-y-2 font-mono text-[13.5px] ${
            open
              ? "mobile:m-0 mobile:mt-3 mobile:flex-[1_0_100%] mobile:flex-col mobile:items-stretch mobile:gap-0 mobile:border-t mobile:border-line mobile:pt-1 mobile:text-[15px]"
              : "mobile:hidden"
          }`}
        >
          <Link href="/docs" onClick={close} className={navLink(active === "docs")}>
            Docs
          </Link>
          <Link href="/roadmap" onClick={close} className={navLink(active === "roadmap")}>
            Roadmap
          </Link>
          <Link href="/blog" onClick={close} className={navLink(active === "blog")}>
            Blog
          </Link>
          <Link href="/about" onClick={close} className={navLink(active === "about")}>
            About
          </Link>
          <a href="https://github.com/prateek041/karya" className={navLink(false)}>
            GitHub
          </a>
          <button
            onClick={toggle}
            role="switch"
            aria-checked={isLight}
            aria-label="Toggle light and dark theme"
            className={`flex cursor-pointer items-center gap-2 border-none bg-transparent p-0 text-[12px] text-fg-2 hover:text-fg ${row}`}
          >
            <span className={`${theme === "dark" ? "text-fg" : "text-fg-3"} [transition:color_.2s]`}>dark</span>
            <span className="relative inline-block box-border h-[22px] w-10 border border-line-2 bg-bg-2">
              <span
                className={`absolute top-[3px] left-[3px] h-[14px] w-[14px] bg-accent [transition:transform_.22s_cubic-bezier(.2,.7,.2,1)] ${
                  isLight ? "[transform:translateX(18px)]" : "[transform:translateX(0px)]"
                }`}
              />
            </span>
            <span className={`${isLight ? "text-fg" : "text-fg-3"} [transition:color_.2s]`}>light</span>
          </button>
          <Link
            href="/docs#install"
            onClick={close}
            className={`border border-accent bg-accent px-[14px] py-[6px] font-medium text-accent-ink no-underline hover:bg-transparent hover:text-accent ${
              open ? "mobile:mt-[14px] mobile:w-full mobile:justify-between mobile:px-0 mobile:py-[11px] mobile:text-center" : ""
            }`}
          >
            Install
          </Link>
        </nav>
      </div>
    </header>
  );
}
