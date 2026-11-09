"use client";
/* ข้อมูลจำลองงานรายคัน (S10 S12 · แผนที่ กบค. ดำเนินการเอง และแผนจ้างดำเนินการ) — เจ้าของ: batch C1
   ค่าตัวอย่างชุดเดียวกับปลั๊กอิน Figma (Maintenance-Request-Form/figma-export/maintainance-plugin/screens.js):
   TRIP_CARS · TRIP_1 / TRIP_V · WORK · JOB_START/JOB_END/JOB_BY · HIRE_T/HIRE_START/HIRE_ST · CLOSE_PARTS · CLOSE_COST_BY · RECEIPT_* · INSPECT_* · OIL_TAG · JOB_OIL_OPTS
   เก็บใน localStorage คีย์ mt-next-v1 (ฟิลด์ jobs ของ MockState — เพิ่มด้วย module augmentation ไม่แตะ store.ts) · "ล้างข้อมูลจำลอง" = ไม่มีงานรายคัน + แผนเดินทางตั้งต้นของ trips.ts

   โครง: JobsState = { trips: แผนเดินทางที่อนุมัติแล้ว (มุมมองจากที่เก็บแผนเดินทางของ trips.ts), jobs: งานรายคัน คีย์ "<trip>:<car>" }
   แผนเดินทางมีที่เก็บเดียวคือ MockState.trips (trips.ts · S6 S9 สร้าง · S7 อนุมัติ) — ที่นี่อ่านใบที่อนุมัติแล้วมาแปลงเป็น JobTrip (เติม planMr planName ป้ายไตรมาส จากแผนใน store)
   แก้เบอร์/สถานที่/เอารถออก (S10) และชุดตัวอย่าง เขียนกลับไปที่ MockState.trips ใบเดียวกัน · MockState.jobs เก็บเฉพาะงานรายคัน
   รถ (TRIP_CARS) ก็มาจาก trips.ts ชุดเดียวกัน (เติมประเภทรถ + เปลี่ยนน้ำมันครั้งล่าสุด)
   งานที่ยังไม่มีในที่เก็บ = ยังไม่เริ่ม (getJob คืนค่าตั้งต้น) · เปลี่ยนสถานะผ่านฟังก์ชันท้ายไฟล์ (startJob closeJob cannotJob saveOilResult …)
   4 พ.ย. 2569 เจ้าของงานตัด S23 (มุมผู้รับจ้าง) และ S11 (กบค. ตรวจรับทีละคัน) _"อยากตัด scen ผู้รับจ้าง หรือ vendor ตรวจรับทีละคัน ออก"_
   ⇒ แผนจ้างใช้ 4 สถานะเดียวกับแผนที่ กบค. ดำเนินการเอง · กบค. เริ่มงาน ปิดงาน บำรุงรักษาไม่ได้ แทนผู้รับจ้างด้วยหน้าเดียวกัน (จอ I.22 I.23 ของ screens.js) · ไม่มีส่งตรวจงานและตรวจรับรายคัน
   สถานะของงานผู้รับจ้างที่ค้างในที่เก็บเก่า (worked reported wait returned) แปลงเป็นสถานะที่ใกล้สุดตอนอ่าน (normJob)
   ที่เก็บงานรายคันมีที่เดียวคือไฟล์นี้ (MockState.jobs) — S10 S12 S13 S15 S24 ใช้ร่วมกัน */
import type { CheckRow } from "@/components/patterns/CheckTable";
import type { UploadFile } from "@/components/vms/FileUpload";
import type { PillColor } from "@/components/vms/PillOutline";
import { useMemo } from "react";
import { CAND, LAST_OIL, PLANS, typeOf, type Plan } from "./data";
import { setMock, useMock, type MockState, type Role } from "./store";
import { APPROVED_AT, PLAN_CARS, PLAN_ID, Q_EXTRA, TRIP_1, TRIP_CARS as CARS, TRIP_V, candId, tripsOf, type Trip } from "./trips";

/* ---------- เพิ่มฟิลด์ jobs ให้ MockState (store.ts) ---------- */
declare module "./store" {
  interface MockState { jobs?: { jobs: Record<string, Job> } }
}

/* ---------- สถานะงานรายคัน WSTAT · ป้ายผลน้ำมัน OIL_TAG ---------- */
/* แผนจ้างใช้ชุดเดียวกัน (ดำเนินการบำรุงรักษาแล้ว · แจ้งบำรุงรักษาไม่ได้ · รอตรวจรับ · ส่งกลับแก้ไข ตัดออกพร้อม S11 S23 4 พ.ย. 2569) */
export type JobStatus = "todo" | "doing" | "done" | "cannot";
export const WSTAT: Record<JobStatus, [string, PillColor]> = {
  todo: ["ยังไม่เริ่ม", "Gray"],
  doing: ["อยู่ระหว่างบำรุงรักษา", "Warning"],
  done: ["เสร็จสิ้น", "Success"],
  cannot: ["บำรุงรักษาไม่ได้", "Error"],
};
export type OilTag = "wait" | "fail";
export const OIL_TAG: Record<OilTag, [string, PillColor]> = { wait: ["รอผลตรวจน้ำมัน", "Warning"], fail: ["น้ำมันไม่ผ่าน", "Error"] };
/* JOB_OIL_OPTS — 0 เก็บตัวอย่าง · 1 เปลี่ยนน้ำมัน · 2 เก็บตัวอย่างและเปลี่ยน (ค่าตั้งต้นหน้างาน JOB_OIL = 2) */
export const OIL_JOB_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน", "เก็บตัวอย่างและเปลี่ยน"] as const;
export type OilChoice = 0 | 1 | 2;
export const OIL_DEFAULT: OilChoice = 2;
export const oilSampled = (k?: number | null) => k === 0 || k === 2;   // OIL_SAMPLED
/* ผลการทดสอบ: -1 ยังไม่เลือก · 0 ผ่าน · 1 ไม่ผ่าน */
export type OilSel = -1 | 0 | 1;
export const OIL_RESULT_OPTS = ["ผ่าน", "ไม่ผ่าน"];

/* ---------- คน ---------- */
export const PEOPLE = {
  staff: ["นายวิชัย ทองดี", "นางสาวกนกวรรณ ใจมั่น", "นายสมชาย พูลสุข"],   // TRIP.staff (พนักงาน กบค. ซ่อม)
  kbk: "นายวิชัย ทองดี (กกฟ.1)",                                         // JOB_BY · ผู้สร้าง · ผู้เริ่มงาน/ผู้บันทึกของแผนจ้างด้วย (กบค. บันทึกแทนผู้รับจ้าง)
  ownerSigner: "นายสุรชัย แก้วมณี",                                      // SIGN_OWNER
};
/* เวลาตัวอย่างของจอ Figma (ต้นแบบใช้ค่าคงที่ให้ตรงจอ) */
export const JOB_TIMES = {
  self: { start: "04/11/2569 08:42 น.", end: "04/11/2569 11:15 น.", resultSaved: "11/11/2569 14:02 น." },
  hire: { start: "17/11/2569 09:10 น.", end: "17/11/2569 13:25 น." },   // HIRE_START · เวลาปิดงานเดิมของใบจ้าง (จอ I.23 มีแค่เริ่มงาน)
};
export const SIGN_DATE = "04/11/2569";
/* Safety Inspection (JO 7.3.3) — แสดงเฉพาะรถประเภทนี้ (SAFETY_TYPES ใน screens.js) · เวลาบันทึกตามจอ "บันทึกเอกสาร Safety Inspection สำเร็จ" */
export const SAFETY_TYPES = ["กระเช้าฮอทไลน์", "กระเช้าแก้ไฟ"];   // 6 พ.ย. 2569 ประเภทตามโค้ดจริงมีแต่กระเช้า (screens.js SAFETY_TYPES)
export const SAFETY_SAVED = "12/11/2569 09:30 น.";
export const safetyOn = (c: { type: string }) => SAFETY_TYPES.includes(c.type);
/* เลขไมล์/ชั่วโมงเครื่องจักรสะสมของกล่องข้อมูลยานพาหนะ — jobPage() ใช้ค่าเดียวทั้งตรวจเองและใบจ้าง (จอ I.23 · ค่าเดิมของใบจ้างมาจาก hireJob() ที่ตัดออก) */
export const ODOMETER = ["182,400 กม.", "6,120 ชม."] as const;
export const JOB_TEXT = {
  cannotSelf: "ยานพาหนะติดภารกิจซ่อมสายส่งฉุกเฉิน ไม่อยู่ที่จุดนัดในวันเดินทาง",   // JOB_CANNOT
};
export const CANNOT_USED_SAMPLE = [30, 2, 0, 0];   // CANNOT_USED — เปลี่ยนน้ำมันและไส้กรองไฮโดรลิกแล้วพบปัญหา
export const OIL_FILE: UploadFile = { name: "oil-test-82-6789.pdf", size: "420 KB", bar: true };
export const BEFORE = ["รูปยานพาหนะ + ทะเบียน", "อะไหล่ใหม่"];   // ภาพก่อนเริ่มงาน 2 ช่อง

