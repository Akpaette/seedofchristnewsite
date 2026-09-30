import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { NAV_PRIMARY, NAV_MORE } from "@/lib/church-data";
import logoAsset from "@/assets/church-logo.jpg.asset.json";

const ITEMS = [...NAV_PRIMARY, ...NAV_MORE];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-porcelain/10 bg-ink/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
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
              className="font-display max-w-48 text-[0.68rem] font-bold text-porcelain sm:max-w-none sm:text-xs"
            >
              SEED OF CHRIST GOLDEN CHURCH
            </div>
            <div className="font-label mt-1 text-[0.55rem] text-gold">WORLDWIDE</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-0 xl:flex">
          {ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="font-label border-b border-transparent px-2.5 py-3 text-[0.61rem] font-semibold uppercase text-porcelain/70 transition-colors hover:text-gold"
              activeProps={{ className: "border-gold text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="p-2 xl:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X color="#F4F0E6" /> : <Menu color="#F4F0E6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto bg-ink2 xl:hidden">
          {ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              onClick={() => setMenuOpen(false)}
              className="font-label border-b border-white/10 px-5 py-3.5 text-left text-xs font-semibold uppercase text-porcelain"
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