"use client";
/* เริ่มเคส: ล้างข้อมูลจำลอง → ใส่ข้อมูลตั้งต้นของเคส (ได้ค่าเดิมทุกครั้ง) → ตั้งบทบาท → เก็บเคสและขั้นแรก → คืนหน้าแรกของเคส
   เรียกจากหน้า /scenarios/guide/start/ เท่านั้น (หน้านั้นพาไปหน้าแรกด้วย router.replace ⇒ ฟอร์มที่เปิดค้างถูกสร้างใหม่ ไม่มีค่าค้างในหน้า) */
import { clearToast, resetMock, setRole } from "@/lib/mock/store";
import { hrefOf } from "./match";
import { setGuide } from "./session";
import type { GuideCase } from "./types";

export const startHref = (caseId: string) => "/scenarios/guide/start/?case=" + encodeURIComponent(caseId);
export const scenarioHref = (key: string) => "/scenarios/guide/?s=" + encodeURIComponent(key);

export function startCase(c: GuideCase): string {
  resetMock();
  c.seed();
  setRole(c.role);
  clearToast();
  setGuide({ case: c.id, step: 0 });
  return hrefOf(c.steps[0]);
}
