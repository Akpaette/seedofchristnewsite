import { Facebook, Instagram, Music2, Youtube } from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/church-data";

const LINKS = [
  { ...SOCIAL_LINKS.facebook, icon: Facebook },
  { ...SOCIAL_LINKS.instagram, icon: Instagram },
  { ...SOCIAL_LINKS.youtube, icon: Youtube },
  { ...SOCIAL_LINKS.tiktok, icon: Music2 },
] as const;

export function SocialLinks({ showLabels = false }: { showLabels?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Official social media channels">
      {LINKS.map(({ name, handle, href, icon: Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow ${name} on ${name}`}
          className="inline-flex min-h-11 items-center gap-2 border border-porcelain/25 px-3 text-porcelain/80 transition-colors hover:border-gold hover:text-gold"
        >
          <Icon size={18} aria-hidden="true" />
          {showLabels && <span className="font-label text-[0.66rem] font-semibold uppercase">{handle}</span>}
        </a>
      ))}
    </div>
  );
}