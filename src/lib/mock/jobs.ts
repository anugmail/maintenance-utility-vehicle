"use client";
import type { CheckRow } from "@/components/patterns/CheckTable";
import type { UploadFile } from "@/components/vms/FileUpload";
import type { PillColor } from "@/components/vms/PillOutline";
import { useMemo } from "react";
import { CAND, LAST_OIL, PLANS, typeOf, type Plan } from "./data";
import { setMock, useMock, type MockState, type Role } from "./store";
import { APPROVED_AT, PLAN_CARS, PLAN_ID, Q_EXTRA, TRIP_1, TRIP_CARS as CARS, TRIP_V, ackNoti, addNotis, candId, oilFailNoti, tripsOf, type Trip } from "./trips";

declare module "./store" {
  interface MockState { jobs?: { jobs: Record<string, Job> } }
}

export type JobStatus = "todo" | "doing" | "done" | "cannot" | "worked" | "reported" | "wait" | "returned";
export type VendorStatus = "worked" | "reported" | "wait" | "returned";
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
export const VENDOR_ST: readonly JobStatus[] = ["worked", "reported", "wait", "returned"];
export const isVendorSt = (st: JobStatus): st is VendorStatus => VENDOR_ST.includes(st);
export type OilTag = "wait" | "fail";
export const OIL_TAG: Record<OilTag, [string, PillColor]> = { wait: ["รอผลตรวจน้ำมัน", "Warning"], fail: ["น้ำมันไม่ผ่าน", "Error"] };
export const OIL_JOB_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน", "เก็บตัวอย่างและเปลี่ยน"] as const;
export type OilChoice = 0 | 1 | 2;
export const OIL_DEFAULT: OilChoice = 2;
export const oilSampled = (k?: number | null) => k === 0 || k === 2;
export type OilSel = -1 | 0 | 1;
export const OIL_RESULT_OPTS = ["ผ่าน", "ไม่ผ่าน"];

export const PEOPLE = {
  staff: ["นายวิชัย ทองดี", "นางสาวกนกวรรณ ใจมั่น", "นายสมชาย พูลสุข"],
  kbk: "นายวิชัย ทองดี (กบผ.)",
  ownerSigner: "นายสุรชัย แก้วมณี",
  vendor: "นายประเสริฐ ศรีสุข (ผู้รับจ้าง)",
  vendorTech: "นายประเสริฐ ศรีสุข",
};
export const JOB_TIMES = {
  self: { start: "04/11/2569 08:42 น.", end: "04/11/2569 11:15 น.", resultSaved: "11/11/2569 14:02 น." },
  hire: { start: "17/11/2569 09:10 น.", end: "17/11/2569 13:25 น.", sent: "17/11/2569 16:40 น.", sentCannot: "18/11/2569 08:50 น.", reported: "18/11/2569 08:35 น." },
};
export const SIGN_DATE = "04/11/2569";
export const SAFETY_TYPES = ["กระเช้าฮอทไลน์", "กระเช้าแก้ไฟ"];
export const SAFETY_SAVED = "12/11/2569 09:30 น.";
export const safetyOn = (c: { type: string }) => SAFETY_TYPES.includes(c.type);
export const ODOMETER = ["182,400 กม.", "6,120 ชม."] as const;
export const JOB_TEXT = {
  cannotSelf: "ยานพาหนะติดภารกิจซ่อมสายส่งฉุกเฉิน ไม่อยู่ที่จุดนัดในวันเดินทาง",
  cannotHire: "กระบอกสูบไฮดรอลิกหลักรั่ว ต้องส่งซ่อมก่อนจึงบำรุงรักษาได้",
  back: "จำนวนไส้กรองอากาศที่คืนไม่ตรงกับภาพอะไหล่ใหม่ที่เหลือ กรุณาตรวจนับและแก้จำนวนที่คืน",
  backCannot: "กรุณาระบุตำแหน่งที่รั่วและผลตรวจเบื้องต้นในสาเหตุให้ชัดเจน",
};
export const CANNOT_USED_SAMPLE = [30, 2, 0, 0];
export const OIL_FILE: UploadFile = { name: "oil-test-82-6789.pdf", size: "420 KB", bar: true };
export const BEFORE = ["รูปยานพาหนะ + ทะเบียน", "อะไหล่ใหม่"];

export interface TripCar { id: string; plate: string; model: string; owner: string; ownerPhone: string; ctrl: string; type: string; lastOil: string }
const LAST_OIL_OF: Record<string, string> = {
  "82-6789": "12/03/2568", "82-1145": "12/03/2567", "80-5738": "14/10/2565", "81-2210": "ไม่มีข้อมูล", "80-9981": "10/01/2569", "82-3302": "05/02/2567",
  "82-7720": "18/06/2567", "80-3316": "05/02/2567", "81-6604": "20/09/2569", "80-4458": "01/10/2566",
};
export const TRIP_CARS: TripCar[] = CARS.map((c) => ({ id: c.id, plate: c.plate, model: c.model, owner: c.owner, ownerPhone: c.phone, ctrl: c.ctrl, type: typeOf(c.model), lastOil: LAST_OIL_OF[c.id] ?? "12/03/2568" }));
export const PLAN_JOB_CARS: TripCar[] = PLAN_CARS.map((c) => { const i = CAND.findIndex((x) => candId(x.plate) === c.id);
  return { id: c.id, plate: c.plate, model: c.model, owner: c.owner, ownerPhone: c.phone, ctrl: c.ctrl, type: CAND[i]?.type ?? typeOf(c.model), lastOil: LAST_OIL[i] ?? "-" }; });
const Q_EXTRA_JOB_CARS: TripCar[] = Q_EXTRA.map((c) => ({ id: c.id, plate: c.plate, model: c.model, owner: c.owner, ownerPhone: c.phone, ctrl: c.ctrl, type: typeOf(c.model), lastOil: "-" }));
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

