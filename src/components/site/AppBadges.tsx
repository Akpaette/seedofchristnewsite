import { useState } from "react";
import { Smartphone } from "lucide-react";
import { APP_LINKS } from "@/lib/church-data";
import { Btn } from "./ui";
import googlePlayBadge from "@/assets/google-play.png.asset.json";
import appStoreBadge from "@/assets/app-store.png.asset.json";

const STORES = [
  {
    href: APP_LINKS.android,
    label: "Download the Seed of Christ Golden Church App on Google Play",
    src: googlePlayBadge.url,
    alt: "Get it on Google Play",
  },
  {
    href: APP_LINKS.ios,
    label: "Download the Seed of Christ Golden Church App on the App Store",
    src: appStoreBadge.url,
    alt: "Download on the App Store",
  },
] as const;

export function AppBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 sm:flex-row ${className}`}>
      {STORES.map((store) => (
        <a
          key={store.href}
          href={store.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={store.label}
          className="flex h-16 w-[196px] items-center justify-center border border-porcelain/20 bg-ink px-3 transition-colors hover:border-gold"
        >
          <img
            src={store.src}
            alt={store.alt}
            className="max-h-12 max-w-[168px] object-contain"
          />
        </a>
      ))}
    </div>
  );
}

export function DeviceAwareAppButton({
  children,
  tone = "ghost",
}: {
  children: string;
  tone?: "gold" | "crimson" | "ghost" | "ghostDark";
}) {
  const [showChoices, setShowChoices] = useState(false);

  const openAppStore = () => {
    const ua = navigator.userAgent;
    const isIpadDesktopMode = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;

    if (/Android/i.test(ua)) {
      window.location.assign(APP_LINKS.android);
      return;
    }
    if (/iPhone|iPad|iPod/i.test(ua) || isIpadDesktopMode) {
      window.location.assign(APP_LINKS.ios);
      return;
    }
    setShowChoices((current) => !current);
  };

  return (
    <div className="flex flex-col items-center">
      <Btn
        tone={tone}
        icon={Smartphone}
        onClick={openAppStore}
        ariaExpanded={showChoices}
        ariaControls="app-store-options"
      >
        {children}
      </Btn>
      {showChoices && (
        <div id="app-store-options" className="mt-4" aria-live="polite">
          <p className="font-label mb-3 text-center text-xs font-semibold uppercase text-gold">
            Choose your app store
          </p>
          <AppBadges />
        </div>
      )}
    </div>
  );
}