"use client";
/* Figma: "RepairFeedback" — ไฟล์ Maintain-D หน้า Design (node 0:1) · สเปก figma-spec/RepairFeedback.json (CLAUDE.md ข้อ 12)
   คะแนนความพึงพอใจ 1–5 (S14) · ค่าเริ่มหัวข้อของไฟล์ "คะแนนประเมินคุณภาพงานซ่อมบำรุง" — S14 ส่ง Title เอง
   ค่า: Section header (Title · Supporting text ถ้ามี) → ห่าง 16 → Radio แถวเดียว ช่องไฟ 12 (มือถือ 8 ยังแถวเดียว) Radio text card "1"…"5" กว้างเท่ากัน ไม่มี Supporting text
   มือถือ: การ์ด 5 ใบในแถวเดียวกว้างไม่พอขอบใน 16 → ขอบในข้าง 12 (COMPOSED.md จ.) */
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
