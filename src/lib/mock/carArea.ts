/* ภาค เขต ประเภทยานพาหนะของแต่ละคัน — ตัวกรองใน popup เลือกยานพาหนะ (TripCarPicker areaOf · BACKLOG ข้อ 87 89)
   ใช้ทุก popup ที่เรียก TripCarPicker: ฟอร์มแผน S1 S19 (id = ลำดับใน CAND) · หน้าไตรมาส S6 · ฟอร์มแผนเดินทาง S6 S9 (id = ทะเบียนไม่มีจังหวัด candId)
   ⇒ จับคู่ด้วยทะเบียนเต็ม (plate) ที่ทุกชุดมีเหมือนกัน · ทะเบียนใน CAND ไม่ซ้ำกัน และยานพาหนะตัวอย่างของ trips.ts อยู่ใน CAND ครบ (CAND_FIG) */
import { CAND, dCode, regionOf } from "./data";

export interface PickerArea { region: string; district: string; type: string }
const NONE: PickerArea = { region: "", district: "", type: "" };
const BY_PLATE = new Map(CAND.map((c): [string, PickerArea] => [c.plate, { region: regionOf(c), district: dCode(c), type: c.type }]));

/** ภาค เขต ประเภทยานพาหนะจากทะเบียนเต็ม (TripCar.plate) */
export const carArea = (c: { plate: string }): PickerArea => BY_PLATE.get(c.plate) ?? NONE;
