"use client";
/* S7 P2 · ตรวจสอบแผนเดินทาง (/approvals/trips/detail/?trip=T1 · ผู้อนุมัติ) — tripReview() ใน screens.js · spec S7.md (F.2–F.7)
   Page header "ตรวจสอบแผนเดินทาง" + Badge (รออนุมัติ → Brand · อนุมัติแล้ว → Success) → Content ช่องไฟ 32:
     (รออนุมัติ) ผลการพิจารณาบนสุด — approvals/_shared/Decision ไม่มีค่าเริ่มต้น (ปรับ 5 พ.ย. 2569 ตาม S2 · tripReview())
     รายละเอียดแผนเดินทาง (VehicleAndReporterInfo · tripKv — ใบจ้างแสดงผู้รับจ้าง เลขที่สัญญา ช่วงวันทำงาน แทนพนักงาน)
     Section label "ยานพาหนะในแผนเดินทาง (n)" + Table ดูอย่างเดียว ชุดกลาง TRIP_V_COLS 7 คอลัมน์ (R82 · lib/mock/tripCols.ts)
     Section label "อะไหล่ของแผนเดินทาง" (ไม่มีตัวเลขจำนวนชนิด 9 พ.ย. 2569) + Table QPART_COLS ดูอย่างเดียว รวมจากยานพาหนะในใบ (R84 · ให้ผู้อนุมัติเห็นชุดเดียวกับฟอร์ม)
     (รออนุมัติ) ปุ่ม ย้อนกลับ · ยืนยันผลการพิจารณา (Disabled จนกว่าจะเลือก และถ้าส่งกลับต้องมีเหตุผล)
     อนุมัติแล้ว: ไม่มีผลการพิจารณา ไม่มีปุ่ม ไม่มี Alert — toast "อนุมัติแผนเดินทางสำเร็จ" อย่างเดียว
   อนุมัติ → ConfirmDialog → trip approved + แจ้งเตือน กรย./หน่วยงานเจ้าของรถ (S8) + toast · ส่งกลับ → ConfirmDialog → trip returned + เหตุผล → รายการ + toast */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { mrOf, planOf } from "@/lib/mock/closeout";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { APPROVED_AT, TST, addNotis, approvalNotis, badgeOf, findTrip, putTrip, tripCars, tripKv, vTrip } from "@/lib/mock/trips";
import { tripPartRows } from "@/lib/mock/moves";
import { TRIP_V_COLS, tripVCells } from "@/lib/mock/tripCols";
import { TripPartsSection } from "../../../trips/_lib/TripExport";
import { DecisionSection, useDecision } from "../../_shared/Decision";
import { BtnRow, Content, DataTable, MENU_HOME, Section, useBack } from "../../../quarter/_shared/ui";

const APPROVE_SUB = "แผนเดินทางผ่านการตรวจสอบ แจ้งผู้ดูแลยานพาหนะและ กรย.", RETURN_SUB = "แจ้งเหตุผลให้ผู้สร้างแผนเดินทางแก้ไขแล้วส่งใหม่";

function TripReview() {
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const approver = !!useRole();   // ทุกบทบาทของต้นแบบพิจารณาได้ (9 พ.ย. 2569 เจ้าของงาน "ตอนอนุมัติให้เห็น เมนูของทุกคนไปเลย" · ระบบจริงหาผู้อนุมัติจากสายบังคับบัญชา upper/lower)
  const t = findTrip(mock, sp.get("trip"));
  const dec = useDecision();
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  const back = useBack("/approvals/trips/");
  if (!t) return null;   // ก่อนอ่าน localStorage / ไม่มีใบนี้
  const plan = planOf(mock, t.planId);
  const planLabel = mrOf(t.planId) + " " + (plan?.name ?? "");
  const ret = dec.decision === "return", reason = dec.reason;
  const rows = tripCars(t).map((c) => tripVCells(c, vTrip(t)));

  const confirm = () => {
    if (!dec.ok) return;
    if (!ret) setPending({
      spec: { title: "ยืนยันอนุมัติแผนเดินทาง", sub: t.name + " · " + t.carIds.length + " คัน · อนุมัติแล้วระบบแจ้งเตือน กรย. และผู้ดูแลยานพาหนะ", ok: "อนุมัติ" },
      run: () => {
        const next = { ...t, status: "approved" as const, approvedAt: APPROVED_AT, returnReason: undefined };
        putTrip(next);
        addNotis(approvalNotis(next));
        notify("อนุมัติแผนเดินทางสำเร็จ");
      },
    });
    else setPending({
      spec: { title: "ยืนยันส่งกลับแก้ไข", sub: "แผนเดินทางจะกลับไปให้ผู้สร้างแผนเดินทางแก้ไขตามเหตุผลที่ระบุ แล้วส่งอนุมัติใหม่", ok: "ส่งกลับ" },
      run: () => {
        putTrip({ ...t, status: "returned", returnReason: reason.trim() });
        notify("ส่งแผนเดินทางกลับให้ผู้สร้างแผนเดินทางแก้ไขแล้ว");
        router.push("/approvals/trips/");
      },
    });
  };

  return (
    <>
      <PageHeader Title="ตรวจสอบแผนเดินทาง" Badge={badgeOf(TST[t.status])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "อนุมัติแผนเดินทาง", href: "/approvals/trips/" }, { Text: t.name }]} />
      <Content>
        {t.status === "review" && approver && <DecisionSection approveSub={APPROVE_SUB} returnSub={RETURN_SUB} {...dec} />}
        <VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={tripKv(t, planLabel)} />
        <Section>
          <SectionLabel Title={"ยานพาหนะในแผนเดินทาง (" + rows.length + ")"} />
          <DataTable columns={TRIP_V_COLS} rows={rows} />
        </Section>
        <TripPartsSection parts={tripPartRows(mock, t)} />
        {t.status === "review" && approver && (
          <BtnRow>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
            <PrimaryButton Text="ยืนยันผลการพิจารณา" Size="lg" State={dec.ok ? "Default" : "Disabled"} onClick={confirm} />
          </BtnRow>
        )}
      </Content>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { const p = pending; setPending(null); p?.run(); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><TripReview /></Suspense></AppFrame>;
}
