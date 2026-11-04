"use client";
/* งานรายคัน บำรุงรักษาไม่ได้ (ดูอย่างเดียว) — screens.js ไม่ได้วางจอนี้ของแผนตรวจเอง (S10 Condition: "ไม่มีปุ่ม ดูอย่างเดียว")
   ⇒ ใช้โครงคันที่แจ้งบำรุงรักษาไม่ได้ของ hireJob() (S23/S11): ข้อมูลยานพาหนะ · การนัดหมาย · VehicleAndReporterInfo "บำรุงรักษาไม่ได้" (สาเหตุ ผู้แจ้ง แจ้งเมื่อ)
   + Section label "อะไหล่ส่งคืน (n)" + Table RET_COLS · ไม่มีปุ่มหัวหน้า */
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { WSTAT, type Job, type JobTrip, type TripCar } from "@/lib/mock/jobs";
import { badgeOf, jobCrumbs, RetTable, Section, tripHref, useBack } from "../_lib/ui";
import { appointmentPairs, vehiclePairs } from "./JobPage";

export function CannotView({ trip, car, job }: { trip: JobTrip; car: TripCar; job: Job }) {
  const back = useBack();
  const c = job.cannot;
  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} crumbs={jobCrumbs(trip, car.plate)} onBack={() => back(tripHref(trip))} />
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={vehiclePairs(trip, car)} />
      <VehicleAndReporterInfo Title="การนัดหมาย" pairs={appointmentPairs(trip, car)} />
      <VehicleAndReporterInfo Title="บำรุงรักษาไม่ได้" pairs={[["สาเหตุที่บำรุงรักษาไม่ได้", c?.reason ?? "-"], ["ผู้แจ้ง", c?.by ?? "-"], ["แจ้งเมื่อ", c?.at ?? "-"]]} />
      <Section>
        <SectionLabel Title={"อะไหล่ส่งคืน (" + job.parts.length + ")"} />
        <RetTable parts={job.parts} used={c?.used} />
      </Section>
    </>
  );
}
