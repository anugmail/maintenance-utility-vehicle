"use client";
import { DisplayBox, chunk } from "@/components/patterns/DisplayBox";
import { ContentItemRow, type KvPair } from "@/components/vms/ContentItemRow";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export function VehicleAndReporterInfo({ Title = "ข้อมูลยานพาหนะ", pairs, Breakpoint: bp, className }: { Title?: string; pairs: KvPair[]; Breakpoint?: Breakpoint; className?: string }) {
  const mob = useBreakpoint(bp) === "Mobile";
  if (mob) return <DisplayBox Title={Title} pairs={pairs} Breakpoint="Mobile" className={className} />;
  return (
    <section className={cx("flex flex-col gap-2", className)}>
      <SectionLabel Title={Title} className="min-h-10" />
      <div className="flex flex-col gap-4 rounded-md bg-gray-50 p-6">
        {chunk(pairs, 4).map((row, i) => <ContentItemRow key={i} items={row} perRow={4} gap="gap-4" />)}
      </div>
    </section>
  );
}
