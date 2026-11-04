"use client";
/* ข้อมูลจำลองการยอมรับผล (S13 รายคัน · S14 ทั้งแผน) — ค่าชุดเดียวกับปลั๊กอิน Figma (screens.js: ACC · ACC_COLS · ACC_PLAN · accRows · carResult · planEvidence)
   ชื่อค่าคงที่ยกตรงจาก maintainance-yearly-specs/mock-data.ts (ACCEPT_STATUS · PLAN_ACCEPT_STATUS · EVIDENCE_BADGE · ACCEPTANCE_* · FEEDBACK_SAMPLE)
   รายการรอตรวจสอบ (S13) สร้างจากงานรายคันจริง (jobs.ts): รถในแผนเดินทางที่อนุมัติแล้วที่สถานะ "เสร็จสิ้น" (S10 ปิดงาน · S11 อนุมัติงานผู้รับจ้าง) หรือ "บำรุงรักษาไม่ได้"
   ยอมรับรายคัน = job.acceptedAt (ล้างไปพร้อมงานเมื่อเปิดชุดตัวอย่างใหม่) · ยอมรับทั้งแผน (S14) = closeout.accepted ของแผน (markPlanAccepted → S15 ส่งประวัติได้)
   คะแนน/ข้อเสนอแนะเก็บใน MockState.feedback คีย์ = รหัสแผน (module augmentation ไม่แก้ store.ts) */
import type { PillColor } from "@/components/vms/PillOutline";
import { closeoutOf, markPlanAccepted, putCloseout, setPlanStatus } from "./closeout";
import { hireRows } from "./hire";
import { SEED_TRIPS, applyJobs, carOf, closedSample, getJob, jobKey, jobsOf, type Job, type JobTrip, type TripCar } from "./jobs";
import { setMock, type MockState } from "./store";
import { TRIP_OTHER } from "./trips";

export interface Feedback { score: number | null; comment: string }
declare module "./store" {
  interface MockState { feedback?: Record<string, Feedback> }
}

type Pill = readonly [label: string, tone: PillColor];

export const ACCEPT_STATUS = { wait: ["รอหน่วยงานยอมรับ", "Warning"], ok: ["หน่วยงานยอมรับแล้ว", "Success"] } as const satisfies Record<string, Pill>;   // ACC
export const PLAN_ACCEPT_STATUS = { wait: ["ครบทุกคันแล้ว รอตรวจหลักฐาน", "Warning"], done: ["ยอมรับผลทั้งแผนแล้ว", "Success"] } as const satisfies Record<string, Pill>;
export const EVIDENCE_BADGE = { wait: ["ครบทุกคันแล้ว", "Warning"], done: ["ยอมรับผลทั้งแผนแล้ว", "Success"] } as const satisfies Record<string, Pill>;

/* accRows cars (VEH[0], VEH[1], VEH[4]) — ชุดตัวอย่าง S13 S14 (ใส่เป็นงาน "เสร็จสิ้น" ของแผนเดินทาง T1) */
export const ACCEPTANCE_CARS = [
  { carId: "82-6789", date: "04/11/2569", by: "นายวิชัย ทองดี (กบค.)" },
  { carId: "82-1145", date: "05/11/2569", by: "นางสาวกนกวรรณ ใจมั่น (กบค.)" },
  { carId: "80-9981", date: "06/11/2569", by: "นายสมชาย พูลสุข (กบค.)" },
];
export const ACCEPTANCE_DOCS = (plateNo: string) => [{ name: `ใบตรวจสภาพอะไหล่-${plateNo}.pdf`, size: "380 KB" }, { name: `ใบตรวจสภาพงานบำรุงรักษา-${plateNo}.pdf`, size: "410 KB" }];
export const FEEDBACK_SAMPLE = { score: 5, comment: "ทีมงานตรงเวลา ทำความสะอาดพื้นที่หลังเสร็จงาน" };
/** วันที่ในกล่องแจ้งผลหลังยอมรับ (carResult o.ok · planEvidence o.done) */
export const ACCEPT_DATES = { car: "06/11/2569", plan: "14/11/2569" };

/* ---------- แถวรายการ (จากงานรายคัน) ---------- */
export interface AccRow { trip: JobTrip; car: TripCar; job: Job; date: string; by: string; mr: string; cannot: boolean; accepted: boolean }
function rowOf(trip: JobTrip, car: TripCar, job: Job): AccRow | null {
  if (job.status !== "done" && job.status !== "cannot") return null;
  const cannot = job.status === "cannot" && !!job.cannot;
  return { trip, car, job, mr: trip.planMr, cannot, accepted: !!job.acceptedAt,
    date: (cannot ? job.cannot!.at : job.closedAt ?? "").slice(0, 10), by: cannot ? job.cannot!.by : job.recordedBy ?? "-" };
}
/** แถวรถทุกคันที่ถึงขั้นยอมรับผล (เรียงตามแผนเดินทาง → ลำดับรถในใบ) */
export function accRows(m: MockState): AccRow[] {
  const s = jobsOf(m);
  return Object.values(s.trips).flatMap((t) => t.carIds.map((id) => { const c = carOf(id); return c ? rowOf(t, c, getJob(s, t.id, id)) : null; }))
    .filter((r): r is AccRow => !!r);
}
export const accRecord = (m: MockState, tripId: string | null, carId: string | null) => accRows(m).find((r) => r.trip.id === tripId && r.car.id === carId);
export const accCarHref = (r: AccRow) => "/acceptance/car/?trip=" + r.trip.id + "&car=" + r.car.id;
/** รายการงานและอะไหล่ที่ใช้จริง: แถวปิดงาน (ใช้จริง) · บำรุงรักษาไม่ได้ = จำนวนที่ใช้ไปแล้ว */
export const workRows = (j: Job) => hireRows(j);

