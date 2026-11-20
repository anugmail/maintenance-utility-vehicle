import type { PillColor } from "@/components/vms/PillOutline";
import type { TableColumn } from "@/components/vms/Table";
import { CAND, CAR_PICK, CAR_QTY, DISTRICTS, OIL_SPEC, PARTS, PLANS, PLAN_UNIT, REGIONS, UNITS, dCode, shortRegion, uniq } from "./data";
import { SAMPLE_NAME, samplePlan } from "./planFlow";
import { setMock } from "./store";

export { QPART_COLS } from "./plan";
export const DASH_CAR_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 170, Style: "Lead text" }, { head: "เลขที่ MR", width: 140 }, { head: "ไตรมาส", width: 100 }, { head: "ชนิด" },
  { head: "รหัสอะไหล่", width: 130 }, { head: "ประเภท", width: 110 }, { head: "จำนวน", width: 100 }, { head: "หน่วย", width: 90 },
];
export const DASH_PROG_COLS: TableColumn[] = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text" }, { head: "ชื่อแผน" }, { head: "ไตรมาส", width: 110 }, { head: "แผนเดินทาง", width: 120 },
  { head: "ยานพาหนะบำรุงรักษาแล้ว", width: 200 }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];
export const sortAll = (cols: TableColumn[]): TableColumn[] => cols.map((c, i) => (c.head ? { ...c, SortIcon: i === 0 ? "Down" : "Swap" } : c));

export const DASH_TITLE = "อะไหล่ของแผนที่อนุมัติแล้ว";
export const DASH_TABS = ["รวมตามรายการ", "แยกรายคัน", "ความคืบหน้าของแผน"];
export const DASH_HINT = ["ค้นหาชื่ออะไหล่, รหัสอะไหล่", "ค้นหาทะเบียน, ชื่ออะไหล่, รหัสอะไหล่", "ค้นหาเลขที่ MR, ชื่อแผน"];
export const DASH_YEAR = "2570";

export interface DashPlan { mr: string; name: string; unit: string; year: string; districts: string[]; cars: number }
const regionsOf = (region: string) => REGIONS.filter((r) => region.split(",").map((s) => shortRegion(s.trim())).includes(shortRegion(r)));
const dashPlan = (mr: string, name: string, region: string, year: string, cars: number): DashPlan => ({ mr, name, unit: PLAN_UNIT[mr] ?? UNITS[0], year, districts: regionsOf(region).flatMap((r) => DISTRICTS[r]), cars });
export const DASH_PLANS: DashPlan[] = [
  dashPlan("MRZ7000004", SAMPLE_NAME, REGIONS[0] + ", " + REGIONS[1], DASH_YEAR, 10),
  ...PLANS.slice(0, 2).map((p) => dashPlan(p.mr, p.name, p.region, p.year, p.cars)),
];
const planOf = (mr: string) => DASH_PLANS.find((p) => p.mr === mr);

export type AggRow = [string, string, string, string, string];
const MANUAL_ROW = { name: "ไส้กรองอากาศขนาดเล็ก", code: "-", group: "เพิ่มเอง", unit: "ชิ้น" };
const AGG_BY_PLAN: Record<string, number[]> = {
  MRZ7000004: [180, 20, 20, 18, 6, 4], MRZ7000001: [216, 24, 24, 22, 6, 0], MRZ7000002: [144, 16, 16, 14, 4, 0],
};
const aggOf = (mrs: string[]): AggRow[] => [...PARTS, MANUAL_ROW].map((p, i): AggRow => [p.name, p.code, p.group, String(mrs.reduce((a, mr) => a + (AGG_BY_PLAN[mr]?.[i] ?? 0), 0)), p.unit]).filter((r) => Number(r[3]) > 0);
export const DASH_AGG: AggRow[] = aggOf(Object.keys(AGG_BY_PLAN));

export interface CarRow { plate: string; mr: string; q: number; part: number; qty: string; district: string }
const CAR_SRC: { car: number; q: number; oil: boolean }[] = [{ car: 0, q: 1, oil: true }, { car: 1, q: 1, oil: false }, { car: 2, q: 1, oil: true }];
export const DASH_CARS: CarRow[] = CAR_SRC.flatMap(({ car, q, oil }) => [...(oil ? [0] : []), ...CAR_PICK].map((x) => ({
  plate: CAND[car].plate, mr: "MRZ7000004", q, part: x, qty: x === 0 ? OIL_SPEC.litre : String(CAR_QTY[x]), district: dCode(CAND[car]),
})));

