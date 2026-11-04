/* ข้อมูลจำลองของ S4 (ความคืบหน้าอะไหล่ของไตรมาส) และ S15 S16 S17 (ประวัติ · หัวหน้าตรวจ · รายงานผลและปิดงาน) — batch B
   ยกจาก screens.js (partsProgress · partsSummary · PLAN_KV · HIST · hqRows · reportScreen) · ค่าสมมติทั้งหมด */
import type { PillColor } from "@/components/vms/PillOutline";
import { PARTS, type Plan, type PlanStatus } from "./data";
import { setMock, type MockState } from "./store";

/* ---------- แผนในข้อมูลจำลอง (store.plans · S1) ---------- */
export const mrOf = (id: string) => "MR " + id;
export const planOf = (s: MockState, id: string): Plan | undefined => s.plans.find((p) => p.mr === mrOf(id));
export function setPlanStatus(id: string, status: PlanStatus) {
  setMock((s) => ({ ...s, plans: s.plans.map((p) => (p.mr === mrOf(id) ? { ...p, status } : p)) }));
}
const APPROVED_AT: Record<string, string> = { Z7000001: "08/10/2569" };
const CREATOR = "นายวิชัย ทองดี (กบค.)";
/* PLAN_KV — กล่องรายละเอียดแผน (10 คู่) · quarterNote = ต่อท้ายไตรมาส (หน้าแผนเดินทาง "ไตรมาส 1 (10 คัน)") */
export const planKv = (p: Plan, quarterNote?: string): [string, string][] => [
  ["ชื่อแผน", p.name], ["ปีงบประมาณ", p.year], ["ภาค", p.region], ["ประเภทรถ", p.type], ["ไตรมาส", p.nowQ + (quarterNote ?? "")],
  ["จำนวนรถ", p.cars + " คัน"], ["เลขที่ MR", p.mr], ["ผู้สร้างแผน", CREATOR], ["วันที่สร้าง", p.created], ["อนุมัติเมื่อ", APPROVED_AT[p.mr.slice(3)] ?? "-"],
];

/* ---------- S4 เบิก/จองอะไหล่ ---------- */
export interface QuarterState { result: "none" | "short" | "ok"; /** หน้าที่กดยืนยัน (จำลองของที่รอจัดซื้อเข้าคลังเมื่อกลับมาเปิดหน้าใหม่) */ mount?: string }
export const qKey = (id: string, q: number) => id + "-" + q;
export const quarterOf = (s: MockState, id: string, q: number): QuarterState => s.quarter?.[qKey(id, q)] ?? { result: "none" };
export function putQuarter(id: string, q: number, v: QuarterState) {
  setMock((s) => ({ ...s, quarter: { ...s.quarter, [qKey(id, q)]: v } }));
}
export const WD: Record<"wait" | "reserved" | "taken" | "buy", [string, PillColor]> = {
  wait: ["รอเบิก", "Gray"], reserved: ["จองแล้ว", "Info"], taken: ["เบิกแล้ว", "Success"], buy: ["รอจัดซื้อ", "Warning"],
};
export const shortOf = (i: number) => Math.max(0, PARTS[i].planQty - PARTS[i].stock);   // ไส้กรองไฮโดรลิก 9 · ไส้กรองเชื้อเพลิง 3
export const NOW_CARS = 6;   // "รถ 6 คันของไตรมาสนี้" (VEH ของ screens.js — ต่างจาก 10 คันของ S6 ตามข้อมูลตัวอย่าง)
export const WH_ACK_AT = "02/11/2569";
const WH = ["Smart Inventory", "Smart Inventory", "Smart Inventory", "คลังสำรอง", "คลังสำรอง"];
const PRICE = [120, 680, 250, 420, 350];
const BUYER_OF: Record<number, "Smart Inventory" | "ผพจ."> = { 1: "Smart Inventory", 4: "ผพจ." };
/* ยอดใน SummaryRequestedParts (partsSummary): เบิก = min(ตามแผน, คงเหลือ) × ราคา แยกคลัง · จัดซื้อ = ส่วนที่ขาด × ราคา แยกผู้จัดซื้อ */
export function partsSummary() {
  const take = { "Smart Inventory": 0, "คลังสำรอง": 0 }, buy = { "Smart Inventory": 0, "ผพจ.": 0 };
  PARTS.forEach((p, i) => { const st = Math.min(p.planQty, p.stock); take[WH[i] as keyof typeof take] += st * PRICE[i]; if (p.planQty > st) buy[BUYER_OF[i] ?? "Smart Inventory"] += (p.planQty - st) * PRICE[i]; });
  const ok = PARTS.map((_, i) => i).filter((i) => !shortOf(i)), short = PARTS.map((_, i) => i).filter((i) => shortOf(i));
  const groups = [
    { title: "เบิกจากคลัง Smart Inventory (" + ok.length + " รายการ)", subs: (["Smart Inventory", "คลังสำรอง"] as const).map((w) => ({ title: "เบิกที่ " + w, rows: ok.filter((i) => WH[i] === w).map((i) => [PARTS[i].name + " x" + PARTS[i].planQty, PARTS[i].planQty * PRICE[i]] as [string, number]) })).filter((x) => x.rows.length) },
    { title: "คงเหลือไม่พอ — รอจัดซื้อ ผพจ. (" + short.length + " รายการ)", subs: (["Smart Inventory", "ผพจ."] as const).map((b) => ({ title: "จัดซื้ออะไหล่เพิ่มโดย " + b, rows: short.filter((i) => (BUYER_OF[i] ?? "Smart Inventory") === b).map((i) => [PARTS[i].name + " x" + shortOf(i), shortOf(i) * PRICE[i]] as [string, number]) })).filter((x) => x.rows.length) },
  ];
  const totals: [string, number][] = [["เบิกจาก Smart Inventory", take["Smart Inventory"]], ["เบิกจากคลังสำรอง", take["คลังสำรอง"]], ["จัดซื้ออะไหล่เพิ่มโดย Smart Inventory", buy["Smart Inventory"]], ["จัดซื้ออะไหล่เพิ่มโดย ผพจ.", buy["ผพจ."]]];
  return { ok: ok.length, short: short.length, groups, totals };
}

