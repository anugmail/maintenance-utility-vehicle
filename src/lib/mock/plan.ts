/* ตัวช่วยของแผน — ยกจาก screens.js (qCell · planRow · quarterParts) + เลขที่ MR ตามเงื่อนไข S1 */
import { CAND, CAR_QTY, DISTRICTS, PARTS, PST, REGIONS, UNIT_FLEET, VEHICLE_TYPES, dCode, regionOf, shortRegion, unitOf, type ManualPart, type OilSpec, type Plan } from "./data";
import type { TableColumn, TableValue } from "@/components/vms/Table";

/* QPART_COLS — ตารางอะไหล่รวมตามรายการ (R81 · 6 พ.ย. 2569 เจ้าของงาน "ถ้าเพิ่ม คอลัมน์ ก็ส่งผลกระทบกับ หน้าอื่นๆที่เป็นหน้าที่เหมือนกันด้วย ตอน export ก็เกี่ยวข้องด้วย")
   ชุดเดียวใช้ทุกที่ที่แสดงอะไหล่รวมของไตรมาส/แผน: อะไหล่ในไตรมาส n (S1 S19 ฟอร์มแผน) · อะไหล่ในแผน (S2) · แดชบอร์ดแท็บรวมตามรายการ (S4) — QPART_COLS ของ screens.js
   ตาม `Table` (Table header cell + Table cell Lead text) ของไฟล์ Component · แถว = qpartRow [ชนิด, รหัสอะไหล่, ประเภท, จำนวน, หน่วย] · เพิ่ม/ลดคอลัมน์ที่นี่ที่เดียว */
export const QPART_COLS: TableColumn[] = [
  { head: "ชนิด", Style: "Lead text" }, { head: "รหัสอะไหล่", width: 150 }, { head: "ประเภท", width: 160 }, { head: "จำนวน", width: 120 }, { head: "หน่วย", width: 110 },
];
export const qpartRow = (r: { name: string; code: string; group: string; qty: number; unit: string }): TableValue[] => [r.name, r.code, r.group, String(r.qty), r.unit];

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
  oils?: Record<number, number>;                  // S21 น้ำมันไฮดรอลิกรายคัน (OIL_PLAN_OPTS)
  oilSpec?: Record<number, OilSpec>;              // S21 เบอร์ รหัส ลิตร
  draw?: Record<number, "none">;                  // S21 การเบิกอะไหล่ (6 พ.ย. 2569): "none" = ไม่เบิกอะไหล่
  editOf?: string;                    // S19 ฟอร์มแก้ไข: เลขที่ MR ของแผนที่แก้
}
export const emptyDraft = (): Draft => ({ name: "", year: "", regions: [], districts: [], types: [], alloc: {}, picks: {}, q: 0 });
export const isDirty = (d: Draft) => !!(d.name || d.year || d.regions.length || d.districts.length || d.types.length || Object.keys(d.alloc).length);

/* qCell — 4 ไตรมาสยาวเกินคอลัมน์ ⇒ 2 บรรทัด */
export const qCell = (t: string) => { const q = t.split(" · "); return { text: q.slice(0, 2).join(" · "), sub: q.slice(2).join(" · ") }; };

/* PLAN_COLS 7 คอลัมน์ (6 พ.ย. 2569 ตัดคอลัมน์คลังรับทราบ — S22 ตัดออก · ระบบแจ้ง Smart Inventory ตอนอนุมัติแทน) */
export const PLAN_COLS = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text" as const, SortIcon: "Down" as const },
  { head: "ชื่อแผน", Style: "Text" as const, SortIcon: "Swap" as const },
  { head: "ภาค / ประเภทยานพาหนะ", width: 200 },
  { head: "จำนวนยานพาหนะ", width: 100 },
  { head: "ยานพาหนะรายไตรมาส", width: 210 },
  { head: "สถานะ", width: 150, Style: "Badge" as const, SortIcon: "Swap" as const },
  { head: "", width: 60, Style: "Action icons" as const },
];
/* ภาค / ประเภทรถ (scopeCell · เจ้าของงาน 5 พ.ย. 2569 "สรุปจากรถที่อยู่ในแผนจริง") — 2 บรรทัดในช่องเดียว: ภาคของรถในแผน · ประเภทรถของรถในแผน
   แผนที่จัดรถไว้ (alloc) = สรุปจากรถจริง เรียงตาม REGIONS / VEHICLE_TYPES · แผนตัวอย่าง = PLAN_SCOPE หรือภาคและประเภทเดียวของแผน */
