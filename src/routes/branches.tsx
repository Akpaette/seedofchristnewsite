import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { BranchMap } from "@/components/site/BranchMap";
import { Display, Flag, Page, SectionHead, inputClass } from "@/components/site/ui";
import { BRANCH_COORDINATES } from "@/lib/branch-coordinates";
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
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string>();
  const shown = useMemo(() => {
    const term = query.trim().toLocaleLowerCase();
    return sortBranches(filterBranches(BRANCHES, filter)).filter((branch) =>
      !term || `${branch.name} ${branch.address} ${branch.state ?? ""}`.toLocaleLowerCase().includes(term),
    );
  }, [filter, query]);
  const mappedCount = shown.filter((branch) => BRANCH_COORDINATES[branch.name]).length;

  const selectBranch = (name: string) => {
    setSelectedName(name);
    window.requestAnimationFrame(() => document.getElementById(`branch-${slug(name)}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  return (
    <Page>
      <SectionHead
        as="h1"
        label="Find us"
        title="Our Branches"
        sub="Explore all 67 supplied locations across Nigeria and the United Kingdom. Map markers appear only where a locality has been verified."
      />

      <div className="mb-10 bg-ink p-3 md:p-5">
        <div className="mb-4 flex flex-col gap-2 px-1 text-porcelain md:flex-row md:items-end md:justify-between">
          <div><div className="font-label text-xs text-gold">Verified locations</div><p className="mt-1 text-sm text-porcelain/60">Select a marker or a mapped branch below.</p></div>
          <p className="font-label text-xs text-porcelain/55">{mappedCount} of {shown.length} visible branches mapped</p>
        </div>
        <BranchMap branches={shown} selectedName={selectedName} onSelect={selectBranch} />
      </div>

      <div className="mb-8 grid gap-4 border-y border-line py-5 md:grid-cols-[1fr_18rem] md:items-end">
        <div>
          <label htmlFor="branch-search" className="font-label mb-2 block text-xs font-semibold uppercase">Search branches</label>
          <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-golddeep" size={17} /><input id="branch-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, address, or state" className={`${inputClass} pl-11`} /></div>
        </div>
        <div>
          <label
            htmlFor="state-filter"
            className="font-label mb-2 block text-xs font-semibold uppercase"
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
      </div>
      <p className="font-label mb-5 text-xs uppercase opacity-70" aria-live="polite">Showing {shown.length} of {BRANCHES.length} branches</p>

      <div className="grid gap-px bg-line md:grid-cols-2">
        {shown.map((b) => (
          <article id={`branch-${slug(b.name)}`} key={`${b.name}|${b.address}`} className={`bg-porcelain p-6 transition-colors ${selectedName === b.name ? "ring-2 ring-inset ring-gold" : ""}`}>
            <div className="flex flex-wrap items-center gap-2">
              <MapPin size={16} className="text-golddeep" aria-hidden="true" />
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
            {BRANCH_COORDINATES[b.name] ? (
              <button type="button" onClick={() => setSelectedName(b.name)} className="font-label mt-5 inline-flex min-h-11 items-center gap-2 border border-ink px-4 py-2 text-xs font-semibold uppercase transition-colors hover:bg-ink hover:text-porcelain"><LocateFixed size={15} /> Show on map</button>
            ) : <p className="font-label mt-5 text-[0.68rem] uppercase text-foreground/50">Verified map position pending</p>}
          </article>
        ))}
      </div>
    </Page>
  );
}

function slug(value: string) {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
