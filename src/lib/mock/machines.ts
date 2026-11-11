"use client";
/* เครื่องมือกลของยานพาหนะ (หน้ารายละเอียดยานพาหนะ S24 แท็บข้อมูลยานพาหนะ · BACKLOG ข้อ 68)
   เจ้าของงาน 11 พ.ย. 2569 _"หน้ารายละเอียดรถ อยากให้ทุกคันมีเพิ่ม เครื่องมือกล โดยต้องกรอก ยี่ห้อ รุ่น ประเภทเครื่องมือกล เช่น กระเช้า เครน รหัสทรัพย์สิน
   และรหัสทรัพย์สินย่อย เป็นต้น มีพิกัดยก ทำเสริมในหน้ารายละเอียด"_ + _"เพิ่มชั่วโมงเครื่องจักร ชั่วโมงเครน"_ → _"ชั่วโมงเครื่องยนต์"_
   ช่องตามตาราง vms_mas_vehicle_mechanic (db-schema/columns.csv · map-01): ยี่ห้อ crane_name · รุ่น crane_model · หมายเลข HC crane_number · หมายเลขเครื่อง Manufacturer_number
     · พิกัดยก lift_limit (integer ⇒ หน่วย กก. — สมมติ) · ชั่วโมงเครน Cumulative_working_hours (integer NOT NULL · ชั่วโมงการทำงานเครื่องจักรสะสม)
     · ไม่มีคอลัมน์ของ ประเภทเครื่องมือกล · รหัสทรัพย์สิน/รหัสย่อย (vms_mas_vehicle_department.vehicle_asset_no varchar(9) เป็นของตัวรถ) · ชั่วโมงเครื่องยนต์ — BACKLOG ค.
   รหัสทรัพย์สิน 12 หลัก + รหัสย่อย 4 หลัก (รูปแบบ SAP · design-mock/equipment-asset-code.html ของรีโป Maintenance-Request-Form: รหัสหลักของตัวรถ · ย่อย 0000 = ตัวรถ · 0001 ขึ้นไป = เครื่องมือกล)
   1 คันมีได้หลายเครื่อง (ตาราง mechanic แยกแถวต่อเครื่อง · ทะเบียนเครื่องมือกลมีรหัสย่อยต่อเครื่อง) · ชั่วโมงทั้งสองช่องเก็บต่อเครื่อง (เสนอ)
   ค่าตั้งต้น = 1 เครื่องจาก machineOf() ของยี่ห้อ/รุ่นในข้อมูลยานพาหนะ (ค่าสมมติ) · แก้แล้วเก็บ MockState.machines[ทะเบียนไม่มีจังหวัด]
   ข้อ 68ก (เจ้าของงาน "กลุ่มรหัสข้างรถ เลข 04, 07, 08, 09, 10 จะสามารถเพิ่มเครื่องมือกลได้ ถ้ามีข้อมูลต้องสามารถแก้ไขได้"): เฉพาะรหัสข้างรถที่ hasEquipment ในตารางอ้างอิง vehicleTypes.ts */
import { useMemo } from "react";
import { CAND, machineOf, type Car } from "./data";
import { hasEquipment, sideCodeOf } from "./vehicleTypes";
import { setMock, useMock, type MockState } from "./store";

declare module "./store" {
  interface MockState { machines?: Record<string, Machine[]> }
}

/** ประเภทเครื่องมือกล (เสนอ · จากยี่ห้อ/รุ่นในข้อมูล + ทะเบียนเครื่องมือกลเดิม: เครน สว่านขุดเจาะ หัวจับเสา) */
export const MACHINE_TYPES = ["กระเช้า", "เครน", "ถังฉีดน้ำ", "สว่านขุดเจาะ", "หัวจับเสา", "อื่นๆ"] as const;
/** ประเภทที่ไม่มีพิกัดยก (ไม่บังคับกรอก) */
export const NO_LIFT = ["ถังฉีดน้ำ", "อื่นๆ"];
export const LIFT_UNIT = "กก.";

