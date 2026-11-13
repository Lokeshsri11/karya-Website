import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

// Shared typography for the About / Privacy / Terms pages.
export const h2 = "mt-14 mr-0 mb-4 ml-0 border-t border-line pt-6 font-serif text-[30px] leading-[1.15] font-normal";
export const p = "mt-0 mr-0 mb-4 ml-0 max-w-[65ch] font-serif text-[18px] leading-[1.65] text-pretty text-fg-2";
export const ul = `${p} pl-[22px]`;

export default function InfoPage({
  crumb,
  title,
  lead,
  active,
  children,
}: {
  crumb: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  active?: "about";
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteNav active={active} />
      <main className="mx-auto my-0 max-w-[860px] px-6 pt-11 pb-28">
        <div className="font-mono text-[13px] text-fg-3">{crumb}</div>
        <h1 className="mt-4 mr-0 mb-5 ml-0 font-serif text-[clamp(40px,5.6vw,60px)] leading-[1.04] font-normal tracking-[-0.022em] mobile:text-[38px]">{title}</h1>
        <p className="m-0 max-w-[62ch] font-serif text-[20px] leading-[1.6] text-fg-2">{lead}</p>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
