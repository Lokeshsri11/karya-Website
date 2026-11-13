import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// Blog posts are .mdx files in content/blog, imported by the /blog routes.
// Plugins are named by string so they work with Turbopack.
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm", "remark-frontmatter", ["remark-mdx-frontmatter", { name: "frontmatter" }]],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
