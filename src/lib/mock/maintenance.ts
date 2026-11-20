"use client";
import { useMemo } from "react";
import { carOf, closeRows, jobsOf, oilSampled, nf, TRIP_CARS, WSTAT, type Job, type JobTrip, type OilChoice, type TripCar } from "./jobs";
import { useMock, type MockState } from "./store";
import { CARETAKER, PLAN_ID, STAFF } from "./trips";
import { unitOf } from "./data";
import { lastMaOf, lastRepairOf } from "./vehicleHistory";
import { latestUpload } from "./safetyStore";
import type { PillColor } from "@/components/vms/PillOutline";

export const MA_TODAY = "10/11/2569";

export type DueTone = "warning" | "error";
export type DueStatus = "near" | "over";
export const MA_DUE: Record<DueStatus, [string, DueTone]> = { near: ["ใกล้ครบกำหนดบำรุงรักษา", "warning"], over: ["ครบกำหนดบำรุงรักษา", "error"] };
export const MA_ITEMS = ["รอบบำรุงรักษา", "ไส้กรองอากาศ", "เปลี่ยนน้ำมันไฮดรอลิก", "เก็บตัวอย่างน้ำมัน", "การตรวจ ปจ.2"] as const;
export const MA_CYCLE = ["ทุก 12 เดือน", "เปลี่ยนทุก 1 ปี", "เปลี่ยนทุก 3 ปี (ปีที่ 1 และปีที่ 4)", "เก็บตัวอย่างปีที่ 2 และ 3 หลังเปลี่ยน", "ทุก 1 ปี"];
export const MA_NO_DATA = "ยังไม่มีข้อมูลการบำรุงรักษา";
export const MA_NO_SAMPLE = "ปีนี้ครบรอบเปลี่ยนน้ำมัน ไม่ต้องเก็บตัวอย่าง";
export const MA_VSTAT: Record<"ok" | "repair" | "off", [string, PillColor]> = { ok: ["ปกติ", "Success"], repair: ["อยู่ระหว่างซ่อม", "Warning"], off: ["งดใช้งาน", "Gray"] };
export const MA_WAR: Record<"in" | "near" | "out" | "none", [string, PillColor]> = { in: ["อยู่ในประกัน", "Success"], near: ["ใกล้หมดประกัน", "Warning"], out: ["หมดประกัน", "Gray"], none: ["ไม่มีประกัน", "Gray"] };

const pad = (n: number) => String(n).padStart(2, "0");
export const dayOf = (s: string) => { const [d, m, y] = s.slice(0, 10).split("/").map(Number); return Date.UTC(y - 543, m - 1, d); };
export const thaiDate = (t: number) => { const d = new Date(t); return pad(d.getUTCDate()) + "/" + pad(d.getUTCMonth() + 1) + "/" + (d.getUTCFullYear() + 543); };
export const addMonths = (t: number, n: number) => { const d = new Date(t); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, d.getUTCDate()); };
const isDate = (s?: string): s is string => !!s && /^\d{2}\/\d{2}\/\d{4}/.test(s);
const later = (a?: string, b?: string) => (!isDate(a) ? (isDate(b) ? b : undefined) : !isDate(b) ? a : dayOf(a) >= dayOf(b) ? a : b);
export const TODAY = dayOf(MA_TODAY);
export const statusOf = (due: number, today = TODAY): DueStatus | undefined => (due < today ? "over" : due <= addMonths(today, 6) ? "near" : undefined);

type Use = [year: number, km: string, hours: string, war: keyof typeof MA_WAR, st: keyof typeof MA_VSTAT];
const MA_USE: Record<string, Use> = {
  "80-4458": [2557, "171,220", "5,610", "none", "ok"], "80-5738": [2558, "168,900", "5,480", "out", "repair"], "80-3316": [2560, "154,300", "4,920", "none", "ok"],
  "80-9981": [2561, "176,050", "5,840", "in", "ok"], "82-7720": [2562, "149,700", "4,410", "none", "ok"], "82-1145": [2559, "176,050", "6,010", "near", "ok"],
  "81-6604": [2563, "163,480", "5,120", "none", "ok"], "82-6789": [2564, "182,640", "6,131", "in", "ok"], "81-2210": [2566, "41,200", "980", "none", "off"],
};
const MA_CAR_IDS = Object.keys(MA_USE);
export const MA_CAR = "82-1145";

export interface MaRecord {
  key: string; carId: string; date: string; planMr: string; tripId?: string; tripName?: string;
  work: string; parts: string[];
  air?: boolean; oil?: OilChoice; oilResult?: string; safety?: boolean;
  km?: string; hours?: string; by: string;
  cannot?: string;
  fromJob?: boolean;
}