/* ---------- รถของไตรมาส 1 แผน MRZ7000001 (TRIP_CARS + OWNER_PH + LAST_OIL) ---------- */
export interface TripCar { id: string; plate: string; model: string; owner: string; ownerPhone: string; ctrl: string; type: string; lastOil: string }   // ctrl = ผู้ควบคุมรถ (ผู้ดูแลยานพาหนะ ค่าเริ่มต้น · 6 พ.ย. 2569)
/* รถชุดเดียวกับ trips.ts (TRIP_CARS + OWNER_PH) · เปลี่ยนน้ำมันครั้งล่าสุด LAST_OIL (82-3302 = 05/02/2567 · คันอื่น 12/03/2568) */
/* วันที่เปลี่ยนน้ำมันครั้งล่าสุด ค่าเดียวทุกจอ (lastOil() ใน screens.js 5 พ.ย. 2569 · ชีตลูกค้า "12/03/2568 กับ 18/10/2568 ปนกัน") — ยึดข้อมูล S24 (MA_ROWS ช่องเปลี่ยนน้ำมันล่าสุด)
   ยกเว้น 82-6789 (คันตัวอย่าง S10) ก่อนงานนี้ = 12/03/2568 · ไม่มีใน S24 = LAST_OIL ตามลำดับ CAND · ไม่มีข้อมูล = "ไม่มีข้อมูล" */
const LAST_OIL_OF: Record<string, string> = {
  "82-6789": "12/03/2568", "82-1145": "12/03/2567", "80-5738": "14/10/2568", "81-2210": "ไม่มีข้อมูล", "80-9981": "10/01/2569", "82-3302": "05/02/2567",
  "82-7720": "18/06/2568", "80-3316": "05/02/2567", "81-6604": "20/09/2569", "80-4458": "01/10/2568",
};
export const TRIP_CARS: TripCar[] = CARS.map((c) => ({ id: c.id, plate: c.plate, model: c.model, owner: c.owner, ownerPhone: c.phone, ctrl: c.ctrl, type: typeOf(c.model), lastOil: LAST_OIL_OF[c.id] ?? "12/03/2568" }));
/* รถจากแผนที่สร้างในฟอร์ม (PLAN_CARS ของ trips.ts) — ประเภทรถและเปลี่ยนน้ำมันครั้งล่าสุดตาม CAND / LAST_OIL ของ data.ts */
export const PLAN_JOB_CARS: TripCar[] = PLAN_CARS.map((c) => { const i = CAND.findIndex((x) => candId(x.plate) === c.id);
  return { id: c.id, plate: c.plate, model: c.model, owner: c.owner, ownerPhone: c.phone, ctrl: c.ctrl, type: CAND[i]?.type ?? typeOf(c.model), lastOil: LAST_OIL[i] ?? "-" }; });
/* รถที่เพิ่มเข้าไตรมาสของแผนตัวอย่าง (Q_EXTRA · S6 E.1) — screens.js ไม่มีประเภท/น้ำมันครั้งล่าสุด ⇒ รถกระเช้า · "-" */
const Q_EXTRA_JOB_CARS: TripCar[] = Q_EXTRA.map((c) => ({ id: c.id, plate: c.plate, model: c.model, owner: c.owner, ownerPhone: c.phone, ctrl: c.ctrl, type: typeOf(c.model), lastOil: "-" }));
/* น้ำมันไฮโดรลิกตามแผนของรถ (S21) = ค่าตั้งต้นของ Step 2 (TRIP_OIL ใน screens.js 5 พ.ย. 2569 · ชีตลูกค้า: เดิมเลือก เก็บตัวอย่างและเปลี่ยน ทุกคัน)
   แผนตัวอย่าง: 82-6789 = เก็บตัวอย่างและเปลี่ยน · คันอื่นทุกคันที่ 3 = เปลี่ยนน้ำมัน ที่เหลือ = เก็บตัวอย่าง · แผนที่กำหนดอะไหล่รายคัน = ตัวเลือกที่กำหนดใน S21 */
export const SAMPLE_OIL = (carId: string): OilChoice => { const i = CARS.findIndex((c) => c.id === carId); return i === 0 ? 2 : i >= 0 && i % 3 === 0 ? 1 : 0; };
export function plannedOil(plans: Plan[], planId: string, carId: string): OilChoice {
  const p = plans.find((x) => x.mr === "MR" + planId), i = CAND.findIndex((c) => candId(c.plate) === carId);
  if (p?.alloc && i >= 0 && p.alloc[i] != null) {
    const k = p.oils?.[i] ?? ((p.picks?.[i] ?? []).includes(0) ? 1 : 0);
    return k as OilChoice;
  }
  return SAMPLE_OIL(carId);
}
export const carOf = (id: string) => TRIP_CARS.find((c) => c.id === id) ?? PLAN_JOB_CARS.find((c) => c.id === id) ?? Q_EXTRA_JOB_CARS.find((c) => c.id === id);

/* ---------- แผนเดินทางที่อนุมัติแล้ว — มุมมองของ Trip (trips.ts) ที่สถานะ approved ----------
   planMr planName จากแผนใน store · quarter = ป้าย "ไตรมาส n" · q = เลขไตรมาส */
