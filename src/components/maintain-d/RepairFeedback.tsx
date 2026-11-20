"use client";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export function RepairFeedback({ Title = "คะแนนประเมินคุณภาพงานซ่อมบำรุง", SupportingText, value, onChange, Disabled, Breakpoint: bp, className }: {
  Title?: string; SupportingText?: string; value?: number | null; onChange?: (n: number) => void; Disabled?: boolean; Breakpoint?: Breakpoint; className?: string;
}) {
  const mob = useBreakpoint(bp) === "Mobile";
  return (
    <section className={cx("flex flex-col gap-4", className)}>
      <SectionHeader Title={Title} SupportingText={SupportingText} Breakpoint={bp} />
      <div role="radiogroup" aria-label={Title} className={cx("flex [&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0", mob ? "gap-2" : "gap-3")}>
        {[1, 2, 3, 4, 5].map((n) => <RadioTextCard key={n} Text={String(n)} Selected={value === n} State={Disabled ? "Disabled" : "Default"} onClick={() => onChange?.(n)} className={mob ? (value === n ? "px-[11px]" : "px-3") : undefined} />)}
      </div>
    </section>
  );
}
