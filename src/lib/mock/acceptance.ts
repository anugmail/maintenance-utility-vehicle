"use client";
/* ข้อมูลจำลอง S13 ผู้ดูแลยานพาหนะ รับทราบผลและประเมินความพึงพอใจรายคัน (Figma 9607c3b · R89 · 10 พ.ย. 2569)
   ยกจาก screens.js: ACC · ACC_COLS · ACK_CARS · ACK_LIST · accRows · ackResult · NOTI_ACK · feedback
   เจ้าของงาน 10 พ.ย. 2569: ผู้กด = ผู้ดูแลยานพาหนะที่ระบุรายคันในแผนเดินทาง · ประเมิน 1–5 ย้ายจาก S14 มาไว้ตอนรับทราบ (11 พ.ย. 2569 แทนด้วยแบบประเมินความพึงพอใจของ กบค. survey.ts · R94) · ปุ่ม "รับทราบ" สีเขียว ไม่มี popup ยืนยัน
   รอบเดียวต่อคัน (Q28) · S14 S15 S16 S17 ตัดออก ⇒ รับทราบครบทุกคันในแผนแล้วแผนปิดงานเอง (เสนอ · Figma 6299e1d)
   รายการ = งานรายคัน (jobs.ts) ของแผนเดินทางที่อนุมัติแล้วที่ "เสร็จสิ้น" หรือ "บำรุงรักษาไม่ได้" · รับทราบ = job.acceptedAt + job.survey (+ job.score คะแนนเฉลี่ย)
   "ครบทุกคันในแผน" (ยังไม่เคาะ: แผนทั้งปี หรือแผนเดินทางรายใบ) — ต้นแบบนับยานพาหนะทุกคันในแผนเดินทางที่อนุมัติแล้วของแผน (แบบประวัติ history.ts) */
import type { PillColor } from "@/components/vms/PillOutline";
import { putCloseout } from "./closeout";
import { JOB_TEXT, PEOPLE, SEED_TRIPS, WORK, applyJobs, carOf, closedSample, getJob, jobKey, jobsOf, newJob, workItems, type Job, type JobTrip, type TripCar } from "./jobs";
import { setMock, type MockState } from "./store";
import { sampleAnswers, surveyAvg, surveyInfo, type SurveyRecord } from "./survey";
import { DEFAULT_NOTIS, TRIP_OTHER, ackNoti } from "./trips";

type Pill = readonly [label: string, tone: PillColor];

/* ACC — สถานะรายคัน (เดิม รอหน่วยงานยอมรับ / หน่วยงานยอมรับแล้ว) */
export const ACCEPT_STATUS = { wait: ["รอรับทราบ", "Warning"], ok: ["รับทราบแล้ว", "Success"] } as const satisfies Record<string, Pill>;
export const ACK_LIST = "ผลการบำรุงรักษารอรับทราบ";
/** รับทราบเมื่อ (ackResult o.done) */
export const ACK_AT = "06/11/2569 10:05 น.";

/* ACK_CARS ของ screens.js = [JOB_I, TRIP_1.sel[1], TRIP_1.sel[2]] — 82-6789 · 82-1145 ปิดงานแล้ว · 80-9981 บำรุงรักษาไม่ได้ (MOVE_I) */
export const ACCEPTANCE_CARS = [
  { carId: "82-6789", date: "04/11/2569", by: "นายวิชัย ทองดี (กกฟ.1)", cannot: false },
  { carId: "82-1145", date: "05/11/2569", by: "นางสาวกนกวรรณ ใจมั่น (กกฟ.1)", cannot: false },
  { carId: "80-9981", date: "05/11/2569", by: PEOPLE.kbk, cannot: true },
];

/* ---------- แถวรายการ (จากงานรายคัน) ---------- */
export interface AccRow { trip: JobTrip; car: TripCar; job: Job; date: string; by: string; mr: string; cannot: boolean; accepted: boolean }
function rowOf(trip: JobTrip, car: TripCar, job: Job): AccRow | null {
  if (job.status !== "done" && job.status !== "cannot") return null;
  const cannot = job.status === "cannot" && !!job.cannot;
  return { trip, car, job, mr: trip.planMr, cannot, accepted: !!job.acceptedAt,
    date: (cannot ? job.cannot!.at : job.closedAt ?? "").slice(0, 10), by: cannot ? job.cannot!.by : job.recordedBy ?? "-" };
}
/** แถวยานพาหนะทุกคันที่ถึงขั้นรับทราบ (เรียงตามแผนเดินทาง → ลำดับยานพาหนะในใบ) */
export function accRows(m: MockState): AccRow[] {
  const s = jobsOf(m);
  return Object.values(s.trips).flatMap((t) => t.carIds.map((id) => { const c = carOf(id); return c ? rowOf(t, c, getJob(s, t.id, id)) : null; }))
    .filter((r): r is AccRow => !!r);
}
export const accRecord = (m: MockState, tripId: string | null, carId: string | null) => accRows(m).find((r) => r.trip.id === tripId && r.car.id === carId);
export const accCarHref = (r: { trip: Pick<JobTrip, "id">; car: Pick<TripCar, "id"> }) => "/acceptance/car/?trip=" + r.trip.id + "&car=" + r.car.id;
/** รายการงานและอะไหล่ที่ใช้จริง: แถวปิดงาน (ใช้จริง) · บำรุงรักษาไม่ได้ = จำนวนที่ใช้ไปแล้ว */
export const workRows = (j: Job) => workItems(j);
/** "นายวิชัย ทองดี (กกฟ.1)" → [ชื่อ, หน่วยงาน] (ช่องผู้ดำเนินการ ชื่อบน หน่วยงานบรรทัดรอง) */
export const splitBy = (by: string): [string, string | undefined] => { const m = /^(.*) \((.*)\)$/.exec(by); return m ? [m[1], m[2]] : [by, undefined]; };

