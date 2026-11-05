"use client";
/* S10 กรอบหน้าขั้นตอนบำรุงรักษา 2 ขั้น — stepPage() + mtStepper() ใน screens.js (รีวิวทีมออกแบบ 5 พ.ย. 2569 · R70)
   ตาม `Page header` · `Progress steps` (Type=Horizontal · ซ่อนช่อง 3–7) · `Mobile progress steps` (Collapsed=True + Step circles 1/2 · 2/2) ของไฟล์ Component
   + VehicleAndReporterInfo ของไฟล์ Maintain-D + หน้า Repair - กบค. ของ Flow การซ่อม (Section > Progress steps > เนื้อหาขั้น) · Check Expense Modal หน้า 5.14 - 5.15 ของ UI Release#2 (มือถือ 2 ขั้น)
   Page header: ทะเบียน · ป้าย "อยู่ระหว่างบำรุงรักษา" · ปุ่ม Secondary "บำรุงรักษาไม่ได้" ทุกขั้น → popup สาเหตุ + อะไหล่ส่งคืน (Step 1 คืนทั้งหมด · Step 2 ตามจำนวนที่ใช้ที่กรอก)
   ยืนยันบำรุงรักษาไม่ได้ → หน้ารายละเอียดแผนเดินทาง + toast "บันทึกบำรุงรักษาไม่ได้แล้ว" · เนื้อหา: แถบขั้นตอน → ข้อมูลยานพาหนะ → การนัดหมาย (+ เริ่มงาน ผู้เริ่มงาน) → เนื้อหาขั้น */
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { MobileProgressSteps } from "@/components/vms/MobileProgressSteps";
import { PageHeader } from "@/components/vms/PageHeader";
import { ProgressSteps } from "@/components/vms/ProgressSteps";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { cannotJob, MT_STEPS, thaiNow, WSTAT, type Job, type JobTrip, type TripCar } from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { badgeOf, CannotPopup, tripHref, useBack, useCrumbs } from "../_lib/ui";
import { appointmentPairs, vehiclePairs } from "./JobPage";

export function StepFrame({ trip, car, job, step, used, actor, children }: { trip: JobTrip; car: TripCar; job: Job; step: 1 | 2; used: number[]; actor: boolean; children: ReactNode }) {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const [cannot, setCannot] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState(false);
  const ok = () => {
    if (!reason.trim()) { setErr(true); return; }
    cannotJob(trip, car.id, reason.trim(), used, thaiNow());
    setCannot(false);
    notify("บันทึกบำรุงรักษาไม่ได้แล้ว");
    router.push(tripHref(trip));
  };
  const actions = actor ? <SecondaryButton Text="บำรุงรักษาไม่ได้" Size={mob ? "lg" : "md"} onClick={() => { setReason(""); setErr(false); setCannot(true); }} /> : undefined;
  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} Actions={actions} />
      {mob ? <MobileProgressSteps steps={MT_STEPS} current={step} /> : <ProgressSteps steps={MT_STEPS} current={step} />}
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={vehiclePairs(trip, car)} />
      <VehicleAndReporterInfo Title="การนัดหมาย" pairs={appointmentPairs(trip, car, job)} />
      {children}
      <CannotPopup open={cannot} car={car} parts={job.parts} used={step === 2 ? used : null} reason={reason} error={err}
        onReason={(v) => { setReason(v); if (v.trim()) setErr(false); }} onOk={ok} onCancel={() => setCannot(false)} />
    </>
  );
}