/* 5 พ.ย. 2569 ชีตลูกค้า: MRZ7000001 รถในแผนอยู่ทั้ง กฟน. และ กฟฉ. ⇒ ภาค 1 และภาค 2 (screens.js) */
const PLAN_SCOPE: Record<string, [string, string]> = { "MRZ7000001": ["ภาค 1, ภาค 2", "กระเช้าแก้ไฟ"], "MRZ7000002": ["ภาค 2, ภาค 3", "กระเช้าแก้ไฟ, รถพ่วงฉีดน้ำ"] };
export const planScope = (p: Plan): [string, string] => {
  const cars = Object.keys(p.alloc ?? {}).map((i) => CAND[Number(i)]).filter(Boolean);
  if (cars.length) {
    const rs = new Set(cars.map(regionOf)), ts = new Set(cars.map((c) => c.type));
    return [REGIONS.filter((r) => rs.has(r)).map(shortRegion).join(", "), VEHICLE_TYPES.filter((t) => ts.has(t)).join(", ")];
  }
  return PLAN_SCOPE[p.mr] ?? [p.region.split(", ").map(shortRegion).join(", "), p.type];
};
/* เขตของแผน (ตัวกรอง "เขต" ของรายการแผน · 6 พ.ย. 2569): แผนที่จัดรถรายคัน = เขตของรถในแผน · แผนตัวอย่าง = เขตที่เลือกไว้ หรือทุกเขตของภาคในแผน */
export const planDistricts = (p: Plan): string[] => {
  const cars = Object.keys(p.alloc ?? {}).map((i) => CAND[Number(i)]).filter(Boolean);
  if (cars.length) return [...new Set(cars.map(dCode))];
  if (p.districts?.length) return p.districts;
  return REGIONS.filter((r) => p.region.split(", ").some((x) => r === x || shortRegion(r) === x)).flatMap((r) => DISTRICTS[r]);
};
export const scopeCell = (p: Plan) => { const [text, sub] = planScope(p); return { text: text || "-", sub }; };
/* view = กบค. ดูแผนทุกหน่วยงาน (planRow(p, view) ของ screens.js 6 พ.ย. 2569): หน่วยงานเจ้าของแผนเป็นบรรทัดรองของเลขที่ MR */
/* มุม กบค. (view · เห็นแผนทุกหน่วยงาน) — 9 พ.ย. 2569 เจ้าของงาน "หน้านี้น่าจะต้องเพิ่มคอลัมม์ หน่วยงานเจ้าของเรื่อง ด้วย" (Figma 5dfd978 · PLAN_COLS_ALL ของ screens.js)
   คอลัมน์ "หน่วยงานเจ้าของเรื่อง" (กว้าง 140 · Text) ต่อจากเลขที่ MR แทนบรรทัดรองใต้เลขที่ MR · มุมหน่วยงาน (เห็นแต่แผนของตัวเอง) ไม่มีคอลัมน์นี้ · มือถือเป็นช่องหนึ่งของการ์ด */
export const PLAN_COLS_ALL = [PLAN_COLS[0], { head: "หน่วยงานเจ้าของเรื่อง", width: 140 }, ...PLAN_COLS.slice(1)];
export const planRow = (p: Plan, menu: TableValue, view = false): TableValue[] =>
  [p.mr, ...(view ? [unitOf(p.mr, p.unit)] : []), { text: p.name, sub: "ปีงบประมาณ " + p.year }, scopeCell(p), String(p.cars), qCell(p.perQ), { pills: [PST[p.status]] }, menu];

/* เมนู "…" ตามสถานะแผน (S19 S20): ก่อนอนุมัติ ดูรายละเอียด แก้ไข ลบ · อนุมัติแล้ว ดูรายละเอียด แก้ไข · ดำเนินการ ดูรายละเอียด แก้ไข (11 พ.ย. 2569 เจ้าของงาน "แผนที่ดำเนินการแล้ว ยังสามารถแก้ไขได้" · BACKLOG ข้อ 64) · ปิดงานแล้ว ดูรายละเอียดอย่างเดียว
   ผู้เรียกจำกัดให้หน่วยงานเจ้าของแผน (canManage) — กบค. ดูแผนหน่วยงานอื่น = ดูรายละเอียดอย่างเดียว */
export const menuCount = (p: Plan) => (p.status === "review" || p.status === "returned" ? 3 : p.status === "approved" || p.status === "active" ? 2 : 1);

/* เลขที่ MR: "MRZ" + ปีที่เลือก 2 หลัก + ลำดับ 5 หลักนับต่อในปีนั้น */
/* retired = เลขที่ MR ของแผนที่ลบไปแล้ว (S20: ไม่นำเลขกลับมาใช้ซ้ำ) */
export function nextMr(plans: Plan[], year: string, retired: string[] = []) {
  const yy = year.slice(-2), pre = "MRZ" + yy;
  const n = plans.map((p) => p.mr).concat(retired).filter((mr) => mr.startsWith(pre)).map((mr) => Number(mr.slice(pre.length)) || 0);
  return pre + String((n.length ? Math.max(...n) : 0) + 1).padStart(5, "0");
}