export interface JobTrip {
  id: string; planId: string; planMr: string; planName: string; quarter: string; q: number;
  name: string; mode: "self" | "hire"; vendor?: string; contract?: string;
  carIds: string[];
  /** สถานที่/เบอร์ที่แก้รายคัน (ไม่มี = สำนักงานเจ้าของรถ / เบอร์เจ้าของรถ) */
  locs: Record<string, string>; phones: Record<string, string>;
  /** ชื่อผู้ดูแลยานพาหนะที่แก้รายคัน (ไม่มี = ผู้ควบคุมรถ · 6 พ.ย. 2569) */
  names?: Record<string, string>;
  d1: string; d2: string; staff: string[]; createdBy: string; sentAt: string;
  status: "approved"; approvedAt?: string;
  /** วันดำเนินการรายคันที่แก้ (R83 · ไม่มี = ช่วงวันเดินทางทั้งช่วง) */
  works?: Record<string, [string, string]>;
}
export function toJobTrip(t: Trip, plans: Plan[]): JobTrip {
  const p = plans.find((x) => x.mr === "MR" + t.planId);
  return { id: t.id, planId: t.planId, planMr: "MR" + t.planId, planName: p?.name ?? "", quarter: "ไตรมาส " + t.quarter, q: t.quarter,
    name: t.name, mode: t.mode, vendor: t.vendor, contract: t.contract, carIds: t.carIds, locs: t.locs, phones: t.phones, names: t.names,
    d1: t.d1, d2: t.d2, staff: t.staff ?? [], createdBy: t.createdBy, sentAt: t.sentAt, status: "approved", approvedAt: t.approvedAt, works: t.works };
}
/* เขียนกลับเป็น Trip (คงค่าอื่นของใบเดิม) */
const fromJobTrip = (j: JobTrip, prev?: Trip): Trip => ({
  ...prev, id: j.id, planId: j.planId, quarter: j.q, name: j.name, mode: j.mode, vendor: j.vendor, contract: j.contract, carIds: j.carIds,
  locs: j.locs, phones: j.phones, names: j.names, works: j.works, d1: j.d1, d2: j.d2, staff: j.mode === "self" ? j.staff : prev?.staff, createdBy: j.createdBy, sentAt: j.sentAt,
  status: "approved", approvedAt: j.approvedAt ?? prev?.approvedAt ?? APPROVED_AT, returnReason: undefined, listOnly: undefined,
});
/* ชุดตัวอย่าง: TRIP_1 / TRIP_V ของ trips.ts ในสถานะอนุมัติแล้ว (tripAs() ของ screens.js) */
export const SEED_TRIPS: Record<"T1" | "TV", JobTrip> = {
  T1: toJobTrip({ ...TRIP_1, status: "approved", approvedAt: APPROVED_AT }, PLANS),
  TV: toJobTrip({ ...TRIP_V, status: "approved", approvedAt: APPROVED_AT }, PLANS),
};
export const tripLoc = (t: JobTrip, c: TripCar) => t.locs[c.id] || "สำนักงาน " + c.owner;
export const tripPhone = (t: JobTrip, c: TripCar) => t.phones[c.id] || c.ownerPhone;
export const phoneEdited = (t: JobTrip, c: TripCar) => !!t.phones[c.id] && t.phones[c.id] !== c.ownerPhone;
export const tripCtrl = (t: JobTrip, c: TripCar) => t.names?.[c.id] || c.ctrl || "-";
/* ช่วงวัน "03/11/2569 – 07/11/2569" · แบบย่อ "03–07/11/2569" (VEH_KV) */
export const tripRange = (t: JobTrip) => t.d1 + " – " + t.d2;
export const tripRangeShort = (t: JobTrip) => t.d1.slice(0, 2) + "–" + t.d2;
/* จำนวนวันของแผนเดินทาง (ตัวเลือก "จำนวนวัน" 1…n ในหน้าปิดงาน) */
export function tripDays(t: JobTrip) {
  const d = (s: string) => { const [dd, mm, yy] = s.split("/").map(Number); return Date.UTC(yy, mm - 1, dd); };
  return Math.max(1, Math.round((d(t.d2) - d(t.d1)) / 864e5) + 1);
}
/* tripKv — รายละเอียดแผนเดินทาง (ตรวจเอง 8 คู่ · จ้าง 9 คู่) */
export const tripKv = (t: JobTrip): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", t.planMr + " " + t.planName], ["ไตรมาส", t.quarter], ["รูปแบบดำเนินการ", t.vendor ? "จ้างดำเนินการ" : "ดำเนินการเอง"],
  ...(t.vendor
    ? [["ผู้รับจ้าง", t.vendor], ["เลขที่สัญญา/ใบสั่งจ้าง", t.contract || "-"], ["ช่วงวันทำงาน", tripRange(t)]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงานที่เดินทาง", t.staff.join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["วันที่ส่ง", t.sentAt],
];
/* ศูนย์ต้นทุนของหน่วยงานเจ้าของรถ (OWNER_CC) */
export const ownerCostCenter = (c: TripCar) => "E301010000 " + c.owner + " - บริหาร";

/* ---------- อะไหล่ตามแผนของรถ (WORK + ราคาจาก PARTS) ---------- */
export interface PlanPart { task: string; part: string; code?: string; planQty: number; unit: string; unitPrice: number }
export const WORK: PlanPart[] = [
  { task: "เปลี่ยนน้ำมันไฮโดรลิก", part: "น้ำมันไฮโดรลิก ISO VG 46", code: "OL-0011", planQty: 30, unit: "ลิตร", unitPrice: 120 },
  { task: "เปลี่ยนไส้กรองไฮโดรลิก", part: "ไส้กรองไฮโดรลิก", code: "FL-0022", planQty: 2, unit: "ชิ้น", unitPrice: 680 },
  { task: "เปลี่ยนไส้กรองน้ำมันเครื่อง", part: "ไส้กรองน้ำมันเครื่อง", code: "FL-0031", planQty: 2, unit: "ชิ้น", unitPrice: 250 },
  { task: "เปลี่ยนไส้กรองอากาศ", part: "ไส้กรองอากาศ", code: "FL-0040", planQty: 2, unit: "ชิ้น", unitPrice: 420 },
];
export const OIL_PART = WORK[0].part;

/* ---------- ฟอร์ม ---------- */
export interface Signer { name: string | null; /** ลายเซ็น (data URL) · มีค่า = ลงนามแล้ว */ sig: string | null }
/** Step 1 ตรวจสภาพก่อนบำรุงรักษา — เก็บร่างระหว่างกรอก · ยืนยันแล้วคงไว้เป็นข้อมูลของงาน
    items = รายการตรวจของแบบตรวจตามประเภทยานพาหนะ (R86 · sel 0 ปกติ · 1 แก้ไข) · signers = [ผู้ตรวจ (กบค.), ผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ)] (SIGN_IN 9 พ.ย. 2569) */
export interface ReceiveForm { items: CheckRow[]; signers: [Signer, Signer]; /** ไฟล์ต่อช่อง BEFORE */ photos: UploadFile[][] }
/** แถวรายการสภาพวัสดุอะไหล่ (หน้าปิดงาน) — จำนวนที่คืน = ตามแผน − ที่ใช้ · ราคารวมคำนวณ */
export interface ClosePartRow { part: string; code?: string; unit: string; unitPrice: number; planQty: number; used: number; old: number; note: string; /** เพิ่มเองหน้างาน (ไม่อยู่ในแผน) */ added?: boolean }
export interface CostRow { name: string | null; perDiem: string; lodging: string; days: number | null }
export type DocSel = "มี" | "ไม่มี" | "ไม่ต้องใช้";
export interface CloseDoc { name: string; sel: DocSel | null; files: string[] }
/** หน้าปิดงาน (workForm) */
export interface CloseForm {
  parts: ClosePartRow[]; costs: CostRow[]; travel: string; costCenter: string | null;
  km: string; hours: string;
  oilChoice: OilChoice; oilSel: OilSel; oilFiles: UploadFile[];
  /* ตรวจสภาพรถปิดงาน (InspectionChecklist 24 รายการ) ตัดออก 5 พ.ย. 2569 (เจ้าของงาน "s10 เอาตรวจสภาพปิดงาน ออกไปเลย" · R65) — ฟอร์มเก่าในที่เก็บที่มีฟิลด์ inspect ไม่ถูกอ่าน */
  signers: [Signer, Signer]; docs: CloseDoc[];
  /** เอกสาร Safety Inspection (ถ้ามี) — เฉพาะรถเครน/รถกระเช้า (4 พ.ย. 2569 · JO 7.3.3) · ฟอร์มเก่าในที่เก็บไม่มีฟิลด์นี้ */
  safetyFiles?: UploadFile[];
  /** งบที่ตัด (ลำดับใน BUDGET_CUT · ไม่มี = 0 งบทำการ หน่วยงานต้นสังกัด) + costCenter = ศูนย์ต้นทุน (R72 5 พ.ย. 2569 แบบ Request Repair/Budget ของงานซ่อม) */
  budgetType?: number;
  /** วันที่เปลี่ยนน้ำมันครั้งล่าสุด (ถ้ามี) — ไม่มี = ค่าในข้อมูลรถ (R73) */
  oilDate?: string;
}
/* งบที่ตัด — ค่า variant "งบที่ตัด" ของ Request Repair/Budget (ไฟล์ Maintain-D) · BUDGET_CUT ใน screens.js */
export const BUDGET_CUT = ["งบทำการ หน่วยงานต้นสังกัด", "งบทำการ หน่วยงานอื่น", "งบโครงการ (ตาม WBS)", "งบซ่อมบำรุงตามใบสั่ง (PM Order)", "อื่น ๆ"];
export const OTHER_CC = "E301020000 กฟฉ.2 อุบลราชธานี - บริหาร";   // ตัวอย่างศูนย์ต้นทุนของหน่วยงานอื่น (screens.js)
/* ขั้นตอนบำรุงรักษา 2 ขั้น (S10 5 พ.ย. 2569 · mtStepper) */
export const MT_STEPS = ["ตรวจสภาพก่อนบำรุงรักษา", "สรุปงานก่อนปิดงาน"];
export interface OilResult { sel: OilSel; files: UploadFile[]; sampledAt: string; sampledBy: string; savedAt?: string; savedBy?: string }
/** Safety Inspection ของงานรายคัน — แนบตอนปิดงาน (ถ้ามี) หรือเพิ่มภายหลังที่หน้างานรายคันที่เสร็จสิ้น (safetyDocs() ใน screens.js) */
export interface SafetyDocs { files: UploadFile[]; savedAt?: string; savedBy?: string }
export interface CannotInfo { reason: string; /** จำนวนที่ใช้ต่อแถวอะไหล่ตามแผน (ยังไม่เริ่ม = 0 ทั้งหมด) */ used: number[]; by: string; at: string; /** แจ้งตอนอยู่ระหว่างบำรุงรักษา */ whileDoing: boolean }

export interface Job {
  tripId: string; carId: string; status: JobStatus;
  /** อะไหล่ตามแผนของรถ (S1/S21) — กบค. เพิ่ม แก้ไข ลบ ได้ตอนยังไม่เริ่ม/อยู่ระหว่างบำรุงรักษา · เป็นค่าตั้งต้นของตารางหน้าปิดงาน */
  parts: PlanPart[];
  /** น้ำมันไฮโดรลิกที่เลือกหน้างาน (ตั้งแต่เริ่มงาน) */
  oilChoice?: OilChoice;
  receive?: ReceiveForm;
  /** ภาพก่อนเริ่มงาน (จากหน้ารับรถ) */
  photos?: UploadFile[];
  startedAt?: string; startedBy?: string;
  /** ขั้นที่ค้างของงานที่อยู่ระหว่างบำรุงรักษา (1 ตรวจสภาพก่อนบำรุงรักษา · 2 สรุปงานก่อนปิดงาน) — ที่เก็บเก่าไม่มี: รับรถลงนามครบแล้ว = 2 (stepOf) */
  step?: 1 | 2;
  close?: CloseForm;
  closedAt?: string; recordedBy?: string; kmAfter?: string; hoursAfter?: string;
  cannot?: CannotInfo;
  oilResult?: OilResult;
  safety?: SafetyDocs;
  /** หน่วยงานยอมรับผลรายคันแล้ว (S13 · acceptance.ts) */
  acceptedAt?: string;
}
export interface JobsState { trips: Record<string, JobTrip>; jobs: Record<string, Job> }

/* ---------- แบบตรวจสภาพตามประเภทยานพาหนะ (S10 Step 1 · R86 · inspectForm() ใน screens.js · Figma bc2571f) ----------
   เจ้าของงาน 9 พ.ย. 2569 (ไฟล์ "04 ใบตรวจสภาพ-ซ่อม รถกระเช้าแก้ไฟ ฮอทไลน์ รถ.xlsx") _"อยากให้การตรวจรถถ้าเลือกมาเป็นกระเช้า จะใช้แบบการตรวจ แท็บ ตรวจสภาพรถกระเช้า แต่ถ้าเป็นรถพ่วงฉีดน้ำก็จะใช้แบบประเมิน แท็ป ตรวจสภาพรถพ่วงฉีดน้ำ โดยข้อมูลที่เป็น display ก็คือข้อมูล ด้านบนของการตรวจ"_
   + เคาะ: แทนรายการเอกสารรับยานพาหนะใน Step 1 · ลงนาม ผู้ตรวจ / ผู้รับการตรวจ
   กระเช้าแก้ไฟ กระเช้าฮอทไลน์ = 30 รายการ (BUCKET_ITEMS) · รถพ่วงฉีดน้ำ = 19 รายการ (WATER_ITEMS) · ผลรายข้อ ปกติ / แก้ไข / หมายเหตุ · เลือกจากประเภทของยานพาหนะ (TripCar.type)
   ข้อมูลส่วนบนของใบตรวจ = กล่องแสดงข้อมูล · รหัส SERIAL No. หมายเลข HC เครื่องยนต์ ระยะทาง/ระยะเวลาการใช้งาน = ค่าสมมติของ screens.js */
export const BUCKET_ITEMS = ["น้ำมันไฮดรอลิค", "กรองน้ำมันไฮดรอลิค", "แรงดันน้ำมันไฮดรอลิค MAIN 2400-2600 PSI", "ชุดเกียร์ PTO", "ปั๊มน้ำมันไฮดรอลิค", "เพลาขับปั๊มน้ำมันไฮดรอลิค",
  "ชุดกระบอกขาช้างหน้าซ้าย-ขวา", "ชุดกระบอกขาช้างหลังซ้าย-ขวา", "น้ำมันหล่อลื่นชุดเฟืองหมุนฐานเครน", "ชุดมอเตอร์และเฟืองหมุนฐานเครน", "ชุดกระบอก LOWER BOOM", "ชุดกระบอก UPPER BOOM",
  "ชุดกระบอก EXTENSION", "ชุดโรตารี่", "ระบบ EMERGENCY", "ชุด CONTROL ล่าง", "ชุด CONTROL บน", "สายน้ำมันไฮดรอลิค", "สายสัญญาณต่างๆ", "เกจวัดต่างๆ", "ชุดวาล์วล๊อคต่างๆ",
  "ชุดปรับการหมุนและปรับดิ่งใบกระเช้า", "BUCKET, LINER", "ชุดการ์ดครอบป้องกันกระแสไฟ", "รอกและเชือกวินซ์", "ชุด LIFT รุ่น 115 KV", "การอัดและเคลือบจารบีตามจุดต่างๆ", "ชุดยึดฐานเครน",
  "ท่อนบูม, สลัก, จุดยึด", "PLATE ซองบูม, SLIDE PAD ADJ."];
export const WATER_ITEMS = ["น้ำมันเครื่องยนต์", "น้ำมันเกียร์ชุดเฟืองเกียร์ทดรอบ", "น้ำมันดุมล้อ", "กรองอากาศ", "กรองน้ำมันเครื่องยนต์", "กรองน้ำมันเชื้อเพลิง", "กรองดักน้ำ",
  "สภาพเครื่องยนต์รอบเครื่อง 2400 RPM", "น้ำ, หม้อน้ำ, ท่อน้ำ, ฝาปิดหม้อน้ำ", "สภาพและความตึงของสายพานพัดลม/ไดชาร์ท", "แบตเตอรี่, ขั้วแบตเตอรี่และน้ำกลั่น",
  "รอยรั่วน้ำมันเชื้อเพลิง, น้ำมันเครื่อง, น้ำระบายความร้อน", "แรงดันน้ำ MAIN 800 PSI", "แรงดันน้ำปลายปืน 1-2 กระบอก 400 PSI", "ระบบไฟควบคุมอุปกรณ์ต่าง ๆ", "มาตรวัดต่าง ๆ",
  "ข้อต่อ, วาล์วน้ำ", "สายฉีดน้ำ", "ชุดอุปกรณ์ REEL เก็บสายฉีดน้ำ"];
/** ตัวเลือกรายข้อ (หัวคอลัมน์ตาราง · Radio text card บนมือถือ) */
export const INSPECT_OPTS = ["ปกติ", "แก้ไข"];
/** ข้อมูลจำลองตอนตรวจครบ (INSPECT_NOTE / INSPECT_FIX): ทุกรายการ "ปกติ" ยกเว้นข้อ 18 "แก้ไข" + หมายเหตุ */
export const INSPECT_FIX = 17, INSPECT_NOTE = "สายน้ำมันไฮดรอลิคซึมที่ข้อต่อ เปลี่ยนแล้ว";
const WATER_TYPE = "รถพ่วงฉีดน้ำ";
/* "Isuzu FTR" → ["Isuzu", "FTR"] (brandModel ของ screens.js) */
const brandModel = (s: string): [string, string] => { const w = s.trim().split(" "); return [w[0] ?? "", w.slice(1).join(" ")]; };
/** แบบตรวจของยานพาหนะตามประเภท: ชื่อแบบ (หัวกล่องแสดงข้อมูล) · ข้อมูลส่วนบนของใบตรวจ · รายการตรวจ */
export function inspectForm(c: Pick<TripCar, "plate" | "model" | "owner" | "type">, jobNo: string): { title: string; kv: [string, string][]; items: string[] } {
  const [car, body = ""] = c.model.split(" + "), [vb, vm] = brandModel(car);
  if (c.type === WATER_TYPE) return { title: "แบบฟอร์มการตรวจสภาพรถพ่วงฉีดน้ำ", items: WATER_ITEMS, kv: [["งานเลขที่", jobNo], ["ยี่ห้อยานพาหนะ", vb], ["รุ่นยานพาหนะ", vm], ["ทะเบียน", c.plate],
    ["รหัส", "W-2565-0218"], ["ใช้งานประจำที่", c.owner], ["SERIAL No.", "FM8JN-71245"], ["ยี่ห้อเครื่องยนต์", "Kubota"], ["รุ่นเครื่องยนต์", "V2203"], ["SERIAL No. เครื่องยนต์", "2B4471"], ["ระยะเวลาการใช้งาน (Hr)", "2,840"]] };
  const [cb, cm] = brandModel(body.replace(/^กระเช้า /, ""));
  return { title: "แบบฟอร์มการตรวจสภาพกระเช้าแก้ไฟและกระเช้าฮอทไลน์", items: BUCKET_ITEMS, kv: [["งานเลขที่", jobNo], ["ยี่ห้อกระเช้า", cb], ["รุ่นกระเช้า", cm], ["ทะเบียน", c.plate],
    ["รหัส", "B-2563-0412"], ["ใช้งานประจำที่", c.owner], ["SERIAL No.", cm + "-11873"], ["หมายเลข HC", "HC-0412"], ["ยี่ห้อยานพาหนะ", vb], ["รุ่นยานพาหนะ", vm], ["ระยะทางการใช้งานยานพาหนะ (Km)", "182,400"], ["ระยะเวลาการใช้งานเครน (Hr)", "6,120"]] };
}
/** รายการตรวจตั้งต้นของยานพาหนะ (ยังไม่เลือก) */
export const inspectRows = (c: Pick<TripCar, "type">): CheckRow[] => (c.type === WATER_TYPE ? WATER_ITEMS : BUCKET_ITEMS).map((name) => ({ name, sel: null, note: "" }));

/* ---------- ค่าตั้งต้น ---------- */
export const CLOSE_DOCS = ["บันทึกใบสั่งการ"];
const signer = (): Signer => ({ name: null, sig: null });
export const emptyReceive = (c: Pick<TripCar, "type">): ReceiveForm => ({ items: inspectRows(c), signers: [signer(), signer()], photos: BEFORE.map(() => []) });
/* ฟอร์มปิดงานตั้งต้น: อะไหล่จากอะไหล่ตามแผน (ใช้ = ตามแผน · อะไหล่เก่า 0) · พนักงานตามแผนเดินทาง (เงินว่าง) · ศูนย์ต้นทุนของเจ้าของรถ */
export function emptyClose(job: Job, trip: JobTrip, car: TripCar): CloseForm {
  return {
    parts: job.parts.map((p) => ({ part: p.part, code: p.code, unit: p.unit, unitPrice: p.unitPrice, planQty: p.planQty, used: p.planQty, old: 0, note: "" })),
    costs: (trip.staff.length ? trip.staff : [null]).map((name) => ({ name, perDiem: "", lodging: "", days: null })),
    travel: "", costCenter: ownerCostCenter(car), km: "", hours: "",
    oilChoice: job.oilChoice ?? OIL_DEFAULT, oilSel: -1, oilFiles: [],
    signers: [signer(), signer()],
    docs: CLOSE_DOCS.map((name) => ({ name, sel: null, files: [] })),
  };
}
export const newJob = (tripId: string, carId: string): Job => ({ tripId, carId, status: "todo", parts: WORK.map((p) => ({ ...p })) });

/* ข้อมูลกรอกครบตามจอ Figma (ใช้กับชุดตัวอย่าง) — ตรวจครบ (INSPECT_FIX) + ลงนาม ผู้ตรวจ (กบค.) / ผู้รับการตรวจ (SIGN_IN) */
const filledReceive = (by: string, c: Pick<TripCar, "type">): ReceiveForm => ({
  items: inspectRows(c).map((r, i) => (i === INSPECT_FIX ? { ...r, sel: 1, note: INSPECT_NOTE } : { ...r, sel: 0 })),
  signers: [{ name: by.replace(/ \(.*\)$/, ""), sig: "sample" }, { name: PEOPLE.ownerSigner, sig: "sample" }],
  photos: BEFORE.map((b, i) => [{ name: b.replace(/\s|\+|\(|\)/g, "-") + "-" + (i + 1) + ".jpg", size: "2.4 MB", bar: true }]),
});
const CLOSE_FILLED_PARTS: Record<string, [number, number, string]> = {   // CLOSE_PARTS: ใช้ · อะไหล่เก่า · หมายเหตุ
  "น้ำมันไฮโดรลิก ISO VG 46": [30, 30, "น้ำมันเก่าส่งกำจัดตามระเบียบ"], "ไส้กรองไฮโดรลิก": [2, 2, ""], "ไส้กรองน้ำมันเครื่อง": [2, 2, ""], "ไส้กรองอากาศ": [1, 1, "ไส้กรองเดิมอีกลูกยังใช้ได้"],
};
function filledClose(job: Job, trip: JobTrip, car: TripCar): CloseForm {
  const f = emptyClose(job, trip, car);
  return {
    ...f,
    parts: f.parts.map((r) => { const v = CLOSE_FILLED_PARTS[r.part]; return v ? { ...r, used: v[0], old: v[1], note: v[2] } : r; }),
    costs: [["นายวิชัย ทองดี", 2], ["นางสาวกนกวรรณ ใจมั่น", 2], ["นายสมชาย พูลสุข", 1]].map(([name, days]) => ({ name: String(name), perDiem: "240", lodging: "800", days: Number(days) })),
    travel: "1,210", km: "182,640", hours: "6,131",
    signers: [{ name: PEOPLE.kbk.replace(" (กกฟ.1)", ""), sig: "sample" }, { name: PEOPLE.ownerSigner, sig: "sample" }],
    docs: f.docs.map((d) => ({ ...d, sel: "มี" })),
  };
}

/* ---------- ที่เก็บ ---------- */
export const jobKey = (tripId: string, carId: string) => tripId + ":" + carId;
/* อ่านจาก MockState: แผนเดินทางที่อนุมัติแล้วของ trips.ts + งานรายคัน */
export function jobsOf(m: MockState): JobsState {
  const trips = Object.fromEntries(tripsOf(m).filter((t) => t.status === "approved" && !t.listOnly).map((t) => [t.id, toJobTrip(t, m.plans)]));
  const jobs = Object.fromEntries(Object.entries(m.jobs?.jobs ?? {}).flatMap(([k, j]) => { const n = normJob(j); return n ? [[k, n]] : []; }));
  return { trips, jobs };
}
/* ที่เก็บเก่า (ก่อนตัด S23 S11 4 พ.ย. 2569) อาจมีสถานะของงานผู้รับจ้าง ⇒ แปลงเป็นสถานะที่ใกล้สุดจากข้อมูลที่มี (มีสาเหตุ = บำรุงรักษาไม่ได้ · ปิดงานแล้ว = เสร็จสิ้น · เริ่มแล้ว = อยู่ระหว่างบำรุงรักษา · อื่นๆ = ยังไม่เริ่ม)
   ฟิลด์ส่งตรวจ/ส่งกลับเก่าทิ้งไป · ข้อมูลเสีย (ไม่ใช่ object) = ไม่มีงาน */
const LEGACY = ["sentAt", "sentBy", "returnReason", "returnedAt", "reviewedAt", "reviewedBy"];
function normJob(j: unknown): Job | null {
  if (!j || typeof j !== "object") return null;
  const x = j as Job;
  const ok = (Object.keys(WSTAT) as string[]).includes(x.status);
  if (ok && Array.isArray(x.parts) && !LEGACY.some((k) => k in x)) return x;
  const rest = Object.fromEntries(Object.entries(x).filter(([k]) => !LEGACY.includes(k))) as unknown as Job;
  const status: JobStatus = ok ? x.status : x.cannot ? "cannot" : x.closedAt && x.close ? "done" : x.startedAt ? "doing" : "todo";
  return { ...rest, status, parts: Array.isArray(x.parts) ? x.parts : WORK.map((p) => ({ ...p })) };
}
export function useJobs(): JobsState { const m = useMock(); return useMemo(() => jobsOf(m), [m]); }
export const getTrip = (s: JobsState, id: string | null | undefined): JobTrip | undefined => (id ? s.trips[id] : undefined);
export const getJob = (s: JobsState, tripId: string, carId: string): Job => s.jobs[jobKey(tripId, carId)] ?? newJob(tripId, carId);
/* เขียน: งานรายคันลง MockState.jobs · แผนเดินทางที่เปลี่ยน (อ้างอิงคนละตัว) เขียนกลับ MockState.trips ใบเดียวกัน (ไม่มี = เพิ่มใบ) */
function write(fn: (s: JobsState) => JobsState, base?: Trip[]) {
  setMock((m0) => {
    const m = base ? { ...m0, trips: base } : m0;
    const cur = jobsOf(m), next = fn(cur);
    let trips = tripsOf(m), changed = false;
    for (const [id, jt] of Object.entries(next.trips)) {
      if (jt === cur.trips[id]) continue;
      const i = trips.findIndex((t) => t.id === id), t = fromJobTrip(jt, i < 0 ? undefined : trips[i]);
      trips = i < 0 ? [...trips, t] : trips.map((x, k) => (k === i ? t : x));
      changed = true;
    }
    return { ...m, jobs: { jobs: next.jobs }, ...(changed || base ? { trips } : {}) };
  });
}
/** เขียนงานรายคัน/แผนเดินทางจากที่อื่น (acceptance.ts) · base = ตั้งรายการแผนเดินทางใหม่ก่อน (ชุดตัวอย่าง) */
export const applyJobs = (fn: (s: JobsState) => JobsState, base?: Trip[]) => write(fn, base);
export function patchJob(tripId: string, carId: string, fn: (j: Job) => Job) {
  write((s) => ({ ...s, jobs: { ...s.jobs, [jobKey(tripId, carId)]: fn(getJob(s, tripId, carId)) } }));
}
export function patchTrip(tripId: string, fn: (t: JobTrip) => JobTrip) {
  write((s) => (s.trips[tripId] ? { ...s, trips: { ...s.trips, [tripId]: fn(s.trips[tripId]) } } : s));
}

/* ---------- อ่านค่าที่คำนวณ ---------- */
/** ป้ายผลน้ำมันต่อจากสถานะ (S12): เสร็จสิ้น + เก็บตัวอย่าง → ยังไม่มีผล "รอผลตรวจน้ำมัน" · ไม่ผ่าน "น้ำมันไม่ผ่าน" · ผ่าน/ไม่เก็บตัวอย่าง ไม่มีป้าย */
export function oilTag(j: Job): OilTag | undefined {
  if (j.status !== "done" || !oilSampled(j.oilChoice)) return undefined;
  const r = j.oilResult;
  return !r || r.sel < 0 ? "wait" : r.sel === 1 ? "fail" : undefined;
}
/** ความคืบหน้า "เสร็จสิ้น x จาก n คัน · อยู่ระหว่างบำรุงรักษา y · บำรุงรักษาไม่ได้ z" — แผนจ้างนับแบบเดียวกัน (รอตรวจรับ · ส่งกลับแก้ไข ตัดออกพร้อม S11 4 พ.ย. 2569) */
/* ความคืบหน้า + ตัวนับ "ตรวจแล้ว x/y" (R71 5 พ.ย. 2569): x = เสร็จสิ้น · y = รถทั้งหมด − บำรุงรักษาไม่ได้ (เจ้าของงาน "ทั้งหมด 10 แล้วมีคันที่ไม่ได้บำรุงรักษา จะเหลือ 9") · ใบจ้างนับแบบเดียวกัน */
export function tripCount(s: JobsState, t: JobTrip) {
  const st = t.carIds.map((c) => getJob(s, t.id, c).status);
  const n = (k: JobStatus) => st.filter((x) => x === k).length;
  return { done: n("done"), doing: n("doing"), cannot: n("cannot"), total: t.carIds.length - n("cannot") };
}
export const tripCounter = (s: JobsState, t: JobTrip) => { const c = tripCount(s, t); return "ตรวจแล้ว " + c.done + "/" + c.total; };
export function tripProgress(s: JobsState, t: JobTrip) {
  const c = tripCount(s, t);
  return "เสร็จสิ้น " + c.done + " จาก " + c.total + " คัน" + (c.doing ? " · อยู่ระหว่างบำรุงรักษา " + c.doing : "") + (c.cannot ? " · บำรุงรักษาไม่ได้ " + c.cannot + " (ไม่นับรวม)" : "");
}
/** จำนวนรายการเมนู "…" ของรถ (MENU = ดูรายละเอียด แก้ไข ลบ · JOB_MENU) — ยังไม่เริ่ม 3 · อยู่ระหว่างบำรุงรักษา 2 · อื่นๆ 1 · แผนจ้างชุดเดียวกัน (มุมผู้รับจ้างตัดออกพร้อม S23) */
export const menuCount = (st: JobStatus) => (st === "todo" ? 3 : st === "doing" ? 2 : 1);
/** ตารางอะไหล่ส่งคืน (retRows): [ชื่อ, ตามแผน, ใช้, คืน] พร้อมหน่วย */
export const retRows = (parts: Pick<PlanPart, "part" | "planQty" | "unit">[], used?: number[] | null): string[][] =>
  parts.map((p, k) => { const u = used ? used[k] ?? 0 : 0; return [p.part, p.planQty + " " + p.unit, u + " " + p.unit, Math.max(0, p.planQty - u) + " " + p.unit]; });
export const nf = (n: number) => n.toLocaleString("en-US");
export const num = (s: string | number | null | undefined) => { const v = Number(String(s ?? "").replace(/[^\d.]/g, "")); return Number.isFinite(v) ? v : 0; };
export const personSum = (r: CostRow) => (num(r.perDiem) + num(r.lodging)) * (r.days ?? 0);
export function costSummary(f: CloseForm) {
  const pd = f.costs.reduce((a, r) => a + num(r.perDiem) * (r.days ?? 0), 0);
  const lg = f.costs.reduce((a, r) => a + num(r.lodging) * (r.days ?? 0), 0);
  const tr = num(f.travel);
  return { perDiem: pd, lodging: lg, travel: tr, total: pd + lg + tr };
}
/** แถวอะไหล่ของหน้าปิดงานตามน้ำมันที่เลือก (เก็บตัวอย่างอย่างเดียว = ไม่มีน้ำมันไฮโดรลิก) */
export const closeRows = (f: CloseForm) => f.parts.filter((r) => !(f.oilChoice === 0 && r.part === OIL_PART));
/** พนักงาน กบค. ที่เลือกได้ในช่องลงนาม (ผู้รับมอบรถ/ผู้ส่งมอบรถ กบค.) และค่าใช้จ่ายรายคน — ตรวจเอง = พนักงานของแผนเดินทาง · แผนจ้างไม่มีพนักงานในใบ = พนักงาน กบค. ทั้งหมด (TRIP.staff) */
export const staffOf = (t: JobTrip) => (t.staff.length ? t.staff : PEOPLE.staff);

/* ---------- แถวอะไหล่ของงาน (ย้ายจาก hire.ts เดิม — ใช้ที่หน้างานรายคัน S10 และหน้ายอมรับผลรายคัน S13) ----------
   บำรุงรักษาไม่ได้ → อะไหล่ตามแผน (job.parts) + จำนวนที่ใช้ไปแล้ว (job.cannot.used)
   มีร่างปิดงาน / ปิดงานแล้ว → แถวรายการสภาพวัสดุอะไหล่ของหน้าปิดงาน (job.close.parts) ⇒ แก้ที่หน้างานแล้วหน้าปิดงานเห็นค่าเดียวกัน
   ยังไม่มีร่าง → อะไหล่ตามแผน (ใช้ = ตามแผน) · k = ลำดับในชุดข้อมูลต้นทาง (ใช้กับ editPartUsed / deleteJobPart) */
export interface WorkItem { task: string; part: string; planQty: number; usedQty: number; unit: string; k: number }
export interface NewPart { name: string; code: string; qty: string; unit: string }
export function workItems(j: Job): WorkItem[] {
  if (j.cannot) { const used = j.cannot.used; return j.parts.map((p, k) => ({ task: p.task, part: p.part, planQty: p.planQty, usedQty: used[k] ?? 0, unit: p.unit, k })); }
  if (j.close) return j.close.parts.map((r, k) => ({ task: j.parts.find((p) => p.part === r.part)?.task ?? "-", part: r.part, planQty: r.planQty, usedQty: r.used, unit: r.unit, k }));
  return j.parts.map((p, k) => ({ task: p.task, part: p.part, planQty: p.planQty, usedQty: p.planQty, unit: p.unit, k }));
}
/** jobWork() ของ screens.js: เลือกเก็บตัวอย่างอย่างเดียว = ไม่มีแถวเปลี่ยนน้ำมันไฮโดรลิก */
export function workShown(j: Job, rows = workItems(j)) {
  const oil = j.close ? j.close.oilChoice : j.oilChoice;
  return rows.filter((r) => !(oil === 0 && r.part === OIL_PART));
}
/* แก้อะไหล่ตามแผนที่หน้างานรายคัน (ยังไม่เริ่ม/อยู่ระหว่างบำรุงรักษา · BACKLOG ข้อ 4) — เก็บเป็นร่างของหน้าปิดงาน */
const withClose = (j: Job, t: JobTrip, c: TripCar, fn: (ps: ClosePartRow[]) => ClosePartRow[]): Job => {
  const f = j.close ?? emptyClose(j, t, c);
  return { ...j, close: { ...f, parts: fn(f.parts) } };
};
export function editPartUsed(t: JobTrip, c: TripCar, k: number, used: number) {
  patchJob(t.id, c.id, (j) => withClose(j, t, c, (ps) => ps.map((r, i) => (i === k ? { ...r, used } : r))));
}
export function addJobPart(t: JobTrip, c: TripCar, p: NewPart) {
  const part = p.name.trim(), code = p.code.trim() || undefined, qty = Number(p.qty);
  patchJob(t.id, c.id, (j) => withClose(j, t, c, (ps) => [...ps, { part, code, unit: p.unit, unitPrice: 0, planQty: 0, used: qty, old: 0, note: "", added: true }]));
}
export function deleteJobPart(t: JobTrip, c: TripCar, k: number) {
  patchJob(t.id, c.id, (j) => {
    const f = j.close ?? emptyClose(j, t, c), row = f.parts[k];
    return { ...j, parts: row && !row.added ? j.parts.filter((p) => p.part !== row.part) : j.parts, close: { ...f, parts: f.parts.filter((_, i) => i !== k) } };
  });
}

/* ---------- เปลี่ยนสถานะ ---------- */
/* เวลาตัวอย่างตามใบ (ตรวจเอง JOB_START/JOB_END · จ้าง HIRE_START) · ผู้เริ่มงาน/ผู้บันทึก = กบค. ทั้งสองแบบ (แผนจ้าง กบค. บันทึกแทนผู้รับจ้าง 4 พ.ย. 2569) */
const timesOf = (t: JobTrip) => (t.mode === "hire" ? JOB_TIMES.hire : JOB_TIMES.self);
/** S10 ยืนยันรับรถและเริ่มงาน → อยู่ระหว่างบำรุงรักษา (เวลา/ผู้เริ่มงานบันทึกเอง) */
/** S10 กดเริ่มงาน = อยู่ระหว่างบำรุงรักษาทันที แล้วเข้า Step 1 (5 พ.ย. 2569 "เข้ามา step 1 ถือว่า อยู่ระหว่างบำรุงรักษา เลย") */
export function startJob(t: JobTrip, carId: string, planned?: OilChoice) {
  patchJob(t.id, carId, (j) => ({
    ...j, status: "doing", step: 1, startedAt: timesOf(t).start, startedBy: PEOPLE.kbk,
    oilChoice: j.oilChoice ?? planned ?? OIL_DEFAULT, photos: (j.receive?.photos ?? []).flat(), cannot: undefined,
  }));
}
/** ขั้นที่ค้าง: มี step = ตามนั้น · ที่เก็บเก่า (ก่อน 5 พ.ย.) อยู่ระหว่างบำรุงรักษา = รับรถลงนามครบแล้ว ⇒ ขั้น 2 */
export const stepOf = (j: Job): 1 | 2 => j.step ?? (j.receive?.signers.every((s) => !!s.sig) ? 2 : 1);
/** Step 1 ยืนยันการตรวจสภาพ → Step 2 (ภาพก่อนเริ่มงานเก็บเป็นภาพของงาน) */
export function confirmInspect(t: JobTrip, carId: string) {
  patchJob(t.id, carId, (j) => ({ ...j, step: 2, photos: (j.receive?.photos ?? []).flat() }));
}
/** S10 ปิดงาน → "เสร็จสิ้น" ทันที ทั้งตรวจเองและแผนจ้าง (ไม่มีส่งตรวจงาน) · ใส่ผลน้ำมันมาแล้วเก็บเป็นผลการทดสอบ (S12) */
export function closeJob(t: JobTrip, carId: string, f: CloseForm) {
  const at = timesOf(t).end, by = PEOPLE.kbk;
  patchJob(t.id, carId, (j) => ({
    ...j, status: "done", close: f, closedAt: at, recordedBy: by, cannot: undefined,
    kmAfter: f.km + " กม.", hoursAfter: f.hours + " ชม.", oilChoice: f.oilChoice,
    oilResult: oilSampled(f.oilChoice) ? { sel: f.oilSel, files: f.oilFiles, sampledAt: at.slice(0, 10), sampledBy: by, ...(f.oilSel >= 0 ? { savedAt: at, savedBy: by } : {}) } : undefined,
    safety: { files: f.safetyFiles ?? [] },   // ไม่บังคับ — ปิดงานได้แม้ยังไม่แนบ
  }));
}
/** S10 บำรุงรักษาไม่ได้ → "บำรุงรักษาไม่ได้" ทันที ทั้งตรวจเองและแผนจ้าง (ไม่ต้องส่งตรวจ) */
export function cannotJob(t: JobTrip, carId: string, reason: string, used: number[], at: string) {
  patchJob(t.id, carId, (j) => ({ ...j, status: "cannot", cannot: { reason, used, by: PEOPLE.kbk, at, whileDoing: j.status === "doing" } }));
}
/** S12 บันทึกผลการทดสอบ (แก้ได้ภายหลัง) */
export function saveOilResult(t: JobTrip, carId: string, sel: OilSel, files: UploadFile[], by = PEOPLE.kbk) {
  patchJob(t.id, carId, (j) => ({ ...j, oilResult: { sampledAt: j.closedAt?.slice(0, 10) ?? "", sampledBy: j.recordedBy ?? by, ...j.oilResult, sel, files, savedAt: JOB_TIMES.self.resultSaved, savedBy: by } }));
}
/** S10 บันทึกเอกสาร Safety Inspection ภายหลัง (หน้างานรายคันที่เสร็จสิ้น · แก้ได้อีก) */
export function saveSafetyDocs(t: JobTrip, carId: string, files: UploadFile[], by = PEOPLE.kbk) {
  patchJob(t.id, carId, (j) => ({ ...j, safety: { files, savedAt: SAFETY_SAVED, savedBy: by } }));
}
/** S10 เมนูแก้ไข — ผู้ดูแลยานพาหนะ เบอร์ติดต่อ และสถานที่ของรถในแผนเดินทาง (ค่าว่าง/เท่าค่าเริ่ม = ใช้ค่าเริ่ม · tripCarEdit 6 พ.ย. 2569) */
export function editTripCar(t: JobTrip, c: TripCar, name: string, phone: string, loc: string, work?: [string, string] | null) {
  patchTrip(t.id, (x) => {
    const names = { ...(x.names ?? {}) }, phones = { ...x.phones }, locs = { ...x.locs }, works = { ...(x.works ?? {}) };
    if (name.trim() && name.trim() !== c.ctrl) names[c.id] = name.trim(); else delete names[c.id];
    if (phone.trim() && phone.trim() !== c.ownerPhone) phones[c.id] = phone.trim(); else delete phones[c.id];
    if (loc.trim() && loc.trim() !== "สำนักงาน " + c.owner) locs[c.id] = loc.trim(); else delete locs[c.id];
    if (work && !(work[0] === x.d1 && work[1] === x.d2)) works[c.id] = work; else if (work !== undefined) delete works[c.id];   // R83 วันดำเนินการ ทั้งช่วง = ไม่นับว่าแก้
    return { ...x, names, phones, locs, works };
  });
}
/** S10 เมนูลบ — เอารถออกจากแผนเดินทาง (กลับไปให้แผนเดินทางใบอื่นของไตรมาสเลือกได้) */
export function removeTripCar(t: JobTrip, carId: string) {
  write((s) => { const jobs = { ...s.jobs }; delete jobs[jobKey(t.id, carId)];
    return { ...s, jobs, trips: { ...s.trips, [t.id]: { ...s.trips[t.id], carIds: s.trips[t.id].carIds.filter((c) => c !== carId) } } }; });
}

/* ---------- ชุดตัวอย่าง (JOB_SETS) — เปิดจาก /scenarios/ ด้วย ?sample=<ชื่อ> ให้เห็นจอตามลำดับของ Figma โดยไม่ต้องกดไล่ ----------
   T1_afterClose = JOB_MIX (82-6789 เสร็จสิ้น + รอผลตรวจน้ำมัน · 82-1145 อยู่ระหว่างบำรุงรักษา · 80-9981 บำรุงรักษาไม่ได้ · 82-3302 ยังไม่เริ่ม)
   T1_afterCannot (80-9981 บำรุงรักษาไม่ได้) · TV_start ใบจ้างยังไม่เริ่ม · TV_mid = HIRE_ST (จอ I.22: คันแรก 80-5738 กบค. เริ่มงานแทนผู้รับจ้างแล้ว · คันที่ 2 81-2210 ปิดงานแล้ว · ที่เหลือยังไม่เริ่ม)
   ชุด TV_vendor (S23) TV_kbk (S11) ตัดออก 4 พ.ย. 2569
   T1_water / T1_waterSigned (R86 · 9 พ.ย. 2569 จอต่อท้าย S10 "ยานพาหนะประเภทรถพ่วงฉีดน้ำ — Step 1 ใช้แบบตรวจสภาพรถพ่วงฉีดน้ำ" · "… — ตรวจรายการและลงนามครบ"):
     ใบ T1 + ยานพาหนะรถพ่วงฉีดน้ำ 82-9012 ขอนแก่น (WATER_CAR = CAND[9] ของ screens.js) อยู่ระหว่างบำรุงรักษา Step 1 · ยังไม่ตรวจ / ตรวจรายการและลงนามครบ
     จอ Figma วางคันนี้ในใบ JOB_T (T1) กล่องการนัดหมายใช้ค่าของคันแรก (JOB_I) ⇒ เบอร์ติดต่อ/ผู้ดูแลยานพาหนะของคันนี้ในใบ = ค่าของ 82-6789 ตามจอ (ข้อมูลยานพาหนะไม่มีผู้ควบคุมของ กฟฉ.2)
     คันนี้เพิ่มเข้า "ยานพาหนะในไตรมาส 1" ของแผนตัวอย่างด้วย (qcars) ให้หน้าไตรมาสตรงกับใบ · ชุด T1 อื่นเอาออก */
export const SAMPLES = ["T1_start", "T1_afterClose", "T1_afterCannot", "TV_start", "TV_mid", "T1_water", "T1_waterSigned"] as const;
export type SampleName = (typeof SAMPLES)[number];
/* บทบาทที่สลับให้ตอนเปิดชุดตัวอย่าง — ทุกชุดเป็นของ กบค. */
export const SAMPLE_ROLE: Record<SampleName, Role> = { T1_start: "หน่วยงาน (กกฟ.1)", T1_afterClose: "หน่วยงาน (กกฟ.1)", T1_afterCannot: "หน่วยงาน (กกฟ.1)", TV_start: "หน่วยงาน (กกฟ.1)", TV_mid: "หน่วยงาน (กกฟ.1)",
  T1_water: "หน่วยงาน (กกฟ.1)", T1_waterSigned: "หน่วยงาน (กกฟ.1)" };
/** ยานพาหนะรถพ่วงฉีดน้ำของชุดตัวอย่าง (WATER_CAR) · เบอร์/ผู้ดูแลในใบ = ค่าของคันแรก JOB_I ตามจอ Figma */
export const WATER_CAR = "82-9012";
const WATER_Q = PLAN_ID + "-1";
function doing(t: JobTrip, carId: string): Job {
  const r = filledReceive(PEOPLE.kbk, carOf(carId) ?? { type: "" });
  return { ...newJob(t.id, carId), status: "doing", step: 2, oilChoice: SAMPLE_OIL(carId), receive: r, photos: r.photos.flat(), startedAt: timesOf(t).start, startedBy: PEOPLE.kbk };
}
/** งานที่ปิดแล้ว (เสร็จสิ้น · ยังไม่มีผลตรวจน้ำมัน) — ใช้กับชุดตัวอย่างของ S13 S14 ด้วย (acceptance.ts) */
export function closedSample(t: JobTrip, carId: string): Job {
  const car = carOf(carId)!, d = doing(t, carId), f = filledClose(d, t, car), at = timesOf(t).end, hire = t.mode === "hire";
  return { ...d, status: "done", close: f, closedAt: at, recordedBy: PEOPLE.kbk, kmAfter: (hire ? "176,090" : f.km) + " กม.", hoursAfter: (hire ? "5,846" : f.hours) + " ชม.",
    oilResult: { sel: -1, files: [], sampledAt: at.slice(0, 10), sampledBy: PEOPLE.kbk } };
}
function cannotSample(t: JobTrip, carId: string): Job {
  return { ...newJob(t.id, carId), status: "cannot", cannot: { reason: JOB_TEXT.cannotSelf, used: WORK.map(() => 0), by: PEOPLE.kbk, at: JOB_TIMES.self.start, whileDoing: false } };
}
/* จอ I.22 ไม่มีป้ายผลตรวจน้ำมันของคันที่ปิดแล้ว ⇒ คันนี้เลือก "เปลี่ยนน้ำมัน" (ไม่เก็บตัวอย่าง) */
const changedOnly = (j: Job): Job => ({ ...j, oilChoice: 1, close: j.close && { ...j.close, oilChoice: 1 }, oilResult: undefined });
/** Step 1 อยู่ระหว่างบำรุงรักษา (เริ่มงานแล้ว) · filled = ตรวจรายการและลงนามครบ */
function step1(t: JobTrip, carId: string, filled: boolean): Job {
  const c = carOf(carId) ?? { type: "" }, r = filled ? filledReceive(PEOPLE.kbk, c) : emptyReceive(c);
  return { ...newJob(t.id, carId), status: "doing", step: 1, oilChoice: SAMPLE_OIL(carId), receive: r, startedAt: timesOf(t).start, startedBy: PEOPLE.kbk };
}
/* รถพ่วงฉีดน้ำในยานพาหนะของไตรมาส 1 แผนตัวอย่าง — ชุด T1_water* เพิ่ม · ชุด T1 อื่นเอาออก (ไม่แตะค่าที่แก้อื่นของไตรมาส) */
function waterInQuarter(on: boolean) {
  setMock((m) => {
    const e = m.qcars?.[WATER_Q];
    if (!on && !e?.added.includes(WATER_CAR)) return m;
    const base = e ?? { added: [], removed: [], phones: {}, locs: {} };
    const added = on ? [WATER_CAR, ...base.added.filter((x) => x !== WATER_CAR)] : base.added.filter((x) => x !== WATER_CAR);
    return { ...m, qcars: { ...m.qcars, [WATER_Q]: { ...base, added, removed: base.removed.filter((x) => x !== WATER_CAR) } } };
  });
}
export function applySample(name: SampleName) {
  const T1 = SEED_TRIPS.T1, TV = SEED_TRIPS.TV;
  const T1W: JobTrip = { ...T1, carIds: [...T1.carIds, WATER_CAR], phones: { ...T1.phones, [WATER_CAR]: TRIP_CARS[0].ownerPhone }, names: { ...T1.names, [WATER_CAR]: TRIP_CARS[0].ctrl } };
  if (name.startsWith("T1_")) waterInQuarter(name.startsWith("T1_water"));
  const put = (list: Job[]) => Object.fromEntries(list.map((j) => [jobKey(j.tripId, j.carId), j]));
  write((s) => {
    const keep = (tid: string) => Object.fromEntries(Object.entries(s.jobs).filter(([k]) => !k.startsWith(tid + ":")));
    switch (name) {
      case "T1_start": return { trips: { ...s.trips, T1 }, jobs: keep("T1") };
      case "T1_afterClose": return { trips: { ...s.trips, T1 }, jobs: { ...keep("T1"), ...put([closedSample(T1, "82-6789"), doing(T1, "82-1145"), cannotSample(T1, "80-9981")]) } };
      case "T1_afterCannot": return { trips: { ...s.trips, T1 }, jobs: { ...keep("T1"), ...put([cannotSample(T1, "80-9981")]) } };
      case "TV_start": return { trips: { ...s.trips, TV }, jobs: keep("TV") };
      case "TV_mid": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([doing(TV, TV.carIds[0]), changedOnly(closedSample(TV, TV.carIds[1]))]) } };
      case "T1_water": return { trips: { ...s.trips, T1: T1W }, jobs: { ...keep("T1"), ...put([step1(T1W, WATER_CAR, false)]) } };
      case "T1_waterSigned": return { trips: { ...s.trips, T1: T1W }, jobs: { ...keep("T1"), ...put([step1(T1W, WATER_CAR, true)]) } };
    }
  });
}
/* เวลาไทย "dd/mm/yyyy hh:mm น." (พ.ศ.) — ใช้กับเหตุการณ์ที่จอ Figma ไม่มีค่าตัวอย่าง */
export const thaiNow = () => { const t = new Date(), p = (n: number) => String(n).padStart(2, "0"); return p(t.getDate()) + "/" + p(t.getMonth() + 1) + "/" + (t.getFullYear() + 543) + " " + p(t.getHours()) + ":" + p(t.getMinutes()) + " น."; };
