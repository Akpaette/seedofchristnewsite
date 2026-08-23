import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { NAV_PRIMARY, NAV_MORE } from "@/lib/church-data";
import logoAsset from "@/assets/church-logo.jpg.asset.json";

const ITEMS = [...NAV_PRIMARY, ...NAV_MORE];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">


      <div className="bg-ink flex items-center justify-between px-4 py-3 md:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-left">
          <img
            src={logoAsset.url}
            alt="Seed of Christ Golden Church Worldwide crest: two doves over a globe"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div className="leading-tight">
            <div
              className="font-display text-porcelain text-sm font-bold"
              style={{ letterSpacing: "0.02em" }}
            >
              SEED OF CHRIST GOLDEN CHURCH
            </div>
            <div className="text-gold text-[10px] tracking-[0.2em]">WORLDWIDE</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="font-label text-porcelain px-3 py-2 text-xs font-semibold tracking-wide uppercase"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="p-2 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X color="#F4F0E6" /> : <Menu color="#F4F0E6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="bg-ink2 flex flex-col lg:hidden">
          {ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => setMenuOpen(false)}
              className="font-label text-porcelain border-b border-white/10 px-5 py-3.5 text-left text-sm font-semibold tracking-wide uppercase"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}