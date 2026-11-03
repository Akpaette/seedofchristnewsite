import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Smartphone, ArrowDown } from "lucide-react";
import { Btn, Display, Label, Reveal, SectionHead, inputClass } from "@/components/site/ui";
import { PhotoReel } from "@/components/site/PhotoReel";
import { AppBadges, DeviceAwareAppButton } from "@/components/site/AppBadges";
import { SocialLinks } from "@/components/site/SocialLinks";
import { UpNextPanel } from "@/components/site/UpNext";
import apostlePhoto from "@/assets/apostle-mustapha.jpg.asset.json";
import heroPhoto from "@/assets/church-worship-0047.jpg.asset.json";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});


function Index() {
  const [signedUp, setSignedUp] = useState(false);

  return (
    <>
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col justify-center overflow-hidden bg-ink px-5 py-20 md:px-8">
        <img src={heroPhoto.url} alt="Worshippers gathered across the Seed of Christ Golden Church auditorium" className="absolute inset-0 h-full w-full object-cover opacity-35 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink" />
        <div className="relative mx-auto w-full max-w-7xl text-center">
          <Label dark>Official website · Ibadan, Nigeria · Worldwide</Label>
          <Display as="h1" className="mx-auto mt-6 max-w-6xl text-5xl sm:text-7xl md:text-8xl lg:text-9xl" color="var(--color-porcelain)">
            Seed <em className="font-normal text-gold">of</em> Christ<br /><span className="mt-3 block text-3xl sm:text-5xl md:text-6xl">Golden Church Worldwide</span>
          </Display>
          <div className="mx-auto mt-10 max-w-2xl border-t border-gold/35 pt-8">
            <p className="text-paper mx-auto max-w-xl text-base leading-8 opacity-80 md:text-lg">
              The Land of Reality — an evangelistic and teaching ministry rooted in God's Word and the work of the Holy Spirit.
            </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/branches">
              <Btn tone="gold">Plan a Visit</Btn>
            </Link>
            <DeviceAwareAppButton>Watch Live on the App</DeviceAwareAppButton>
          </div></div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-gold"><ArrowDown size={20} aria-hidden="true" /></div>
      </section>

      <UpNextPanel />

      <section className="bg-ink px-5 pb-20 md:px-8"><div className="mx-auto max-w-7xl"><div className="mb-5 flex items-end justify-between gap-4 border-b border-porcelain/15 pb-4"><div><Label dark>Church life</Label><p className="text-sm text-porcelain/55">Worship, fellowship and mission</p></div></div><PhotoReel /></div></section>

      <section className="relative overflow-hidden bg-ink px-5 py-24 text-porcelain md:px-8 md:py-36">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[minmax(0,420px)_1fr] md:gap-20">
          <div className="relative before:absolute before:-top-4 before:-left-4 before:h-full before:w-full before:border before:border-gold/30">
          <img
            src={apostlePhoto.url}
            alt="Apostle Dr. S.M.O. Mustapha JP, General Overseer of Seed of Christ Golden Church Worldwide, in red ministerial vestments"
            loading="lazy"
            decoding="async"
            className="relative aspect-[4/5] w-full object-cover object-top grayscale transition duration-700 hover:grayscale-0"
          />
          </div>
          <div>
            <Label dark>Our General Overseer</Label>
            <Display as="h2" className="text-4xl md:text-6xl" color="var(--color-porcelain)">
              Apostle Dr. S.M.O. Mustapha JP
            </Display>
            <p className="font-label mt-3 text-xs uppercase text-gold">
              Also known as Baba Sebioba · with Prophetess Eunice Mustapha (Mama
              Sebioba), Mother in Israel
            </p>
            <p className="mt-6 max-w-lg text-base leading-8 text-porcelain/65">
              Shepherding the church from the Ibadan headquarters to branches across
              Nigeria and the United Kingdom.
            </p>
            <div className="mt-6">
              <Link to="/about">
                <Btn tone="ghost">Meet our leaders</Btn>
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="bg-porcelain px-5 py-24 md:px-8">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionHead label="Stay in the loop" title="MEDIA & MINISTRY" />
            <div className="bg-ink p-6 md:p-8"><SocialLinks showLabels /></div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="app-heading" className="relative overflow-hidden bg-ink2 px-5 py-24 md:px-8">
        <div className="relative mx-auto max-w-3xl text-center">
          <Smartphone size={28} className="mx-auto mb-3 text-gold" aria-hidden="true" />
          <Label dark>Official mobile app</Label>
          <Display as="h2" className="text-4xl md:text-5xl" color="var(--color-porcelain)">
            <span id="app-heading">SEED OF CHRIST GOLDEN CHURCH APP</span>
          </Display>
          <p className="text-porcelain mx-auto mt-4 max-w-xl opacity-80">
            Stay connected to the ministry wherever you are. Listen to messages, prayer
            sessions, and other church content directly from the Seed of Christ Golden
            Church App.
          </p>
          <AppBadges className="mt-8" />
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

      <section className="relative overflow-hidden bg-gold px-5 py-24 md:px-8">
        <div className="relative mx-auto max-w-xl text-center">
          <Display className="text-4xl md:text-5xl" color="var(--color-ink)">
            QUESTION? PRAYER REQUEST?
          </Display>
          <p className="my-5 text-ink/75">
            We would love to hear from you and stand with you in prayer.
          </p>
          <Link to="/prayer">
            <Btn tone="ghostDark">Send a Prayer Request</Btn>
          </Link>
        </div>
      </section>
    </>
  );
}
