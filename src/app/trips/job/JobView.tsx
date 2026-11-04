"use client";
/* /trips/job/ — เลือกจอตามบทบาท + สถานะงาน (routes.md "/trips/job/ render rule") ใช้ทั้งแผนตรวจเอง (T1) และแผนจ้าง (TV)
   ยังไม่เริ่ม / อยู่ระหว่างบำรุงรักษา → JobPage (กบค. แผนตรวจเอง · ผู้รับจ้าง แผนจ้าง = มีปุ่ม · บทบาทอื่นดูอย่างเดียว)
   เสร็จสิ้น → WorkDetail (+ ผลการทดสอบน้ำมัน S12 · แผนจ้างหลัง กบค. อนุมัติก็บันทึกผลที่นี่) · บำรุงรักษาไม่ได้ → CannotView
   ดำเนินการบำรุงรักษาแล้ว / แจ้งบำรุงรักษาไม่ได้ / รอตรวจรับ / ส่งกลับแก้ไข (แผนจ้าง) → HireView (S23 ผู้รับจ้าง · S11 กบค. ตรวจรับ) */
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { useTripCar } from "../_lib/ui";
import { CannotView } from "./CannotView";
import { HireView } from "./HireView";
import { JobPage } from "./JobPage";
import { WorkDetail } from "./WorkDetail";

export function JobView() {
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
    default:
      return <HireView trip={trip} car={car} job={job} actor={actor} kbk={kbk} />;
  }
}
