"use client";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import type { PillColor } from "@/components/vms/PillOutline";
import { FIG_FLEET, CAND, DISTRICTS, LAST_OIL, NEW_PLAN_DATE, OIL_OPTS, OIL_PLAN_OPTS, OIL_SPEC, PARTS, PART_PRICE, REGIONS, RETURN_REASON, UNIT_FLEET, creatorOf, dCode, oilChanges, unitOf, type ManualPart, type Plan, type PlanStatus } from "./data";
import { CAR_PICK } from "./data";
import { allocScope, carQty, decided, inQuarter, planCars, quarterParts, type Draft } from "./plan";
import { accRows } from "./acceptance";
import { notify, setMock, useRole, type MockState, type Role } from "./store";
import { SAMPLE_PLAN_Q, candId, quarterCars, tripsOf } from "./trips";

export const planId = (p: Plan) => p.mr.replace(/^MR/, "");
export const findPlan = (plans: Plan[], id: string | null) => (id ? plans.find((p) => planId(p) === id) : undefined);
export const carParam = (i: number) => CAND[i].plate.split(" ")[0];
export const carIndexOf = (param: string | null) => (param ? CAND.findIndex((c) => c.plate.split(" ")[0] === param) : -1);

export const ROLE_HOME: Partial<Record<Role, string>> = {
  "ผู้อนุมัติ": "/approvals/plans/", "กรย.": "/trips-view/", "ผู้ดูแลยานพาหนะ": "/trips-view/",
};
export function roleHome(role: Role, m: MockState): string | undefined {
  const trips = tripsOf(m).filter((t) => !t.listOnly);
  if (role === "ผู้รับจ้าง") { const h = trips.filter((t) => t.mode === "hire" && t.status === "approved").pop(); return h ? "/trips/detail/?trip=" + h.id : undefined; }
  if (role === "ผู้อนุมัติ" && trips.some((t) => t.status === "review")) return "/approvals/trips/";
  if (role === "ผู้ดูแลยานพาหนะ" && accRows(m).some((r) => !r.accepted)) return "/acceptance/";
  return ROLE_HOME[role];
}

const noop = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
export const UNIT_ROLES: Partial<Record<Role, string>> = { "หน่วยงาน (กบผ.)": "กบผ.", "หน่วยงาน (กปส.)": "กปส.", "หน่วยงาน (กรย.)": "กรย.", "หน่วยงาน (กส.1)": "กส.1", "หน่วยงาน (กส.2)": "กส.2" };
export const PLAN_ROLES: readonly Role[] = [...(Object.keys(UNIT_ROLES) as Role[]), "กบค."];
export const roleUnit = (r: Role) => UNIT_ROLES[r] ?? (r === "กบค." ? "กบค." : undefined);
export const visiblePlans = (r: Role, plans: Plan[]) => (r === "กบค." ? plans : plans.filter((p) => unitOf(p.mr, p.unit) === roleUnit(r)));
export const canManage = (r: Role, p: Plan) => { const u = roleUnit(r); return !!u && unitOf(p.mr, p.unit) === u; };
export const ownsPlan = (r: Role, p?: Plan) => !!p && canManage(r, p);
export type PlanAccess = "own" | "view" | "none";
export const planAccess = (r: Role, p?: Plan): PlanAccess => (!p ? "none" : canManage(r, p) ? "own" : UNIT_ROLES[r] ? "none" : "view");
export function usePlanGate(plan: Plan | undefined, need: "view" | "own" = "view") {
  const router = useRouter();
  const role = useRole();
  const ready = useHydrated();
  const a = plan ? planAccess(role, plan) : "view";
  const deny = ready && !!plan && (a === "none" || (need === "own" && a !== "own"));
  useEffect(() => { if (deny) router.replace("/"); }, [deny, router]);
  return deny;
}
export function useRoleGuard(allowed: readonly Role[]) {
  const router = useRouter();
  const role = useRole();
  const ready = useHydrated();
  const ok = allowed.includes(role);
  useEffect(() => { if (ready && !ok) router.replace("/"); }, [ready, ok, router]);
  return ready && ok;
}

export const badgeOf = (c: PillColor): BadgeOutlineColor => (c === "Warning" || c === "Info" ? "Brand" : c === "Gray" || c === "Success" || c === "Error" || c === "Brand" ? c : "Gray");

type Alloc = Pick<Draft, "alloc" | "picks" | "qty" | "manual" | "oils" | "oilSpec" | "draw">;
export const allocOf = (p: Plan): Alloc => ({ alloc: p.alloc ?? {}, picks: p.picks ?? {}, qty: p.qty, manual: p.manual, oils: p.oils, oilSpec: p.oilSpec, draw: p.draw });

