"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { PageHeader } from "@/components/vms/PageHeader";
import { PST } from "@/lib/mock/data";
import { thaiToday } from "@/lib/mock/plan";
import { badgeOf, findPlan, updatePlan, useRoleGuard } from "@/lib/mock/planFlow";
import { notify, useMock, ROLES } from "@/lib/mock/store";
import { PlanBody } from "@/app/detail/PlanBody";
import { PlanParts } from "@/app/detail/PlanParts";
import { ReturnModal, ReviewActions } from "../../_shared/Decision";

const LIST = "/approvals/plans/";
const RETURN_SUB = "แจ้งเหตุผลให้ผู้สร้างแผนแก้ไขแล้วส่งใหม่";

function Review() {
  const router = useRouter();
  const sp = useSearchParams();
  const ok = useRoleGuard(ROLES);
  const plan = findPlan(useMock().plans, sp.get("id"));
  const [q, setQ] = useState(1);
  const [returning, setReturning] = useState(false);
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  const gone = ok && !plan;
  useEffect(() => { if (gone) router.replace(LIST); }, [gone, router]);
  if (!ok || !plan) return null;

  const sendBack = (why: string) => { updatePlan(plan.mr, (p) => ({ ...p, status: "returned", returnReason: why })); notify("ส่งแผนกลับให้ผู้สร้างแผนแก้ไขแล้ว"); router.push(LIST); };
  const confirm = () => setPending({
      spec: { title: "ยืนยันอนุมัติแผนบำรุงรักษา", sub: plan.name + " · " + plan.cars + " คัน · อนุมัติแล้ว ระบบแจ้งจำนวนอะไหล่ทั้งปีให้ Smart Inventory ทราบ (ยังไม่ตัดจากคลัง) และหน่วยงานเริ่มงานรายไตรมาสได้", cancel: "ยกเลิก", ok: "อนุมัติ" },
      run: () => { updatePlan(plan.mr, (p) => ({ ...p, status: "approved", approvedAt: thaiToday() })); notify("อนุมัติแผนบำรุงรักษาสำเร็จ"); },
    });

  return (
    <>
      <PageHeader Title="ตรวจสอบแผนบำรุงรักษา" Badge={[PST[plan.status][0], badgeOf(PST[plan.status][1])]} onBack={() => router.push(LIST)}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "อนุมัติแผนบำรุงรักษา", href: LIST }, { Text: plan.name }]}
        Actions={plan.status === "review" ? <ReviewActions onApprove={confirm} onReturn={() => setReturning(true)} /> : undefined} />
      <div className="flex flex-col gap-8">
        <PlanBody plan={plan} q={q} onQ={setQ} />
        <PlanParts plan={plan} />
      </div>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
      <ReturnModal open={returning} sub={RETURN_SUB} onCancel={() => setReturning(false)} onOk={(why) => { setReturning(false); sendBack(why); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Review /></Suspense></AppFrame>;
}