type Row = [carId: string, date: string, mr: string, air: string, oil: string, sample: string, result: string, safety: string];
const MA_ROWS: Row[] = [
  ["80-4458", "01/10/2568", "MRZ6900011", "01/10/2568", "01/10/2566", "01/10/2568", "ผ่าน", "01/10/2568"],
  ["80-5738", "14/10/2568", "MRZ6900011", "14/10/2567", "14/10/2565", "14/10/2568", "ไม่ผ่าน", "14/10/2568"],
  ["80-3316", "20/11/2568", "MRZ6900011", "20/11/2568", "05/02/2567", "20/11/2568", "ผ่าน", "20/11/2568"],
  ["80-9981", "10/01/2569", "MRZ6900014", "10/01/2569", "10/01/2569", "10/01/2569", "ผ่าน", "10/01/2569"],
  ["82-7720", "02/02/2569", "MRZ6900014", "02/02/2569", "18/06/2567", "02/02/2569", "ผ่าน", "02/02/2569"],
  ["82-1145", "18/06/2569", "MRZ6900014", "18/06/2569", "12/03/2567", "18/06/2569", "ผ่าน", "18/06/2569"],
  ["81-6604", "20/09/2569", "MRZ7000001", "20/09/2569", "20/09/2569", "20/09/2569", "ผ่าน", "20/09/2569"],
];
const BASE: Record<string, { air: string; oil: string; sample: string; result: string; safety: string }> =
  Object.fromEntries(MA_ROWS.map(([id, , , air, oil, sample, result, safety]) => [id, { air, oil, sample, result, safety }]));
export const baseSafetyOf = (carId: string): string | undefined => BASE[carId]?.safety;
const workOf = (air: boolean, change: boolean) => [change ? "เปลี่ยนน้ำมันไฮดรอลิก" : "เปลี่ยนไส้กรองไฮดรอลิก", ...(air ? ["ไส้กรองอากาศ"] : [])].join(" · ");
const seedRow = ([carId, date, mr, air, oil, sample, result, safety]: Row): MaRecord => {
  const ch = oil === date, sm = sample === date;
  return { key: "seed:" + carId + ":" + date, carId, date, planMr: mr, work: workOf(air === date, ch), parts: [], air: air === date,
    oil: ch && sm ? 2 : ch ? 1 : sm ? 0 : undefined, oilResult: sm ? result : undefined, safety: safety === date, by: STAFF[0] };
};
const MA_HIST: MaRecord[] = [
  { key: "seed:82-1145:18/06/2569", carId: "82-1145", date: "18/06/2569", planMr: "MRZ6900014", work: "เปลี่ยนไส้กรองไฮดรอลิก · ไส้กรองอากาศ", parts: [], air: true, oil: 0, oilResult: "ผ่าน", safety: true, by: STAFF[0] },
  { key: "seed:82-1145:20/06/2568", carId: "82-1145", date: "20/06/2568", planMr: "MRZ6800007", work: "เปลี่ยนไส้กรองไฮดรอลิก · ไส้กรองอากาศ", parts: [], air: true, oil: 0, oilResult: "ผ่าน", safety: true, by: STAFF[2] },
  { key: "seed:82-1145:12/03/2567", carId: "82-1145", date: "12/03/2567", planMr: "MRZ6700004", work: "เปลี่ยนน้ำมันไฮดรอลิก · ไส้กรอง", parts: [], air: true, oil: 1, safety: true, by: STAFF[1] },
];
export const SEED: MaRecord[] = [...MA_ROWS.filter((r) => r[0] !== MA_CAR).map(seedRow), ...MA_HIST];

const OIL_RESULT_TEXT = ["ผ่าน", "ไม่ผ่าน"];
function jobRecord(j: Job, t: JobTrip): MaRecord | null {
  const base = { key: "job:" + t.id + ":" + j.carId, carId: j.carId, planMr: t.planMr, tripId: t.id, tripName: t.name, fromJob: true };
  if (j.status === "cannot" && j.cannot) return { ...base, date: j.cannot.at.slice(0, 10), work: WSTAT.cannot[0], parts: [], by: j.cannot.by, cannot: j.cannot.reason };
  if (j.status !== "done" || !j.close || !j.closedAt) return null;
  const rows = closeRows(j.close).filter((r) => r.used > 0);
  const task = (part: string) => j.parts.find((p) => p.part === part)?.task ?? part;
  const r = j.oilResult;
  const files = j.safety?.files ?? j.close.safetyFiles ?? [];
  return {
    ...base, date: j.closedAt.slice(0, 10), work: rows.map((x) => task(x.part)).join(" · ") || "-", parts: rows.map((x) => x.part + " " + nf(x.used) + " " + x.unit),
    air: rows.some((x) => /ไส้กรองอากาศ/.test(x.part)), oil: j.close.oilChoice, safety: files.length > 0,
    oilResult: oilSampled(j.close.oilChoice) ? (!r || r.sel < 0 ? "รอผลตรวจ" : OIL_RESULT_TEXT[r.sel]) : undefined,
    km: j.kmAfter, hours: j.hoursAfter, by: j.recordedBy ?? "-",
  };
}

