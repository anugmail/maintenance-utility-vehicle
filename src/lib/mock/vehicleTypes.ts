/* ตารางอ้างอิงรหัสข้างรถ (รหัสประเภทยานพาหนะ · ส่วนกลางของรหัสยานพาหนะ vehicle_pea_id เช่น "น.3-09-2985") — จำลอง vms_ref_pea_official_vehicle_type (code int · name varchar)
   เจ้าของงาน 11 พ.ย. 2569 _"กลุ่มรหัสข้างรถ เลข 04, 07, 08, 09, 10 จะสามารถเพิ่มเครื่องมือกลได้ ถ้ามีข้อมูลต้องสามารถแก้ไขได้ อยากให้แสดงเป็น table reference"_
     = เก็บกติกาเป็นตารางอ้างอิงในข้อมูล (ไม่ฝังในหน้าจอ · ไม่แสดงให้ผู้ใช้) · หน้ารายละเอียดยานพาหนะอ่าน hasEquipment จากตารางนี้ (BACKLOG ข้อ 68ก)
   ฐานข้อมูลจริงยังไม่มีธงนี้ ⇒ ต้องเพิ่มคอลัมน์ในตาราง ref (เช่น has_equipment) หรือทำตาราง ref แยก — BACKLOG ค.
   name = "ประเภท 0x" (ชื่อจริงในตาราง ref ยังไม่มีในเครื่อง · ไม่ตั้งชื่อเอง) */
import type { Car } from "./data";

export interface RefVehicleType { code: string; name: string; hasEquipment: boolean }
export const REF_VEHICLE_TYPE: RefVehicleType[] = [
  { code: "04", name: "ประเภท 04", hasEquipment: true },
  { code: "06", name: "ประเภท 06", hasEquipment: false },
  { code: "07", name: "ประเภท 07", hasEquipment: true },
  { code: "08", name: "ประเภท 08", hasEquipment: true },
  { code: "09", name: "ประเภท 09", hasEquipment: true },
  { code: "10", name: "ประเภท 10", hasEquipment: true },
];
const BY_CODE = new Map(REF_VEHICLE_TYPE.map((r) => [r.code, r]));
export const refTypeOf = (code: string) => BY_CODE.get(code);
/** รหัสข้างรถนี้เพิ่ม/แก้เครื่องมือกลได้ไหม (อ่านจากตาราง ref · รหัสที่ไม่มีในตาราง = ไม่ได้) */
export const hasEquipment = (code: string) => !!BY_CODE.get(code)?.hasEquipment;

/* รหัสข้างรถของยานพาหนะจำลอง (สมมติ · รอเทียบตาราง ref จริง):
     กระเช้า (SAFETY_TYPES) = 09 · รถพ่วงฉีดน้ำ = 06
     กระเช้าจำลองที่สร้างเพิ่ม (ทะเบียนขึ้นต้น 6 7 9) บางคันกระจายไป 04 07 08 10 ให้ทุกรหัสในกลุ่มมีคัน (ออกจากรายการ ปจ.2 ที่แสดงเฉพาะ 09)
     ยานพาหนะของแดชบอร์ด S24: 81-2210 = 04 (ในกลุ่ม ยังไม่มีเครื่องมือกล) · 80-4458 = 06 (นอกกลุ่ม · ทะเบียนเครื่องมือกลเดิมมีกระเช้าฮอทไลน์รหัส 06) · คันอื่นคง 09 */
const OVERRIDE: Record<string, string> = { "81-2210": "04", "80-4458": "06" };
const SPREAD = ["04", "07", "08", "10"];
const BOOM = /กระเช้า/;
export function sideCodeOf(c: Pick<Car, "plate" | "model">): string {
  const id = c.plate.split(" ")[0];
  if (OVERRIDE[id]) return OVERRIDE[id];
  if (!BOOM.test(c.model)) return "06";
  if (/^[679]/.test(id)) { const n = Number(id.replace(/\D/g, "")); if (n % 9 === 0) return SPREAD[Math.floor(n / 9) % 4]; }
  return "09";
}