export interface JobTrip {
  id: string; planId: string; planMr: string; planName: string; quarter: string; q: number;
  name: string; mode: "self" | "hire"; vendor?: string; contract?: string;
  carIds: string[];
  locs: Record<string, string>; phones: Record<string, string>;
  names?: Record<string, string>;
  d1: string; d2: string; staff: string[]; createdBy: string; sentAt: string;
  status: "approved"; approvedAt?: string;
  works?: Record<string, [string, string]>;
}
export function toJobTrip(t: Trip, plans: Plan[]): JobTrip {
  const p = plans.find((x) => x.mr === "MR" + t.planId);
  return { id: t.id, planId: t.planId, planMr: "MR" + t.planId, planName: p?.name ?? "", quarter: "ไตรมาส " + t.quarter, q: t.quarter,
    name: t.name, mode: t.mode, vendor: t.vendor, contract: t.contract, carIds: t.carIds, locs: t.locs, phones: t.phones, names: t.names,
    d1: t.d1, d2: t.d2, staff: t.staff ?? [], createdBy: t.createdBy, sentAt: t.sentAt, status: "approved", approvedAt: t.approvedAt, works: t.works };
}
const fromJobTrip = (j: JobTrip, prev?: Trip): Trip => ({
  ...prev, id: j.id, planId: j.planId, quarter: j.q, name: j.name, mode: j.mode, vendor: j.vendor, contract: j.contract, carIds: j.carIds,
  locs: j.locs, phones: j.phones, names: j.names, works: j.works, d1: j.d1, d2: j.d2, staff: j.mode === "self" ? j.staff : prev?.staff, createdBy: j.createdBy, sentAt: j.sentAt,
  status: "approved", approvedAt: j.approvedAt ?? prev?.approvedAt ?? APPROVED_AT, returnReason: undefined, listOnly: undefined,
});
export const SEED_TRIPS: Record<"T1" | "TV", JobTrip> = {
  T1: toJobTrip({ ...TRIP_1, status: "approved", approvedAt: APPROVED_AT }, PLANS),
  TV: toJobTrip({ ...TRIP_V, status: "approved", approvedAt: APPROVED_AT }, PLANS),
};
export const tripLoc = (t: JobTrip, c: TripCar) => t.locs[c.id] || "สำนักงาน " + c.owner;
export const tripPhone = (t: JobTrip, c: TripCar) => t.phones[c.id] || c.ownerPhone;
export const phoneEdited = (t: JobTrip, c: TripCar) => !!t.phones[c.id] && t.phones[c.id] !== c.ownerPhone;
export const tripCtrl = (t: JobTrip, c: TripCar) => t.names?.[c.id] || c.ctrl || "-";
export const tripRange = (t: JobTrip) => t.d1 + " – " + t.d2;
export const tripRangeShort = (t: JobTrip) => t.d1.slice(0, 2) + "–" + t.d2;
export function tripDays(t: JobTrip) {
  const d = (s: string) => { const [dd, mm, yy] = s.split("/").map(Number); return Date.UTC(yy, mm - 1, dd); };
  return Math.max(1, Math.round((d(t.d2) - d(t.d1)) / 864e5) + 1);
}
export const tripKv = (t: JobTrip): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", t.planMr + " " + t.planName], ["ไตรมาส", t.quarter], ["รูปแบบดำเนินการ", t.vendor ? "จ้างดำเนินการ" : "ดำเนินการเอง"],
  ...(t.vendor
    ? [["ผู้รับจ้าง", t.vendor], ["เลขที่สัญญา/ใบสั่งจ้าง", t.contract || "-"], ["ช่วงวันทำงาน", tripRange(t)]] as [string, string][]
    : [["ช่วงวันเดินทาง", tripRange(t)], ["พนักงานที่เดินทาง", t.staff.join(", ")]] as [string, string][]),
  ["ผู้สร้าง", t.createdBy], ["วันที่ส่ง", t.sentAt],
];
export const ownerCostCenter = (c: TripCar) => "E301010000 " + c.owner + " - บริหาร";

export interface PlanPart { task: string; part: string; code?: string; planQty: number; unit: string; unitPrice: number }
export const WORK: PlanPart[] = [
  { task: "เปลี่ยนน้ำมันไฮดรอลิก", part: "น้ำมันไฮดรอลิก ISO VG 46", code: "OL-0011", planQty: 30, unit: "ลิตร", unitPrice: 120 },
  { task: "เปลี่ยนไส้กรองไฮดรอลิก", part: "ไส้กรองไฮดรอลิก", code: "FL-0022", planQty: 2, unit: "ชิ้น", unitPrice: 680 },
  { task: "เปลี่ยนไส้กรองน้ำมันเครื่อง", part: "ไส้กรองน้ำมันเครื่อง", code: "FL-0031", planQty: 2, unit: "ชิ้น", unitPrice: 250 },
  { task: "เปลี่ยนไส้กรองอากาศ", part: "ไส้กรองอากาศ", code: "FL-0040", planQty: 2, unit: "ชิ้น", unitPrice: 420 },
];
export const OIL_PART = WORK[0].part;