export interface DueItem { k: 0 | 1 | 2 | 3 | 4; last: string; due?: number; status?: DueStatus }
export interface MaCar {
  car: TripCar;
  records: MaRecord[];
  latest?: MaRecord;
  air?: string; oilAt?: string; sampleAt?: string; result?: string; safetyAt?: string;
  items: DueItem[]; next?: DueItem; oilItem?: DueItem;
  year?: number; km?: string; hours?: string; war: keyof typeof MA_WAR; vstat: keyof typeof MA_VSTAT;
}

export function maCar(car: TripCar, all: MaRecord[], today = TODAY, safetyUp?: { date: string; cycle?: number }): MaCar {
  const records = all.filter((r) => r.carId === car.id).sort((a, b) => dayOf(b.date) - dayOf(a.date) || (a.fromJob === b.fromJob ? 0 : a.fromJob ? -1 : 1));
  const done = records.filter((r) => !r.cannot);
  const latest = done[0], u = MA_USE[car.id], b = BASE[car.id];
  const first = <T,>(f: (r: MaRecord) => T | undefined) => { for (const r of done) { const v = f(r); if (v) return [r, v] as const; } return undefined; };
  const air = later(first((r) => (r.air ? r.date : undefined))?.[1], b?.air);
  const oilAt = later(first((r) => (r.oil === 1 || r.oil === 2 ? r.date : undefined))?.[1], b?.oil ?? (latest ? car.lastOil : undefined));
  const sm = first((r) => (r.oil === 0 || r.oil === 2 ? r.date : undefined));
  const sampleAt = later(sm?.[1], b?.sample);
  const result = sm && sampleAt === sm[1] ? sm[0].oilResult : b?.result;
  const safetyAt = later(later(first((r) => (r.safety ? r.date : undefined))?.[1], b?.safety), safetyUp?.date);
  const safetyCycle = safetyUp && safetyAt === safetyUp.date ? safetyUp.cycle ?? 12 : 12;
  const base = { car, records, latest, air, oilAt, sampleAt, result, safetyAt, year: u?.[0], km: latest?.km?.replace(/ กม\.$/, "") ?? u?.[1], hours: latest?.hours?.replace(/ ชม\.$/, "") ?? u?.[2],
    war: u?.[3] ?? "none", vstat: u?.[4] ?? "ok" } as const;
  if (!latest) return { ...base, items: [] };
  const item = (k: DueItem["k"], last: string | undefined, due?: number): DueItem => ({ k, last: last ?? "-", due, status: due == null ? undefined : statusOf(due, today) });
  const chg = isDate(oilAt) ? addMonths(dayOf(oilAt), 36) : undefined;
  const smpFrom = later(sampleAt, oilAt);
  const smp = smpFrom ? addMonths(dayOf(smpFrom), 12) : undefined;
  const changeYear = chg != null && smp != null && chg <= smp;
  const sampleLast = isDate(sampleAt) && (!isDate(oilAt) || dayOf(sampleAt) > dayOf(oilAt)) ? sampleAt + (result ? " · ผล " + result : "") : oilAt;
  const items = [
    item(0, latest.date, addMonths(dayOf(latest.date), 12)),
    item(1, air, isDate(air) ? addMonths(dayOf(air), 12) : undefined),
    item(2, oilAt, chg),
    item(3, sampleLast, changeYear ? undefined : smp),
    item(4, safetyAt, isDate(safetyAt) ? addMonths(dayOf(safetyAt), safetyCycle) : undefined),
  ];
  const withDue = items.filter((i) => i.due != null);
  const next = withDue.sort((a, b2) => a.due! - b2.due! || a.k - b2.k)[0];
  const oilItem = !changeYear && smp != null ? items[3] : items[2];
  return { ...base, items, next, oilItem };
}

