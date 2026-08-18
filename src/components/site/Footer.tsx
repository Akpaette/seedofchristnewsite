import { Link } from "@tanstack/react-router";
import { Facebook, Youtube, Instagram, Radio as RadioIcon, Tv } from "lucide-react";
import { NAV_MORE } from "@/lib/church-data";
import { Display } from "./ui";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper px-4 pt-14 pb-24 md:px-8 lg:pb-10">
      <div className="mx-auto grid max-w-5xl gap-8 text-sm md:grid-cols-4">
        <div>
          <Display as="div" className="text-2xl" color="#E7B23A">
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
          <div className="flex gap-3">
            <Facebook size={18} />
            <Youtube size={18} />
            <Instagram size={18} />
            <RadioIcon size={18} />
            <Tv size={18} />
          </div>
          <p className="mt-2 text-xs opacity-50">
            Facebook · YouTube · Instagram · Radio · Sebioba Royal TV
          </p>
          <p className="text-gold mt-2 text-[11px] font-semibold uppercase">
            ⚠ Social links pending
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-white/10 pt-6 text-xs opacity-50">
        © {year} Seed of Christ Golden Church Worldwide. All rights reserved.
      </div>
    </footer>
  );
}