"use client";
/* S24 ข้อมูลการบำรุงรักษารายคัน + กำหนดครั้งถัดไป — ค่าตัวอย่างชุดเดียวกับปลั๊กอิน Figma (screens.js: MA_DUE · MA_ITEMS · MA_ROWS · MA_COLS · MA_NEXT_COLS · MA_HIST_COLS · MA_HIST)
   ไม่มีที่เก็บของตัวเอง: บันทึกการบำรุงรักษา = ประวัติตั้งต้น (SEED ด้านล่าง ยกจาก MA_ROWS / MA_HIST) + งานรายคันที่ปิดแล้วในที่เก็บงานรายคัน (jobs.ts · MockState.jobs)
     · ปิดงานรายคันของแผนตรวจเอง (S10 → "เสร็จสิ้น") หรือ กบค. อนุมัติงานของผู้รับจ้าง (S11 → "เสร็จสิ้น") = 1 บันทึกใหม่ทันที (อ่านสด ไม่คัดลอกเก็บซ้ำ)
     · ผลตรวจน้ำมันที่บันทึกภายหลัง (S12) / เอกสาร Safety Inspection ที่เพิ่มภายหลัง (S10) = บันทึกเดิมอัปเดตตาม
     · คันที่ "บำรุงรักษาไม่ได้" ขึ้นในประวัติ แต่ไม่นับเป็นครั้งล่าสุด
   กำหนดครั้งถัดไป (Condition ของ Scenario 24 ในไฟล์ userflow) = รายการที่ถึงก่อนจาก 4 อย่าง:
     รอบเวลา 12 เดือนจากครั้งล่าสุด · ชั่วโมงเครื่องจักร ทุก 1,000 ชม. (ประมาณวันจากการใช้งานเฉลี่ยระหว่างสองครั้งล่าสุด — คิดไม่ได้ = แสดงชั่วโมงเป้าหมายอย่างเดียว ไม่นำมาเทียบ)
     · น้ำมันไฮโดรลิก 3 ปีจากเปลี่ยนครั้งล่าสุด · Safety Inspection 1 ปี (เฉพาะรถเครน/รถกระเช้า)
     ใกล้ครบ = ครบภายใน 6 เดือนนับจากวันนี้ · ครบ = ถึงหรือเลยวันครบ · วันเท่ากัน = รายการที่มาก่อนใน MA_ITEMS */
import { useMemo } from "react";
import {
  carOf, closeRows, jobsOf, oilSampled, num, nf, safetyOn, SIGN_DATE, TRIP_CARS, WSTAT, OIL_JOB_OPTS,
  type Job, type JobTrip, type OilChoice, type TripCar,
} from "./jobs";
import { useMock, type MockState } from "./store";
import { OWN_UNIT, STAFF } from "./trips";

/* วันนี้ของต้นแบบ = วันที่ของจอ Figma (MA_ROWS "วันนี้ 04/11/2569" · SIGN_DATE / JOB_TIMES ของ jobs.ts) — คงที่ให้ตรงจอ */
export const MA_TODAY = SIGN_DATE;

export type DueTone = "warning" | "error";
export type DueStatus = "near" | "over";
/* MA_DUE — ข้อความตาม Vehicle list ของ UI Release#2 · สีบรรทัดรอง Color/text/warning · Color/text/error */
export const MA_DUE: Record<DueStatus, [string, DueTone]> = { near: ["ใกล้ครบกำหนดบำรุงรักษา", "warning"], over: ["ครบกำหนดบำรุงรักษา", "error"] };
export const MA_ITEMS = ["รอบเวลา", "ชั่วโมงเครื่องจักร/ระยะทาง", "น้ำมันไฮโดรลิก", "Safety Inspection"] as const;
export const MA_NO_DATA = "ยังไม่มีข้อมูลการบำรุงรักษา";
export const MA_CYCLE = ["ทุก 12 เดือน", "ทุก 1,000 ชม.", "เปลี่ยนทุก 3 ปี", "ทุก 1 ปี"];
const HOURS_CYCLE = 1000;

/* ---------- วันที่ (วว/ดด/ปปปป พ.ศ.) ---------- */
const pad = (n: number) => String(n).padStart(2, "0");
export const dayOf = (s: string) => { const [d, m, y] = s.slice(0, 10).split("/").map(Number); return Date.UTC(y - 543, m - 1, d); };
export const thaiDate = (t: number) => { const d = new Date(t); return pad(d.getUTCDate()) + "/" + pad(d.getUTCMonth() + 1) + "/" + (d.getUTCFullYear() + 543); };
const thaiMonth = (t: number) => { const d = new Date(t); return pad(d.getUTCMonth() + 1) + "/" + (d.getUTCFullYear() + 543); };
const addMonths = (t: number, n: number) => { const d = new Date(t); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate()); };
const DAY = 864e5;