export function maCars(m: MockState, owner = false, unit?: string): MaCar[] {
  const s = jobsOf(m);
  const fromJobs = Object.values(s.jobs).map((j) => (s.trips[j.tripId] ? jobRecord(j, s.trips[j.tripId]) : null)).filter((r): r is MaRecord => !!r);
  const all = [...SEED, ...fromJobs];
  const ids = [...new Set([...MA_CAR_IDS, ...fromJobs.map((r) => r.carId)])];
  const cars = ids.map((id) => TRIP_CARS.find((c) => c.id === id) ?? carOf(id)).filter((c): c is TripCar => !!c);
  return cars.filter((c) => !owner || c.ctrl === CARETAKER).map((c) => maCar(c, all, TODAY, latestUpload(m, c.id)))
    .filter((x) => !unit || x.records.some((r) => unitOf(r.planMr) === unit) || (TRIP_CARS.some((t) => t.id === x.car.id) && unitOf("MR" + PLAN_ID) === unit))
    .sort((a, b) => (a.next ? a.next.due! : Infinity) - (b.next ? b.next.due! : Infinity) || a.car.plate.localeCompare(b.car.plate));
}
export function useMaCars(owner: boolean, unit?: string) { const m = useMock(); return useMemo(() => maCars(m, owner, unit), [m, owner, unit]); }

export const nextText = (c: MaCar) => (c.next ? thaiDate(c.next.due!) + " · " + MA_ITEMS[c.next.k] : MA_NO_DATA);
export const ageText = (c: MaCar) => (c.year ? Number(MA_TODAY.slice(6)) - c.year + " ปี" : "-");
export const isDue = (c: MaCar) => !!c.next?.status;
export function maMetrics(cars: MaCar[]): [string, string, "Error" | "Warning" | "Brand"][] {
  const n = (f: (c: MaCar) => boolean) => String(cars.filter(f).length);
  return [["ครบกำหนดบำรุงรักษา", n((c) => c.next?.status === "over"), "Error"], ["ใกล้ครบกำหนดบำรุงรักษา", n((c) => c.next?.status === "near"), "Warning"],
    ["ต้องเก็บตัวอย่างน้ำมันใน 6 เดือน", n((c) => c.oilItem?.k === 3 && !!c.oilItem.status), "Brand"], ["ต้องเปลี่ยนน้ำมันไฮดรอลิกใน 6 เดือน", n((c) => c.oilItem?.k === 2 && !!c.oilItem.status), "Brand"]];
}

export const MA_LAST_OPTS = ["ภายใน 6 เดือน", "6 ถึง 12 เดือนที่แล้ว", "เกิน 12 เดือน", "ยังไม่เคยบำรุงรักษา"];
export const MA_WITHIN_OPTS = ["เลยกำหนดแล้ว", "ภายใน 1 เดือน", "ภายใน 3 เดือน", "ภายใน 6 เดือน"];
export const MA_OIL_OPTS = ["ผ่าน", "ไม่ผ่าน", "รอผลตรวจ"];
export function lastMatch(c: MaCar, v: string) {
  if (v === MA_LAST_OPTS[3]) return !c.latest;
  if (!c.latest) return false;
  const d = dayOf(c.latest.date);
  return v === MA_LAST_OPTS[0] ? d >= addMonths(TODAY, -6) : v === MA_LAST_OPTS[1] ? d < addMonths(TODAY, -6) && d >= addMonths(TODAY, -12) : d < addMonths(TODAY, -12);
}
function dueWithin(it: DueItem | undefined, v: string) {
  if (!it || it.due == null) return false;
  if (v === MA_WITHIN_OPTS[0]) return it.status === "over";
  const m = v === MA_WITHIN_OPTS[1] ? 1 : v === MA_WITHIN_OPTS[2] ? 3 : 6;
  return it.due <= addMonths(TODAY, m);
}
export const withinMatch = (c: MaCar, v: string) => dueWithin(c.next, v);
export const oilChangeOf = (c: MaCar): DueItem | undefined => c.items[2];
export const oilDueMatch = (c: MaCar, v: string) => dueWithin(oilChangeOf(c), v);
export const itemMatch = (c: MaCar, items: string[]) => c.items.some((i) => !!i.status && items.includes(MA_ITEMS[i.k]));

