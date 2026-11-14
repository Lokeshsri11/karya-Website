import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// Code blocks are colored at build time. Each color is a CSS variable from
// globals.css, so one theme follows light and dark mode.
const codeTheme = {
  name: "karya",
  type: "dark",
  colors: { "editor.foreground": "var(--code-fg)", "editor.background": "transparent" },
  tokenColors: [
    { settings: { foreground: "var(--code-fg)" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "var(--code-comment)", fontStyle: "italic" } },
    { scope: ["keyword", "storage", "storage.type", "keyword.operator.new", "keyword.control"], settings: { foreground: "var(--code-keyword)" } },
    { scope: ["string", "string.quoted", "punctuation.definition.string"], settings: { foreground: "var(--code-string)" } },
    { scope: ["constant.numeric", "constant.language", "constant.character", "support.constant"], settings: { foreground: "var(--code-number)" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "var(--code-function)" } },
    { scope: ["entity.name.type", "support.type", "entity.name.class", "entity.other.inherited-class"], settings: { foreground: "var(--code-type)" } },
    { scope: ["variable.parameter", "variable.other.property", "meta.object-literal.key", "entity.other.attribute-name"], settings: { foreground: "var(--code-fg)" } },
    { scope: ["keyword.operator", "punctuation"], settings: { foreground: "var(--code-punct)" } },
    { scope: ["entity.name.tag"], settings: { foreground: "var(--code-keyword)" } },
  ],
};

// Blog posts are .mdx files in content/blog, imported by the /blog routes.
// Plugins are named by string so they work with Turbopack.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter", ["remark-mdx-frontmatter", { name: "frontmatter" }]],
    rehypePlugins: ["rehype-slug", ["rehype-pretty-code", { theme: codeTheme, keepBackground: false }]],
  },
});

export default withMDX(nextConfig);
