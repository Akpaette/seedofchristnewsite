import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, CreditCard, Gift } from "lucide-react";
import { Btn, Display, Page, PlaceholderNote, SectionHead, inputClass } from "@/components/site/ui";

const TITLE = "Give — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Support the work of Seed of Christ Golden Church Worldwide with tithes, offerings and seed by card or bank transfer.";

export const Route = createFileRoute("/give")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/give" },
    ],
    links: [{ rel: "canonical", href: "/give" }],
  }),
  component: GivePage,
});

const PURPOSES = ["Tithe", "Offering", "Seed / Sacrifice", "Building project", "Missions"];
const AMOUNTS = ["2,000", "5,000", "10,000", "50,000"];

function GivePage() {
  const [purpose, setPurpose] = useState(PURPOSES[0]!);
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState<"paystack" | "flutterwave" | null>(null);

  return (
    <Page className="max-w-3xl">
      <SectionHead
        as="h1"
        label="Partner with us"
        title="GIVE"
        sub="“Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.” — 2 Corinthians 9:7"
      />

      <div className="border-ink border-2 p-6">
        <fieldset>
          <legend className="font-label text-crimson text-xs font-bold uppercase">
            What are you giving towards?
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={purpose === p}
                onClick={() => setPurpose(p)}
                className={`font-label border-2 px-4 py-2 text-xs font-bold uppercase ${purpose === p ? "border-ink bg-ink text-porcelain" : "border-line"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-6">
          <label className="font-label text-xs font-bold uppercase" htmlFor="amount">
            Amount (₦)
          </label>
          <input
            id="amount"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className={`${inputClass} mt-1`}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                className="border-line font-label border-2 px-3 py-1.5 text-xs font-bold"
              >
                ₦{a}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Btn icon={CreditCard} onClick={() => setGateway("paystack")}>
            Give with Paystack
          </Btn>
          <Btn tone="ghostDark" icon={CreditCard} onClick={() => setGateway("flutterwave")}>
            Give with Flutterwave
          </Btn>
        </div>

        {gateway && (
          <div className="mt-4">
            <PlaceholderNote>
              ⚠ {gateway === "paystack" ? "Paystack" : "Flutterwave"} merchant credentials
              are not configured yet, so no charge can be initiated. Giving {purpose}
              {amount ? ` of ₦${amount}` : ""} — please use bank transfer below in the
              meantime.
            </PlaceholderNote>
          </div>
        )}
      </div>

      <div className="border-ink bg-porcelain mt-6 border-2 p-6">
        <div className="flex items-center gap-2">
          <Building2 size={18} color="#C81E3A" />
          <Display as="h2" className="text-2xl">
            BANK TRANSFER
          </Display>
        </div>
        <p className="mt-2 text-sm opacity-75">
          Prefer your bank app? Transfer directly to the church account.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="font-label w-32 shrink-0 text-xs font-bold uppercase">Bank</dt>
            <dd>Zenith Bank</dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-label w-32 shrink-0 text-xs font-bold uppercase">
              Account name
            </dt>
            <dd className="text-crimson font-semibold">
              [PLACEHOLDER — confirm with church office]
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="font-label w-32 shrink-0 text-xs font-bold uppercase">
              Account number
            </dt>
            <dd className="text-crimson font-semibold">
              [PLACEHOLDER — real account number required before launch]
            </dd>
          </div>
        </dl>
        <div className="mt-4">
          <PlaceholderNote>
            ⚠ No account number is published here until the church confirms the live
            details. Nothing has been invented.
          </PlaceholderNote>
        </div>
      </div>

      <p className="font-label mt-6 flex items-center gap-2 text-xs uppercase opacity-70">
        <Gift size={14} /> Thank you for sowing into the work of the gospel.
      </p>
    </Page>
  );
}