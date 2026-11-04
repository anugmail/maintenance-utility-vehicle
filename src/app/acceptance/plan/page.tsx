"use client";
/* S14 M.2–M.5 · หน้า หลักฐานการตรวจบำรุงรถ ทั้งแผน (/acceptance/plan/?id=Z7000001) — planEvidence() + feedback() ใน screens.js
   รายละเอียดแผน (PLAN_KV 10 ช่อง) → สรุปรายคัน (3) Table + pagination → คะแนนประเมินความพึงพอใจ (RepairFeedback ของไฟล์ Maintain-D: Section header + Radio text card 1–5)
   → ข้อเสนอแนะเพิ่มเติม (ถ้ามี) → ปุ่ม ย้อนกลับ · ยอมรับผลการตรวจบำรุงรถ (กดได้เมื่อให้คะแนนแล้ว · ยืนยันก่อน) · ยอมรับแล้ว = Alert Success + ป้าย "ยอมรับผลทั้งแผนแล้ว"
   ตัดรหัสอ้างอิงภายใน "(S15)" ออกจากข้อความ Alert (เจ้าของงาน 4 พ.ย. 2569)
   อ้างอิง: Section label · Table · Table pagination · Text area · Alert ของไฟล์ Component + RepairFeedback · VehicleAndReporterInfo ของไฟล์ Maintain-D + จอ planEvidence ผ่าน screens.js */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { RepairFeedback } from "@/components/maintain-d/RepairFeedback";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { Alert } from "@/components/vms/Alert";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TablePagination } from "@/components/vms/TablePagination";
import { TextArea } from "@/components/vms/TextArea";
import {
  ACCEPTANCE_CARS, ACCEPT_DATES, ACCEPT_SAMPLES, ACCEPT_STATUS, EVIDENCE_BADGE, PLAN_CAR_COUNT, PLAN_KV, accCar, useAcceptance, writeAcceptance,
} from "@/lib/mock/acceptance";
import { notify, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "@/lib/useSample";
import { badgeOf, ButtonRow } from "../../trips/_lib/ui";

const SUM_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 170, Style: "Lead text" }, { head: "ใบตรวจสภาพอะไหล่" }, { head: "ใบตรวจสภาพงานบำรุงรักษา" }, { head: "การยอมรับรายคัน", width: 200, Style: "Badge" }];

function PlanEvidence() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(ACCEPT_SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const owner = useRole() === "หน่วยงานเจ้าของรถ";
  const a = useAcceptance();
  const [confirm, setConfirm] = useState(false);
  if (pending) return null;
  if (sp.get("id") !== "Z7000001") return <EmptyStateSearchNotFound />;

  const done = a.planDone;
  const back = () => router.push("/acceptance/");
  const rows: TableValue[][] = ACCEPTANCE_CARS.map((r) => {
    const car = accCar(r.carId)!, no = car.plate.split(" ")[0];
    return [car.plate, "ใบตรวจสภาพอะไหล่-" + no + ".pdf", "ใบตรวจสภาพงานบำรุงรักษา-" + no + ".pdf", { pills: [[ACCEPT_STATUS.ok[0], ACCEPT_STATUS.ok[1]]] }];
  });
  const pager = <TablePagination total={rows.length} page={1} perPage={10} />;
  const accept = () => {
    writeAcceptance((x) => ({ ...x, planDone: true }));
    setConfirm(false);
    notify("ยอมรับผลการตรวจบำรุงรถทั้งแผนสำเร็จ");
  };

  return (
    <>
      <PageHeader Title="หลักฐานการตรวจบำรุงรถ · MR Z7000001" Badge={badgeOf(done ? EVIDENCE_BADGE.done : EVIDENCE_BADGE.wait)} onBack={back}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "รอตรวจสอบ", href: "/acceptance/" }, { Text: "MR Z7000001" }]} />
      <div className="flex flex-col gap-8">
        <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={PLAN_KV} />
        <section className="flex flex-col gap-4">
          <SectionLabel Title={"สรุปรายคัน (" + rows.length + ")"} />
          {mob ? <div className="flex flex-col gap-5"><MobileCards columns={SUM_COLS} rows={rows} />{pager}</div> : <Table columns={SUM_COLS} rows={rows} Pagination={pager} />}
        </section>
        <RepairFeedback Title="คะแนนประเมินความพึงพอใจงานบำรุงรักษา" SupportingText="ให้คะแนน 1–5 · 1 ต้องปรับปรุงมาก · 5 ดีมาก" value={a.score}
          Disabled={done || !owner} onChange={(n) => writeAcceptance((x) => ({ ...x, score: n }))} />
        <TextArea LabelText="ข้อเสนอแนะเพิ่มเติม" Optional Text={a.comment} Placeholder="ระบุข้อเสนอแนะ" readOnly={done || !owner}
          onChange={(v) => writeAcceptance((x) => ({ ...x, comment: v }))} />
        {done ? (
          <Alert Color="Success" Text={"ยอมรับผลการตรวจบำรุงรถทั้งแผนแล้ว " + ACCEPT_DATES.plan} SupportingText="แจ้ง กบค. แล้ว — ส่งประวัติให้หัวหน้า กบค. ได้" />
        ) : (
          <ButtonRow>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
            {owner && <PrimaryButton Text="ยอมรับผลการตรวจบำรุงรถ" Size="lg" State={a.score ? "Default" : "Disabled"} onClick={() => a.score && setConfirm(true)} />}
          </ButtonRow>
        )}
      </div>
      <ConfirmDialog spec={confirm ? { title: "ยืนยันยอมรับผลการตรวจบำรุงรถทั้งแผน", sub: "MR Z7000001 · " + PLAN_CAR_COUNT + " คัน · คะแนนความพึงพอใจ " + a.score + " · ระบบจะแจ้ง กบค.", ok: "ยอมรับผล" } : null}
        onOk={accept} onCancel={() => setConfirm(false)} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><PlanEvidence /></Suspense></AppFrame>;
}
