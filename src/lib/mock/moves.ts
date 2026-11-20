import { CAND, CAR_PICK, CAR_QTY, OIL_SPEC, PARTS, QUARTERS } from "./data";
import { WORK, getJob, jobsOf, removeTripCar, type JobTrip } from "./jobs";
import { allocOf, quarterRows } from "./planFlow";
import { notify, setMock, type MockState } from "./store";
import { TRIP_CARS as SAMPLE_TRIP_CARS, addQuarterCars, candId, quarterCars, quarterTrips, removeQuarterCar, type TripCar } from "./trips";

export interface Move { planId: string; carId: string; plate: string; from: number; to: number; tripId: string }
declare module "./store" {
  interface MockState { moves?: Move[] }
}
export const movesOf = (s: Pick<MockState, "moves">): Move[] => s.moves ?? [];
export const movedInto = (s: Pick<MockState, "moves">, planId: string, q: number) => {
  const last = new Map<string, Move>();
  movesOf(s).filter((m) => m.planId === planId).forEach((m) => last.set(m.carId, m));
  return [...last.values()].filter((m) => m.to === q);
};
export const qLabel = (k: number) => QUARTERS[k - 1].split(" (")[0];

export function cannotTrip(s: MockState, planId: string, q: number, carId: string) {
  const t = quarterTrips(s, planId, q).find((x) => x.carIds.includes(carId) && x.status === "approved");
  if (!t) return null;
  const job = getJob(jobsOf(s), t.id, carId);
  return job.status === "cannot" ? { trip: t, reason: job.cannot?.reason ?? "-" } : null;
}

export function quarterFinished(s: MockState, planId: string, q: number) {
  const cars = quarterCars(s, planId, q);
  const trips = quarterTrips(s, planId, q).filter((t) => t.status === "approved");
  return cars.length > 0 && cars.every((c) => {
    const t = trips.find((x) => x.carIds.includes(c.id));
    const st = t ? getJob(jobsOf(s), t.id, c.id).status : null;
    return st === "done" || st === "cannot";
  });
}

export interface CarPlanPart { name: string; code: string; group: string; qty: number; unit: string }
export function carPlanParts(s: MockState, planId: string, carId: string, tripId?: string): CarPlanPart[] {
  const p = s.plans.find((x) => x.mr === "MR" + planId);
  const i = CAND.findIndex((c) => candId(c.plate) === carId);
  if (p?.alloc && i >= 0 && p.alloc[i] != null) {
    const a = allocOf(p);
    return quarterRows({ ...a, alloc: { [i]: p.alloc[i] } }, p.alloc[i]).map((r) => ({ name: r.name, code: r.code, group: r.group, qty: r.qty, unit: r.unit }));
  }
  if (!tripId) return [];
  return getJob(jobsOf(s), tripId, carId).parts.map((x) => {
    const k = PARTS.find((y) => y.name === x.part);
    return { name: k?.name ?? x.part, code: k?.code ?? "-", group: k?.group ?? "-", qty: x.planQty, unit: x.unit };
  });
}

export function moveCar(planId: string, car: TripCar, from: number, to: number, tripId: string) {
  addQuarterCars(planId, to, [car.id]);
  removeQuarterCar(planId, from, car.id);
  setMock((s) => ({ ...s, moves: [...movesOf(s), { planId, carId: car.id, plate: car.plate, from, to, tripId }] }));
  notify("ย้ายยานพาหนะ " + car.plate + " ไป" + qLabel(to) + " สำเร็จ");
}

export const MAINT_ITEM = { Text: "ดำเนินการบำรุงรักษา", IconSwap: "car_repair-24-300-round" } as const;
export const MAINT_CONFIRM = (plate: string, q: number) => ({ title: "ยืนยันดำเนินการบำรุงรักษา · " + plate,
  sub: plate + " จะกลับเป็นยานพาหนะที่ยังไม่มีแผนเดินทางใน" + qLabel(q) + " เพื่อเพิ่มเข้าแผนเดินทางแล้วบำรุงรักษาตามปกติ", cancel: "ยกเลิก", ok: "ยืนยัน" });
export function maintainCar(car: TripCar, q: number, tripId: string) {
  removeTripCar({ id: tripId } as JobTrip, car.id);
  notify("นำ " + car.plate + " กลับมาบำรุงรักษาใน" + qLabel(q) + " แล้ว");
}

export function movedParts(s: MockState, planId: string, q: number) {
  return movedInto(s, planId, q).map((m) => ({ move: m, parts: carPlanParts(s, planId, m.carId, m.tripId) }));
}
export const partIndex = (name: string) => PARTS.findIndex((p) => p.name === name);
export const carsInQuarter = quarterCars;

const TRIP_OIL_CARS = ["82-6789", "81-2210"], TRIP_FUEL_CARS = ["82-6789", "80-9981"];
const TRIP_FILTER_CARS = SAMPLE_TRIP_CARS.slice(0, 6).map((c) => c.id);
const SAMPLE_Q2_CAR: Record<string, number[]> = { "81-7702": [30, 2, 2, 2, 2], "82-5530": [0, 2, 2, 2, 0], "80-1189": [0, 2, 2, 2, 0] };
const PICK_QTY = PARTS.map((_, x) => (CAR_PICK.includes(x) ? CAR_QTY[x] : 0));
const WORK_QTY = PARTS.map((p) => WORK.find((w) => w.part === p.name)?.planQty ?? 0);
const qtyRows = (qty: number[]): QPartRow[] => PARTS.map((x, i) => ({ key: "p" + i, name: x.name, code: x.code, group: x.group, qty: qty[i] ?? 0, unit: x.unit }));
export function carParts(s: MockState, planId: string, q: number, carId: string): QPartRow[] {
  const p = s.plans.find((x) => x.mr === "MR" + planId);
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
export function sumParts(lists: QPartRow[][]): QPartRow[] {
  const m = new Map<string, QPartRow>();
  lists.flat().forEach((r) => { const x = m.get(r.key); if (x) x.qty += r.qty; else m.set(r.key, { ...r }); });
  const order = (r: QPartRow) => { const i = PARTS.findIndex((x) => x.name === r.name); return i < 0 ? PARTS.length : i; };
  return [...m.values()].filter((r) => r.qty > 0).sort((a, b) => order(a) - order(b));
}
export const tripPartRows = (s: MockState, t: { planId: string; quarter: number; carIds: string[] }, only?: (id: string) => boolean) =>
  sumParts(t.carIds.filter((id) => !only || only(id)).map((id) => carParts(s, t.planId, t.quarter, id)));

export interface QPartRow { key: string; name: string; code: string; group: string; qty: number; unit: string; sub?: string }
export function quarterPartRows(s: MockState, planId: string, q: number): QPartRow[] {
  const p = s.plans.find((x) => x.mr === "MR" + planId);
  const alloc = p?.alloc && Object.keys(p.alloc).length ? allocOf(p) : null;
  const rows = alloc ? sumParts([quarterRows(alloc, q).map((r) => ({ key: r.key, name: r.name, code: r.code, group: r.group, qty: r.qty, unit: r.unit }))])
    : sumParts(quarterCars(s, planId, q).map((c) => carParts(s, planId, q, c.id)));
  movedInto(s, planId, q).forEach((m) => carParts(s, planId, q, m.carId).filter((x) => x.qty > 0).forEach((x) => {
    const r = rows.find((y) => y.key === x.key); if (!r) return;
    r.sub = (r.sub ? r.sub + " · " : "") + "รวม " + x.qty + " " + x.unit + " ของ " + m.plate + " ที่ย้ายมา";
  }));
  return rows;
}
