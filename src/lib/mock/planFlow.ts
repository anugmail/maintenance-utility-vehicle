"use client";
/* ตัวช่วยของวงจรแผน S2 S19 S20 S21 — ยกจาก screens.js (npKv · planBody · quarterParts + MANUAL_ROW · planAs · EDIT_FORM) · S22 (wst · whParts) ตัดออก 6 พ.ย. 2569
   แผนอ้างด้วย id = เลขที่ MR ตัด "MR" (เช่น Z7000004) ตาม routes.md · รถอ้างด้วยทะเบียนไม่มีจังหวัด (เช่น 82-6789) */
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import type { PillColor } from "@/components/vms/PillOutline";
import { FIG_FLEET, CAND, DISTRICTS, LAST_OIL, NEW_PLAN_DATE, OIL_OPTS, OIL_PLAN_OPTS, OIL_SPEC, PARTS, PART_PRICE, REGIONS, RETURN_REASON, UNIT_FLEET, creatorOf, dCode, oilChanges, unitOf, type ManualPart, type Plan, type PlanStatus } from "./data";
import { CAR_PICK } from "./data";
import { allocScope, carQty, inQuarter, quarterParts, type Draft } from "./plan";
import { accPlans, accRows } from "./acceptance";
import { notify, setMock, useRole, type MockState, type Role } from "./store";
import { SAMPLE_PLAN_Q, candId, tripsOf } from "./trips";

/* ---------- id ของแผนและรถใน query string ---------- */
export const planId = (p: Plan) => p.mr.replace(/^MR/, "");
export const findPlan = (plans: Plan[], id: string | null) => (id ? plans.find((p) => planId(p) === id) : undefined);
export const carParam = (i: number) => CAND[i].plate.split(" ")[0];
export const carIndexOf = (param: string | null) => (param ? CAND.findIndex((c) => c.plate.split(" ")[0] === param) : -1);

/* ---------- หน้าเริ่มของบทบาท (routes.md §2) · บทบาทที่ไม่มีสิทธิ์เปิดหน้า → กลับราก ---------- */
export const ROLE_HOME: Partial<Record<Role, string>> = {
  "ผู้อนุมัติ": "/approvals/plans/", "หัวหน้าหน่วยงาน": "/head-review/", "กรย.": "/trips-view/", "หน่วยงานเจ้าของยานพาหนะ": "/trips-view/",
};
/* หน้าเริ่มที่ขึ้นกับข้อมูล (ต้นแบบ — sidebar เมนูอื่นยังไม่พาไปไหน ⇒ เข้ารากแล้วไปหน้าที่มีงานรอ · COMPOSED.md หัวข้อ ช.)
   ผู้อนุมัติ: มีแผนเดินทางรออนุมัติ → /approvals/trips/ · หน่วยงานเจ้าของรถ: มีรถรอยอมรับผล / แผนพร้อมตรวจหลักฐาน → /acceptance/
   (ผู้รับจ้าง → แผนจ้างใบล่าสุด เอาออกพร้อมบทบาท 4 พ.ย. 2569 · S23 ตัดออก) */
export function roleHome(role: Role, m: MockState): string | undefined {
  const trips = tripsOf(m).filter((t) => !t.listOnly);
  if (role === "ผู้อนุมัติ" && trips.some((t) => t.status === "review")) return "/approvals/trips/";
  if (role === "หน่วยงานเจ้าของยานพาหนะ" && (accRows(m).some((r) => !r.accepted) || accPlans(m).some((p) => p.ready && !p.done))) return "/acceptance/";
  return ROLE_HOME[role];
}

