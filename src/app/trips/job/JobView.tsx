"use client";
/* /trips/job/ — เลือกจอตามบทบาท + สถานะงาน (routes.md "/trips/job/ render rule")
   ยังไม่เริ่ม / อยู่ระหว่างบำรุงรักษา → JobPage (กบค. แผนตรวจเอง · ผู้รับจ้าง แผนจ้าง = มีปุ่ม · บทบาทอื่นดูอย่างเดียว)
   เสร็จสิ้น → WorkDetail (+ ผลการทดสอบน้ำมัน S12) · บำรุงรักษาไม่ได้ → CannotView
   ดำเนินการบำรุงรักษาแล้ว / แจ้งบำรุงรักษาไม่ได้ / รอตรวจรับ / ส่งกลับแก้ไข (แผนจ้าง) → จอของ S23 (ผู้รับจ้าง) / S11 (กบค.) — batch C2 ใส่ที่ HIRE_VIEW */
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { PageHeader } from "@/components/vms/PageHeader";
import { WSTAT } from "@/lib/mock/jobs";
import { SCENARIOS } from "@/lib/scenarios";
import { badgeOf, jobCrumbs, tripHref, useBack, useTripCar } from "../_lib/ui";
import { CannotView } from "./CannotView";
import { JobPage } from "./JobPage";
import { WorkDetail } from "./WorkDetail";

export function JobView() {
  const back = useBack();
  const { trip, car, job, actor, vendor, kbk } = useTripCar();
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  switch (job.status) {
    case "todo":
    case "doing":
      return <JobPage trip={trip} car={car} job={job} actor={actor} vendor={vendor} kbk={kbk} />;
    case "done":
      return <WorkDetail trip={trip} car={car} job={job} kbk={kbk} />;
    case "cannot":
      return <CannotView trip={trip} car={car} job={job} />;
    default: {
      /* HIRE_VIEW — worked / reported / wait / returned: S23 (ผู้รับจ้าง) · S11 (กบค. ตรวจรับ) ยังไม่ทำใน batch นี้ */
      const s = SCENARIOS.find((x) => x.id === (kbk ? "S11" : "S23"));
      return (
        <>
          <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} crumbs={jobCrumbs(trip, car.plate)} onBack={() => back(tripHref(trip))} />
          <EmptyStateDataEmpty Text="เร็วๆ นี้" SupportingText={s ? s.id + " · " + s.name + " ยังไม่ได้ทำในต้นแบบรอบนี้" : "หน้านี้ยังไม่ได้ทำในต้นแบบรอบนี้"} />
        </>
      );
    }
  }
}
