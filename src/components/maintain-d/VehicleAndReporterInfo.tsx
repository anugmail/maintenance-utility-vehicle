"use client";
/* Figma: "VehicleAndReporterInfo" — ไฟล์ Maintain-D หน้า รายละเอียดงานซ่อม (node 175:79986) · สเปก figma-spec/VehicleAndReporterInfo.json (CLAUDE.md ข้อ 12)
   กล่องแสดงข้อมูล desktop ที่ vehicleInfo() ใน screens.js ยืมมา · มือถือ = patterns/DisplayBox (แถวละ 2) ตามปลั๊กอิน
   ค่า: Section label (Title · ไม่มี Supporting/Actions) → ห่าง 8 → Content พื้น gray-50 รัศมี 8 ขอบใน 24 ช่องไฟแถว 16
        แถว = Content item row Column width=Full ช่องไฟ 16 · ช่อง = _Content item base Type="Text with label" ไม่มีไอคอน (Label 16 SemiBold · Text 16 Regular black)
        แถวละ 4 ช่อง (ช่องที่ 2–4 เปิดตามจำนวน · Item 2/3/4) · BudgetSource ในกล่องซ่อนตาม vehicleInfo() */
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
