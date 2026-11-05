/* ตัวช่วยของแผน — ยกจาก screens.js (qCell · whCell · planRow · quarterParts) + เลขที่ MR ตามเงื่อนไข S1 */
import { CAND, CAR_QTY, PARTS, PST, REGIONS, VEHICLE_TYPES, WH_ACK, dCode, regionOf, shortRegion, type ManualPart, type Plan } from "./data";
import type { TableValue } from "@/components/vms/Table";

/* ฟอร์มสร้างแผน (planForm) */
export interface Draft {
  name: string;
  year: string;
  regions: string[];
  districts: string[];
  types: string[];
  alloc: Record<number, number>;      // ลำดับรถใน CAND → ไตรมาส (1 คัน 1 ไตรมาส)
  picks: Record<number, number[]>;    // ลำดับรถ → ลำดับอะไหล่ใน PARTS
  q: number;                          // แท็บที่เปิด (0 = ทั้งหมด · 1–4 = ไตรมาส · แบบ A 5 พ.ย. 2569)
  qty?: Record<number, Record<number, number>>;   // S21 จำนวนต่อคันที่แก้ไว้ (ไม่มี = CAR_QTY)
  manual?: Record<number, ManualPart[]>;          // S21 รายการเพิ่มเติม
  editOf?: string;                    // S19 ฟอร์มแก้ไข: เลขที่ MR ของแผนที่แก้
}
export const emptyDraft = (): Draft => ({ name: "", year: "", regions: [], districts: [], types: [], alloc: {}, picks: {}, q: 0 });
export const isDirty = (d: Draft) => !!(d.name || d.year || d.regions.length || d.districts.length || d.types.length || Object.keys(d.alloc).length);

/* qCell — 4 ไตรมาสยาวเกินคอลัมน์ ⇒ 2 บรรทัด */
export const qCell = (t: string) => { const q = t.split(" · "); return { text: q.slice(0, 2).join(" · "), sub: q.slice(2).join(" · ") }; };
export const qWithCars = (p: Plan) => (p.perQ.match(/: (\d+)/g) || []).filter((x) => Number(x.slice(2)) > 0).length;
/* whCell — คลังรับทราบ: ก่อนอนุมัติ "-" · หลังอนุมัติ x/n ไตรมาส */
export const whCell = (p: Plan) => p.status === "review" || p.status === "returned" ? "-" : (p.status === "closed" ? qWithCars(p) : p.ack ? Object.keys(p.ack).length : WH_ACK[p.mr] || 0) + "/" + qWithCars(p) + " ไตรมาส";

export const PLAN_COLS = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text" as const, SortIcon: "Down" as const },
  { head: "ชื่อแผน", Style: "Text" as const, SortIcon: "Swap" as const },
  { head: "ภาค / ประเภทรถ", width: 200 },
  { head: "จำนวนรถ", width: 100 },
  { head: "รถรายไตรมาส", width: 210 },
  { head: "คลังรับทราบ", width: 130 },
  { head: "สถานะ", width: 150, Style: "Badge" as const, SortIcon: "Swap" as const },
  { head: "", width: 60, Style: "Action icons" as const },
];
/* ภาค / ประเภทรถ (scopeCell · เจ้าของงาน 5 พ.ย. 2569 "สรุปจากรถที่อยู่ในแผนจริง") — 2 บรรทัดในช่องเดียว: ภาคของรถในแผน · ประเภทรถของรถในแผน
   แผนที่จัดรถไว้ (alloc) = สรุปจากรถจริง เรียงตาม REGIONS / VEHICLE_TYPES · แผนตัวอย่าง = PLAN_SCOPE หรือภาคและประเภทเดียวของแผน */
const PLAN_SCOPE: Record<string, [string, string]> = { "MR Z7000002": ["ภาค 2, ภาค 3", "รถกระเช้า, รถเครน"] };
export const planScope = (p: Plan): [string, string] => {
  const cars = Object.keys(p.alloc ?? {}).map((i) => CAND[Number(i)]).filter(Boolean);
  if (cars.length) {
    const rs = new Set(cars.map(regionOf)), ts = new Set(cars.map((c) => c.type));
    return [REGIONS.filter((r) => rs.has(r)).map(shortRegion).join(", "), VEHICLE_TYPES.filter((t) => ts.has(t)).join(", ")];
  }
  return PLAN_SCOPE[p.mr] ?? [p.region.split(", ").map(shortRegion).join(", "), p.type];
};
export const scopeCell = (p: Plan) => { const [text, sub] = planScope(p); return { text: text || "-", sub }; };
export const planRow = (p: Plan, menu: TableValue): TableValue[] =>
  [p.mr, { text: p.name, sub: "ปีงบประมาณ " + p.year }, scopeCell(p), String(p.cars), qCell(p.perQ), whCell(p), { pills: [PST[p.status]] }, menu];

