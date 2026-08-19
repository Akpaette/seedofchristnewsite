import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Display, Flag, Page, SectionHead } from "@/components/site/ui";
import { BRANCHES, isPlaceholder } from "@/lib/church-data";

const TITLE = "Branches — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Find a Seed of Christ Golden Church Worldwide branch: Ibadan headquarters, Sango Ota, Ilesha, and London/Enfield.";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/branches" },
    ],
    links: [{ rel: "canonical", href: "/branches" }],
  }),
  component: BranchesPage,
});

function BranchesPage() {
  return (
    <Page>
      <SectionHead
        as="h1"
        label="Find us"
        title="BRANCHES"
        sub="Locations across Nigeria and the United Kingdom. Street addresses and phone numbers are awaiting confirmation."
      />

      {/* Map frame is wired for an embed; the provider key is not configured yet. */}
      <div className="border-crimson bg-paper text-ink font-label mb-8 flex aspect-[16/7] flex-col items-center justify-center gap-2 border-2 border-dashed px-4 text-center text-xs font-semibold uppercase">
        <MapPin size={22} color="#C81E3A" />
        Interactive branch map
        <Flag>Map provider key not configured</Flag>
      </div>

      <div className="space-y-3">
        {BRANCHES.map((b) => {
          const unnamed = isPlaceholder(b.name);
          return (
            <div
              key={b.name}
              className={`border-2 p-5 ${unnamed ? "border-crimson" : "border-ink"}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <MapPin size={16} color="#C81E3A" />
                <Display as="h2" className="text-xl">
                  {b.name.toUpperCase()}
                </Display>
                {b.hq && (
                  <span className="bg-gold text-ink font-label px-2 py-0.5 text-[10px] font-bold uppercase">
                    HQ
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm opacity-70">
                {b.state} · {b.address}
              </div>
              <div className="mt-2">
                <Flag>Phone &amp; service times pending — {b.phone}</Flag>
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}