export interface Signer { name: string | null; sig: string | null; req?: string; at?: string }
export interface ReceiveForm { items: CheckRow[]; signers: [Signer, Signer]; photos: UploadFile[][] }
export interface ClosePartRow { part: string; code?: string; unit: string; unitPrice: number; planQty: number; used: number; old: number; note: string; added?: boolean }
export interface CostRow { name: string | null; perDiem: string; lodging: string; days: number | null }
export type DocSel = "มี" | "ไม่มี" | "ไม่ต้องใช้";
export interface CloseDoc { name: string; sel: DocSel | null; files: string[] }
export interface CloseForm {
  parts: ClosePartRow[]; costs: CostRow[]; travel: string; costCenter: string | null;
  km: string; hours: string;
  oilChoice: OilChoice; oilSel: OilSel; oilFiles: UploadFile[];
  signers: [Signer, Signer]; docs: CloseDoc[];
  safetyFiles?: UploadFile[];
  budgetType?: number;
  oilDate?: string;
  workHours?: string; workRate?: string;
}
export const BUDGET_CUT = ["งบทำการ หน่วยงานต้นสังกัด", "งบทำการ หน่วยงานอื่น", "งบโครงการ (ตาม WBS)", "งบซ่อมบำรุงตามใบสั่ง (PM Order)", "อื่น ๆ"];
export const OTHER_CC = "E301020000 กฟฉ.2 อุบลราชธานี - บริหาร";
export const MT_STEPS = ["ตรวจสภาพก่อนบำรุงรักษา", "สรุปงานก่อนปิดงาน"];
export interface OilResult { sel: OilSel; files: UploadFile[]; sampledAt: string; sampledBy: string; savedAt?: string; savedBy?: string }
export interface SafetyDocs { files: UploadFile[]; savedAt?: string; savedBy?: string }
export interface CannotInfo { reason: string; used: number[]; by: string; at: string; whileDoing: boolean }

export interface Job {
  tripId: string; carId: string; status: JobStatus;
  parts: PlanPart[];
  oilChoice?: OilChoice;
  receive?: ReceiveForm;
  photos?: UploadFile[];
  startedAt?: string; startedBy?: string;
  step?: 1 | 2;
  close?: CloseForm;
  closedAt?: string; recordedBy?: string; kmAfter?: string; hoursAfter?: string;
  cannot?: CannotInfo;
  oilResult?: OilResult;
  safety?: SafetyDocs;
  acceptedAt?: string;
  sentAt?: string; sentBy?: string; returnReason?: string;
  hireCost?: { wage: string; travel: string }; reviewedAt?: string; reviewedBy?: string;
}
export interface JobsState { trips: Record<string, JobTrip>; jobs: Record<string, Job> }

export const BUCKET_ITEMS = ["น้ำมันไฮดรอลิก", "กรองน้ำมันไฮดรอลิก", "แรงดันน้ำมันไฮดรอลิก MAIN 2400-2600 PSI", "ชุดเกียร์ PTO", "ปั๊มน้ำมันไฮดรอลิก", "เพลาขับปั๊มน้ำมันไฮดรอลิก",
  "ชุดกระบอกขาช้างหน้าซ้าย-ขวา", "ชุดกระบอกขาช้างหลังซ้าย-ขวา", "น้ำมันหล่อลื่นชุดเฟืองหมุนฐานเครน", "ชุดมอเตอร์และเฟืองหมุนฐานเครน", "ชุดกระบอก LOWER BOOM", "ชุดกระบอก UPPER BOOM",
  "ชุดกระบอก EXTENSION", "ชุดโรตารี่", "ระบบ EMERGENCY", "ชุด CONTROL ล่าง", "ชุด CONTROL บน", "สายน้ำมันไฮดรอลิก", "สายสัญญาณต่างๆ", "เกจวัดต่างๆ", "ชุดวาล์วล๊อคต่างๆ",
  "ชุดปรับการหมุนและปรับดิ่งใบกระเช้า", "BUCKET, LINER", "ชุดการ์ดครอบป้องกันกระแสไฟ", "รอกและเชือกวินซ์", "ชุด LIFT รุ่น 115 KV", "การอัดและเคลือบจารบีตามจุดต่างๆ", "ชุดยึดฐานเครน",
  "ท่อนบูม, สลัก, จุดยึด", "PLATE ซองบูม, SLIDE PAD ADJ."];
export const WATER_ITEMS = ["น้ำมันเครื่องยนต์", "น้ำมันเกียร์ชุดเฟืองเกียร์ทดรอบ", "น้ำมันดุมล้อ", "กรองอากาศ", "กรองน้ำมันเครื่องยนต์", "กรองน้ำมันเชื้อเพลิง", "กรองดักน้ำ",
  "สภาพเครื่องยนต์รอบเครื่อง 2400 RPM", "น้ำ, หม้อน้ำ, ท่อน้ำ, ฝาปิดหม้อน้ำ", "สภาพและความตึงของสายพานพัดลม/ไดชาร์ท", "แบตเตอรี่, ขั้วแบตเตอรี่และน้ำกลั่น",
  "รอยรั่วน้ำมันเชื้อเพลิง, น้ำมันเครื่อง, น้ำระบายความร้อน", "แรงดันน้ำ MAIN 800 PSI", "แรงดันน้ำปลายปืน 1-2 กระบอก 400 PSI", "ระบบไฟควบคุมอุปกรณ์ต่าง ๆ", "มาตรวัดต่าง ๆ",
  "ข้อต่อ, วาล์วน้ำ", "สายฉีดน้ำ", "ชุดอุปกรณ์ REEL เก็บสายฉีดน้ำ"];