/* ---------- ทั้งแผน (S14) ---------- */
export interface PlanAcc { planId: string; mr: string; rows: AccRow[]; ready: boolean; done: boolean; range: string; by: string }
const dkey = (d: string) => d.split("/").reverse().join("");
/** แผนพร้อมตรวจหลักฐาน = รถทุกคันในแผนเดินทางที่อนุมัติแล้วของแผนถึงขั้นยอมรับผล และหน่วยงานยอมรับครบทุกคัน */
export function planAcc(m: MockState, planId: string): PlanAcc {
  const trips = Object.values(jobsOf(m).trips).filter((t) => t.planId === planId);
  const rows = accRows(m).filter((r) => r.trip.planId === planId);
  const total = trips.reduce((n, t) => n + t.carIds.length, 0);
  const dates = rows.map((r) => r.date).filter(Boolean).sort((a, b) => dkey(a).localeCompare(dkey(b)));
  const range = !dates.length ? "-" : dates[0] === dates[dates.length - 1] ? dates[0] : dates[0].slice(0, 2) + "–" + dates[dates.length - 1];
  const by = [...new Set(trips.map((t) => (t.mode === "hire" ? t.vendor ?? "-" : "กบค. (ตรวจเอง)")))].join(", ");
  return { planId, mr: "MR " + planId, rows, ready: total > 0 && rows.length === total && rows.every((r) => r.accepted), done: !!closeoutOf(m, planId).accepted, range, by };
}
/** แผนที่มีรถถึงขั้นยอมรับผล */
export const accPlans = (m: MockState) => [...new Set(accRows(m).map((r) => r.trip.planId))].map((id) => planAcc(m, id));
/* ---------- เขียน ---------- */
export const feedbackOf = (m: MockState, planId: string): Feedback => m.feedback?.[planId] ?? { score: null, comment: "" };
export function writeFeedback(planId: string, patch: Partial<Feedback>) {
  setMock((s) => ({ ...s, feedback: { ...s.feedback, [planId]: { ...feedbackOf(s, planId), ...patch } } }));
}
/** S13 ยอมรับผลรายคัน */
export const acceptCar = (r: AccRow) => applyJobs((s) => ({ ...s, jobs: { ...s.jobs, [jobKey(r.trip.id, r.car.id)]: { ...getJob(s, r.trip.id, r.car.id), acceptedAt: ACCEPT_DATES.car } } }));
/** S14 ยอมรับผลทั้งแผน → แจ้ง กบค. (S15 ส่งประวัติได้) */
export const acceptPlan = (planId: string) => markPlanAccepted(planId);

/* ---------- ?sample= จากหน้า /scenarios/ (ของต้นแบบ) ----------
   S13 = แผนเดินทาง T1 (3 คันของ accRows) เสร็จสิ้นทุกคัน รอหน่วยงานยอมรับ · S14 = ยอมรับครบ 3 คันแล้ว (แถวทั้งแผนขึ้นในรายการ) ยังไม่ประเมิน */
function acceptSample(all: boolean) {
  const T1: JobTrip = { ...SEED_TRIPS.T1, carIds: ACCEPTANCE_CARS.map((c) => c.carId) };
  applyJobs(() => ({
    trips: { T1 },
    jobs: Object.fromEntries(ACCEPTANCE_CARS.map((r) => {
      const j = closedSample(T1, r.carId, false, "done");
      return [jobKey("T1", r.carId), { ...j, closedAt: r.date + " 11:15 น.", recordedBy: r.by, ...(all ? { acceptedAt: ACCEPT_DATES.car } : {}) }];
    })),
  }), [{ ...TRIP_OTHER }]);
  setPlanStatus("Z7000001", "active");
  putCloseout("Z7000001", { accepted: undefined, sentAt: undefined, head: undefined, headAt: undefined, headReason: undefined, closedAt: undefined });
  setMock((s) => { const f = { ...s.feedback }; delete f.Z7000001; return { ...s, feedback: f }; });
}
export const ACCEPT_SAMPLES = {
  S13: { role: "หน่วยงานเจ้าของรถ" as const, apply: () => acceptSample(false) },
  S14: { role: "หน่วยงานเจ้าของรถ" as const, apply: () => acceptSample(true) },
};
