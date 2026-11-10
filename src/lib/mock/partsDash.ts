/* S4 แดชบอร์ดอะไหล่และความคืบหน้าของแผนที่อนุมัติแล้ว (/parts/) — ข้อมูลจำลองชุดเดียวกับจอ Figma 6 พ.ย. 2569
   ยกจาก figma-export/maintainance-plugin/screens.js (รีโป Maintenance-Request-Form): DASH_PLANS · DASH_TABS · DASH_AGG · DASH_CAR_COLS · DASH_CAR_ROWS · QST
   · DASH_PROG_COLS · DASH_PROG · DASH_METRICS · DASH_HINT · EXPORT_CARDS · QPART_COLS — ค่าสมมติทั้งหมด (ไม่อ่านจากที่เก็บข้อมูลจำลอง · ไม่มีค่าจาก Smart Inventory)
   ชื่อแผน หน่วยงาน ทะเบียน อะไหล่ อ่านจากข้อมูลกลาง (data.ts · planFlow.ts) ⇒ เปลี่ยนชื่อที่ข้อมูลกลางแล้วแดชบอร์ดตาม · ตัวเลขยอดรวม/ความคืบหน้า = ค่าคงที่ของจอ */
import type { PillColor } from "@/components/vms/PillOutline";
import type { TableColumn } from "@/components/vms/Table";
import { CAND, CAR_PICK, CAR_QTY, DISTRICTS, OIL_SPEC, PARTS, PLANS, PLAN_UNIT, REGIONS, UNITS, dCode, shortRegion, uniq } from "./data";
import { SAMPLE_NAME, samplePlan } from "./planFlow";
import { setMock } from "./store";

/* QPART_COLS — ตารางอะไหล่รวมตามรายการ (R81) ค่ากลางชุดเดียวจาก plan.ts (S1 S2 S4 และไฟล์ส่งออกใช้ตัวเดียวกัน · รวมสาขา 6 พ.ย. 2569) */
export { QPART_COLS } from "./plan";
export const DASH_CAR_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 170, Style: "Lead text" }, { head: "เลขที่ MR", width: 140 }, { head: "ไตรมาส", width: 100 }, { head: "ชนิด" },
  { head: "รหัสอะไหล่", width: 130 }, { head: "ประเภท", width: 110 }, { head: "จำนวน", width: 100 }, { head: "หน่วย", width: 90 },
];
export const DASH_PROG_COLS: TableColumn[] = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text" }, { head: "ชื่อแผน" }, { head: "ไตรมาส", width: 110 }, { head: "แผนเดินทาง", width: 120 },
  { head: "ยานพาหนะบำรุงรักษาแล้ว", width: 200 }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];
/* sortAll() — ทุกคอลัมน์เรียงได้ (Sort icon แบบ MA Overview: คอลัมน์แรก Down ที่เหลือ Swap · คอลัมน์ไม่มีหัวไม่มี) */
export const sortAll = (cols: TableColumn[]): TableColumn[] => cols.map((c, i) => (c.head ? { ...c, SortIcon: i === 0 ? "Down" : "Swap" } : c));

export const DASH_TITLE = "อะไหล่ของแผนที่อนุมัติแล้ว";
export const DASH_TABS = ["รวมตามรายการ", "แยกรายคัน", "ความคืบหน้าของแผน"];
export const DASH_HINT = ["ค้นหาชื่ออะไหล่, รหัสอะไหล่", "ค้นหาทะเบียน, ชื่ออะไหล่, รหัสอะไหล่", "ค้นหาเลขที่ MR, ชื่อแผน"];
export const DASH_YEAR = "2570";

/* แผนที่อนุมัติแล้วของปีงบประมาณ 2570 (DASH_PLANS = [planAs('approved'), PLANS[0], PLANS[1]]) */
export interface DashPlan { mr: string; name: string; unit: string; year: string; districts: string[]; cars: number }
const regionsOf = (region: string) => REGIONS.filter((r) => region.split(",").map((s) => shortRegion(s.trim())).includes(shortRegion(r)));
const dashPlan = (mr: string, name: string, region: string, year: string, cars: number): DashPlan => ({ mr, name, unit: PLAN_UNIT[mr] ?? UNITS[0], year, districts: regionsOf(region).flatMap((r) => DISTRICTS[r]), cars });
export const DASH_PLANS: DashPlan[] = [
  dashPlan("MRZ7000004", SAMPLE_NAME, REGIONS[0] + ", " + REGIONS[1], DASH_YEAR, 10),   // NEW_PLAN[4] = 10 คัน
  ...PLANS.slice(0, 2).map((p) => dashPlan(p.mr, p.name, p.region, p.year, p.cars)),
];
const planOf = (mr: string) => DASH_PLANS.find((p) => p.mr === mr);

