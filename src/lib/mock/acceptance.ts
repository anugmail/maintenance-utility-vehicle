"use client";
/* ข้อมูลจำลองการยอมรับผล (ชุด C2: S13 รายคัน · S14 ทั้งแผน) — ค่าชุดเดียวกับปลั๊กอิน Figma (screens.js: ACC · ACC_COLS · ACC_PLAN · accRows · carResult · planEvidence)
   ชื่อค่าคงที่ยกตรงจาก maintainance-yearly-specs/mock-data.ts (ACCEPT_STATUS · PLAN_ACCEPT_STATUS · EVIDENCE_BADGE · ACCEPTANCE_* · FEEDBACK_SAMPLE)
   เก็บใน localStorage คีย์ mt-next-v1 (ฟิลด์ acceptance ของ MockState — ไม่แก้ store.ts) */
import type { PillColor } from "@/components/vms/PillOutline";
import { setMock, useMock, type MockState } from "./store";
import { TRIP_CARS, WORK as PLAN_WORK } from "./jobs";

type Pill = readonly [label: string, tone: PillColor];

export const ACCEPT_STATUS = { wait: ["รอหน่วยงานยอมรับ", "Warning"], ok: ["หน่วยงานยอมรับแล้ว", "Success"] } as const satisfies Record<string, Pill>;   // ACC
export const PLAN_ACCEPT_STATUS = { wait: ["ครบทุกคันแล้ว รอตรวจหลักฐาน", "Warning"], done: ["ยอมรับผลทั้งแผนแล้ว", "Success"] } as const satisfies Record<string, Pill>;
export const EVIDENCE_BADGE = { wait: ["ครบทุกคันแล้ว", "Warning"], done: ["ยอมรับผลทั้งแผนแล้ว", "Success"] } as const satisfies Record<string, Pill>;

export const ACCEPTANCE_CARS = [   // accRows cars (VEH[0], VEH[1], VEH[4])
  { carId: "82-6789", date: "04/11/2569", by: "นายวิชัย ทองดี (กบค.)", mr: "MR Z7000001" },
  { carId: "82-1145", date: "05/11/2569", by: "นางสาวกนกวรรณ ใจมั่น (กบค.)", mr: "MR Z7000001" },
  { carId: "80-9981", date: "06/11/2569", by: "นายสมชาย พูลสุข (กบค.)", mr: "MR Z7000001" },
];
export const ACCEPTANCE_PLAN_ROW = ["ทั้งแผน (12 คัน)", "04–12/11/2569", "กบค. (ตรวจเอง)", "MR Z7000001"];
export const ACCEPTANCE_DOCS = (plateNo: string) => [{ name: `ใบตรวจสภาพอะไหล่-${plateNo}.pdf`, size: "380 KB" }, { name: `ใบตรวจสภาพงานบำรุงรักษา-${plateNo}.pdf`, size: "410 KB" }];
export const ACCEPTANCE_CANNOT = { carId: "80-5738", reason: "รถติดภารกิจซ่อมสายส่งฉุกเฉิน ไม่อยู่ที่หน่วยงานในวันนัด", by: "นายวิชัย ทองดี (กบค.)", at: "05/11/2569" };
export const FEEDBACK_SAMPLE = { score: 5, comment: "ทีมงานตรงเวลา ทำความสะอาดพื้นที่หลังเสร็จงาน" };
/** วันที่ในกล่องแจ้งผลหลังยอมรับ (carResult o.ok · planEvidence o.done) */
export const ACCEPT_DATES = { car: "06/11/2569", plan: "14/11/2569" };
/** PLAN_KV — รายละเอียดแผน MR Z7000001 */
export const PLAN_KV: [string, string][] = [
  ["ชื่อแผน", "บำรุงรักษารถกระเช้า ภาค 1 ปีงบประมาณ 2570"], ["ปีงบประมาณ", "2570"], ["ภาค", "ภาค 1 (เหนือ)"], ["ประเภทรถ", "รถกระเช้า"], ["ไตรมาส", "ไตรมาส 1"],
  ["จำนวนรถ", "12 คัน"], ["เลขที่ MR", "MR Z7000001"], ["ผู้สร้างแผน", "นายวิชัย ทองดี (กบค.)"], ["วันที่สร้าง", "03/10/2569"], ["อนุมัติเมื่อ", "08/10/2569"],
];
export const PLAN_CAR_COUNT = 12;
/** อะไหล่ที่ใช้จริงของคันตัวอย่าง (CLOSE_PARTS: ไส้กรองอากาศใช้ 1 จาก 2) */
const USED = [30, 2, 2, 1];
export const WORK = PLAN_WORK.map((w, i) => ({ task: w.task, part: w.part, planQty: w.planQty, usedQty: USED[i] ?? w.planQty, unit: w.unit }));

export const accCar = (id: string) => TRIP_CARS.find((c) => c.id === id);
/** รถที่แสดงได้ในหน้าผลรายคัน: 3 คันของรายการ + คันที่บำรุงรักษาไม่ได้ (ตัวอย่าง L.3) */
export function accRecord(id: string) {
  const car = accCar(id);
  if (!car) return null;
  if (id === ACCEPTANCE_CANNOT.carId) return { car, date: "04/11/2569", by: "นายวิชัย ทองดี (กบค.)", mr: "MR Z7000001", cannot: true as const };
  const r = ACCEPTANCE_CARS.find((a) => a.carId === id);
  return r ? { car, date: r.date, by: r.by, mr: r.mr, cannot: false as const } : null;
}

export interface AcceptState {
  /** รถที่หน่วยงานยอมรับผลแล้ว (S13) */
  accepted: string[];
  /** ยอมรับผลทั้งแผนแล้ว (S14) */
  planDone: boolean;
  score: number | null;
  comment: string;
}
const INITIAL: AcceptState = { accepted: [], planDone: false, score: null, comment: "" };
export type AcceptSample = "S13" | "S14";
/** S13 = ทุกคันรอหน่วยงานยอมรับ · S14 = ยอมรับครบ 3 คันแล้ว (แถวทั้งแผนขึ้นในรายการ) ยังไม่ประเมิน */
export const acceptSeed = (s: AcceptSample): AcceptState => (s === "S14" ? { ...INITIAL, accepted: ACCEPTANCE_CARS.map((c) => c.carId) } : { ...INITIAL });

type Ext = MockState & { acceptance?: AcceptState };
export function useAcceptance(): AcceptState { return (useMock() as Ext).acceptance ?? INITIAL; }
export function writeAcceptance(fn: (a: AcceptState) => AcceptState) {
  setMock((s) => { const e = s as Ext; return { ...e, acceptance: fn(e.acceptance ?? INITIAL) } as MockState; });
}
/** ?sample= จากหน้า /scenarios/ (ของต้นแบบ) */
export const ACCEPT_SAMPLES = {
  S13: { role: "หน่วยงานเจ้าของรถ" as const, apply: () => writeAcceptance(() => acceptSeed("S13")) },
  S14: { role: "หน่วยงานเจ้าของรถ" as const, apply: () => writeAcceptance(() => acceptSeed("S14")) },
};
export const allCarsAccepted = (a: AcceptState) => ACCEPTANCE_CARS.every((c) => a.accepted.includes(c.carId));