/* ---------- บันทึกการบำรุงรักษา (1 ครั้งที่ปิดงาน = 1 บันทึก) ---------- */
export interface MaRecord {
  key: string; carId: string;
  /** วันที่ปิดงาน */
  date: string; planMr: string; tripId?: string; tripName?: string;
  /** งานที่ทำ · อะไหล่ที่ใช้จริง ("ชื่อ จำนวน หน่วย") */
  work: string; parts: string[];
  km?: string; hours?: string;
  /** น้ำมันไฮโดรลิกที่เลือก (OIL_JOB_OPTS) · ผลตรวจ "ผ่าน" "ไม่ผ่าน" "รอผลตรวจ" (เฉพาะที่เก็บตัวอย่าง) */
  oil?: OilChoice; oilResult?: string;
  /** วันที่ Safety Inspection (มีเอกสารแนบ) · ชื่อไฟล์ */
  safety?: string; safetyFiles?: string[];
  by: string;
  /** บำรุงรักษาไม่ได้ (สาเหตุ) — ขึ้นในประวัติ ไม่นับเป็นครั้งล่าสุด */
  cannot?: string;
  /** มาจากงานรายคันในต้นแบบ → เปิดหน้างานรายคันที่ปิดแล้ว /trips/job/ ได้ · ไม่มี = ประวัติตั้งต้น */
  fromJob?: boolean;
}

/* SEED — ประวัติก่อนต้นแบบ: แถวของ MA_ROWS (ครั้งล่าสุดของแต่ละคัน) + MA_HIST (82-1145 สามครั้ง)
   MA_ROWS: ล่าสุด · แผน · ไมล์ · ชม. · เปลี่ยนน้ำมันล่าสุด · ผลตรวจน้ำมัน · Safety ล่าสุด
     เปลี่ยนน้ำมันวันเดียวกับครั้งล่าสุด = เลือก "เก็บตัวอย่างและเปลี่ยน" · คนละวัน = "เก็บตัวอย่าง" และเปลี่ยนน้ำมันครั้งก่อนหน้า = OIL_BEFORE
   งานที่ทำ: ข้อความของ MA_HIST (เก็บตัวอย่าง = MA_HIST[0] · เปลี่ยนน้ำมัน = MA_HIST[2]) · ผู้บันทึก TRIP.staff[0]
   82-6789 (ครั้งล่าสุด 04/11/2569 ของ MA_ROWS) ไม่อยู่ที่นี่ — มาจากงานรายคันที่ปิดใน S10 (ชุดตัวอย่าง ?sample=S24) */
const WORK_SAMPLE = "เปลี่ยนไส้กรองไฮโดรลิก · ไส้กรองน้ำมันเครื่อง", WORK_CHANGE = "เปลี่ยนน้ำมันไฮโดรลิก · ไส้กรอง";
type Row = [carId: string, date: string, plan: string, km: string, hrs: string, oilAt: string, result: string, safety: string];
const MA_ROWS: Row[] = [
  ["80-4458", "01/10/2568", "MR Z6900011", "171,220", "5,610", "01/10/2568", "ผ่าน", "01/10/2568"],
  ["80-5738", "14/10/2568", "MR Z6900011", "168,900", "5,480", "14/10/2568", "ไม่ผ่าน", "14/10/2568"],
  ["80-3316", "20/11/2568", "MR Z6900011", "154,300", "4,920", "05/02/2567", "ผ่าน", "20/11/2568"],
  ["80-9981", "10/01/2569", "MR Z6900014", "176,050", "5,840", "10/01/2569", "ผ่าน", "10/01/2569"],
  ["82-7720", "02/02/2569", "MR Z6900014", "149,700", "4,410", "18/06/2568", "ผ่าน", "02/02/2569"],
  ["81-6604", "20/09/2569", "MR Z7000001", "163,480", "5,120", "20/09/2569", "ผ่าน", "20/09/2569"],
];
const seedRow = ([carId, date, plan, km, hrs, oilAt, result, safety]: Row): MaRecord => {
  const change = oilAt === date;
  return { key: "seed:" + carId + ":" + date, carId, date, planMr: plan, work: change ? WORK_CHANGE : WORK_SAMPLE, parts: [], km: km + " กม.", hours: hrs + " ชม.",
    oil: change ? 2 : 0, oilResult: result, safety, by: STAFF[0] };
};
/* MA_HIST — 82-1145 (MA_CAR) · ใหม่สุดก่อน */
const MA_HIST: MaRecord[] = [
  { key: "seed:82-1145:18/06/2569", carId: "82-1145", date: "18/06/2569", planMr: "MR Z6900014", work: WORK_SAMPLE, parts: [], km: "176,050 กม.", hours: "6,010 ชม.", oil: 0, oilResult: "ผ่าน", safety: "18/06/2569", by: STAFF[0] },
  { key: "seed:82-1145:20/06/2568", carId: "82-1145", date: "20/06/2568", planMr: "MR Z6800007", work: "เปลี่ยนไส้กรองไฮโดรลิก", parts: [], km: "168,300 กม.", hours: "5,420 ชม.", oil: 0, oilResult: "ผ่าน", by: STAFF[2] },
  { key: "seed:82-1145:12/03/2567", carId: "82-1145", date: "12/03/2567", planMr: "MR Z6700004", work: WORK_CHANGE, parts: [], km: "159,800 กม.", hours: "4,880 ชม.", oil: 1, by: STAFF[1] },
];
export const SEED: MaRecord[] = [...MA_ROWS.map(seedRow), ...MA_HIST];
/* เปลี่ยนน้ำมันครั้งก่อนประวัติตั้งต้น (MA_ROWS คอลัมน์เปลี่ยนน้ำมันล่าสุด) · คันอื่น = เปลี่ยนน้ำมันครั้งล่าสุดของรถในงานรายคัน (LAST_OIL ใน jobs.ts) */
const OIL_BEFORE: Record<string, string> = { "80-3316": "05/02/2567", "82-7720": "18/06/2568" };

