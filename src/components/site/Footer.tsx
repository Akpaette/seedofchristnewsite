import { Link } from "@tanstack/react-router";
import { NAV_MORE } from "@/lib/church-data";
import { Display } from "./ui";
import { SocialLinks } from "./SocialLinks";
import logoAsset from "@/assets/church-logo.jpg.asset.json";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gold/20 bg-ink px-5 pt-20 pb-24 text-paper md:px-8 lg:pb-10">
      <div className="mx-auto grid max-w-6xl gap-12 text-sm md:grid-cols-4">
        <div>
          <img
            src={logoAsset.url}
            alt="Seed of Christ Golden Church Worldwide crest: two doves over a globe"
            width={56}
            height={56}
            loading="lazy"
            className="mb-3 h-14 w-14 object-contain"
          />
          <Display as="div" className="text-xl" color="var(--color-gold)">
            SEED OF CHRIST GOLDEN CHURCH
          </Display>
          <p className="mt-2 text-xs leading-relaxed opacity-60">
            Headquartered in Ibadan, Oyo State, Nigeria — with branches across Nigeria,
            the UK, and beyond.
          </p>
        </div>

        <div>
          <div className="text-gold font-label mb-2 text-xs font-semibold tracking-wider uppercase">
            Explore
          </div>
          <ul className="space-y-1.5 opacity-80">
            <li><Link to="/give" className="hover:underline">Give</Link></li>
            {NAV_MORE.map((i) => (
              <li key={i.to}>
                <Link to={i.to} className="hover:underline">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-gold font-label mb-2 text-xs font-semibold tracking-wider uppercase">
            Plan a visit
          </div>
          <p className="text-xs leading-relaxed opacity-80">
            Find your nearest branch on the{" "}
            <Link to="/branches" className="underline">
              Branches
            </Link>{" "}
            page.
          </p>
          {/* Service times withheld until the church confirms them. */}
          <p className="text-gold mt-2 text-[11px] font-semibold uppercase">
            ⚠ Service times pending confirmation
          </p>
        </div>

        <div>
          <div className="text-gold font-label mb-2 text-xs font-semibold tracking-wider uppercase">
            Follow along
          </div>
          <SocialLinks />
          <p className="mt-3 text-xs opacity-50">Official ministry accounts</p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-white/10 pt-6 text-xs opacity-50">
        © {year} Seed of Christ Golden Church Worldwide. All rights reserved.
      </div>
    </footer>
  );
}