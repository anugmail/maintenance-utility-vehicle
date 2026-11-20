"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SecondaryDangerButton } from "@/components/vms/SecondaryDangerButton";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { planKv as runKv } from "@/lib/mock/closeout";
import { PST, type PlanStatus } from "@/lib/mock/data";
import { DELETE_CONFIRM, badgeOf, canManage, deletePlan, findPlan, planId, startEdit, useHydrated, usePlanGate } from "@/lib/mock/planFlow";
import { useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { PlanBody } from "./PlanBody";
import { PlanParts } from "./PlanParts";
import { CostTab } from "./CostTab";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import { notify } from "@/lib/mock/store";
import { COST_COLS, HIRE_COST_COLS, QCOST_COLS, costMetrics, costRow, hireCostRow, planCosts, quarterCostRows } from "@/lib/mock/cost";
import { downloadCsvSheets } from "@/app/parts/_lib/exportFile";

const RUN: PlanStatus[] = ["active", "closed"];

function Detail() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const hydrated = useHydrated();
  const role = useRole();
  const mock = useMock();
  const plan = findPlan(mock.plans, sp.get("id"));
  const denied = usePlanGate(plan);
  const [qSel, setQ] = useState<number | null>(null);
  const [del, setDel] = useState(false);
  const gone = hydrated && !plan;
  useEffect(() => { if (gone) router.replace("/"); }, [gone, router]);
  if (!hydrated || !plan) return null;
  if (denied) return null;

  const st = plan.status;
  const manage = canManage(role, plan);
  const canDelete = manage && (st === "review" || st === "returned");
  const canEdit = manage && (st === "review" || st === "returned" || st === "approved" || st === "active");
  const size = mob ? "lg" : "md";
  const id = planId(plan);
  const nowQ = Number(plan.nowQ.replace(/\D/g, "")) || 1;
  const q = qSel ?? nowQ;
  const costOn = (manage || role === "กบค.") && (st === "approved" || RUN.includes(st));
  const costTab = costOn && sp.get("tab") === "cost";
  const costs = costOn ? planCosts(mock, plan) : [];
  const exportCost = () => {
    downloadCsvSheets("ต้นทุนการบำรุงรักษา-" + plan.mr, [
      { title: "สรุปรายไตรมาส", cols: [{ head: "รายการ" }, { head: "ค่า" }], rows: costMetrics(costs, plan.cars).map(([k, v]) => [k, v]) },
      { title: "สรุปรายไตรมาส", cols: QCOST_COLS, rows: quarterCostRows(costs) },
      { title: "ต้นทุนรายคัน", cols: COST_COLS, rows: costs.filter((r) => !r.cannot && !r.hire).map(costRow) },
      { title: "ยานพาหนะที่บำรุงรักษาไม่ได้", cols: COST_COLS, rows: costs.filter((r) => r.cannot && !r.hire).map(costRow) },
      { title: "ยานพาหนะที่จ้างดำเนินการ", cols: HIRE_COST_COLS, rows: costs.filter((r) => r.hire).map(hireCostRow) },
    ]);
    notify("ส่งออกไฟล์สำเร็จ");
  };
  const actions = costTab ? (costs.length ? <SecondaryButton Text="ส่งออก" LeadingIconSwap="download-24-300-round" Size={size} onClick={exportCost} /> : undefined) : canEdit ? <>
    {canDelete && <SecondaryDangerButton Text="ลบแผน" LeadingIconSwap="delete-24-300-round" Size={size} onClick={() => setDel(true)} />}
    <SecondaryButton Text="แก้ไข" LeadingIconSwap="stylus-24-300-round" Size={size} onClick={() => { startEdit(plan); router.push("/edit/?id=" + id + "&from=detail"); }} />
  </> : undefined;
  const qActions = (manage || role === "กบค.") && (st === "approved" || st === "active") ? <div className="flex items-center gap-3">
    <TertiaryBrandButton Text={"ไปหน้าไตรมาส " + q} LeadingIconSwap="keyboard_arrow_right-20-400-round" onClick={() => router.push("/quarter/trips/?id=" + id + "&q=" + q)} />
  </div> : undefined;

  return (
    <>
      <PageHeader Title={"เลขที่ " + plan.mr} Badge={[PST[st][0], badgeOf(PST[st][1])]} onBack={() => router.push("/")}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: plan.name }]} Actions={actions} />
      {costOn && <div className="mb-6"><Tabs>{["รายละเอียดแผน", "ต้นทุนการบำรุงรักษา"].map((t, i) => <TabItem key={t} Text={t} Active={(i === 1) === costTab}
        onClick={() => router.replace("/detail/?id=" + id + (i === 1 ? "&tab=cost" : ""))} />)}</Tabs></div>}
      {costTab ? <CostTab rows={costs} planCars={plan.cars} /> : <div className="flex flex-col gap-8">
        {st === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        <PlanBody plan={plan} q={q} onQ={setQ} actions={qActions} kv={RUN.includes(st) ? runKv(plan) : undefined} />
        <PlanParts plan={plan} readonly={!canEdit} />
      </div>}
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(false)} onOk={() => { setDel(false); deletePlan(plan.mr); router.push("/"); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><Detail /></Suspense></AppFrame>;
}