export const INSPECT_OPTS = ["ปกติ", "แก้ไข"];
export const INSPECT_FIX = 17, INSPECT_NOTE = "สายน้ำมันไฮดรอลิกซึมที่ข้อต่อ เปลี่ยนแล้ว";
const WATER_TYPE = "รถพ่วงฉีดน้ำ";
const brandModel = (s: string): [string, string] => { const w = s.trim().split(" "); return [w[0] ?? "", w.slice(1).join(" ")]; };
export function inspectForm(c: Pick<TripCar, "plate" | "model" | "owner" | "type">, jobNo: string): { title: string; kv: [string, string][]; items: string[] } {
  const [car, body = ""] = c.model.split(" + "), [vb, vm] = brandModel(car);
  if (c.type === WATER_TYPE) return { title: "แบบฟอร์มการตรวจสภาพรถพ่วงฉีดน้ำ", items: WATER_ITEMS, kv: [["งานเลขที่", jobNo], ["ยี่ห้อยานพาหนะ", vb], ["รุ่นยานพาหนะ", vm], ["ทะเบียน", c.plate],
    ["รหัส", "W-2565-0218"], ["ใช้งานประจำที่", c.owner], ["SERIAL No.", "FM8JN-71245"], ["ยี่ห้อเครื่องยนต์", "Kubota"], ["รุ่นเครื่องยนต์", "V2203"], ["SERIAL No. เครื่องยนต์", "2B4471"], ["ระยะเวลาการใช้งาน (Hr)", "2,840"]] };
  const [cb, cm] = brandModel(body.replace(/^กระเช้า /, ""));
  return { title: "แบบฟอร์มการตรวจสภาพกระเช้าแก้ไฟและกระเช้าฮอทไลน์", items: BUCKET_ITEMS, kv: [["งานเลขที่", jobNo], ["ยี่ห้อกระเช้า", cb], ["รุ่นกระเช้า", cm], ["ทะเบียน", c.plate],
    ["รหัส", "B-2563-0412"], ["ใช้งานประจำที่", c.owner], ["SERIAL No.", cm + "-11873"], ["หมายเลข HC", "HC-0412"], ["ยี่ห้อยานพาหนะ", vb], ["รุ่นยานพาหนะ", vm], ["ระยะทางการใช้งานยานพาหนะ (Km)", "182,400"], ["ระยะเวลาการใช้งานเครน (Hr)", "6,120"]] };
}
export const inspectRows = (c: Pick<TripCar, "type">): CheckRow[] => (c.type === WATER_TYPE ? WATER_ITEMS : BUCKET_ITEMS).map((name) => ({ name, sel: null, note: "" }));

export const CLOSE_DOCS = ["บันทึกใบสั่งการ"];
const signer = (): Signer => ({ name: null, sig: null });
export const emptyReceive = (c: Pick<TripCar, "type">): ReceiveForm => ({ items: inspectRows(c), signers: [signer(), signer()], photos: BEFORE.map(() => []) });
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

export const filledReceive = (by: string, c: Pick<TripCar, "type">): ReceiveForm => ({
  items: inspectRows(c).map((r, i) => (i === INSPECT_FIX ? { ...r, sel: 1, note: INSPECT_NOTE } : { ...r, sel: 0 })),
  signers: [{ name: by.replace(/ \(.*\)$/, ""), sig: "sample" }, { name: PEOPLE.ownerSigner, sig: "sample" }],
  photos: BEFORE.map((b, i) => [{ name: b.replace(/\s|\+|\(|\)/g, "-") + "-" + (i + 1) + ".jpg", size: "2.4 MB", bar: true }]),
});
const CLOSE_FILLED_PARTS: Record<string, [number, number, string]> = {
  "น้ำมันไฮดรอลิก ISO VG 46": [30, 30, "น้ำมันเก่าส่งกำจัดตามระเบียบ"], "ไส้กรองไฮดรอลิก": [2, 2, ""], "ไส้กรองน้ำมันเครื่อง": [2, 2, ""], "ไส้กรองอากาศ": [1, 1, "ไส้กรองเดิมอีกลูกยังใช้ได้"],
};
export function filledClose(job: Job, trip: JobTrip, car: TripCar): CloseForm {
  const f = emptyClose(job, trip, car);
  return {
    ...f,
    parts: f.parts.map((r) => { const v = CLOSE_FILLED_PARTS[r.part]; return v ? { ...r, used: v[0], old: v[1], note: v[2] } : r; }),
    costs: [["นายวิชัย ทองดี", 2], ["นางสาวกนกวรรณ ใจมั่น", 2], ["นายสมชาย พูลสุข", 1]].map(([name, days]) => ({ name: String(name), perDiem: "240", lodging: "800", days: Number(days) })),
    travel: "1,210", km: "182,640", hours: "6,131", workHours: "6", workRate: "150",
    signers: [{ name: PEOPLE.kbk.replace(" (กบผ.)", ""), sig: "sample" }, { name: PEOPLE.ownerSigner, sig: "sample" }],
    docs: f.docs.map((d) => ({ ...d, sel: "มี" })),
  };
}

export const jobKey = (tripId: string, carId: string) => tripId + ":" + carId;
export function jobsOf(m: MockState): JobsState {
  const trips = Object.fromEntries(tripsOf(m).filter((t) => t.status === "approved" && !t.listOnly).map((t) => [t.id, toJobTrip(t, m.plans)]));
  const jobs = Object.fromEntries(Object.entries(m.jobs?.jobs ?? {}).flatMap(([k, j]) => { const n = normJob(j); return n ? [[k, n]] : []; }));
  return { trips, jobs };
}
function normJob(j: unknown): Job | null {
  if (!j || typeof j !== "object") return null;
  const x = j as Job;
  const ok = (Object.keys(WSTAT) as string[]).includes(x.status);
  if (ok && Array.isArray(x.parts)) return x;
  const status: JobStatus = ok ? x.status : x.cannot ? "cannot" : x.closedAt && x.close ? "done" : x.startedAt ? "doing" : "todo";
  return { ...x, status, parts: Array.isArray(x.parts) ? x.parts : WORK.map((p) => ({ ...p })) };
}
export function useJobs(): JobsState { const m = useMock(); return useMemo(() => jobsOf(m), [m]); }
export const getTrip = (s: JobsState, id: string | null | undefined): JobTrip | undefined => (id ? s.trips[id] : undefined);
export const getJob = (s: JobsState, tripId: string, carId: string): Job => s.jobs[jobKey(tripId, carId)] ?? newJob(tripId, carId);
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
export const applyJobs = (fn: (s: JobsState) => JobsState, base?: Trip[]) => write(fn, base);
export function patchJob(tripId: string, carId: string, fn: (j: Job) => Job) {
  write((s) => ({ ...s, jobs: { ...s.jobs, [jobKey(tripId, carId)]: fn(getJob(s, tripId, carId)) } }));
}
export function patchTrip(tripId: string, fn: (t: JobTrip) => JobTrip) {
  write((s) => (s.trips[tripId] ? { ...s, trips: { ...s.trips, [tripId]: fn(s.trips[tripId]) } } : s));
}

