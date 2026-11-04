"use client";
/* ข้อมูลจำลองงานรายคัน (S10 S12 · ต่อยอด S23 S11) — เจ้าของ: batch C1
   ค่าตัวอย่างชุดเดียวกับปลั๊กอิน Figma (Maintenance-Request-Form/figma-export/maintainance-plugin/screens.js):
   TRIP_CARS · TRIP_1 / TRIP_V · WORK · JOB_START/JOB_END/JOB_BY · HIRE_* · CLOSE_PARTS · CLOSE_COST_BY · RECEIPT_* · INSPECT_* · OIL_TAG · JOB_OIL_OPTS
   เก็บใน localStorage คีย์ mt-next-v1 (ฟิลด์ jobs ของ MockState — เพิ่มด้วย module augmentation ไม่แตะ store.ts) · "ล้างข้อมูลจำลอง" = ไม่มีงานรายคัน + แผนเดินทางตั้งต้นของ trips.ts

   โครง: JobsState = { trips: แผนเดินทางที่อนุมัติแล้ว (มุมมองจากที่เก็บแผนเดินทางของ trips.ts), jobs: งานรายคัน คีย์ "<trip>:<car>" }
   แผนเดินทางมีที่เก็บเดียวคือ MockState.trips (trips.ts · S6 S9 สร้าง · S7 อนุมัติ) — ที่นี่อ่านใบที่อนุมัติแล้วมาแปลงเป็น JobTrip (เติม planMr planName ป้ายไตรมาส จากแผนใน store)
   แก้เบอร์/สถานที่/เอารถออก (S10) และชุดตัวอย่าง เขียนกลับไปที่ MockState.trips ใบเดียวกัน · MockState.jobs เก็บเฉพาะงานรายคัน
   รถ (TRIP_CARS) ก็มาจาก trips.ts ชุดเดียวกัน (เติมประเภทรถ + เปลี่ยนน้ำมันครั้งล่าสุด)
   งานที่ยังไม่มีในที่เก็บ = ยังไม่เริ่ม (getJob คืนค่าตั้งต้น) · เปลี่ยนสถานะผ่านฟังก์ชันท้ายไฟล์ (startJob closeJob cannotJob saveOilResult …)
   สถานะ hire (worked reported wait returned) มีใน JobStatus ครบ — การเปลี่ยนสถานะของแผนจ้าง (ส่งตรวจงาน อนุมัติ ส่งกลับ แก้อะไหล่) อยู่ที่ ./hire.ts (เรียก patchJob())
   ที่เก็บงานรายคันมีที่เดียวคือไฟล์นี้ (MockState.jobs) — S10 S12 S23 S11 ใช้ร่วมกัน */
import type { InspectionItem } from "@/components/maintain-d/InspectionChecklist";
import type { ReceiptItem } from "@/components/maintain-d/ReceiptChecklist";
import type { UploadFile } from "@/components/vms/FileUpload";
import type { PillColor } from "@/components/vms/PillOutline";
import { useMemo } from "react";
import { PLANS, type Plan } from "./data";
import { setMock, useMock, type MockState, type Role } from "./store";
import { APPROVED_AT, TRIP_1, TRIP_CARS as CARS, TRIP_V, tripsOf, type Trip } from "./trips";

/* ---------- เพิ่มฟิลด์ jobs ให้ MockState (store.ts) ---------- */
declare module "./store" {
  interface MockState { jobs?: { jobs: Record<string, Job> } }
}

