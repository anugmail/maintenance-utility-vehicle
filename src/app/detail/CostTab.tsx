"use client";
/* S18 แท็บ "ต้นทุนการบำรุงรักษา" ของหน้ารายละเอียดแผนที่อนุมัติแล้ว (R92 · Figma c450480 costBody · ไฟล์ 14 Scenario 18)
   โครงตามหน้า 5.13 EV charging costs for each agency ของ UI Release#2 (ไม่มีกราฟ): Metric item ×4 → Section label "สรุปรายไตรมาส" + Table (ไตรมาส 1–4 + รวมทั้งแผน)
   → Section label "ต้นทุนรายคัน (n)" + Table COST_COLS → Section label "ยานพาหนะที่บำรุงรักษาไม่ได้ (n)" + Table เดียวกัน · ดูอย่างเดียว
   → (11 พ.ย. 2569) Section label "ยานพาหนะที่จ้างดำเนินการ (n)" + Table ทะเบียน · ศูนย์ต้นทุน · ค่าจ้าง · ค่าเดินทาง · รวม
   ยังไม่มียานพาหนะปิดงาน = Empty state/Data empty ไม่มีปุ่ม · ข้อมูล lib/mock/cost.ts
   อ้างอิง: Metric item · Section label · Table · Mobile table · Empty state/Data empty ของไฟล์ Component + หน้า 5.13 ของ UI Release#2 */
import { SectionLabel } from "@/components/vms/SectionLabel";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { Metrics } from "@/app/parts/_lib/ui";
import { DataTable } from "@/app/quarter/_shared/ui";
import { COST_COLS, HIRE_COST_COLS, QCOST_COLS, costMetrics, costRow, hireCostRow, quarterCostRows, type CarCost } from "@/lib/mock/cost";

export const COST_EMPTY = { Text: "ยังไม่มีต้นทุนการบำรุงรักษา", SupportingText: "ต้นทุนจะแสดงเมื่อยานพาหนะในแผนเดินทางที่ดำเนินการเอง ปิดงานคันแรก" };

export function CostTab({ rows, planCars }: { rows: CarCost[]; planCars: number }) {
  if (!rows.length) return <EmptyStateDataEmpty {...COST_EMPTY} />;
  const done = rows.filter((r) => !r.cannot && !r.hire), cannot = rows.filter((r) => r.cannot && !r.hire), hired = rows.filter((r) => r.hire);
  return (
    <div className="flex flex-col gap-8">
      <Metrics items={costMetrics(rows, planCars)} />
      <section className="flex flex-col gap-4">
        <SectionLabel Title="สรุปรายไตรมาส" />
        <DataTable columns={QCOST_COLS} rows={quarterCostRows(rows)} />
      </section>
      <section className="flex flex-col gap-4">
        <SectionLabel Title={"ต้นทุนรายคัน (" + done.length + ")"} />
        <DataTable columns={COST_COLS} rows={done.map(costRow)} />
      </section>
      {hired.length > 0 && <section className="flex flex-col gap-4">
        {/* 11 พ.ย. 2569 แผนจ้างดำเนินการ (ค่าจ้าง ค่าเดินทาง ที่กรอกตอนตรวจรับ) — ข้อเสนอแยกหัวข้อ */}
        <SectionLabel Title={"ยานพาหนะที่จ้างดำเนินการ (" + hired.length + ")"} />
        <DataTable columns={HIRE_COST_COLS} rows={hired.map(hireCostRow)} />
      </section>}
      {cannot.length > 0 && <section className="flex flex-col gap-4">
        <SectionLabel Title={"ยานพาหนะที่บำรุงรักษาไม่ได้ (" + cannot.length + ")"} />
        <DataTable columns={COST_COLS} rows={cannot.map(costRow)} />
      </section>}
    </div>
  );
}
