import type { Metadata } from "next";
import InfoPage, { h2, p, ul } from "@/components/InfoPage";
import { COMPANY, FOUNDERS, LAST_UPDATED } from "@/components/company";

export const metadata: Metadata = {
  title: "Privacy — Karya",
  description: "What data the Karya website and the Karya CLI collect, and where your code goes.",
};

export default function Privacy() {
  return (
    <InfoPage crumb="privacy" title="Privacy policy" lead={`Short version: Karya does not collect your code, prompts or API keys. Last updated ${LAST_UPDATED}.`}>
      <h2 style={h2}>Who we are</h2>
      <p style={p}>
        Karya is built and operated by its founders, {FOUNDERS[0].name} and {FOUNDERS[1].name}, from {COMPANY.location}. Karya is not yet an incorporated company. In this policy, &quot;we&quot; means the two of us.
      </p>

      <h2 style={h2}>The Karya CLI</h2>
      <ul style={ul}>
        <li>Karya runs on your machine. It has no Karya account and no telemetry, and it does not send anything to us.</li>
        <li>Your prompts, the files you share with the model and the command output go only to the model provider you configure (for example Anthropic or Google), using your own API key. That provider&apos;s privacy policy applies to that data.</li>
        <li>API keys are read from your environment or a local <code>.env</code> file. Karya never logs them.</li>
        <li>Sessions and prompt history are stored locally on your machine. Sync, when it ships, will be opt-in and end-to-end encrypted to a destination you own.</li>
      </ul>

      <h2 style={h2}>This website</h2>
      <ul style={ul}>
        <li>The site has no analytics, advertising or tracking cookies.</li>
        <li>Your light or dark theme choice is saved in your browser&apos;s local storage and never leaves your device.</li>
        <li>Our hosting provider may keep standard server logs, such as IP address, browser and pages requested, to operate and secure the site.</li>
        <li>If you email us, we keep your message and address only to reply and follow up.</li>
      </ul>

      <h2 style={h2}>Your choices</h2>
      <p style={p}>
        We do not sell or share personal data. To ask what we hold about you or to have it deleted, email <a href={`mailto:${FOUNDERS[0].email}`} className="ha" style={{ color: "var(--fg)" }}>{FOUNDERS[0].email}</a>. If this policy changes, we will update this page and the date above.
      </p>
    </InfoPage>
  );
}
