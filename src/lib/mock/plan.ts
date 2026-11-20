import { CAND, CAR_QTY, DISTRICTS, PARTS, PST, REGIONS, UNIT_FLEET, VEHICLE_TYPES, dCode, regionOf, shortRegion, unitOf, type ManualPart, type OilSpec, type Plan } from "./data";
import type { TableColumn, TableValue } from "@/components/vms/Table";

export const QPART_COLS: TableColumn[] = [
  { head: "ชนิด", Style: "Lead text" }, { head: "รหัสอะไหล่", width: 150 }, { head: "ประเภท", width: 160 }, { head: "จำนวน", width: 120 }, { head: "หน่วย", width: 110 },
];
export const qpartRow = (r: { name: string; code: string; group: string; qty: number; unit: string }): TableValue[] => [r.name, r.code, r.group, String(r.qty), r.unit];

export interface Draft {
  name: string;
  year: string;
  regions: string[];
  districts: string[];
  types: string[];
  alloc: Record<number, number>;
  picks: Record<number, number[]>;
  q: number;
  qty?: Record<number, Record<number, number>>;
  manual?: Record<number, ManualPart[]>;
  oils?: Record<number, number>;
  oilSpec?: Record<number, OilSpec>;
  draw?: Record<number, "none">;
  editOf?: string;
}
export const emptyDraft = (): Draft => ({ name: "", year: "", regions: [], districts: [], types: [], alloc: {}, picks: {}, q: 0 });
export const isDirty = (d: Draft) => !!(d.name || d.year || d.regions.length || d.districts.length || d.types.length || Object.keys(d.alloc).length);

export const qCell = (t: string) => { const q = t.split(" · "); return { text: q.slice(0, 2).join(" · "), sub: q.slice(2).join(" · ") }; };

export const PLAN_COLS = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text" as const, SortIcon: "Down" as const },
  { head: "ชื่อแผน", Style: "Text" as const, SortIcon: "Swap" as const },
  { head: "ภาค / ประเภทยานพาหนะ", width: 200 },
  { head: "จำนวนยานพาหนะ", width: 100 },
  { head: "ยานพาหนะรายไตรมาส", width: 210 },
  { head: "สถานะ", width: 150, Style: "Badge" as const, SortIcon: "Swap" as const },
  { head: "", width: 60, Style: "Action icons" as const },
];
const PLAN_SCOPE: Record<string, [string, string]> = { "MRZ7000001": ["ภาค 1, ภาค 2", "กระเช้าแก้ไฟ"], "MRZ7000002": ["ภาค 2, ภาค 3", "กระเช้าแก้ไฟ, รถพ่วงฉีดน้ำ"] };
export const planScope = (p: Plan): [string, string] => {
  const cars = Object.keys(p.alloc ?? {}).map((i) => CAND[Number(i)]).filter(Boolean);
  if (cars.length) {
    const rs = new Set(cars.map(regionOf)), ts = new Set(cars.map((c) => c.type));
    return [REGIONS.filter((r) => rs.has(r)).map(shortRegion).join(", "), VEHICLE_TYPES.filter((t) => ts.has(t)).join(", ")];
  }
  return PLAN_SCOPE[p.mr] ?? [p.region.split(", ").map(shortRegion).join(", "), p.type];
};
export const planDistricts = (p: Plan): string[] => {
  const cars = Object.keys(p.alloc ?? {}).map((i) => CAND[Number(i)]).filter(Boolean);
  if (cars.length) return [...new Set(cars.map(dCode))];
  if (p.districts?.length) return p.districts;
  return REGIONS.filter((r) => p.region.split(", ").some((x) => r === x || shortRegion(r) === x)).flatMap((r) => DISTRICTS[r]);
};
export const scopeCell = (p: Plan) => { const [text, sub] = planScope(p); return { text: text || "-", sub }; };
export const PLAN_COLS_ALL = [PLAN_COLS[0], { head: "หน่วยงานเจ้าของเรื่อง", width: 140 }, ...PLAN_COLS.slice(1)];
export const planRow = (p: Plan, menu: TableValue, view = false): TableValue[] =>
  [p.mr, ...(view ? [unitOf(p.mr, p.unit)] : []), { text: p.name, sub: "ปีงบประมาณ " + p.year }, scopeCell(p), String(p.cars), qCell(p.perQ), { pills: [PST[p.status]] }, menu];

export const menuCount = (p: Plan) => (p.status === "returned" ? 3 : p.status === "approved" || p.status === "active" ? 2 : 1);

