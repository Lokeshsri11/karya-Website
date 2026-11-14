import Image from "next/image";

// Hero art: Utagawa Kuniyoshi, "Tiger" (Edo period, public domain), via Wikimedia Commons.
// Shown whole, behind the hero text.
export default function HeroTiger() {
  return (
    <figure className="pointer-events-none m-0 -mt-[clamp(56px,8vw,104px)] w-min shrink-0 narrow:hidden">
      <Image src="/tiger.webp" alt="" aria-hidden="true" width={554} height={1600} sizes="250px" priority className="block h-[660px] w-auto max-w-none" />
      <figcaption className="pointer-events-auto pt-2 font-mono text-[11.5px] leading-[1.5] text-fg-3">
        <a href="https://commons.wikimedia.org/wiki/File:Kuniyoshi_Utagawa,_Tiger.jpg" target="_blank" rel="noopener noreferrer" className="text-fg-3 no-underline hover:text-accent">
          <span className="text-fg-2">Tiger</span> · Utagawa Kuniyoshi (1797–1861) · public domain ↗
        </a>
      </figcaption>
    </figure>
  );
}
