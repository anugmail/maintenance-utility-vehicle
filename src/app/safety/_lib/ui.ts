"use client";
import { PLAN_ROLES } from "@/lib/mock/planFlow";
import type { SafetyCar } from "@/lib/mock/safety";
import { SAFETY_NONE, SAFETY_PILL } from "@/lib/mock/safetyStore";
import { useRoleGuard } from "@/lib/mock/planFlow";
import { useRole } from "@/lib/mock/store";

export const SAFETY_ROOT = "งานซ่อมและบำรุงรักษา";
export const SAFETY_ROLES = [...PLAN_ROLES, "ผู้ดูแลยานพาหนะ"] as const;
export function useSafetyAccess() {
  const ok = useRoleGuard(SAFETY_ROLES);
  const owner = useRole() === "ผู้ดูแลยานพาหนะ";
  return { ok, owner };
}
export const resultPill = (c: SafetyCar) => (c.result == null ? SAFETY_NONE : SAFETY_PILL[c.result]);