/* เมนู "…" ตามสถานะแผน (S19 S20): ก่อนอนุมัติ ดูรายละเอียด แก้ไข ลบ · อนุมัติแล้ว ดูรายละเอียด แก้ไข · ดำเนินการแล้ว ดูรายละเอียดอย่างเดียว */
export const menuCount = (p: Plan) => (p.status === "review" || p.status === "returned" ? 3 : p.status === "approved" ? 2 : 1);

/* เลขที่ MR: "MR Z" + ปีที่เลือก 2 หลัก + ลำดับ 5 หลักนับต่อในปีนั้น */
/* retired = เลขที่ MR ของแผนที่ลบไปแล้ว (S20: ไม่นำเลขกลับมาใช้ซ้ำ) */
export function nextMr(plans: Plan[], year: string, retired: string[] = []) {
  const yy = year.slice(-2), pre = "MR Z" + yy;
  const n = plans.map((p) => p.mr).concat(retired).filter((mr) => mr.startsWith(pre)).map((mr) => Number(mr.slice(pre.length)) || 0);
  return pre + String((n.length ? Math.max(...n) : 0) + 1).padStart(5, "0");
}

/* รถทุกคันของพื้นที่ที่เลือก (inArea ใน screens.js · แบบ A 5 พ.ย. 2569): ต้องเลือกภาคอย่างน้อย 1 ภาค · เขต / ประเภทรถ ว่าง = ทุกเขตของภาค / ทุกประเภท */
export const inArea = (d: Pick<Draft, "regions" | "districts" | "types">, i: number) => {
  const c = CAND[i];
  return d.regions.includes(regionOf(c)) && (!d.districts.length || d.districts.includes(dCode(c))) && (!d.types.length || d.types.includes(c.type));
};
export const carsFor = (d: Pick<Draft, "regions" | "districts" | "types">) => d.regions.length ? CAND.map((_, i) => i).filter((i) => inArea(d, i)) : [];
/* คำค้น "เลขทะเบียน, ยี่ห้อ, รุ่น" (inQuery) */
export const matchQuery = (i: number, q: string) => !q || (CAND[i].plate + " " + CAND[i].model).includes(q);
/* ภาค · ประเภทรถ ของรถที่จัดลงไตรมาสแล้ว (บันทึกเป็นภาค / ประเภทรถของแผน — สรุปจากรถในแผนจริง) */
const allocScope = (alloc: Record<number, number>) => {
  const cars = Object.keys(alloc).map((i) => CAND[Number(i)]).filter(Boolean);
  const rs = new Set(cars.map(regionOf)), ts = new Set(cars.map((c) => c.type));
  return { region: REGIONS.filter((r) => rs.has(r)).join(", "), type: VEHICLE_TYPES.filter((t) => ts.has(t)).join(", ") };
};
export { allocScope };
export const inQuarter = (d: Draft, q = d.q) => Object.keys(d.alloc).map(Number).filter((i) => d.alloc[i] === q);
/* quarterParts — อะไหล่ในไตรมาส = รวมจากรถของไตรมาสนั้น [ลำดับอะไหล่, จำนวน] */
export const carQty = (d: Pick<Draft, "qty">, car: number, pi: number) => d.qty?.[car]?.[pi] ?? CAR_QTY[pi];
export const quarterParts = (d: Draft, q = d.q) => {
  const cars = inQuarter(d, q);
  return PARTS.map((_, i) => [i, cars.filter((c) => (d.picks[c] || []).includes(i)).reduce((a, c) => a + carQty(d, c, i), 0)] as const).filter(([, n]) => n > 0);
};

/* แผนใหม่จากฟอร์ม (บันทึกและส่งอนุมัติ → รออนุมัติ) */
export function planFromDraft(d: Draft, plans: Plan[], today: string, retired: string[] = []): Plan {
  const per = [1, 2, 3, 4].map((q) => inQuarter(d, q).length);
  return {
    mr: nextMr(plans, d.year, retired), name: d.name.trim(), ...allocScope(d.alloc), nowQ: "ไตรมาส 1", cars: Object.keys(d.alloc).length,
    status: "review", created: today, year: d.year,
    perQ: per.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · "),
    regions: d.regions, districts: d.districts, types: d.types, alloc: d.alloc, picks: d.picks, qty: d.qty, manual: d.manual,
  };
}
/* วันที่แบบไทย dd/mm/ปี พ.ศ. */
export const thaiToday = () => { const t = new Date(); return String(t.getDate()).padStart(2, "0") + "/" + String(t.getMonth() + 1).padStart(2, "0") + "/" + (t.getFullYear() + 543); };
