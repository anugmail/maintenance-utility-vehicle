/* ตารางยานพาหนะของแผนเดินทาง ชุดเดียวทุกหน้า (R82 · TRIP_V_COLS / tripVCols / tripVCells ของ screens.js · แบบ QPART_COLS R81)
   เจ้าของงาน 6 พ.ย. 2569 _"ถ้าเพิ่ม คอลัมน์ ก็ส่งผลกระทบกับ หน้าอื่นๆที่เป็นหน้าที่เหมือนกันด้วย ตอน export ก็เกี่ยวข้องด้วย"_
   ชุดหลัก = ทะเบียน · ประเภทยานพาหนะ · ยี่ห้อ/รุ่น · หน่วยงานเจ้าของยานพาหนะ · เบอร์ติดต่อ (เบอร์ / บรรทัดรองชื่อผู้ดูแลยานพาหนะ) · สถานที่บำรุงรักษา · วันดำเนินการ
   9 พ.ย. 2569 เจ้าของงาน _"E4 ตรงติดต่อ อยากให้ เพิ่มชื่อผู้ดูแลรถ ตรงด้านล่างเบอร์โทร ด้วย และอยากให้แก้จุดที่เกี่ยวข้องด้วย"_ (tripPhoneCell · Figma c28dd82 · R79 R82) — เดิม 6 พ.ย. หัว "ผู้ดูแลยานพาหนะ" ชื่อบน เบอร์ล่าง
   ใช้ที่ ฟอร์มแผนเดินทาง S6 S9 (+ ไอคอนแก้ไข ลบ) · ตรวจสอบแผนเดินทาง S7 · แผนเดินทางดูอย่างเดียว S8 (ชุดหลัก 7 คอลัมน์)
   · รายละเอียดแผนเดินทาง S10 S12 (unitSub: หน่วยงานเป็นบรรทัดรองของทะเบียน + สถานะงาน + ปุ่ม … เพราะ Table ของไลบรารี 8 คอลัมน์)
   · หน้าไตรมาส (drop สถานที่บำรุงรักษา + คอลัมน์แผนเดินทาง) · ไฟล์ PDF และ Excel ที่ส่งออก
   เพิ่ม ลด หรือเปลี่ยนชื่อคอลัมน์ที่นี่ที่เดียว · ช่องของแต่ละคอลัมน์อยู่ใน tripVCells (จับคู่ด้วยชื่อหัวคอลัมน์)
   component Table (Table header cell + Table cell Lead text/Text) ของไฟล์ Component · ประเภทยานพาหนะต่อจากทะเบียน แบบ Vehicle list หน้า 5.2 Vehicle Management ของ UI Release#2 */
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { typeOf } from "./data";

export const UNIT_COL = "หน่วยงานเจ้าของยานพาหนะ";
export const TRIP_V_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 150, Style: "Lead text" }, { head: "ประเภทยานพาหนะ", width: 120 }, { head: "ยี่ห้อ/รุ่น" }, { head: UNIT_COL, width: 140 },
  { head: "เบอร์ติดต่อ", width: 160 }, { head: "สถานที่บำรุงรักษา", width: 190 }, { head: "วันดำเนินการ", width: 180 },
];
export interface TripVOpts { drop?: string[]; unitSub?: boolean }
export const tripVCols = (o: TripVOpts = {}): TableColumn[] =>
  TRIP_V_COLS.filter((c) => !(o.drop ?? []).includes(c.head) && !(o.unitSub && c.head === UNIT_COL));

/** ยานพาหนะ 1 คัน (TripCar ของ trips.ts หรือ jobs.ts) */
export interface VCar { id: string; plate: string; model: string; owner: string; ctrl: string; phone: string }
/** ใบแผนเดินทาง หรือค่าในฟอร์ม · ไม่มี d1 (ฟอร์มยังไม่เลือกช่วงวัน / หน้าไตรมาสคันที่ยังไม่อยู่ในใบ) = วันดำเนินการ "—" · hire = แผนจ้าง (ช่วงวันทำงาน) */
export interface VTrip { d1?: string; d2?: string; works?: Record<string, [string, string]>; locs?: Record<string, string>; phones?: Record<string, string>; names?: Record<string, string>; hire?: boolean }

/* วันดำเนินการรายคัน (tripWork · tripWorkCell · R83) — ค่าเริ่มต้นทั้งช่วงวันเดินทาง (แผนจ้าง = ช่วงวันทำงาน) · แก้ใน popup ไอคอนแก้ไข
   ตาราง "03/11/2569 – 04/11/2569" บรรทัดรอง "ค่าเริ่มต้น ช่วงวันเดินทาง" / "แก้จากช่วงวันเดินทาง" */
export const rangeName = (t: VTrip) => (t.hire ? "ช่วงวันทำงาน" : "ช่วงวันเดินทาง");
export const workOf = (t: VTrip, id: string): [string, string] => t.works?.[id] ?? [t.d1 ?? "", t.d2 ?? ""];
export const tripWork = (t: VTrip, id: string) => { const w = workOf(t, id); return w[0] + " – " + w[1]; };
export const workCell = (t: VTrip, id: string): TableValue => (t.d1 && t.d2 ? { text: tripWork(t, id), sub: (t.works?.[id] ? "แก้จาก" : "ค่าเริ่มต้น ") + rangeName(t) } : "—");

export function tripVCells(c: VCar, t: VTrip, o: TripVOpts = {}): TableValue[] {
  const loc = t.locs?.[c.id];
  const cell: Record<string, TableValue> = {
    "ทะเบียน": o.unitSub ? { text: c.plate, sub: c.owner } : c.plate,
    "ประเภทยานพาหนะ": typeOf(c.model),
    "ยี่ห้อ/รุ่น": c.model,
    [UNIT_COL]: c.owner,
    "เบอร์ติดต่อ": { text: t.phones?.[c.id] || c.phone || "-", sub: t.names?.[c.id] || c.ctrl || "-" },
    "สถานที่บำรุงรักษา": { text: loc || "สำนักงาน " + c.owner, sub: loc ? "แก้จากสำนักงานเจ้าของยานพาหนะ" : "ค่าเริ่มต้น สำนักงานที่ยานพาหนะอยู่" },
    "วันดำเนินการ": workCell(t, c.id),
  };
  return tripVCols(o).map((col) => cell[col.head]);
}
