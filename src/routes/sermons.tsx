import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { Beam, Display, Label } from "@/components/site/ui";
import { APP_LINKS } from "@/lib/church-data";
import googlePlayBadge from "@/assets/google-play.png.asset.json";
import appStoreBadge from "@/assets/app-store.png.asset.json";

const TITLE = "Sermons — Seed of Christ Golden Church Worldwide";
const DESCRIPTION =
  "Listen to church messages and join prayer sessions through the official Seed of Christ Golden Church App.";

export const Route = createFileRoute("/sermons")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/sermons" },
    ],
    links: [{ rel: "canonical", href: "/sermons" }],
  }),
  component: SermonsPage,
});

function SermonsPage() {
  return (
    <main className="bg-indigo relative flex min-h-[68vh] items-center overflow-hidden px-4 py-16 md:px-8">
      <Beam style={{ top: "22%", opacity: 0.11 }} />
      <Beam style={{ bottom: "12%", opacity: 0.07 }} />
      <div className="relative mx-auto w-full max-w-3xl text-center">
        <Smartphone className="text-gold mx-auto mb-4" size={34} aria-hidden="true" />
        <Label dark>Official Church App</Label>
        <Display as="h1" className="text-5xl sm:text-6xl md:text-7xl" color="#F4F0E6">
          LISTEN. PRAY. STAY CONNECTED.
        </Display>
        <p className="text-paper mx-auto mt-5 max-w-xl text-base leading-7 opacity-85 md:text-lg">
          Access church messages and prayer sessions through the official Seed of Christ
          Golden Church App.
        </p>
        <div className="border-gold/50 mt-9 border-t pt-7">
          <p className="font-label text-gold mb-5 text-xs font-semibold uppercase">
            Download the App
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={APP_LINKS.android}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download the Seed of Christ Golden Church App on Google Play"
              className="inline-flex min-h-12 items-center justify-center"
            >
              <img
                src={googlePlayBadge.url}
                alt="Get it on Google Play"
                width="646"
                height="250"
                className="h-[60px] w-auto object-contain"
              />
            </a>
            <a
              href={APP_LINKS.ios}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download the Seed of Christ Golden Church App on the App Store"
              className="inline-flex min-h-12 items-center justify-center"
            >
              <img
                src={appStoreBadge.url}
                alt="Download on the App Store"
                width="240"
                height="80"
                className="h-[60px] w-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}