export function nextMr(plans: Plan[], year: string, retired: string[] = []) {
  const yy = year.slice(-2), pre = "MRZ" + yy;
  const n = plans.map((p) => p.mr).concat(retired).filter((mr) => mr.startsWith(pre)).map((mr) => Number(mr.slice(pre.length)) || 0);
  return pre + String((n.length ? Math.max(...n) : 0) + 1).padStart(5, "0");
}

export const areaPicked = (d: Pick<Draft, "regions" | "districts" | "types">) => d.regions.length > 0 || d.districts.length > 0 || d.types.length > 0;
export const inArea = (d: Pick<Draft, "regions" | "districts" | "types">, i: number) => {
  const c = CAND[i];
  return (!d.regions.length || d.regions.includes(regionOf(c))) && (!d.districts.length || d.districts.includes(dCode(c))) && (!d.types.length || d.types.includes(c.type));
};
export const carsFor = (d: Pick<Draft, "regions" | "districts" | "types">) => areaPicked(d) ? UNIT_FLEET.filter((i) => inArea(d, i)) : [];
export const planCars = (d: Pick<Draft, "alloc">) => Object.keys(d.alloc).map(Number);
export const unassignedCars = (d: Pick<Draft, "alloc">) => planCars(d).filter((i) => d.alloc[i] === 0);
type CarParts = Pick<Draft, "alloc" | "picks" | "qty" | "manual" | "oils" | "oilSpec" | "draw">;
export const removeCar = (d: CarParts, i: number): CarParts => {
  const drop = <T,>(r: Record<number, T> | undefined) => { if (!r) return r; const x = { ...r }; delete x[i]; return x; };
  return { alloc: drop(d.alloc)!, picks: drop(d.picks)!, qty: drop(d.qty), manual: drop(d.manual), oils: drop(d.oils), oilSpec: drop(d.oilSpec), draw: drop(d.draw) };
};
export const decided = (d: Pick<Draft, "picks" | "manual" | "draw">, i: number) =>
  d.draw?.[i] === "none" || (d.picks[i] || []).some((x) => x !== 0) || (d.manual?.[i] || []).length > 0;
export const fleetAllocated = (d: Pick<Draft, "alloc">) => UNIT_FLEET.filter((i) => d.alloc[i] != null).length;
export const carsComplete = (d: Pick<Draft, "alloc" | "picks" | "manual" | "draw">) => planCars(d).length > 0 && planCars(d).every((i) => d.alloc[i] > 0 && decided(d, i));
export const draftComplete = (d: Draft) => !!d.name.trim() && !!d.year && carsComplete(d);
export const matchQuery = (i: number, q: string) => !q || (CAND[i].plate + " " + CAND[i].model).includes(q);
const allocScope = (alloc: Record<number, number>) => {
  const cars = Object.keys(alloc).map((i) => CAND[Number(i)]).filter(Boolean);
  const rs = new Set(cars.map(regionOf)), ts = new Set(cars.map((c) => c.type));
  return { region: REGIONS.filter((r) => rs.has(r)).join(", "), type: VEHICLE_TYPES.filter((t) => ts.has(t)).join(", ") };
};
export { allocScope };
export const inQuarter = (d: Draft, q = d.q) => Object.keys(d.alloc).map(Number).filter((i) => d.alloc[i] === q);
export const carQty = (d: Pick<Draft, "qty">, car: number, pi: number) => d.qty?.[car]?.[pi] ?? CAR_QTY[pi];
export const quarterParts = (d: Draft, q = d.q) => {
  const cars = inQuarter(d, q).filter((c) => d.draw?.[c] !== "none");
  return PARTS.map((_, i) => [i, cars.filter((c) => (d.picks[c] || []).includes(i)).reduce((a, c) => a + carQty(d, c, i), 0)] as const).filter(([, n]) => n > 0);
};

export function planFromDraft(d: Draft, plans: Plan[], today: string, retired: string[] = [], unit?: string): Plan {
  const per = [1, 2, 3, 4].map((q) => inQuarter(d, q).length);
  return {
    mr: nextMr(plans, d.year, retired), name: d.name.trim(), ...allocScope(d.alloc), nowQ: "ไตรมาส 1", cars: Object.keys(d.alloc).length,
    status: "review", created: today, year: d.year,
    perQ: per.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · "),
    regions: d.regions, districts: d.districts, types: d.types, alloc: d.alloc, picks: d.picks, qty: d.qty, manual: d.manual, oils: d.oils, oilSpec: d.oilSpec, draw: d.draw,
    ...(unit ? { unit } : {}),
  };
}
export const thaiToday = () => { const t = new Date(); return String(t.getDate()).padStart(2, "0") + "/" + String(t.getMonth() + 1).padStart(2, "0") + "/" + (t.getFullYear() + 543); };
