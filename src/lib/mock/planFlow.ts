"use client";
/* ตัวช่วยของวงจรแผน S2 S19 S20 S21 S22 — ยกจาก screens.js (npKv · planBody · quarterParts + MANUAL_ROW · wst · whParts · planAs · EDIT_FORM)
   แผนอ้างด้วย id = เลขที่ MR ตัด "MR " (เช่น Z7000004) ตาม routes.md · รถอ้างด้วยทะเบียนไม่มีจังหวัด (เช่น 82-6789) */
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import type { PillColor } from "@/components/vms/PillOutline";
import { CAND, DISTRICTS, LAST_OIL, NEW_PLAN_DATE, OIL_OPTS, PARTS, PART_PRICE, PLAN_CREATOR, REGIONS, RETURN_REASON, WH_ACK, WH_LIST, dCode, type ManualPart, type Plan, type PlanStatus } from "./data";
import { CAR_PICK } from "./data";
import { carQty, inQuarter, quarterParts, type Draft } from "./plan";
import { notify, setMock, useRole, type Role } from "./store";

/* ---------- id ของแผนและรถใน query string ---------- */
export const planId = (p: Plan) => p.mr.replace(/^MR /, "");
export const findPlan = (plans: Plan[], id: string | null) => (id ? plans.find((p) => planId(p) === id) : undefined);
export const carParam = (i: number) => CAND[i].plate.split(" ")[0];
export const carIndexOf = (param: string | null) => (param ? CAND.findIndex((c) => c.plate.split(" ")[0] === param) : -1);

/* ---------- หน้าเริ่มของบทบาท (routes.md §2) · บทบาทที่ไม่มีสิทธิ์เปิดหน้า → กลับราก ---------- */
export const ROLE_HOME: Partial<Record<Role, string>> = { "ผู้อนุมัติ": "/approvals/plans/", "กบค. คลัง": "/warehouse/" };

/* ค่าจาก localStorage อ่านได้หลัง hydrate เท่านั้น (ส่งออก static) — ก่อนหน้านั้นยังไม่รู้ว่ามีแผนไหน/บทบาทอะไร */
const noop = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
export function useRoleGuard(allowed: readonly Role[]) {
  const router = useRouter();
  const role = useRole();
  const ready = useHydrated();
  const ok = allowed.includes(role);
  useEffect(() => { if (ready && !ok) router.replace("/"); }, [ready, ok, router]);
  return ready && ok;
}

/* ---------- สี Badge outline ของหัวหน้า (BADGE_OF ใน core.js: Warning/Info → Brand) ---------- */
export const badgeOf = (c: PillColor): BadgeOutlineColor => (c === "Warning" || c === "Info" ? "Brand" : c === "Gray" || c === "Success" || c === "Error" || c === "Brand" ? c : "Gray");

/* ---------- แผน ↔ ฟอร์ม ---------- */
type Alloc = Pick<Draft, "alloc" | "picks" | "qty" | "manual">;
export const allocOf = (p: Plan): Alloc => ({ alloc: p.alloc ?? {}, picks: p.picks ?? {}, qty: p.qty, manual: p.manual });

export function draftFromPlan(p: Plan): Draft {
  const regions = p.regions ?? REGIONS.filter((r) => p.region.split(", ").includes(r));
  return {
    name: p.name, year: p.year, regions, districts: p.districts ?? [], types: p.types ?? p.type.split(", "),
    alloc: { ...(p.alloc ?? {}) }, picks: { ...(p.picks ?? {}) }, qty: p.qty ? { ...p.qty } : undefined, manual: p.manual ? { ...p.manual } : undefined,
    q: 1, editOf: p.mr,
  };
}
/* ค่าที่เทียบว่าแก้ไขแล้วหรือยัง (ไม่นับแท็บที่เปิด) */
export const draftKey = (d: Draft) => JSON.stringify([d.name, d.year, d.regions, d.districts, d.types, d.alloc, d.picks, d.qty ?? {}, d.manual ?? {}]);

/* บันทึกการแก้ไข (S19): กลับเป็นรออนุมัติทุกสถานะ เลขที่ MR เดิม */
export function planWithDraft(p: Plan, d: Draft, today: string): Plan {
  const per = [1, 2, 3, 4].map((q) => inQuarter(d, q).length);
  const { returnReason: _r, ...rest } = p;
  void _r;
  return {
    ...rest, name: d.name.trim(), region: d.regions.join(", "), type: d.types.join(", "), cars: Object.keys(d.alloc).length,
    perQ: per.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · "), status: "review", sentAt: today,
    regions: d.regions, districts: d.districts, types: d.types, alloc: d.alloc, picks: d.picks, qty: d.qty, manual: d.manual,
  };
}