/* ---------- สถานะงานรายคัน WSTAT · ป้ายผลน้ำมัน OIL_TAG ---------- */
export type JobStatus = "todo" | "doing" | "done" | "cannot" | "worked" | "reported" | "wait" | "returned";
export const WSTAT: Record<JobStatus, [string, PillColor]> = {
  todo: ["ยังไม่เริ่ม", "Gray"],
  doing: ["อยู่ระหว่างบำรุงรักษา", "Warning"],
  done: ["เสร็จสิ้น", "Success"],
  cannot: ["บำรุงรักษาไม่ได้", "Error"],
  worked: ["ดำเนินการบำรุงรักษาแล้ว", "Info"],
  reported: ["แจ้งบำรุงรักษาไม่ได้", "Info"],
  wait: ["รอตรวจรับ", "Warning"],
  returned: ["ส่งกลับแก้ไข", "Error"],
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
  kbk: "นายวิชัย ทองดี (กบค.)",                                         // JOB_BY · ผู้สร้าง
  vendor: "นายประเสริฐ ศรีสุข (ผู้รับจ้าง)",                              // HIRE_BY
  ownerSigner: "นายสุรชัย แก้วมณี",                                      // SIGN_OWNER
};
/* เวลาตัวอย่างของจอ Figma (ต้นแบบใช้ค่าคงที่ให้ตรงจอ) */
export const JOB_TIMES = {
  self: { start: "04/11/2569 08:42 น.", end: "04/11/2569 11:15 น.", resultSaved: "11/11/2569 14:02 น." },
  hire: { start: "17/11/2569 09:10 น.", end: "17/11/2569 13:25 น.", sent: "17/11/2569 16:40 น.", sentCannot: "18/11/2569 08:50 น.", reported: "18/11/2569 08:35 น." },
};
export const SIGN_DATE = "04/11/2569";
/* Safety Inspection (JO 7.3.3) — แสดงเฉพาะรถประเภทนี้ (SAFETY_TYPES ใน screens.js) · เวลาบันทึกตามจอ "บันทึกเอกสาร Safety Inspection สำเร็จ" */
export const SAFETY_TYPES = ["รถเครน", "รถกระเช้า"];
export const SAFETY_SAVED = "12/11/2569 09:30 น.";
export const safetyOn = (c: { type: string }) => SAFETY_TYPES.includes(c.type);
export const ODOMETER = { self: ["182,400 กม.", "6,120 ชม."], hire: ["176,050 กม.", "5,840 ชม."] } as const;
export const JOB_TEXT = {
  cannotSelf: "รถติดภารกิจซ่อมสายส่งฉุกเฉิน ไม่อยู่ที่จุดนัดในวันเดินทาง",   // JOB_CANNOT
  cannotHire: "กระบอกสูบไฮโดรลิกหลักรั่ว ต้องส่งซ่อมก่อนจึงบำรุงรักษาได้",   // HIRE_WHY
  backDone: "จำนวนไส้กรองอากาศที่คืนไม่ตรงกับภาพอะไหล่ใหม่ที่เหลือ กรุณาตรวจนับและแก้จำนวนที่คืน",   // HIRE_BACK
  backCannot: "กรุณาระบุตำแหน่งที่รั่วและผลตรวจเบื้องต้นในสาเหตุให้ชัดเจน",                       // HIRE_BACK_CANNOT
};
export const CANNOT_USED_SAMPLE = [30, 2, 0, 0];   // CANNOT_USED — เปลี่ยนน้ำมันและไส้กรองไฮโดรลิกแล้วพบปัญหา
export const OIL_FILE: UploadFile = { name: "oil-test-82-6789.pdf", size: "420 KB", bar: true };
export const BEFORE = ["รูปรถ + ทะเบียน", "อะไหล่ใหม่"];   // ภาพก่อนเริ่มงาน 2 ช่อง

