/* S25 · กบค. ย้ายรถที่บำรุงรักษาไม่ได้ไปไตรมาสอื่น (เจ้าของงาน 5 พ.ย. 2569 · บล็อก X · BACKLOG ข้อ 12) — moveModal / moveQuarter / partsProgress o.subs ของ screens.js
   ที่เก็บ: MockState.moves (คีย์เดียวกับ store · mt-next-v1) — ที่เก็บเก่าไม่มีฟิลด์นี้ = ยังไม่มีการย้าย
   ย้าย = รถออกจากไตรมาสเดิม (qcars removed) + เข้าไตรมาสใหม่ขึ้นก่อน (qcars added) · แผนที่จัดรถรายคัน (alloc) เปลี่ยนไตรมาสของรถ อะไหล่ตามแผนของรถย้ายตาม
   แผนเดินทางเดิมยังมีรถคันนี้ (สถานะบำรุงรักษาไม่ได้) · ไม่ต้องอนุมัติใหม่ */
import { SAMPLE_Q_NEED } from "./closeout";
import { CAND, PARTS, QUARTERS } from "./data";
import { getJob, jobsOf } from "./jobs";
import { allocOf, quarterRows } from "./planFlow";
import { notify, setMock, type MockState } from "./store";
import { addQuarterCars, candId, quarterCars, quarterTrips, removeQuarterCar, type TripCar } from "./trips";

export interface Move { planId: string; carId: string; plate: string; from: number; to: number; tripId: string }
declare module "./store" {
  interface MockState { moves?: Move[] }
}
export const movesOf = (s: Pick<MockState, "moves">): Move[] => s.moves ?? [];
/** รถที่ย้ายเข้าไตรมาส q (ล่าสุดของแต่ละคัน) */
export const movedInto = (s: Pick<MockState, "moves">, planId: string, q: number) => {
  const last = new Map<string, Move>();
  movesOf(s).filter((m) => m.planId === planId).forEach((m) => last.set(m.carId, m));
  return [...last.values()].filter((m) => m.to === q);
};
export const qLabel = (k: number) => QUARTERS[k - 1].split(" (")[0];

/** แผนเดินทางของไตรมาสที่รถคันนี้อยู่ + สถานะงาน (บำรุงรักษาไม่ได้ = ย้ายได้) */
export function cannotTrip(s: MockState, planId: string, q: number, carId: string) {
  const t = quarterTrips(s, planId, q).find((x) => x.carIds.includes(carId) && x.status === "approved");
  if (!t) return null;
  const job = getJob(jobsOf(s), t.id, carId);
  return job.status === "cannot" ? { trip: t, reason: job.cannot?.reason ?? "-" } : null;
}

/** อะไหล่ตามแผนของรถคันนี้ (ย้ายไปด้วย): แผนที่จัดรถรายคัน = อะไหล่ที่ กบค. กำหนดให้รถ (S21) · แผนตัวอย่าง = อะไหล่ตามแผนของงานรายคัน (WORK) */
export function carPlanParts(s: MockState, planId: string, carId: string, tripId?: string): { name: string; qty: number; unit: string }[] {
  const p = s.plans.find((x) => x.mr === "MR " + planId);
  const i = CAND.findIndex((c) => candId(c.plate) === carId);
  if (p?.alloc && i >= 0 && p.alloc[i] != null) {
    const a = allocOf(p);
    return quarterRows({ ...a, alloc: { [i]: p.alloc[i] } }, p.alloc[i]).map((r) => ({ name: r.name, qty: r.qty, unit: r.unit }));
  }
  if (!tripId) return [];
  return getJob(jobsOf(s), tripId, carId).parts.map((x) => ({ name: x.part, qty: x.planQty, unit: x.unit }));
}

/** ย้ายรถ: เข้าไตรมาสใหม่ก่อน (อะไหล่ของรถไม่หาย) แล้วออกจากไตรมาสเดิม · toast "ย้ายรถ {ทะเบียน} ไปไตรมาส {k} สำเร็จ" */
export function moveCar(planId: string, car: TripCar, from: number, to: number, tripId: string) {
  addQuarterCars(planId, to, [car.id]);
  removeQuarterCar(planId, from, car.id);
  setMock((s) => ({ ...s, moves: [...movesOf(s), { planId, carId: car.id, plate: car.plate, from, to, tripId }] }));
  notify("ย้ายยานพาหนะ " + car.plate + " ไป" + qLabel(to) + " สำเร็จ");
}

