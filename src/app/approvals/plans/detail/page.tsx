"use client";
/* S2 · หน้า ตรวจสอบแผนบำรุงรักษา (/approvals/plans/detail/?id=Z7000004) — planReview() ใน screens.js · เฉพาะบทบาท ผู้อนุมัติ
   Page header "ตรวจสอบแผนบำรุงรักษา" · ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › แผนรออนุมัติ › ชื่อแผน · Badge outline = สถานะแผน
   เนื้อหา ช่องไฟ 32 (planReview() ปรับ 5 พ.ย. 2569 รีวิวทีมออกแบบ):
     รออนุมัติ: ผลการพิจารณาบนสุด (approvals/_shared/Decision · ไม่มีค่าเริ่มต้น) → PlanBody (รายละเอียดแผน + รถในแผน แยกแท็บไตรมาส ดูอย่างเดียว)
       → อะไหล่ในแผน (planPartsSec · 6 พ.ย. 2569 เจ้าของงาน "อยากเพิ่ม section อะใหล่ โดย group ชนิด ประเภท จำนวน ไม่แยกรายคัน แต่ละไตรมาส"):
         Section label "อะไหล่ในแผน" + Tabs ไตรมาส 1–4 (ตัวเลข = จำนวนรายการ) + Table QPART_COLS ชนิด · รหัสอะไหล่ · ประเภท · จำนวน · หน่วย (R81 ชุดเดียวกับอะไหล่ในไตรมาสของ S1 · รวมทุกคันของไตรมาส เรียงตามประเภท · คันที่ไม่เบิกไม่รวม)
         ไม่มีอะไหล่ = Empty state "ยังไม่มีรายการอะไหล่" / "ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" · ตาม Section label + Tabs + Table ของไฟล์ Component (แบบส่วนรถในแผนของหน้าเดียวกัน)
       → ปุ่ม ย้อนกลับ · ยืนยันผลการพิจารณา (lg · Disabled จนกว่าจะเลือก และถ้าส่งกลับต้องมีเหตุผล)
       อนุมัติ → ยืนยันอนุมัติแผนบำรุงรักษา → สถานะ อนุมัติแล้ว + toast "อนุมัติแผนบำรุงรักษาสำเร็จ" อย่างเดียว · ส่งกลับ → ยืนยันส่งกลับแก้ไข → รายการ + toast
       6 พ.ย. 2569 เจ้าของงาน "ส่งจำนวนทั้งปีไปที่ smartinventory โดยยังไม่ส่งให้ตัด แค่ inform" ⇒ อนุมัติแล้วระบบแจ้งจำนวนอะไหล่ทั้งปีให้ Smart Inventory ทราบ (ยังไม่ตัดจากคลัง)
         แทน S22 กบค. คลัง กดรับทราบรายไตรมาส (ตัดออก) · บอกในบรรทัดรองของยืนยันอนุมัติ (screens.js S2 "อนุมัติ — ยืนยันอนุมัติแผน") · ไม่มีจอ/สถานะแยกของการแจ้ง
       ผู้อนุมัติย้ายยานพาหนะระหว่างไตรมาสหรือแก้ไขแผนเองไม่ได้ (เนื้อหาดูอย่างเดียว ไม่มีปุ่ม/ไอคอนแก้ไข ย้าย เอาออก) — ต้องการให้เปลี่ยน = เลือกส่งกลับแก้ไขให้ผู้สร้างแผน (S19)
     อนุมัติแล้ว: ไม่มีผลการพิจารณา ไม่มีปุ่ม ไม่มี Alert ("ไม่ต้องแสดง Alert อนุมัติแผนแล้ว ซ้ำ ให้แสดงแค่ Toast") */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Table } from "@/components/vms/Table";
import { Tabs } from "@/components/vms/Tabs";
import { cx } from "@/lib/cx";
import { PST, QUARTERS, type Plan } from "@/lib/mock/data";
import { QPART_COLS, qpartRow, thaiToday } from "@/lib/mock/plan";
import { allocOf, badgeOf, findPlan, quarterRows, updatePlan, useRoleGuard } from "@/lib/mock/planFlow";
import { notify, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PlanBody } from "@/app/detail/PlanBody";
import { DecisionSection, useDecision } from "../../_shared/Decision";

