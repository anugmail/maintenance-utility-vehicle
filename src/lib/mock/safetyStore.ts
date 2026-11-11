/* ที่เก็บผล Safety Inspection ที่อัปโหลดจากหน้า Safety Inspection (S26 · เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 67)
   แยกไฟล์จาก safety.ts เพื่อให้ maintenance.ts (S24) อ่านวันล่าสุดชุดเดียวกันได้โดยไม่ import วนกัน
   MockState.safety[ทะเบียนไม่มีจังหวัด] = ผลทุกครั้งที่บันทึก (เก่าก่อน) · ไม่มีค่า = ยังไม่เคยบันทึกในต้นแบบ (ใช้ค่าตั้งต้นใน safety.ts) */
import type { UploadFile } from "@/components/vms/FileUpload";
import type { PillColor } from "@/components/vms/PillOutline";
import { setMock, type MockState } from "./store";

declare module "./store" {
  interface MockState { safety?: Record<string, SafetyRec[]> }
}

/** ผลการตรวจ 3 ตัวเลือก (เจ้าของงาน "เลือกได้ว่า ผ่าน ไม่ผ่าน ยุบสภาพ") */
export const SAFETY_RESULTS = ["ผ่าน", "ไม่ผ่าน", "ยุบสภาพ"] as const;
export type SafetyResult = 0 | 1 | 2;
/** ป้ายผล (Pill outline) · ยังไม่มีข้อมูล = ยังไม่เคยตรวจ หรือมีเอกสารจากงานบำรุงรักษาแต่ยังไม่บันทึกผล — สีเลือกเอง (BACKLOG ค.) */
export const SAFETY_PILL: [string, PillColor][] = [["ผ่าน", "Success"], ["ไม่ผ่าน", "Error"], ["ยุบสภาพ", "Warning"]];
export const SAFETY_NONE: [string, PillColor] = ["ยังไม่มีข้อมูล", "Gray"];

export interface SafetyRec { date: string; result: SafetyResult; files: UploadFile[]; savedAt: string; savedBy: string }

export const safetyUploads = (m: MockState, carId: string): SafetyRec[] => m.safety?.[carId] ?? [];
/** ครั้งล่าสุดที่บันทึก (วันที่ตรวจใหม่สุด · วันเท่ากัน = ที่บันทึกทีหลัง) */
export function latestUpload(m: MockState, carId: string): SafetyRec | undefined {
  const day = (s: string) => { const [d, mo, y] = s.split("/").map(Number); return (y * 100 + mo) * 100 + d; };
  return safetyUploads(m, carId).reduce<SafetyRec | undefined>((a, r) => (!a || day(r.date) >= day(a.date) ? r : a), undefined);
}
export function saveSafety(carId: string, rec: SafetyRec) {
  setMock((s) => ({ ...s, safety: { ...s.safety, [carId]: [...(s.safety?.[carId] ?? []), rec] } }));
}
