import { useState } from "react";
import { Pause, Play } from "lucide-react";
import p44 from "@/assets/church-photo-44.jpg.asset.json";
import p45 from "@/assets/church-photo-45.jpg.asset.json";
import p46 from "@/assets/church-photo-46.jpg.asset.json";
import p49 from "@/assets/church-photo-49.jpg.asset.json";
import p51 from "@/assets/church-photo-51.jpg.asset.json";
import p53 from "@/assets/church-photo-53.jpg.asset.json";
import p54 from "@/assets/church-photo-54.jpg.asset.json";
import p55 from "@/assets/church-photo-55.jpg.asset.json";
import p58 from "@/assets/church-photo-58.jpg.asset.json";
import p0047 from "@/assets/church-worship-0047.jpg.asset.json";
import p0048 from "@/assets/church-worship-0048.jpg.asset.json";
import p0053 from "@/assets/church-worship-0053.jpg.asset.json";

const PHOTOS = [
  { src: p44.url, alt: "Minister addressing a full congregation in the Seed of Christ Golden Church auditorium" },
  { src: p45.url, alt: "Minister in white speaking into a microphone beside a smiling young man in a white robe" },
  { src: p46.url, alt: "A packed auditorium of worshippers lifting their hands in praise" },
  { src: p49.url, alt: "Church members standing together and worshipping at the front of the hall" },
  { src: p51.url, alt: "Members on an outreach march carrying a gospel placard through the street" },
  { src: p53.url, alt: "Congregation under blue stage lights praising God in a large worship hall" },
  { src: p54.url, alt: "Sepia photo of members dancing joyfully during a street evangelism outreach" },
  { src: p55.url, alt: "Black-and-white photo of the evangelism team holding placards on the street" },
  { src: p58.url, alt: "Wide view of a full congregation seated in rows during a service" },
  { src: p0048.url, alt: "Church leaders standing together at the front of the sanctuary during a service" },
  { src: p0053.url, alt: "A large congregation lifting their hands and worship materials during a prayer gathering" },
  { src: p0047.url, alt: "Worshippers gathered across the church auditorium during a lively service" },
];

/** Continuously drifting photo strip. Pausable; static & scrollable under reduced motion. */
export function PhotoReel() {
  const [paused, setPaused] = useState(false);
  const loop = [...PHOTOS, ...PHOTOS];

  return (
    <div className="relative mx-auto mt-16 max-w-6xl">
      <div className="photo-reel overflow-hidden pb-2" data-paused={paused || undefined}>
        <ul className="photo-reel-track flex w-max gap-3">
          {loop.map((p, i) => (
            <li
              key={i}
              aria-hidden={i >= PHOTOS.length || undefined}
              className="border-gold/40 aspect-[4/5] w-[70vw] shrink-0 overflow-hidden border-2 sm:w-[280px]"
            >
              <img
                src={p.src}
                alt={i >= PHOTOS.length ? "" : p.alt}
                loading={i < 4 ? "eager" : "lazy"}
                decoding="async"
                width={280}
                height={350}
                className="photo-reel-img h-full w-full object-cover"
                style={{ animationDelay: `${-(i % PHOTOS.length) * 2.3}s` }}
              />
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        aria-label={paused ? "Play photo slideshow" : "Pause photo slideshow"}
        className="photo-reel-toggle bg-ink/80 text-porcelain border-gold absolute right-2 bottom-4 flex h-9 w-9 items-center justify-center border"
      >
        {paused ? <Play size={16} /> : <Pause size={16} />}
      </button>
    </div>
  );
}
