"use client";
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

export function StepFrame({ trip, car, job, step, used, actor, vendor = false, children }: { trip: JobTrip; car: TripCar; job: Job; step: 1 | 2; used: number[]; actor: boolean; vendor?: boolean; children: ReactNode }) {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const [cannot, setCannot] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState(false);
  const ok = () => {
    if (!reason.trim()) { setErr(true); return; }
    cannotJob(trip, car.id, reason.trim(), used, thaiNow(), vendor);
    setCannot(false);
    notify("บันทึกบำรุงรักษาไม่ได้แล้ว");
    router.push(tripHref(trip));
  };
  const actions = actor && job.status === "doing" ? <SecondaryButton Text="บำรุงรักษาไม่ได้" Size={mob ? "lg" : "md"} onClick={() => { setReason(""); setErr(false); setCannot(true); }} /> : undefined;
  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} Pill={job.status === "doing" || vendor ? WSTAT[job.status] : undefined} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} Actions={actions} />
      {mob ? <MobileProgressSteps steps={MT_STEPS} current={step} /> : <ProgressSteps steps={MT_STEPS} current={step} />}
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={vehiclePairs(trip, car)} />
      <VehicleAndReporterInfo Title="การนัดหมาย" pairs={appointmentPairs(trip, car, job)} />
      {children}
      <CannotPopup open={cannot} car={car} parts={job.parts} used={step === 2 ? used : null} reason={reason} error={err}
        onReason={(v) => { setReason(v); if (v.trim()) setErr(false); }} onOk={ok} onCancel={() => setCannot(false)} />
    </>
  );
}
