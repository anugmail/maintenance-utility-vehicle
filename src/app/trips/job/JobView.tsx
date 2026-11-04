"use client";
/* /trips/job/ — เลือกจอตามสถานะงาน (routes.md "/trips/job/ render rule") ใช้ทั้งแผนตรวจเอง (T1) และแผนจ้าง (TV) ชุดเดียวกัน
   ยังไม่เริ่ม / อยู่ระหว่างบำรุงรักษา → JobPage (กบค. มีปุ่ม · บทบาทอื่นดูอย่างเดียว) · แผนจ้าง = จอ I.23 (กบค. ปิดงานแทนผู้รับจ้าง)
   เสร็จสิ้น → WorkDetail (+ ผลการทดสอบน้ำมัน S12) · บำรุงรักษาไม่ได้ → CannotView
   4 พ.ย. 2569 ตัด S23 S11 ⇒ เหลือ 4 สถานะ · หน้ามุมผู้รับจ้าง/ตรวจรับรายคัน (HireView) เอาออก · สถานะเก่าในที่เก็บแปลงที่ normJob() ของ lib/mock/jobs.ts */
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { useTripCar } from "../_lib/ui";
import { CannotView } from "./CannotView";
import { JobPage } from "./JobPage";
import { WorkDetail } from "./WorkDetail";

export function JobView() {
  const { trip, car, job, actor, kbk } = useTripCar();
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  switch (job.status) {
    case "done":
      return <WorkDetail trip={trip} car={car} job={job} kbk={kbk} />;
    case "cannot":
      return <CannotView trip={trip} car={car} job={job} />;
    default:
      return <JobPage trip={trip} car={car} job={job} actor={actor} />;
  }
}