/* ---------- รถและอะไหล่ ---------- */
export const oilOf = (a: Alloc, i: number) => OIL_OPTS[(a.picks[i] || []).includes(0) ? 1 : 0];
/* จำนวนรายการอะไหล่ของรถ = อะไหล่ที่เลือก + รายการเพิ่มเติม (screens.js count()) */
export const partCount = (a: Alloc, i: number) => (a.picks[i] || []).length + (a.manual?.[i] || []).length;
export const partCell = (a: Alloc, i: number) => (partCount(a, i) ? partCount(a, i) + " รายการ" : "ยังไม่เลือก");
export const carsIn = (a: Alloc, q: number) => Object.keys(a.alloc).map(Number).filter((i) => a.alloc[i] === q);
export const carRow = (a: Alloc, i: number) => [CAND[i].plate, CAND[i].model, CAND[i].owner, oilOf(a, i), LAST_OIL[i], partCell(a, i)];

/* อะไหล่ในไตรมาส: อะไหล่จากคลัง (ต่อคัน × คันที่เลือก) + รายการเพิ่มเติม (หมวด "เพิ่มเอง" · รหัสว่าง = "-") */
export interface QuarterRow { key: string; name: string; code: string; group: string; qty: number; unit: string; pi?: number; stock?: number }
export function quarterRows(a: Alloc, q: number): QuarterRow[] {
  const d = { ...a, name: "", year: "", regions: [], districts: [], types: [], q } as Draft;
  const rows: QuarterRow[] = quarterParts(d, q).map(([pi, n]) => ({ key: "p" + pi, name: PARTS[pi].name, code: PARTS[pi].code, group: PARTS[pi].group, qty: n, unit: PARTS[pi].unit, pi, stock: PARTS[pi].stock }));
  const man = new Map<string, QuarterRow>();
  carsIn(a, q).forEach((c) => (a.manual?.[c] || []).forEach((m) => {
    const k = "m" + m.name + "|" + m.code;
    const r = man.get(k);
    if (r) r.qty += m.qty; else man.set(k, { key: k, name: m.name, code: m.code || "-", group: "เพิ่มเอง", qty: m.qty, unit: "ชิ้น" });
  }));
  return rows.concat([...man.values()]);
}
/* เอาอะไหล่แถวนี้ออกจากรถทุกคันในไตรมาส (ยืนยันการเอาอะไหล่ออก ของ S1) */
export function dropQuarterRow(a: Alloc, q: number, r: QuarterRow): Pick<Draft, "picks" | "manual" | "qty"> {
  const picks = { ...a.picks }, manual = { ...(a.manual ?? {}) }, qty = { ...(a.qty ?? {}) };
  carsIn(a, q).forEach((c) => {
    if (r.pi != null) { picks[c] = (picks[c] || []).filter((x) => x !== r.pi); if (qty[c]) { const { [r.pi]: _x, ...k } = qty[c]; void _x; qty[c] = k; } }
    else if (manual[c]) manual[c] = manual[c].filter((m) => "m" + m.name + "|" + m.code !== r.key);
  });
  return { picks, manual, qty };
}
/* รวมค่าอะไหล่ของรถ 1 คัน (RequestedPartsPanel · เบิกจากคลัง = อะไหล่จากคลัง + รายการเพิ่มเติม) */
export const carCost = (picks: number[], qty: Record<number, number> | undefined, manual: ManualPart[]) =>
  picks.reduce((s, pi) => s + (qty?.[pi] ?? carQty({}, 0, pi)) * PART_PRICE[pi], 0) + manual.reduce((s, m) => s + (parseFloat(m.price.replace(/,/g, "")) || 0) * m.qty, 0);

/* ---------- กล่องรายละเอียดแผน (npKv) ---------- */
export function planKv(p: Plan): [string, string][] {
  const dist = p.alloc && Object.keys(p.alloc).length ? [...new Set(Object.keys(p.alloc).map((i) => dCode(CAND[Number(i)])))].sort().join(", ") : (p.districts ?? []).join(", ") || "-";
  return [["ชื่อแผน", p.name], ["ปีงบประมาณ", p.year], ["ภาค", p.region], ["เขต", dist], ["ประเภทรถ", p.type], ["รถรายไตรมาส", p.perQ],
    ["จำนวนรถ", p.cars + " คัน"], ["เลขที่ MR", p.mr], ["ผู้สร้างแผน", PLAN_CREATOR], ["วันที่ส่ง", p.sentAt ?? p.created]];
}
/* จำนวนรถรายไตรมาสจาก perQ (แผนตัวอย่างที่ไม่มีรายคัน) หรือจากการจัดรถ */
export const quarterCount = (p: Plan, q: number) => (p.alloc ? carsIn(allocOf(p), q).length : Number((p.perQ.match(new RegExp("ไตรมาส " + q + ": (\\d+)")) || [])[1] || 0));

