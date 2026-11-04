"use client";
/* หน้าแรกของต้นแบบ: รายการ 21 scenario ตามลำดับงาน — Page header + Table (desktop) / Mobile table (มือถือ) ของไลบรารี
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

export default function Home() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const rows: TableValue[][] = SCENARIOS.map((s) => [
    s.id, s.name, s.phase, s.role,
    { pills: [s.href ? ["พร้อมใช้", "Success"] : ["เร็วๆ นี้", "Gray"]] },
    { actions: [{ IconSwap: "quick_reference_all-24-300-round", label: "เปิด " + s.id, onClick: () => router.push(s.href ?? "/soon/?s=" + s.id) }] },
  ]);
  return (
    <AppFrame>
      <PageHeader Title="บำรุงรักษาตามวาระ" SupportingText="ต้นแบบหน้าจอตาม scenario ที่เคาะแล้ว เรียงตามลำดับงาน" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]}
        Actions={<SecondaryButton Text="ชุด component" LeadingIconSwap="description-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/kit/")} />} />
      {mob ? <MobileCards columns={COLS} rows={rows} /> : <Table columns={COLS} rows={rows} />}
    </AppFrame>
  );
}