function sampleAlloc(p: Plan, s?: Pick<MockState, "plans" | "qcars">): Pick<Draft, "alloc" | "picks" | "oils"> {
  const alloc: Record<number, number> = {}, picks: Record<number, number[]> = {}, oils: Record<number, number> = {};
  [1, 2, 3, 4].forEach((q) => (s ? quarterCars(s, planId(p), q) : SAMPLE_PLAN_Q[p.mr]?.[q] ?? []).forEach((c) => {
    const i = CAND.findIndex((x) => candId(x.plate) === c.id);
    if (i >= 0) { alloc[i] = q; picks[i] = [...CAR_PICK]; oils[i] = 0; }
  }));
  return { alloc, picks, oils };
}
export function draftFromPlan(p: Plan, st?: Pick<MockState, "plans" | "qcars">): Draft {
  const regions = p.regions ?? REGIONS.filter((r) => p.region.split(", ").map((x) => x.split(" (")[0]).includes(r.split(" (")[0]));
  if (!p.alloc || !Object.keys(p.alloc).length) {
    const s = sampleAlloc(p, st);
    return { name: p.name, year: p.year, regions, districts: p.districts ?? [], types: p.types ?? p.type.split(", ").filter(Boolean), ...s, q: 1, editOf: p.mr };
  }
  return {
    name: p.name, year: p.year, regions, districts: p.districts ?? [], types: p.types ?? p.type.split(", ").filter(Boolean),
    alloc: { ...(p.alloc ?? {}) }, picks: { ...(p.picks ?? {}) }, qty: p.qty ? { ...p.qty } : undefined, manual: p.manual ? { ...p.manual } : undefined,
    oils: p.oils ? { ...p.oils } : undefined, oilSpec: p.oilSpec ? { ...p.oilSpec } : undefined, draw: p.draw ? { ...p.draw } : undefined,
    q: 1, editOf: p.mr,
  };
}
export const draftKey = (d: Draft) => JSON.stringify([d.name, d.year, d.regions, d.districts, d.types, d.alloc, d.picks, d.qty ?? {}, d.manual ?? {}, d.oils ?? {}, d.oilSpec ?? {}, d.draw ?? {}]);

export function planWithDraft(p: Plan, d: Draft, today: string): Plan {
  const per = [1, 2, 3, 4].map((q) => inQuarter(d, q).length);
  const { returnReason: _r, ...rest } = p;
  void _r;
  return {
    ...rest, name: d.name.trim(), ...allocScope(d.alloc), cars: Object.keys(d.alloc).length,
    perQ: per.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · "), status: "review", sentAt: today,
    regions: d.regions, districts: d.districts, types: d.types, alloc: d.alloc, picks: d.picks, qty: d.qty, manual: d.manual, oils: d.oils, oilSpec: d.oilSpec, draw: d.draw,
  };
}

export const oilChoice = (a: Alloc, i: number): number | null => a.oils?.[i] ?? (a.picks[i] ? ((a.picks[i] || []).includes(0) ? 1 : 0) : null);
export const oilOf = (a: Alloc, i: number) => (a.oils?.[i] != null ? OIL_PLAN_OPTS[a.oils[i]] : OIL_OPTS[(a.picks[i] || []).includes(0) ? 1 : 0]);
export const TODO_NONE = "ยังไม่กำหนด";
export const oilCellOf = (a: Alloc, i: number): string | { text: string; sub?: string } => {
  const k = oilChoice(a, i);
  if (k == null) return TODO_NONE;
  const sp = a.oilSpec?.[i], grade = sp?.grade || OIL_SPEC.grade, litre = a.qty?.[i]?.[0] ?? (sp?.litre ? Number(sp.litre) : carQty(a, i, 0));
  return { text: OIL_PLAN_OPTS[k], sub: k ? grade + " · " + litre + " ลิตร" : grade };
};
export const otherParts = (a: Alloc, i: number) => (a.picks[i] || []).filter((x) => x !== 0).map((x) => PARTS[x].name).concat((a.manual?.[i] || []).map((m) => m.name));
export const NO_DRAW = "ไม่เบิกอะไหล่";
export const otherCellOf = (a: Alloc, i: number): string | { text: string; sub: string } => {
  if (a.draw?.[i] === "none") return NO_DRAW;
  const l = otherParts(a, i);
  return l.length ? { text: l.length + " รายการ", sub: l[0] + (l.length > 1 ? " และอื่น ๆ" : "") } : TODO_NONE;
};
export const partCount = (a: Alloc, i: number) => (a.picks[i] || []).length + (a.manual?.[i] || []).length;
export const partCell = (a: Alloc, i: number) => (a.draw?.[i] === "none" ? NO_DRAW : partCount(a, i) ? partCount(a, i) + " รายการ" : "ยังไม่เลือก");
export const carsIn = (a: Alloc, q: number) => Object.keys(a.alloc).map(Number).filter((i) => a.alloc[i] === q);
export const carRow = (a: Alloc, i: number) => [CAND[i].plate, CAND[i].model, CAND[i].owner, oilOf(a, i), LAST_OIL[i], partCell(a, i)];

