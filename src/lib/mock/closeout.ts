/* ข้อมูลจำลองของ S4 (ความคืบหน้าอะไหล่ของไตรมาส) และ S15 S16 S17 (ประวัติ · หัวหน้าตรวจ · รายงานผลและปิดงาน) — batch B
   ยกจาก screens.js (partsProgress · partsSummary · PLAN_KV · HIST · hqRows · reportScreen) · ค่าสมมติทั้งหมด */
import type { PillColor } from "@/components/vms/PillOutline";
import { PARTS, creatorOf, unitOf, type Plan, type PlanStatus } from "./data";
import { setMock, type MockState } from "./store";

/* ---------- แผนในข้อมูลจำลอง (store.plans · S1) ---------- */
export const mrOf = (id: string) => "MR" + id;
export const planOf = (s: MockState, id: string): Plan | undefined => s.plans.find((p) => p.mr === mrOf(id));
export function setPlanStatus(id: string, status: PlanStatus) {
  setMock((s) => ({ ...s, plans: s.plans.map((p) => (p.mr === mrOf(id) ? { ...p, status } : p)) }));
}
/* อนุมัติเมื่อของแผนตัวอย่าง (PLAN_KV "08/10/2569") · คีย์ = id ใน URL (เลขที่ MR ตัด "MR" · 9 พ.ย. 2569 เลขติดกันแล้ว เดิม slice(3) ของ "MR Z…" ได้ "7000001" ค่าหาย) */
const APPROVED_AT: Record<string, string> = { Z7000001: "08/10/2569", Z7000002: "10/10/2569", Z7100003: "28/10/2569", Z7100004: "29/10/2569" };
/* PLAN_KV — กล่องรายละเอียดแผน (9 คู่) · quarterNote = ต่อท้ายไตรมาส (หน้าแผนเดินทาง "ไตรมาส 1 (10 คัน)")
   6 พ.ย. 2569 รีวิว S6 "ภาค เปลี่ยน หน่วยงาน" + "ย้ายประเภท มาไว้ในคอลัมม์" (PLAN_KV ของ screens.js): ภาค → หน่วยงานเจ้าของแผน · ไม่มีประเภทยานพาหนะ · ผู้สร้างแผน = CREATOR */
