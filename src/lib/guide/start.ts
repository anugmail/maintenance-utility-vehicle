"use client";
/* เริ่มเคส: ล้างข้อมูลจำลอง → ใส่ข้อมูลตั้งต้นของเคส (ได้ค่าเดิมทุกครั้ง) → ตั้งบทบาท → เก็บเคสและขั้นแรก → คืนหน้าแรกของเคส
   เรียกจากหน้า /scenarios/guide/start/ เท่านั้น (หน้านั้นพาไปหน้าแรกด้วย router.replace ⇒ ฟอร์มที่เปิดค้างถูกสร้างใหม่ ไม่มีค่าค้างในหน้า) */
import { clearToast, resetMock, setRole } from "@/lib/mock/store";
import { hrefOf } from "./match";
import { setGuide } from "./session";
import type { GuideCase } from "./types";

/* from = "menu" เปิดมาจากเมนูพาดูทีละเรื่อง (/guide/) — ส่งต่อหน้าเรื่อง เริ่มเคส แถบพาดู (ออก) ⇒ หน้าเรื่องย้อนกลับไปเมนู */
export const GUIDE_MENU = "/guide/";
const fromQ = (from?: string | null) => (from === "menu" ? "&from=menu" : "");
export const startHref = (caseId: string, from?: string | null) => "/scenarios/guide/start/?case=" + encodeURIComponent(caseId) + fromQ(from);
export const scenarioHref = (key: string, from?: string | null) => "/scenarios/guide/?s=" + encodeURIComponent(key) + fromQ(from);

export function startCase(c: GuideCase, from?: string | null): string {
  resetMock();
  c.seed();
  setRole(c.role);
  clearToast();
  setGuide(from === "menu" ? { case: c.id, step: 0, from: "menu" } : { case: c.id, step: 0 });
  return hrefOf(c.steps[0]);
}
