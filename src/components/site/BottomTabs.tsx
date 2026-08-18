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
      className="bg-ink border-gold fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t-2 lg:hidden"
    >
      {TABS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="font-label text-porcelain flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase"
          activeProps={{ className: "text-gold" }}
        >
          <Icon size={19} />
          {label}
        </Link>
      ))}
    </nav>
  );
}