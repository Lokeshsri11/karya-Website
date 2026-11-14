import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

// Hero headline only.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-bricolage",
  display: "swap",
});

const description =
  "Karya is an open-source coding agent for your terminal, in a single Go binary. Commands run in an OS sandbox, every turn can be undone, budgets are enforced, and sessions follow you to any machine.";

export const metadata: Metadata = {
  metadataBase: new URL("https://usekarya.dev"),
  title: "Karya: autonomy without the risk",
  description,
  openGraph: { title: "Karya: autonomy without the risk", description, url: "/", siteName: "Karya", type: "website" },
  twitter: { card: "summary_large_image", title: "Karya: autonomy without the risk", description },
};

const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('karya-theme')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${mono.variable} ${serif.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
