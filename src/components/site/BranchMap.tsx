import { useEffect, useState, type ComponentType } from "react";
import type { Branch } from "@/lib/branches-data";

type Props = { branches: Branch[]; selectedName: string | undefined; onSelect: (name: string) => void };

export function BranchMap(props: Props) {
  const [Map, setMap] = useState<ComponentType<Props> | null>(null);
  useEffect(() => {
    let active = true;
    void import("./BranchMap.client").then((module) => {
      if (active) setMap(() => module.default);
    });
    return () => { active = false; };
  }, []);

  if (!Map) {
    return (
      <div className="flex h-[24rem] items-center justify-center border border-line/35 bg-ink2 md:h-[32rem]" role="status">
        <span className="font-label text-xs uppercase text-porcelain/60">Loading branch map…</span>
      </div>
    );
  }
  return <Map {...props} />;
}
