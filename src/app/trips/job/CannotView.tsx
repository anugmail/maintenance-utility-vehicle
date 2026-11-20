"use client";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { WSTAT, type Job, type JobTrip, type TripCar } from "@/lib/mock/jobs";
import { badgeOf, useCrumbs, RetTable, Section, tripHref, useBack } from "../_lib/ui";
import { appointmentPairs, vehiclePairs } from "./JobPage";

export function CannotView({ trip, car, job }: { trip: JobTrip; car: TripCar; job: Job }) {
  const crumbs = useCrumbs();
  const back = useBack();
  const c = job.cannot;
  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} />
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