export function oilTag(j: Job): OilTag | undefined {
  if (j.status !== "done" || !oilSampled(j.oilChoice)) return undefined;
  const r = j.oilResult;
  return !r || r.sel < 0 ? "wait" : r.sel === 1 ? "fail" : undefined;
}
const PROG_ST: [JobStatus, string][] = [["doing", ""], ["worked", ""], ["wait", ""], ["returned", ""], ["reported", " (ไม่นับรวม)"], ["cannot", " (ไม่นับรวม)"]];
export function tripCount(s: JobsState, t: JobTrip, vendor = false) {
  const st = t.carIds.map((c) => getJob(s, t.id, c).status);
  const n = (k: JobStatus) => st.filter((x) => x === k).length;
  const sum = (ks: JobStatus[]) => ks.reduce((a, k) => a + n(k), 0);
  const done = sum(vendor ? ["worked", "wait", "done"] : ["done"]), out = sum(vendor ? ["reported", "cannot"] : ["cannot"]);
  return { done, doing: n("doing"), cannot: n("cannot"), total: t.carIds.length - out, n };
}
export const tripCounter = (s: JobsState, t: JobTrip, vendor = false) => { const c = tripCount(s, t, vendor); return "ตรวจแล้ว " + c.done + "/" + c.total; };
export function tripProgress(s: JobsState, t: JobTrip, vendor = false) {
  const c = tripCount(s, t, vendor);
  return (vendor ? "ตรวจแล้ว " : "เสร็จสิ้น ") + c.done + " จาก " + c.total + " คัน" + PROG_ST.map(([k, x]) => (c.n(k) ? " · " + WSTAT[k][0] + " " + c.n(k) + x : "")).join("");
}
export const menuCount = (st: JobStatus) => (st === "todo" ? 3 : st === "doing" ? 2 : 1);
export const retRows = (parts: Pick<PlanPart, "part" | "planQty" | "unit">[], used?: number[] | null): string[][] =>
  parts.map((p, k) => { const u = used ? used[k] ?? 0 : 0; return [p.part, p.planQty + " " + p.unit, u + " " + p.unit, Math.max(0, p.planQty - u) + " " + p.unit]; });
export const nf = (n: number) => n.toLocaleString("en-US");
export const num = (s: string | number | null | undefined) => { const v = Number(String(s ?? "").replace(/[^\d.]/g, "")); return Number.isFinite(v) ? v : 0; };
export const personSum = (r: CostRow) => (num(r.perDiem) + num(r.lodging)) * (r.days ?? 0);
export function costSummary(f: CloseForm) {
  const pd = f.costs.reduce((a, r) => a + num(r.perDiem) * (r.days ?? 0), 0);
  const lg = f.costs.reduce((a, r) => a + num(r.lodging) * (r.days ?? 0), 0);
  const tr = num(f.travel);
  const lb = num(f.workHours) * num(f.workRate);
  return { perDiem: pd, lodging: lg, travel: tr, labour: lb, total: pd + lg + tr + lb };
}
export const closeRows = (f: CloseForm) => f.parts.filter((r) => !(f.oilChoice === 0 && r.part === OIL_PART));
export const staffOf = (t: JobTrip) => (t.staff.length ? t.staff : PEOPLE.staff);

export interface WorkItem { task: string; part: string; planQty: number; usedQty: number; unit: string; k: number }
export interface NewPart { name: string; code: string; qty: string; unit: string }
export function workItems(j: Job): WorkItem[] {
  if (j.cannot) { const used = j.cannot.used; return j.parts.map((p, k) => ({ task: p.task, part: p.part, planQty: p.planQty, usedQty: used[k] ?? 0, unit: p.unit, k })); }
  if (j.close) return j.close.parts.map((r, k) => ({ task: j.parts.find((p) => p.part === r.part)?.task ?? "-", part: r.part, planQty: r.planQty, usedQty: r.used, unit: r.unit, k }));
  return j.parts.map((p, k) => ({ task: p.task, part: p.part, planQty: p.planQty, usedQty: p.planQty, unit: p.unit, k }));
}
export function workShown(j: Job, rows = workItems(j)) {
  const oil = j.close ? j.close.oilChoice : j.oilChoice;
  return rows.filter((r) => !(oil === 0 && r.part === OIL_PART));
}
const withClose = (j: Job, t: JobTrip, c: TripCar, fn: (ps: ClosePartRow[]) => ClosePartRow[]): Job => {
  const f = j.close ?? emptyClose(j, t, c);
  return { ...j, close: { ...f, parts: fn(f.parts) } };
};
export function editPartUsed(t: JobTrip, c: TripCar, k: number, used: number) {
  patchJob(t.id, c.id, (j) => (j.cannot
    ? { ...j, cannot: { ...j.cannot, used: j.parts.map((_, i) => (i === k ? used : j.cannot!.used[i] ?? 0)) } }
    : withClose(j, t, c, (ps) => ps.map((r, i) => (i === k ? { ...r, used } : r)))));
}
export function addJobPart(t: JobTrip, c: TripCar, p: NewPart) {
  const part = p.name.trim(), code = p.code.trim() || undefined, qty = Number(p.qty);
  patchJob(t.id, c.id, (j) => (j.cannot
    ? { ...j, parts: [...j.parts, { task: "-", part, code, planQty: 0, unit: p.unit, unitPrice: 0 }], cannot: { ...j.cannot, used: [...j.parts.map((_, i) => j.cannot!.used[i] ?? 0), qty] } }
    : withClose(j, t, c, (ps) => [...ps, { part, code, unit: p.unit, unitPrice: 0, planQty: 0, used: qty, old: 0, note: "", added: true }])));
}
export function deleteJobPart(t: JobTrip, c: TripCar, k: number) {
  patchJob(t.id, c.id, (j) => {
    if (j.cannot) return { ...j, parts: j.parts.filter((_, i) => i !== k), cannot: { ...j.cannot, used: j.cannot.used.filter((_, i) => i !== k) } };
    const f = j.close ?? emptyClose(j, t, c), row = f.parts[k];
    return { ...j, parts: row && !row.added ? j.parts.filter((p) => p.part !== row.part) : j.parts, close: { ...f, parts: f.parts.filter((_, i) => i !== k) } };
  });
}