/* ---------- งานรายคัน → บันทึก ---------- */
const OIL_RESULT_TEXT = ["ผ่าน", "ไม่ผ่าน"];
function jobRecord(j: Job, t: JobTrip): MaRecord | null {
  const base = { key: "job:" + t.id + ":" + j.carId, carId: j.carId, planMr: t.planMr, tripId: t.id, tripName: t.name, fromJob: true };
  if (j.status === "cannot" && j.cannot) {
    return { ...base, date: j.cannot.at.slice(0, 10), work: WSTAT.cannot[0], parts: [], by: j.cannot.by, cannot: j.cannot.reason };
  }
  if (j.status !== "done" || !j.close || !j.closedAt) return null;
  const rows = closeRows(j.close).filter((r) => r.used > 0);
  const task = (part: string) => j.parts.find((p) => p.part === part)?.task ?? part;
  const sampled = oilSampled(j.close.oilChoice);
  const r = j.oilResult;
  const files = j.safety?.files ?? j.close.safetyFiles ?? [];
  const safety = !files.length ? undefined : j.safety?.savedAt ? j.safety.savedAt.slice(0, 10) : j.closedAt.slice(0, 10);
  return {
    ...base, date: j.closedAt.slice(0, 10), work: rows.map((x) => task(x.part)).join(" · ") || "-", parts: rows.map((x) => x.part + " " + nf(x.used) + " " + x.unit),
    km: j.kmAfter, hours: j.hoursAfter, oil: j.close.oilChoice,
    oilResult: sampled ? (!r || r.sel < 0 ? "รอผลตรวจ" : OIL_RESULT_TEXT[r.sel]) : undefined,
    safety, safetyFiles: files.map((f) => f.name), by: j.recordedBy ?? "-",
  };
}

/* ---------- กำหนดครั้งถัดไป ---------- */
export interface DueItem {
  k: 0 | 1 | 2 | 3;
  /** ครั้งล่าสุด · ครบกำหนด (ข้อความในตาราง กำหนดครั้งถัดไป) */
  last: string; dueText: string;
  /** วันครบ (ชั่วโมงเครื่องจักร = วันที่ประมาณ) · ไม่มี = คิดไม่ได้ */
  due?: number; status?: DueStatus;
}
export interface MaCar {
  car: TripCar;
  records: MaRecord[];   // ใหม่สุดก่อน
  latest?: MaRecord;
  oilAt?: string; oilResult?: string; safety?: string;
  items: DueItem[];
  next?: DueItem;
}
const statusOf = (due: number | undefined, today: number): DueStatus | undefined =>
  due == null ? undefined : due <= today ? "over" : due <= addMonths(today, 6) ? "near" : undefined;

