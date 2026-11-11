"use client";
/* S26 Safety Inspection — รายการยานพาหนะที่ต้องตรวจ Safety Inspection + ผลล่าสุด + ครบกำหนดครั้งถัดไป (เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 67)
   _"อยากทำหน้าลิสต์รถ เป็นอีก scen นึง โดยท้ายเป็นลิสต์คอลัมน์มีให้อัปโหลดเอกสาร inspection safety โดยกดเข้าไปเจอหน้าอัปโหลดเอกสาร
   หน้าอัปโหลดเอกสาร จะแสดงไฟล์อัปโหลด และเลือกได้ว่า ผ่าน ไม่ผ่าน (ตัวเลือกที่ 3 รอบแรก) ลองสร้าง scen นี้ใน prototype ให้หน่อย เป็น scen ชื่อว่า safety inspection"_
   + รอบ 4 popup บนหน้ารายการ ผล 4 ตัวเลือก (ผ่าน ไม่ผ่าน ระงับ ให้แก้ไข) · ชื่อบนจอ "การตรวจ ปจ.2"
   + รอบ 2 _"safety inspection มี 2 หน้า คือหน้า list และหน้ารายละเอียด หน้ารายละเอียดเพิ่มผลโดยการอัปโหลด และเลือกได้ว่า ผ่าน ไม่ผ่าน ยกเลิก"_ + รอบ 3 _"safety แก้สถานะ ผ่าน ไม่ผ่าน ระงับ ให้แก้ไข"_
   ยานพาหนะ = รหัสยานพาหนะ (รหัสรถ vms_mas_vehicle_department.vehicle_pea_id เช่น "น.3-09-1650") ส่วนกลางเป็น "09" (เจ้าของงาน 11 พ.ย. 2569 "รถ type 09 ที่จะมาแสดงที่หน้า list")
     ส่วนกลาง = รหัสประเภทของ vms_ref_pea_official_vehicle_type (ชื่อประเภทยังไม่มีในเครื่อง ⇒ ไม่ตั้งชื่อเอง)
     ข้อมูลจำลอง (สมมติ · รอเทียบตารางอ้างอิงจริง — BACKLOG ค.): กระเช้าฮอทไลน์ กระเช้าแก้ไฟ (SAFETY_TYPES) = 09 · รถพ่วงฉีดน้ำ = 06 (ไม่ขึ้นในรายการ)
       ส่วนหน้า = เขตของสังกัดตัด "กฟ" (กฟน.3 → น.3 · กกฟ.1 → ก.1 ซ้ำกับ กฟก.1 — สมมติ) · ส่วนท้าย = เลข 4 หลักของทะเบียน
   ครั้งล่าสุด (วันใหม่สุดของ):
     ยานพาหนะที่อยู่ในแดชบอร์ด S24 = safetyAt ของ maCar (เอกสารตอนปิดงาน S10 · ค่าตั้งต้น MA_ROWS · ผลที่บันทึกจากหน้านี้) ⇒ วันเดียวกับแท็บตารางบำรุงรักษาของ S24
     คันอื่น = ค่าตั้งต้นตามลำดับใน CAND (ค่าสมมติ แบบ vehicleHistory.ts) + ผลที่บันทึกจากหน้านี้
   ผลล่าสุด: ครั้งที่บันทึกจากหน้านี้ = ผลที่เลือก · ค่าตั้งต้น = ตามลำดับ (ส่วนใหญ่ผ่าน) · S24 MA_ROWS = ผ่าน (ค่าสมมติ) · เอกสารจากงานบำรุงรักษา S10 (ไม่มีช่องผล) = ยังไม่มีข้อมูล
   ครบกำหนดครั้งถัดไป = ครั้งล่าสุด + วาระการตรวจของครั้งนั้น 3/6/12 เดือน (ข้อ 67จ · เดิม +12 เดือน) · นับถอยหลังจากวันนี้ของต้นแบบ MA_TODAY
     เลยกำหนด = over · เหลือไม่เกิน 30 วัน = near (NEAR_DAYS) · S24 แถวการตรวจ ปจ.2 ใช้วาระเดียวกัน (maCar safetyUp) */
import { useMemo } from "react";
import { CAND, type Car } from "./data";
import { jobsOf, safetyOn } from "./jobs";
import type { UploadFile } from "@/components/vms/FileUpload";
import { MA_DUE, TODAY, addMonths, baseSafetyOf, dayOf, maCars, thaiDate, type DueStatus, type DueTone } from "./maintenance";
import { latestUpload, safetyUploads, type SafetyCycle, type SafetyRec, type SafetyResult } from "./safetyStore";
import { useMock, type MockState } from "./store";
import { OWN_UNIT } from "./trips";