/* ค่าจาก localStorage อ่านได้หลัง hydrate เท่านั้น (ส่งออก static) — ก่อนหน้านั้นยังไม่รู้ว่ามีแผนไหน/บทบาทอะไร */
const noop = () => () => {};
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
/* หน่วยงานของบทบาทผู้สร้างแผน (6 พ.ย. 2569 รอบ 2: กบค. สร้างแผนได้ · แผนของหน่วยงานอื่น กบค. ดูอย่างเดียว) — ไม่ใช่ผู้สร้างแผน = undefined */
/* 9 พ.ย. 2569 persona 3 หน่วยงาน (Figma 9d7d1a7 · ownPlans / allPlans ของ screens.js): กกฟ.1 กกฟ.2 กรย. สร้างแผนได้ หน้ารายการเห็นเฉพาะแผนของหน่วยงานตัวเอง (A.1 A.39 A.40)
   · กบค. เห็นแผนทุกหน่วยงาน (A.31) สร้างแผนของ กบค. ได้ แผนของหน่วยงานอื่นดูอย่างเดียว */
export const UNIT_ROLES: Partial<Record<Role, string>> = { "หน่วยงาน (กกฟ.1)": "กกฟ.1", "หน่วยงาน (กกฟ.2)": "กกฟ.2", "หน่วยงาน (กรย.)": "กรย." };
export const PLAN_ROLES: readonly Role[] = [...(Object.keys(UNIT_ROLES) as Role[]), "กบค."];
export const roleUnit = (r: Role) => UNIT_ROLES[r] ?? (r === "กบค." ? "กบค." : undefined);
/* แผนที่บทบาทนี้เห็นในหน้ารายการ: กบค. = ทุกหน่วยงาน (allPlans) · ผู้สร้างแผนของหน่วยงาน = แผนของหน่วยงานตัวเอง (ownPlans) */
export const visiblePlans = (r: Role, plans: Plan[]) => (r === "กบค." ? plans : plans.filter((p) => unitOf(p.mr, p.unit) === roleUnit(r)));
/* จัดการแผนนี้ได้ (แก้ไข ลบ ตามสถานะ): ผู้สร้างแผนของหน่วยงานนั้นเท่านั้น (หน่วยงาน กกฟ.1 กกฟ.2 กรย. · กบค. = แผนของ กบค. · planRow view) */
export const canManage = (r: Role, p: Plan) => { const u = roleUnit(r); return !!u && unitOf(p.mr, p.unit) === u; };
/* ---------- สิทธิ์ต่อแผน (ตรวจสิทธิ์ 9 พ.ย. 2569 เจ้าของงาน "ทำไมหน้านี้ของ กกฟ2 เข้ามาในฐานะ กกฟ2 ก็ยังดูแผนการเดินทาง สร้างแผนการเดินทาง ไม่ได้ น่าจะเป็นเรื่อง permission") ----------
   ownsPlan = หน่วยงานของบทบาท (UNIT_ROLES · กบค. = กบค.) ตรงกับหน่วยงานเจ้าของแผน ⇒ ทำงานทุกขั้นของแผนนั้นได้ (แก้ไข ลบ ไตรมาส แผนเดินทาง งานรายคัน ส่งประวัติ รายงานผล)
   planAccess: own = เจ้าของ · view = กบค. ดูแผนของหน่วยงานอื่น (A.32 ดูอย่างเดียว) และบทบาทที่ไม่ใช่ผู้ดำเนินการ (ผู้อนุมัติ กรย. เจ้าของยานพาหนะ หัวหน้าหน่วยงาน · หน้าของบทบาทนั้นคุมสิทธิ์เอง)
   · none = หน่วยงาน (กกฟ.1 กกฟ.2 กรย.) เปิดแผนของหน่วยงานอื่นด้วย URL ⇒ กลับหน้ารายการ (แบบแผนที่ไม่มีแล้ว · ไม่แสดงข้อมูล) */
