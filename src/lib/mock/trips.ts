/* ข้อมูลจำลองของแผนเดินทาง (S6 S9 S7 S8 — batch B) · ยกจาก screens.js (TRIP_CARS · OWNER_PH · TRIP_1 · TRIP_2 · TRIP_V · TRIP_OTHER · VENDORS · NOTI_*)
   และ spec maintainance-yearly-specs/mock-data.ts (ชื่อ field ตาม Trip ใน spec)
   ที่เก็บแผนเดินทางมีที่เดียว (MockState.trips) — หน้างานรายคัน (jobs.ts · /trips/*) อ่านใบที่อนุมัติแล้วจากที่นี่
   เก็บใน localStorage คีย์เดียวกับ store (mt-next-v1) ที่ field trips / notis — ค่าไม่มี = ค่าตั้งต้นของที่นี่ */
import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import type { PillColor } from "@/components/vms/PillOutline";
import type { StatusState } from "@/components/vms/Status";
import { CAND, DISTRICTS, UNIT_FLEET, dCode, type Plan } from "./data";
import { setMock, type MockState } from "./store";

export const NOW_Q = "ไตรมาส 1";
export const PLAN_ID = "Z7000001";

/* ---------- รถของไตรมาส 1 แผน MRZ7000001 (TRIP_CARS + OWNER_PH + CTRL_NAME) — ลำดับตาม screens.js ----------
   ผู้ดูแลยานพาหนะ (6 พ.ย. 2569 เจ้าของงาน "เพิ่มชื่อผู้ดูแลยานพาหนะ ตรงเบอร์โทร ดึงจากผู้ควบคุมรถ"): ctrl = ชื่อผู้ควบคุมรถ (BE controller ของ /api/vehicles · ค่าสมมติ CTRL_NAME) · phone = เบอร์ผู้ควบคุมรถ (OWNER_PH) */
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
/* รถที่ กบค. จัดลงไตรมาสในฟอร์มสร้างแผน (S1 · CAND ของ data.ts) — id = ทะเบียนไม่มีจังหวัด · คันที่ซ้ำกับ TRIP_CARS ใช้ข้อมูลของ TRIP_CARS
   เบอร์ติดต่อ = เบอร์ของหน่วยงานเจ้าของรถเดียวกันใน TRIP_CARS (OWNER_PH) · ไม่มี = ว่าง (ตารางแสดง "-") */
export const candId = (plate: string) => plate.split(" ")[0];
const ownerPhone = (owner: string) => TRIP_CARS.find((c) => c.owner === owner)?.phone ?? "";
/* ผู้ดูแลยานพาหนะของรถที่ screens.js ไม่มีชื่อ = ผู้ควบคุมรถของหน่วยงานเจ้าของรถเดียวกันใน TRIP_CARS (แบบเดียวกับเบอร์) · ไม่มี = ว่าง (ตารางแสดง "-") */
const ownerCtrl = (owner: string) => TRIP_CARS.find((c) => c.owner === owner)?.ctrl ?? "";
export const PLAN_CARS: TripCar[] = CAND.filter((c) => !TRIP_CARS.some((t) => t.id === candId(c.plate)))
  .map((c) => ({ id: candId(c.plate), plate: c.plate, model: c.model, owner: c.owner, phone: ownerPhone(c.owner), ctrl: ownerCtrl(c.owner) }));
