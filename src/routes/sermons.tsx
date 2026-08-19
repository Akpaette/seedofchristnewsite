import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Play } from "lucide-react";
import { Btn, Display, Page, SectionHead } from "@/components/site/ui";
import { SERMONS } from "@/lib/church-data";

const TITLE = "Sermons — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Browse messages from Seed of Christ Golden Church Worldwide by series or date. Every message includes captions and a transcript.";

export const Route = createFileRoute("/sermons")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/sermons" },
    ],
    links: [{ rel: "canonical", href: "/sermons" }],
  }),
  component: SermonsPage,
});

function SermonsPage() {
  const [series, setSeries] = useState("All");
  const [sort, setSort] = useState("newest");
  const allSeries = ["All", ...new Set(SERMONS.map((s) => s.series))];

  const filtered = useMemo(() => {
    const list = series === "All" ? SERMONS : SERMONS.filter((s) => s.series === series);
    return [...list].sort((a, b) =>
      sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
    );
  }, [series, sort]);

  return (
    <Page>
      <SectionHead
        as="h1"
        label="Media library"
        title="SERMONS"
        sub="Filter by series, or sort by date. Every message includes captions and a transcript."
      />
      <div className="mb-8 flex flex-wrap gap-3">
        <label className="sr-only" htmlFor="series">
          Filter by series
        </label>
        <select
          id="series"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className="border-ink border-2 px-3 py-2 text-sm font-semibold"
        >
          {allSeries.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="sort">
          Sort order
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border-ink border-2 px-3 py-2 text-sm font-semibold"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((s) => (
          <div
            key={s.title}
            className="border-ink flex flex-col gap-3 border-2 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Display as="h2" className="text-xl">
                {s.title.toUpperCase()}
              </Display>
              <div className="mt-1 text-xs opacity-70">
                {s.speaker} · {s.series} · {s.scripture} · {s.date}
              </div>
              <div className="text-crimson mt-1 text-[11px] font-semibold">
                Captions &amp; transcript available
              </div>
            </div>
            <Btn tone="ghostDark" icon={Play}>
              Watch
            </Btn>
          </div>
        ))}
      </div>
    </Page>
  );
}