export function maCar(car: TripCar, all: MaRecord[], today = dayOf(MA_TODAY)): MaCar {
  const records = all.filter((r) => r.carId === car.id).sort((a, b) => dayOf(b.date) - dayOf(a.date) || (a.fromJob === b.fromJob ? 0 : a.fromJob ? -1 : 1));
  const done = records.filter((r) => !r.cannot);
  const latest = done[0];
  if (!latest) return { car, records, items: [], next: undefined };
  const changed = done.find((r) => r.oil === 1 || r.oil === 2);
  const oilAt = changed?.date ?? OIL_BEFORE[car.id] ?? car.lastOil;
  const sampled = done.find((r) => r.oil === 0 || r.oil === 2);
  const safetyRec = safetyOn(car) ? done.find((r) => r.safety) : undefined;
  const items: DueItem[] = [];
  const at = (k: DueItem["k"], last: string, due: number | undefined, dueText?: string) =>
    items.push({ k, last, due, dueText: dueText ?? (due == null ? "-" : thaiDate(due)), status: statusOf(due, today) });
  /* (1) รอบเวลา */
  at(0, latest.date, addMonths(dayOf(latest.date), 12));
  /* (2) ชั่วโมงเครื่องจักร — ประมาณวันจากการใช้งานเฉลี่ยระหว่างสองครั้งล่าสุดที่มีชั่วโมง */
  const withH = done.filter((r) => r.hours && num(r.hours) > 0);
  if (withH[0]) {
    const h1 = num(withH[0].hours), target = h1 + HOURS_CYCLE;
    let est: number | undefined;
    if (withH[1]) {
      const rate = (h1 - num(withH[1].hours)) / ((dayOf(withH[0].date) - dayOf(withH[1].date)) / DAY);
      if (rate > 0 && Number.isFinite(rate)) est = dayOf(withH[0].date) + Math.round(HOURS_CYCLE / rate) * DAY;
    }
    at(1, withH[0].hours + (withH[0].km ? " · " + withH[0].km : ""), est, nf(target) + " ชม." + (est != null ? " (ประมาณ " + thaiMonth(est) + ")" : ""));
  } else at(1, "-", undefined);
  /* (3) น้ำมันไฮโดรลิก */
  const oilOk = /^\d{2}\/\d{2}\/\d{4}/.test(oilAt);   // LAST_OIL "ไม่มีข้อมูล" = คิดไม่ได้
  at(2, oilOk ? "เปลี่ยน " + oilAt : "-", oilOk ? addMonths(dayOf(oilAt), 36) : undefined);
  /* (4) Safety Inspection — เฉพาะรถเครน/รถกระเช้า */
  if (safetyOn(car)) at(3, safetyRec?.safety ?? "-", safetyRec?.safety ? addMonths(dayOf(safetyRec.safety), 12) : undefined);
  const next = items.filter((i) => i.due != null).sort((a, b) => a.due! - b.due! || a.k - b.k)[0];
  return { car, records, latest, oilAt: oilOk ? oilAt : undefined, oilResult: sampled?.oilResult, safety: safetyRec?.safety, items, next };
}

/* รถทุกคันของงานบำรุงรักษา (รถในงานรายคัน jobs.ts) + บันทึก · เรียงกำหนดครั้งถัดไปที่ใกล้สุดก่อน · คันที่ยังไม่มีบันทึกอยู่ท้าย
   owner = หน่วยงานเจ้าของรถ เห็นเฉพาะรถในสังกัด (OWN_UNIT) */
export function maCars(m: MockState, owner = false): MaCar[] {
  const s = jobsOf(m);
  const fromJobs = Object.values(s.jobs).map((j) => (s.trips[j.tripId] ? jobRecord(j, s.trips[j.tripId]) : null)).filter((r): r is MaRecord => !!r);
  const all = [...SEED, ...fromJobs];
  /* รถตัวอย่าง (TRIP_CARS) + รถจากแผนที่สร้างในฟอร์มที่มีบันทึกแล้ว */
  const extra = [...new Set(fromJobs.map((r) => r.carId))].filter((id) => !TRIP_CARS.some((c) => c.id === id)).map(carOf).filter((c): c is TripCar => !!c);
  return [...TRIP_CARS, ...extra].filter((c) => !owner || c.owner === OWN_UNIT).map((c) => maCar(c, all))
    .sort((a, b) => (a.next ? a.next.due! : Infinity) - (b.next ? b.next.due! : Infinity) || a.car.plate.localeCompare(b.car.plate));
}
export function useMaCars(owner: boolean) { const m = useMock(); return useMemo(() => maCars(m, owner), [m, owner]); }

/* ---------- ข้อความในตาราง ---------- */
export const oilText = (k?: OilChoice) => (k == null ? "-" : OIL_JOB_OPTS[k]);
/** ช่องกำหนดครั้งถัดไปของรายการรถ: "วันที่ · รายการ" + บรรทัดรองสถานะ */
export const nextText = (c: MaCar) => (c.next ? thaiDate(c.next.due!) + " · " + MA_ITEMS[c.next.k] : MA_NO_DATA);
export const isDue = (c: MaCar) => !!c.next?.status;
/* ตัวเลือกตัวกรอง */
export const MA_STATUS_OPTS = [MA_DUE.near[0], MA_DUE.over[0]];
