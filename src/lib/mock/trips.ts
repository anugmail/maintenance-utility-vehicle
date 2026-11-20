import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import type { PillColor } from "@/components/vms/PillOutline";
import type { StatusState } from "@/components/vms/Status";
import { CAND, FIG_EXTRA_IDS, PLANS, regionOf, type Plan } from "./data";
import { setMock, type MockState } from "./store";

export const NOW_Q = "ไตรมาส 1";
export const PLAN_ID = "Z7000001";

export interface TripCar { id: string; plate: string; model: string; owner: string; phone: string; ctrl: string }
export const TRIP_CARS: TripCar[] = [
  { id: "82-6789", plate: "82-6789 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", phone: "081-472-3365", ctrl: "นายสมชาย แก้วมณี" },
  { id: "82-1145", plate: "82-1145 ขอนแก่น", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 ขอนแก่น", phone: "081-472-3365", ctrl: "นายสมชาย แก้วมณี" },
  { id: "80-5738", plate: "80-5738 น่าน", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.2 น่าน", phone: "054-710-224", ctrl: "นายวีระ ทองคำ" },
  { id: "81-2210", plate: "81-2210 เชียงใหม่", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟน.1 เชียงใหม่", phone: "053-241-560", ctrl: "นายประยุทธ ศรีวงศ์" },
  { id: "80-9981", plate: "80-9981 ลำปาง", model: "Isuzu FTR + กระเช้า Aichi SH15A", owner: "กฟน.1 ลำปาง", phone: "089-635-1172", ctrl: "นายณรงค์ บุญมา" },
  { id: "82-3302", plate: "82-3302 อุดรธานี", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 อุดรธานี", phone: "042-221-908", ctrl: "นายสุรชัย พลอยงาม" },
  { id: "82-7720", plate: "82-7720 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", phone: "043-246-118", ctrl: "นายอำนาจ ไชยสิทธิ์" },
  { id: "80-3316", plate: "80-3316 พะเยา", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟน.1 พะเยา", phone: "054-411-737", ctrl: "นายบุญเลิศ คำแสน" },
  { id: "81-6604", plate: "81-6604 เชียงราย", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.1 เชียงราย", phone: "053-711-402", ctrl: "นายชาตรี อินทร์แก้ว" },
  { id: "80-4458", plate: "80-4458 แพร่", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟน.2 แพร่", phone: "054-511-226", ctrl: "นายพิชิต ปัญญาดี" },
];
export const candId = (plate: string) => plate.split(" ")[0];
const ownerPhone = (owner: string) => TRIP_CARS.find((c) => c.owner === owner)?.phone ?? "";
const ownerCtrl = (owner: string) => TRIP_CARS.find((c) => c.owner === owner)?.ctrl ?? "";
export const PLAN_CARS: TripCar[] = CAND.filter((c) => !TRIP_CARS.some((t) => t.id === candId(c.plate)) && !FIG_EXTRA_IDS.has(candId(c.plate)))
  .map((c) => ({ id: candId(c.plate), plate: c.plate, model: c.model, owner: c.owner, phone: ownerPhone(c.owner), ctrl: ownerCtrl(c.owner) }));
export const Q_EXTRA: TripCar[] = [
  { id: "81-9035", plate: "81-9035 ลำปาง", model: "Isuzu FTR + กระเช้า Aichi SK12A", owner: "กฟน.2 ลำปาง", phone: "054-218-330", ctrl: "นายเกรียงไกร มูลเมือง" },
  { id: "82-4417", plate: "82-4417 น่าน", model: "Hino FC + กระเช้า Tadano AT-121", owner: "กฟน.2 น่าน", phone: "054-710-244", ctrl: "นายสุเมธ จันทร์ดี" },
  { id: "80-6652", plate: "80-6652 ลำพูน", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.1 ลำพูน", phone: "053-511-090", ctrl: "นายวิทยา สายสุข" },
];
export const SAMPLE_Q: Record<number, TripCar[]> = {
  2: [
    { id: "81-7702", plate: "81-7702 ลำปาง", model: "Isuzu FTR + กระเช้า Aichi SK12A", owner: "กฟน.1 ลำปาง", phone: "054-217-411", ctrl: "นายไพโรจน์ ดวงใจ" },
    { id: "82-5530", plate: "82-5530 เชียงราย", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟน.1 เชียงราย", phone: "053-711-930", ctrl: "นายศักดิ์ชัย ทองแท้" },
    { id: "80-1189", plate: "80-1189 น่าน", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.2 น่าน", phone: "054-710-551", ctrl: "นายมานพ ศรีเมือง" },
  ],
  3: [{ id: "81-3348", plate: "81-3348 พะเยา", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟน.1 พะเยา", phone: "054-411-206", ctrl: "นายเอกชัย พรหมมา" }],
};
const perQCounts = (p: Pick<Plan, "perQ">) => [1, 2, 3, 4].map((q) => Number((p.perQ.match(new RegExp("ไตรมาส " + q + ": (\\d+)")) || [])[1] || 0));
const planRegions = (p: Pick<Plan, "region">) => p.region.split(", ").map((x) => x.split(" (")[0].trim());
export const SAMPLE_PLAN_Q: Record<string, Record<number, TripCar[]>> = (() => {
  const used = new Set([...TRIP_CARS, ...Q_EXTRA, ...Object.values(SAMPLE_Q).flat()].map((c) => c.id));
  const out: Record<string, Record<number, TripCar[]>> = {};
  for (const p of PLANS) {
    const regions = planRegions(p), types = p.type.split(", ");
    const pool = CAND.filter((c) => regions.includes(regionOf(c).split(" (")[0]) && types.includes(c.type)).map((c) => candId(c.plate));
    const take = (n: number) => { const ids: string[] = []; for (const id of pool) { if (ids.length >= n) break; if (!used.has(id)) { used.add(id); ids.push(id); } } return ids.map((id) => PLAN_CARS.find((c) => c.id === id)).filter((c): c is TripCar => !!c); };
    const base: Record<number, TripCar[]> = p.mr === "MR" + PLAN_ID ? { 1: TRIP_CARS, 2: SAMPLE_Q[2], 3: SAMPLE_Q[3] } : {};
    out[p.mr] = Object.fromEntries(perQCounts(p).map((n, k) => { const have = base[k + 1] ?? []; return [k + 1, [...have, ...take(Math.max(0, n - have.length))]]; }));
  }
  return out;
})();
export const carOf = (id: string) => TRIP_CARS.find((c) => c.id === id) ?? PLAN_CARS.find((c) => c.id === id) ?? Q_EXTRA.find((c) => c.id === id)
  ?? Object.values(SAMPLE_Q).flat().find((c) => c.id === id);
export interface QuarterEdit { added: string[]; removed: string[]; phones: Record<string, string>; locs: Record<string, string>; names?: Record<string, string> }
declare module "./store" {
  interface MockState { qcars?: Record<string, QuarterEdit> }
}
const qKey = (planId: string, q: number) => planId + "-" + q;
export const qEditOf = (s: Pick<MockState, "qcars">, planId: string, q: number): QuarterEdit => s.qcars?.[qKey(planId, q)] ?? { added: [], removed: [], phones: {}, locs: {} };
const planOfId = (plans: Plan[], planId: string) => plans.find((x) => x.mr === "MR" + planId);
const hasAlloc = (p?: Plan): p is Plan & { alloc: Record<number, number> } => !!p?.alloc && Object.keys(p.alloc).length > 0;
const candIndex = (id: string) => CAND.findIndex((c) => candId(c.plate) === id);
export function quarterCars(s: Pick<MockState, "plans" | "qcars">, planId: string, q: number): TripCar[] {
  const p = planOfId(s.plans, planId), e = qEditOf(s, planId, q);
  const nowQ = Number((p?.nowQ ?? "ไตรมาส 1").replace(/\D/g, "")) || 1;
  const base = hasAlloc(p)
    ? Object.keys(p.alloc).map(Number).filter((i) => p.alloc[i] === q && CAND[i]).map((i) => carOf(candId(CAND[i].plate))).filter((c): c is TripCar => !!c)
    : p ? SAMPLE_PLAN_Q[p.mr]?.[q] ?? [] : q === nowQ ? TRIP_CARS : [];
  const added = e.added.filter((id) => !e.removed.includes(id)).map(carOf).filter((c): c is TripCar => !!c);
  return [...added, ...base.filter((c) => !e.added.includes(c.id) && !e.removed.includes(c.id))];
}
export function quarterPool(s: Pick<MockState, "plans" | "qcars">, planId: string, q: number): TripCar[] {
  void q;
  const p = planOfId(s.plans, planId);
  const inAny = new Set([1, 2, 3, 4].flatMap((k) => quarterCars(s, planId, k).map((c) => c.id)));
  const first = !hasAlloc(p) && (!p || p.mr === "MR" + PLAN_ID) ? Q_EXTRA : [];
  const firstIds = new Set(first.map((c) => c.id));
  return [...first, ...CAND.map((c) => candId(c.plate)).filter((id) => !firstIds.has(id)).map(carOf)]
    .filter((c): c is TripCar => !!c && !inAny.has(c.id));
}
const perQOf = (alloc: Record<number, number>) => [1, 2, 3, 4].map((q) => "ไตรมาส " + q + ": " + Object.values(alloc).filter((x) => x === q).length).join(" · ");
function writeQuarter(planId: string, q: number, fn: (e: QuarterEdit) => QuarterEdit, allocFn?: (a: Record<number, number>) => Record<number, number>) {
  setMock((s) => {
    const qcars = { ...s.qcars, [qKey(planId, q)]: fn(qEditOf(s, planId, q)) };
    const plans = s.plans.map((p) => {
      if (p.mr !== "MR" + planId || !allocFn) return p;
      if (!hasAlloc(p)) {
        const n = [1, 2, 3, 4].map((k) => quarterCars({ plans: s.plans, qcars }, planId, k).length);
        return { ...p, cars: n.reduce((a, b) => a + b, 0), perQ: n.map((x, k) => "ไตรมาส " + (k + 1) + ": " + x).join(" · ") };
      }
      const alloc = allocFn({ ...p.alloc }), keep = (o?: Record<number, unknown>) => o && Object.fromEntries(Object.entries(o).filter(([k]) => alloc[Number(k)] != null));
      return { ...p, alloc, picks: keep(p.picks) as Plan["picks"], qty: keep(p.qty) as Plan["qty"], manual: keep(p.manual) as Plan["manual"], oils: keep(p.oils) as Plan["oils"], oilSpec: keep(p.oilSpec) as Plan["oilSpec"], cars: Object.keys(alloc).length, perQ: perQOf(alloc) };
    });
    return { ...s, plans, qcars };
  });
}
export function addQuarterCars(planId: string, q: number, ids: string[]) {
  writeQuarter(planId, q, (e) => ({ ...e, added: [...ids, ...e.added.filter((x) => !ids.includes(x))], removed: e.removed.filter((x) => !ids.includes(x)) }),
    (a) => { ids.forEach((id) => { const i = candIndex(id); if (i >= 0) a[i] = q; }); return a; });
}
export function removeQuarterCar(planId: string, q: number, id: string) {
  writeQuarter(planId, q, (e) => ({ ...e, added: e.added.filter((x) => x !== id), removed: [...e.removed.filter((x) => x !== id), id] }),
    (a) => { const i = candIndex(id); if (i >= 0 && a[i] === q) delete a[i]; return a; });
}
export function editQuarterCar(planId: string, q: number, o: Pick<QuarterEdit, "phones" | "locs" | "names">) {
  writeQuarter(planId, q, (e) => ({ ...e, phones: o.phones, locs: o.locs, names: o.names }));
}

export type TripStatus = "review" | "approved" | "returned";
export const TST: Record<TripStatus, [string, PillColor]> = {
  review: ["รออนุมัติ", "Warning"], approved: ["อนุมัติแล้ว", "Success"], returned: ["ส่งกลับแก้ไข", "Error"],
};
export const badgeOf = (p: [string, PillColor]): [string, BadgeOutlineColor] =>
  [p[0], p[1] === "Info" || p[1] === "Warning" || p[1] === "Brand" ? "Brand" : p[1] === "Success" ? "Success" : p[1] === "Error" ? "Error" : "Gray"];

export interface Trip {
  id: string; planId: string; quarter: number; name: string; mode: "self" | "hire";
  vendor?: string; contract?: string; carIds: string[];
  vendorTel?: string;
  locs: Record<string, string>; phones: Record<string, string>;
  names?: Record<string, string>;
  d1: string; d2: string; status: TripStatus; staff?: string[];
  staffTel?: Record<string, string>;
  works?: Record<string, [string, string]>;
  createdBy: string; sentAt: string; approvedAt?: string; returnReason?: string;
  listOnly?: boolean;
}
export const STAFF = ["นายวิชัย ทองดี", "นางสาวกนกวรรณ ใจมั่น", "นายสมชาย พูลสุข"];
export const STAFF_INFO: Record<string, [string, string]> = { "นายวิชัย ทองดี": ["วศ.8", "081-472-1180"], "นางสาวกนกวรรณ ใจมั่น": ["ชก.6", "089-221-4407"], "นายสมชาย พูลสุข": ["ชก.5", "086-530-2291"] };
export const staffPos = (name: string) => STAFF_INFO[name]?.[0] ?? "";
export const staffTelOf = (t: Pick<Trip, "staffTel"> | null | undefined, name: string) => t?.staffTel?.[name] ?? STAFF_INFO[name]?.[1] ?? "";
export const CREATOR = "นายวิชัย ทองดี (กบผ.)";
export const CREATOR_SHORT = "นายวิชัย ทองดี";
export const SENT_AT = "03/11/2569", APPROVED_AT = "04/11/2569";
export const VENDORS = [
  { name: "บริษัท สยามไฮดรอลิก เซอร์วิส จำกัด", types: "กระเช้าแก้ไฟ · กระเช้าฮอทไลน์", tel: "02-917-4410" },
  { name: "หจก. ช่างกลภาคอีสาน", types: "กระเช้าแก้ไฟ", tel: "043-224-918" },
  { name: "บริษัท เครนเทค เอ็นจิเนียริ่ง จำกัด", types: "รถพ่วงฉีดน้ำ", tel: "038-196-552" },
  { name: "หจก. ล้านนาไฮดรอลิก", types: "กระเช้าแก้ไฟ · รถพ่วงฉีดน้ำ", tel: "053-280-117" },
];
export const vendorTelOf = (t: Pick<Trip, "vendor" | "vendorTel">) => t.vendorTel || VENDORS.find((v) => v.name === t.vendor)?.tel || "";
export const TRIP_RETURN_REASON = "ช่วงวันที่ 03 ถึง 07/11/2569 ตรงกับแผนดับไฟของ กฟฉ.1 ขอนแก่น กรุณาเลื่อนเป็นสัปดาห์ถัดไป";

const base = { planId: PLAN_ID, quarter: 1, createdBy: CREATOR, sentAt: SENT_AT };
export const TRIP_1: Trip = { ...base, id: "T1", name: "ตรวจยานพาหนะ ขอนแก่น อุดรธานี ลำปาง", mode: "self", carIds: ["82-6789", "82-1145", "80-9981", "82-3302"],
  locs: { "80-9981": "จุดรวมงาน กฟน.1 ลำปาง" }, phones: { "80-9981": "086-552-1904" }, names: { "80-9981": "นายอนุชา ศรีสุข" }, d1: "03/11/2569", d2: "07/11/2569", status: "review", staff: STAFF,
  works: { "82-6789": ["03/11/2569", "04/11/2569"], "82-1145": ["03/11/2569", "04/11/2569"], "80-9981": ["05/11/2569", "06/11/2569"] } };
export const TRIP_2: Trip = { ...base, id: "T2", name: "ตรวจยานพาหนะ น่าน เชียงใหม่ เชียงราย", mode: "self", carIds: ["80-5738", "81-2210", "82-7720", "80-3316", "81-6604", "80-4458"],
  locs: {}, phones: {}, d1: "17/11/2569", d2: "21/11/2569", status: "review", staff: STAFF };
export const TRIP_V: Trip = { ...base, id: "TV", name: "จ้างบำรุงรักษา น่าน เชียงใหม่ เชียงราย", mode: "hire", vendor: VENDORS[0].name, contract: "สจ.69-0142",
  carIds: ["80-5738", "81-2210", "82-7720", "80-3316", "81-6604", "80-4458"], locs: { "82-7720": "ศูนย์บริการผู้รับจ้าง สาขาขอนแก่น" }, phones: { "82-7720": "095-118-4420" }, names: { "82-7720": "นายธนพล วงศ์ใหญ่" },
  d1: "17/11/2569", d2: "21/11/2569", status: "review" };
export const TRIP_OTHER: Trip = { ...base, id: "TO", name: "ตรวจรถพ่วงฉีดน้ำ นครราชสีมา บุรีรัมย์", mode: "self", carIds: ["82-6789", "82-1145", "80-5738"],
  locs: {}, phones: {}, d1: "10/11/2569", d2: "12/11/2569", status: "review", staff: STAFF, listOnly: true };

const U2_Q2 = SAMPLE_PLAN_Q["MRZ7000002"]?.[2] ?? [];
const u2 = { planId: "Z7000002", quarter: 2, mode: "self" as const, locs: {}, phones: {}, staff: [STAFF[1], STAFF[2]], createdBy: "นายอนุชา บุญมา (กปส.)", sentAt: "25/03/2570" };
export const TRIP_U2: Trip[] = U2_Q2.length >= 4 ? [
  { ...u2, id: "T20", name: "ตรวจรถพ่วงฉีดน้ำ ภาค 2 รอบที่ 1", carIds: U2_Q2.slice(0, 2).map((c) => c.id), d1: "06/04/2570", d2: "08/04/2570", status: "approved", approvedAt: "27/03/2570" },
  { ...u2, id: "T21", name: "ตรวจรถพ่วงฉีดน้ำ ภาค 2 รอบที่ 2", carIds: U2_Q2.slice(2, 4).map((c) => c.id), d1: "20/04/2570", d2: "22/04/2570", status: "review" },
] : [];
export const DEFAULT_TRIPS = (): Trip[] => [{ ...TRIP_OTHER }, ...TRIP_U2.map((t) => ({ ...t }))];

export const tripBy = (t: Trip) => t.vendor || "ดำเนินการเอง";
export const tripLoc = (t: Pick<Trip, "locs">, c: TripCar) => t.locs[c.id] || "สำนักงาน " + c.owner;
export const tripPhone = (t: Pick<Trip, "phones">, c: TripCar) => t.phones[c.id] || c.phone || "-";
export const tripCtrl = (t: Pick<Trip, "names"> | null, c: TripCar) => t?.names?.[c.id] || c.ctrl || "-";
export const ctrlCell = (t: Pick<Trip, "phones" | "names"> | null, c: TripCar) => ({ text: (t && t.phones[c.id]) || c.phone || "-", sub: tripCtrl(t, c) });
export const locCell = (t: Pick<Trip, "locs">, c: TripCar) => ({ text: tripLoc(t, c), sub: t.locs[c.id] ? "แก้จากสำนักงานเจ้าของยานพาหนะ" : "ค่าเริ่มต้น สำนักงานที่ยานพาหนะอยู่" });
export const tripRange = (t: Pick<Trip, "d1" | "d2">) => t.d1 + " – " + t.d2;
export const vTrip = (t: Pick<Trip, "d1" | "d2" | "works" | "locs" | "phones" | "names" | "mode">) => ({ d1: t.d1, d2: t.d2, works: t.works, locs: t.locs, phones: t.phones, names: t.names, hire: t.mode === "hire" });
export const tripPlaces = (t: Trip) => {
  const cars = t.carIds.map(carOf).filter((c): c is TripCar => !!c);
  const n = new Set(cars.map((c) => tripLoc(t, c))).size, own = cars.filter((c) => !t.locs[c.id]).length;
  return n + " แห่ง" + (own ? " (สำนักงานเจ้าของยานพาหนะ " + own + " คัน)" : "");
};
export const tripCars = (t: Trip, only?: string) => t.carIds.map(carOf).filter((c): c is TripCar => !!c && (!only || c.owner === only));

export const tripKv = (t: Trip, planLabel: string): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", planLabel], ["ไตรมาส", "ไตรมาส " + t.quarter], ["รูปแบบดำเนินการ", t.mode === "hire" ? "จ้างดำเนินการ" : "ดำเนินการเอง"],
  ...(t.mode === "hire"
    ? [["ผู้รับจ้าง", t.vendor ?? "-"], ["เบอร์โทรผู้รับจ้าง", vendorTelOf(t) || "-"], ["เลขที่สัญญา/ใบสั่งจ้าง", t.contract || "-"], ["ช่วงวันทำงาน", tripRange(t)]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงานที่เดินทาง", (t.staff ?? []).join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["วันที่ส่ง", t.sentAt],
];
export const tripViewKv = (t: Trip, planLabel: string): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", planLabel], ["ไตรมาส", "ไตรมาส " + t.quarter],
  ...(t.mode === "hire"
    ? [["ช่วงวันทำงาน", tripRange(t)], ["ผู้รับจ้าง", t.vendor ?? "-"], ["เบอร์โทรผู้รับจ้าง", vendorTelOf(t) || "-"]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงานที่เดินทาง", (t.staff ?? []).join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["อนุมัติเมื่อ", t.approvedAt ?? "-"],
];

export const tripsOf = (s: MockState): Trip[] => s.trips ?? DEFAULT_TRIPS();
export const quarterTrips = (s: MockState, planId = PLAN_ID, q = 1) => tripsOf(s).filter((t) => !t.listOnly && t.planId === planId && t.quarter === q);
export const findTrip = (s: MockState, id: string | null) => tripsOf(s).find((t) => t.id === id);
export function putTrip(t: Trip) {
  setMock((s) => {
    const all = tripsOf(s); const i = all.findIndex((x) => x.id === t.id);
    const jobs = i < 0 && s.jobs ? { jobs: Object.fromEntries(Object.entries(s.jobs.jobs).filter(([k]) => !k.startsWith(t.id + ":"))) } : s.jobs;
    return { ...s, jobs, trips: i < 0 ? [...all, t] : all.map((x, j) => (j === i ? t : x)) };
  });
}
export function nextTripId(all: Trip[], mode: "self" | "hire") {
  const ids = new Set(all.map((t) => t.id));
  for (const id of ["T1", mode === "hire" ? "TV" : "T2"]) if (!ids.has(id)) return id;
  let n = 3; while (ids.has("T" + n)) n++; return "T" + n;
}

export type NotiRole = "kry" | "owner";
export interface Noti { id: string; role: NotiRole; status: StatusState; text: string; time: string; tripId?: string; unread: boolean; href?: string }
export const OWN_UNIT = "กฟฉ.1 ขอนแก่น";
export const NOTI_OLD_TEXT = "บำรุงรักษายานพาหนะ 82-3302 อุดรธานี ตามแผนเดินทางเดือนตุลาคมเสร็จแล้ว";
export const DEFAULT_NOTIS = (): Noti[] => [
  { id: "old-kry", role: "kry", status: "Success", text: NOTI_OLD_TEXT, time: "2 วันที่แล้ว", unread: false },
  { id: "old-owner", role: "owner", status: "Success", text: NOTI_OLD_TEXT, time: "2 วันที่แล้ว", unread: false },
];
export const notisOf = (s: MockState): Noti[] => s.notis ?? DEFAULT_NOTIS();
export function approvalNotis(t: Trip): Noti[] {
  const out: Noti[] = [{ id: t.id + "-kry", role: "kry", status: "Brand", tripId: t.id, unread: true, time: "10 นาทีที่แล้ว",
    text: "แผนเดินทาง " + t.name + " อนุมัติแล้ว หน่วยงานผู้ดำเนินการจะเข้าบำรุงรักษายานพาหนะ " + t.carIds.length + " คัน ระหว่างวันที่ " + t.d1 + " ถึง " + t.d2 }];
  const own = tripCars(t, OWN_UNIT);
  if (own.length) out.push({ id: t.id + "-owner", role: "owner", status: "Brand", tripId: t.id, unread: true, time: "10 นาทีที่แล้ว",
    text: "หน่วยงานผู้ดำเนินการจะเข้าบำรุงรักษายานพาหนะที่คุณดูแล " + own.length + " คัน (" + own.map((c) => c.plate).join(", ") + ") ระหว่างวันที่ " + t.d1 + " ถึง " + t.d2 + " ที่ " + tripLoc(t, own[0]) });
  return out;
}
export const ackNoti = (t: { id: string; mode?: "self" | "hire" }, c: { id: string; plate: string }, unread = true): Noti => ({
  id: "ack-" + t.id + "-" + c.id, role: "owner", status: "Brand", unread, time: "5 นาทีที่แล้ว", href: "/acceptance/car/?trip=" + t.id + "&car=" + c.id,
  text: "ปิดงานบำรุงรักษา " + c.plate + " แล้ว รอผู้ดูแลยานพาหนะรับทราบผล" + (t.mode === "hire" ? "" : "และประเมินความพึงพอใจ"),
});
export const oilFailNoti = (t: { id: string }, c: { id: string; plate: string }, unread = true): Noti => ({
  id: "oilfail-" + t.id + "-" + c.id, role: "owner", status: "Error", unread, time: "5 นาทีที่แล้ว", href: "/vehicles/detail/?car=" + c.id + "&tab=machine",
  text: "ผลตรวจน้ำมันไฮดรอลิก " + c.plate + " ไม่ผ่าน",
});
export function addNotis(list: Noti[]) {
  setMock((s) => { const ids = new Set(list.map((n) => n.id)); return { ...s, notis: [...list, ...notisOf(s).filter((n) => !ids.has(n.id))] }; });
}
