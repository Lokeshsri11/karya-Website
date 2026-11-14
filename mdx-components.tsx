import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import CodeBlock from "@/components/blog/CodeBlock";

// Writers type plain Markdown; these map each element to the site's look,
// so every post matches the design without any per-post styling.
export function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-7 border border-line-2 px-4 py-3.5">
      <div className="mb-1.5 font-mono text-[12.5px] text-fg-3">note</div>
      <div className="font-serif text-[17px] leading-normal text-fg [&>p]:m-0">{children}</div>
    </div>
  );
}

export const components: MDXComponents = {
  Note,
  h2: (p) => <h2 {...p} className="mt-14 mb-4 scroll-mt-20 border-t border-line pt-6 font-display text-[34px] leading-[1.15] font-medium" />,
  h3: (p) => <h3 {...p} className="mt-10 mb-3 scroll-mt-20 font-display text-[24px] leading-tight font-medium" />,
  p: (p) => <p {...p} className="mt-0 mb-5.5 font-serif text-[19px] leading-[1.7] text-fg-2" />,
  a: ({ href = "", ...p }) =>
    href.startsWith("/") ? (
      <Link href={href} className="text-fg underline underline-offset-4 hover:text-accent" {...p} />
    ) : (
      <a href={href} className="text-fg underline underline-offset-4 hover:text-accent" {...p} />
    ),
  strong: (p) => <strong {...p} className="font-semibold text-fg" />,
  ul: (p) => <ul {...p} className="mt-0 mb-5.5 pl-6 font-serif text-[19px] leading-[1.7] text-fg-2 marker:text-fg-3" />,
  ol: (p) => <ol {...p} className="mt-0 mb-5.5 pl-6 font-serif text-[19px] leading-[1.7] text-fg-2 marker:text-fg-3" />,
  li: (p) => <li {...p} className="mb-1" />,
  hr: () => <hr className="my-12 border-0 border-t border-line" />,
  blockquote: (p) => <blockquote {...p} className="my-7 border-l-2 border-accent py-1 pl-6 font-serif text-[28px] leading-[1.35] text-fg italic [&>p]:m-0 [&>p]:text-[28px] [&>p]:text-fg" />,
  code: (p) => <code {...p} className="bg-bg-2 px-1.25 py-px font-mono text-[0.84em] text-fg" />,
  pre: (p) => (
    <CodeBlock
      {...p}
      className="overflow-x-auto border border-line-2 bg-term px-4.5 py-4 font-mono text-[13.5px] leading-[1.75] text-fg-2 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em] [&_code]:text-inherit"
    />
  ),
  table: (p) => (
    <div className="mb-7 overflow-x-auto">
      <table {...p} className="w-full border-collapse text-left font-mono text-[13px]" />
    </div>
  ),
  th: (p) => <th {...p} className="border-b border-fg-3 px-4 py-2.5 font-normal text-fg-3" />,
  td: (p) => <td {...p} className="border-b border-line px-4 py-3 text-fg-2" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
