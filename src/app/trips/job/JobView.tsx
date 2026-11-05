"use client";
/* /trips/job/ — เลือกจอตามสถานะงาน (routes.md "/trips/job/ render rule") ใช้ทั้งแผนตรวจเอง (T1) และแผนจ้าง (TV) ชุดเดียวกัน
   ยังไม่เริ่ม → JobPage (กบค. มีปุ่ม บำรุงรักษาไม่ได้ · เริ่มงาน · บทบาทอื่นดูอย่างเดียว) · แผนจ้าง = จอ I.23 (กบค. ปิดงานแทนผู้รับจ้าง)
   อยู่ระหว่างบำรุงรักษา (กบค.) → เปิดขั้นที่ค้าง (5 พ.ย. 2569 S10 2 ขั้น: Step 1 /trips/job/receive/ · Step 2 /trips/job/close/ · หน้า "อยู่ระหว่างบำรุงรักษา" เดิมเอาออก) · บทบาทอื่นดู JobPage
   เสร็จสิ้น → WorkDetail (+ ผลการทดสอบน้ำมัน S12) · บำรุงรักษาไม่ได้ → CannotView
   4 พ.ย. 2569 ตัด S23 S11 ⇒ เหลือ 4 สถานะ · หน้ามุมผู้รับจ้าง/ตรวจรับรายคัน (HireView) เอาออก · สถานะเก่าในที่เก็บแปลงที่ normJob() ของ lib/mock/jobs.ts */
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { stepOf } from "@/lib/mock/jobs";
import { jobHref, useTripCar } from "../_lib/ui";
import { CannotView } from "./CannotView";
import { JobPage } from "./JobPage";
import { WorkDetail } from "./WorkDetail";

export function JobView() {
  const { trip, car, job, actor, kbk } = useTripCar();
  const router = useRouter();
  const to = trip && car && job && actor && job.status === "doing" ? jobHref(trip, car.id, stepOf(job) === 1 ? "receive/" : "close/") : null;
  useEffect(() => { if (to) router.replace(to); }, [to, router]);
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  if (to) return null;
  switch (job.status) {
    case "done":
      return <WorkDetail trip={trip} car={car} job={job} kbk={kbk} />;
    case "cannot":
      return <CannotView trip={trip} car={car} job={job} />;
    default:
      return <JobPage trip={trip} car={car} job={job} actor={actor} />;
  }
}
