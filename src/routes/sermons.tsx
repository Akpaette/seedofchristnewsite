import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { Beam, Display, Label } from "@/components/site/ui";
import { AppBadges } from "@/components/site/AppBadges";

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
          <AppBadges />
        </div>
      </div>
    </main>
  );
}