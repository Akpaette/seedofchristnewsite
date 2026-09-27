import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { Display, Flag, Page, SectionHead, inputClass } from "@/components/site/ui";
import {
  BRANCHES,
  INTERNATIONAL,
  branchStates,
  filterBranches,
  sortBranches,
} from "@/lib/branches-data";

const TITLE = "Branches — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Find any of the 67 Seed of Christ Golden Church Worldwide branches across Nigeria and the United Kingdom, filterable by state.";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/branches" },
    ],
    links: [{ rel: "canonical", href: "/branches" }],
  }),
  component: BranchesPage,
});

const STATES = branchStates(BRANCHES);
const HAS_INTL = BRANCHES.some((b) => b.international);

function BranchesPage() {
  const [filter, setFilter] = useState("all");
  const shown = useMemo(() => sortBranches(filterBranches(BRANCHES, filter)), [filter]);

  return (
    <Page>
      <SectionHead
        as="h1"
        label="Find us"
        title="BRANCHES"
        sub="Locations across Nigeria and the United Kingdom. Phone numbers and service times are awaiting confirmation."
      />

      {/* Map frame is wired for an embed; the provider key is not configured yet. */}
      <div className="border-crimson bg-paper text-ink font-label mb-8 flex aspect-[16/7] flex-col items-center justify-center gap-2 border-2 border-dashed px-4 text-center text-xs font-semibold uppercase">
        <MapPin size={22} color="#C81E3A" />
        Interactive branch map
        <Flag>Map provider key not configured</Flag>
      </div>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <label
            htmlFor="state-filter"
            className="font-label mb-1 block text-xs font-semibold tracking-wide uppercase"
          >
            Filter by State
          </label>
          <select
            id="state-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`${inputClass} w-full`}
          >
            <option value="all">All States</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s} State
              </option>
            ))}
            {HAS_INTL && <option value={INTERNATIONAL}>International</option>}
          </select>
        </div>
        <p className="font-label text-xs uppercase opacity-70" aria-live="polite">
          Showing {shown.length} of {BRANCHES.length} branches
        </p>
      </div>

      <div className="space-y-3">
        {shown.map((b) => (
          <div key={`${b.name}|${b.address}`} className="border-ink border-2 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <MapPin size={16} color="#C81E3A" aria-hidden="true" />
              <Display as="h2" className="text-xl break-words">
                {b.name.toUpperCase()}
              </Display>
              {b.hq && (
                <span className="bg-gold text-ink font-label px-2 py-0.5 text-[10px] font-bold uppercase">
                  HQ
                </span>
              )}
            </div>
            <p className="mt-1 text-sm break-words opacity-80">{b.address}</p>
            <div className="font-label mt-2 text-xs uppercase opacity-60">
              {b.state ? `${b.state} State` : b.international ? "International" : "State not provided"}
              {b.country ? ` · ${b.country}` : ""}
            </div>
            <div className="mt-2">
              {b.phone ? (
                <span className="text-sm">Tel {b.phone}</span>
              ) : (
                <Flag>Phone &amp; service times pending</Flag>
              )}
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}