const timesOf = (t: JobTrip) => (t.mode === "hire" ? JOB_TIMES.hire : JOB_TIMES.self);
export function startJob(t: JobTrip, carId: string, planned?: OilChoice, vendor = false, at?: string) {
  patchJob(t.id, carId, (j) => ({
    ...j, status: "doing", step: 1, startedAt: at ?? timesOf(t).start, startedBy: vendor ? PEOPLE.vendor : PEOPLE.kbk,
    oilChoice: j.oilChoice ?? planned ?? OIL_DEFAULT, photos: (j.receive?.photos ?? []).flat(), cannot: undefined,
  }));
}
export const stepOf = (j: Job): 1 | 2 => j.step ?? (j.receive?.signers.every((s) => !!s.sig) ? 2 : 1);
export function confirmInspect(t: JobTrip, carId: string) {
  patchJob(t.id, carId, (j) => ({ ...j, step: 2, photos: (j.receive?.photos ?? []).flat() }));
}
export function closeJob(t: JobTrip, carId: string, f: CloseForm, vendor = false, closeAt?: string) {
  const at = closeAt ?? timesOf(t).end, by = vendor ? PEOPLE.vendor : PEOPLE.kbk;
  patchJob(t.id, carId, (j) => ({
    ...j, status: vendor ? "worked" : "done", close: f, closedAt: at, recordedBy: by, cannot: undefined, returnReason: undefined,
    kmAfter: f.km + " กม.", hoursAfter: f.hours + " ชม.", oilChoice: f.oilChoice,
    oilResult: oilSampled(f.oilChoice) ? { sel: f.oilSel, files: f.oilFiles, sampledAt: at.slice(0, 10), sampledBy: by, ...(f.oilSel >= 0 ? { savedAt: at, savedBy: by } : {}) } : undefined,
    safety: { files: f.safetyFiles ?? [] },
  }));
  const c = carOf(carId);
  if (!vendor && c) addNotis([ackNoti(t, c)]);
  if (!vendor && c && oilSampled(f.oilChoice) && f.oilSel === 1) addNotis([oilFailNoti(t, c)]);
}
export function cannotJob(t: JobTrip, carId: string, reason: string, used: number[], at: string, vendor = false) {
  patchJob(t.id, carId, (j) => ({ ...j, status: vendor ? "reported" : "cannot", returnReason: undefined,
    cannot: { reason, used, by: vendor ? PEOPLE.vendor : PEOPLE.kbk, at: vendor ? JOB_TIMES.hire.reported : at, whileDoing: j.status === "doing" } }));
}
export function editCannotReason(t: JobTrip, carId: string, reason: string) {
  patchJob(t.id, carId, (j) => (j.cannot ? { ...j, cannot: { ...j.cannot, reason } } : j));
}
export function setStartedAt(t: JobTrip, carId: string, at: string) { patchJob(t.id, carId, (j) => ({ ...j, startedAt: at })); }
export function acceptVendorJob(t: JobTrip, carId: string, cost: { wage: string; travel: string }) {
  let done = false;
  patchJob(t.id, carId, (j) => { done = !j.cannot; return { ...j, status: j.cannot ? "cannot" : "done", hireCost: cost, reviewedAt: thaiNow(), reviewedBy: PEOPLE.kbk, returnReason: undefined }; });
  const c = carOf(carId);
  if (done && c) addNotis([ackNoti(t, c)]);
}
export function returnVendorJob(t: JobTrip, carId: string, reason: string) {
  patchJob(t.id, carId, (j) => ({ ...j, status: "returned", returnReason: reason }));
}
export type SignForm = "receive" | "close";
const formOf = (j: Job, k: SignForm, t: JobTrip, car: TripCar) => (k === "receive" ? j.receive ?? emptyReceive(car) : j.close ?? emptyClose(j, t, car));
export function requestSign(t: JobTrip, car: TripCar, k: SignForm, i: number) {
  patchJob(t.id, car.id, (j) => { const f = formOf(j, k, t, car); const signers = f.signers.map((x, n) => (n === i ? { ...x, sig: null, at: undefined, req: thaiNow() } : x)) as [Signer, Signer];
    return { ...j, [k]: { ...f, signers } }; });
}
export function confirmSign(tripId: string, carId: string, k: SignForm, i: number) {
  const car = carOf(carId);
  write((s) => {
    const t = s.trips[tripId]; const j = getJob(s, tripId, carId);
    if (!t || !car) return s;
    const f = formOf(j, k, t, car); const signers = f.signers.map((x, n) => (n === i ? { ...x, sig: "confirm", at: thaiNow() } : x)) as [Signer, Signer];
    return { ...s, jobs: { ...s.jobs, [jobKey(tripId, carId)]: { ...j, [k]: { ...f, signers } } } };
  });
}
export interface PendingSign { tripId: string; carId: string; plate: string; k: SignForm; i: number; name: string; req: string; title: string }
export function pendingSigns(m: MockState): PendingSign[] {
  const s = jobsOf(m);
  return Object.values(s.jobs).flatMap((j) => (["receive", "close"] as SignForm[]).flatMap((k) => {
    const f = j[k]; const c = carOf(j.carId);
    if (!f || !c || !s.trips[j.tripId]) return [];
    return f.signers.flatMap((x, i) => (x.req && !x.sig && x.name ? [{ tripId: j.tripId, carId: j.carId, plate: c.plate, k, i, name: x.name, req: x.req,
      title: k === "receive" ? "ลงนามการตรวจสภาพอะไหล่" : "ลงนามการส่งคืนยานพาหนะ" }] : []));
  }));
}
export function sendJob(t: JobTrip, carId: string) {
  patchJob(t.id, carId, (j) => ({ ...j, status: "wait", sentAt: j.cannot ? JOB_TIMES.hire.sentCannot : JOB_TIMES.hire.sent, sentBy: PEOPLE.vendor, returnReason: undefined }));
}
export function saveOilResult(t: JobTrip, carId: string, sel: OilSel, files: UploadFile[], by = PEOPLE.kbk) {
  patchJob(t.id, carId, (j) => ({ ...j, oilResult: { sampledAt: j.closedAt?.slice(0, 10) ?? "", sampledBy: j.recordedBy ?? by, ...j.oilResult, sel, files, savedAt: JOB_TIMES.self.resultSaved, savedBy: by } }));
  const c = carOf(carId);
  if (sel === 1 && c) addNotis([oilFailNoti(t, c)]);
}
export function saveSafetyDocs(t: JobTrip, carId: string, files: UploadFile[], by = PEOPLE.kbk) {
  patchJob(t.id, carId, (j) => ({ ...j, safety: { files, savedAt: SAFETY_SAVED, savedBy: by } }));
}
export function editTripCar(t: JobTrip, c: TripCar, name: string, phone: string, loc: string, work?: [string, string] | null) {
  patchTrip(t.id, (x) => {
    const names = { ...(x.names ?? {}) }, phones = { ...x.phones }, locs = { ...x.locs }, works = { ...(x.works ?? {}) };
    if (name.trim() && name.trim() !== c.ctrl) names[c.id] = name.trim(); else delete names[c.id];
    if (phone.trim() && phone.trim() !== c.ownerPhone) phones[c.id] = phone.trim(); else delete phones[c.id];
    if (loc.trim() && loc.trim() !== "สำนักงาน " + c.owner) locs[c.id] = loc.trim(); else delete locs[c.id];
    if (work && !(work[0] === x.d1 && work[1] === x.d2)) works[c.id] = work; else if (work !== undefined) delete works[c.id];
    return { ...x, names, phones, locs, works };
  });
}
export function removeTripCar(t: JobTrip, carId: string) {
  write((s) => { const jobs = { ...s.jobs }; delete jobs[jobKey(t.id, carId)];
    return { ...s, jobs, trips: { ...s.trips, [t.id]: { ...s.trips[t.id], carIds: s.trips[t.id].carIds.filter((c) => c !== carId) } } }; });
}

