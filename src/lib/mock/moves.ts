/* S25 · กบค. ย้ายรถที่บำรุงรักษาไม่ได้ไปไตรมาสอื่น (เจ้าของงาน 5 พ.ย. 2569 · บล็อก X · BACKLOG ข้อ 12) — moveModal / moveQuarter / partsProgress o.subs ของ screens.js
   ที่เก็บ: MockState.moves (คีย์เดียวกับ store · mt-next-v1) — ที่เก็บเก่าไม่มีฟิลด์นี้ = ยังไม่มีการย้าย
   ย้าย = รถออกจากไตรมาสเดิม (qcars removed) + เข้าไตรมาสใหม่ขึ้นก่อน (qcars added) · แผนที่จัดรถรายคัน (alloc) เปลี่ยนไตรมาสของรถ อะไหล่ตามแผนของรถย้ายตาม
   แผนเดินทางเดิมยังมีรถคันนี้ (สถานะบำรุงรักษาไม่ได้) · ไม่ต้องอนุมัติใหม่ */
import { CAND, CAR_PICK, CAR_QTY, OIL_SPEC, PARTS, QUARTERS } from "./data";
import { WORK, getJob, jobsOf } from "./jobs";
import { allocOf, quarterRows } from "./planFlow";
import { notify, setMock, type MockState } from "./store";
import { TRIP_CARS as SAMPLE_TRIP_CARS, addQuarterCars, candId, quarterCars, quarterTrips, removeQuarterCar, type TripCar } from "./trips";

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

/* ---------- อะไหล่รายคัน (ค่าตั้งต้นของอะไหล่ในไตรมาส n และอะไหล่ของแผนเดินทาง · R84) ----------
   แผนที่จัดรถรายคัน (มี alloc) = อะไหล่ที่หน่วยงานกำหนดให้คันนั้น (S21 · quarterRows ของคันเดียว · ไม่เบิก = ว่าง)
   แผนตัวอย่าง (ไม่มี alloc · ค่าสมมติของ screens.js):
     ยานพาหนะของไตรมาสที่กำลังทำ (TRIP_CARS) = tripParts: เปลี่ยนน้ำมัน 30 ลิตร 82-6789 81-2210 (TRIP_OIL_CARS) · ไส้กรอง 3 รายการ คันละ 2 ชิ้น 6 คันแรก (TRIP_FILTER_CARS) · ไส้กรองเชื้อเพลิง 2 ชิ้น 82-6789 80-9981 (TRIP_FUEL_CARS)
       ⇒ รวม 10 คัน = PARTS (อะไหล่ในไตรมาส 1) และยอดทุกใบรวมกัน = อะไหล่ในไตรมาส 1 (9 พ.ย. 2569)
     คันเดียวกันในไตรมาสอื่น (ย้ายไป S25) = อะไหล่ตามแผนของคันนั้น (WORK · MOVE_CAR_QTY)
     รถเดิมของไตรมาส 2 = ค่าสมมติที่รวมได้ MOVE_Q2_BASE (30 · 6 · 6 · 6 · 2) · คันอื่น = ไส้กรอง CAR_PICK คันละ CAR_QTY (MOVE_Q3_OTHER ⇒ MOVE_Q3_QTY) */