/* รวมตามรายการ — ยอดรวมทุกแผน (ค่าสมมติ · คันที่ไม่เบิกอะไหล่ไม่รวม) + รายการที่ระบุเอง (MANUAL ของ screens.js) */
export type AggRow = [string, string, string, string, string];
const AGG_QTY = [540, 60, 60, 54, 16];
export const DASH_AGG: AggRow[] = [
  ...PARTS.map((p, i): AggRow => [p.name, p.code, p.group, String(AGG_QTY[i]), p.unit]),
  ["ไส้กรองอากาศขนาดเล็ก", "-", "เพิ่มเอง", "4", "ชิ้น"],
];

/* แยกรายคัน — รถ 3 คันแรกของแผน MRZ7000004 (CAND 0–2 · ไตรมาส A_ALL = 1 · น้ำมันไฮโดรลิกเมื่อ A_OILS เปลี่ยนน้ำมัน (1, 2) + ไส้กรอง CAR_PICK)
   จำนวน: น้ำมัน OIL_SPEC.litre · ไส้กรอง CAR_QTY · จอ Figma บอกยอดทั้งหมด 214 รายการ (ค่าสมมติ) แต่มีแถวตัวอย่าง 11 แถว ⇒ เว็บนับจากแถวจริง (BACKLOG ข้อ 22 หมวด ค.) */
export interface CarRow { plate: string; mr: string; q: number; part: number; qty: string; district: string }
const CAR_SRC: { car: number; q: number; oil: boolean }[] = [{ car: 0, q: 1, oil: true }, { car: 1, q: 1, oil: false }, { car: 2, q: 1, oil: true }];
export const DASH_CARS: CarRow[] = CAR_SRC.flatMap(({ car, q, oil }) => [...(oil ? [0] : []), ...CAR_PICK].map((x) => ({
  plate: CAND[car].plate, mr: "MRZ7000004", q, part: x, qty: x === 0 ? OIL_SPEC.litre : String(CAR_QTY[x]), district: dCode(CAND[car]),
})));

/* ความคืบหน้าของแผน — 1 แถว = 1 ไตรมาสของ 1 แผน [เลขที่ MR, ไตรมาส, แผนเดินทาง (ใบ), บำรุงรักษาแล้ว, ยานพาหนะในไตรมาส, สถานะ] */
export type QStatus = "todo" | "doing" | "done";
export const QST: Record<QStatus, [string, PillColor]> = { todo: ["ยังไม่เริ่ม", "Gray"], doing: ["กำลังดำเนินการ", "Info"], done: ["เสร็จแล้ว", "Success"] };
export type ProgRow = [string, number, number, number, number, QStatus];
export const DASH_PROG: ProgRow[] = [
  ["MRZ7000001", 1, 2, 4, 6, "doing"], ["MRZ7000001", 2, 0, 0, 3, "todo"], ["MRZ7000001", 3, 0, 0, 2, "todo"], ["MRZ7000001", 4, 0, 0, 1, "todo"],
  ["MRZ7000004", 1, 1, 0, 3, "doing"], ["MRZ7000004", 2, 0, 0, 3, "todo"], ["MRZ7000004", 3, 0, 0, 2, "todo"], ["MRZ7000004", 4, 0, 0, 2, "todo"],
  ["MRZ7000002", 2, 1, 0, 4, "doing"], ["MRZ7000002", 3, 0, 0, 2, "todo"],
];