export interface QuarterRow { key: string; name: string; code: string; group: string; qty: number; unit: string; pi?: number; stock?: number }
export function quarterRows(a: Alloc, q: number): QuarterRow[] {
  const d = { ...a, name: "", year: "", regions: [], districts: [], types: [], q } as Draft;
  const rows: QuarterRow[] = quarterParts(d, q).map(([pi, n]) => ({ key: "p" + pi, name: PARTS[pi].name, code: PARTS[pi].code, group: PARTS[pi].group, qty: n, unit: PARTS[pi].unit, pi, stock: PARTS[pi].stock }));
  const man = new Map<string, QuarterRow>();
  carsIn(a, q).filter((c) => a.draw?.[c] !== "none").forEach((c) => (a.manual?.[c] || []).forEach((m) => {
    const k = "m" + m.name + "|" + m.code + "|" + (m.unit ?? "ชิ้น");
    const r = man.get(k);
    if (r) r.qty += m.qty; else man.set(k, { key: k, name: m.name, code: m.code || "-", group: "เพิ่มเอง", qty: m.qty, unit: m.unit || "ชิ้น" });
  }));
  return rows.concat([...man.values()]);
}
export function allQuarterRows(a: Alloc): QuarterRow[] {
  const m = new Map<string, QuarterRow>();
  [0, 1, 2, 3, 4].forEach((q) => quarterRows(a, q).forEach((r) => { const x = m.get(r.key); if (x) x.qty += r.qty; else m.set(r.key, { ...r }); }));
  const rows = [...m.values()];
  return rows.filter((r) => r.pi != null).sort((x, y) => (x.pi ?? 0) - (y.pi ?? 0)).concat(rows.filter((r) => r.pi == null));
}
export function dropQuarterRow(a: Alloc, q: number, r: QuarterRow): Pick<Draft, "picks" | "manual" | "qty"> {
  const picks = { ...a.picks }, manual = { ...(a.manual ?? {}) }, qty = { ...(a.qty ?? {}) };
  carsIn(a, q).forEach((c) => {
    if (r.pi != null) { picks[c] = (picks[c] || []).filter((x) => x !== r.pi); if (qty[c]) { const { [r.pi]: _x, ...k } = qty[c]; void _x; qty[c] = k; } }
    else if (manual[c]) manual[c] = manual[c].filter((m) => "m" + m.name + "|" + m.code !== r.key);
  });
  return { picks, manual, qty };
}
export const carCost = (picks: number[], qty: Record<number, number> | undefined, manual: ManualPart[]) =>
  picks.reduce((s, pi) => s + (qty?.[pi] ?? carQty({}, 0, pi)) * PART_PRICE[pi], 0) + manual.reduce((s, m) => s + (parseFloat((m.price ?? "").replace(/,/g, "")) || 0) * m.qty, 0);

export function planKv(p: Plan): [string, string][] {
  const dist = p.alloc && Object.keys(p.alloc).length ? [...new Set(Object.keys(p.alloc).map((i) => dCode(CAND[Number(i)])))].sort().join(", ") : (p.districts ?? []).join(", ") || "-";
  return [["ชื่อแผน", p.name], ["ปีงบประมาณ", p.year], ["หน่วยงาน", unitOf(p.mr, p.unit)], ["เขต", dist], ["ยานพาหนะรายไตรมาส", p.perQ],
    ["จำนวนยานพาหนะ", p.cars + " คัน"], ["เลขที่ MR", p.mr], ["ผู้สร้างแผน", creatorOf(p)], ["วันที่ส่ง", p.sentAt ?? p.created]];
}

export const quarterCount = (p: Plan, q: number) => (p.alloc ? carsIn(allocOf(p), q).length : Number((p.perQ.match(new RegExp("ไตรมาส " + q + ": (\\d+)")) || [])[1] || 0));

