import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Youtube, Instagram, Radio as RadioIcon, Tv, Play } from "lucide-react";
import { Beam, Btn, Display, Label, Reveal, SectionHead, inputClass } from "@/components/site/ui";
import { SERMONS } from "@/lib/church-data";

const TITLE = "Seed of Christ Golden Church Worldwide — Ibadan to London";
const DESCRIPTION =
  "A golden generation of faith. Worship with Seed of Christ Golden Church Worldwide — Ibadan headquarters, with branches in Sango Ota, Ilesha and London/Enfield.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

const GALLERY = [
  "Sunday worship",
  "Choir ministration",
  "Bible college class",
  "Outreach & fellowship",
  "Children's church",
];

const CHANNELS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Youtube, label: "YouTube" },
  { icon: Instagram, label: "Instagram" },
  { icon: RadioIcon, label: "Radio" },
  { icon: Tv, label: "Sebioba Royal TV" },
];

function Index() {
  const [signedUp, setSignedUp] = useState(false);

  return (
    <>
      <section className="bg-ink relative overflow-hidden px-4 pt-16 pb-20 md:px-8">
        <Beam style={{ top: "18%" }} />
        <Beam style={{ top: "62%", opacity: 0.08 }} />
        <div className="relative mx-auto max-w-4xl text-center">
          <Label dark>Ibadan · Sango Ota · Ilesha · London/Enfield · Worldwide</Label>
          <Display as="h1" className="text-6xl sm:text-7xl md:text-8xl" color="#F4F0E6">
            A GOLDEN <span className="text-gold">GENERATION</span> OF FAITH
          </Display>
          <p className="text-paper mx-auto mt-6 max-w-xl text-lg opacity-75">
            “Go ye into all the world, and preach the gospel to every creature.” — Mark
            16:15
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/branches">
              <Btn tone="gold">Plan a Visit</Btn>
            </Link>
            <Link to="/radio">
              <Btn tone="ghost" icon={Play}>
                Watch Live
              </Btn>
            </Link>
          </div>
        </div>

        <div
          className="relative mx-auto mt-16 flex max-w-6xl gap-3 overflow-x-auto pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {GALLERY.map((cap, i) => (
            <div
              key={cap}
              className={`font-label border-crimson flex aspect-[4/5] w-[70vw] shrink-0 items-end border-2 border-dashed p-4 text-xs font-semibold tracking-wide uppercase sm:w-[280px] ${i % 2 ? "bg-indigo text-porcelain" : "bg-paper text-ink"}`}
              style={{ scrollSnapAlign: "start" }}
            >
              ⚠ [REAL PHOTO NEEDED — {cap}]
            </div>
          ))}
        </div>
      </section>

      <section className="bg-porcelain relative overflow-hidden px-4 py-16 md:px-8">
        <Beam style={{ top: "8%", opacity: 0.1 }} />
        <div className="relative mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
          <img
            src={apostlePhoto.url}
            alt="Apostle Dr. S.M.O. Mustapha JP, General Overseer of Seed of Christ Golden Church Worldwide, in red ministerial vestments"
            loading="lazy"
            decoding="async"
            className="border-ink w-full border-2 object-cover"
          />
          <div>
            <Label>Our General Overseer</Label>
            <Display as="h2" className="text-4xl md:text-5xl">
              APOSTLE DR. S.M.O. MUSTAPHA JP
            </Display>
            <p className="font-label mt-2 text-xs uppercase opacity-60">
              Also known as Baba Sebioba · with Prophetess Eunice Mustapha (Mama
              Sebioba), Mother in Israel
            </p>
            <p className="mt-4 max-w-lg text-base opacity-75">
              Shepherding the church from the Ibadan headquarters to branches across
              Nigeria and the United Kingdom.
            </p>
            <div className="mt-6">
              <Link to="/about">
                <Btn tone="ghostDark">Meet our leaders</Btn>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <Reveal>
          <SectionHead label="Latest from us" title="RECENT MESSAGES" />
          {SERMONS.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {SERMONS.slice(0, 3).map((s, i) => (
                <Link
                  key={s.title}
                  to="/sermons"
                  className={`border-ink block border-2 p-6 text-left transition hover:-translate-y-1 ${i === 0 ? "bg-ink" : "bg-porcelain"}`}
                >
                  <div className="font-label text-crimson mb-3 text-xs font-semibold tracking-wide uppercase">
                    {s.series} · {s.date}
                  </div>
                  <Display as="h3" className="text-2xl" color={i === 0 ? "#F4F0E6" : "#17130F"}>
                    {s.title.toUpperCase()}
                  </Display>
                  <div
                    className={`mt-3 text-xs opacity-60 ${i === 0 ? "text-paper" : "text-charcoal"}`}
                  >
                    {s.speaker} · {s.scripture}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-ink text-charcoal border-2 p-10 text-center opacity-70">
              Nothing posted yet — check back soon.
            </div>
          )}
        </Reveal>
      </section>

      <section className="bg-paper px-4 py-16 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHead label="Stay in the loop" title="MEDIA & MINISTRY" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
              {CHANNELS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="bg-ink border-ink flex flex-col items-center gap-2 border-2 p-5 text-center"
                >
                  <Icon size={22} color="#E7B23A" />
                  <span className="font-label text-porcelain text-xs font-semibold tracking-wide uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 text-center md:px-8">
        <Reveal>
          <SectionHead
            label="Stay connected"
            title="JOIN THE FAMILY LIST"
            sub="Get service updates, event notices, and prayer prompts from Seed of Christ Golden Church Worldwide."
          />
          {signedUp ? (
            <p className="border-ink text-ink border-2 p-6">
              Thank you — you're on the family list.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSignedUp(true);
              }}
              className="flex flex-col justify-center gap-2 sm:flex-row"
            >
              <label className="sr-only" htmlFor="family-email">
                Email address
              </label>
              <input
                id="family-email"
                type="email"
                required
                placeholder="you@example.com"
                className={`${inputClass} flex-1`}
              />
              <Btn tone="crimson" type="submit">
                Sign up
              </Btn>
            </form>
          )}
        </Reveal>
      </section>

      <section className="bg-crimson relative overflow-hidden px-4 py-20 md:px-8">
        <Beam style={{ top: "30%", opacity: 0.12 }} />
        <div className="relative mx-auto max-w-xl text-center">
          <Display className="text-4xl md:text-5xl" color="#F4F0E6">
            QUESTION? PRAYER REQUEST?
          </Display>
          <p className="text-porcelain my-5 opacity-85">
            We would love to hear from you and stand with you in prayer.
          </p>
          <Link to="/prayer">
            <Btn tone="ghost">Send a Prayer Request</Btn>
          </Link>
        </div>
      </section>
    </>
  );
}