/* ---------- คลังรับทราบ (S22 wst) ---------- */
export const whQuarters = (p: Plan) => [1, 2, 3, 4].filter((q) => quarterCount(p, q) > 0);
export const warehouseStatus = (n: number, of: number): [string, PillColor] =>
  n === 0 ? ["รอรับทราบ", "Warning"] : n < of ? ["รับทราบ " + n + "/" + of + " ไตรมาส", "Info"] : ["รับทราบครบแล้ว", "Success"];
/* จำนวนที่รับทราบ: ข้อมูลจริง (ack) หรือค่าตัวอย่างของหน้า (WH_LIST สำหรับหน้าคลัง · WH_ACK สำหรับหน้า กบค.) */
export const ackCount = (p: Plan, page: "warehouse" | "kbk") => (p.ack ? Object.keys(p.ack).length : page === "warehouse" ? WH_LIST[p.mr]?.acked ?? 0 : WH_ACK[p.mr] ?? 0);
export const whStatusOf = (p: Plan) => warehouseStatus(ackCount(p, "warehouse"), whQuarters(p).length);
/* อะไหล่ที่ต้องเบิกของไตรมาส เทียบคงเหลือ (whParts) */
export const whRows = (p: Plan, q: number) => quarterRows(allocOf(p), q).map((r) => [r.name, r.code, String(r.qty), r.unit, r.stock != null ? String(r.stock) : "-", r.stock != null && r.qty > r.stock ? String(r.qty - r.stock) : "-"]);

/* ---------- แผนตัวอย่าง (NEW_PLAN + EDIT_FORM ของ screens.js) สำหรับเปิด scenario จาก /scenarios/ ---------- */
const A_ALL: Record<number, number> = { 0: 1, 1: 1, 2: 1, 3: 2, 5: 2, 6: 3 };
export const R2 = { regions: [REGIONS[1]], districts: [...DISTRICTS[REGIONS[1]]], types: ["รถกระเช้า"] };
export function samplePlan(status: PlanStatus, acked?: number[]): Plan {
  const p: Plan = {
    mr: "MR Z7000004", name: "บำรุงรักษารถกระเช้า ภาค 2 ปีงบประมาณ 2570", region: REGIONS[1], nowQ: "ไตรมาส 1", cars: 6, status, created: NEW_PLAN_DATE,
    type: "รถกระเช้า", year: "2570", perQ: "ไตรมาส 1: 3 · ไตรมาส 2: 2 · ไตรมาส 3: 1 · ไตรมาส 4: 0",
    ...R2, alloc: { ...A_ALL }, picks: Object.fromEntries(Object.keys(A_ALL).map((i) => [i, [...CAR_PICK]])),
  };
  if (status === "returned") p.returnReason = RETURN_REASON;
  if (status === "approved" || status === "active") { p.approvedAt = "31/10/2569"; p.ack = Object.fromEntries((acked ?? []).map((q) => [q, "02/11/2569"])); }
  return p;
}
/* ฟอร์มสร้างแผนของ S21 T.1: กรอกชื่อ ปี ตัวกรองครบ จัดรถ 6 คัน ยังไม่เลือกอะไหล่ */
export const sampleDraft = (): Draft => ({ name: "บำรุงรักษารถกระเช้า ภาค 2 ปีงบประมาณ 2570", year: "2570", ...R2, alloc: { ...A_ALL }, picks: {}, q: 1 });

/* ---------- การกระทำกับแผน ---------- */
export const DELETE_CONFIRM = { danger: true, title: "ยืนยันการลบแผน", sub: "เมื่อลบแล้วจะไม่สามารถกู้คืนข้อมูลได้ ต้องการลบใช่หรือไม่", cancel: "ยกเลิก", ok: "ยืนยัน" };
/* S20 ลบแผน (ก่อนอนุมัติ) — เลขที่ MR ไม่นำกลับมาใช้ซ้ำ · toast "ลบแผนบำรุงรักษาสำเร็จ" */
export function deletePlan(mr: string) {
  setMock((s) => ({ ...s, plans: s.plans.filter((p) => p.mr !== mr), retiredMr: [...(s.retiredMr ?? []), mr] }));
  notify("ลบแผนบำรุงรักษาสำเร็จ");
}
/* แก้ไขค่าของแผน 1 แผน */
export const updatePlan = (mr: string, fn: (p: Plan) => Plan) => setMock((s) => ({ ...s, plans: s.plans.map((p) => (p.mr === mr ? fn(p) : p)) }));
/* เริ่มฟอร์มแก้ไข (S19) จากข้อมูลแผนล่าสุด */
export const startEdit = (p: Plan) => setMock((s) => ({ ...s, edit: draftFromPlan(p) }));