const FIG_A_ALL: number[] = [1, 1, 1, 2, 2, 2, 3, 4, 4, 3];
const FIG_A_OILS: number[] = [2, 0, 2, 0, 0, 1, 0, 0, 1, 0];
const FIG_A_DRAW: number[] = [4];
const EXTRA = UNIT_FLEET.filter((i) => !FIG_FLEET.includes(i));
const A_ALL: Record<number, number> = { ...Object.fromEntries(FIG_FLEET.map((c, k) => [c, FIG_A_ALL[k]])), ...Object.fromEntries(EXTRA.map((c, k) => [c, (k % 4) + 1])) };
const A_OILS: Record<number, number> = { ...Object.fromEntries(FIG_FLEET.map((c, k) => [c, FIG_A_OILS[k]])), ...Object.fromEntries(EXTRA.map((c) => [c, 0])) };
const A_DRAW: Record<number, "none"> = Object.fromEntries(FIG_A_DRAW.map((k) => [FIG_FLEET[k], "none" as const]));
const A_PICKS: Record<number, number[]> = Object.fromEntries(UNIT_FLEET.filter((c) => !A_DRAW[c]).map((c) => [c, oilChanges(A_OILS[c]) ? [0, ...CAR_PICK] : [...CAR_PICK]]));
export const SAMPLE_Q_CARS = (q: number) => Object.values(A_ALL).filter((x) => x === q).length;
export const SAMPLE_NAME = "บำรุงรักษายานพาหนะ กบผ. ปีงบประมาณ 2570";
export const R2 = { regions: [REGIONS[1]], districts: [...DISTRICTS[REGIONS[1]]], types: [] as string[] };
export function samplePlan(status: PlanStatus, acked?: number[]): Plan {
  const p: Plan = {
    mr: "MRZ7000004", name: SAMPLE_NAME, ...allocScope(A_ALL), nowQ: "ไตรมาส 1", cars: UNIT_FLEET.length, status, created: NEW_PLAN_DATE,
    year: "2570", perQ: [1, 2, 3, 4].map((q) => "ไตรมาส " + q + ": " + SAMPLE_Q_CARS(q)).join(" · "),
    ...R2, alloc: { ...A_ALL }, picks: Object.fromEntries(Object.entries(A_PICKS).map(([i, v]) => [i, [...v]])), oils: { ...A_OILS }, draw: { ...A_DRAW },
  };
  if (status === "returned") p.returnReason = RETURN_REASON;
  if (status === "approved" || status === "active") { p.approvedAt = "31/10/2569"; p.ack = Object.fromEntries((acked ?? []).map((q) => [q, "02/11/2569"])); }
  return p;
}
export const SAMPLE_PARTS = (): Pick<Draft, "picks" | "oils" | "draw"> => ({ picks: Object.fromEntries(Object.entries(A_PICKS).map(([i, v]) => [i, [...v]])), oils: { ...A_OILS }, draw: { ...A_DRAW } });
export function fillDraft(d: Draft): Draft {
  const x: Draft = { ...d, name: d.name.trim() ? d.name : SAMPLE_NAME, year: d.year || "2570" };
  const alloc = planCars(x).length ? { ...x.alloc } : { ...A_ALL }, picks = { ...x.picks }, oils = { ...(x.oils ?? {}) };
  planCars({ alloc }).forEach((i) => {
    if (!alloc[i]) alloc[i] = A_ALL[i] ?? 1;
    if (!decided(x, i)) { const o = oils[i] ?? A_OILS[i] ?? 0; oils[i] = o; picks[i] = oilChanges(o) ? [0, ...CAR_PICK] : [...CAR_PICK]; }
  });
  return { ...x, alloc, picks, oils };
}
export const sampleDraft = (): Draft => ({ name: SAMPLE_NAME, year: "2570", ...R2, alloc: { ...A_ALL }, picks: {}, q: 1 });

export const DELETE_CONFIRM = { danger: true, title: "ยืนยันการลบแผน", sub: "เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้ ต้องการลบใช่หรือไม่", cancel: "ยกเลิก", ok: "ยืนยัน" };
export function deletePlan(mr: string) {
  setMock((s) => ({ ...s, plans: s.plans.filter((p) => p.mr !== mr), retiredMr: [...(s.retiredMr ?? []), mr] }));
  notify("ลบแผนบำรุงรักษาสำเร็จ");
}
export const updatePlan = (mr: string, fn: (p: Plan) => Plan) => setMock((s) => ({ ...s, plans: s.plans.map((p) => (p.mr === mr ? fn(p) : p)) }));
export const startEdit = (p: Plan) => setMock((s) => ({ ...s, edit: draftFromPlan(p, s) }));
