"use client";
import type { ReactNode } from "react";
import { ContentItemRow, type KvPair } from "@/components/vms/ContentItemRow";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export function chunk<T>(a: T[], n: number): T[][] { const out: T[][] = []; for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; }

export function DisplayBox({ Title, pairs, perRow, Actions, Breakpoint: bp, className }: { Title?: string; pairs: KvPair[]; perRow?: number; Actions?: ReactNode; Breakpoint?: Breakpoint; className?: string }) {
  const mob = useBreakpoint(bp) === "Mobile";
  const n = mob ? 2 : perRow ?? 4;
  return (
    <section className={cx("flex flex-col gap-4", className)}>
      {Title && <SectionLabel Title={Title} Actions={Actions} />}
      <div className="flex flex-col gap-6 rounded-md bg-gray-50 p-6">
        {chunk(pairs, n).map((row, i) => <ContentItemRow key={i} items={row} perRow={n} />)}
      </div>
    </section>
  );
}
