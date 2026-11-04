"use client";
/* ตัวช่วยเฉพาะแผนจ้างดำเนินการ (S23 ผู้รับจ้าง · S11 กบค. ตรวจรับ) — ค่าชุดเดียวกับปลั๊กอิน Figma (screens.js: hireJob · partEditModal · partAddModal · HIRE_*)
   ไม่มีที่เก็บของตัวเอง: อ่าน/เขียนงานรายคันใน ./jobs.ts (MockState.jobs · patchJob) ที่เดียวกับ S10 S12
   แถวอะไหล่ของงาน (hireRows) อ่านจากข้อมูลที่มีจริงของงานนั้น:
     แจ้งบำรุงรักษาไม่ได้ → อะไหล่ตามแผน (job.parts) + จำนวนที่ใช้ไปแล้ว (job.cannot.used)
     ปิดงานแล้ว / มีร่างปิดงาน → แถวรายการสภาพวัสดุอะไหล่ของหน้าปิดงาน (job.close.parts) ⇒ แก้ที่หน้านี้แล้วหน้าปิดงานเห็นค่าเดียวกัน
     ยังไม่มีร่าง → อะไหล่ตามแผน (ใช้ = ตามแผน)
   k = ลำดับในชุดข้อมูลต้นทาง (ใช้กับ hireEditUsed / hireDeletePart) */
import { JOB_TIMES, OIL_PART, PEOPLE, cannotJob, emptyClose, patchJob, thaiNow, type ClosePartRow, type Job, type JobTrip, type TripCar } from "./jobs";

export interface WorkItem { task: string; part: string; planQty: number; usedQty: number; unit: string; k: number }
export interface NewPart { name: string; code: string; qty: string; unit: string }

export const isCannotJob = (j: Job) => !!j.cannot;

export function hireRows(j: Job): WorkItem[] {
  if (j.cannot) { const used = j.cannot.used; return j.parts.map((p, k) => ({ task: p.task, part: p.part, planQty: p.planQty, usedQty: used[k] ?? 0, unit: p.unit, k })); }
  if (j.close) return j.close.parts.map((r, k) => ({ task: j.parts.find((p) => p.part === r.part)?.task ?? "-", part: r.part, planQty: r.planQty, usedQty: r.used, unit: r.unit, k }));
  return j.parts.map((p, k) => ({ task: p.task, part: p.part, planQty: p.planQty, usedQty: p.planQty, unit: p.unit, k }));
}
/** jobWork(): เลือกเก็บตัวอย่างอย่างเดียว = ไม่มีแถวเปลี่ยนน้ำมันไฮโดรลิก (ตารางอะไหล่ส่งคืนแสดงทุกแถว) */
export function hireWork(j: Job, rows = hireRows(j)) {
  const oil = j.close ? j.close.oilChoice : j.oilChoice;
  return rows.filter((r) => !(oil === 0 && r.part === OIL_PART));
}

/* ---------- แก้อะไหล่ (ผู้รับจ้าง: ตั้งแต่เริ่มงานจนถึงตรวจรับ) ---------- */
const withClose = (j: Job, t: JobTrip, c: TripCar, fn: (ps: ClosePartRow[]) => ClosePartRow[]): Job => {
  const f = j.close ?? emptyClose(j, t, c);
  return { ...j, close: { ...f, parts: fn(f.parts) } };
};
export function hireEditUsed(t: JobTrip, c: TripCar, k: number, used: number) {
  patchJob(t.id, c.id, (j) => (j.cannot
    ? { ...j, cannot: { ...j.cannot, used: j.parts.map((_, i) => (i === k ? used : j.cannot!.used[i] ?? 0)) } }
    : withClose(j, t, c, (ps) => ps.map((r, i) => (i === k ? { ...r, used } : r)))));
}
export function hireAddPart(t: JobTrip, c: TripCar, p: NewPart) {
  const part = p.name.trim(), code = p.code.trim() || undefined, qty = Number(p.qty);
  patchJob(t.id, c.id, (j) => (j.cannot
    ? { ...j, parts: [...j.parts, { task: "-", part, code, planQty: 0, unit: p.unit, unitPrice: 0 }], cannot: { ...j.cannot, used: [...j.parts.map((_, i) => j.cannot!.used[i] ?? 0), qty] } }
    : withClose(j, t, c, (ps) => [...ps, { part, code, unit: p.unit, unitPrice: 0, planQty: 0, used: qty, old: 0, note: "", added: true }])));
}
export function hireDeletePart(t: JobTrip, c: TripCar, k: number) {
  patchJob(t.id, c.id, (j) => {
    if (j.cannot) return { ...j, parts: j.parts.filter((_, i) => i !== k), cannot: { ...j.cannot, used: j.cannot.used.filter((_, i) => i !== k) } };
    const f = j.close ?? emptyClose(j, t, c), row = f.parts[k];
    return { ...j, parts: row && !row.added ? j.parts.filter((p) => p.part !== row.part) : j.parts, close: { ...f, parts: f.parts.filter((_, i) => i !== k) } };
  });
}

/* ---------- เปลี่ยนสถานะ ---------- */
/** S23 แจ้งบำรุงรักษาไม่ได้ (ใหม่ → แจ้งบำรุงรักษาไม่ได้) · แก้ไขงาน = แก้สาเหตุอย่างเดียว (คงผู้แจ้ง/เวลาเดิม) */
export function hireCannot(t: JobTrip, j: Job, reason: string, edit: boolean) {
  if (edit && j.cannot) patchJob(t.id, j.carId, (x) => ({ ...x, cannot: { ...x.cannot!, reason } }));
  else cannotJob(t, j.carId, reason, j.cannot?.used ?? j.parts.map(() => 0), true, JOB_TIMES.hire.reported);
}
/** S23 ส่งตรวจงาน → รอตรวจรับ (ล้างเหตุผลที่ส่งกลับ) */
export function sendJob(t: JobTrip, carId: string) {
  patchJob(t.id, carId, (j) => ({ ...j, status: "wait", sentAt: j.cannot ? JOB_TIMES.hire.sentCannot : JOB_TIMES.hire.sent, sentBy: PEOPLE.vendor, returnReason: undefined, returnedAt: undefined }));
}
/** S11 อนุมัติ → เสร็จสิ้น (คันที่เก็บตัวอย่างน้ำมันขึ้นป้าย "รอผลตรวจน้ำมัน" เอง — oilTag ใน jobs.ts) / บำรุงรักษาไม่ได้ */
export function approveJob(t: JobTrip, carId: string) {
  patchJob(t.id, carId, (j) => ({ ...j, status: j.cannot ? "cannot" : "done", reviewedAt: thaiNow(), reviewedBy: PEOPLE.kbk }));
}
/** S11 ส่งกลับแก้ไข + เหตุผล → ผู้รับจ้างเห็นใน Alert */
export function returnJob(t: JobTrip, carId: string, reason: string) {
  patchJob(t.id, carId, (j) => ({ ...j, status: "returned", returnReason: reason, returnedAt: thaiNow(), reviewedBy: PEOPLE.kbk }));
}