export const planKv = (p: Plan, quarterNote?: string): [string, string][] => [
  ["ชื่อแผน", p.name], ["ปีงบประมาณ", p.year], ["หน่วยงาน", unitOf(p.mr, p.unit)], ["ไตรมาส", p.nowQ + (quarterNote ?? "")],
  ["จำนวนยานพาหนะ", p.cars + " คัน"], ["เลขที่ MR", p.mr], ["ผู้สร้างแผน", creatorOf(p)], ["วันที่สร้าง", p.created], ["อนุมัติเมื่อ", p.approvedAt ?? APPROVED_AT[p.mr.replace(/^MR/, "")] ?? "-"],
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
/* แถวอะไหล่ที่ต้องเบิกของไตรมาส (S4) — แผนที่จัดรถรายคัน (alloc · S1/S21) = ยอดรวมจากรถทีละคันชุดเดียวกับฟอร์มแผนและหน้าคลัง S22 (quarterRows)
   แผนตัวอย่าง (ไม่มีรถรายคัน) = PARTS ของ screens.js · pi = ลำดับใน PARTS (ไม่มี = รายการที่ระบุเอง ไม่มีคงเหลือในคลัง) · sub = บรรทัดรอง (S25 อะไหล่ของรถที่ย้ายมา) */
export interface NeedRow { key: string; pi?: number; name: string; code: string; unit: string; qty: number; stock?: number; sub?: string }
export const SAMPLE_NEED: NeedRow[] = PARTS.map((p, i) => ({ key: "p" + i, pi: i, name: p.name, code: p.code, unit: p.unit, qty: p.planQty, stock: p.stock }));
/* ยอดของรถเดิมในไตรมาสอื่นของแผนตัวอย่าง (MOVE_Q2_BASE ของ screens.js · ค่าสมมติ) ตามลำดับ PARTS */
export const SAMPLE_Q_NEED: Record<number, number[]> = { 2: [30, 6, 6, 6, 2] };
export const lackOf = (r: NeedRow) => (r.stock == null ? 0 : Math.max(0, r.qty - r.stock));
/* ยอดใน SummaryRequestedParts (partsSummary): เบิก = min(ตามแผน, คงเหลือ) × ราคา แยกคลัง · จัดซื้อ = ส่วนที่ขาด × ราคา แยกผู้จัดซื้อ · รายการที่ระบุเอง (ไม่มีราคาในคลัง) ไม่นับยอด */
export function partsSummary(rows: NeedRow[] = SAMPLE_NEED) {
  const take = { "Smart Inventory": 0, "คลังสำรอง": 0 }, buy = { "Smart Inventory": 0, "ผพจ.": 0 };
  const stockRows = rows.filter((r) => r.pi != null) as (NeedRow & { pi: number })[];
  stockRows.forEach((r) => { const st = Math.min(r.qty, r.stock ?? 0); take[WH[r.pi] as keyof typeof take] += st * PRICE[r.pi]; if (r.qty > st) buy[BUYER_OF[r.pi] ?? "Smart Inventory"] += (r.qty - st) * PRICE[r.pi]; });
  const ok = stockRows.filter((r) => !lackOf(r)), short = stockRows.filter((r) => lackOf(r));
  const groups = [
    { title: "เบิกจากคลัง Smart Inventory (" + ok.length + " รายการ)", subs: (["Smart Inventory", "คลังสำรอง"] as const).map((w) => ({ title: "เบิกที่ " + w, rows: ok.filter((r) => WH[r.pi] === w).map((r) => [r.name + " x" + r.qty, r.qty * PRICE[r.pi]] as [string, number]) })).filter((x) => x.rows.length) },
    { title: "คงเหลือไม่พอ — รอจัดซื้อ ผพจ. (" + short.length + " รายการ)", subs: (["Smart Inventory", "ผพจ."] as const).map((b) => ({ title: "จัดซื้ออะไหล่เพิ่มโดย " + b, rows: short.filter((r) => (BUYER_OF[r.pi] ?? "Smart Inventory") === b).map((r) => [r.name + " x" + lackOf(r), lackOf(r) * PRICE[r.pi]] as [string, number]) })).filter((x) => x.rows.length) },
  ];
  const totals: [string, number][] = [["เบิกจาก Smart Inventory", take["Smart Inventory"]], ["เบิกจากคลังสำรอง", take["คลังสำรอง"]], ["จัดซื้ออะไหล่เพิ่มโดย Smart Inventory", buy["Smart Inventory"]], ["จัดซื้ออะไหล่เพิ่มโดย ผพจ.", buy["ผพจ."]]];
  return { ok: ok.length, short: short.length, groups, totals };
}

/* ---------- S15 S16 S17 ---------- */
export interface CloseoutState {
  /** ที่เก็บเก่า (S14 ยอมรับผลทั้งแผน · ตัดออก 10 พ.ย. 2569) — ไม่ใช้แล้ว */
  accepted?: boolean;
  /** sentAt = ระบบส่งประวัติให้หัวหน้าหน่วยงานเมื่อผู้ดูแลยานพาหนะรับทราบครบทุกคัน (S13 acceptCar · S15 ตัดออก) หรือผู้ดำเนินการส่งใหม่หลังถูกตีกลับ (S16 O.6) */
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

/* ACC — การรับทราบของผู้ดูแลยานพาหนะ (S13 · 10 พ.ย. 2569 เดิม รอหน่วยงานยอมรับ / หน่วยงานยอมรับแล้ว) */
export const ACC: Record<"wait" | "ok", [string, PillColor]> = { wait: ["รอรับทราบ", "Warning"], ok: ["รับทราบแล้ว", "Success"] };
/* เหตุผลตีกลับตัวอย่าง (HIST_BACK · S16 O.3 O.6) */
export const HIST_BACK = "ผลน้ำมันไฮโดรลิกของ 80-5738 น่าน ไม่ผ่าน ต้องระบุการแก้ไขก่อนบันทึกประวัติ";
export const HST: Record<"wait" | "ok" | "back", [string, PillColor]> = { wait: ["รอหัวหน้าตรวจสอบ", "Warning"], ok: ["ผ่านแล้ว", "Success"], back: ["ตีกลับ", "Error"] };
export const HIST_COLS = [
  { head: "ทะเบียน", width: 160, Style: "Lead text" as const, SortIcon: "Swap" as const }, { head: "วันที่ทำ", width: 120 }, { head: "งานที่ทำ" },
  { head: "อะไหล่ที่ใช้", width: 220 }, { head: "ผลน้ำมัน", width: 110, Style: "Badge" as const }, { head: "ผู้ทำ", width: 150 }, { head: "การรับทราบ", width: 190, Style: "Badge" as const },
];
/* แถวประวัติ ความคืบหน้า และสรุปรายงาน อ่านจากงานรายคันจริง — lib/mock/history.ts (BACKLOG ข้อ 6 · แทน HIST_ROWS PROGRESS_DONE reportSummary คงที่) */
export const SENT_AT = "12/11/2569", HEAD_AT = "13/11/2569", CLOSED_AT = "14/11/2569";
export const HEAD_REVIEWER = "นายประเสริฐ มั่นคง";
export const HQ_OTHER = { id: "Z6900011", mr: "MRZ6900011", plan: "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 ปีงบประมาณ 2569", sender: "นางสาวกนกวรรณ ใจมั่น", cars: "10 คัน", sentAt: "28/06/2569" };
/* สถานะในรายการของหัวหน้า (HST) จากสถานะแผน */
export const headStatusOf = (p: Plan, c: CloseoutState): "wait" | "ok" | "back" =>
  c.head === "back" && p.status === "active" ? "back" : p.status === "passed" || p.status === "closed" ? "ok" : "wait";
