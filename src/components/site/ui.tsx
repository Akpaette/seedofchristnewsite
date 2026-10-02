import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity .7s ease, transform .7s ease",
      }}
    >
      {children}
    </div>
  );
}

export function Beam({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        width: "160%",
        height: "56px",
        left: "-30%",
        background:
          "linear-gradient(90deg, transparent, var(--color-gold) 35%, var(--color-gold) 65%, transparent)",
        transform: "rotate(-7deg)",
        opacity: 0.14,
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}

export function Label({
  children,
  dark,
}: {
  children: ReactNode;
  dark?: boolean | undefined;
}) {
  return (
    <div
      className={`font-label mb-3 text-xs font-semibold uppercase ${dark ? "text-gold" : "text-golddeep"}`}
    >
      {children}
    </div>
  );
}

export function Display({
  children,
  className = "text-4xl md:text-6xl",
  color,
  as: Tag = "h2",
}: {
  children: ReactNode;
  className?: string;
  color?: string | undefined;
  as?: "h1" | "h2" | "h3" | "div";
}) {
  return (
    <Tag
      className={`font-display leading-[1.05] ${className}`}
      style={{ color: color || "var(--color-ink)" }}
    >
      {children}
    </Tag>
  );
}

export function SectionHead({
  label,
  title,
  sub,
  dark,
  as = "h2",
}: {
  label?: string | undefined;
  title: string;
  sub?: string | undefined;
  dark?: boolean | undefined;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-9">
      {label && <Label dark={dark}>{label}</Label>}
      <Display as={as} color={dark ? "var(--color-porcelain)" : "var(--color-ink)"}>
        {title}
      </Display>
      {sub && (
        <p
          className={`mt-3 max-w-xl text-base ${dark ? "text-paper" : "text-charcoal"} opacity-75`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

const TONES = {
  gold: "bg-gold text-ink border-2 border-gold",
  crimson: "bg-crimson text-porcelain border-2 border-crimson",
  ghost: "bg-transparent text-porcelain border-2 border-porcelain",
  ghostDark: "bg-transparent text-ink border-2 border-ink",
} as const;

export function Btn({
  children,
  onClick,
  tone = "gold",
  icon: Icon = ArrowUpRight,
  type = "button",
  disabled,
  ariaExpanded,
  ariaControls,
}: {
  children: ReactNode;
  onClick?: (() => void) | undefined;
  tone?: keyof typeof TONES;
  icon?: LucideIcon;
  type?: "button" | "submit";
  disabled?: boolean | undefined;
  ariaExpanded?: boolean | undefined;
  ariaControls?: string | undefined;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={`font-label inline-flex min-h-12 items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 ${TONES[tone]}`}
    >
      {children}
      <Icon size={15} />
    </button>
  );
}

/** Crimson-flagged marker for content that is not yet confirmed. */
export function Flag({ children }: { children: ReactNode }) {
  return (
    <span className="font-label bg-crimson text-porcelain inline-block px-2 py-1 text-[11px] font-bold uppercase">
      ⚠ {children}
    </span>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-crimson text-crimson font-label border-2 border-dashed p-3 text-xs font-semibold uppercase">
      {children}
    </p>
  );
}

export function Page({
  children,
  className = "max-w-4xl",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto px-5 py-20 md:px-8 md:py-28 ${className}`}>{children}</div>
  );
}

export const inputClass =
  "w-full border border-line bg-transparent px-4 py-3 text-sm transition-colors focus:border-gold";