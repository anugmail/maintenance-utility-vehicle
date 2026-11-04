"use client";
/* ที่เก็บข้อมูลจำลอง — localStorage คีย์ mt-next-v1 (กติกาข้อ 5) · บทบาทเก็บแยกคีย์ mt-next-v1:role (ล้างข้อมูลจำลองไม่เปลี่ยนบทบาท)
   อ่านด้วย useMock() · เขียนด้วย setMock() · ล้างด้วย resetMock() */
import { useSyncExternalStore } from "react";
import { PLANS, type Plan } from "./data";

export const KEY = "mt-next-v1";
export const ROLE_KEY = "mt-next-v1:role";

export interface MockState { v: 1; plans: Plan[] }

const initial = (): MockState => ({ v: 1, plans: PLANS.map((p) => ({ ...p })) });

let state: MockState | null = null;
const subs = new Set<() => void>();

function load(): MockState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    const j = raw ? (JSON.parse(raw) as MockState) : null;
    state = j && j.v === 1 && Array.isArray(j.plans) ? j : initial();
  } catch {
    state = initial();
  }
  return state;
}
function save() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* โหมดส่วนตัว — ใช้ในหน่วยความจำ */ }
  subs.forEach((f) => f());
}

const SERVER = initial();
export function useMock(): MockState {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, load, () => SERVER);
}
export function setMock(fn: (s: MockState) => MockState) { state = fn(load()); save(); }
export function resetMock() { state = initial(); save(); }

/* ---------- บทบาท (แถบต้นแบบ) ---------- */
export const ROLES = ["กบค.", "ผู้อนุมัติ", "กบค. คลัง", "กรย.", "หน่วยงานเจ้าของรถ", "ผู้รับจ้าง", "หัวหน้า กบค."] as const;
export type Role = (typeof ROLES)[number];

let role: Role | null = null;
const roleSubs = new Set<() => void>();
function loadRole(): Role {
  if (role) return role;
  try { const r = window.localStorage.getItem(ROLE_KEY) as Role | null; role = r && (ROLES as readonly string[]).includes(r) ? r : "กบค."; } catch { role = "กบค."; }
  return role;
}
export function useRole(): Role {
  return useSyncExternalStore((cb) => { roleSubs.add(cb); return () => roleSubs.delete(cb); }, loadRole, () => "กบค." as Role);
}
export function setRole(r: Role) {
  role = r;
  try { window.localStorage.setItem(ROLE_KEY, r); } catch { /* ข้าม */ }
  roleSubs.forEach((f) => f());
}

/* ---------- toast ที่ข้ามหน้าได้ (บันทึกแล้วกลับหน้ารายการพร้อม toast) ---------- */
export interface Toast { id: number; Text: string; Type: "Success" | "Error" }
let toast: Toast | null = null;
const toastSubs = new Set<() => void>();
export function useToast(): Toast | null {
  return useSyncExternalStore((cb) => { toastSubs.add(cb); return () => toastSubs.delete(cb); }, () => toast, () => null);
}
export function notify(Text: string, Type: "Success" | "Error" = "Success") {
  toast = { id: Date.now(), Text, Type };
  toastSubs.forEach((f) => f());
}
export function clearToast() { toast = null; toastSubs.forEach((f) => f()); }