export const SAMPLES = ["T1_start", "T1_afterClose", "T1_afterCannot", "TV_start", "TV_mid", "T1_water", "T1_waterSigned",
  "TV_vendor", "TV_vendorWait", "TV_vendorReported", "TV_vendorReturned", "TV_vendorReturnedCannot", "TV_vendorMid", "T1_cost"] as const;
export type SampleName = (typeof SAMPLES)[number];
const U1: Role = "หน่วยงาน (กบผ.)", VD: Role = "ผู้รับจ้าง";
export const SAMPLE_ROLE: Record<SampleName, Role> = { T1_start: U1, T1_afterClose: U1, T1_afterCannot: U1, TV_start: U1, TV_mid: U1, T1_water: U1, T1_waterSigned: U1,
  TV_vendor: VD, TV_vendorWait: VD, TV_vendorReported: VD, TV_vendorReturned: VD, TV_vendorReturnedCannot: VD, TV_vendorMid: VD, T1_cost: U1 };
export const WATER_CAR = "82-9012";
const WATER_Q = PLAN_ID + "-1";
function doing(t: JobTrip, carId: string): Job {
  const r = filledReceive(PEOPLE.kbk, carOf(carId) ?? { type: "" });
  return { ...newJob(t.id, carId), status: "doing", step: 2, oilChoice: SAMPLE_OIL(carId), receive: r, photos: r.photos.flat(), startedAt: timesOf(t).start, startedBy: PEOPLE.kbk };
}
export function closedSample(t: JobTrip, carId: string): Job {
  const car = carOf(carId)!, d = doing(t, carId), f = filledClose(d, t, car), at = timesOf(t).end, hire = t.mode === "hire";
  return { ...d, status: "done", close: f, closedAt: at, recordedBy: PEOPLE.kbk, kmAfter: (hire ? "176,090" : f.km) + " กม.", hoursAfter: (hire ? "5,846" : f.hours) + " ชม.",
    oilResult: { sel: -1, files: [], sampledAt: at.slice(0, 10), sampledBy: PEOPLE.kbk } };
}
function cannotSample(t: JobTrip, carId: string): Job {
  return { ...newJob(t.id, carId), status: "cannot", cannot: { reason: JOB_TEXT.cannotSelf, used: WORK.map(() => 0), by: PEOPLE.kbk, at: JOB_TIMES.self.start, whileDoing: false } };
}
const changedOnly = (j: Job): Job => ({ ...j, oilChoice: 1, close: j.close && { ...j.close, oilChoice: 1 }, oilResult: undefined });
const vendorSigned = <T extends { signers: [Signer, Signer] }>(f: T): T => ({ ...f, signers: [{ name: PEOPLE.vendorTech, sig: "sample" }, f.signers[1]] });
function vDoing(t: JobTrip, carId: string): Job {
  const d = doing(t, carId);
  return { ...d, receive: d.receive && vendorSigned(d.receive), startedBy: PEOPLE.vendor };
}
function vWorked(t: JobTrip, carId: string): Job {
  const d = vDoing(t, carId), f = vendorSigned(filledClose(d, t, carOf(carId)!));
  return { ...d, status: "worked", close: f, closedAt: JOB_TIMES.hire.end, recordedBy: PEOPLE.vendor, kmAfter: "176,090 กม.", hoursAfter: "5,846 ชม.", oilChoice: f.oilChoice };
}
const vReported = (t: JobTrip, carId: string): Job => ({ ...newJob(t.id, carId), status: "reported",
  cannot: { reason: JOB_TEXT.cannotHire, used: WORK.map(() => 0), by: PEOPLE.vendor, at: JOB_TIMES.hire.reported, whileDoing: false } });
