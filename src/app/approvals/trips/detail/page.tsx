"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { mrOf, planOf } from "@/lib/mock/closeout";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { APPROVED_AT, TST, addNotis, approvalNotis, badgeOf, findTrip, putTrip, tripCars, tripKv, vTrip } from "@/lib/mock/trips";
import { tripPartRows } from "@/lib/mock/moves";
import { TRIP_V_COLS, tripVCells } from "@/lib/mock/tripCols";
import { TripPartsSection } from "../../../trips/_lib/TripExport";
import { ReturnModal, ReviewActions } from "../../_shared/Decision";
import { Content, DataTable, MENU_HOME, Section, useBack } from "../../../quarter/_shared/ui";

const RETURN_SUB = "แจ้งเหตุผลให้ผู้สร้างแผนเดินทางแก้ไขแล้วส่งใหม่";

function TripReview() {
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const approver = !!useRole();
  const t = findTrip(mock, sp.get("trip"));
  const [returning, setReturning] = useState(false);
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  const back = useBack("/approvals/trips/");
  if (!t) return null;
  const plan = planOf(mock, t.planId);
  const planLabel = mrOf(t.planId) + " " + (plan?.name ?? "");
  const rows = tripCars(t).map((c) => tripVCells(c, vTrip(t)));

  const sendBack = (why: string) => {
    putTrip({ ...t, status: "returned", returnReason: why });
    notify("ส่งแผนเดินทางกลับให้ผู้สร้างแผนเดินทางแก้ไขแล้ว");
    router.push("/approvals/trips/");
  };
  const confirm = () => setPending({
      spec: { title: "ยืนยันอนุมัติแผนเดินทาง", sub: t.name + " · " + t.carIds.length + " คัน · อนุมัติแล้วระบบแจ้งเตือน กรย. และผู้ดูแลยานพาหนะ", ok: "อนุมัติ" },
      run: () => {
        const next = { ...t, status: "approved" as const, approvedAt: APPROVED_AT, returnReason: undefined };
        putTrip(next);
        addNotis(approvalNotis(next));
        notify("อนุมัติแผนเดินทางสำเร็จ");
      },
    });

  return (
    <>
      <PageHeader Title="ตรวจสอบแผนเดินทาง" Badge={badgeOf(TST[t.status])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "อนุมัติแผนเดินทาง", href: "/approvals/trips/" }, { Text: t.name }]}
        Actions={t.status === "review" && approver ? <ReviewActions onApprove={confirm} onReturn={() => setReturning(true)} /> : undefined} />
      <Content>
        <VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={tripKv(t, planLabel)} />
        <Section>
          <SectionLabel Title={"ยานพาหนะในแผนเดินทาง (" + rows.length + ")"} />
          <DataTable columns={TRIP_V_COLS} rows={rows} />
        </Section>
        <TripPartsSection parts={tripPartRows(mock, t)} />
      </Content>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { const p = pending; setPending(null); p?.run(); }} />
      <ReturnModal open={returning} sub={RETURN_SUB} onCancel={() => setReturning(false)} onOk={(why) => { setReturning(false); sendBack(why); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><TripReview /></Suspense></AppFrame>;
}
