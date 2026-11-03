import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Check, Copy, Gift } from "lucide-react";
import { Display, Page, SectionHead } from "@/components/site/ui";

const TITLE = "Give — Seed of Christ Golden Church Worldwide";
const DESCRIPTION = "Official bank transfer details for giving to Seed of Christ Golden Church Worldwide.";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: TITLE }, { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE }, { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/give" }],
  }),
  component: GivePage,
});

const ACCOUNTS = [
  { bank: "First Bank", number: "3032670285", name: "Solomon Mustapha Oni" },
  { bank: "Zenith Bank", number: "1015298950", name: "Seed of Christ Golden Church" },
] as const;
const DOLLAR_ACCOUNT = { bank: "Zenith Bank", number: "5071744662", name: "Mustapha Solomon" } as const;

function GivePage() {
  const [copied, setCopied] = useState<string | null>(null);
  const copyAccount = async (number: string) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(number);
      window.setTimeout(() => setCopied((current) => current === number ? null : current), 2200);
    } catch { setCopied(null); }
  };

  return (
    <Page className="max-w-5xl">
      <SectionHead as="h1" label="Generosity & stewardship" title="GIVE" sub="Thank you for supporting the work of Seed of Christ Golden Church Worldwide. Please use only the official church banking details shown below." />
      <section aria-labelledby="bank-heading">
        <div className="mb-7 flex items-center gap-3 border-b border-line pb-5"><Building2 className="text-golddeep" size={22} aria-hidden="true" /><Display as="h2" className="text-3xl"><span id="bank-heading">BANK TRANSFER</span></Display></div>
        <div className="grid gap-5 md:grid-cols-2">
          {ACCOUNTS.map((account) => (
            <article key={account.number} className="border border-line bg-porcelain p-6 md:p-8">
              <div className="font-label text-xs font-bold uppercase text-golddeep">{account.bank}</div>
              <div className="mt-7 font-display text-3xl text-ink md:text-4xl">{account.number}</div>
              <p className="mt-2 text-sm opacity-70">{account.name}</p>
              <button type="button" onClick={() => copyAccount(account.number)} className="font-label mt-7 inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs font-bold uppercase transition-colors hover:bg-ink hover:text-porcelain" aria-label={`Copy ${account.bank} account number ${account.number}`}>
                {copied === account.number ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                {copied === account.number ? "Copied" : "Copy account number"}
              </button>
            </article>
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite">{copied ? `Account number ${copied} copied.` : ""}</p>
      </section>
      <section className="mt-12" aria-labelledby="dollar-heading">
        <div className="mb-7 flex items-center gap-3 border-b border-line pb-5"><Building2 className="text-golddeep" size={22} aria-hidden="true" /><Display as="h2" className="text-3xl"><span id="dollar-heading">DOLLAR DONATIONS</span></Display></div>
        <article className="max-w-xl border border-line bg-porcelain p-6 md:p-8">
          <div className="font-label text-xs font-bold uppercase text-golddeep">{DOLLAR_ACCOUNT.bank}</div>
          <div className="mt-7 font-display text-3xl text-ink md:text-4xl">{DOLLAR_ACCOUNT.number}</div>
          <p className="mt-2 text-sm opacity-70">{DOLLAR_ACCOUNT.name}</p>
          <button type="button" onClick={() => copyAccount(DOLLAR_ACCOUNT.number)} className="font-label mt-7 inline-flex min-h-11 items-center gap-2 border border-ink px-4 text-xs font-bold uppercase transition-colors hover:bg-ink hover:text-porcelain" aria-label={`Copy Zenith Bank dollar donations account number ${DOLLAR_ACCOUNT.number}`}>
            {copied === DOLLAR_ACCOUNT.number ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied === DOLLAR_ACCOUNT.number ? "Copied" : "Copy account number"}
          </button>
        </article>
        <p className="sr-only" role="status" aria-live="polite">{copied === DOLLAR_ACCOUNT.number ? `Account number ${copied} copied.` : ""}</p>
      </section>
      <section className="mt-10 border-t border-line pt-8"><div className="flex items-start gap-3"><Gift className="mt-1 shrink-0 text-golddeep" size={20} aria-hidden="true" /><div><Display as="h2" className="text-2xl">GIVING INFORMATION</Display><p className="mt-3 max-w-2xl text-sm leading-7 opacity-75">Members and supporters may give by direct bank transfer using the appropriate account above. Please check the account name in your bank app before completing the transfer. No international transfer or routing details have been provided.</p></div></div></section>
    </Page>
  );
}