export const ownsPlan = (r: Role, p?: Plan) => !!p && canManage(r, p);
export type PlanAccess = "own" | "view" | "none";
export const planAccess = (r: Role, p?: Plan): PlanAccess => (!p ? "none" : canManage(r, p) ? "own" : UNIT_ROLES[r] ? "none" : "view");
/** หน่วยงานเปิดแผนของหน่วยงานอื่น → หน้ารายการ · คืน true ระหว่างพาไป (หน้าไม่ต้องแสดงอะไร) */
export function usePlanGate(plan: Plan | undefined, need: "view" | "own" = "view") {   // need = "own" หน้าแก้ไข (อะไหล่รายคัน S21) ต้องเป็นเจ้าของแผน
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

/* ---------- สี Badge outline ของหัวหน้า (BADGE_OF ใน core.js: Warning/Info → Brand) ---------- */
export const badgeOf = (c: PillColor): BadgeOutlineColor => (c === "Warning" || c === "Info" ? "Brand" : c === "Gray" || c === "Success" || c === "Error" || c === "Brand" ? c : "Gray");

/* ---------- แผน ↔ ฟอร์ม ---------- */
type Alloc = Pick<Draft, "alloc" | "picks" | "qty" | "manual" | "oils" | "oilSpec" | "draw">;
export const allocOf = (p: Plan): Alloc => ({ alloc: p.alloc ?? {}, picks: p.picks ?? {}, qty: p.qty, manual: p.manual, oils: p.oils, oilSpec: p.oilSpec, draw: p.draw });

/* แผนตัวอย่าง (ไม่มี alloc) เปิดแก้ไข = ยานพาหนะรายไตรมาสชุดเดียวกับหน้ารายละเอียด (SAMPLE_PLAN_Q · ข้อ 38) กำหนดอะไหล่แล้วทุกคัน
   (ไส้กรอง CAR_PICK · น้ำมันเก็บตัวอย่าง = ยอดเดียวกับ carParts ของแผนตัวอย่าง) — 9 พ.ย. 2569 เจ้าของงาน หน้าแก้ไขแผนที่ถูกส่งกลับ "จัดลงไตรมาสแล้ว 6/243 คัน" ส่งไม่ได้
   ⇒ เปิดแล้วส่งอนุมัติใหม่ได้ทันที (MRZ7100001 = 9 คัน 3 · 2 · 2 · 2) */
function sampleAlloc(p: Plan): Pick<Draft, "alloc" | "picks" | "oils"> {
  const alloc: Record<number, number> = {}, picks: Record<number, number[]> = {}, oils: Record<number, number> = {};
  [1, 2, 3, 4].forEach((q) => (SAMPLE_PLAN_Q[p.mr]?.[q] ?? []).forEach((c) => {
    const i = CAND.findIndex((x) => candId(x.plate) === c.id);
    if (i >= 0) { alloc[i] = q; picks[i] = [...CAR_PICK]; oils[i] = 0; }
  }));
  return { alloc, picks, oils };
}
export function draftFromPlan(p: Plan): Draft {
  const regions = p.regions ?? REGIONS.filter((r) => p.region.split(", ").map((x) => x.split(" (")[0]).includes(r.split(" (")[0]));
  if (!p.alloc || !Object.keys(p.alloc).length) {
    const s = sampleAlloc(p);
    return { name: p.name, year: p.year, regions, districts: p.districts ?? [], types: p.types ?? p.type.split(", ").filter(Boolean), ...s, q: 1, editOf: p.mr };
  }
  return {
    name: p.name, year: p.year, regions, districts: p.districts ?? [], types: p.types ?? p.type.split(", ").filter(Boolean),
    alloc: { ...(p.alloc ?? {}) }, picks: { ...(p.picks ?? {}) }, qty: p.qty ? { ...p.qty } : undefined, manual: p.manual ? { ...p.manual } : undefined,
    oils: p.oils ? { ...p.oils } : undefined, oilSpec: p.oilSpec ? { ...p.oilSpec } : undefined, draw: p.draw ? { ...p.draw } : undefined,
    q: 1, editOf: p.mr,
  };
}
/* ค่าที่เทียบว่าแก้ไขแล้วหรือยัง (ไม่นับแท็บที่เปิด) */
export const draftKey = (d: Draft) => JSON.stringify([d.name, d.year, d.regions, d.districts, d.types, d.alloc, d.picks, d.qty ?? {}, d.manual ?? {}, d.oils ?? {}, d.oilSpec ?? {}, d.draw ?? {}]);

/* บันทึกการแก้ไข (S19): กลับเป็นรออนุมัติทุกสถานะ เลขที่ MR เดิม */
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

/* ---------- รถและอะไหล่ ---------- */
/* น้ำมันไฮโดรลิกของรถ: กำหนดในหน้า S21 แล้ว (oils) = OIL_PLAN_OPTS · แผนตัวอย่าง/ที่เก็บเก่า = picks มี 0 → เปลี่ยนน้ำมัน */
export const oilChoice = (a: Alloc, i: number): number | null => a.oils?.[i] ?? (a.picks[i] ? ((a.picks[i] || []).includes(0) ? 1 : 0) : null);
export const oilOf = (a: Alloc, i: number) => (a.oils?.[i] != null ? OIL_PLAN_OPTS[a.oils[i]] : OIL_OPTS[(a.picks[i] || []).includes(0) ? 1 : 0]);
/* ช่อง น้ำมันไฮโดรลิก · อะไหล่อื่นๆ ของแท็บไตรมาส n (oilCell · partList · partCell ใน screens.js 5 พ.ย. 2569) */
export const TODO_NONE = "ยังไม่กำหนด";
export const oilCellOf = (a: Alloc, i: number): string | { text: string; sub?: string } => {
  const k = oilChoice(a, i);
  if (k == null) return TODO_NONE;
  const sp = a.oilSpec?.[i], grade = sp?.grade || OIL_SPEC.grade, litre = a.qty?.[i]?.[0] ?? (sp?.litre ? Number(sp.litre) : carQty(a, i, 0));
  return { text: OIL_PLAN_OPTS[k], sub: k ? grade + " · " + litre + " ลิตร" : grade };
};
export const otherParts = (a: Alloc, i: number) => (a.picks[i] || []).filter((x) => x !== 0).map((x) => PARTS[x].name).concat((a.manual?.[i] || []).map((m) => m.name));
export const NO_DRAW = "ไม่เบิกอะไหล่";   // 6 พ.ย. 2569 คันที่เลือกไม่เบิกอะไหล่ (ช่องอะไหล่อื่นๆ ของแท็บไตรมาส · ช่องอะไหล่ของรายละเอียดแผน)
export const otherCellOf = (a: Alloc, i: number): string | { text: string; sub: string } => {
  if (a.draw?.[i] === "none") return NO_DRAW;
  const l = otherParts(a, i);
  return l.length ? { text: l.length + " รายการ", sub: l[0] + (l.length > 1 ? " และอื่น ๆ" : "") } : TODO_NONE;
};
/* จำนวนรายการอะไหล่ของรถ = อะไหล่ที่เลือก + รายการเพิ่มเติม (screens.js count()) */
export const partCount = (a: Alloc, i: number) => (a.picks[i] || []).length + (a.manual?.[i] || []).length;
export const partCell = (a: Alloc, i: number) => (a.draw?.[i] === "none" ? NO_DRAW : partCount(a, i) ? partCount(a, i) + " รายการ" : "ยังไม่เลือก");
export const carsIn = (a: Alloc, q: number) => Object.keys(a.alloc).map(Number).filter((i) => a.alloc[i] === q);
export const carRow = (a: Alloc, i: number) => [CAND[i].plate, CAND[i].model, CAND[i].owner, oilOf(a, i), LAST_OIL[i], partCell(a, i)];

/* อะไหล่ในไตรมาส: อะไหล่จากคลัง (ต่อคัน × คันที่เลือก) + รายการเพิ่มเติม (หมวด "เพิ่มเอง" · รหัสว่าง = "-") */
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
/* อะไหล่รวมทุกไตรมาส (แท็บ "ทั้งหมด" ของฟอร์มแผน · เจ้าของงาน 9 พ.ย. 2569 "หน้าอะใหล่ทั้งไตรมาส ต้องรวมมาให้ด้วย ทั้งไตรมาส")
   = ผลรวมแถวของ quarterRows ไตรมาส 1–4 ตามรายการ (คีย์เดียวกัน) · รถทุกคันที่จัดลงไตรมาสแล้ว ไม่ขึ้นกับตัวกรอง/คำค้น · คันที่ไม่เบิกไม่รวม · อะไหล่จากคลังเรียงตาม PARTS แล้วตามด้วยรายการที่ระบุเอง */
export function allQuarterRows(a: Alloc): QuarterRow[] {
  const m = new Map<string, QuarterRow>();
  [1, 2, 3, 4].forEach((q) => quarterRows(a, q).forEach((r) => { const x = m.get(r.key); if (x) x.qty += r.qty; else m.set(r.key, { ...r }); }));
  const rows = [...m.values()];
  return rows.filter((r) => r.pi != null).sort((x, y) => (x.pi ?? 0) - (y.pi ?? 0)).concat(rows.filter((r) => r.pi == null));
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
  picks.reduce((s, pi) => s + (qty?.[pi] ?? carQty({}, 0, pi)) * PART_PRICE[pi], 0) + manual.reduce((s, m) => s + (parseFloat((m.price ?? "").replace(/,/g, "")) || 0) * m.qty, 0);

/* ---------- กล่องรายละเอียดแผน (npKv) ---------- */
/* 6 พ.ย. 2569 รีวิว S6 "ภาค เปลี่ยน หน่วยงาน" + "ย้ายประเภท มาไว้ในคอลัมม์" (เจ้าของงานยืนยัน · npKv / PLAN_KV ของ screens.js)
   ⇒ ช่องภาคเป็นหน่วยงานเจ้าของแผน · ไม่มีประเภทยานพาหนะในกล่อง (อยู่เป็นคอลัมน์รายคันของตารางยานพาหนะ) · 9 ช่อง */
export function planKv(p: Plan): [string, string][] {
  const dist = p.alloc && Object.keys(p.alloc).length ? [...new Set(Object.keys(p.alloc).map((i) => dCode(CAND[Number(i)])))].sort().join(", ") : (p.districts ?? []).join(", ") || "-";
  return [["ชื่อแผน", p.name], ["ปีงบประมาณ", p.year], ["หน่วยงาน", unitOf(p.mr, p.unit)], ["เขต", dist], ["ยานพาหนะรายไตรมาส", p.perQ],
    ["จำนวนยานพาหนะ", p.cars + " คัน"], ["เลขที่ MR", p.mr], ["ผู้สร้างแผน", creatorOf(p)], ["วันที่ส่ง", p.sentAt ?? p.created]];
}

/* จำนวนรถรายไตรมาสจาก perQ (แผนตัวอย่างที่ไม่มีรายคัน) หรือจากการจัดรถ */
export const quarterCount = (p: Plan, q: number) => (p.alloc ? carsIn(allocOf(p), q).length : Number((p.perQ.match(new RegExp("ไตรมาส " + q + ": (\\d+)")) || [])[1] || 0));

/* ---------- แผนตัวอย่าง (NEW_PLAN + EDIT_FORM ของ screens.js) สำหรับเปิด scenario จาก /scenarios/ ----------
   6 พ.ย. 2569: รถทุกคันที่ฟอร์มเห็นต้องอยู่ในไตรมาส · ทุกคันกำหนดอะไหล่แล้ว (A_PICKS · A_OILS) · 83-1207 ไม่เบิกอะไหล่ (A_DRAW)
   9 พ.ย. 2569 รถที่ฟอร์มเห็น = รถจำลองครบชุด (UNIT_FLEET = CAND 243 คัน) ⇒ แผนตัวอย่างจัดครบทุกคัน:
     รถ 10 คันของ screens.js (FIG_FLEET) ไตรมาสและอะไหล่ตาม A_ALL A_OILS A_DRAW ของ Figma · คันอื่นวนไตรมาส 1–4 ตามลำดับ เก็บตัวอย่างน้ำมัน + ไส้กรอง CAR_PICK (ค่าสมมติ) */
const FIG_A_ALL: number[] = [1, 1, 1, 2, 2, 2, 3, 4, 4, 3];          // A_ALL
const FIG_A_OILS: number[] = [2, 0, 2, 0, 0, 1, 0, 0, 1, 0];         // A_OILS (ลำดับใน OIL_PLAN_OPTS)
const FIG_A_DRAW: number[] = [4];                                    // A_DRAW { 4: 'none' }
const EXTRA = UNIT_FLEET.filter((i) => !FIG_FLEET.includes(i));
const A_ALL: Record<number, number> = { ...Object.fromEntries(FIG_FLEET.map((c, k) => [c, FIG_A_ALL[k]])), ...Object.fromEntries(EXTRA.map((c, k) => [c, (k % 4) + 1])) };
const A_OILS: Record<number, number> = { ...Object.fromEntries(FIG_FLEET.map((c, k) => [c, FIG_A_OILS[k]])), ...Object.fromEntries(EXTRA.map((c) => [c, 0])) };
const A_DRAW: Record<number, "none"> = Object.fromEntries(FIG_A_DRAW.map((k) => [FIG_FLEET[k], "none" as const]));
/* A_PICKS = CAR_PICK ทุกคันที่เบิก + น้ำมันไฮโดรลิก (ลำดับ 0) เมื่อเลือกเปลี่ยน (qAgg นับน้ำมันจาก A_OILS) */
const A_PICKS: Record<number, number[]> = Object.fromEntries(UNIT_FLEET.filter((c) => !A_DRAW[c]).map((c) => [c, oilChanges(A_OILS[c]) ? [0, ...CAR_PICK] : [...CAR_PICK]]));
/** จำนวนรถของแผนตัวอย่างในไตรมาส q (ใช้ในข้อความโหมดพาดู) */
export const SAMPLE_Q_CARS = (q: number) => Object.values(A_ALL).filter((x) => x === q).length;
export const SAMPLE_NAME = "บำรุงรักษายานพาหนะ กกฟ.1 ปีงบประมาณ 2570";   // NEW_PLAN[1]
/* R2 ของ screens.js = ภาค 2 ทุกเขต (6 พ.ย. 2569 ไม่มีประเภทแล้ว — ประเภทรถกระเช้าเดิมไม่มีในโค้ดจริง) */
export const R2 = { regions: [REGIONS[1]], districts: [...DISTRICTS[REGIONS[1]]], types: [] as string[] };
/* acked (ไตรมาสที่คลังรับทราบ · S22) ไม่มีหน้าไหนอ่านแล้วหลังตัด S22 6 พ.ย. 2569 — คงไว้ให้เคสพาดู S4 (cases/parts-progress) ที่ยังส่งค่านี้ เอาออกหลังรวมงาน S4 */
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
/* อะไหล่ของแผนตัวอย่างที่กำหนดครบทุกคัน (A_PICKS · A_OILS · A_DRAW) — ฟอร์มที่กรอกครบ ส่งอนุมัติได้ (โหมดพาดู) */
export const SAMPLE_PARTS = (): Pick<Draft, "picks" | "oils" | "draw"> => ({ picks: Object.fromEntries(Object.entries(A_PICKS).map(([i, v]) => [i, [...v]])), oils: { ...A_OILS }, draw: { ...A_DRAW } });
/* ฟอร์มสร้างแผนของ S21 T.1: กรอกชื่อ ปี ตัวกรองครบ จัดรถทุกคันที่ฟอร์มเห็น (UNIT_FLEET) ยังไม่เลือกอะไหล่ */
export const sampleDraft = (): Draft => ({ name: SAMPLE_NAME, year: "2570", ...R2, alloc: { ...A_ALL }, picks: {}, q: 1 });

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
