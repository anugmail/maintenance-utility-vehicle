"use client";
/* S1 S19 · หน้า ดูอะไหล่ของยานพาหนะ (/car-parts/view/?id=new|Z7000004&q=1&car=82-6789) — carPartsView() ใน screens.js (6 พ.ย. 2569)
   เข้าจากเมนู "…" → ดูรายละเอียด ที่แถวยานพาหนะในแท็บไตรมาส n ของฟอร์มแผน (เจ้าของงาน 6 พ.ย. 2569 "เพิ่ม ... ดูรายละเอียด แก้ไข ลบ ของรถแต่ละคัน")
   ตาม `Page header` · `Section label` · `Table` · `Empty state/Data empty` · `Secondary button` ของไฟล์ Component + VehicleAndReporterInfo ของไฟล์ Maintain-D
   + หน้า Detail ของ UI Release#2 (Page header มีปุ่ม "แก้ไข" แบบหน้ารายละเอียดแผน planDetail · Section label R3 + กล่องข้อมูล R12)
   Page header "อะไหล่ของยานพาหนะ {ทะเบียน}" + Secondary button "แก้ไข" (stylus) → หน้าจัดการอะไหล่ของยานพาหนะ (S21 /car-parts/)
   · Breadcrumbs บำรุงรักษาตามวาระ › สร้างแผน (แก้ไข: แก้ไขแผน MR …) › อะไหล่ของยานพาหนะ
   Content ช่องไฟ 32: กล่อง "ข้อมูลยานพาหนะ" (ทะเบียน · ยี่ห้อ/รุ่น · หน่วยงานเจ้าของยานพาหนะ · ไตรมาส · น้ำมันไฮโดรลิก · เปลี่ยนน้ำมันครั้งล่าสุด · การเบิกอะไหล่)
     → Section label "อะไหล่อื่นๆ (n)" + Table CARP_PART_COLS 6 คอลัมน์ ไม่มีไอคอนท้ายแถว / Empty state ("ยานพาหนะคันนี้เลือกไม่เบิกอะไหล่" · "ยังไม่ได้กำหนดอะไหล่ของยานพาหนะคันนี้")
   ข้อมูลชุดเดียวกับหน้าจัดการอะไหล่ (ฟอร์มที่กรอกค้าง mock.draft / mock.edit) · ดูอย่างเดียว ไม่มีปุ่มท้ายหน้า · มือถือ: Mobile table · ปุ่มแก้ไขใต้หัวข้อ */
import { PagedTable } from "@/app/quarter/_shared/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { AppFrame } from "@/components/shell/AppFrame";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { type TableValue } from "@/components/vms/Table";
import { CAND, LAST_OIL, PARTS, PART_BM } from "@/lib/mock/data";
import { carQty } from "@/lib/mock/plan";
import { NO_DRAW, PLAN_ROLES, TODO_NONE, carIndexOf, findPlan, oilCellOf, oilChoice, otherParts, useRoleGuard, usePlanGate } from "@/lib/mock/planFlow";
import { useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { CARP_PART_COLS } from "../cols";

const COLS = CARP_PART_COLS.slice(0, 6);

function CarPartsView() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(PLAN_ROLES);
  const mock = useMock();
  const id = sp.get("id") ?? "new";
  const plan = id === "new" ? undefined : findPlan(mock.plans, id);
  const denied = usePlanGate(plan);   // หน่วยงานเปิดแผนของหน่วยงานอื่น → หน้ารายการ (ตรวจสิทธิ์ 9 พ.ย. 2569)
  const d = id === "new" ? mock.draft : mock.edit && plan && mock.edit.editOf === plan.mr ? mock.edit : null;
  const car = carIndexOf(sp.get("car"));
  const from = sp.get("from");
  const formHref = id === "new" ? "/new/" : "/edit/?id=" + id + (from ? "&from=" + from : "");
  const missing = !d || car < 0 || d.alloc[car] == null;
  useEffect(() => { if (ok && missing) router.replace(formHref); }, [ok, missing, formHref, router]);   // ไม่มีฟอร์มค้าง / ยานพาหนะไม่อยู่ในไตรมาสแล้ว → กลับฟอร์ม
  if (!ok || !d || missing) return null;
  if (denied) return null;

  const c = CAND[car];
  const q = d.alloc[car];
  const none = d.draw?.[car] === "none";
  const k = oilChoice(d, car), oc = oilCellOf(d, car);
  const oil = typeof oc === "string" ? oc : k ? oc.text + " · " + oc.sub : oc.text;
  const draw = none ? NO_DRAW : otherParts(d, car).length ? "เบิกอะไหล่" : TODO_NONE;
  const kv: [string, string][] = [["ทะเบียน", c.plate], ["ยี่ห้อ/รุ่น", c.model], ["หน่วยงานเจ้าของยานพาหนะ", c.owner], ["ไตรมาส", "ไตรมาส " + q],
    ["น้ำมันไฮโดรลิก", oil], ["เปลี่ยนน้ำมันครั้งล่าสุด", LAST_OIL[car]], ["การเบิกอะไหล่", draw]];
  const rows: TableValue[][] = none ? [] : [
    ...(d.picks[car] || []).filter((x) => x !== 0).map((x) => [PARTS[x].name, PART_BM[x][0], PART_BM[x][1], PARTS[x].code, String(carQty(d, car, x)), PARTS[x].unit]),
    ...(d.manual?.[car] ?? []).map((m) => [m.name, m.brand || "-", m.model || "-", m.code || "-", String(m.qty), m.unit || "-"]),
  ];
  const editHref = "/car-parts/?id=" + id + "&q=" + q + "&car=" + sp.get("car") + (from ? "&from=" + from : "");

  return (
    <>
      <PageHeader Title={"อะไหล่ของยานพาหนะ " + c.plate} onBack={() => router.push(formHref)}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: plan ? "แก้ไขแผน " + plan.mr : "สร้างแผน", href: formHref }, { Text: "อะไหล่ของยานพาหนะ" }]}
        Actions={<SecondaryButton Text="แก้ไข" LeadingIconSwap="stylus-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push(editHref)} />} />
      <div className="flex flex-col gap-8">
        <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={kv} />
        <section className="flex flex-col gap-4">
          <SectionLabel Title={"อะไหล่อื่นๆ (" + rows.length + ")"} />
          {rows.length
            ? <PagedTable columns={COLS} rows={rows} />
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={none ? "ยานพาหนะคันนี้เลือกไม่เบิกอะไหล่" : "ยังไม่ได้กำหนดอะไหล่ของยานพาหนะคันนี้"} />}
        </section>
      </div>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><CarPartsView /></Suspense></AppFrame>;
}
