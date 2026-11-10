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

/* MOCK_V — รุ่นของข้อมูลจำลองในที่เก็บ · รุ่นไม่ตรง = เริ่มจากค่าตั้งต้นใหม่ (load)
   2 = 9 พ.ย. 2569 เลขที่ MR ติดกันไม่เว้นวรรค (MR Z7000001 → MRZ7000001 · Figma e6e02d0) + แผนจำลองเพิ่มของหน่วยงาน (UNIT_PLANS) — ที่เก็บรุ่น 1 มีเลขแบบเว้นวรรคค้างอยู่ จึงไม่ใช้ต่อ
   3 = 9 พ.ย. 2569 S10 Step 1 แบบตรวจสภาพตามประเภทยานพาหนะ (R86 · Figma bc2571f) — ร่าง Step 1 ของงานรายคัน (jobs.receive) เปลี่ยนจากรายการรับยานพาหนะ (มี/ไม่มี ชำรุด ผิดรุ่น)
       เป็นรายการตรวจ ปกติ/แก้ไข และผู้ลงนามสลับลำดับ (ผู้ตรวจ กบค. ก่อน) — ที่เก็บรุ่น 2 อ่านเป็นแบบใหม่ไม่ได้
   4 = 9 พ.ย. 2569 คำกลางแทน "กบค." ที่เป็นผู้ทำงาน (Figma b989c0d) — ค่าที่เก็บไว้ (ชื่อผู้ทำ "(กบค.)" ในงานรายคัน ข้อความแจ้งเตือน) เป็นข้อความเดิม จึงเริ่มจากค่าตั้งต้นใหม่
   5 = 9 พ.ย. 2569 แผนตัวอย่างมียานพาหนะทุกไตรมาสตาม perQ (SAMPLE_PLAN_Q · MRZ7000001 เป็น 16 คัน 10 · 3 · 2 · 1) — แผนที่เก็บไว้มี perQ เดิม
   6 = 10 พ.ย. 2569 S16 S17 ตัดออก (Figma 6299e1d) — สถานะแผน hist (รอหัวหน้าตรวจสอบ) passed (ประวัติผ่านแล้ว) ไม่มีแล้ว แผนที่เก็บไว้ในสถานะนั้นอ่านต่อไม่ได้ */
export const MOCK_V = 6;

export interface MockState {
  v: typeof MOCK_V;
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
  /** ปิดงานของแผน (รับทราบครบทุกคันแล้วปิดเอง · S15 S16 S17 ตัดออก) คีย์ = รหัสแผน */
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
/* กบค. คลัง เอาออก 6 พ.ย. 2569 พร้อม S22 (เจ้าของงาน "ส่งจำนวนทั้งปีไปที่ smartinventory โดยยังไม่ส่งให้ตัด แค่ inform" ⇒ ระบบแจ้ง Smart Inventory ตอน S2 อนุมัติ) — บทบาทเก่าในที่เก็บ = กลับเป็นหน่วยงาน (loadRole) */
/* 9 พ.ย. 2569 เจ้าของงาน "ปรับให้มีการสร้าง ของ กรย และ กกฟ ทำ persona ของทั้ง 3 กองนนี้ โดยหน้ารวม เห็นไม่เหมือนกันคือ กกฟ1,2 และ กรย สร้างได้ และเห็นแค่ของตัวเองแต่ กบคจะเห็นของคนอื่นด้วย" (Figma 9d7d1a7 · A.1 A.39 A.40)
   ⇒ เพิ่มบทบาทผู้สร้างแผน "หน่วยงาน (กกฟ.2)" "หน่วยงาน (กรย.)" ต่อจาก "หน่วยงาน (กกฟ.1)" (UNIT_ROLES ใน planFlow.ts) — สร้างแผนได้ เห็นเฉพาะแผนของหน่วยงานตัวเอง
   บทบาท "กรย." เดิมคงไว้ตามเดิม = ผู้รับแจ้งเตือนแผนเดินทาง (S8 · หน้าเริ่ม /trips-view/) ไม่เปลี่ยนชื่อ ไม่รวมกับ "หน่วยงาน (กรย.)" เพื่อไม่ให้เคสพาดู S8 ข้อมูล seed และบทบาทที่เก็บไว้เดิมเปลี่ยน */
/* 10 พ.ย. 2569 เอา "ผู้รับจ้าง" กลับพร้อม S23 (R87 · เจ้าของงาน _"scen s23 อยากปรับ ui ให้เหมือนกับ s10 แต่ว่า เงื่อนไขการมองเห็น เมนูต่างๆ ยังเป็นเหมือนเดิม"_)
   ทำงานรายคันของแผนจ้างดำเนินการที่ตนรับจ้าง (/trips/…) · ไม่มีหน้ารายการของตัวเอง (หน้าเริ่ม = แผนจ้างใบล่าสุดที่อนุมัติแล้ว · roleHome) */
/* 10 พ.ย. 2569 S16 ตัดออก (Figma 6299e1d) ⇒ บทบาท "หัวหน้าหน่วยงาน" เอาออก (ไม่มีหน้าอื่นใช้) — บทบาทเก่าในที่เก็บ = กลับเป็นหน่วยงาน (กกฟ.1) */
export const ROLES = ["หน่วยงาน (กกฟ.1)", "หน่วยงาน (กกฟ.2)", "หน่วยงาน (กรย.)", "กบค.", "ผู้อนุมัติ", "กรย.", "ผู้ดูแลยานพาหนะ", "ผู้รับจ้าง"] as const;
export type Role = (typeof ROLES)[number];
/* 9 พ.ย. 2569 เจ้าของงาน "อะไรที่มีคำว่า กบค แก้ออกให้เป็นคำกลางๆ" (Figma b989c0d) ⇒ ผู้ตรวจประวัติ S16 "หัวหน้า กบค." เป็น "หัวหน้าหน่วยงาน" · บทบาท "กบค." (เห็นแผนทุกหน่วยงาน) คงเดิม */
const OLD_ROLE: Record<string, Role> = { "หัวหน้า กบค.": "หน่วยงาน (กกฟ.1)", "หัวหน้าหน่วยงาน": "หน่วยงาน (กกฟ.1)", "หน่วยงานเจ้าของยานพาหนะ": "ผู้ดูแลยานพาหนะ" };

let role: Role | null = null;
const roleSubs = new Set<() => void>();
function loadRole(): Role {
  if (role) return role;
  try {
    let r = window.localStorage.getItem(ROLE_KEY) as string | null;
    if (r && OLD_ROLE[r]) { r = OLD_ROLE[r]; window.localStorage.setItem(ROLE_KEY, r); }   // ชื่อบทบาทเดิมในที่เก็บ → ชื่อใหม่
    role = r && (ROLES as readonly string[]).includes(r) ? (r as Role) : "หน่วยงาน (กกฟ.1)";
  } catch { role = "หน่วยงาน (กกฟ.1)"; }
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
