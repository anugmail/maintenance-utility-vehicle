/* วันที่บำรุงรักษาเครื่องจักรล่าสุด · ซ่อมเครื่องจักรล่าสุด (เจ้าของงาน 11 พ.ย. 2569 _"เพิ่มตอนเลือกรถเข้าแผน เพิ่มคอลัมน์ วันที่บำรุงล่าสุดเมื่อไร และอยากเพิ่ม วันที่ซ่อมล่าสุดด้วย
   ตอนเลือกรถเข้าแผน และตอนเลือกเข้าแผนการเดินทาง"_ · BACKLOG ข้อ 64) — ค่าสมมติ ใช้ที่ตารางเลือกยานพาหนะของฟอร์มแผน (S1 S19) · popup เพิ่มยานพาหนะ (TripCarPicker)
   แก้คำ 11 พ.ย. 2569 (เจ้าของงาน "วันที่บำรุงเครื่องจักรล่าสุดเมื่อไร … วันที่ซ่อมเครื่องจักรล่าสุด") — เป็นวันของเครื่องจักร (กระเช้า · ถังฉีดน้ำ) ไม่ใช่แชสซี
     บำรุงรักษาเครื่องจักร = งานบำรุงรักษาตามวาระที่ปิดล่าสุด (flow นี้ · ค่าของ S24) · ซ่อมเครื่องจักร = ค่าสมมติ ข้อมูลจำลองแยกซ่อมเครื่องจักรกับซ่อมแชสซีไม่ได้
     (MA_REPAIRS ของ S24 รวมทุกงานซ่อม) ⇒ ของจริงต้องอ่านจากประวัติซ่อมของเครื่องจักรเท่านั้น (BACKLOG ข้อ 64 ค.)
   คันที่มีในข้อมูลแดชบอร์ด S24 (MA_ROWS · MA_REPAIRS ของ maintenance.ts) ใช้วันเดียวกัน (ยกค่ามาไว้ที่นี่ ไม่ import ไฟล์ S24 เพราะต้องอ่าน MockState)
   คันอื่นใน CAND = วันที่ตามลำดับใน CAND (คำนวณจากลำดับ ⇒ เพิ่มยานพาหนะต่อท้าย CAND ลำดับเดิมไม่เลื่อน) · ทุก 9 คันไม่มีประวัติบำรุงรักษา · ทุก 5 คันไม่มีประวัติซ่อม
   ไม่มีข้อมูล = "ไม่มีข้อมูล" (แบบ LAST_OIL เปลี่ยนน้ำมันครั้งล่าสุด) */
import { useMemo } from "react";
import { CAND } from "./data";
import { jobsOf } from "./jobs";
import { useMock, type MockState } from "./store";

export const NO_HIST = "ไม่มีข้อมูล";
const id = (plate: string) => plate.split(" ")[0];
const pad = (n: number) => String(n).padStart(2, "0");
/* ค่าของ S24 (MA_ROWS วันบำรุงรักษาล่าสุด · MA_REPAIRS วันซ่อมเสร็จล่าสุดที่ไม่ใช่บำรุงรักษาตามวาระ — 82-1145 RP-2569-0611 เปลี่ยนปั๊มไฮดรอลิก = งานของเครื่องจักร) — 81-2210 82-6789 ยังไม่มีบันทึกในค่าตั้งต้นของ S24 */
const MA_LAST: Record<string, string> = {
  "80-4458": "01/10/2568", "80-5738": "14/10/2568", "80-3316": "20/11/2568", "80-9981": "10/01/2569", "82-7720": "02/02/2569", "82-1145": "18/06/2569", "81-6604": "20/09/2569",
  "81-2210": NO_HIST, "82-6789": NO_HIST,
};
const REPAIR_LAST: Record<string, string> = { "82-1145": "02/09/2569" };
/* ลำดับใน CAND → วันที่ (ก่อนวันนี้ของต้นแบบ 10/11/2569) */
const date = (d: number, m: number, y: number) => pad(d) + "/" + pad(y === 2569 && m > 10 ? m - 6 : m) + "/" + y;   // ปี 2569 ไม่เกิน ต.ค. (ก่อนวันนี้ของต้นแบบ)
const maOf = (i: number) => (i % 9 === 4 ? NO_HIST : date(1 + ((i * 11) % 28), 1 + ((i * 7) % 12), 2567 + (i % 3)));
const repairOf = (i: number) => (i % 5 === 2 ? NO_HIST : date(1 + ((i * 13) % 28), 1 + ((i * 5) % 12), 2566 + (i % 4)));

