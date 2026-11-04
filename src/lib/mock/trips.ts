/* ข้อมูลจำลองของแผนเดินทาง (S6 S9 S7 S8 — batch B) · ยกจาก screens.js (TRIP_CARS · OWNER_PH · TRIP_1 · TRIP_2 · TRIP_V · TRIP_OTHER · VENDORS · NOTI_*)
   และ spec maintainance-yearly-specs/mock-data.ts (ชื่อ field ตาม Trip ใน spec — batch C ใช้ชุดเดียวกัน)
   เก็บใน localStorage คีย์เดียวกับ store (mt-next-v1) ที่ field trips / notis — ค่าไม่มี = ค่าตั้งต้นของที่นี่ */
import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import type { PillColor } from "@/components/vms/PillOutline";
import type { StatusState } from "@/components/vms/Status";
import { setMock, type MockState } from "./store";

export const NOW_Q = "ไตรมาส 1";
export const PLAN_ID = "Z7000001";

/* ---------- รถของไตรมาส 1 แผน MR Z7000001 (TRIP_CARS + OWNER_PH) — ลำดับตาม screens.js ---------- */
export interface TripCar { id: string; plate: string; model: string; owner: string; phone: string }
export const TRIP_CARS: TripCar[] = [
  { id: "82-6789", plate: "82-6789 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", phone: "081-472-3365" },
  { id: "82-1145", plate: "82-1145 ขอนแก่น", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 ขอนแก่น", phone: "081-472-3365" },
  { id: "80-5738", plate: "80-5738 น่าน", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.2 น่าน", phone: "054-710-224" },
  { id: "81-2210", plate: "81-2210 เชียงใหม่", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟน.1 เชียงใหม่", phone: "053-241-560" },
  { id: "80-9981", plate: "80-9981 ลำปาง", model: "Isuzu FTR + กระเช้า Aichi SH15A", owner: "กฟน.1 ลำปาง", phone: "089-635-1172" },
  { id: "82-3302", plate: "82-3302 อุดรธานี", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 อุดรธานี", phone: "042-221-908" },
  { id: "82-7720", plate: "82-7720 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", phone: "043-246-118" },
  { id: "80-3316", plate: "80-3316 พะเยา", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟน.1 พะเยา", phone: "054-411-737" },
  { id: "81-6604", plate: "81-6604 เชียงราย", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟน.1 เชียงราย", phone: "053-711-402" },
  { id: "80-4458", plate: "80-4458 แพร่", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟน.2 แพร่", phone: "054-511-226" },
];
export const carOf = (id: string) => TRIP_CARS.find((c) => c.id === id);

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
  d1: string; d2: string; status: TripStatus; staff?: string[];
  createdBy: string; sentAt: string; approvedAt?: string; returnReason?: string;
  /** แสดงเฉพาะในรายการรออนุมัติของผู้อนุมัติ (TRIP_OTHER) ไม่นับเป็นใบของไตรมาสในหน้า S6 */
  listOnly?: boolean;
}
export const STAFF = ["นายวิชัย ทองดี", "นางสาวกนกวรรณ ใจมั่น", "นายสมชาย พูลสุข"];   // TRIP.staff
export const CREATOR = "นายวิชัย ทองดี (กบค.)";
export const CREATOR_SHORT = "นายวิชัย ทองดี";
export const SENT_AT = "03/11/2569", APPROVED_AT = "04/11/2569";
export const VENDORS = [   // VENDORS: ชื่อ · ประเภทรถ (Supporting text)
  { name: "บริษัท สยามไฮดรอลิก เซอร์วิส จำกัด", types: "รถกระเช้า · รถเครน" },
  { name: "หจก. ช่างกลภาคอีสาน", types: "รถกระเช้า" },
  { name: "บริษัท เครนเทค เอ็นจิเนียริ่ง จำกัด", types: "รถเครน" },
  { name: "หจก. ล้านนาไฮดรอลิก", types: "รถกระเช้า · รถขุด" },
];
export const TRIP_RETURN_REASON = "ช่วงวันที่ 03 ถึง 07/11/2569 ตรงกับแผนดับไฟของ กฟฉ.1 ขอนแก่น กรุณาเลื่อนเป็นสัปดาห์ถัดไป";

const base = { planId: PLAN_ID, quarter: 1, createdBy: CREATOR, sentAt: SENT_AT };
/* ตัวอย่างของ screens.js — ใช้ตอนเปิด scenario จากหน้า /scenarios/ (seed) */
export const TRIP_1: Trip = { ...base, id: "T1", name: "ตรวจรถ ขอนแก่น อุดรธานี ลำปาง", mode: "self", carIds: ["82-6789", "82-1145", "80-9981", "82-3302"],
  locs: { "80-9981": "จุดรวมงาน กฟน.1 ลำปาง" }, phones: { "80-9981": "086-552-1904" }, d1: "03/11/2569", d2: "07/11/2569", status: "review", staff: STAFF };
export const TRIP_2: Trip = { ...base, id: "T2", name: "ตรวจรถ น่าน เชียงใหม่ เชียงราย", mode: "self", carIds: ["80-5738", "81-2210", "82-7720", "80-3316", "81-6604", "80-4458"],
  locs: {}, phones: {}, d1: "17/11/2569", d2: "21/11/2569", status: "review", staff: STAFF };
export const TRIP_V: Trip = { ...base, id: "TV", name: "จ้างบำรุงรักษา น่าน เชียงใหม่ เชียงราย", mode: "hire", vendor: VENDORS[0].name, contract: "สจ.69-0142",
  carIds: ["80-5738", "81-2210", "82-7720", "80-3316", "81-6604", "80-4458"], locs: { "82-7720": "ศูนย์บริการผู้รับจ้าง สาขาขอนแก่น" }, phones: { "82-7720": "095-118-4420" },
  d1: "17/11/2569", d2: "21/11/2569", status: "review" };
/* TRIP_OTHER — อีกใบในรายการรออนุมัติ (แสดงในตาราง S7 อย่างเดียว) */
export const TRIP_OTHER: Trip = { ...base, id: "TO", name: "ตรวจรถเครน นครราชสีมา บุรีรัมย์", mode: "self", carIds: ["82-6789", "82-1145", "80-5738"],
  locs: {}, phones: {}, d1: "10/11/2569", d2: "12/11/2569", status: "review", staff: STAFF, listOnly: true };

export const DEFAULT_TRIPS = (): Trip[] => [{ ...TRIP_OTHER }];   // E.1: ไตรมาสยังไม่มีแผนเดินทาง

/* ---------- ตัวช่วยแสดงผล ---------- */
export const tripBy = (t: Trip) => t.vendor || "กบค. (ดำเนินการเอง)";
export const tripLoc = (t: Pick<Trip, "locs">, c: TripCar) => t.locs[c.id] || "สำนักงาน " + c.owner;
export const tripPhone = (t: Pick<Trip, "phones">, c: TripCar) => t.phones[c.id] || c.phone || "-";
export const phoneCell = (t: Pick<Trip, "phones"> | null, c: TripCar) => (t && t.phones[c.id] ? { text: t.phones[c.id], sub: "แก้จากเบอร์เจ้าของรถ" } : c.phone || "-");
export const locCell = (t: Pick<Trip, "locs">, c: TripCar) => ({ text: tripLoc(t, c), sub: t.locs[c.id] ? "แก้จากสำนักงานเจ้าของรถ" : "ค่าเริ่มต้น สำนักงานที่รถอยู่" });
export const tripRange = (t: Pick<Trip, "d1" | "d2">) => t.d1 + " – " + t.d2;
/* tripPlaces — "<สถานที่ไม่ซ้ำ> แห่ง (สำนักงานเจ้าของรถ k คัน)" */
export const tripPlaces = (t: Trip) => {
  const cars = t.carIds.map(carOf).filter((c): c is TripCar => !!c);
  const n = new Set(cars.map((c) => tripLoc(t, c))).size, own = cars.filter((c) => !t.locs[c.id]).length;
  return n + " แห่ง" + (own ? " (สำนักงานเจ้าของรถ " + own + " คัน)" : "");
};
export const tripCars = (t: Trip, only?: string) => t.carIds.map(carOf).filter((c): c is TripCar => !!c && (!only || c.owner === only));

/* tripKv — กล่องรายละเอียดแผนเดินทาง (S7 · ใช้ซ้ำใน batch C) · planLabel = "MR Z7000001 บำรุงรักษารถกระเช้า ภาค 1 ปีงบประมาณ 2570" */
export const tripKv = (t: Trip, planLabel: string): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", planLabel], ["ไตรมาส", "ไตรมาส " + t.quarter], ["รูปแบบดำเนินการ", t.mode === "hire" ? "จ้างดำเนินการ" : "กบค. ดำเนินการเอง"],
  ...(t.mode === "hire"
    ? [["ผู้รับจ้าง", t.vendor ?? "-"], ["เลขที่สัญญา/ใบสั่งจ้าง", t.contract || "-"], ["ช่วงวันทำงาน", tripRange(t)]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงาน กบค. ซ่อม", (t.staff ?? []).join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["วันที่ส่ง", t.sentAt],
];
/* tripView (S8) — 7 คู่ · แผนจ้าง (ไม่มีจอ) ใช้ ผู้รับจ้าง + ช่วงวันทำงาน แทนพนักงาน */
export const tripViewKv = (t: Trip, planLabel: string): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", planLabel], ["ไตรมาส", "ไตรมาส " + t.quarter],
  ...(t.mode === "hire"
    ? [["ช่วงวันทำงาน", tripRange(t)], ["ผู้รับจ้าง", t.vendor ?? "-"]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงาน กบค. ซ่อม", (t.staff ?? []).join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["อนุมัติเมื่อ", t.approvedAt ?? "-"],
];

/* ---------- ที่เก็บ ---------- */
export const tripsOf = (s: MockState): Trip[] => s.trips ?? DEFAULT_TRIPS();
export const quarterTrips = (s: MockState, planId = PLAN_ID, q = 1) => tripsOf(s).filter((t) => !t.listOnly && t.planId === planId && t.quarter === q);
export const findTrip = (s: MockState, id: string | null) => tripsOf(s).find((t) => t.id === id);
export function putTrip(t: Trip) {
  setMock((s) => { const all = tripsOf(s); const i = all.findIndex((x) => x.id === t.id); return { ...s, trips: i < 0 ? [...all, t] : all.map((x, j) => (j === i ? t : x)) }; });
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
export const NOTI_OLD_TEXT = "กบค. บำรุงรักษารถ 82-3302 อุดรธานี ตามแผนเดินทางเดือนตุลาคมเสร็จแล้ว";
export const DEFAULT_NOTIS = (): Noti[] => [
  { id: "old-kry", role: "kry", status: "Success", text: NOTI_OLD_TEXT, time: "2 วันที่แล้ว", unread: false },
  { id: "old-owner", role: "owner", status: "Success", text: NOTI_OLD_TEXT, time: "2 วันที่แล้ว", unread: false },
];
export const notisOf = (s: MockState): Noti[] => s.notis ?? DEFAULT_NOTIS();
/* แจ้งเตือนเมื่อผู้อนุมัติอนุมัติแผนเดินทาง (NOTI_KRY · NOTI_OWN) — กรย. ทุกใบ · หน่วยงานเจ้าของรถเฉพาะใบที่มีรถของหน่วยงาน */
export function approvalNotis(t: Trip): Noti[] {
  const out: Noti[] = [{ id: t.id + "-kry", role: "kry", status: "Brand", tripId: t.id, unread: true, time: "10 นาทีที่แล้ว",
    text: "แผนเดินทาง " + t.name + " อนุมัติแล้ว กบค. จะเข้าบำรุงรักษารถ " + t.carIds.length + " คัน ระหว่างวันที่ " + t.d1 + " ถึง " + t.d2 }];
  const own = tripCars(t, OWN_UNIT);
  if (own.length) out.push({ id: t.id + "-owner", role: "owner", status: "Brand", tripId: t.id, unread: true, time: "10 นาทีที่แล้ว",
    text: "กบค. จะเข้าบำรุงรักษารถของหน่วยงาน " + own.length + " คัน (" + own.map((c) => c.plate).join(", ") + ") ระหว่างวันที่ " + t.d1 + " ถึง " + t.d2 + " ที่ " + tripLoc(t, own[0]) });
  return out;
}
export function addNotis(list: Noti[]) {
  setMock((s) => { const ids = new Set(list.map((n) => n.id)); return { ...s, notis: [...list, ...notisOf(s).filter((n) => !ids.has(n.id))] }; });
}
