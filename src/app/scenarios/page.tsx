"use client";
/* หน้า /scenarios/ ของต้นแบบ (เปิดจากลิงก์ "ต้นแบบบำรุงรักษาตามวาระ" ในแถบต้นแบบ · รากเว็บเป็นรายการแผนแบบระบบจริง): รายการ scenario ตามลำดับงาน — Page header + Table
   10 พ.ย. 2569 (Figma 33a990c กรอบ "ตัดออกแล้ว"): scenario ที่ใช้ 17 รายการในตารางหลัก · ที่ตัดออก 8 รายการ (S3 S5 S11 S14 S15 S16 S17 S22) แยกหัวข้อ "Scenario ที่ตัดออกแล้ว"
   ดูอย่างเดียว (scenario · ชื่อ · เหตุผล) ไม่มีปุ่มเปิด ไม่มีลิงก์เข้าหน้าที่ไม่มีแล้ว (desktop) / Mobile table (มือถือ) ของไลบรารี
   ไม่ใช่จอใน Figma (เป็นสารบัญของต้นแบบ) · ดู figma-spec/COMPOSED.md */
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { guideByCode } from "@/lib/guide/scenarios";
import { scenarioHref } from "@/lib/guide/start";
import { ACTIVE_SCENARIOS, CUT_SCENARIOS } from "@/lib/scenarios";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS: TableColumn[] = [
  { head: "scenario", width: 110, Style: "Lead text" },
  { head: "ชื่อ", Style: "Text" },
  { head: "ช่วงงาน", width: 220 },
  { head: "บทบาท", width: 200 },
  { head: "สถานะ", width: 130, Style: "Badge" },
  { head: "", width: 112, Style: "Action icons" },
];

/* scenario ที่ตัดออก: ดูอย่างเดียว */
const CUT_COLS: TableColumn[] = [{ head: "scenario", width: 110, Style: "Lead text" }, { head: "ชื่อ", Style: "Text" }, { head: "เหตุผลที่ตัดออก", width: 420 }];

export default function Scenarios() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  /* โหมดพาดูทีละเรื่อง — ปุ่ม "ดูเคส" ข้างปุ่มเปิด → หน้าเรื่อง /scenarios/guide/ */
  const guideAction = (id: string) => { const g = guideByCode(id); return g ? [{ IconSwap: "school-24-300-round", label: "ดูเคส " + id, onClick: () => router.push(scenarioHref(g.key)) }] : []; };
  const rows: TableValue[][] = ACTIVE_SCENARIOS().map((s) => [
    s.id, s.name, s.phase, s.role,
    { pills: [s.href ? ["พร้อมใช้", "Success"] : ["เร็วๆ นี้", "Gray"]] },
    { actions: [{ IconSwap: "quick_reference_all-24-300-round", label: "เปิด " + s.id, onClick: () => router.push(s.href ?? "/soon/?s=" + s.id) }, ...guideAction(s.id)] },
  ]);
  const cut = CUT_SCENARIOS();
  const cutRows: TableValue[][] = cut.map((s) => [s.id, s.name, s.cut ?? "-"]);
  return (
    <AppFrame>
      <PageHeader Title="ต้นแบบบำรุงรักษาตามวาระ" SupportingText={"ต้นแบบหน้าจอตาม scenario ที่เคาะแล้ว " + rows.length + " scenario เรียงตามลำดับงาน"} crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "รายการ scenario" }]}
        Actions={<SecondaryButton Text="ชุด component" LeadingIconSwap="description-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/kit/")} />} />
      <div className="flex flex-col gap-8">
        {mob ? <MobileCards columns={COLS} rows={rows} /> : <Table columns={COLS} rows={rows} />}
        <section className="flex flex-col gap-4">
          <SectionLabel Title={"Scenario ที่ตัดออกแล้ว (" + cut.length + ")"} />
          {mob ? <MobileCards columns={CUT_COLS} rows={cutRows} /> : <Table columns={CUT_COLS} rows={cutRows} />}
        </section>
      </div>
    </AppFrame>
  );
}