/* ---------- รถของไตรมาส 1 แผน MR Z7000001 (TRIP_CARS + OWNER_PH + LAST_OIL) ---------- */
export interface TripCar { id: string; plate: string; model: string; owner: string; ownerPhone: string; type: string; lastOil: string }
/* รถชุดเดียวกับ trips.ts (TRIP_CARS + OWNER_PH) · เปลี่ยนน้ำมันครั้งล่าสุด LAST_OIL (82-3302 = 05/02/2567 · คันอื่น 12/03/2568) */
const LAST_OIL_OF: Record<string, string> = { "82-3302": "05/02/2567" };
export const TRIP_CARS: TripCar[] = CARS.map((c) => ({ id: c.id, plate: c.plate, model: c.model, owner: c.owner, ownerPhone: c.phone, type: "รถกระเช้า", lastOil: LAST_OIL_OF[c.id] ?? "12/03/2568" }));
export const carOf = (id: string) => TRIP_CARS.find((c) => c.id === id);

/* ---------- แผนเดินทางที่อนุมัติแล้ว — มุมมองของ Trip (trips.ts) ที่สถานะ approved ----------
   planMr planName จากแผนใน store · quarter = ป้าย "ไตรมาส n" · q = เลขไตรมาส */
export interface JobTrip {
  id: string; planId: string; planMr: string; planName: string; quarter: string; q: number;
  name: string; mode: "self" | "hire"; vendor?: string; contract?: string;
  carIds: string[];
  /** สถานที่/เบอร์ที่แก้รายคัน (ไม่มี = สำนักงานเจ้าของรถ / เบอร์เจ้าของรถ) */
  locs: Record<string, string>; phones: Record<string, string>;
  d1: string; d2: string; staff: string[]; createdBy: string; sentAt: string;
  status: "approved"; approvedAt?: string;
}
export function toJobTrip(t: Trip, plans: Plan[]): JobTrip {
  const p = plans.find((x) => x.mr === "MR " + t.planId);
  return { id: t.id, planId: t.planId, planMr: "MR " + t.planId, planName: p?.name ?? "", quarter: "ไตรมาส " + t.quarter, q: t.quarter,
    name: t.name, mode: t.mode, vendor: t.vendor, contract: t.contract, carIds: t.carIds, locs: t.locs, phones: t.phones,
    d1: t.d1, d2: t.d2, staff: t.staff ?? [], createdBy: t.createdBy, sentAt: t.sentAt, status: "approved", approvedAt: t.approvedAt };
}
/* เขียนกลับเป็น Trip (คงค่าอื่นของใบเดิม) */
const fromJobTrip = (j: JobTrip, prev?: Trip): Trip => ({
  ...prev, id: j.id, planId: j.planId, quarter: j.q, name: j.name, mode: j.mode, vendor: j.vendor, contract: j.contract, carIds: j.carIds,
  locs: j.locs, phones: j.phones, d1: j.d1, d2: j.d2, staff: j.mode === "self" ? j.staff : prev?.staff, createdBy: j.createdBy, sentAt: j.sentAt,
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
  ["ชื่อแผนเดินทาง", t.name], ["แผน", t.planMr + " " + t.planName], ["ไตรมาส", t.quarter], ["รูปแบบดำเนินการ", t.vendor ? "จ้างดำเนินการ" : "กบค. ดำเนินการเอง"],
  ...(t.vendor
    ? [["ผู้รับจ้าง", t.vendor], ["เลขที่สัญญา/ใบสั่งจ้าง", t.contract || "-"], ["ช่วงวันทำงาน", tripRange(t)]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงาน กบค. ซ่อม", t.staff.join(", ")]] as [string, string][]),
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
/* jobWork — เลือกเก็บตัวอย่างอย่างเดียว = ไม่มีแถวเปลี่ยนน้ำมันไฮโดรลิก */
export const jobWork = (parts: PlanPart[], oil?: OilChoice | null) => parts.filter((p) => !(oil === 0 && p.part === OIL_PART));

/* ---------- ฟอร์ม ---------- */
export interface Signer { name: string | null; /** ลายเซ็น (data URL) · มีค่า = ลงนามแล้ว */ sig: string | null }
/** หน้ารับรถ (receivePage) — เก็บร่างระหว่างกรอก · ยืนยันแล้วคงไว้เป็นข้อมูลของงาน */
export interface ReceiveForm { items: ReceiptItem[]; signers: [Signer, Signer]; /** ไฟล์ต่อช่อง BEFORE */ photos: UploadFile[][] }
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
  inspect: InspectionItem[]; signers: [Signer, Signer]; docs: CloseDoc[];
  /** เอกสาร Safety Inspection (ถ้ามี) — เฉพาะรถเครน/รถกระเช้า (4 พ.ย. 2569 · JO 7.3.3) · ฟอร์มเก่าในที่เก็บไม่มีฟิลด์นี้ */
  safetyFiles?: UploadFile[];
}
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
  /** ภาพก่อนเริ่มงาน (จากหน้ารับรถ · ผู้รับจ้างแก้ไขได้ S23) */
  photos?: UploadFile[];
  startedAt?: string; startedBy?: string;
  close?: CloseForm;
  closedAt?: string; recordedBy?: string; kmAfter?: string; hoursAfter?: string;
  cannot?: CannotInfo;
  oilResult?: OilResult;
  safety?: SafetyDocs;
  /* ---- แผนจ้าง (S23 S11 — batch C2) ---- */
  sentAt?: string; sentBy?: string;
  returnReason?: string; returnedAt?: string;
  reviewedAt?: string; reviewedBy?: string;
  /** หน่วยงานยอมรับผลรายคันแล้ว (S13 · acceptance.ts) */
  acceptedAt?: string;
}
export interface JobsState { trips: Record<string, JobTrip>; jobs: Record<string, Job> }

/* ---------- ค่าตั้งต้น ---------- */
export const RECEIPT_ITEMS = ["แผ่นป้ายทะเบียนหน้า - หลัง", "ป้ายทะเบียนติดกระจกและ พรบ.", "กระจกมองข้างซ้าย - ขวา, กระจกมองหลัง", "ยางอะไหล่", "แบตเตอรี่", "เครื่องมือประจำรถ, แม่แรง, ประแจถอดล้อ", "ฝาถังน้ำมัน",
  "อุปกรณ์บนหน้าปัด, แตร", "ใบปัดน้ำฝน", "วิทยุ, ลำโพง, เสาอากาศ, วิทยุรับ - ส่ง", "ระบบไฟแสงสว่าง", "สภาพยาง", "สภาพตัวถังและสี"];
export const INSPECT_ITEMS = ["ชุดเกียร์ PTO", "ชุดกระบอกขาช้างหน้า ซ้าย ขวา", "ชุดกระบอกขาช้างหลัง ซ้าย ขวา", "ชุดวาร์ลคอนโทรลขาช้าง", "เพลาขับปั๊มน้ำมันไฮดรอลิค", "ปั๊มน้ำมันไฮดรอลิค", "ชุดยึดฐานเครน", "ชุดโรตารี่",
  "ชุดมอเตอร์และเฟื่องหมุนฐานเครน", "ชุด CONTROL ล่าง", "ชุดกระบอก LOWER BOOM", "ชุดกระบอก UPPER BOOM", "ชุดกระบอก เทน้ำ-ปรับดิ่ง", "จุดเชื่อมต่อโครงสร้าง BOOM", "ชุดวาล์วล๊อคต่างๆ", "สายน้ำมันไฮดรอลิค",
  "ชุด CONTROL บน", "กระบอกปรับบิด", "BUCKET, LINER, ชุดการ์ดครอบ", "ระบบ EMERGENCY", "ระบบเร่งเครื่องยนต์", "สายสัญญาณต่างๆ", "รอกและเชือกวินซ์", "ชุด LIFT รุ่น 115 kV"];
export const CLOSE_DOCS = ["บันทึกใบสั่งการ"];
const signer = (): Signer => ({ name: null, sig: null });
export const emptyReceive = (): ReceiveForm => ({ items: RECEIPT_ITEMS.map((name) => ({ name, has: null, damaged: false, wrongModel: false, note: "" })), signers: [signer(), signer()], photos: BEFORE.map(() => []) });
/* ฟอร์มปิดงานตั้งต้น: อะไหล่จากอะไหล่ตามแผน (ใช้ = ตามแผน · อะไหล่เก่า 0) · พนักงานตามแผนเดินทาง (เงินว่าง) · ศูนย์ต้นทุนของเจ้าของรถ */
export function emptyClose(job: Job, trip: JobTrip, car: TripCar): CloseForm {
  return {
    parts: job.parts.map((p) => ({ part: p.part, code: p.code, unit: p.unit, unitPrice: p.unitPrice, planQty: p.planQty, used: p.planQty, old: 0, note: "" })),
    costs: (trip.staff.length ? trip.staff : [null]).map((name) => ({ name, perDiem: "", lodging: "", days: null })),
    travel: "", costCenter: ownerCostCenter(car), km: "", hours: "",
    oilChoice: job.oilChoice ?? OIL_DEFAULT, oilSel: -1, oilFiles: [],
    inspect: INSPECT_ITEMS.map((name) => ({ name, ok: null, note: "" })), signers: [signer(), signer()],
    docs: CLOSE_DOCS.map((name) => ({ name, sel: null, files: [] })),
  };
}
export const newJob = (tripId: string, carId: string): Job => ({ tripId, carId, status: "todo", parts: WORK.map((p) => ({ ...p })) });

/* ข้อมูลกรอกครบตามจอ Figma (ใช้กับชุดตัวอย่าง) */
const filledReceive = (by: string): ReceiveForm => ({
  items: RECEIPT_ITEMS.map((name, i) => ({ name, has: true, damaged: i === 11, wrongModel: false, note: i === 11 ? "ยางหลังซ้ายสึก แจ้งเจ้าของรถแล้ว" : "" })),
  signers: [{ name: PEOPLE.ownerSigner, sig: "sample" }, { name: by.replace(/ \(.*\)$/, ""), sig: "sample" }],
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
    inspect: f.inspect.map((it, i) => (i === 15 ? { ...it, ok: false, note: "มีรอยซึม นัดเปลี่ยนรอบถัดไป" } : { ...it, ok: true })),
    signers: [{ name: PEOPLE.kbk.replace(" (กบค.)", ""), sig: "sample" }, { name: PEOPLE.ownerSigner, sig: "sample" }],
    docs: f.docs.map((d) => ({ ...d, sel: "มี" })),
  };
}

/* ---------- ที่เก็บ ---------- */
export const jobKey = (tripId: string, carId: string) => tripId + ":" + carId;
/* อ่านจาก MockState: แผนเดินทางที่อนุมัติแล้วของ trips.ts + งานรายคัน */
export function jobsOf(m: MockState): JobsState {
  const trips = Object.fromEntries(tripsOf(m).filter((t) => t.status === "approved" && !t.listOnly).map((t) => [t.id, toJobTrip(t, m.plans)]));
  return { trips, jobs: m.jobs?.jobs ?? {} };
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
/** ความคืบหน้า "เสร็จสิ้น x จาก n คัน · อยู่ระหว่างบำรุงรักษา y · บำรุงรักษาไม่ได้ z · รอตรวจรับ w · ส่งกลับแก้ไข v" */
export function tripProgress(s: JobsState, t: JobTrip) {
  const st = t.carIds.map((c) => getJob(s, t.id, c).status);
  const n = (k: JobStatus) => st.filter((x) => x === k).length;
  const extra = ([["doing", "อยู่ระหว่างบำรุงรักษา"], ["cannot", "บำรุงรักษาไม่ได้"], ["wait", "รอตรวจรับ"], ["returned", "ส่งกลับแก้ไข"]] as [JobStatus, string][])
    .map(([k, l]) => (n(k) ? " · " + l + " " + n(k) : "")).join("");
  return "เสร็จสิ้น " + n("done") + " จาก " + t.carIds.length + " คัน" + extra;
}
/** จำนวนรายการเมนู "…" ของรถ (MENU = ดูรายละเอียด แก้ไข ลบ) — กบค.: ยังไม่เริ่ม 3 · อยู่ระหว่างบำรุงรักษา 2 · อื่นๆ 1 · ผู้รับจ้าง 1 เสมอ */
export const menuCount = (st: JobStatus, vendor?: boolean) => (vendor ? 1 : st === "todo" ? 3 : st === "doing" ? 2 : 1);
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
export const actorOf = (vendor: boolean) => (vendor ? PEOPLE.vendor : PEOPLE.kbk);

/* ---------- เปลี่ยนสถานะ ---------- */
/** S10 ยืนยันรับรถและเริ่มงาน → อยู่ระหว่างบำรุงรักษา (เวลา/ผู้เริ่มงานบันทึกเอง) */
export function startJob(t: JobTrip, carId: string, vendor: boolean) {
  patchJob(t.id, carId, (j) => ({
    ...j, status: "doing", startedAt: vendor ? JOB_TIMES.hire.start : JOB_TIMES.self.start, startedBy: actorOf(vendor),
    oilChoice: j.oilChoice ?? OIL_DEFAULT, photos: (j.receive?.photos ?? []).flat(), cannot: undefined, returnReason: j.status === "returned" ? j.returnReason : undefined,
  }));
}
/** S10 ปิดงาน → ตรวจเอง "เสร็จสิ้น" · จ้าง "ดำเนินการบำรุงรักษาแล้ว" · ใส่ผลน้ำมันมาแล้วเก็บเป็นผลการทดสอบ (S12) */
export function closeJob(t: JobTrip, carId: string, f: CloseForm, vendor: boolean) {
  const at = vendor ? JOB_TIMES.hire.end : JOB_TIMES.self.end, by = actorOf(vendor);
  patchJob(t.id, carId, (j) => ({
    ...j, status: t.mode === "hire" ? "worked" : "done", close: f, closedAt: at, recordedBy: by, cannot: undefined,
    kmAfter: f.km + " กม.", hoursAfter: f.hours + " ชม.", oilChoice: f.oilChoice,
    oilResult: oilSampled(f.oilChoice) ? { sel: f.oilSel, files: f.oilFiles, sampledAt: at.slice(0, 10), sampledBy: by, ...(f.oilSel >= 0 ? { savedAt: at, savedBy: by } : {}) } : undefined,
    safety: { files: f.safetyFiles ?? [] },   // ไม่บังคับ — ปิดงานได้แม้ยังไม่แนบ
  }));
}
/** S10 บำรุงรักษาไม่ได้ → ตรวจเอง "บำรุงรักษาไม่ได้" · จ้าง "แจ้งบำรุงรักษาไม่ได้" */
export function cannotJob(t: JobTrip, carId: string, reason: string, used: number[], vendor: boolean, at: string) {
  patchJob(t.id, carId, (j) => ({ ...j, status: t.mode === "hire" ? "reported" : "cannot", cannot: { reason, used, by: actorOf(vendor), at, whileDoing: j.status === "doing" } }));
}
/** S12 บันทึกผลการทดสอบ (แก้ได้ภายหลัง) */
export function saveOilResult(t: JobTrip, carId: string, sel: OilSel, files: UploadFile[], by = PEOPLE.kbk) {
  patchJob(t.id, carId, (j) => ({ ...j, oilResult: { sampledAt: j.closedAt?.slice(0, 10) ?? "", sampledBy: j.recordedBy ?? by, ...j.oilResult, sel, files, savedAt: JOB_TIMES.self.resultSaved, savedBy: by } }));
}
/** S10 บันทึกเอกสาร Safety Inspection ภายหลัง (หน้างานรายคันที่เสร็จสิ้น · แก้ได้อีก) */
export function saveSafetyDocs(t: JobTrip, carId: string, files: UploadFile[], by = PEOPLE.kbk) {
  patchJob(t.id, carId, (j) => ({ ...j, safety: { files, savedAt: SAFETY_SAVED, savedBy: by } }));
}
/** S10 เมนูแก้ไข — เบอร์ติดต่อและสถานที่ของรถในแผนเดินทาง (ค่าว่าง/เท่าค่าเริ่ม = ใช้ค่าเริ่ม) */
export function editTripCar(t: JobTrip, c: TripCar, phone: string, loc: string) {
  patchTrip(t.id, (x) => {
    const phones = { ...x.phones }, locs = { ...x.locs };
    if (phone.trim() && phone.trim() !== c.ownerPhone) phones[c.id] = phone.trim(); else delete phones[c.id];
    if (loc.trim() && loc.trim() !== "สำนักงาน " + c.owner) locs[c.id] = loc.trim(); else delete locs[c.id];
    return { ...x, phones, locs };
  });
}
/** S10 เมนูลบ — เอารถออกจากแผนเดินทาง (กลับไปให้แผนเดินทางใบอื่นของไตรมาสเลือกได้) */
export function removeTripCar(t: JobTrip, carId: string) {
  write((s) => { const jobs = { ...s.jobs }; delete jobs[jobKey(t.id, carId)];
    return { ...s, jobs, trips: { ...s.trips, [t.id]: { ...s.trips[t.id], carIds: s.trips[t.id].carIds.filter((c) => c !== carId) } } }; });
}

/* ---------- ชุดตัวอย่าง (JOB_SETS) — เปิดจาก /scenarios/ ด้วย ?sample=<ชื่อ> ให้เห็นจอตามลำดับของ Figma โดยไม่ต้องกดไล่ ----------
   T1_afterClose = JOB_MIX (82-6789 เสร็จสิ้น + รอผลตรวจน้ำมัน · 82-1145 อยู่ระหว่างบำรุงรักษา · 80-9981 บำรุงรักษาไม่ได้ · 82-3302 ยังไม่เริ่ม)
   T1_afterCannot (80-9981 บำรุงรักษาไม่ได้) · TV_vendor = HIRE_VENDOR (S23) · TV_kbk = HIRE_MIX (S11) */
export const SAMPLES = ["T1_start", "T1_afterClose", "T1_afterCannot", "TV_start", "TV_vendor", "TV_kbk"] as const;
export type SampleName = (typeof SAMPLES)[number];
/* ชื่อเรียกตาม scenario (ลิงก์ S23 S11 ในหน้า /scenarios/) + บทบาทที่สลับให้ตอนเปิดชุดตัวอย่าง */
export const SAMPLE_ALIAS: Record<string, SampleName> = { S23: "TV_vendor", S11: "TV_kbk" };
export const SAMPLE_ROLE: Partial<Record<SampleName, Role>> = { T1_start: "กบค.", T1_afterClose: "กบค.", T1_afterCannot: "กบค.", TV_vendor: "ผู้รับจ้าง", TV_kbk: "กบค." };
export const sampleOf = (name: string | null | undefined): SampleName | undefined =>
  !name ? undefined : (SAMPLES as readonly string[]).includes(name) ? (name as SampleName) : SAMPLE_ALIAS[name];
/* ภาพก่อนเริ่มงานของชุดตัวอย่าง: ตรวจเอง = ไฟล์จากหน้ารับรถ · จ้าง = photoFiles() ของ screens.js (before-1.jpg before-2.jpg) */
const samplePhotos = (vendor: boolean): UploadFile[] =>
  vendor ? BEFORE.map((_, k) => ({ name: "before-" + (k + 1) + ".jpg", size: "2.4 MB", bar: true })) : filledReceive(actorOf(vendor)).photos.flat();
function doing(t: JobTrip, carId: string, vendor: boolean): Job {
  return { ...newJob(t.id, carId), status: "doing", oilChoice: OIL_DEFAULT, receive: filledReceive(actorOf(vendor)), photos: samplePhotos(vendor),
    startedAt: vendor ? JOB_TIMES.hire.start : JOB_TIMES.self.start, startedBy: actorOf(vendor) };
}
export const closedSample = (t: JobTrip, carId: string, vendor: boolean, status: JobStatus) => closed(t, carId, vendor, status);
function closed(t: JobTrip, carId: string, vendor: boolean, status: JobStatus): Job {
  const car = carOf(carId)!, d = doing(t, carId, vendor), f = filledClose(d, t, car), at = vendor ? JOB_TIMES.hire.end : JOB_TIMES.self.end, by = actorOf(vendor);
  return { ...d, status, close: f, closedAt: at, recordedBy: by, kmAfter: (vendor ? "176,090" : f.km) + " กม.", hoursAfter: (vendor ? "5,846" : f.hours) + " ชม.",
    oilResult: { sel: -1, files: [], sampledAt: at.slice(0, 10), sampledBy: by } };
}
function cannotSample(t: JobTrip, carId: string, vendor: boolean, status: JobStatus): Job {
  return { ...newJob(t.id, carId), status, cannot: { reason: vendor ? JOB_TEXT.cannotHire : JOB_TEXT.cannotSelf, used: WORK.map(() => 0), by: actorOf(vendor), at: vendor ? JOB_TIMES.hire.reported : JOB_TIMES.self.start, whileDoing: false } };
}
export function applySample(name: SampleName) {
  const T1 = SEED_TRIPS.T1, TV = SEED_TRIPS.TV;
  const put = (list: Job[]) => Object.fromEntries(list.map((j) => [jobKey(j.tripId, j.carId), j]));
  write((s) => {
    const keep = (tid: string) => Object.fromEntries(Object.entries(s.jobs).filter(([k]) => !k.startsWith(tid + ":")));
    const sent = (j: Job, cannot = false): Job => ({ ...j, sentAt: cannot ? JOB_TIMES.hire.sentCannot : JOB_TIMES.hire.sent, sentBy: PEOPLE.vendor });
    switch (name) {
      case "T1_start": return { trips: { ...s.trips, T1 }, jobs: keep("T1") };
      case "T1_afterClose": return { trips: { ...s.trips, T1 }, jobs: { ...keep("T1"), ...put([closed(T1, "82-6789", false, "done"), doing(T1, "82-1145", false), cannotSample(T1, "80-9981", false, "cannot")]) } };
      case "T1_afterCannot": return { trips: { ...s.trips, T1 }, jobs: { ...keep("T1"), ...put([cannotSample(T1, "80-9981", false, "cannot")]) } };
      case "TV_start": return { trips: { ...s.trips, TV }, jobs: keep("TV") };
      case "TV_vendor": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([
        { ...sent(closed(TV, "80-5738", true, "returned")), returnReason: JOB_TEXT.backDone },
        sent(cannotSample(TV, "81-2210", true, "wait"), true), closed(TV, "82-7720", true, "worked"), doing(TV, "80-3316", true)]) } };
      case "TV_kbk": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([
        sent(closed(TV, "80-5738", true, "wait")), sent(cannotSample(TV, "81-2210", true, "wait"), true), doing(TV, "82-7720", true)]) } };
    }
  });
}
/* เวลาไทย "dd/mm/yyyy hh:mm น." (พ.ศ.) — ใช้กับเหตุการณ์ที่จอ Figma ไม่มีค่าตัวอย่าง */
export const thaiNow = () => { const t = new Date(), p = (n: number) => String(n).padStart(2, "0"); return p(t.getDate()) + "/" + p(t.getMonth() + 1) + "/" + (t.getFullYear() + 543) + " " + p(t.getHours()) + ":" + p(t.getMinutes()) + " น."; };
