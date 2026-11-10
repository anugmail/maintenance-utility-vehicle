"use client";
/* S18 ต้นทุนการบำรุงรักษา (R92 · Figma c450480 · ไฟล์ 14 Scenario 18 · เจ้าของงานเคาะ 10 พ.ย. 2569) — คำนวณจากงานรายคันจริง (jobs.ts) ของแผน
   นับเฉพาะแผนเดินทางที่หน่วยงานดำเนินการเอง (mode self · แผนจ้างไม่แสดง) · คันที่ "เสร็จสิ้น" = ต้นทุนรายคัน · "บำรุงรักษาไม่ได้" = แยกหัวข้อ
   ค่าอะไหล่ = ราคาต่อหน่วย × จำนวนที่ใช้จริงตอนปิดงาน (ไม่รวมที่คืน · รวมอะไหล่ที่เพิ่มหน้างาน) · บำรุงรักษาไม่ได้ = จำนวนที่ใช้ไปแล้วจาก popup บำรุงรักษาไม่ได้
   ค่าเบี้ยเลี้ยง ค่าที่พัก ค่าเดินทาง ศูนย์ต้นทุน = ที่กรอกรายคันตอนปิดงาน S10 · ค่าชั่วโมงทำงาน = ชั่วโมง × อัตรา (ไม่กรอก = "-")
   เฉลี่ยต่อคัน = ต้นทุนรวม ÷ ยานพาหนะที่มีต้นทุน (รวมคันที่บำรุงรักษาไม่ได้ · เสนอ) · เงินแสดง "63,560 บาท" */
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { QUARTERS, type Plan } from "./data";
import { carOf, closeRows, costSummary, getJob, jobsOf, nf, num, ownerCostCenter } from "./jobs";
import type { MockState } from "./store";

export interface CarCost {
  carId: string; plate: string; q: number; date: string; cannot: boolean; cc: string;
  parts: number; perDiem: number; hours: number; rate: number; labour: number; lodging: number; travel: number; total: number;
}
export function planCosts(m: MockState, plan: Plan): CarCost[] {
  const s = jobsOf(m), id = plan.mr.replace(/^MR/, "");
  return Object.values(s.trips).filter((t) => t.planId === id && t.mode === "self").flatMap((t) => t.carIds.flatMap((carId): CarCost[] => {
    const car = carOf(carId), j = getJob(s, t.id, carId);
    if (!car) return [];
    const base = { carId, plate: car.plate, q: t.q };
    if (j.status === "cannot" && j.cannot) {
      const parts = j.parts.reduce((a, p, k) => a + p.unitPrice * (j.cannot!.used[k] ?? 0), 0);
      return [{ ...base, date: j.cannot.at.slice(0, 10), cannot: true, cc: ownerCostCenter(car), parts, perDiem: 0, hours: 0, rate: 0, labour: 0, lodging: 0, travel: 0, total: parts }];
    }
    if (j.status !== "done" || !j.close) return [];
    const f = j.close, sum = costSummary(f);
    const parts = closeRows(f).reduce((a, r) => a + r.unitPrice * r.used, 0);
    return [{ ...base, date: (j.closedAt ?? "").slice(0, 10), cannot: false, cc: f.costCenter ?? ownerCostCenter(car), parts, perDiem: sum.perDiem,
      hours: num(f.workHours), rate: num(f.workRate), labour: sum.labour, lodging: sum.lodging, travel: sum.travel, total: parts + sum.total }];
  }));
}

export const baht = (n: number) => nf(n) + " บาท";
export const COST_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 210, Style: "Lead text" }, { head: "ศูนย์ต้นทุน" }, { head: "ค่าอะไหล่", width: 110 }, { head: "ค่าเบี้ยเลี้ยง", width: 120 },
  { head: "ค่าชั่วโมงทำงาน", width: 150 }, { head: "ค่าที่พัก", width: 110 }, { head: "ค่าเดินทาง", width: 110 }, { head: "รวม (บาท)", width: 120 },
];
export const QCOST_COLS: TableColumn[] = [
  { head: "ไตรมาส", Style: "Lead text" }, { head: "ยานพาหนะ (คัน)", width: 160 }, { head: "ค่าอะไหล่", width: 110 }, { head: "ค่าเบี้ยเลี้ยง", width: 120 },
  { head: "ค่าชั่วโมงทำงาน", width: 150 }, { head: "ค่าที่พัก", width: 110 }, { head: "ค่าเดินทาง", width: 110 }, { head: "รวม (บาท)", width: 120 },
];
/** แถวต้นทุนรายคัน (costRow ของ screens.js) */
export const costRow = (r: CarCost): TableValue[] => {
  const [code, ...unit] = r.cc.split(" ");
  return [{ text: r.plate, sub: "ไตรมาส " + r.q + " · " + (r.cannot ? "บำรุงรักษาไม่ได้" : "ปิดงาน " + r.date) }, { text: code, sub: unit.join(" ") }, nf(r.parts), nf(r.perDiem),
    r.hours ? { text: nf(r.labour), sub: nf(r.hours) + " ชม. × " + nf(r.rate) + " บาท" } : "-", nf(r.lodging), nf(r.travel), nf(r.total)];
};
const sums = (rs: CarCost[]) => [rs.reduce((a, r) => a + r.parts, 0), rs.reduce((a, r) => a + r.perDiem, 0), rs.reduce((a, r) => a + r.labour, 0),
  rs.reduce((a, r) => a + r.lodging, 0), rs.reduce((a, r) => a + r.travel, 0), rs.reduce((a, r) => a + r.total, 0)];
/** สรุปรายไตรมาส (QCOST_ROWS): ไตรมาส 1–4 + รวมทั้งแผน · ยานพาหนะ (คัน) = คันที่มีต้นทุน */
export const quarterCostRows = (rs: CarCost[]): TableValue[][] => [
  ...QUARTERS.map((q, k) => { const x = rs.filter((r) => r.q === k + 1); return [q, String(x.length), ...sums(x).map(nf)]; }),
  ["รวมทั้งแผน", String(rs.length), ...sums(rs).map(nf)],
];
/** การ์ดตัวเลข 4 ใบ (costMetrics) */
export function costMetrics(rs: CarCost[], planCars: number): [string, string, "Brand" | "Success" | "Warning"][] {
  const tot = rs.reduce((a, r) => a + r.total, 0);
  return [["ต้นทุนรวมของแผน", baht(tot), "Brand"], ["เฉลี่ยต่อคัน", baht(rs.length ? Math.round(tot / rs.length) : 0), "Brand"],
    ["ยานพาหนะที่ปิดงานแล้ว", rs.filter((r) => !r.cannot).length + "/" + planCars + " คัน", "Success"], ["บำรุงรักษาไม่ได้", rs.filter((r) => r.cannot).length + " คัน", "Warning"]];
}
