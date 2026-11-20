import type { PillColor } from "@/components/vms/PillOutline";
import { PARTS, creatorOf, unitOf, type Plan, type PlanStatus } from "./data";
import { setMock, type MockState } from "./store";

export const mrOf = (id: string) => "MR" + id;
export const planOf = (s: MockState, id: string): Plan | undefined => s.plans.find((p) => p.mr === mrOf(id));
export function setPlanStatus(id: string, status: PlanStatus) {
  setMock((s) => ({ ...s, plans: s.plans.map((p) => (p.mr === mrOf(id) ? { ...p, status } : p)) }));
}
const APPROVED_AT: Record<string, string> = { Z7000001: "08/10/2569", Z7000002: "10/10/2569", Z7100003: "28/10/2569", Z7100004: "29/10/2569" };
export const planKv = (p: Plan, quarterNote?: string): [string, string][] => [
  ["ชื่อแผน", p.name], ["ปีงบประมาณ", p.year], ["หน่วยงาน", unitOf(p.mr, p.unit)], ["ไตรมาส", p.nowQ + (quarterNote ?? "")],
  ["จำนวนยานพาหนะ", p.cars + " คัน"], ["เลขที่ MR", p.mr], ["ผู้สร้างแผน", creatorOf(p)], ["วันที่สร้าง", p.created], ["อนุมัติเมื่อ", p.approvedAt ?? APPROVED_AT[p.mr.replace(/^MR/, "")] ?? "-"],
];

export interface QuarterState { result: "none" | "short" | "ok"; mount?: string }
export const qKey = (id: string, q: number) => id + "-" + q;
export const quarterOf = (s: MockState, id: string, q: number): QuarterState => s.quarter?.[qKey(id, q)] ?? { result: "none" };
export function putQuarter(id: string, q: number, v: QuarterState) {
  setMock((s) => ({ ...s, quarter: { ...s.quarter, [qKey(id, q)]: v } }));
}
export const WD: Record<"wait" | "reserved" | "taken" | "buy", [string, PillColor]> = {
  wait: ["รอเบิก", "Gray"], reserved: ["จองแล้ว", "Info"], taken: ["เบิกแล้ว", "Success"], buy: ["รอจัดซื้อ", "Warning"],
};
export const shortOf = (i: number) => Math.max(0, PARTS[i].planQty - PARTS[i].stock);
export const NOW_CARS = 6;
export const WH_ACK_AT = "02/11/2569";
const WH = ["Smart Inventory", "Smart Inventory", "Smart Inventory", "คลังสำรอง", "คลังสำรอง"];
const PRICE = [120, 680, 250, 420, 350];
const BUYER_OF: Record<number, "Smart Inventory" | "ผพจ."> = { 1: "Smart Inventory", 4: "ผพจ." };
export interface NeedRow { key: string; pi?: number; name: string; code: string; unit: string; qty: number; stock?: number; sub?: string }
export const SAMPLE_NEED: NeedRow[] = PARTS.map((p, i) => ({ key: "p" + i, pi: i, name: p.name, code: p.code, unit: p.unit, qty: p.planQty, stock: p.stock }));
export const SAMPLE_Q_NEED: Record<number, number[]> = { 2: [30, 6, 6, 6, 2] };
export const lackOf = (r: NeedRow) => (r.stock == null ? 0 : Math.max(0, r.qty - r.stock));
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

export interface CloseoutState {
  closedAt?: string;
  accepted?: boolean; sentAt?: string; head?: "ok" | "back"; headAt?: string; headReason?: string;
}
export const closeoutOf = (s: MockState, id: string): CloseoutState => s.closeout?.[id] ?? {};
export function putCloseout(id: string, patch: Partial<CloseoutState>) {
  setMock((s) => ({ ...s, closeout: { ...s.closeout, [id]: { ...s.closeout?.[id], ...patch } } }));
}
