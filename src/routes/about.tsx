import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Display, Label, Page, SectionHead } from "@/components/site/ui";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Page className="max-w-5xl">
      <SectionHead as="h1" label="Who we are" title="OUR HISTORY & BELIEFS" />

      <section aria-labelledby="history-heading" className="mb-16">
        <div className="border-ink bg-porcelain border-2 p-6 md:p-9">
          <Label>History &amp; origins</Label>
          <Display as="h2" className="text-3xl md:text-4xl">
            <span id="history-heading">THE STORY OF THE SEED</span>
          </Display>
          <div className="mt-5 max-w-3xl space-y-4 leading-7">
            <p>
              The Seed of Christ Golden Church, also known as the Land of Reality, is an
              evangelistic and teaching ministry founded in Nigeria by Apostle Solomon
              Moses Oni Mustapha, popularly known as Baba Sebioba.
            </p>
            <p>
              The ministry&apos;s story is one of obedience to a divine calling, unwavering
              faith, and a commitment to the proclamation of the Gospel and the teaching
              of God&apos;s Word.
            </p>
          </div>
          <div className="mt-9 grid gap-7 md:grid-cols-3">
            <HistoryBlock title="A Divine Calling">
              The journey of the ministry was shaped by a divine instruction directing
              Apostle Mustapha to relocate from Ikole-Ekiti to Ibadan, Oyo State. That step
              of obedience became a significant turning point in what would eventually
              become the Seed of Christ Golden Church. What began as an act of faith would
              develop into a growing ministry committed to evangelism, biblical teaching,
              spiritual transformation, and the empowerment of people through the work of
              the Holy Spirit.
            </HistoryBlock>
            <HistoryBlock title="The Beginning">
              The church officially opened on May 27, 2004, in a classroom in Akinde,
              Ibadan. The beginning was remarkably modest: the founder, his wife, and two
              other people. From that small gathering emerged a ministry built around a
              simple but enduring foundation — faith in God, commitment to His Word, and
              obedience to His calling.
            </HistoryBlock>
            <HistoryBlock title="Growth & Expansion">
              For more than two years, the ministry continued as a small and committed core
              fellowship. With time, the work expanded beyond its original gathering,
              establishing additional branches, including the Ota branch. The establishment
              of a Bible College further reflected the ministry&apos;s emphasis on biblical
              teaching, spiritual development, and raising people through the knowledge of
              God&apos;s Word. From a humble beginning of four people, the ministry continues
              its journey of reaching lives and extending its Gospel mandate.
            </HistoryBlock>
          </div>
        </div>
      </section>

      <section aria-labelledby="beliefs-heading" className="mb-20">
        <Label>Beliefs</Label>
        <Display as="h2" className="text-3xl md:text-4xl">
          <span id="beliefs-heading">WHAT WE BELIEVE</span>
        </Display>
        <p className="mt-4 max-w-3xl text-base leading-7 opacity-80">
          At the heart of the Seed of Christ Golden Church is a deep commitment to God&apos;s
          Word, the work of the Holy Spirit, evangelism, spiritual transformation, and the
          advancement of the Gospel of Jesus Christ.
        </p>
        <div className="mt-8 grid gap-x-8 gap-y-9 md:grid-cols-2">
          <Belief title="Holy Spirit-Led Transformation">
            We believe in the transforming work of the Holy Spirit in the life of the
            believer. The Christian journey is not merely about religious activity, but
            about becoming increasingly shaped by God&apos;s presence, His Word, and His purpose.
          </Belief>
          <Belief title="Biblical Teaching">
            God&apos;s Word remains central to the ministry. The church places strong emphasis
            on biblical teaching as a foundation for spiritual growth, understanding,
            faith, and Christian living.
          </Belief>
          <Belief title="Evangelism">
            The ministry carries an evangelistic mandate to proclaim the Gospel and reach
            people with the message of Jesus Christ. The advancement of the Gospel and the
            transformation of lives remain central to its mission.
          </Belief>
          <Belief title="Spiritual Empowerment & Deliverance">
            The ministry emphasizes spiritual empowerment and deliverance as expressions of
            its faith and ministry. Its desire is to see people strengthened spiritually,
            liberated from bondage, and equipped to live according to God&apos;s purpose.
          </Belief>
          <Belief title="Faith in God's Word">
            From the ministry&apos;s very first service, unwavering faith in the Word of God has
            remained a foundational message. Faith is understood not merely as a statement
            of belief, but as a response to God&apos;s Word and His promises. This emphasis
            continues to shape the ministry&apos;s teaching, worship, evangelism, and spiritual life.
          </Belief>
        </div>
      </section>

      <SectionHead label="Leadership" title="MEET OUR LEADERS" />
      <div className="grid gap-5 sm:grid-cols-2">
        {LEADERS.map((leader) => (
          <article key={leader.name} className="border-ink bg-porcelain border-2">
            <img
              src={leader.photoUrl}
              alt={`${leader.name}, ${leader.title} of Seed of Christ Golden Church Worldwide`}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover object-top"
            />
            <div className="border-gold border-t-4 p-5 md:p-6">
              <div className="font-label text-crimson mb-2 text-xs font-semibold uppercase">
                {leader.title}
              </div>
              <Display as="h3" className="text-2xl md:text-3xl">
                {leader.name.toUpperCase()}
              </Display>
              {leader.alsoKnownAs && (
                <p className="font-label mt-2 text-sm opacity-70">
                  Also known as {leader.alsoKnownAs}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <aside className="bg-ink mt-8 flex flex-col items-start justify-between gap-5 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <div className="font-label text-gold text-xs font-semibold uppercase">
            Wider church team
          </div>
          <p className="text-porcelain mt-2 max-w-xl">
            Explore the separately maintained directory of church staff and ministry workers.
          </p>
        </div>
        <a
          href="https://workforce.seedofchrist.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Explore the Seed of Christ Golden Church staff directory in a new tab"
          className="font-label bg-gold text-ink inline-flex min-h-12 items-center gap-2 px-6 py-3 text-sm font-bold uppercase transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          Explore Staff Directory
          <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </aside>
    </Page>
  );
}

function HistoryBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-gold border-t-4 pt-4">
      <Display as="h3" className="text-2xl">{title.toUpperCase()}</Display>
      <p className="mt-3 text-sm leading-7 opacity-80">{children}</p>
    </div>
  );
}

function Belief({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="border-line border-l-2 pl-5">
      <Display as="h3" className="text-2xl">{title.toUpperCase()}</Display>
      <p className="mt-2 text-sm leading-7 opacity-80">{children}</p>
    </article>
  );
}