const vSent = (j: Job): Job => ({ ...j, status: "wait", sentAt: j.cannot ? JOB_TIMES.hire.sentCannot : JOB_TIMES.hire.sent, sentBy: PEOPLE.vendor });
const vBack = (j: Job): Job => ({ ...j, status: "returned", returnReason: j.cannot ? JOB_TEXT.backCannot : JOB_TEXT.back });
function step1(t: JobTrip, carId: string, filled: boolean): Job {
  const c = carOf(carId) ?? { type: "" }, r = filled ? filledReceive(PEOPLE.kbk, c) : emptyReceive(c);
  return { ...newJob(t.id, carId), status: "doing", step: 1, oilChoice: SAMPLE_OIL(carId), receive: r, startedAt: timesOf(t).start, startedBy: PEOPLE.kbk };
}
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
  const T1 = SEED_TRIPS.T1, TV = SEED_TRIPS.TV, V = TV.carIds;
  const T1W: JobTrip = { ...T1, carIds: [...T1.carIds, WATER_CAR], phones: { ...T1.phones, [WATER_CAR]: TRIP_CARS[0].ownerPhone }, names: { ...T1.names, [WATER_CAR]: TRIP_CARS[0].ctrl } };
  if (name.startsWith("T1_")) waterInQuarter(name.startsWith("T1_water"));
  const put = (list: Job[]) => Object.fromEntries(list.map((j) => [jobKey(j.tripId, j.carId), j]));
  write((s) => {
    const keep = (tid: string) => Object.fromEntries(Object.entries(s.jobs).filter(([k]) => !k.startsWith(tid + ":")));
    switch (name) {
      case "T1_start": return { trips: { ...s.trips, T1 }, jobs: keep("T1") };
      case "T1_afterClose": return { trips: { ...s.trips, T1 }, jobs: { ...keep("T1"), ...put([closedSample(T1, "82-6789"), doing(T1, "82-1145"), cannotSample(T1, "80-9981")]) } };
      case "T1_cost": {
        const c1 = closedSample(T1, "82-6789"), c2 = closedSample(T1, "82-1145"), c3 = closedSample(T1, "82-3302");
        const x = cannotSample(T1, "80-9981");
        return { trips: { ...s.trips, T1 }, jobs: { ...keep("T1"), ...put([
          c1,
          { ...c2, closedAt: "05/11/2569 10:40 น.", close: c2.close && { ...c2.close, workHours: "5" } },
          { ...c3, closedAt: "06/11/2569 15:20 น.", close: c3.close && { ...c3.close, workHours: "", workRate: "", budgetType: 1, costCenter: OTHER_CC } },
          { ...x, cannot: x.cannot && { ...x.cannot, used: WORK.map((_, k) => (k === 1 || k === 3 ? 1 : 0)) } },
        ]) } };
      }
      case "T1_afterCannot": return { trips: { ...s.trips, T1 }, jobs: { ...keep("T1"), ...put([cannotSample(T1, "80-9981")]) } };
      case "TV_start": return { trips: { ...s.trips, TV }, jobs: keep("TV") };
      case "TV_mid": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([doing(TV, TV.carIds[0]), changedOnly(closedSample(TV, TV.carIds[1]))]) } };
      case "TV_vendor": return { trips: { ...s.trips, TV }, jobs: keep("TV") };
      case "TV_vendorWait": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([vSent(vWorked(TV, V[0]))]) } };
      case "TV_vendorReported": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([vReported(TV, V[1])]) } };
      case "TV_vendorReturned": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([vBack(vWorked(TV, V[0]))]) } };
      case "TV_vendorReturnedCannot": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([vBack(vReported(TV, V[1]))]) } };
      case "TV_vendorMid": return { trips: { ...s.trips, TV }, jobs: { ...keep("TV"), ...put([vBack(vWorked(TV, V[0])), vSent(vReported(TV, V[1])), vWorked(TV, V[2]), vDoing(TV, V[3])]) } };
      case "T1_water": return { trips: { ...s.trips, T1: T1W }, jobs: { ...keep("T1"), ...put([step1(T1W, WATER_CAR, false)]) } };
      case "T1_waterSigned": return { trips: { ...s.trips, T1: T1W }, jobs: { ...keep("T1"), ...put([step1(T1W, WATER_CAR, true)]) } };
    }
  });
}
export const thaiNow = () => { const t = new Date(), p = (n: number) => String(n).padStart(2, "0"); return p(t.getDate()) + "/" + p(t.getMonth() + 1) + "/" + (t.getFullYear() + 543) + " " + p(t.getHours()) + ":" + p(t.getMinutes()) + " น."; };