/* Q_EXTRA — รถในแผนปีที่ยังไม่อยู่ในไตรมาส (ค่าสมมติของ screens.js · popup "เพิ่มรถเข้าไตรมาส" E.16 ของแผนตัวอย่าง) */
export const Q_EXTRA: TripCar[] = [
  { id: "81-9035", plate: "81-9035 ลำปาง", model: "Isuzu FTR + กระเช้า Aichi SK12A", owner: "กฟน.2 ลำปาง", phone: "054-218-330", ctrl: "นายเกรียงไกร มูลเมือง" },
  { id: "82-4417", plate: "82-4417 น่าน", model: "Hino FC + กระเช้า Tadano AT-121", owner: "กฟน.2 น่าน", phone: "054-710-244", ctrl: "นายสุเมธ จันทร์ดี" },
  { id: "80-6652", plate: "80-6652 ลำพูน", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.1 ลำพูน", phone: "053-511-090", ctrl: "นายวิทยา สายสุข" },
];
/* รถเดิมของไตรมาสอื่นในแผนตัวอย่าง (S25 · MOVE_Q2 · MOVE_Q3_OTHER ของ screens.js · ค่าสมมติ) — แผนตัวอย่างที่ไม่มีรถรายคัน: ไตรมาสที่กำลังทำ = TRIP_CARS · ไตรมาสอื่น = ชุดนี้ */
export const SAMPLE_Q: Record<number, TripCar[]> = {
  2: [
    { id: "81-7702", plate: "81-7702 ลำปาง", model: "Isuzu FTR + กระเช้า Aichi SK12A", owner: "กฟน.1 ลำปาง", phone: "054-217-411", ctrl: "นายไพโรจน์ ดวงใจ" },
    { id: "82-5530", plate: "82-5530 เชียงราย", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟน.1 เชียงราย", phone: "053-711-930", ctrl: "นายศักดิ์ชัย ทองแท้" },
    { id: "80-1189", plate: "80-1189 น่าน", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.2 น่าน", phone: "054-710-551", ctrl: "นายมานพ ศรีเมือง" },
  ],
  3: [{ id: "81-3348", plate: "81-3348 พะเยา", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟน.1 พะเยา", phone: "054-411-206", ctrl: "นายเอกชัย พรหมมา" }],
};
export const carOf = (id: string) => TRIP_CARS.find((c) => c.id === id) ?? PLAN_CARS.find((c) => c.id === id) ?? Q_EXTRA.find((c) => c.id === id)
  ?? Object.values(SAMPLE_Q).flat().find((c) => c.id === id);
/* ---------- รถในไตรมาส (S6 E.1 · เพิ่ม ลด แก้ไข รถในไตรมาส 4 พ.ย. 2569 · ไม่ต้องส่งอนุมัติแผนใหม่) ----------
   MockState.qcars คีย์ "<แผน>-<ไตรมาส>": added = คันที่เพิ่ม (ใหม่สุดก่อน · ขึ้นก่อนในตาราง) · removed = คันที่เอาออก · phones/locs = เบอร์/สถานที่ที่แก้ (ค่าตั้งต้นตอนสร้างแผนเดินทาง)
   แผนที่สร้างจากฟอร์ม (มี alloc): เพิ่ม/เอาออก เขียนที่ plan.alloc ด้วย ⇒ จำนวนรถของแผน รายการอะไหล่ของไตรมาส (S22) ตามทันที */
export interface QuarterEdit { added: string[]; removed: string[]; phones: Record<string, string>; locs: Record<string, string>; names?: Record<string, string> }
declare module "./store" {
  interface MockState { qcars?: Record<string, QuarterEdit> }
}
const qKey = (planId: string, q: number) => planId + "-" + q;
export const qEditOf = (s: Pick<MockState, "qcars">, planId: string, q: number): QuarterEdit => s.qcars?.[qKey(planId, q)] ?? { added: [], removed: [], phones: {}, locs: {} };
const planOfId = (plans: Plan[], planId: string) => plans.find((x) => x.mr === "MR" + planId);
const hasAlloc = (p?: Plan): p is Plan & { alloc: Record<number, number> } => !!p?.alloc && Object.keys(p.alloc).length > 0;
const candIndex = (id: string) => CAND.findIndex((c) => candId(c.plate) === id);
/** รถของไตรมาส q ในแผน — แผนที่สร้างจากฟอร์ม (มี alloc) = รถที่จัดลงไตรมาสนั้น · แผนตัวอย่าง (ไม่มี alloc) = TRIP_CARS ของ screens.js (ไตรมาสที่กำลังทำ) / SAMPLE_Q (ไตรมาสอื่น) · + คันที่เพิ่ม − คันที่เอาออก */
export function quarterCars(s: Pick<MockState, "plans" | "qcars">, planId: string, q: number): TripCar[] {
  const p = planOfId(s.plans, planId), e = qEditOf(s, planId, q);
  const nowQ = Number((p?.nowQ ?? "ไตรมาส 1").replace(/\D/g, "")) || 1;
  const base = hasAlloc(p)
    ? Object.keys(p.alloc).map(Number).filter((i) => p.alloc[i] === q && CAND[i]).map((i) => carOf(candId(CAND[i].plate))).filter((c): c is TripCar => !!c)
    : q === nowQ ? TRIP_CARS : SAMPLE_Q[q] ?? [];
  const added = e.added.filter((id) => !e.removed.includes(id)).map(carOf).filter((c): c is TripCar => !!c);
  return [...added, ...base.filter((c) => !e.added.includes(c.id) && !e.removed.includes(c.id))];
}
/** รถที่เพิ่มเข้าไตรมาสได้: รถของหน่วยงานในขอบเขตของแผน (ภาค เขต ประเภทรถ) ที่ยังไม่อยู่ในไตรมาสใด · แผนตัวอย่าง = Q_EXTRA */
export function quarterPool(s: Pick<MockState, "plans" | "qcars">, planId: string, q: number): TripCar[] {
  const p = planOfId(s.plans, planId);
  const inAny = new Set([1, 2, 3, 4].flatMap((k) => quarterCars(s, planId, k).map((c) => c.id)));
  if (!hasAlloc(p)) return Q_EXTRA.filter((c) => !inAny.has(c.id));
  const regions = p.regions ?? [], districts = p.districts ?? [], types = p.types ?? p.type.split(", ");
  /* รถที่ฟอร์มเห็น (UNIT_FLEET = รถจำลองครบชุด 9 พ.ย. 2569) ในขอบเขตของแผนที่ยังไม่อยู่ในไตรมาสใด */
  return UNIT_FLEET.map((i) => CAND[i]).filter((c) => (!types.length || types.includes(c.type)) && (!districts.length || districts.includes(dCode(c)))
    && (!regions.length || regions.some((r) => (DISTRICTS[r] ?? []).includes(dCode(c)))))
    .map((c) => carOf(candId(c.plate))).filter((c): c is TripCar => !!c && !inAny.has(c.id));
}
const perQOf = (alloc: Record<number, number>) => [1, 2, 3, 4].map((q) => "ไตรมาส " + q + ": " + Object.values(alloc).filter((x) => x === q).length).join(" · ");
function writeQuarter(planId: string, q: number, fn: (e: QuarterEdit) => QuarterEdit, allocFn?: (a: Record<number, number>) => Record<number, number>) {
  setMock((s) => {
    const plans = s.plans.map((p) => {
      if (p.mr !== "MR" + planId || !allocFn || !hasAlloc(p)) return p;
      const alloc = allocFn({ ...p.alloc }), keep = (o?: Record<number, unknown>) => o && Object.fromEntries(Object.entries(o).filter(([k]) => alloc[Number(k)] != null));
      return { ...p, alloc, picks: keep(p.picks) as Plan["picks"], qty: keep(p.qty) as Plan["qty"], manual: keep(p.manual) as Plan["manual"], oils: keep(p.oils) as Plan["oils"], oilSpec: keep(p.oilSpec) as Plan["oilSpec"], cars: Object.keys(alloc).length, perQ: perQOf(alloc) };
    });
    return { ...s, plans, qcars: { ...s.qcars, [qKey(planId, q)]: fn(qEditOf(s, planId, q)) } };
  });
}
/** E.17 เพิ่มรถเข้าไตรมาส (คันที่เพิ่มขึ้นก่อน) */
export function addQuarterCars(planId: string, q: number, ids: string[]) {
  writeQuarter(planId, q, (e) => ({ ...e, added: [...ids, ...e.added.filter((x) => !ids.includes(x))], removed: e.removed.filter((x) => !ids.includes(x)) }),
    (a) => { ids.forEach((id) => { const i = candIndex(id); if (i >= 0) a[i] = q; }); return a; });
}
/** E.20 เอารถออกจากไตรมาส (อะไหล่ของคันนั้นออกจากรายการเบิกของไตรมาส) */
export function removeQuarterCar(planId: string, q: number, id: string) {
  writeQuarter(planId, q, (e) => ({ ...e, added: e.added.filter((x) => x !== id), removed: [...e.removed.filter((x) => x !== id), id] }),
    (a) => { const i = candIndex(id); if (i >= 0 && a[i] === q) delete a[i]; return a; });
}
/** E.18 แก้ผู้ดูแลยานพาหนะ เบอร์ติดต่อ และสถานที่ของรถในไตรมาส (ยังไม่อยู่ในแผนเดินทาง) */
export function editQuarterCar(planId: string, q: number, o: Pick<QuarterEdit, "phones" | "locs" | "names">) {
  writeQuarter(planId, q, (e) => ({ ...e, phones: o.phones, locs: o.locs, names: o.names }));
}

/* ---------- สถานะแผนเดินทาง TST ---------- */
export type TripStatus = "review" | "approved" | "returned";
export const TST: Record<TripStatus, [string, PillColor]> = {
  review: ["รออนุมัติ", "Warning"], approved: ["อนุมัติแล้ว", "Success"], returned: ["ส่งกลับแก้ไข", "Error"],
};
/* BADGE_OF (core.js) — Badge outline มี 5 สี: Info → Brand · Warning → Brand */
export const badgeOf = (p: [string, PillColor]): [string, BadgeOutlineColor] =>
  [p[0], p[1] === "Info" || p[1] === "Warning" || p[1] === "Brand" ? "Brand" : p[1] === "Success" ? "Success" : p[1] === "Error" ? "Error" : "Gray"];

/* ---------- แผนเดินทาง (Trip ตาม spec mock-data.ts) ---------- */
export interface Trip {
  id: string; planId: string; quarter: number; name: string; mode: "self" | "hire";
  vendor?: string; contract?: string; carIds: string[];
  locs: Record<string, string>; phones: Record<string, string>;
  /** ชื่อผู้ดูแลยานพาหนะที่แก้รายคัน (6 พ.ย. 2569 · ไม่มี = ผู้ควบคุมรถ) */
  names?: Record<string, string>;
  d1: string; d2: string; status: TripStatus; staff?: string[];
  /** เบอร์โทรของพนักงานที่เดินทาง { ชื่อ: เบอร์ } (9 พ.ย. 2569 · ไม่มี = เบอร์จากข้อมูลพนักงาน STAFF_INFO) */
  staffTel?: Record<string, string>;
  /** วันดำเนินการรายคันที่แก้ { รถ: [ตั้งแต่, ถึง] } (works ของ screens.js · R83 · ไม่มี = ช่วงวันเดินทางทั้งช่วง) — แก้ใน popup "แก้ไขยานพาหนะในแผนเดินทาง" */
  works?: Record<string, [string, string]>;
  createdBy: string; sentAt: string; approvedAt?: string; returnReason?: string;
  /** แสดงเฉพาะในรายการรออนุมัติของผู้อนุมัติ (TRIP_OTHER) ไม่นับเป็นใบของไตรมาสในหน้า S6 */
  listOnly?: boolean;
}
export const STAFF = ["นายวิชัย ทองดี", "นางสาวกนกวรรณ ใจมั่น", "นายสมชาย พูลสุข"];   // TRIP.staff
/* ข้อมูลพนักงาน: ตำแหน่ง · เบอร์โทร (STAFF_INFO ของ screens.js · Figma d5d40a2 · ค่าสมมติ) — เจ้าของงาน 9 พ.ย. 2569 _"พนักงานสามารถเพิ่มได้ไม่จำกัด และ เป็น 1 คน 1 แถว เป็นชื่อ สกุล ตำแหน่ง เบอร์โทร"_
   แถวพนักงานที่เดินทางของฟอร์มแผนเดินทาง: ตำแหน่ง Readonly เติมจากที่นี่เมื่อเลือกชื่อ · เบอร์โทรเติมจากที่นี่ แก้ได้ (เก็บที่ Trip.staffTel) */
export const STAFF_INFO: Record<string, [string, string]> = { "นายวิชัย ทองดี": ["วศ.8", "081-472-1180"], "นางสาวกนกวรรณ ใจมั่น": ["ชก.6", "089-221-4407"], "นายสมชาย พูลสุข": ["ชก.5", "086-530-2291"] };
export const staffPos = (name: string) => STAFF_INFO[name]?.[0] ?? "";
export const staffTelOf = (t: Pick<Trip, "staffTel"> | null | undefined, name: string) => t?.staffTel?.[name] ?? STAFF_INFO[name]?.[1] ?? "";
export const CREATOR = "นายวิชัย ทองดี (กกฟ.1)";   // CREATOR ของ screens.js (6 พ.ย. 2569 ผู้สร้าง = หน่วยงาน)
export const CREATOR_SHORT = "นายวิชัย ทองดี";
export const SENT_AT = "03/11/2569", APPROVED_AT = "04/11/2569";
export const VENDORS = [   // VENDORS: ชื่อ · ประเภทรถ (Supporting text)
  { name: "บริษัท สยามไฮดรอลิก เซอร์วิส จำกัด", types: "กระเช้าแก้ไฟ · กระเช้าฮอทไลน์" },   // 6 พ.ย. 2569 ประเภทตามโค้ดจริง (screens.js VENDORS)
  { name: "หจก. ช่างกลภาคอีสาน", types: "กระเช้าแก้ไฟ" },
  { name: "บริษัท เครนเทค เอ็นจิเนียริ่ง จำกัด", types: "รถพ่วงฉีดน้ำ" },
  { name: "หจก. ล้านนาไฮดรอลิก", types: "กระเช้าแก้ไฟ · รถพ่วงฉีดน้ำ" },
];
export const TRIP_RETURN_REASON = "ช่วงวันที่ 03 ถึง 07/11/2569 ตรงกับแผนดับไฟของ กฟฉ.1 ขอนแก่น กรุณาเลื่อนเป็นสัปดาห์ถัดไป";

const base = { planId: PLAN_ID, quarter: 1, createdBy: CREATOR, sentAt: SENT_AT };
/* ตัวอย่างของ screens.js — ใช้ตอนเปิด scenario จากหน้า /scenarios/ (seed) */
export const TRIP_1: Trip = { ...base, id: "T1", name: "ตรวจยานพาหนะ ขอนแก่น อุดรธานี ลำปาง", mode: "self", carIds: ["82-6789", "82-1145", "80-9981", "82-3302"],
  locs: { "80-9981": "จุดรวมงาน กฟน.1 ลำปาง" }, phones: { "80-9981": "086-552-1904" }, names: { "80-9981": "นายอนุชา ศรีสุข" }, d1: "03/11/2569", d2: "07/11/2569", status: "review", staff: STAFF,
  works: { "82-6789": ["03/11/2569", "04/11/2569"], "82-1145": ["03/11/2569", "04/11/2569"], "80-9981": ["05/11/2569", "06/11/2569"] } };   // TRIP_WORKS (R83 · 82-6789 กับ 82-1145 วันเดียวกัน)
export const TRIP_2: Trip = { ...base, id: "T2", name: "ตรวจยานพาหนะ น่าน เชียงใหม่ เชียงราย", mode: "self", carIds: ["80-5738", "81-2210", "82-7720", "80-3316", "81-6604", "80-4458"],
  locs: {}, phones: {}, d1: "17/11/2569", d2: "21/11/2569", status: "review", staff: STAFF };
export const TRIP_V: Trip = { ...base, id: "TV", name: "จ้างบำรุงรักษา น่าน เชียงใหม่ เชียงราย", mode: "hire", vendor: VENDORS[0].name, contract: "สจ.69-0142",
  carIds: ["80-5738", "81-2210", "82-7720", "80-3316", "81-6604", "80-4458"], locs: { "82-7720": "ศูนย์บริการผู้รับจ้าง สาขาขอนแก่น" }, phones: { "82-7720": "095-118-4420" }, names: { "82-7720": "นายธนพล วงศ์ใหญ่" },
  d1: "17/11/2569", d2: "21/11/2569", status: "review" };
/* TRIP_OTHER — อีกใบในรายการรออนุมัติ (แสดงในตาราง S7 อย่างเดียว) */
export const TRIP_OTHER: Trip = { ...base, id: "TO", name: "ตรวจรถพ่วงฉีดน้ำ นครราชสีมา บุรีรัมย์", mode: "self", carIds: ["82-6789", "82-1145", "80-5738"],
  locs: {}, phones: {}, d1: "10/11/2569", d2: "12/11/2569", status: "review", staff: STAFF, listOnly: true };

export const DEFAULT_TRIPS = (): Trip[] => [{ ...TRIP_OTHER }];   // E.1: ไตรมาสยังไม่มีแผนเดินทาง

/* ---------- ตัวช่วยแสดงผล ---------- */
export const tripBy = (t: Trip) => t.vendor || "ดำเนินการเอง";   // 6 พ.ย. 2569 เจ้าของงาน "เปลี่ยนคำ กบค ดำเนินการเอง เป็น ดำเนินการเอง"
export const tripLoc = (t: Pick<Trip, "locs">, c: TripCar) => t.locs[c.id] || "สำนักงาน " + c.owner;
export const tripPhone = (t: Pick<Trip, "phones">, c: TripCar) => t.phones[c.id] || c.phone || "-";
export const tripCtrl = (t: Pick<Trip, "names"> | null, c: TripCar) => t?.names?.[c.id] || c.ctrl || "-";
/* ช่อง "ผู้ดูแลยานพาหนะ" (tripPhoneCell ของ screens.js 6 พ.ย. 2569) = ชื่อ (บรรทัดบน) + เบอร์ (บรรทัดรอง) */
export const ctrlCell = (t: Pick<Trip, "phones" | "names"> | null, c: TripCar) => ({ text: tripCtrl(t, c), sub: (t && t.phones[c.id]) || c.phone || "-" });
export const locCell = (t: Pick<Trip, "locs">, c: TripCar) => ({ text: tripLoc(t, c), sub: t.locs[c.id] ? "แก้จากสำนักงานเจ้าของยานพาหนะ" : "ค่าเริ่มต้น สำนักงานที่ยานพาหนะอยู่" });
export const tripRange = (t: Pick<Trip, "d1" | "d2">) => t.d1 + " – " + t.d2;
/* วันดำเนินการ + ตารางยานพาหนะของแผนเดินทาง ชุดเดียว (R82 R83) อยู่ที่ tripCols.ts · vTrip = ค่าของใบที่ตารางใช้ (แผนจ้าง = ช่วงวันทำงาน) */
export const vTrip = (t: Pick<Trip, "d1" | "d2" | "works" | "locs" | "phones" | "names" | "mode">) => ({ d1: t.d1, d2: t.d2, works: t.works, locs: t.locs, phones: t.phones, names: t.names, hire: t.mode === "hire" });
/* tripPlaces — "<สถานที่ไม่ซ้ำ> แห่ง (สำนักงานเจ้าของรถ k คัน)" */
export const tripPlaces = (t: Trip) => {
  const cars = t.carIds.map(carOf).filter((c): c is TripCar => !!c);
  const n = new Set(cars.map((c) => tripLoc(t, c))).size, own = cars.filter((c) => !t.locs[c.id]).length;
  return n + " แห่ง" + (own ? " (สำนักงานเจ้าของยานพาหนะ " + own + " คัน)" : "");
};
export const tripCars = (t: Trip, only?: string) => t.carIds.map(carOf).filter((c): c is TripCar => !!c && (!only || c.owner === only));

/* tripKv — กล่องรายละเอียดแผนเดินทาง (S7 · ใช้ซ้ำใน batch C) · planLabel = "MRZ7000001 บำรุงรักษารถกระเช้า ภาค 1 และภาค 2 ปีงบประมาณ 2570" */
export const tripKv = (t: Trip, planLabel: string): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", planLabel], ["ไตรมาส", "ไตรมาส " + t.quarter], ["รูปแบบดำเนินการ", t.mode === "hire" ? "จ้างดำเนินการ" : "ดำเนินการเอง"],
  ...(t.mode === "hire"
    ? [["ผู้รับจ้าง", t.vendor ?? "-"], ["เลขที่สัญญา/ใบสั่งจ้าง", t.contract || "-"], ["ช่วงวันทำงาน", tripRange(t)]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงานที่เดินทาง", (t.staff ?? []).join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["วันที่ส่ง", t.sentAt],
];
/* tripView (S8) — 7 คู่ · แผนจ้าง (ไม่มีจอ) ใช้ ผู้รับจ้าง + ช่วงวันทำงาน แทนพนักงาน */
export const tripViewKv = (t: Trip, planLabel: string): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", planLabel], ["ไตรมาส", "ไตรมาส " + t.quarter],
  ...(t.mode === "hire"
    ? [["ช่วงวันทำงาน", tripRange(t)], ["ผู้รับจ้าง", t.vendor ?? "-"]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงานที่เดินทาง", (t.staff ?? []).join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["อนุมัติเมื่อ", t.approvedAt ?? "-"],
];

/* ---------- ที่เก็บ ---------- */
export const tripsOf = (s: MockState): Trip[] => s.trips ?? DEFAULT_TRIPS();
export const quarterTrips = (s: MockState, planId = PLAN_ID, q = 1) => tripsOf(s).filter((t) => !t.listOnly && t.planId === planId && t.quarter === q);
export const findTrip = (s: MockState, id: string | null) => tripsOf(s).find((t) => t.id === id);
export function putTrip(t: Trip) {
  setMock((s) => {
    const all = tripsOf(s); const i = all.findIndex((x) => x.id === t.id);
    /* ใบใหม่: ล้างงานรายคันค้างของเลขใบเดียวกัน (jobs.ts · ชุดตัวอย่างก่อนหน้า) */
    const jobs = i < 0 && s.jobs ? { jobs: Object.fromEntries(Object.entries(s.jobs.jobs).filter(([k]) => !k.startsWith(t.id + ":"))) } : s.jobs;
    return { ...s, jobs, trips: i < 0 ? [...all, t] : all.map((x, j) => (j === i ? t : x)) };
  });
}
/* เลขที่ใบในต้นแบบ: ใบแรก T1 · ใบจ้าง TV · ใบตรวจเองถัดไป T2 (ชุดเดียวกับ screens.js ให้ batch C ใช้ต่อ) · เกินนั้น T3 T4 … */
export function nextTripId(all: Trip[], mode: "self" | "hire") {
  const ids = new Set(all.map((t) => t.id));
  for (const id of ["T1", mode === "hire" ? "TV" : "T2"]) if (!ids.has(id)) return id;
  let n = 3; while (ids.has("T" + n)) n++; return "T" + n;
}

/* ---------- แจ้งเตือนในแอป (S8) ---------- */
export type NotiRole = "kry" | "owner";
export interface Noti { id: string; role: NotiRole; status: StatusState; text: string; time: string; tripId?: string; unread: boolean }
export const OWN_UNIT = "กฟฉ.1 ขอนแก่น";   // หน่วยงานเจ้าของรถตัวอย่างที่เข้าระบบอยู่
export const NOTI_OLD_TEXT = "กบค. บำรุงรักษายานพาหนะ 82-3302 อุดรธานี ตามแผนเดินทางเดือนตุลาคมเสร็จแล้ว";
export const DEFAULT_NOTIS = (): Noti[] => [
  { id: "old-kry", role: "kry", status: "Success", text: NOTI_OLD_TEXT, time: "2 วันที่แล้ว", unread: false },
  { id: "old-owner", role: "owner", status: "Success", text: NOTI_OLD_TEXT, time: "2 วันที่แล้ว", unread: false },
];
export const notisOf = (s: MockState): Noti[] => s.notis ?? DEFAULT_NOTIS();
/* แจ้งเตือนเมื่อผู้อนุมัติอนุมัติแผนเดินทาง (NOTI_KRY · NOTI_OWN) — กรย. ทุกใบ · หน่วยงานเจ้าของรถเฉพาะใบที่มีรถของหน่วยงาน */
export function approvalNotis(t: Trip): Noti[] {
  const out: Noti[] = [{ id: t.id + "-kry", role: "kry", status: "Brand", tripId: t.id, unread: true, time: "10 นาทีที่แล้ว",
    text: "แผนเดินทาง " + t.name + " อนุมัติแล้ว กบค. จะเข้าบำรุงรักษายานพาหนะ " + t.carIds.length + " คัน ระหว่างวันที่ " + t.d1 + " ถึง " + t.d2 }];
  const own = tripCars(t, OWN_UNIT);
  if (own.length) out.push({ id: t.id + "-owner", role: "owner", status: "Brand", tripId: t.id, unread: true, time: "10 นาทีที่แล้ว",
    text: "กบค. จะเข้าบำรุงรักษายานพาหนะของหน่วยงาน " + own.length + " คัน (" + own.map((c) => c.plate).join(", ") + ") ระหว่างวันที่ " + t.d1 + " ถึง " + t.d2 + " ที่ " + tripLoc(t, own[0]) });
  return out;
}
export function addNotis(list: Noti[]) {
  setMock((s) => { const ids = new Set(list.map((n) => n.id)); return { ...s, notis: [...list, ...notisOf(s).filter((n) => !ids.has(n.id))] }; });
}
