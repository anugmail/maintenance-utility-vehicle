"use client";
/* S26 Safety Inspection — รายการยานพาหนะที่ต้องตรวจ Safety Inspection + ผลล่าสุด + ครบกำหนดครั้งถัดไป (เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 67)
   _"อยากทำหน้าลิสต์รถ เป็นอีก scen นึง โดยท้ายเป็นลิสต์คอลัมน์มีให้อัปโหลดเอกสาร inspection safety โดยกดเข้าไปเจอหน้าอัปโหลดเอกสาร
   หน้าอัปโหลดเอกสาร จะแสดงไฟล์อัปโหลด และเลือกได้ว่า ผ่าน ไม่ผ่าน (ตัวเลือกที่ 3 รอบแรก) ลองสร้าง scen นี้ใน prototype ให้หน่อย เป็น scen ชื่อว่า safety inspection"_
   + รอบ 2 _"safety inspection มี 2 หน้า คือหน้า list และหน้ารายละเอียด หน้ารายละเอียดเพิ่มผลโดยการอัปโหลด และเลือกได้ว่า ผ่าน ไม่ผ่าน ยกเลิก"_ + รอบ 3 _"safety แก้สถานะ ผ่าน ไม่ผ่าน ระงับ ให้แก้ไข"_
   ยานพาหนะ = รหัสยานพาหนะ (รหัสรถ vms_mas_vehicle_department.vehicle_pea_id เช่น "น.3-09-1650") ส่วนกลางเป็น "09" (เจ้าของงาน 11 พ.ย. 2569 "รถ type 09 ที่จะมาแสดงที่หน้า list")
     ส่วนกลาง = รหัสประเภทของ vms_ref_pea_official_vehicle_type (ชื่อประเภทยังไม่มีในเครื่อง ⇒ ไม่ตั้งชื่อเอง)
     ข้อมูลจำลอง (สมมติ · รอเทียบตารางอ้างอิงจริง — BACKLOG ค.): กระเช้าฮอทไลน์ กระเช้าแก้ไฟ (SAFETY_TYPES) = 09 · รถพ่วงฉีดน้ำ = 06 (ไม่ขึ้นในรายการ)
       ส่วนหน้า = เขตของสังกัดตัด "กฟ" (กฟน.3 → น.3 · กกฟ.1 → ก.1 ซ้ำกับ กฟก.1 — สมมติ) · ส่วนท้าย = เลข 4 หลักของทะเบียน
   ครั้งล่าสุด (วันใหม่สุดของ):
     ยานพาหนะที่อยู่ในแดชบอร์ด S24 = safetyAt ของ maCar (เอกสารตอนปิดงาน S10 · ค่าตั้งต้น MA_ROWS · ผลที่บันทึกจากหน้านี้) ⇒ วันเดียวกับแท็บตารางบำรุงรักษาของ S24
     คันอื่น = ค่าตั้งต้นตามลำดับใน CAND (ค่าสมมติ แบบ vehicleHistory.ts) + ผลที่บันทึกจากหน้านี้
   ผลล่าสุด: ครั้งที่บันทึกจากหน้านี้ = ผลที่เลือก · ค่าตั้งต้น = ตามลำดับ (ส่วนใหญ่ผ่าน) · S24 MA_ROWS = ผ่าน (ค่าสมมติ) · เอกสารจากงานบำรุงรักษา S10 (ไม่มีช่องผล) = ยังไม่มีข้อมูล
   ครบกำหนดครั้งถัดไป = ครั้งล่าสุด + 12 เดือน (กติกา Safety Inspection ทุก 1 ปีของ S24) · ใกล้ครบ/ครบ ตาม statusOf · วันนี้ของต้นแบบ MA_TODAY */
import { useMemo } from "react";
import { CAND, type Car } from "./data";
import { jobsOf, safetyOn } from "./jobs";
import type { UploadFile } from "@/components/vms/FileUpload";
import { MA_DUE, TODAY, addMonths, baseSafetyOf, dayOf, maCars, statusOf, thaiDate, type DueStatus, type DueTone } from "./maintenance";
import { latestUpload, safetyUploads, type SafetyRec, type SafetyResult } from "./safetyStore";
import { useMock, type MockState } from "./store";
import { OWN_UNIT } from "./trips";

export const SAFETY_TITLE = "Safety Inspection";
export const SAFETY_HREF = "/safety/";
/** หน้ารายละเอียด (รอบ 2 · ที่อยู่เดิม /safety/upload/ พาไปที่นี่) */
export const detailHref = (carId: string) => "/safety/detail/?car=" + carId;
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
const seedOf = (i: number): { date: string; result: SafetyResult } | undefined =>
  i % 7 === 3 ? undefined : { date: seedDate(i), result: i % 23 === 7 ? 2 : i % 11 === 5 ? 1 : 0 };

export interface SafetyCar {
  car: Car; id: string; peaId: string;
  /** ครั้งล่าสุด · ผล (ไม่มี = ยังไม่มีข้อมูล) · ครบกำหนดครั้งถัดไป */
  last?: string; result?: SafetyResult; due?: number; status?: DueStatus;
  /** ทุกครั้งที่บันทึกจากหน้ารายละเอียด (เก่าก่อน) */
  uploads: SafetyRec[];
  /** ครั้งล่าสุดก่อนบันทึกในต้นแบบ (ค่าตั้งต้น · S24 MA_ROWS · เอกสารตอนปิดงาน S10) = แถวแรกของประวัติ */
  base?: { date: string; result?: SafetyResult; fromJob?: boolean; files?: UploadFile[] };
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
      base = d ? { date: d, result: job ? undefined : 0, fromJob: job, files: job ? jobFiles.get(id + "|" + d) : undefined } : undefined;
    } else { const sd = seedOf(i); base = sd && { date: sd.date, result: sd.result }; }
    let last = base?.date, result = base?.result;
    if (up && (!last || dayOf(up.date) >= dayOf(last))) { last = up.date; result = up.result; }
    const due = last ? addMonths(dayOf(last), 12) : undefined;
    return [{ car, id, peaId: peaIdOf(car), base, last, result, due, status: due == null ? undefined : statusOf(due), uploads: safetyUploads(m, id) }];
  }).sort((a, b) => (a.due ?? Infinity) - (b.due ?? Infinity) || a.car.plate.localeCompare(b.car.plate));
}
export function useSafetyCars(owner: boolean) { const m = useMock(); return useMemo(() => safetyCars(m, owner), [m, owner]); }

/* ช่องตาราง */
export const dueCell = (c: SafetyCar): { text: string; sub?: string; tone?: DueTone } | string =>
  c.due == null ? "-" : { text: thaiDate(c.due), sub: c.status ? MA_DUE[c.status][0] : undefined, tone: c.status ? MA_DUE[c.status][1] : undefined };
/** ตัวกรอง ครบกำหนดภายใน (ชุดเดียวกับ S24 MA_WITHIN_OPTS) */
export function safetyDueMatch(c: SafetyCar, v: string, opts: readonly string[]) {
  if (c.due == null) return false;
  if (v === opts[0]) return c.status === "over";
  const n = v === opts[1] ? 1 : v === opts[2] ? 3 : 6;
  return c.due <= addMonths(TODAY, n);
}