const LIST = "/approvals/plans/";
const APPROVE_SUB = "แผนผ่านการตรวจสอบ หน่วยงานเริ่มงานรายไตรมาสได้", RETURN_SUB = "แจ้งเหตุผลให้ผู้สร้างแผนแก้ไขแล้วส่งใหม่";   // 6 พ.ย. 2569 ผู้สร้างแผน = หน่วยงาน
/* planQParts (screens.js 6 พ.ย. 2569) — ประเภท = หมวด · ชนิด = รายการ · จำนวนรวมทุกคันของไตรมาส เรียงตามประเภท · คอลัมน์ QPART_COLS (R81 ชุดเดียวทุกหน้า) */
const planQParts = (p: Plan, k: number) => quarterRows(allocOf(p), k).sort((a, b) => a.group.localeCompare(b.group, "th")).map(qpartRow);
function PlanParts({ plan, q, onQ, mob }: { plan: Plan; q: number; onQ: (q: number) => void; mob: boolean }) {
  const rows = planQParts(plan, q);
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel Title="อะไหล่ในแผน" />
      <Tabs>{QUARTERS.map((t, i) => <TabItem key={t} Text={t} Badge={planQParts(plan, i + 1).length} Active={q === i + 1} onClick={() => onQ(i + 1)} />)}</Tabs>
      {!rows.length ? <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText="ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" />
        : mob ? <MobileCards columns={QPART_COLS} rows={rows} /> : <Table columns={QPART_COLS} rows={rows} />}
    </section>
  );
}

function Review() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(["ผู้อนุมัติ"]);
  const plan = findPlan(useMock().plans, sp.get("id"));
  const [q, setQ] = useState(1);
  const [pq, setPq] = useState(1);   // แท็บไตรมาสของอะไหล่ในแผน
  const dec = useDecision();
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  const gone = ok && !plan;
  useEffect(() => { if (gone) router.replace(LIST); }, [gone, router]);
  if (!ok || !plan) return null;

  const { decision, reason } = dec;
  const confirm = () => {
    if (!dec.ok) return;
    if (decision === "approve") return setPending({
      spec: { title: "ยืนยันอนุมัติแผนบำรุงรักษา", sub: plan.name + " · " + plan.cars + " คัน · อนุมัติแล้ว ระบบแจ้งจำนวนอะไหล่ทั้งปีให้ Smart Inventory ทราบ (ยังไม่ตัดจากคลัง) และหน่วยงานเริ่มงานรายไตรมาสได้", cancel: "ยกเลิก", ok: "อนุมัติ" },
      run: () => { updatePlan(plan.mr, (p) => ({ ...p, status: "approved", approvedAt: thaiToday() })); notify("อนุมัติแผนบำรุงรักษาสำเร็จ"); },
    });
    setPending({
      spec: { title: "ยืนยันส่งกลับแก้ไข", sub: "แผนจะกลับไปให้ผู้สร้างแผนแก้ไขตามเหตุผลที่ระบุ แล้วส่งอนุมัติใหม่", cancel: "ยกเลิก", ok: "ส่งกลับ" },
      run: () => { updatePlan(plan.mr, (p) => ({ ...p, status: "returned", returnReason: reason.trim() })); notify("ส่งแผนกลับให้ผู้สร้างแผนแก้ไขแล้ว"); router.push(LIST); },
    });
  };

  return (
    <>
      <PageHeader Title="ตรวจสอบแผนบำรุงรักษา" Badge={[PST[plan.status][0], badgeOf(PST[plan.status][1])]} onBack={() => router.push(LIST)}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "แผนรออนุมัติ", href: LIST }, { Text: plan.name }]} />
      <div className="flex flex-col gap-8">
        {plan.status === "review" && <DecisionSection approveSub={APPROVE_SUB} returnSub={RETURN_SUB} {...dec} />}
        <PlanBody plan={plan} q={q} onQ={setQ} />
        <PlanParts plan={plan} q={pq} onQ={setPq} mob={mob} />
        {plan.status === "review" && (
          <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => router.push(LIST)} />
            <PrimaryButton Text="ยืนยันผลการพิจารณา" Size="lg" State={dec.ok ? "Default" : "Disabled"} onClick={confirm} />
          </div>
        )}
      </div>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Review /></Suspense></AppFrame>;
}