export type Repair = [string, string, string, string, string, string, string, keyof typeof MA_WAR, string];
export const MA_REPAIRS: Repair[] = [
  ["RP-2569-0611", "02/09/2569", "อู่ ศรีเมืองการช่าง", "รถเสีย", "", "บูมยกช้า", "เปลี่ยนปั๊มไฮดรอลิก", "in", "28,400"],
  ["MA-2569-0102", "18/06/2569", "กบผ.", "บำรุงรักษา", "ตามวาระ MRZ6900014", "ตรวจตามรอบ", "เปลี่ยนไส้กรองไฮดรอลิก · ไส้กรองอากาศ", "none", "-"],
  ["PO-680412", "15/12/2568", "บริษัท สยามไฮดรอลิก จำกัด", "Overhaul", "แผน ORZ6800003", "ยกเครื่องตามแผน", "ไฮดรอลิกกระเช้า · เครื่องยนต์", "in", "-"],
  ["RP-2568-0877", "03/08/2568", "กรย. ภาค 1", "อุบัติเหตุ", "", "กันชนหน้าบุบ", "เปลี่ยนกันชนหน้า", "out", "6,500"],
];
export type HistKind = "ma" | "repair" | "overhaul";
export const MA_KIND: Record<HistKind, [string, PillColor]> = { ma: ["บำรุงรักษา", "Brand"], repair: ["ซ่อม", "Warning"], overhaul: ["Overhaul", "Purple"] };
export interface HistRow { kind: HistKind; no: string; sub?: string; date: string; center: string; text: string; detail: string; war?: keyof typeof MA_WAR; cost: string; rec?: MaRecord }
const CHASSIS_JOBS = new Set(["RP-2568-0877"]);
export interface MachineHistory { ma: MaRecord[]; rows: HistRow[]; lastMa?: string; lastRepair?: string }
export function machineHistoryOf(c: MaCar): MachineHistory {
  const vhMa = lastMaOf(c.car.plate), vhRepair = lastRepairOf(c.car.plate);
  const ma = [...c.records];
  if (isDate(vhMa) && !ma.some((r) => !r.cannot && r.date === vhMa))
    ma.push({ key: "vh:" + c.car.id + ":" + vhMa, carId: c.car.id, date: vhMa, planMr: "-", work: "-", parts: [], by: "-" });
  ma.sort((a, b) => dayOf(b.date) - dayOf(a.date));
  const repairs: HistRow[] = (c.car.id === MA_CAR ? MA_REPAIRS : []).filter((h) => h[3] !== "บำรุงรักษา" && !CHASSIS_JOBS.has(h[0])).map((h) => ({
    kind: h[3] === "Overhaul" ? "overhaul" : "repair", no: h[0], sub: h[4] || h[3], date: h[1], center: h[2], text: h[5], detail: h[6], war: h[7], cost: h[8],
  }));
  if (isDate(vhRepair) && !repairs.some((h) => h.kind === "repair" && h.date === vhRepair))
    repairs.push({ kind: "repair", no: "-", date: vhRepair, center: "-", text: "-", detail: "", cost: "-" });
  const rows: HistRow[] = [...repairs, ...ma.map((r): HistRow => ({
    kind: "ma", no: r.planMr, sub: r.tripName, date: r.date, center: r.planMr === "-" ? "-" : unitOf(r.planMr), text: r.cannot ? r.work : r.planMr === "-" ? "-" : "ตรวจตามรอบ",
    detail: r.cannot ?? (r.work === "-" ? "" : r.work), war: r.planMr === "-" ? undefined : "none", cost: "-", rec: r,
  }))].sort((a, b) => dayOf(b.date) - dayOf(a.date));
  const lastMa = ma.find((r) => !r.cannot)?.date;
  const lastRepair = repairs.filter((h) => h.kind === "repair").sort((a, b) => dayOf(b.date) - dayOf(a.date))[0]?.date;
  return { ma, rows, lastMa, lastRepair };
}

export const MA_WARRANTY: [string, string, string, string, string, string, string, keyof typeof MA_WAR][] = [
  ["ซ่อม", "RP-2569-0611", "อู่ ศรีเมืองการช่าง", "ปั๊มไฮดรอลิก", "02/09/2569", "01/03/2570", "เหลือ 111 วัน", "in"],
  ["Overhaul", "PO-680412", "บริษัท สยามไฮดรอลิก จำกัด", "ไฮดรอลิกกระเช้า · เครื่องยนต์", "15/12/2568", "10/12/2569", "เหลือ 30 วัน", "near"],
  ["ซ่อม", "RP-2568-0877", "กรย. ภาค 1", "กันชนหน้า", "03/08/2568", "01/11/2568", "", "out"],
];
export const warrantyOf = (c: MaCar) => (c.car.id === MA_CAR ? MA_WARRANTY : []);
