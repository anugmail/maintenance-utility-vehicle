"use client";
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
import { notify, useMock, ROLES } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PlanBody } from "@/app/detail/PlanBody";
import { PlanParts } from "@/app/detail/PlanParts";
import { DecisionSection, ReturnModal, ReviewActions, useDecision } from "../../_shared/Decision";
import { useOhStyle } from "@/lib/ohStyle";

const LIST = "/approvals/plans/";
const APPROVE_SUB = "แผนผ่านการตรวจสอบ หน่วยงานเริ่มงานรายไตรมาสได้", RETURN_SUB = "แจ้งเหตุผลให้ผู้สร้างแผนแก้ไขแล้วส่งใหม่";

function Review() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(ROLES);
  const plan = findPlan(useMock().plans, sp.get("id"));
  const [q, setQ] = useState(1);
  const dec = useDecision();
  const oh = useOhStyle();
  const [returning, setReturning] = useState(false);
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  const gone = ok && !plan;
  useEffect(() => { if (gone) router.replace(LIST); }, [gone, router]);
  if (!ok || !plan) return null;

  const { decision, reason } = dec;
  const sendBack = (why: string) => { updatePlan(plan.mr, (p) => ({ ...p, status: "returned", returnReason: why })); notify("ส่งแผนกลับให้ผู้สร้างแผนแก้ไขแล้ว"); router.push(LIST); };
  const confirm = (act: string = decision) => {
    if (act === "approve") return setPending({
      spec: { title: "ยืนยันอนุมัติแผนบำรุงรักษา", sub: plan.name + " · " + plan.cars + " คัน · อนุมัติแล้ว ระบบแจ้งจำนวนอะไหล่ทั้งปีให้ Smart Inventory ทราบ (ยังไม่ตัดจากคลัง) และหน่วยงานเริ่มงานรายไตรมาสได้", cancel: "ยกเลิก", ok: "อนุมัติ" },
      run: () => { updatePlan(plan.mr, (p) => ({ ...p, status: "approved", approvedAt: thaiToday() })); notify("อนุมัติแผนบำรุงรักษาสำเร็จ"); },
    });
    setPending({
      spec: { title: "ยืนยันส่งกลับแก้ไข", sub: "แผนจะกลับไปให้ผู้สร้างแผนแก้ไขตามเหตุผลที่ระบุ แล้วส่งอนุมัติใหม่", cancel: "ยกเลิก", ok: "ส่งกลับ" },
      run: () => sendBack(reason.trim()),
    });
  };

  return (
    <>
      <PageHeader Title="ตรวจสอบแผนบำรุงรักษา" Badge={[PST[plan.status][0], badgeOf(PST[plan.status][1])]} onBack={() => router.push(LIST)}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "อนุมัติแผนบำรุงรักษา", href: LIST }, { Text: plan.name }]}
        Actions={oh && plan.status === "review" ? <ReviewActions onApprove={() => confirm("approve")} onReturn={() => setReturning(true)} /> : undefined} />
      <div className="flex flex-col gap-8">
        {plan.status === "review" && !oh && <DecisionSection approveSub={APPROVE_SUB} returnSub={RETURN_SUB} {...dec} />}
        <PlanBody plan={plan} q={q} onQ={setQ} />
        <PlanParts plan={plan} />
        {plan.status === "review" && !oh && (
          <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => router.push(LIST)} />
            <PrimaryButton Text="ยืนยันผลการพิจารณา" Size="lg" State={dec.ok ? "Default" : "Disabled"} onClick={() => dec.ok && confirm()} />
          </div>
        )}
      </div>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
      <ReturnModal open={returning} sub={RETURN_SUB} onCancel={() => setReturning(false)} onOk={(why) => { setReturning(false); sendBack(why); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Review /></Suspense></AppFrame>;
}