/* รถทุกคันของพื้นที่ที่เลือก (inArea ใน screens.js · R69 5 พ.ย. 2569 "ไม่ต้องมี disable เลือกตรงใหนก็ได้"): เลือกช่องใดช่องหนึ่งก็แสดงรถที่ตรงทุกเงื่อนไข · ช่องว่าง = ทั้งหมด · ไม่เลือกเลย = ไม่มีรถ */
export const areaPicked = (d: Pick<Draft, "regions" | "districts" | "types">) => d.regions.length > 0 || d.districts.length > 0 || d.types.length > 0;
export const inArea = (d: Pick<Draft, "regions" | "districts" | "types">, i: number) => {
  const c = CAND[i];
  return (!d.regions.length || d.regions.includes(regionOf(c))) && (!d.districts.length || d.districts.includes(dCode(c))) && (!d.types.length || d.types.includes(c.type));
};
/* รถที่ฟอร์มเห็น = รถจำลองครบชุด (UNIT_FLEET = CAND · 9 พ.ย. 2569 เจ้าของงาน "ถ้าเลือกภาคแล้วต้องแสดงตามที่เลือกสิ") · ตารางแท็บทั้งหมด = ทุกคันที่ตรงภาค เขต ประเภท (ช่องว่าง = ทั้งหมด · หลายภาค = ทุกภาคที่เลือก) */
export const carsFor = (d: Pick<Draft, "regions" | "districts" | "types">) => areaPicked(d) ? UNIT_FLEET.filter((i) => inArea(d, i)) : [];
/* กำหนดอะไหล่แล้ว (decided ของ planForm 6 พ.ย. 2569) = เลือกไม่เบิก หรือเบิกแล้วมีรายการ (อะไหล่จากคลังที่ไม่ใช่น้ำมัน หรือรายการที่ระบุเอง) */
export const decided = (d: Pick<Draft, "picks" | "manual" | "draw">, i: number) =>
  d.draw?.[i] === "none" || (d.picks[i] || []).some((x) => x !== 0) || (d.manual?.[i] || []).length > 0;
/* ปุ่มบันทึกและส่งอนุมัติ (complete ของ planForm · Figma de74711 · 9 พ.ย. 2569 ค่ำ เจ้าของงาน "ยังจัดอะใหล่ไม่เสร็จ ปุ่มอนุมัติต้อง disable" + เคาะ "ยานพาหนะในตารางต้องจัดครบ"):
   ชื่อแผน · ปีงบประมาณ · ยานพาหนะในไตรมาสอย่างน้อย 1 คัน · ยานพาหนะทุกคันในตารางแท็บทั้งหมด (carsFor = ตรงตัวกรองภาค เขต ประเภท ไม่ขึ้นกับคำค้น · ไม่เลือกตัวกรอง = ไม่มีคัน) จัดลงไตรมาสแล้ว
   · ทุกคันที่จัดกำหนดอะไหล่แล้ว (เบิกพร้อมรายการ หรือ ไม่เบิก) — ทั้งสร้างและแก้ไข · ไม่ใช่ทุกคันของหน่วยงาน (243 คัน)
   ประวัติ: 6 พ.ย. ต้องจัดครบทุกคันของหน่วยงาน → 9 พ.ย. บ่าย (ff5f1f8) คันที่จัดกำหนดอะไหล่ครบพอ → 9 พ.ย. ค่ำ (de74711) ยานพาหนะในตารางต้องจัดครบด้วย */
export const fleetAllocated = (d: Pick<Draft, "alloc">) => UNIT_FLEET.filter((i) => d.alloc[i] != null).length;
export const draftComplete = (d: Draft) => !!d.name.trim() && !!d.year && Object.keys(d.alloc).length > 0 && carsFor(d).every((i) => d.alloc[i] != null) && Object.keys(d.alloc).every((i) => decided(d, Number(i)));
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
  const cars = inQuarter(d, q).filter((c) => d.draw?.[c] !== "none");   // คันที่ไม่เบิกอะไหล่ไม่รวมในรายการ (6 พ.ย. 2569)
  return PARTS.map((_, i) => [i, cars.filter((c) => (d.picks[c] || []).includes(i)).reduce((a, c) => a + carQty(d, c, i), 0)] as const).filter(([, n]) => n > 0);
};

/* แผนใหม่จากฟอร์ม (บันทึกและส่งอนุมัติ → รออนุมัติ) */
/* unit = หน่วยงานผู้สร้างแผน (บทบาทที่สร้าง · 6 พ.ย. 2569 กบค. สร้างแผนได้) */
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
/* วันที่แบบไทย dd/mm/ปี พ.ศ. */
export const thaiToday = () => { const t = new Date(); return String(t.getDate()).padStart(2, "0") + "/" + String(t.getMonth() + 1).padStart(2, "0") + "/" + (t.getFullYear() + 543); };