/* ---------- S15 S16 S17 ---------- */
export interface CloseoutState {
  /** หน่วยงานยอมรับผลทั้งแผนแล้ว (S14 — batch C ตั้งค่านี้) ⇒ ครบทุกคัน ส่งประวัติได้ */
  accepted?: boolean;
  sentAt?: string;
  /** ผลหัวหน้า กบค. (S16) */
  head?: "ok" | "back";
  headAt?: string;
  headReason?: string;
  closedAt?: string;
}
export const closeoutOf = (s: MockState, id: string): CloseoutState => s.closeout?.[id] ?? {};
export function putCloseout(id: string, patch: Partial<CloseoutState>) {
  setMock((s) => ({ ...s, closeout: { ...s.closeout, [id]: { ...s.closeout?.[id], ...patch } } }));
}
/** ให้ S14 (batch C) เรียกเมื่อหน่วยงานยอมรับผลทั้งแผน */
export const markPlanAccepted = (id: string) => putCloseout(id, { accepted: true });

export const ACC: Record<"wait" | "ok", [string, PillColor]> = { wait: ["รอหน่วยงานยอมรับ", "Warning"], ok: ["หน่วยงานยอมรับแล้ว", "Success"] };
export const HST: Record<"wait" | "ok" | "back", [string, PillColor]> = { wait: ["รอหัวหน้าตรวจสอบ", "Warning"], ok: ["ผ่านแล้ว", "Success"], back: ["ตีกลับ", "Error"] };
export const HIST_COLS = [
  { head: "ทะเบียน", width: 160, Style: "Lead text" as const, SortIcon: "Swap" as const }, { head: "วันที่ทำ", width: 120 }, { head: "งานที่ทำ" },
  { head: "อะไหล่ที่ใช้", width: 220 }, { head: "ผลน้ำมัน", width: 110, Style: "Badge" as const }, { head: "ผู้ทำ", width: 150 }, { head: "การยอมรับ", width: 190, Style: "Badge" as const },
];
const STAFF = ["นายวิชัย ทองดี", "นางสาวกนกวรรณ ใจมั่น", "นายสมชาย พูลสุข"];
/* HIST — 4 แถวตัวอย่าง (จอแบ่งหน้าเป็น 12 รายการตามจำนวนรถ) */
export const HIST_ROWS = ["82-6789 ขอนแก่น", "82-1145 ขอนแก่น", "80-5738 น่าน", "81-2210 เชียงใหม่"].map((plate, i) => [
  plate, "0" + (4 + i) + "/11/2569", "เปลี่ยนน้ำมันไฮโดรลิก · ไส้กรอง", "30 ลิตร · 5 ชิ้น",
  { pills: [i === 2 ? ["ไม่ผ่าน", "Error"] : ["ผ่าน", "Success"]] as [string, PillColor][] }, STAFF[i % 3], { pills: [i < 3 ? ACC.ok : ACC.wait] },
]);
export const PROGRESS_DONE = 10;   // N.1 "บำรุงรักษาแล้ว 10 / 12 คัน"
export const SENT_AT = "12/11/2569", HEAD_AT = "13/11/2569", CLOSED_AT = "14/11/2569";
export const HEAD_REVIEWER = "นายประเสริฐ มั่นคง";
export const HQ_OTHER = { id: "Z6900011", mr: "MR Z6900011", plan: "บำรุงรักษารถกระเช้า ภาค 1 ปีงบประมาณ 2569", sender: "นางสาวกนกวรรณ ใจมั่น", cars: "10 คัน", sentAt: "28/06/2569" };
/* สถานะในรายการของหัวหน้า (HST) จากสถานะแผน */
export const headStatusOf = (p: Plan, c: CloseoutState): "wait" | "ok" | "back" =>
  c.head === "back" && p.status === "active" ? "back" : p.status === "passed" || p.status === "closed" ? "ok" : "wait";
export const reportSummary = (p: Plan): [string, string][] => [
  ["รถตามแผน", p.cars + " คัน"], ["บำรุงรักษาแล้ว", p.cars + " คัน"], ["ทำไม่ได้", "0 คัน"], ["ใบเดินทาง", "2 ใบ"],
  ["อะไหล่ที่ใช้", "5 รายการ · คืนคลัง 1 รายการ"], ["ผลน้ำมันไฮโดรลิก", "ผ่าน 11 · ไม่ผ่าน 1"], ["หน่วยงานยอมรับผล", p.cars + " / " + p.cars + " คัน"], ["ช่วงดำเนินการ", "03/11/2569 – 12/11/2569"],
];
