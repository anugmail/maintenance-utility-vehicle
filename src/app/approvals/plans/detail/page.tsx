"use client";
/* S2 · หน้า ตรวจสอบแผนบำรุงรักษา (/approvals/plans/detail/?id=Z7000004) — planReview() ใน screens.js · เฉพาะบทบาท ผู้อนุมัติ
   Page header "ตรวจสอบแผนบำรุงรักษา" · ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › แผนรออนุมัติ › ชื่อแผน · Badge outline = สถานะแผน
   เนื้อหา ช่องไฟ 32: PlanBody (รายละเอียดแผน + รถในแผน แยกแท็บไตรมาส ดูอย่างเดียว)
     รออนุมัติ: Section label "ผลการพิจารณา" + Radio text card อนุมัติ (ค่าเริ่มต้น) / ส่งกลับแก้ไข แถวเดียวสูงเท่ากัน (มือถือเรียงลง)
       ส่งกลับแก้ไข → Text area "เหตุผลที่ส่งกลับ" (บังคับ) ใต้การ์ด · ปุ่ม ย้อนกลับ · ยืนยันผลการพิจารณา (lg)
       อนุมัติ → ยืนยันอนุมัติแผนบำรุงรักษา → อนุมัติแล้ว (ส่งรายการอะไหล่ให้ กบค. คลัง S22) + toast · ส่งกลับ → ยืนยันส่งกลับแก้ไข → รายการ + toast
     อนุมัติแล้ว: Alert Success "อนุมัติแผนแล้ว <วันที่>" ไม่มีผลการพิจารณาและปุ่ม */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TextArea } from "@/components/vms/TextArea";
import { cx } from "@/lib/cx";
import { PST } from "@/lib/mock/data";
import { thaiToday } from "@/lib/mock/plan";
import { badgeOf, findPlan, updatePlan, useRoleGuard } from "@/lib/mock/planFlow";
import { notify, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PlanBody } from "@/app/detail/PlanBody";

const LIST = "/approvals/plans/";
const DECISIONS = [
  { Text: "อนุมัติ", SupportingText: "แผนผ่านการตรวจสอบ กบค. เริ่มงานรายไตรมาสได้" },
  { Text: "ส่งกลับแก้ไข", SupportingText: "แจ้งเหตุผลให้ กบค. แก้ไขแผนแล้วส่งใหม่" },
];

function Review() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(["ผู้อนุมัติ"]);
  const plan = findPlan(useMock().plans, sp.get("id"));
  const [q, setQ] = useState(1);
  const [decision, setDecision] = useState(DECISIONS[0].Text);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState(false);
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  const gone = ok && !plan;
  useEffect(() => { if (gone) router.replace(LIST); }, [gone, router]);
  if (!ok || !plan) return null;

  const ret = decision === DECISIONS[1].Text;
  const noReason = ret && !reason.trim();
  const confirm = () => {
    if (noReason) { setErrors(true); return; }
    if (!ret) return setPending({
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
        <PlanBody plan={plan} q={q} onQ={setQ} />
        {plan.status === "approved" && <Alert Color="Success" Text={"อนุมัติแผนแล้ว " + (plan.approvedAt ?? "")} SupportingText="ส่งรายการอะไหล่รายไตรมาสให้ กบค. คลังแล้ว · กบค. เริ่มทำงานรายไตรมาสได้" />}
        {plan.status === "review" && <>
          <section className="flex flex-col gap-4">
            <SectionLabel Title="ผลการพิจารณา" />
            <RadioTextCards options={DECISIONS} value={decision} onChange={(v) => { setDecision(v); setErrors(false); }} />
            {ret && <TextArea LabelText="เหตุผลที่ส่งกลับ" Text={reason} Placeholder="ระบุเหตุผลที่ส่งกลับ" onChange={setReason}
              State={errors && noReason ? "Error" : undefined} HelperText={errors && noReason ? "กรุณาระบุเหตุผลที่ส่งกลับ" : undefined} />}
          </section>
          <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => router.push(LIST)} />
            <PrimaryButton Text="ยืนยันผลการพิจารณา" Size="lg" onClick={confirm} />
          </div>
        </>}
      </div>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Review /></Suspense></AppFrame>;
}
