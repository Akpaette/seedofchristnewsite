import { Link } from "@tanstack/react-router";
import { Home as HomeIcon, Play, HandHeart, BookOpen } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/sermons", label: "Watch", icon: Play },
  { to: "/give", label: "Give", icon: HandHeart },
  { to: "/prayer", label: "Prayer", icon: BookOpen },
] as const;

export default function BottomTabs() {
  return (
    <nav
      aria-label="Quick navigation"
      className="fixed right-0 bottom-0 left-0 z-40 flex items-stretch border-t border-gold/40 bg-ink/95 backdrop-blur-xl lg:hidden"
    >
      {TABS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="font-label flex min-h-14 flex-1 flex-col items-center justify-center gap-1 py-2 text-[0.56rem] font-semibold uppercase text-porcelain/70"
          activeProps={{ className: "text-gold" }}
        >
          <Icon size={19} />
          {label}
        </Link>
      ))}
    </nav>
  );
}