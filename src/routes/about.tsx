import { createFileRoute } from "@tanstack/react-router";
import { Display, Flag, Page, PlaceholderNote, SectionHead } from "@/components/site/ui";
import { LEADERS } from "@/lib/church-data";

const TITLE = "About — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Our history, our beliefs, and the leadership of Seed of Christ Golden Church Worldwide, headquartered in Ibadan, Nigeria.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Page>
      <SectionHead as="h1" label="Who we are" title="OUR HISTORY & BELIEFS" />
      <div className="mb-16 grid gap-4 md:grid-cols-2">
        {["Our History", "What We Believe"].map((t) => (
          <div key={t} className="border-ink bg-porcelain border-2 p-6">
            <Display as="h3" className="text-xl">
              {t.toUpperCase()}
            </Display>
            <div className="mt-3">
              <PlaceholderNote>
                [PLACEHOLDER — awaiting copy from the church for {t.toLowerCase()}. Nothing
                has been invented here.]
              </PlaceholderNote>
            </div>
          </div>
        ))}
      </div>

      <SectionHead label="Leadership" title="MEET OUR LEADERS" />
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {LEADERS.map((l, i) => {
          const incomplete = !l.name || !l.title;
          return (
            <div
              key={i}
              className={`border-2 ${incomplete ? "border-crimson" : "border-ink"}`}
            >
              {l.photoUrl ? (
                <img
                  src={l.photoUrl}
                  alt={`${l.name}, ${l.title}, Seed of Christ Golden Church Worldwide`}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] w-full object-cover object-top"
                />
              ) : (
                <div className="bg-paper text-crimson font-label flex aspect-[4/3] items-center justify-center px-2 text-center text-xs font-semibold uppercase">
                  [REAL PHOTO NEEDED]
                </div>
              )}
              <div className="p-4">
                {incomplete ? (
                  <Flag>Incomplete profile — flagged for the church</Flag>
                ) : (
                  <>
                    <Display as="h3" className="text-xl">
                      {l.name.toUpperCase()}
                    </Display>
                    {l.alsoKnownAs && (
                      <div className="font-label text-xs opacity-60">
                        Also known as {l.alsoKnownAs}
                      </div>
                    )}
                    <div className="mt-1 text-sm opacity-70">{l.title}</div>
                    <div className="text-crimson mt-1 text-xs font-semibold">{l.branch}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Page>
  );
}