"use client";
import { useSyncExternalStore } from "react";
import { PLANS, type Plan } from "./data";
import type { Draft } from "./plan";
import type { Noti, Trip } from "./trips";
import type { CloseoutState, QuarterState } from "./closeout";

export const KEY = "mt-next-v1";
export const ROLE_KEY = "mt-next-v1:role2";

export const MOCK_V = 10;

export interface MockState {
  v: typeof MOCK_V;
  plans: Plan[];
  draft?: Draft | null;
  edit?: Draft | null;
  retiredMr?: string[];
  failSave?: boolean;
  trips?: Trip[];
  notis?: Noti[];
  quarter?: Record<string, QuarterState>;
  closeout?: Record<string, CloseoutState>;
}

const initial = (): MockState => ({ v: MOCK_V, plans: PLANS.map((p) => ({ ...p })) });

let state: MockState | null = null;
const subs = new Set<() => void>();

function load(): MockState {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(KEY);
    const j = raw ? (JSON.parse(raw) as MockState) : null;
    state = j && j.v === MOCK_V && Array.isArray(j.plans) ? j : initial();
  } catch {
    state = initial();
  }
  return state;
}
function save() {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { }
  subs.forEach((f) => f());
}

const SERVER = initial();
export function useMock(): MockState {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb); }, load, () => SERVER);
}
export function setMock(fn: (s: MockState) => MockState) { state = fn(load()); save(); }
export function resetMock() { state = initial(); save(); }

export const ROLES = ["หน่วยงาน (กบผ.)", "หน่วยงาน (กปส.)", "หน่วยงาน (กรย.)", "หน่วยงาน (กส.1)", "หน่วยงาน (กส.2)", "กบค.", "ผู้อนุมัติ", "กรย.", "ผู้ดูแลยานพาหนะ", "ผู้รับจ้าง"] as const;
export type Role = (typeof ROLES)[number];
const OLD_ROLE: Record<string, Role> = { "หัวหน้า กบค.": "หน่วยงาน (กบผ.)", "หัวหน้าหน่วยงาน": "หน่วยงาน (กบผ.)", "หน่วยงานเจ้าของยานพาหนะ": "ผู้ดูแลยานพาหนะ",
  "หน่วยงาน (กกฟ.1)": "หน่วยงาน (กบผ.)", "หน่วยงาน (กกฟ.2)": "หน่วยงาน (กปส.)" };

let role: Role | null = null;
const roleSubs = new Set<() => void>();
function loadRole(): Role {
  if (role) return role;
  try {
    let r = window.localStorage.getItem(ROLE_KEY) as string | null;
    if (r && OLD_ROLE[r]) { r = OLD_ROLE[r]; window.localStorage.setItem(ROLE_KEY, r); }
    role = r && (ROLES as readonly string[]).includes(r) ? (r as Role) : "หน่วยงาน (กบผ.)";
  } catch { role = "หน่วยงาน (กบผ.)"; }
  return role;
}
export function useRole(): Role {
  return useSyncExternalStore((cb) => { roleSubs.add(cb); return () => roleSubs.delete(cb); }, loadRole, () => "หน่วยงาน (กบผ.)" as Role);
}
export function setRole(r: Role) {
  role = r;
  try { window.localStorage.setItem(ROLE_KEY, r); } catch { }
  roleSubs.forEach((f) => f());
}

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
