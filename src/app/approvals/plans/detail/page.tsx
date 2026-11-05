"use client";
/* S2 · หน้า ตรวจสอบแผนบำรุงรักษา (/approvals/plans/detail/?id=Z7000004) — planReview() ใน screens.js · เฉพาะบทบาท ผู้อนุมัติ
   Page header "ตรวจสอบแผนบำรุงรักษา" · ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › แผนรออนุมัติ › ชื่อแผน · Badge outline = สถานะแผน
   เนื้อหา ช่องไฟ 32 (planReview() ปรับ 5 พ.ย. 2569 รีวิวทีมออกแบบ):
     รออนุมัติ: ผลการพิจารณาบนสุด (approvals/_shared/Decision · ไม่มีค่าเริ่มต้น) → PlanBody (รายละเอียดแผน + รถในแผน แยกแท็บไตรมาส ดูอย่างเดียว)
       → ปุ่ม ย้อนกลับ · ยืนยันผลการพิจารณา (lg · Disabled จนกว่าจะเลือก และถ้าส่งกลับต้องมีเหตุผล)
       อนุมัติ → ยืนยันอนุมัติแผนบำรุงรักษา → สถานะ อนุมัติแล้ว (ส่งรายการอะไหล่ให้ กบค. คลัง S22) + toast "อนุมัติแผนบำรุงรักษาสำเร็จ" อย่างเดียว · ส่งกลับ → ยืนยันส่งกลับแก้ไข → รายการ + toast
     อนุมัติแล้ว: ไม่มีผลการพิจารณา ไม่มีปุ่ม ไม่มี Alert ("ไม่ต้องแสดง Alert อนุมัติแผนแล้ว ซ้ำ ให้แสดงแค่ Toast") */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { cx } from "@/lib/cx";
import { PST } from "@/lib/mock/data";
import { thaiToday } from "@/lib/mock/plan";
import { badgeOf, findPlan, updatePlan, useRoleGuard } from "@/lib/mock/planFlow";
import { notify, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PlanBody } from "@/app/detail/PlanBody";
import { DecisionSection, useDecision } from "../../_shared/Decision";

const LIST = "/approvals/plans/";
const APPROVE_SUB = "แผนผ่านการตรวจสอบ กบค. เริ่มงานรายไตรมาสได้", RETURN_SUB = "แจ้งเหตุผลให้ กบค. แก้ไขแผนแล้วส่งใหม่";

function Review() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(["ผู้อนุมัติ"]);
  const plan = findPlan(useMock().plans, sp.get("id"));
  const [q, setQ] = useState(1);
  const dec = useDecision();
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  const gone = ok && !plan;
  useEffect(() => { if (gone) router.replace(LIST); }, [gone, router]);
  if (!ok || !plan) return null;

  const { decision, reason } = dec;
  const confirm = () => {
    if (!dec.ok) return;
    if (decision === "approve") return setPending({
      spec: { title: "ยืนยันอนุมัติแผนบำรุงรักษา", sub: plan.name + " · " + plan.cars + " คัน · อนุมัติแล้ว กบค. เริ่มงานรายไตรมาสได้", cancel: "ยกเลิก", ok: "อนุมัติ" },
      run: () => { updatePlan(plan.mr, (p) => ({ ...p, status: "approved", approvedAt: thaiToday(), ack: p.ack ?? {} })); notify("อนุมัติแผนบำรุงรักษาสำเร็จ"); },
    });
    setPending({
      spec: { title: "ยืนยันส่งกลับแก้ไข", sub: "แผนจะกลับไปให้ กบค. แก้ไขตามเหตุผลที่ระบุ แล้วส่งอนุมัติใหม่", cancel: "ยกเลิก", ok: "ส่งกลับ" },
      run: () => { updatePlan(plan.mr, (p) => ({ ...p, status: "returned", returnReason: reason.trim() })); notify("ส่งแผนกลับให้ กบค. แก้ไขแล้ว"); router.push(LIST); },
    });
  };

  return (
    <>
      <PageHeader Title="ตรวจสอบแผนบำรุงรักษา" Badge={[PST[plan.status][0], badgeOf(PST[plan.status][1])]} onBack={() => router.push(LIST)}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "แผนรออนุมัติ", href: LIST }, { Text: plan.name }]} />
      <div className="flex flex-col gap-8">
        {plan.status === "review" && <DecisionSection approveSub={APPROVE_SUB} returnSub={RETURN_SUB} {...dec} />}
        <PlanBody plan={plan} q={q} onQ={setQ} />
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
