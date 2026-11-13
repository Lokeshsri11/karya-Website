import type { Metadata } from "next";
import InfoPage, { h2, p, ul } from "@/components/InfoPage";
import { COMPANY, FOUNDERS, LAST_UPDATED } from "@/components/company";

export const metadata: Metadata = {
  title: "Terms — Karya",
  description: "Terms for using the Karya website and the Karya CLI.",
};

export default function Terms() {
  return (
    <InfoPage crumb="terms" title="Terms of use" lead={`These terms cover the usekarya.dev website and the Karya CLI. Last updated ${LAST_UPDATED}.`}>
      <h2 className={h2}>Who provides Karya</h2>
      <p className={p}>
        Karya is built and operated by {FOUNDERS[0].name} and {FOUNDERS[1].name} from {COMPANY.location}. Karya is not yet an incorporated company. When it is, these terms will name that entity.
      </p>

      <h2 className={h2}>Using the software</h2>
      <ul className={ul}>
        <li>The Karya source code is published on <a href={COMPANY.repo} className="text-fg hover:text-accent">GitHub</a>. Your use of the code is governed by the license in that repository.</li>
        <li>Karya is pre-1.0 and provided &quot;as is&quot;, without warranty of any kind. Features may change or be removed between releases.</li>
        <li>Karya can read, edit and run code on your machine at your direction. You are responsible for reviewing its changes, for keeping backups and for what you run.</li>
      </ul>

      <h2 className={h2}>Model providers and API keys</h2>
      <ul className={ul}>
        <li>Karya works with your own API keys. Your use of a model provider, such as Anthropic or Google, is governed by that provider&apos;s terms and usage policies, and you pay that provider directly.</li>
        <li>Karya does not resell, proxy or share consumer subscriptions.</li>
        <li>You must not use Karya to break the law or a provider&apos;s usage policies.</li>
      </ul>

      <h2 className={h2}>Liability</h2>
      <p className={p}>
        To the extent the law allows, we are not liable for any loss of data, code, money or time that comes from using Karya, including model API costs. Budgets in Karya are a safeguard, not a guarantee.
      </p>

      <h2 className={h2}>Contact</h2>
      <p className={p}>
        Questions about these terms: <a href={`mailto:${FOUNDERS[0].email}`} className="text-fg hover:text-accent">{FOUNDERS[0].email}</a> or <a href={`mailto:${FOUNDERS[1].email}`} className="text-fg hover:text-accent">{FOUNDERS[1].email}</a>.
      </p>
    </InfoPage>
  );
}