export const SAFETY_TITLE = "การตรวจ ปจ.2";   // ชื่อบนจอของ Safety Inspection (เจ้าของงาน 11 พ.ย. 2569)
export const SAFETY_HREF = "/safety/";
/** เปิด popup ผลการตรวจ ปจ.2 ของคันนั้นบนหน้ารายการ (รอบ 4 · ที่อยู่เดิม /safety/detail/ /safety/upload/ พามาที่นี่) */
export const popupHref = (carId: string) => "/safety/?car=" + carId;
const idOf = (plate: string) => plate.split(" ")[0];
/** รหัสประเภทที่ต้องตรวจ Safety Inspection */
export const SAFETY_TYPE_CODE = "09";
/** รหัสประเภทของยานพาหนะจำลอง (สมมติ) */
export const peaTypeOf = (c: Car) => (safetyOn(c) ? SAFETY_TYPE_CODE : "06");
/** รหัสยานพาหนะจำลอง รูปแบบ vehicle_pea_id "น.2-09-0504" */
export const peaIdOf = (c: Car) => c.owner.split(" ")[0].replace("กฟ", "") + "-" + peaTypeOf(c) + "-" + (idOf(c.plate).split("-")[1] ?? "0000").padStart(4, "0");

/* ค่าตั้งต้นตามลำดับใน CAND (ก่อนวันนี้ของต้นแบบ 10/11/2569) · ทุก 7 คันยังไม่มีข้อมูล · ทุก 11 คันไม่ผ่าน · ทุก 23 คันระงับ */
const pad = (n: number) => String(n).padStart(2, "0");
const seedDate = (i: number) => { const y = 2567 + (i % 3), m = 1 + ((i * 5) % 12); return pad(1 + ((i * 7) % 28)) + "/" + pad(y === 2569 && m > 10 ? m - 6 : m) + "/" + y; };
/* วาระตั้งต้น (ข้อ 67จ · สมมติ) ตามลำดับ: ทุก 5 คัน 3 เดือน · ทุก 5 คัน (เลื่อน 1) 6 เดือน · ที่เหลือ 12 เดือน · วันตรวจของคันวาระสั้นเลื่อนมาใกล้วันนี้ให้นับถอยหลังเห็นทั้งเหลือและเลยกำหนด */
const CYCLE_OF = (i: number): SafetyCycle => (i % 5 === 0 ? 3 : i % 5 === 1 ? 6 : 12);
const shortDate = (i: number, cycle: number) => { const back = cycle === 3 ? 1 + (i % 4) : 2 + (i % 7); const t = addMonths(TODAY, -back) - ((i * 3) % 27) * 86400000; return thaiDate(t); };
const seedOf = (i: number): { date: string; result: SafetyResult; cycle: SafetyCycle } | undefined => {
  if (i % 7 === 3) return undefined;
  const cycle = CYCLE_OF(i);
  return { date: cycle === 12 ? seedDate(i) : shortDate(i, cycle), result: i % 23 === 7 ? 2 : i % 11 === 5 ? 1 : i % 29 === 9 ? 3 : 0, cycle };
};
/** วันที่เหลือถึงครบกำหนด (ติดลบ = เลยกำหนด) · วันนี้ของต้นแบบ MA_TODAY */
export const daysLeft = (due: number) => Math.round((due - TODAY) / 86400000);
/** สถานะนับถอยหลัง: เลยกำหนด = over · เหลือไม่เกิน 30 วัน = near (เสนอ · วาระสั้น 3 เดือนใช้เกณฑ์ใกล้ครบ 6 เดือนของ S24 ไม่ได้ — BACKLOG ค.) */
export const NEAR_DAYS = 30;
const safetyStatus = (due: number): DueStatus | undefined => { const d = daysLeft(due); return d < 0 ? "over" : d <= NEAR_DAYS ? "near" : undefined; };

export interface SafetyCar {
  car: Car; id: string; peaId: string;
  /** ครั้งล่าสุด · ผล (ไม่มี = ยังไม่มีข้อมูล) · ครบกำหนดครั้งถัดไป */
  last?: string; result?: SafetyResult; due?: number; status?: DueStatus;
  /** วาระการตรวจของครั้งล่าสุด (เดือน · ไม่มีข้อมูล = ไม่มี) */
  cycle?: SafetyCycle;
  /** ทุกครั้งที่บันทึกจากหน้ารายละเอียด (เก่าก่อน) */
  uploads: SafetyRec[];
  /** ครั้งล่าสุดก่อนบันทึกในต้นแบบ (ค่าตั้งต้น · S24 MA_ROWS · เอกสารตอนปิดงาน S10) = แถวแรกของประวัติ */
  base?: { date: string; result?: SafetyResult; cycle?: SafetyCycle; fromJob?: boolean; files?: UploadFile[] };
}

