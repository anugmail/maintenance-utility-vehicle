/* ตัวช่วยของแผน — ยกจาก screens.js (qCell · whCell · planRow · quarterParts) + เลขที่ MR ตามเงื่อนไข S1 */
import { CAND, CAR_QTY, PARTS, PST, WH_ACK, dCode, type Plan } from "./data";
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
  q: number;                          // แท็บไตรมาสที่เปิด
}
export const emptyDraft = (): Draft => ({ name: "", year: "", regions: [], districts: [], types: [], alloc: {}, picks: {}, q: 1 });
export const isDirty = (d: Draft) => !!(d.name || d.year || d.regions.length || d.districts.length || d.types.length || Object.keys(d.alloc).length);

/* qCell — 4 ไตรมาสยาวเกินคอลัมน์ ⇒ 2 บรรทัด */
export const qCell = (t: string) => { const q = t.split(" · "); return { text: q.slice(0, 2).join(" · "), sub: q.slice(2).join(" · ") }; };
export const qWithCars = (p: Plan) => (p.perQ.match(/: (\d+)/g) || []).filter((x) => Number(x.slice(2)) > 0).length;
/* whCell — คลังรับทราบ: ก่อนอนุมัติ "-" · หลังอนุมัติ x/n ไตรมาส */
export const whCell = (p: Plan) => p.status === "review" || p.status === "returned" ? "-" : (p.status === "closed" ? qWithCars(p) : WH_ACK[p.mr] || 0) + "/" + qWithCars(p) + " ไตรมาส";

export const PLAN_COLS = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text" as const, SortIcon: "Down" as const },
  { head: "ชื่อแผน", Style: "Text" as const, SortIcon: "Swap" as const },
  { head: "ภาค", width: 200 },
  { head: "จำนวนรถ", width: 100 },
  { head: "รถรายไตรมาส", width: 210 },
  { head: "คลังรับทราบ", width: 130 },
  { head: "สถานะ", width: 150, Style: "Badge" as const, SortIcon: "Swap" as const },
  { head: "", width: 60, Style: "Action icons" as const },
];
export const planRow = (p: Plan, menu: TableValue): TableValue[] =>
  [p.mr, { text: p.name, sub: "ปีงบประมาณ " + p.year }, p.region, String(p.cars), qCell(p.perQ), whCell(p), { pills: [PST[p.status]] }, menu];

/* เมนู "…" ตามสถานะแผน (S19 S20): ก่อนอนุมัติ ดูรายละเอียด แก้ไข ลบ · อนุมัติแล้ว ดูรายละเอียด แก้ไข · ดำเนินการแล้ว ดูรายละเอียดอย่างเดียว */
export const menuCount = (p: Plan) => (p.status === "review" || p.status === "returned" ? 3 : p.status === "approved" ? 2 : 1);

/* เลขที่ MR: "MR Z" + ปีที่เลือก 2 หลัก + ลำดับ 5 หลักนับต่อในปีนั้น */
export function nextMr(plans: Plan[], year: string) {
  const yy = year.slice(-2), pre = "MR Z" + yy;
  const n = plans.filter((p) => p.mr.startsWith(pre)).map((p) => Number(p.mr.slice(pre.length)) || 0);
  return pre + String((n.length ? Math.max(...n) : 0) + 1).padStart(5, "0");
}

/* รถที่ตรงเขตและประเภทรถที่เลือก */
export const carsFor = (d: Draft) => CAND.map((c, i) => [c, i] as const).filter(([c]) => d.districts.includes(dCode(c)) && d.types.includes(c.type));
export const inQuarter = (d: Draft, q = d.q) => Object.keys(d.alloc).map(Number).filter((i) => d.alloc[i] === q);
/* quarterParts — อะไหล่ในไตรมาส = รวมจากรถของไตรมาสนั้น [ลำดับอะไหล่, จำนวน] */
export const quarterParts = (d: Draft, q = d.q) => {
  const cars = inQuarter(d, q);
  return PARTS.map((_, i) => [i, CAR_QTY[i] * cars.filter((c) => (d.picks[c] || []).includes(i)).length] as const).filter(([, n]) => n > 0);
};

/* แผนใหม่จากฟอร์ม (บันทึกและส่งอนุมัติ → รออนุมัติ) */
export function planFromDraft(d: Draft, plans: Plan[], today: string): Plan {
  const per = [1, 2, 3, 4].map((q) => inQuarter(d, q).length);
  return {
    mr: nextMr(plans, d.year), name: d.name.trim(), region: d.regions.join(", "), nowQ: "ไตรมาส 1", cars: Object.keys(d.alloc).length,
    status: "review", created: today, type: d.types.join(", "), year: d.year,
    perQ: per.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · "),
    regions: d.regions, districts: d.districts, types: d.types, alloc: d.alloc, picks: d.picks,
  };
}
/* วันที่แบบไทย dd/mm/ปี พ.ศ. */
export const thaiToday = () => { const t = new Date(); return String(t.getDate()).padStart(2, "0") + "/" + String(t.getMonth() + 1).padStart(2, "0") + "/" + (t.getFullYear() + 543); };
