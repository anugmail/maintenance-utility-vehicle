"use client";
/* ที่เก็บข้อมูลจำลอง — localStorage คีย์ mt-next-v1 (กติกาข้อ 5) · บทบาทเก็บแยกคีย์ mt-next-v1:role2 (ล้างข้อมูลจำลองไม่เปลี่ยนบทบาท · 6 พ.ย. 2569 เปลี่ยนจาก :role เพราะ "กบค." เดิม = ผู้สร้างแผน ตอนนี้ = ดูอย่างเดียว)
   อ่านด้วย useMock() · เขียนด้วย setMock() · ล้างด้วย resetMock() */
import { useSyncExternalStore } from "react";
import { PLANS, type Plan } from "./data";
import type { Draft } from "./plan";
import type { Noti, Trip } from "./trips";
import type { CloseoutState, QuarterState } from "./closeout";

export const KEY = "mt-next-v1";
export const ROLE_KEY = "mt-next-v1:role2";

export interface MockState {
  v: 1;
  plans: Plan[];
  /** ฟอร์มสร้างแผนที่กรอกค้างไว้ (ไปหน้า S21 แล้วกลับมาไม่หาย) */
  draft?: Draft | null;
  /** ฟอร์มแก้ไขแผน (S19) ที่แก้ค้างไว้ — แยกจากฟอร์มสร้าง · ไปหน้า S21 แล้วกลับมาไม่หาย */
  edit?: Draft | null;
  /** เลขที่ MR ของแผนที่ลบแล้ว (S20) — ไม่นำกลับมาใช้ซ้ำ */
  retiredMr?: string[];
  /** แถบต้นแบบ: จำลองบันทึกไม่สำเร็จ (จอ "บันทึกไม่สำเร็จ" ของ S1) */
  failSave?: boolean;
  /* batch B (S4 S6 S9 S7 S8 S15 S16 S17) — ไม่มีค่า = ค่าตั้งต้นใน trips.ts / closeout.ts */
  /** แผนเดินทางทุกใบ (S6 S9 สร้าง · S7 อนุมัติ/ส่งกลับ) */
  trips?: Trip[];
  /** แจ้งเตือนในแอปของ กรย. / หน่วยงานเจ้าของรถ (S8) */
  notis?: Noti[];
  /** ผลเบิก/จองอะไหล่รายไตรมาส (S4) คีย์ "<แผน>-<ไตรมาส>" */
  quarter?: Record<string, QuarterState>;
  /** ประวัติ · หัวหน้าตรวจ · ปิดงาน (S15 S16 S17) คีย์ = รหัสแผน */
  closeout?: Record<string, CloseoutState>;
}

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
/* ผู้รับจ้าง เอาออก 4 พ.ย. 2569 พร้อม S23 (ใช้กับ S23 อย่างเดียว · userflow: ผู้รับจ้างยังไม่มีหน้าในระบบ Q13) — บทบาทเก่าในที่เก็บ = กลับเป็น กบค. (loadRole) */
/* 6 พ.ย. 2569 เจ้าของงาน "กกฟ กรย สร้างแผนได้ ทำเอง ไม่เกี่ยวกับ กบค เหมือนสร้างแผนแล้วก็ดำเนินการเอง กบค แค่เห็นแผนทั้งหมด"
   ⇒ ผู้สร้างแผนและผู้ดำเนินการ = หน่วยงาน (ข้อมูลตัวอย่างเป็นของ กกฟ.1 · CREATOR ของ screens.js) · "กบค." = ดูแผนทุกหน่วยงานอย่างเดียว (รายการแผน + รายละเอียดแผน ไม่มีปุ่ม) */
export const ROLES = ["หน่วยงาน (กกฟ.1)", "กบค.", "ผู้อนุมัติ", "กบค. คลัง", "กรย.", "หน่วยงานเจ้าของยานพาหนะ", "หัวหน้า กบค."] as const;
export type Role = (typeof ROLES)[number];

let role: Role | null = null;
const roleSubs = new Set<() => void>();
function loadRole(): Role {
  if (role) return role;
  try { const r = window.localStorage.getItem(ROLE_KEY) as Role | null; role = r && (ROLES as readonly string[]).includes(r) ? r : "หน่วยงาน (กกฟ.1)"; } catch { role = "หน่วยงาน (กกฟ.1)"; }
  return role;
}
export function useRole(): Role {
  return useSyncExternalStore((cb) => { roleSubs.add(cb); return () => roleSubs.delete(cb); }, loadRole, () => "หน่วยงาน (กกฟ.1)" as Role);
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