export function safetyCars(m: MockState, owner = false): SafetyCar[] {
  const s24 = new Map(maCars(m).map((c) => [c.car.id, c]));
  /* เอกสาร Safety Inspection ที่แนบตอนปิดงาน S10 (หน้างานรายคัน · ดาวน์โหลดได้ที่หน้ารายละเอียด ข้อ 67ข) คีย์ ทะเบียน|วันปิดงาน */
  const jobFiles = new Map(Object.values(jobsOf(m).jobs).filter((j) => j.closedAt).map((j) => [j.carId + "|" + j.closedAt!.slice(0, 10), j.safety?.files ?? j.close?.safetyFiles ?? []]));
  return CAND.flatMap((car, i): SafetyCar[] => {
    if (peaTypeOf(car) !== SAFETY_TYPE_CODE || (owner && car.owner !== OWN_UNIT)) return [];
    const id = idOf(car.plate), up = latestUpload(m, id), ma = s24.get(id);
    let base: SafetyCar["base"];
    if (ma) {
      /* ไม่นับผลที่บันทึกจากหน้ารายละเอียด (safetyAt ของ maCar รวมไว้แล้ว) ⇒ base = เอกสารตอนปิดงาน S10 หรือค่าตั้งต้น MA_ROWS ที่ใหม่กว่า */
      const rec = ma.records.filter((r) => r.safety).sort((x, y) => dayOf(y.date) - dayOf(x.date))[0], b0 = baseSafetyOf(id);
      const d = rec && (!b0 || dayOf(rec.date) >= dayOf(b0)) ? rec.date : b0;
      const job = !!rec?.fromJob && rec.date === d;
      base = d ? { date: d, result: job ? undefined : 0, cycle: 12, fromJob: job, files: job ? jobFiles.get(id + "|" + d) : undefined } : undefined;
    } else { const sd = seedOf(i); base = sd && { date: sd.date, result: sd.result, cycle: sd.cycle }; }
    let last = base?.date, result = base?.result, cycle = base?.cycle;
    if (up && (!last || dayOf(up.date) >= dayOf(last))) { last = up.date; result = up.result; cycle = up.cycle ?? 12; }
    /* ครบกำหนดครั้งถัดไป = วันตรวจล่าสุด + วาระ (ข้อ 67จ · เดิม +12 เดือนทุกคัน) */
    const due = last ? addMonths(dayOf(last), cycle ?? 12) : undefined;
    return [{ car, id, peaId: peaIdOf(car), base, last, result, cycle: last ? cycle ?? 12 : undefined, due, status: due == null ? undefined : safetyStatus(due), uploads: safetyUploads(m, id) }];
  }).sort((a, b) => (a.due ?? Infinity) - (b.due ?? Infinity) || a.car.plate.localeCompare(b.car.plate));   // เรียงวันที่เหลือน้อยสุดก่อน (เลยกำหนดมากสุดบนสุด) · ไม่มีข้อมูลท้าย
}
export function useSafetyCars(owner: boolean) { const m = useMock(); return useMemo(() => safetyCars(m, owner), [m, owner]); }

/* ช่องตาราง */
/** นับถอยหลัง (เจ้าของงาน "เอาไปแสดงนับถอยหลังให้ในหน้า list") — "เหลือ n วัน" · "ครบกำหนดวันนี้" · "เลยกำหนด n วัน" */
export const countdown = (due: number) => { const d = daysLeft(due); return d > 0 ? "เหลือ " + d + " วัน" : d === 0 ? "ครบกำหนดวันนี้" : "เลยกำหนด " + -d + " วัน"; };
/** ครบกำหนดครั้งถัดไป: วันที่ + บรรทัดรองนับถอยหลัง (เลยกำหนด error-600 · เหลือไม่เกิน 30 วัน warning-600 · อื่นๆ gray-600 ตาม toneText ของ S24) */
export const dueCell = (c: SafetyCar): { text: string; sub?: string; tone?: DueTone } | string =>
  c.due == null ? "-" : { text: thaiDate(c.due), sub: countdown(c.due), tone: c.status ? MA_DUE[c.status][1] : undefined };
/** ตัวกรอง ครบกำหนดภายใน (ชุดเดียวกับ S24 MA_WITHIN_OPTS) */
export function safetyDueMatch(c: SafetyCar, v: string, opts: readonly string[]) {
  if (c.due == null) return false;
  if (v === opts[0]) return c.status === "over";
  const n = v === opts[1] ? 1 : v === opts[2] ? 3 : 6;
  return c.due <= addMonths(TODAY, n);
}
