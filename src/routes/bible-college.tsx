import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
import { Display, Page, PlaceholderNote, SectionHead } from "@/components/site/ui";

const TITLE = "Bible College — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Seed of Christ Bible College, Ibadan — training ministers for the work of the gospel. Programmes and admissions information.";

export const Route = createFileRoute("/bible-college")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/bible-college" },
    ],
    links: [{ rel: "canonical", href: "/bible-college" }],
  }),
  component: BibleCollegePage,
});

const SECTIONS = [
  "Programmes offered",
  "Admission requirements",
  "Term calendar",
  "How to apply",
];

function BibleCollegePage() {
  return (
    <Page className="max-w-3xl">
      <SectionHead
        as="h1"
        label="Raising ministers"
        title="SEED OF CHRIST BIBLE COLLEGE"
        sub="Ibadan, Oyo State, Nigeria"
      />
      <div className="border-ink bg-porcelain mb-8 border-2 p-6">
        <GraduationCap color="#C81E3A" className="mb-3" />
        <PlaceholderNote>
          [PLACEHOLDER — the college's own description, awaiting copy from the
          administration. No details have been invented.]
        </PlaceholderNote>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s} className="border-ink border-2 p-5">
            <Display as="h2" className="text-lg">
              {s.toUpperCase()}
            </Display>
            <div className="mt-3">
              <PlaceholderNote>[PLACEHOLDER — pending from the college]</PlaceholderNote>
            </div>
          </div>
        ))}
      </div>
    </Page>
  );
}