const TRIP_OIL_CARS = ["82-6789", "81-2210"], TRIP_FUEL_CARS = ["82-6789", "80-9981"];
const TRIP_FILTER_CARS = SAMPLE_TRIP_CARS.slice(0, 6).map((c) => c.id);
const SAMPLE_Q2_CAR: Record<string, number[]> = { "81-7702": [30, 2, 2, 2, 2], "82-5530": [0, 2, 2, 2, 0], "80-1189": [0, 2, 2, 2, 0] };
const PICK_QTY = PARTS.map((_, x) => (CAR_PICK.includes(x) ? CAR_QTY[x] : 0));
const WORK_QTY = PARTS.map((p) => WORK.find((w) => w.part === p.name)?.planQty ?? 0);
const qtyRows = (qty: number[]): QPartRow[] => PARTS.map((x, i) => ({ key: "p" + i, name: x.name, code: x.code, group: x.group, qty: qty[i] ?? 0, unit: x.unit }));
export function carParts(s: MockState, planId: string, q: number, carId: string): QPartRow[] {
  const p = s.plans.find((x) => x.mr === "MR " + planId);
  if (p?.alloc && Object.keys(p.alloc).length) {
    const i = CAND.findIndex((c) => candId(c.plate) === carId);
    if (i < 0 || p.alloc[i] == null) return [];
    return quarterRows({ ...allocOf(p), alloc: { [i]: p.alloc[i] } }, p.alloc[i]).map((r) => ({ key: r.key, name: r.name, code: r.code, group: r.group, qty: r.qty, unit: r.unit }));
  }
  const nowQ = Number((p?.nowQ ?? "ไตรมาส 1").replace(/\D/g, "")) || 1;
  const own = SAMPLE_TRIP_CARS.some((c) => c.id === carId);
  if (own && q === nowQ) return qtyRows(PARTS.map((_, x) => (x === 0 ? (TRIP_OIL_CARS.includes(carId) ? Number(OIL_SPEC.litre) : 0)
    : x === 4 ? (TRIP_FUEL_CARS.includes(carId) ? CAR_QTY[4] : 0) : TRIP_FILTER_CARS.includes(carId) ? CAR_QTY[x] : 0)));
  return qtyRows(own ? WORK_QTY : SAMPLE_Q2_CAR[carId] ?? PICK_QTY);
}
/** รวมแถวอะไหล่หลายคันตามรายการ · อะไหล่จากคลังเรียงตาม PARTS แล้วรายการที่ระบุเอง · จำนวน 0 ไม่แสดง */
export function sumParts(lists: QPartRow[][]): QPartRow[] {
  const m = new Map<string, QPartRow>();
  lists.flat().forEach((r) => { const x = m.get(r.key); if (x) x.qty += r.qty; else m.set(r.key, { ...r }); });
  const order = (r: QPartRow) => { const i = PARTS.findIndex((x) => x.name === r.name); return i < 0 ? PARTS.length : i; };
  return [...m.values()].filter((r) => r.qty > 0).sort((a, b) => order(a) - order(b));
}
/** อะไหล่ของแผนเดินทาง (R84 · tripParts) = รวมจากยานพาหนะในใบ · S8 หน่วยงานเจ้าของรถ = เฉพาะคันของหน่วยงาน (only) */
export const tripPartRows = (s: MockState, t: { planId: string; quarter: number; carIds: string[] }, only?: (id: string) => boolean) =>
  sumParts(t.carIds.filter((id) => !only || only(id)).map((id) => carParts(s, t.planId, t.quarter, id)));

/* อะไหล่ในไตรมาส n ของหน้าไตรมาส (tripList ของ screens.js 6 พ.ย. 2569 เจ้าของงาน "หน้าที่ รวมรถในไตรมาส จะเป็นรวมแยกตามรายการ ไม่ต้องมีจาก smart inventory" · แทนหน้าความคืบหน้าอะไหล่ S4 เดิม)
   แถวรวมตามรายการ ชนิด · รหัสอะไหล่ · ประเภท · จำนวน · หน่วย (QPART_COLS R81) ไม่มีค่าจาก Smart Inventory · ดูอย่างเดียว · จำนวน 0 ไม่แสดง
   แผนที่จัดรถรายคัน = quarterRows ชุดเดียวกับฟอร์มแผน (S1) และอะไหล่ในแผน (S2) · คันที่ไม่เบิกอะไหล่ไม่รวม
   แผนตัวอย่าง = รวม carParts ของยานพาหนะในไตรมาส (ไตรมาส 1 = PARTS · ไตรมาส 2 หลังย้าย = MOVE_Q2_QTY · ไตรมาส 3 4 = ยอดของยานพาหนะคันนั้น MOVE_Q3_QTY / MOVE_CAR_QTY · 9 พ.ย. 2569)
   S25 รถที่ย้ายมา = บรรทัดรองใต้ชนิด "รวม {n} {หน่วย} ของ {ทะเบียน} ที่ย้ายมา" (MOVE_Q2_SUBS) */
export interface QPartRow { key: string; name: string; code: string; group: string; qty: number; unit: string; sub?: string }
export function quarterPartRows(s: MockState, planId: string, q: number): QPartRow[] {
  const p = s.plans.find((x) => x.mr === "MR " + planId);
  const alloc = p?.alloc && Object.keys(p.alloc).length ? allocOf(p) : null;
  const rows = alloc ? sumParts([quarterRows(alloc, q).map((r) => ({ key: r.key, name: r.name, code: r.code, group: r.group, qty: r.qty, unit: r.unit }))])
    : sumParts(quarterCars(s, planId, q).map((c) => carParts(s, planId, q, c.id)));
  movedInto(s, planId, q).forEach((m) => carParts(s, planId, q, m.carId).filter((x) => x.qty > 0).forEach((x) => {
    const r = rows.find((y) => y.key === x.key); if (!r) return;
    r.sub = (r.sub ? r.sub + " · " : "") + "รวม " + x.qty + " " + x.unit + " ของ " + m.plate + " ที่ย้ายมา";
  }));
  return rows;
}
