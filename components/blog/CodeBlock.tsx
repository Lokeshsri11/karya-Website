"use client";

import { useRef, useState, type ComponentProps } from "react";

// A post's code block with a copy button in the top-right corner.
export default function CodeBlock({ className = "", ...props }: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = ref.current?.innerText.replace(/\n$/, "") ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked (e.g. insecure context); nothing to do
    }
  }

  return (
    <div className="group relative mt-0 mb-7">
      <pre ref={ref} {...props} className={`${className} m-0 pr-20`} />
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute top-2 right-2 cursor-pointer border border-line-2 bg-bg-2 px-2 py-[2px] font-mono text-[12px] text-fg-3 opacity-0 transition-opacity group-hover:opacity-100 hover:border-accent hover:text-accent focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
      >
        {copied ? "copied" : "copy"}
      </button>
    </div>
  );
}
