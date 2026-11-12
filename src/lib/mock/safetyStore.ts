/* ที่เก็บผล Safety Inspection ที่เพิ่มจาก popup ของหน้ารายการ Safety Inspection (S26 · เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 67)
   แยกไฟล์จาก safety.ts เพื่อให้ maintenance.ts (S24) อ่านวันล่าสุดชุดเดียวกันได้โดยไม่ import วนกัน
   MockState.safety[ทะเบียนไม่มีจังหวัด] = ผลทุกครั้งที่บันทึก (เก่าก่อน) · ไม่มีค่า = ยังไม่เคยบันทึกในต้นแบบ (ใช้ค่าตั้งต้นใน safety.ts) */
import type { UploadFile } from "@/components/vms/FileUpload";
import type { PillColor } from "@/components/vms/PillOutline";
import { setMock, type MockState } from "./store";

declare module "./store" {
  interface MockState { safety?: Record<string, SafetyRec[]> }
}

/** ผลการตรวจ 3 ตัวเลือก — เจ้าของงาน 12 พ.ย. 2569 เลือกตามไฟล์สรุปประชุม VMS Plus (Notion "meeting 11/11/68" หัวข้อ 9) "ผ่าน ไม่ผ่าน ระงับ" (BACKLOG ข้อ 69)
    ข้อบกพร่องเล็กน้อยที่ผู้ตรวจยอมให้ = ผ่าน ⇒ เอา "ให้แก้ไข" ออก (เพิ่มรอบ 4 11 พ.ย. 2569) · ไม่มีช่องหมายเหตุ (เจ้าของงานไม่เอา)
    เก็บเป็นลำดับ 0 ผ่าน · 1 ไม่ผ่าน · 2 ระงับ · ข้อมูลที่บันทึกไว้เดิมลำดับ 3 ล้างด้วยการขึ้นรุ่น MOCK_V */
export const SAFETY_RESULTS = ["ผ่าน", "ไม่ผ่าน", "ระงับ"] as const;
export type SafetyResult = 0 | 1 | 2;
/** ป้ายผล (Pill outline): ผ่าน Success · ไม่ผ่าน Error · ระงับ Warning · ยังไม่มีข้อมูล Gray (เลือกเอง — BACKLOG ค.) */
export const SAFETY_PILL: [string, PillColor][] = [["ผ่าน", "Success"], ["ไม่ผ่าน", "Error"], ["ระงับ", "Warning"]];
export const SAFETY_NONE: [string, PillColor] = ["ยังไม่มีข้อมูล", "Gray"];

/** วาระการตรวจ (เดือน) — เจ้าของงาน 11 พ.ย. 2569 "เพิ่มวาระในหน้า upload เอกสาร การตรวจ 3 เดือน 6 เดือน และ 12 เดือน และเอาไปแสดงนับถอยหลังให้ในหน้า list ด้วย" (ข้อ 67จ) */
export const SAFETY_CYCLES = [3, 6, 12] as const;
export type SafetyCycle = (typeof SAFETY_CYCLES)[number];
export const cycleText = (n: number) => n + " เดือน";
/** cycle ไม่มี (บันทึกก่อนข้อ 67จ) = 12 เดือน */
export interface SafetyRec { date: string; result: SafetyResult; cycle?: SafetyCycle; files: UploadFile[]; savedAt: string; savedBy: string }

export const safetyUploads = (m: MockState, carId: string): SafetyRec[] => m.safety?.[carId] ?? [];
/** ครั้งล่าสุดที่บันทึก (วันที่ตรวจใหม่สุด · วันเท่ากัน = ที่บันทึกทีหลัง) */
export function latestUpload(m: MockState, carId: string): SafetyRec | undefined {
  const day = (s: string) => { const [d, mo, y] = s.split("/").map(Number); return (y * 100 + mo) * 100 + d; };
  return safetyUploads(m, carId).reduce<SafetyRec | undefined>((a, r) => (!a || day(r.date) >= day(a.date) ? r : a), undefined);
}
export function saveSafety(carId: string, rec: SafetyRec) {
  setMock((s) => ({ ...s, safety: { ...s.safety, [carId]: [...(s.safety?.[carId] ?? []), rec] } }));
}