export type QStatus = "todo" | "doing" | "done";
export const QST: Record<QStatus, [string, PillColor]> = { todo: ["ยังไม่เริ่ม", "Gray"], doing: ["กำลังดำเนินการ", "Info"], done: ["เสร็จแล้ว", "Success"] };
export type ProgRow = [string, number, number, number, number, QStatus];
export const DASH_PROG: ProgRow[] = [
  ["MRZ7000001", 1, 2, 4, 6, "doing"], ["MRZ7000001", 2, 0, 0, 3, "todo"], ["MRZ7000001", 3, 0, 0, 2, "todo"], ["MRZ7000001", 4, 0, 0, 1, "todo"],
  ["MRZ7000004", 1, 1, 0, 3, "doing"], ["MRZ7000004", 2, 0, 0, 3, "todo"], ["MRZ7000004", 3, 0, 0, 2, "todo"], ["MRZ7000004", 4, 0, 0, 2, "todo"],
  ["MRZ7000002", 2, 1, 0, 4, "doing"], ["MRZ7000002", 3, 0, 0, 2, "todo"],
];

export const dashMine = (unit?: string) => (mr: string) => !unit || DASH_PLANS.find((p) => p.mr === mr)?.unit === unit;
export function dashMetrics(unit?: string): [string, string, "Brand" | "Success"][] {
  const pl = DASH_PLANS.filter((p) => dashMine(unit)(p.mr)), pr = DASH_PROG.filter((r) => dashMine(unit)(r[0]));
  const cars = pl.reduce((a, p) => a + p.cars, 0), done = pr.reduce((a, r) => a + r[3], 0);
  return [["แผนที่อนุมัติแล้ว", String(pl.length), "Brand"], ["ยานพาหนะในแผน", String(cars), "Brand"], ["รายการอะไหล่", String(DASH_AGG.length), "Brand"], ["ยานพาหนะบำรุงรักษาแล้ว", done + "/" + cars, "Success"]];
}

export const EXPORT_CARDS = [{ Text: "PDF", SupportingText: "เอกสาร A4 สำหรับพิมพ์หรือแนบเอกสาร" }, { Text: "Excel", SupportingText: "ไฟล์ .xlsx แยกชีตตามหัวข้อ" }];
export const EXPORT_ALL_SUB = " รายการ ทุกแผนที่อนุมัติแล้วในปีงบประมาณ " + DASH_YEAR;

export interface DashFilter { year: string; units: string[]; districts: string[]; plans: string[] }
export const NO_FILTER: DashFilter = { year: "", units: [], districts: [], plans: [] };
export const DASH_UNITS = uniq([...UNITS, "กบค."]);
export const DASH_DISTRICTS = uniq(DASH_PLANS.flatMap((p) => p.districts));
export const planMatch = (p: DashPlan | undefined, f: DashFilter) => !!p && (!f.year || p.year === f.year) && (!f.units.length || f.units.includes(p.unit))
  && (!f.plans.length || f.plans.includes(p.mr)) && (!f.districts.length || p.districts.some((d) => f.districts.includes(d)));
export const filterCount = (f: DashFilter) => (f.year ? 1 : 0) + f.units.length + f.districts.length + f.plans.length;

const has = (q: string, ...s: string[]) => !q || s.some((x) => x.toLowerCase().includes(q));
export const aggRows = (query: string, f: DashFilter) => {
  const q = query.trim().toLowerCase();
  return aggOf(DASH_PLANS.filter((p) => planMatch(p, f)).map((p) => p.mr)).filter((r) => has(q, r[0], r[1]));
};
const SAMPLE = samplePlan("approved");
export const DASH_NOPARTS: { plate: string; mr: string; q: number }[] = Object.keys(SAMPLE.alloc ?? {}).map(Number)
  .filter((i) => !(SAMPLE.picks?.[i] ?? []).length && !SAMPLE.oils?.[i]).map((i) => ({ plate: CAND[i].plate, mr: SAMPLE.mr, q: SAMPLE.alloc?.[i] ?? 0 }));
export const carRows = (query: string, f: DashFilter) => {
  const q = query.trim().toLowerCase();
  return DASH_CARS.filter((r) => planMatch(planOf(r.mr), { ...f, districts: [] }) && (!f.districts.length || f.districts.includes(r.district))
    && has(q, r.plate, PARTS[r.part].name, PARTS[r.part].code));
};
export const progRows = (query: string, f: DashFilter) => {
  const q = query.trim().toLowerCase();
  return DASH_PROG.filter((r) => { const p = planOf(r[0]); return planMatch(p, f) && has(q, r[0], p?.name ?? ""); });
};
export const dashPlanOf = planOf;

export const seedDash = () => setMock((s) => ({ ...s, plans: [samplePlan("approved"), ...s.plans.filter((p) => p.mr !== "MRZ7000004")] }));
