import type { UploadFile } from "@/components/vms/FileUpload";
import type { PillColor } from "@/components/vms/PillOutline";
import { setMock, type MockState } from "./store";

declare module "./store" {
  interface MockState { safety?: Record<string, SafetyRec[]> }
}

export const SAFETY_RESULTS = ["ผ่าน", "ไม่ผ่าน", "ระงับ"] as const;
export type SafetyResult = 0 | 1 | 2;
export const SAFETY_PILL: [string, PillColor][] = [["ผ่าน", "Success"], ["ไม่ผ่าน", "Error"], ["ระงับ", "Warning"]];
export const SAFETY_NONE: [string, PillColor] = ["ยังไม่มีข้อมูล", "Gray"];

export const SAFETY_CYCLES = [3, 6, 12] as const;
export type SafetyCycle = (typeof SAFETY_CYCLES)[number];
export const cycleText = (n: number) => n + " เดือน";
export interface SafetyRec { date: string; result: SafetyResult; cycle?: SafetyCycle; files: UploadFile[]; savedAt: string; savedBy: string }

export const safetyUploads = (m: MockState, carId: string): SafetyRec[] => m.safety?.[carId] ?? [];
export function latestUpload(m: MockState, carId: string): SafetyRec | undefined {
  const day = (s: string) => { const [d, mo, y] = s.split("/").map(Number); return (y * 100 + mo) * 100 + d; };
  return safetyUploads(m, carId).reduce<SafetyRec | undefined>((a, r) => (!a || day(r.date) >= day(a.date) ? r : a), undefined);
}
export function saveSafety(carId: string, rec: SafetyRec) {
  setMock((s) => ({ ...s, safety: { ...s.safety, [carId]: [...(s.safety?.[carId] ?? []), rec] } }));
}
