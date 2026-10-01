import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, GraduationCap } from "lucide-react";
import { Display, Label, Page, SectionHead } from "@/components/site/ui";

const TITLE = "Bible College — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Seed of Christ Golden Church Land of Reality Worldwide Bible College — Christian teaching, discipleship and biblical learning in Ibadan.";

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

function BibleCollegePage() {
  return (
    <Page className="max-w-5xl">
      <SectionHead
        as="h1"
        label="Teaching · Discipleship · Biblical learning"
        title="Seed of Christ Golden Church Land of Reality Worldwide Bible College"
        sub="Ibadan, Oyo State, Nigeria"
      />
      <div className="grid overflow-hidden border border-line bg-ink text-porcelain md:grid-cols-[0.85fr_1.15fr]">
        <div className="flex min-h-72 items-center justify-center border-b border-line/20 p-10 md:border-r md:border-b-0">
          <GraduationCap className="text-gold" size={96} strokeWidth={0.8} aria-hidden="true" />
        </div>
        <div className="p-7 md:p-12">
          <Label dark>A place to be grounded</Label>
          <Display as="h2" className="text-3xl md:text-5xl" color="var(--color-porcelain)">Rooted in the Word</Display>
          <div className="mt-6 space-y-5 leading-8 text-porcelain/70">
            <p>The Bible College reflects the ministry's established commitment to biblical teaching and spiritual development through the knowledge of God's Word.</p>
            <p>It is presented as a place for serious Christian learning and discipleship, encouraging believers to grow in understanding, faith, and faithful service.</p>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <article className="border-t border-gold pt-5"><BookOpen className="mb-5 text-golddeep" /><Display as="h2" className="text-2xl">Biblical learning</Display><p className="mt-3 leading-7 text-foreground/70">Teaching centred on God's Word as the foundation for spiritual growth, understanding, faith, and Christian living.</p></article>
        <article className="border-t border-gold pt-5"><GraduationCap className="mb-5 text-golddeep" /><Display as="h2" className="text-2xl">Discipleship</Display><p className="mt-3 leading-7 text-foreground/70">A setting for believers to deepen their walk with God and be strengthened for purposeful service in the work of the Gospel.</p></article>
      </div>
      <aside className="mt-14 border-y border-line py-8 md:flex md:items-center md:justify-between"><div><div className="font-label text-xs text-golddeep">College enquiries</div><p className="mt-2">Contact the church office for confirmed information.</p></div><a href="mailto:info@seedofchrist.org" className="font-label mt-5 inline-flex min-h-12 items-center gap-2 bg-gold px-5 py-3 text-xs font-semibold uppercase text-ink md:mt-0">info@seedofchrist.org <ArrowUpRight size={16} /></a></aside>
    </Page>
  );
}