/** บรรทัดรอง "รวม {n} {หน่วย} ของ {ทะเบียน} ที่ย้ายมา" ต่อรายการอะไหล่ (MOVE_Q2_SUBS) + อะไหล่ของรถที่ย้ายมา · ใช้ที่หัวข้ออะไหล่ในไตรมาส n ของหน้าไตรมาส (quarterPartRows) */
export function movedParts(s: MockState, planId: string, q: number) {
  return movedInto(s, planId, q).map((m) => ({ move: m, parts: carPlanParts(s, planId, m.carId, m.tripId) }));
}
export const partIndex = (name: string) => PARTS.findIndex((p) => p.name === name);
export const carsInQuarter = quarterCars;

/* อะไหล่ในไตรมาส n ของหน้าไตรมาส (tripList ของ screens.js 6 พ.ย. 2569 เจ้าของงาน "หน้าที่ รวมรถในไตรมาส จะเป็นรวมแยกตามรายการ ไม่ต้องมีจาก smart inventory" · แทนหน้าความคืบหน้าอะไหล่ S4 เดิม)
   แถวรวมตามรายการ ชนิด · รหัสอะไหล่ · ประเภท · จำนวน · หน่วย (QPART_COLS R81) ไม่มีค่าจาก Smart Inventory · ดูอย่างเดียว
   แผนที่จัดรถรายคัน (มี alloc) = quarterRows ชุดเดียวกับอะไหล่ในไตรมาสของฟอร์มแผน (S1) และอะไหล่ในแผน (S2) · คันที่ไม่เบิกอะไหล่ไม่รวม · รถที่ย้ายมา alloc ย้ายไตรมาสแล้ว ยอดรวมอยู่ในนั้น
   แผนตัวอย่าง (ไม่มี alloc) = PARTS ของ screens.js (ยอดไตรมาสที่กำลังทำ · ทุกไตรมาสแบบ tripList) · ไตรมาส 2 ใช้ยอดรถเดิม MOVE_Q2_BASE (SAMPLE_Q_NEED) แล้วบวกอะไหล่ตามแผนของรถที่ย้ายมา
   S25 รถที่ย้ายมา = บรรทัดรองใต้ชนิด "รวม {n} {หน่วย} ของ {ทะเบียน} ที่ย้ายมา" (o.parts.subs · MOVE_Q2_SUBS) */
export interface QPartRow { key: string; name: string; code: string; group: string; qty: number; unit: string; sub?: string }
export function quarterPartRows(s: MockState, planId: string, q: number): QPartRow[] {
  const p = s.plans.find((x) => x.mr === "MR " + planId);
  const alloc = p?.alloc && Object.keys(p.alloc).length ? allocOf(p) : null;
  const rows: QPartRow[] = alloc
    ? quarterRows(alloc, q).map((r) => ({ key: r.key, name: r.name, code: r.code, group: r.group, qty: r.qty, unit: r.unit }))
    : PARTS.map((x, i) => ({ key: "p" + i, name: x.name, code: x.code, group: x.group, qty: SAMPLE_Q_NEED[q]?.[i] ?? x.planQty, unit: x.unit }));
  movedParts(s, planId, q).forEach(({ move, parts }) => parts.forEach((m) => {
    let r = rows.find((x) => x.name === m.name);
    if (!r) { const pi = partIndex(m.name); r = { key: "mv" + move.carId + m.name, name: m.name, code: pi >= 0 ? PARTS[pi].code : "-", group: pi >= 0 ? PARTS[pi].group : "เพิ่มเอง", qty: 0, unit: m.unit }; rows.push(r); }
    if (!alloc) r.qty += m.qty;
    r.sub = (r.sub ? r.sub + " · " : "") + "รวม " + m.qty + " " + m.unit + " ของ " + move.plate + " ที่ย้ายมา";
  }));
  return rows.filter((r) => r.qty > 0);
}