export interface Machine {
  key: string; type: string; brand: string; model: string;
  asset: string; subAsset: string;
  /** พิกัดยก (กก.) · หมายเลข HC · หมายเลขเครื่อง (Serial No.) */
  lift?: number; hc?: string; serial?: string;
  /** ชั่วโมงเครื่องยนต์ · ชั่วโมงเครน (ชั่วโมง · จำนวนเต็ม ≥ 0) */
  engineHours: number; craneHours: number;
}

const idOf = (plate: string) => plate.split(" ")[0];
const digits = (plate: string) => idOf(plate).replace(/\D/g, "").padStart(6, "0").slice(-6);
const typeOfModel = (m: string) => (/ถังฉีดน้ำ/.test(m) ? "ถังฉีดน้ำ" : /เครน/.test(m) ? "เครน" : /กระเช้า/.test(m) ? "กระเช้า" : "อื่นๆ");
/** ค่าตั้งต้นของคันหนึ่ง (ค่าสมมติ · i = ลำดับใน CAND) — ข้อ 68ก: มีเฉพาะคันที่รหัสข้างรถอยู่ในกลุ่มเพิ่มเครื่องมือกลได้ (ตารางอ้างอิง)
    และรหัส 09 08 10 (04 07 เริ่มว่าง ให้เห็นกรณีในกลุ่มแต่ยังไม่มีข้อมูล · สมมติ) */
const PREFILL = ["09", "08", "10"];
export function defaultMachines(car: Car, i: number): Machine[] {
  const code = sideCodeOf(car);
  if (!hasEquipment(code) || !PREFILL.includes(code)) return [];
  const mc = machineOf(car.model), type = typeOfModel(car.model);
  const d = digits(car.plate);
  return [{
    key: "m1", type, brand: mc.brand === "-" ? "" : mc.brand, model: mc.model === "-" ? "" : mc.model,
    asset: "500000" + d, subAsset: "0001",
    lift: NO_LIFT.includes(type) ? undefined : /Tadano/.test(car.model) ? 300 : 200,
    hc: type === "กระเช้า" || type === "เครน" ? "HC - " + d.slice(-4) : undefined,
    engineHours: 2000 + ((i * 397) % 6000), craneHours: 800 + ((i * 211) % 3000),
  }];
}
const INDEX = new Map(CAND.map((c, i) => [idOf(c.plate), i]));

export function machinesOf(m: MockState, carId: string, car?: Car): Machine[] {
  const saved = m.machines?.[carId];
  if (saved) return saved;
  const i = INDEX.get(carId);
  const c = car ?? (i != null ? CAND[i] : undefined);
  return c ? defaultMachines(c, i ?? 0) : [];
}
export function useMachines(carId: string, car?: Car) { const m = useMock(); return useMemo(() => machinesOf(m, carId, car), [m, carId, car]); }

/** รหัสทรัพย์สิน + รหัสย่อย ที่ใช้แล้วทั้งระบบ (ยกเว้นเครื่องที่กำลังแก้) */
export function usedAssets(m: MockState, except?: { carId: string; key: string }): Set<string> {
  const out = new Set<string>();
  const ids = new Set([...INDEX.keys(), ...Object.keys(m.machines ?? {})]);
  ids.forEach((id) => machinesOf(m, id).forEach((x) => { if (!(except && except.carId === id && except.key === x.key)) out.add(x.asset + "-" + x.subAsset); }));
  return out;
}
export function saveMachine(carId: string, car: Car | undefined, x: Machine) {
  setMock((s) => {
    const list = machinesOf(s, carId, car);
    const next = list.some((y) => y.key === x.key) ? list.map((y) => (y.key === x.key ? x : y)) : [...list, x];
    return { ...s, machines: { ...s.machines, [carId]: next } };
  });
}
export const nf0 = (n?: number) => (n == null ? "-" : n.toLocaleString("en-US"));