/** ตามลำดับ CAND (ชุดเดียวกับ LAST_OIL) */
export const LAST_MA: string[] = CAND.map((c, i) => MA_LAST[id(c.plate)] ?? maOf(i));
export const LAST_REPAIR: string[] = CAND.map((c, i) => REPAIR_LAST[id(c.plate)] ?? repairOf(i));
const byId = new Map(CAND.map((c, i) => [id(c.plate), i]));
/** ตามทะเบียน (มีหรือไม่มีจังหวัดก็ได้) — ยานพาหนะตัวอย่างที่ไม่อยู่ใน CAND (TRIP_CARS บางคัน) ใช้ค่าของ S24 ถ้ามี · ไม่มี = "ไม่มีข้อมูล" */
export const lastMaOf = (plate: string) => { const i = byId.get(id(plate)); return i != null ? LAST_MA[i] : MA_LAST[id(plate)] ?? NO_HIST; };
export const lastRepairOf = (plate: string) => { const i = byId.get(id(plate)); return i != null ? LAST_REPAIR[i] : REPAIR_LAST[id(plate)] ?? NO_HIST; };
/* วันที่รวมงานที่ปิดในต้นแบบ (11 พ.ย. 2569 · ตรงกับแท็บประวัติ S24 machineHistoryOf ของ maintenance.ts): บำรุงรักษาเครื่องจักรล่าสุด = ใหม่กว่าระหว่างค่าตั้งต้นข้างบน
   กับงานรายคันที่ปิดงานเสร็จสิ้นแล้ว (status done + closedAt · ไม่นับ "บำรุงรักษาไม่ได้" และงานผู้รับจ้างที่ยังรอตรวจ) · ซ่อมเครื่องจักร = ค่าตั้งต้น (ต้นแบบไม่มีงานซ่อมที่ปิดได้) */
const dayOf = (s: string) => { const [d, m, y] = s.slice(0, 10).split("/").map(Number); return Date.UTC(y - 543, m - 1, d); };
const isDate = (s?: string): s is string => !!s && /^\d{2}\/\d{2}\/\d{4}/.test(s);
export interface MachineDates { ma: string; repair: string }
export function machineDates(m: MockState): (plate: string) => MachineDates {
  const closed = new Map<string, string>();
  Object.values(jobsOf(m).jobs).forEach((j) => {
    if (j.status !== "done" || !j.closedAt) return;
    const d = j.closedAt.slice(0, 10), cur = closed.get(j.carId);
    if (isDate(d) && (!cur || dayOf(d) > dayOf(cur))) closed.set(j.carId, d);
  });
  return (plate) => {
    const base = lastMaOf(plate), job = closed.get(id(plate));
    return { ma: job && (!isDate(base) || dayOf(job) > dayOf(base)) ? job : base, repair: lastRepairOf(plate) };
  };
}
export function useMachineDates() { const m = useMock(); return useMemo(() => machineDates(m), [m]); }
/** บรรทัดรองบนมือถือ / popup ที่แคบ */
export const histText = (d: MachineDates) => "บำรุงรักษาเครื่องจักรล่าสุด " + d.ma + " · ซ่อมเครื่องจักรล่าสุด " + d.repair;
/** หัวคอลัมน์ (ใช้ร่วมฟอร์มแผน · popup เพิ่มยานพาหนะ) */
export const MA_HEAD = "บำรุงรักษาเครื่องจักรล่าสุด", REPAIR_HEAD = "ซ่อมเครื่องจักรล่าสุด";