/* Metric item 4 ใบ [Text, Number, สี Featured icon] — dashMetrics() ของ screens.js (Figma 76efd87 · 10 พ.ย. 2569)
   เจ้าของงาน "ผู้สร้างแผนเห็นเฉพาะแผนของหน่วยงานตัวเอง ยกเว้น กบค จะเห็นแผนของหน่วยงานอื่นด้วย แต่แก้ไขไม่ได้"
   ⇒ นับเฉพาะแผนที่บทบาทนั้นเห็น: unit = หน่วยงานของผู้ใช้ (กกฟ.1 กกฟ.2 กรย.) · ไม่มี = กบค. ทุกหน่วยงาน (แผน 3 · ยานพาหนะ 30 · บำรุงรักษาแล้ว 4/30 เท่าจอเดิม)
   รายการอะไหล่ = DASH_AGG.length (จอ Figma ไม่แยกตามหน่วยงาน) */
export const dashMine = (unit?: string) => (mr: string) => !unit || DASH_PLANS.find((p) => p.mr === mr)?.unit === unit;
export function dashMetrics(unit?: string): [string, string, "Brand" | "Success"][] {
  const pl = DASH_PLANS.filter((p) => dashMine(unit)(p.mr)), pr = DASH_PROG.filter((r) => dashMine(unit)(r[0]));
  const cars = pl.reduce((a, p) => a + p.cars, 0), done = pr.reduce((a, r) => a + r[3], 0);
  return [["แผนที่อนุมัติแล้ว", String(pl.length), "Brand"], ["ยานพาหนะในแผน", String(cars), "Brand"], ["รายการอะไหล่", String(DASH_AGG.length), "Brand"], ["ยานพาหนะบำรุงรักษาแล้ว", done + "/" + cars, "Success"]];
}

/* popup ส่งออก (exportModal · R32) */
export const EXPORT_CARDS = [{ Text: "PDF", SupportingText: "เอกสาร A4 สำหรับพิมพ์หรือแนบเอกสาร" }, { Text: "Excel", SupportingText: "ไฟล์ .xlsx แยกชีตตามหัวข้อ" }];
export const EXPORT_ALL_SUB = " รายการ ทุกแผนที่อนุมัติแล้วในปีงบประมาณ " + DASH_YEAR;

/* ---------- ตัวกรอง (ปีงบประมาณ · หน่วยงานผู้ขอเบิก · เขต · แผน) ---------- */
export interface DashFilter { year: string; units: string[]; districts: string[]; plans: string[] }
export const NO_FILTER: DashFilter = { year: "", units: [], districts: [], plans: [] };
/* หน่วยงานผู้ขอเบิก = UNITS ของ screens.js (กกฟ.1 กกฟ.2 กรย. กบค.) */
export const DASH_UNITS = uniq([...UNITS, "กบค."]);
export const DASH_DISTRICTS = uniq(DASH_PLANS.flatMap((p) => p.districts));
export const planMatch = (p: DashPlan | undefined, f: DashFilter) => !!p && (!f.year || p.year === f.year) && (!f.units.length || f.units.includes(p.unit))
  && (!f.plans.length || f.plans.includes(p.mr)) && (!f.districts.length || p.districts.some((d) => f.districts.includes(d)));
export const filterCount = (f: DashFilter) => (f.year ? 1 : 0) + f.units.length + f.districts.length + f.plans.length;

const has = (q: string, ...s: string[]) => !q || s.some((x) => x.toLowerCase().includes(q));
/* แถวที่ตรงคำค้นและตัวกรองของแต่ละแท็บ — รวมตามรายการเป็นยอดรวมชุดเดียว ⇒ แสดงเมื่อมีแผนที่ตรงตัวกรองอย่างน้อย 1 แผน (BACKLOG ข้อ 22 หมวด ค.) */
export const aggRows = (query: string, f: DashFilter) => {
  const q = query.trim().toLowerCase();
  return DASH_PLANS.some((p) => planMatch(p, f)) ? DASH_AGG.filter((r) => has(q, r[0], r[1])) : [];
};
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

/* ?seed=S4 / โหมดพาดู: ใส่แผนตัวอย่าง MRZ7000004 สถานะอนุมัติแล้ว (samplePlan เดียวกับ /scenarios/sample/) ⇒ ปุ่ม › ของแผนนี้เปิดหน้าไตรมาสของแผนจริงได้
   ไม่แตะแผนอื่น (MRZ7000001 ดำเนินการ · MRZ7000002 อนุมัติแล้ว อยู่ใน PLANS ตั้งต้นแล้ว) */
export const seedDash = () => setMock((s) => ({ ...s, plans: [samplePlan("approved"), ...s.plans.filter((p) => p.mr !== "MRZ7000004")] }));