/** รับทราบครบทุกคันในแผนแล้ว (ยานพาหนะทุกคันในแผนเดินทางที่อนุมัติแล้วของแผน เสร็จสิ้น/บำรุงรักษาไม่ได้ และรับทราบแล้ว) */
export function planAcked(m: MockState, planId: string) {
  const trips = Object.values(jobsOf(m).trips).filter((t) => t.planId === planId);
  const total = trips.reduce((n, t) => n + t.carIds.length, 0);
  const rows = accRows(m).filter((r) => r.trip.planId === planId);
  return total > 0 && rows.length === total && rows.every((r) => r.accepted);
}

/* ---------- เขียน ---------- */
/** S13 รับทราบรายคัน (บันทึกทันที ไม่มี popup) · survey = แบบประเมินความพึงพอใจของ กบค. ที่ตอบครบ (คันที่บำรุงรักษาไม่ได้ไม่มี · R94 11 พ.ย. 2569) · job.score = คะแนนเฉลี่ย
    ครบทุกคันในแผน → แผน "ปิดงานแล้ว" เอง (เสนอ · Figma 6299e1d · S16 S17 ตัดออก 10 พ.ย. 2569 — รับทราบรายคันเป็นขั้นสุดท้าย) */
export function acceptCar(r: AccRow, survey: SurveyRecord | null) {
  applyJobs((s) => ({ ...s, jobs: { ...s.jobs, [jobKey(r.trip.id, r.car.id)]: { ...getJob(s, r.trip.id, r.car.id), acceptedAt: ACK_AT, ...(survey ? { survey, score: surveyAvg(survey.answers) } : {}) } } }));
  const id = r.trip.planId;
  let sent = false;
  setMock((s) => {
    const p = s.plans.find((x) => x.mr === "MR" + id);
    if (!p || p.status !== "active" || !planAcked(s, id)) return s;
    sent = true;
    return { ...s, plans: s.plans.map((x) => (x === p ? { ...x, status: "closed" as const } : x)) };
  });
  if (sent) putCloseout(id, { closedAt: ACK_AT.slice(0, 10) });
}

/* ---------- ?sample= จากหน้า /scenarios/ (ของต้นแบบ) ----------
   S13 = แผนเดินทาง T1 3 คัน (ACCEPTANCE_CARS) ถึงขั้นรับทราบ ยังไม่รับทราบ + แจ้งเตือนใหม่ของ 82-6789 · acked = รับทราบครบแล้ว */
export function acceptSample(acked: boolean) {
  const T1: JobTrip = { ...SEED_TRIPS.T1, carIds: ACCEPTANCE_CARS.map((c) => c.carId) };
  applyJobs(() => ({
    trips: { T1 },
    jobs: Object.fromEntries(ACCEPTANCE_CARS.map((r) => {
      const j: Job = r.cannot
        ? { ...newJob("T1", r.carId), status: "cannot", cannot: { reason: JOB_TEXT.cannotSelf, used: WORK.map(() => 0), by: r.by, at: r.date + " 09:20 น.", whileDoing: false } }
        : { ...closedSample(T1, r.carId), closedAt: r.date + " 11:15 น.", recordedBy: r.by };
      return [jobKey("T1", r.carId), acked ? { ...j, acceptedAt: ACK_AT, ...(r.cannot ? {} : ackedSurvey(r.carId)) } : j];
    })),
  }), [{ ...TRIP_OTHER }]);
  const first = carOf(ACCEPTANCE_CARS[0].carId)!;
  setMock((s) => ({ ...s, plans: s.plans.map((p) => (p.mr === "MRZ7000001" ? { ...p, status: "active" as const } : p)), notis: acked ? DEFAULT_NOTIS() : [ackNoti(T1, first), ...DEFAULT_NOTIS()] }));
  putCloseout("Z7000001", { closedAt: undefined });
}
/** ผลประเมินตัวอย่างของคันที่รับทราบแล้ว (ค่าจอ L.5) */
export function ackedSurvey(carId: string): { survey: SurveyRecord; score: number } {
  const c = carOf(carId)!, answers = sampleAnswers();
  return { survey: { info: surveyInfo(c.plate, c.ctrl, c.owner), answers }, score: surveyAvg(answers) };
}
export const ACCEPT_SAMPLES = {
  S13: { role: "ผู้ดูแลยานพาหนะ" as const, apply: () => acceptSample(false) },
};
