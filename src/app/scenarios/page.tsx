"use client";
/* หน้า /scenarios/ ของต้นแบบ (เปิดจากลิงก์ "ต้นแบบบำรุงรักษาตามวาระ" ในแถบต้นแบบ · รากเว็บเป็นรายการแผนแบบระบบจริง): รายการ scenario ตามลำดับงาน (20 ที่ใช้ + S11 S23 ที่ตัดออกท้ายตาราง แบบ SCEN_CUT ของ screens.js) — Page header + Table (desktop) / Mobile table (มือถือ) ของไลบรารี
   ไม่ใช่จอใน Figma (เป็นสารบัญของต้นแบบ) · ดู figma-spec/COMPOSED.md */
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { SCENARIOS } from "@/lib/scenarios";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS: TableColumn[] = [
  { head: "scenario", width: 110, Style: "Lead text" },
  { head: "ชื่อ", Style: "Text" },
  { head: "ช่วงงาน", width: 220 },
  { head: "บทบาท", width: 200 },
  { head: "สถานะ", width: 130, Style: "Badge" },
  { head: "", width: 72, Style: "Action icons" },
];

export default function Scenarios() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  /* แถวที่ตัดออก: ชื่อ + บรรทัดรองเหตุผล · ป้าย "ตัดออก" · ปุ่มเปิดพาไปหน้าที่ใช้แทน (S10 แผนจ้าง) */
  const rows: TableValue[][] = SCENARIOS.map((s) => [
    s.id, s.cut ? { text: s.name, sub: s.cut } : s.name, s.phase, s.role,
    { pills: [s.cut ? ["ตัดออก", "Error"] : s.href ? ["พร้อมใช้", "Success"] : ["เร็วๆ นี้", "Gray"]] },
    { actions: [{ IconSwap: "quick_reference_all-24-300-round", label: s.cut ? "เปิด S10 แผนจ้าง (แทน " + s.id + ")" : "เปิด " + s.id, onClick: () => router.push(s.href ?? "/soon/?s=" + s.id) }] },
  ]);
  return (
    <AppFrame>
      <PageHeader Title="ต้นแบบบำรุงรักษาตามวาระ" SupportingText="ต้นแบบหน้าจอตาม scenario ที่เคาะแล้ว เรียงตามลำดับงาน" crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "รายการ scenario" }]}
        Actions={<SecondaryButton Text="ชุด component" LeadingIconSwap="description-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/kit/")} />} />
      {mob ? <MobileCards columns={COLS} rows={rows} /> : <Table columns={COLS} rows={rows} />}
    </AppFrame>
  );
}
