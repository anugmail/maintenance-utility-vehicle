"use client";
/* ชิ้นร่วมของ S26 Safety Inspection (/safety/ · /safety/upload/) — ไม่ใช่ component ใหม่ */
import { PLAN_ROLES } from "@/lib/mock/planFlow";
import type { SafetyCar } from "@/lib/mock/safety";
import { SAFETY_NONE, SAFETY_PILL } from "@/lib/mock/safetyStore";
import { useRoleGuard } from "@/lib/mock/planFlow";
import { useRole } from "@/lib/mock/store";

/** เมนูของ Sidebar ที่หน้านี้อยู่ (งานซ่อมและบำรุงรักษา > Safety Inspection) */
export const SAFETY_ROOT = "งานซ่อมและบำรุงรักษา";
/* Permission (เสนอ · BACKLOG ค.): ผู้ดำเนินการ (หน่วยงาน กกฟ.1 กกฟ.2 กรย. · กบค.) เห็นทุกคันและบันทึกผลได้ · ผู้ดูแลยานพาหนะ เห็นเฉพาะยานพาหนะที่ดูแล ดูอย่างเดียว · บทบาทอื่นกลับราก */
export const SAFETY_ROLES = [...PLAN_ROLES, "ผู้ดูแลยานพาหนะ"] as const;
export function useSafetyAccess() {
  const ok = useRoleGuard(SAFETY_ROLES);
  const owner = useRole() === "ผู้ดูแลยานพาหนะ";
  return { ok, owner };
}
export const resultPill = (c: SafetyCar) => (c.result == null ? SAFETY_NONE : SAFETY_PILL[c.result]);
