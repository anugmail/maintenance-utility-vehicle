/* โหมดพาดูทีละเรื่อง (ของต้นแบบเท่านั้น · ไม่ใช่ฟีเจอร์ของระบบ) — เจ้าของงาน 5 พ.ย. 2569
   _"อยากให้ ตอนที่ไป cf ลูกค้า เข้าใจเหมือนกับที่เราทำไป ไม่อยากให้เล่นไปเรื่อย ประมาณว่าตอนนี้จะให้ cf scen a เป็นแบบนี้ เขาก็เล่นได้"_
   1 เรื่อง (GuideScenario) = 1 scenario ของ userflow · 1 เคส (GuideCase) = ชุดสถานะของจอ Figma (SCENARIOS ใน screens.js) ที่เดินต่อกันได้
   ข้อความทุกช่องที่ลูกค้าเห็น (title who about name text mobile) เป็นภาษาคนพูด ไม่มีรหัส (S1 A.7 Q UC R) ไม่มีคำว่า Figma userflow บอร์ด ไม่มีอีโมจิ ลูกศร และ "·" */
import type { Role } from "@/lib/mock/store";

export interface GuideStep {
  /** สิ่งที่ให้ทำ/ดูในขั้นนี้ (คำสั่งอย่างเดียว ลูกค้ากด UI จริงเอง) */
  text: string;
  /** ข้อความแทนบนมือถือ (เมื่อปุ่มหรือตำแหน่งต่างจาก desktop) */
  mobile?: string;
  /** หน้าที่ขั้นนี้เกิดขึ้น — path + query · ค่า "*" = มีพารามิเตอร์นี้ ค่าอะไรก็ได้ · พารามิเตอร์อื่นใน URL จริงไม่สนใจ */
  at: string;
  /** หน้าที่ปุ่ม "กลับไปหน้าของขั้นนี้" พาไป (ไม่ใส่ = at · ต้องใส่เมื่อ at มี "*") */
  href?: string;
}

export interface GuideCase {
  /** รหัสใน URL / sessionStorage (ไม่แสดงบนจอ) */
  id: string;
  name: string;
  /** 1 บรรทัด เคสนี้ให้เห็นอะไร */
  about: string;
  role: Role;
  /** หน้าในชีตยืนยันของเคส: เลขเดียว หรือหลายหน้า (เคสที่ใช้หลายหน้าของชีต) · ไม่ใส่ = SHEET_PAGE[id] ของ scenarios.ts (เคสเดิม S1 S2)
      อ่านผ่าน casePages() ของ scenarios.ts ที่เดียว */
  sheet?: number | number[];
  /** ใส่ข้อมูลจำลองของเคส หลังล้างข้อมูลจำลองแล้ว — ต้องได้ค่าเดิมทุกครั้ง (ห้ามใช้วันที่ปัจจุบันหรือค่าสุ่ม) */
  seed: () => void;
  steps: GuideStep[];
}

export interface GuideScenario {
  /** รหัสใน URL ของหน้าเรื่อง (/scenarios/guide/?s=) */
  key: string;
  /** รหัส scenario ของ userflow — ใช้จับคู่กับแถวในหน้า /scenarios/ เท่านั้น ห้ามแสดงในหน้าที่ลูกค้าเห็น */
  code: string;
  title: string;
  who: string;
  about: string;
  cases: GuideCase[];
}
