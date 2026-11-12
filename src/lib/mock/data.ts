/* ข้อมูลจำลองชุดเดียวกับปลั๊กอิน Figma (Maintenance-Request-Form/figma-export/maintainance-plugin/screens.js) — ค่าสมมติทั้งหมด
   แก้ค่าที่นี่ให้ตรงกับ screens.js เท่านั้น ไม่ตั้งค่าเอง */
import type { PillColor } from "@/components/vms/PillOutline";

export type PlanStatus = "review" | "returned" | "approved" | "active" | "closed";   // hist (รอหัวหน้าตรวจสอบ) passed (ประวัติผ่านแล้ว) เอาออก 10 พ.ย. 2569 พร้อม S16 S17 (Figma 6299e1d)

/* PST — สถานะแผน [ข้อความ, สี Pill outline] */
export const PST: Record<PlanStatus, [string, PillColor]> = {
  review: ["รออนุมัติ", "Warning"],
  returned: ["ส่งกลับแก้ไข", "Error"],
  approved: ["อนุมัติแล้ว", "Brand"],
  active: ["ดำเนินการ", "Info"],
  closed: ["ปิดงานแล้ว", "Gray"],
};

export interface Plan {
  mr: string;          // เลขที่ MR
  name: string;        // ชื่อแผน
  region: string;      // ภาค (ข้อความในตาราง)
  nowQ: string;        // ไตรมาสที่กำลังทำ
  cars: number;        // จำนวนรถ
  status: PlanStatus;
  created: string;     // วันที่สร้าง
  type: string;        // ประเภทรถ
  year: string;        // ปีงบประมาณ
  perQ: string;        // รถรายไตรมาส "ไตรมาส 1: 6 · ไตรมาส 2: 3 · …"
  /* ข้อมูลฟอร์ม (แผนที่สร้างจากต้นแบบ) */
  regions?: string[];
  districts?: string[];
  types?: string[];
  alloc?: Record<number, number>;   // ลำดับรถใน CAND → ไตรมาส
  /* ยานพาหนะที่เพิ่ม/ลบรายคันในตารางแท็บทั้งหมดของฟอร์มแผน (เจ้าของงาน 12 พ.ย. 2569 · BACKLOG ข้อ 86 · planCars ของ plan.ts) */
  extra?: number[];     // ลำดับรถใน CAND ที่เพิ่มเอง (อยู่ในตารางแม้ไม่ตรงตัวกรอง)
  removed?: number[];   // ลำดับรถใน CAND ที่ลบออก (ไม่อยู่ในแผนนี้ แม้ตรงตัวกรอง)
  picks?: Record<number, number[]>; // ลำดับรถ → ลำดับอะไหล่ใน PARTS
  /* S21 อะไหล่ของรถ: จำนวนต่อคันที่แก้ไว้ (ไม่มี = CAR_QTY) · อะไหล่ที่ กบค. ระบุเอง (การ์ด "รายการเพิ่มเติม") */
  qty?: Record<number, Record<number, number>>;   // ลำดับรถ → ลำดับอะไหล่ → จำนวน
  manual?: Record<number, ManualPart[]>;          // ลำดับรถ → รายการเพิ่มเติม
  /* S21 น้ำมันไฮดรอลิกรายคัน (5 พ.ย. 2569): ลำดับใน OIL_PLAN_OPTS (ไม่มี = ยังไม่กำหนด) · เบอร์ รหัส ลิตร เมื่อเปลี่ยนน้ำมัน (ลิตร = qty[รถ][0] · picks มี 0) */
  oils?: Record<number, number>;
  oilSpec?: Record<number, OilSpec>;
  /* S2 S19 วันที่และผลการพิจารณา */
  sentAt?: string;          // วันที่ส่ง (ส่งอนุมัติใหม่หลังแก้ไข S19) · ไม่มี = created
  approvedAt?: string;      // วันที่อนุมัติ (S2)
  returnReason?: string;    // เหตุผลที่ส่งกลับ (S2 → S19)
  ack?: Record<number, string>;   // ไตรมาสที่คลังรับทราบแล้ว → วันที่ (S22 ตัดออก 6 พ.ย. 2569 · ไม่มีหน้าไหนอ่านแล้ว คงไว้ให้ samplePlan)
  /* S21 การเบิกอะไหล่รายคัน (A_DRAW · 6 พ.ย. 2569): ลำดับรถ → "none" = ไม่เบิกอะไหล่ · ไม่มี = เบิก (ถ้ามีรายการ) / ยังไม่กำหนด */
  draw?: Record<number, "none">;
  /* หน่วยงานเจ้าของแผน (แผนที่สร้างในต้นแบบ · 6 พ.ย. 2569 กบค. สร้างแผนได้) · ไม่มี = PLAN_UNIT */
  unit?: string;
}

/* ManualPart — อะไหล่ที่ กบค. ระบุเอง (S21 · MANUAL + MANUAL_FIELDS ของ screens.js 5 พ.ย. 2569: ชื่อ · ยี่ห้อ · รุ่น · รหัส (ถ้ามี) · จำนวน · หน่วย)
   price = ราคาของการ์ด "รายการเพิ่มเติม" แบบเดิม (ที่เก็บเก่า) — ฟอร์มใหม่ไม่มีช่องราคา */
export interface ManualPart { name: string; code: string; qty: number; brand?: string; model?: string; unit?: string; price?: string }
/* น้ำมันไฮดรอลิกของรถ (S21 · carPartsScreen) — JOB_OIL_OPTS · OIL_GRADES · OIL_SPEC ของ screens.js */
export const OIL_PLAN_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน", "เก็บตัวอย่างและเปลี่ยน"];
export const OIL_GRADES = ["ISO VG 32", "ISO VG 46", "ISO VG 68"];
export interface OilSpec { grade: string; code: string; litre: string }
export const OIL_SPEC: OilSpec = { grade: "ISO VG 46", code: "OL-0011", litre: "30" };
export const oilChanges = (k?: number | null) => k === 1 || k === 2;
/* PART_BM — ยี่ห้อ · รุ่น ตามลำดับ PARTS (ค่าสมมติของ screens.js) */
export const PART_BM: [string, string][] = [["PTT", "Hydraulic AW 46"], ["Donaldson", "P550388"], ["Sakura", "C-1809"], ["Sakura", "A-1033"], ["Isuzu", "8-98159693-0"]];

const P = (a: [string, string, string, string, string, PlanStatus, string, string, string, string]): Plan =>
  ({ mr: a[0], name: a[1], region: a[2], nowQ: a[3], cars: Number(a[4]), status: a[5], created: a[6], type: a[7], year: a[8], perQ: a[9] });

/* PLANS */
export const PLANS: Plan[] = [   // 6 พ.ย. 2569 ประเภทยานพาหนะตามโค้ดจริง (screens.js เปลี่ยนชื่อแผนและประเภทตาม VTYPES)
  /* MRZ7000001 (9 พ.ย. 2569 เจ้าของงาน "ทำไมเลือกไตรมาส 3 แล้วแสดงไม่รถ"): จำนวนรายไตรมาสตามยานพาหนะที่หน้าจอใช้จริง = E.2 planDetailQ ของ screens.js (P_COUNTS 10 · 3 · 2 · 1 = 16 คัน)
     ไตรมาส 1 = ยานพาหนะ 10 คันของ S6 (TRIP_CARS) · เดิม P ของ screens.js "12" คัน "ไตรมาส 1: 6" ไม่ตรงกับ 10 คันของหน้าไตรมาส ⇒ แก้ตัวเลขของแผน ไม่แก้ยานพาหนะ */
  P(["MRZ7000001", "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 และภาค 2 ปีงบประมาณ 2570", "ภาค 1, ภาค 2", "ไตรมาส 1", "16", "active", "03/10/2569", "กระเช้าแก้ไฟ", "2570", "ไตรมาส 1: 10 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 1"]),
  P(["MRZ7000002", "บำรุงรักษารถพ่วงฉีดน้ำ ภาค 2 ปีงบประมาณ 2570", "ภาค 2 (ตะวันออกเฉียงเหนือ)", "ไตรมาส 2", "8", "approved", "05/10/2569", "รถพ่วงฉีดน้ำ", "2570", "ไตรมาส 1: 0 · ไตรมาส 2: 4 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MRZ7000003", "บำรุงรักษากระเช้าฮอทไลน์ ภาค 3 ปีงบประมาณ 2570", "ภาค 3 (กลาง)", "ไตรมาส 1", "6", "review", "17/10/2569", "กระเช้าฮอทไลน์", "2570", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
  P(["MRZ7100001", "บำรุงรักษากระเช้าแก้ไฟ ภาค 4 ปีงบประมาณ 2571", "ภาค 4 (ใต้)", "ไตรมาส 1", "9", "returned", "12/10/2569", "กระเช้าแก้ไฟ", "2571", "ไตรมาส 1: 3 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MRZ6900011", "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 ปีงบประมาณ 2569", "ภาค 1 (เหนือ)", "ไตรมาส 4", "10", "closed", "02/06/2568", "กระเช้าแก้ไฟ", "2569", "ไตรมาส 1: 3 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  /* UNIT_PLANS ของ screens.js (9 พ.ย. 2569 · Figma 9d7d1a7) — แผนจำลองเพิ่มให้ทุกหน่วยงานมีแผนของตัวเองอย่างน้อย 2 แผน · ต่อท้าย PLANS ตาม allPlans()
     เจ้าของงาน "ปรับให้มีการสร้าง ของ กรย และ กกฟ ทำ persona ของทั้ง 3 กองนนี้ โดยหน้ารวม เห็นไม่เหมือนกันคือ กกฟ1,2 และ กรย สร้างได้ และเห็นแค่ของตัวเองแต่ กบคจะเห็นของคนอื่นด้วย" */
  P(["MRZ6900012", "บำรุงรักษายานพาหนะ กบผ. ปีงบประมาณ 2569", "ภาค 1, ภาค 2", "ไตรมาส 4", "9", "closed", "05/06/2568", "กระเช้าแก้ไฟ", "2569", "ไตรมาส 1: 3 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MRZ7100002", "บำรุงรักษายานพาหนะ กปส. ปีงบประมาณ 2571", "ภาค 3, ภาค 4", "ไตรมาส 1", "7", "review", "15/10/2569", "กระเช้าฮอทไลน์, รถพ่วงฉีดน้ำ", "2571", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 1"]),
  /* ตรวจสิทธิ์ 9 พ.ย. 2569 (เจ้าของงาน "ทำไมหน้านี้ของ กกฟ2 เข้ามาในฐานะ กกฟ2 ก็ยังดูแผนการเดินทาง สร้างแผนการเดินทาง ไม่ได้") — ค่าสมมติของเว็บ (ไม่มีใน screens.js)
     ให้ผู้ดำเนินการทุกหน่วยงานมีแผนอนุมัติแล้วของตัวเองอย่างน้อย 1 แผน: กบผ. MRZ7000001 (ดำเนินการ) · กปส. MRZ7000002 · กรย. MRZ7100003 · กบค. MRZ7100004 */
  P(["MRZ7100003", "บำรุงรักษากระเช้าฮอทไลน์ กรย. ปีงบประมาณ 2571", "ภาค 3 (กลาง)", "ไตรมาส 1", "6", "approved", "20/10/2569", "กระเช้าฮอทไลน์", "2571", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
  P(["MRZ7100004", "บำรุงรักษากระเช้าแก้ไฟ กบค. ปีงบประมาณ 2571", "ภาค 4 (ใต้)", "ไตรมาส 1", "5", "approved", "22/10/2569", "กระเช้าแก้ไฟ", "2571", "ไตรมาส 1: 2 · ไตรมาส 2: 1 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
];

/* NEW_PLAN — แผนที่บันทึกในจอ "บันทึกและส่งอนุมัติสำเร็จ" (วันที่สร้างในต้นแบบ = วันนี้) */
export const NEW_PLAN_DATE = "30/10/2569";

/* 11 พ.ย. 2569 เจ้าของงาน "ให้เพิ่ม ภาค อีกหนึ่งรายการคือ สนง = สำนักงานใหญ่ โดยภายใต้สำนักงานใหญ่จะมี กกฟ1 กกฟ2" (เคาะป้าย "สนง. (สำนักงานใหญ่)") ⇒ ต่อท้าย ลำดับภาคเดิมไม่เลื่อน */
export const HQ_REGION = "สนง. (สำนักงานใหญ่)";
export const REGIONS = ["ภาค 1 (เหนือ)", "ภาค 2 (ตะวันออกเฉียงเหนือ)", "ภาค 3 (กลาง)", "ภาค 4 (ใต้)", HQ_REGION];
/* DISTRICTS — เขตภายใต้ภาค (R35) · สนง. = กองของสำนักงานใหญ่ (12 พ.ย. 2569 ข้อ 70) */
export const DISTRICTS: Record<string, string[]> = {
  [REGIONS[0]]: ["กฟน.1", "กฟน.2", "กฟน.3"],
  [REGIONS[1]]: ["กฟฉ.1", "กฟฉ.2", "กฟฉ.3"],
  [REGIONS[2]]: ["กฟก.1", "กฟก.2", "กฟก.3"],
  [REGIONS[3]]: ["กฟต.1", "กฟต.2", "กฟต.3"],
  /* เจ้าของงาน 12 พ.ย. 2569 เลือกตามไฟล์สรุปประชุม VMS Plus (Notion "meeting 11/11/68" หัวข้อ 9) — แต่ละกองของสำนักงานใหญ่สร้างแผนเอง ⇒ ตัวกรอง สนง. = 6 กอง (BACKLOG ข้อ 70 · เดิม 11 พ.ย. 2569 กกฟ.1 กกฟ.2 กบร. กฝช. กบค. กบส. ข้อ 64ข) */
  [HQ_REGION]: ["กบค.", "กรย.", "กบผ.", "กปส.", "กส.1", "กส.2"],
};
/* ประเภทยานพาหนะ (VTYPES · typeOf ของ screens.js 6 พ.ย. 2569) — ข้อมูลจาก API ตามโค้ดจริง resolveInspectionCarType ของ maintain-d-fe
   (src/domains/shared/types/vehicle-inspection.types.ts: กระเช้าฮอทไลน์ · กระเช้าแก้ไฟ · รถพ่วงฉีดน้ำ) · ค่าสมมติจากยี่ห้อ/รุ่น: ถังฉีดน้ำ = รถพ่วงฉีดน้ำ · Tadano = กระเช้าฮอทไลน์ · ที่เหลือ = กระเช้าแก้ไฟ */
export const VEHICLE_TYPES = ["กระเช้าฮอทไลน์", "กระเช้าแก้ไฟ", "รถพ่วงฉีดน้ำ"];
export const typeOf = (model: string) => /ฉีดน้ำ/.test(model) ? VEHICLE_TYPES[2] : /Tadano/.test(model) ? VEHICLE_TYPES[0] : VEHICLE_TYPES[1];
/* ยี่ห้อ/รุ่นของยานพาหนะ (แชสซี) และของเครื่องจักร จากข้อความยี่ห้อ/รุ่น "แชสซี + เครื่องจักร" (11 พ.ย. 2569 BACKLOG ข้อ 64 · หน้าไตรมาส S6)
   "Isuzu FTR + กระเช้า Aichi SK17A" → ยานพาหนะ "Isuzu FTR" · เครื่องจักร ยี่ห้อ "Aichi" รุ่น "SK17A"
   ไม่มียี่ห้อเครื่องจักร (รถพ่วงฉีดน้ำ "Hino FM + ถังฉีดน้ำ 6,000 ลิตร") → ยี่ห้อ "-" · รุ่น = สเปกถัง "ถังฉีดน้ำ 6,000 ลิตร" (ค่าสมมติ · ข้อมูลจริงรอ API เครื่องจักร) */
export const machineOf = (model: string): { vehicle: string; brand: string; model: string } => {
  const [vehicle, rest] = model.split(" + ");
  if (!rest) return { vehicle: model, brand: "-", model: "-" };
  const m = rest.match(/^\S*[\u0E00-\u0E7F]\S*\s+([A-Za-z][\w.-]*)\s+(.+)$/);
  return m ? { vehicle, brand: m[1], model: m[2] } : { vehicle, brand: "-", model: rest };
};

export type CarStatus = "ok" | "repair" | "transfer" | "dispose";
export interface Car { plate: string; model: string; owner: string; status: CarStatus; type: string }
/* CAND_SEED — รถที่เข้าเงื่อนไข ภาค 2 + รถกระเช้า (ทะเบียน · ยี่ห้อ/รุ่น · หน่วยงานเจ้าของรถ · สถานะรถ) — ลำดับนี้ห้ามเปลี่ยน (plan.alloc อ้างลำดับใน CAND) */
const car = (plate: string, model: string, owner: string, status: CarStatus): Car => ({ plate, model, owner, status, type: typeOf(model) });
const CAND_SEED: Car[] = [
  car("82-6789 ขอนแก่น", "Isuzu FTR + กระเช้า Aichi SK17A", "กฟฉ.1 ขอนแก่น", "ok"),
  car("82-1145 ขอนแก่น", "Hino FC + กระเช้า Tadano AT-100", "กฟฉ.1 ขอนแก่น", "ok"),
  car("82-3302 อุดรธานี", "Hino FC + กระเช้า Tadano AT-100", "กฟฉ.1 อุดรธานี", "ok"),
  car("82-4410 ขอนแก่น", "Isuzu FTR + กระเช้า Aichi SK17A", "กฟฉ.1 ขอนแก่น", "ok"),
  car("83-1207 อุดรธานี", "Isuzu FRR + กระเช้า Aichi SK10A", "กฟฉ.1 อุดรธานี", "repair"),
  car("84-5521 นครราชสีมา", "Hino FG + กระเช้า Tadano AT-146", "กฟฉ.3 นครราชสีมา", "ok"),
  car("85-0918 อุบลราชธานี", "Isuzu FTR + กระเช้า Aichi SH15A", "กฟฉ.2 อุบลราชธานี", "ok"),
];
/* รถจำลองเพิ่ม (เจ้าของงาน 4 พ.ย. 2569 "จำลองรถที่เลือกเข้าซักประเภทละ 20 คัน") — เติมให้ครบ 20 คันต่อประเภทต่อภาค วนเขตและจังหวัดในภาค
   ทะเบียนขึ้นต้น 6x กระเช้า · 7x เครน · 9x ขุด (ไม่ชนกับรถตัวอย่างของ screens.js ที่ขึ้นต้น 80–85) · ยี่ห้อ/รุ่นวนตามประเภท · ทุก 9 คันมีคันส่งซ่อม 1 คัน */
const CARS_PER_TYPE = 20;
const PROVINCES: Record<string, string[]> = {
  "กฟน.1": ["เชียงใหม่", "ลำพูน", "เชียงราย"], "กฟน.2": ["ลำปาง", "แพร่", "น่าน"], "กฟน.3": ["นครสวรรค์", "ลพบุรี", "พิจิตร"],
  "กฟฉ.1": ["ขอนแก่น", "อุดรธานี", "หนองคาย"], "กฟฉ.2": ["อุบลราชธานี", "ร้อยเอ็ด", "ยโสธร"], "กฟฉ.3": ["นครราชสีมา", "บุรีรัมย์", "ชัยภูมิ"],
  "กฟก.1": ["พระนครศรีอยุธยา", "สระบุรี", "ปทุมธานี"], "กฟก.2": ["ชลบุรี", "ระยอง", "ฉะเชิงเทรา"], "กฟก.3": ["นครปฐม", "ราชบุรี", "สุพรรณบุรี"],
  "กฟต.1": ["เพชรบุรี", "ประจวบคีรีขันธ์", "ชุมพร"], "กฟต.2": ["นครศรีธรรมราช", "สุราษฎร์ธานี", "พัทลุง"], "กฟต.3": ["สงขลา", "ตรัง", "ยะลา"],
  "กบค.": ["กรุงเทพมหานคร"], "กรย.": ["กรุงเทพมหานคร"], "กบผ.": ["กรุงเทพมหานคร"], "กปส.": ["กรุงเทพมหานคร"], "กส.1": ["กรุงเทพมหานคร"], "กส.2": ["กรุงเทพมหานคร"],
};
const MODELS: Record<string, string[]> = {
  /* 6 พ.ย. 2569 ยี่ห้อ/รุ่นของ CAND ใน screens.js แยกตามประเภท (typeOf) — รถเครน รถขุด เดิมไม่มีในประเภทตามโค้ดจริง */
  [VEHICLE_TYPES[0]]: ["Hino FC + กระเช้า Tadano AT-100", "Hino FG + กระเช้า Tadano AT-146"],
  [VEHICLE_TYPES[1]]: ["Isuzu FTR + กระเช้า Aichi SK17A", "Isuzu FRR + กระเช้า Aichi SK10A", "Isuzu FTR + กระเช้า Aichi SH15A"],
  [VEHICLE_TYPES[2]]: ["Hino FM + ถังฉีดน้ำ 6,000 ลิตร"],
};
/* regions = ภาคที่เติม (r = ลำดับใน REGIONS ใช้ทำทะเบียน) — ชุดแรกเติมเฉพาะ 4 ภาคเดิม ⇒ ลำดับรถเดิมใน CAND ไม่เลื่อน (plan.alloc อ้างลำดับ) · สนง. เติมแยกต่อท้ายสุด (GENERATED_HQ) */
/* districts = เขตที่เติม (ไม่ส่ง = ทุกเขตของภาค) · noSeed = ค่าบวกในเลขทะเบียน (ชุดที่เติมภายหลังในภาคเดิมไม่ให้เลขชนชุดแรก) */
const fillCars = (seed: Car[], regions: string[], districts?: string[], noSeed = 0): Car[] => VEHICLE_TYPES.flatMap((type, t) => regions.map((region) => [region, REGIONS.indexOf(region)] as const).flatMap(([region, r]) => {
  const ds = districts ?? DISTRICTS[region];
  const have = seed.filter((c) => c.type === type && ds.includes(c.owner.split(" ")[0])).length;
  return Array.from({ length: Math.max(0, CARS_PER_TYPE - have) }, (_, k) => {
    const d = ds[k % ds.length], prov = PROVINCES[d][Math.floor(k / ds.length) % PROVINCES[d].length];
    const no = String(1000 + ((k * 397 + r * 131 + t * 53 + noSeed) % 9000));
    return { plate: [60, 70, 90][t] + r + "-" + no + " " + prov, model: MODELS[type][k % MODELS[type].length], owner: d + " " + prov, status: k % 9 === 4 ? "repair" : "ok", type };
  });
}));
/* CAND_LATE — รถที่ screens.js ต่อท้าย CAND 5 พ.ย. 2569 (80-5738 น่าน · 81-2210 เชียงใหม่ · 82-9012 ขอนแก่น เครน) · ต่อท้ายสุดของ CAND ลำดับเดิมไม่เลื่อน */
const CAND_LATE: Car[] = [
  car("80-5738 น่าน", "Isuzu FRR + กระเช้า Aichi SK10A", "กฟน.2 น่าน", "repair"),
  car("81-2210 เชียงใหม่", "Hino FG + กระเช้า Tadano AT-146", "กฟน.1 เชียงใหม่", "ok"),
  car("82-9012 ขอนแก่น", "Hino FM + ถังฉีดน้ำ 6,000 ลิตร", "กฟฉ.2 ขอนแก่น", "ok"),   // 6 พ.ย. 2569 เดิมรถเครน · ประเภทตามโค้ดจริงไม่มีรถเครน (screens.js CAND)
];
const GENERATED = fillCars(CAND_SEED, REGIONS.filter((r) => r !== HQ_REGION));
/* GENERATED_HQ — รถจำลองของ สนง. (11 พ.ย. 2569 เดิม กกฟ.1 กกฟ.2 → 12 พ.ย. 2569 กบผ. กปส. ข้อ 70 · เปลี่ยนแค่ป้ายสังกัด จำนวน/ลำดับ/ทะเบียนเดิม) 20 คันต่อประเภทแบบภาคอื่น · ต่อท้ายสุดของ CAND */
const GENERATED_HQ = fillCars([], [HQ_REGION], ["กบผ.", "กปส."]);   // เขตเดิม 2 เขต (เติมเขตใน DISTRICTS แล้วรถชุดนี้ไม่เปลี่ยน)
/* GENERATED_HQ2 — สนง. หน่วยงาน กบค. กรย. กส.1 กส.2 (11 พ.ย. 2569 เดิม กบร. กฝช. กบค. กบส. ข้อ 64ข → 12 พ.ย. 2569 ข้อ 70 เปลี่ยนแค่ป้ายสังกัด) 20 คันต่อประเภท วน 4 หน่วยงาน · ต่อท้ายสุดของ CAND (หลัง CAND_FIG) ลำดับเดิมไม่เลื่อน
   ทะเบียน 64-/74-/94- กรุงเทพมหานคร เลขเลื่อน 4500 ไม่ชน GENERATED_HQ */
const GENERATED_HQ2 = fillCars([], [HQ_REGION], ["กบค.", "กรย.", "กส.1", "กส.2"], 4500);
/* CAND_FIG — ยานพาหนะตัวอย่างของ screens.js ที่อยู่ในแผนตัวอย่าง MRZ7000001 แต่ไม่อยู่ใน CAND (TRIP_CARS 5 คัน · SAMPLE_Q 4 คัน · Q_EXTRA 3 คันของ trips.ts · ข้อมูลเดียวกัน)
   11 พ.ย. 2569 เจ้าของงาน "แผนที่ดำเนินการแล้ว ยังสามารถแก้ไขได้" (BACKLOG ข้อ 64) — ฟอร์มแก้ไขอ้างยานพาหนะด้วยลำดับใน CAND ⇒ ต่อท้ายสุดให้ฟอร์มเห็นครบ (ลำดับเดิมไม่เลื่อน)
   ไม่อยู่ใน UNIT_FLEET (ฟอร์มสร้างแผน ตัวกรองภาค จำนวนคันของแผนตัวอย่าง MRZ7000004 เหมือนเดิม) · ข้อมูลเบอร์ ผู้ดูแล ยังอ่านจาก trips.ts (carOf) */
const CAND_FIG: Car[] = [
  car("80-9981 ลำปาง", "Isuzu FTR + กระเช้า Aichi SH15A", "กฟน.1 ลำปาง", "ok"), car("82-7720 ขอนแก่น", "Isuzu FTR + กระเช้า Aichi SK17A", "กฟฉ.1 ขอนแก่น", "ok"),
  car("80-3316 พะเยา", "Hino FC + กระเช้า Tadano AT-100", "กฟน.1 พะเยา", "ok"), car("81-6604 เชียงราย", "Isuzu FRR + กระเช้า Aichi SK10A", "กฟน.1 เชียงราย", "ok"),
  car("80-4458 แพร่", "Hino FG + กระเช้า Tadano AT-146", "กฟน.2 แพร่", "ok"),
  car("81-7702 ลำปาง", "Isuzu FTR + กระเช้า Aichi SK12A", "กฟน.1 ลำปาง", "ok"), car("82-5530 เชียงราย", "Hino FC + กระเช้า Tadano AT-100", "กฟน.1 เชียงราย", "ok"),
  car("80-1189 น่าน", "Isuzu FRR + กระเช้า Aichi SK10A", "กฟน.2 น่าน", "ok"), car("81-3348 พะเยา", "Hino FG + กระเช้า Tadano AT-146", "กฟน.1 พะเยา", "ok"),
  car("81-9035 ลำปาง", "Isuzu FTR + กระเช้า Aichi SK12A", "กฟน.2 ลำปาง", "ok"), car("82-4417 น่าน", "Hino FC + กระเช้า Tadano AT-121", "กฟน.2 น่าน", "ok"),
  car("80-6652 ลำพูน", "Isuzu FRR + กระเช้า Aichi SK10A", "กฟน.1 ลำพูน", "ok"),
];
export const CAND: Car[] = [...CAND_SEED, ...GENERATED, ...CAND_LATE, ...GENERATED_HQ, ...CAND_FIG, ...GENERATED_HQ2];
const FIG_FROM = CAND_SEED.length + GENERATED.length + CAND_LATE.length + GENERATED_HQ.length;
/** ทะเบียน (ไม่มีจังหวัด) ของ CAND_FIG */
export const FIG_EXTRA_IDS = new Set(CAND_FIG.map((c) => c.plate.split(" ")[0]));
/* FIG_FLEET — รถ 10 คันของ CAND ใน screens.js (CAND_SEED 7 คัน + CAND_LATE 3 คัน) ใช้จับคู่ค่าตัวอย่างรายคันของ Figma (A_ALL A_OILS A_DRAW ของ NEW_PLAN)
   UNIT_FLEET — รถที่ฟอร์มสร้าง/แก้ไขแผนเห็นและต้องจัดลงไตรมาสครบทุกคัน = รถจำลองครบชุด CAND (ภาค 4 × ประเภท 3 × 20 คัน + รถของ screens.js · 243 คัน · 11 พ.ย. 2569 + สนง. 60 คัน (กบผ. กปส.) + สนง. 60 คัน (กบค. กรย. กส.1 กส.2) = 363 คัน · ไม่รวม CAND_FIG)
   9 พ.ย. 2569 เจ้าของงาน _"รถตัวอย่างทำไมมีน้อยตอนแรกมี 250 คันป่ะ"_ + _"ถ้าเลือกภาคแล้วต้องแสดงตามที่เลือกสิ"_ (เดิม 6 พ.ย. 2569 = FIG_FLEET 10 คัน · BACKLOG ข้อ 21 ค.(ก) ปิด) */
export const FIG_FLEET: number[] = [...CAND_SEED.map((_, i) => i), ...CAND_LATE.map((_, k) => CAND_SEED.length + GENERATED.length + k)];
export const UNIT_FLEET: number[] = CAND.map((_, i) => i).filter((i) => i < FIG_FROM || i >= FIG_FROM + CAND_FIG.length);   // ไม่รวม CAND_FIG
/* หน่วยงานที่ใช้ flow นี้ (UNITS · PLAN_UNIT ของ screens.js 6 พ.ย. 2569 · ค่าสมมติ) — ผู้สร้างแผนและผู้ดำเนินการ = หน่วยงาน · กบค. เห็นแผนทุกหน่วยงาน
   เจ้าของงาน 12 พ.ย. 2569 เลือกตามไฟล์สรุปประชุม VMS Plus (Notion "meeting 11/11/68" หัวข้อ 9) — แต่ละกองของสำนักงานใหญ่สร้างแผนเอง (BACKLOG ข้อ 70): กกฟ.1 → กบผ. · กกฟ.2 → กปส. (ลำดับเดิม) · กรย. กบค. คงเดิม · เพิ่ม กส.1 กส.2 ต่อท้าย */
export const UNITS = ["กบผ.", "กปส.", "กรย.", "กบค.", "กส.1", "กส.2"];   // 6 พ.ย. 2569 รอบ 2 "กบค จะทำแผนจะมีรถของ กฝช. ด้วย" ⇒ กบค. สร้างแผนได้อีกหน่วยงาน
export const PLAN_UNIT: Record<string, string> = { "MRZ7000004": "กบผ.", "MRZ7000001": "กบผ.", "MRZ7000002": "กปส.", "MRZ7000003": "กรย.", "MRZ7100001": "กบค.", "MRZ6900012": "กบผ.", "MRZ7100002": "กปส.", "MRZ6900011": "กรย.", "MRZ7100003": "กรย.", "MRZ7100004": "กบค." };
/* หน่วยงานเจ้าของแผน: แผนที่สร้างในต้นแบบเก็บ unit · แผนตัวอย่างใช้ PLAN_UNIT (MRZ7100001 = แผนของ กบค. ที่มีรถ กฝซ.) */
export const unitOf = (mr: string, unit?: string) => unit ?? PLAN_UNIT[mr] ?? UNITS[0];
/* dCode — รหัสเขตของรถ จากหน่วยงานเจ้าของรถ */
export const dCode = (c: Car) => c.owner.split(" ")[0];
/* regionOf · shortRegion · uniq (screens.js 5 พ.ย. 2569) — ภาคของรถจากรหัสเขต · "ภาค 2 (ตะวันออกเฉียงเหนือ)" → "ภาค 2" */
export const regionOf = (c: Car) => REGIONS.find((r) => DISTRICTS[r].includes(dCode(c))) ?? "";
export const shortRegion = (r: string) => r.split(" (")[0];
export const uniq = <T,>(a: T[]) => [...new Set(a)];

/* LAST_OIL — เปลี่ยนน้ำมันครั้งล่าสุดตามลำดับ CAND · OIL_OPTS */
const LAST_OIL_SEED = ["12/03/2568", "12/03/2567", "05/02/2567", "20/11/2566", "ไม่มีข้อมูล", "18/06/2568", "09/01/2566"];
/* รถจำลองเพิ่ม: วันที่วนปี 2566–2568 · ทุก 11 คันไม่มีข้อมูล */
export const LAST_OIL = [...LAST_OIL_SEED, ...GENERATED.map((_, k) => k % 11 === 5 ? "ไม่มีข้อมูล"
  : String(1 + (k * 7) % 28).padStart(2, "0") + "/" + String(1 + (k * 5) % 12).padStart(2, "0") + "/" + (2566 + (k % 3))), "14/10/2568", "ไม่มีข้อมูล", "ไม่มีข้อมูล",   // CAND_LATE ตาม LAST_OIL ของ screens.js
  ...GENERATED_HQ.map((_, k) => String(1 + (k * 7) % 28).padStart(2, "0") + "/" + String(1 + (k * 5) % 12).padStart(2, "0") + "/" + (2566 + (k % 3))),
  /* CAND_FIG ตาม LAST_OIL_OF ของ jobs.ts (MA_ROWS ของ S24) · ไม่มี = ไม่มีข้อมูล */
  "10/01/2569", "18/06/2567", "05/02/2567", "20/09/2569", "01/10/2566", ...Array(7).fill("ไม่มีข้อมูล"),
  ...GENERATED_HQ2.map((_, k) => k % 11 === 3 ? "ไม่มีข้อมูล" : String(1 + (k * 5) % 28).padStart(2, "0") + "/" + String(1 + (k * 7) % 12).padStart(2, "0") + "/" + (2566 + (k % 3)))];   // สนง. ชุดที่ 2   // สนง. วนแบบรถจำลองเพิ่ม
export const OIL_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน"];

/* 6 พ.ย. 2569 เจ้าของงาน "ไตรเป็นตามปีปฎิทิน" (เดิมไตรมาส 1 = ต.ค.–ธ.ค. ตามปีงบ) · ป้ายช่อง "ปีงบประมาณ" คงเดิม */
export const QUARTERS = ["ไตรมาส 1 (ม.ค.–มี.ค.)", "ไตรมาส 2 (เม.ย.–มิ.ย.)", "ไตรมาส 3 (ก.ค.–ก.ย.)", "ไตรมาส 4 (ต.ค.–ธ.ค.)"];
/* YEARS — เจ้าของงาน "ไม่จำกัดปี" จำนวนปีที่แสดงยังไม่รู้ (Q31) */
export const YEARS = ["2568", "2569", "2570", "2571", "2572"];

/* PARTS — รายการ · รหัส · หมวด · จำนวนตามแผน · หน่วย · คงเหลือ · สถานะเมื่อจอง */
export interface Part { name: string; code: string; group: string; planQty: number; unit: string; stock: number; st: "ok" | "short" }
export const PARTS: Part[] = [
  { name: "น้ำมันไฮดรอลิก ISO VG 46", code: "OL-0011", group: "น้ำมัน", planQty: 60, unit: "ลิตร", stock: 420, st: "ok" },
  { name: "ไส้กรองไฮดรอลิก", code: "FL-0022", group: "ไส้กรอง", planQty: 12, unit: "ชิ้น", stock: 3, st: "short" },
  { name: "ไส้กรองน้ำมันเครื่อง", code: "FL-0031", group: "ไส้กรอง", planQty: 12, unit: "ชิ้น", stock: 40, st: "ok" },
  { name: "ไส้กรองอากาศ", code: "FL-0040", group: "ไส้กรอง", planQty: 12, unit: "ชิ้น", stock: 60, st: "ok" },
  { name: "ไส้กรองเชื้อเพลิง", code: "FL-0052", group: "ไส้กรอง", planQty: 4, unit: "ชิ้น", stock: 1, st: "short" },
];
/* CAR_QTY — จำนวนต่อคัน · CAR_PICK — ไส้กรองที่ กบค. เลือกให้รถ 1 คันในข้อมูลตัวอย่าง */
export const CAR_QTY = [30, 2, 2, 2, 2];
export const CAR_PICK = [1, 2, 3];

/* WH · PRICE — คลังและราคาต่อหน่วยตามลำดับ PARTS (การ์ด Spare Part Card Item ของ S21) */
export const PART_WH = ["Smart Inventory", "Smart Inventory", "Smart Inventory", "คลังสำรอง", "คลังสำรอง"];
export const PART_PRICE = [120, 680, 250, 420, 350];

/* RETURN_REASON — เหตุผลที่ผู้อนุมัติส่งกลับ (S2 B.7 · S19 R.2 R.3) */
export const RETURN_REASON = "จำนวนไส้กรองไฮดรอลิกไม่ตรงกับรอบบำรุงรักษาของกระเช้าแก้ไฟ กรุณาตรวจสอบยานพาหนะที่เลือกเข้าแผน";
/* ผู้สร้างแผน (CREATOR · 6 พ.ย. 2569 ผู้สร้างแผน = หน่วยงาน) — ช่อง "ผู้สร้างแผน" ของรายละเอียดแผน · "ผู้สร้าง" + บรรทัดรองหน่วยงาน ของรายการแผนรออนุมัติ */
export const PLAN_CREATOR = "นายวิชัย ทองดี (กบผ.)";
export const PLAN_CREATOR_SHORT = "นายวิชัย ทองดี";
/* ผู้สร้างแผน = ชื่อ (หน่วยงานเจ้าของแผน) — แผนของ กบผ. = CREATOR ของ screens.js · แผนของหน่วยงานอื่นใส่หน่วยงานของแผนนั้น */
/* persona ผู้สร้างแผนของแต่ละหน่วยงาน (ค่าจำลอง · userflow 14 แถว "persona" 9 พ.ย. 2569): กบผ. นายวิชัย ทองดี (CREATOR ของจอชุดหลัก) · กปส. นายอนุชา บุญมา · กรย. นางสาวพิมพ์ชนก ศรีสุข
   + 12 พ.ย. 2569 (ข้อ 70 · ค่าจำลอง) กส.1 นายสมศักดิ์ แก้วมณี · กส.2 นางสาวกนกวรรณ ใจดี
   กบค. ยังไม่เคาะชื่อ (userflow: persona กบค. ใน personas.json ชื่อซ้ำกับผู้สร้างแผน กบผ.) ⇒ ใช้ PLAN_CREATOR_SHORT ตามเดิม */
export const UNIT_PERSONA: Record<string, string> = { "กบผ.": "นายวิชัย ทองดี", "กปส.": "นายอนุชา บุญมา", "กรย.": "นางสาวพิมพ์ชนก ศรีสุข", "กส.1": "นายสมศักดิ์ แก้วมณี", "กส.2": "นางสาวกนกวรรณ ใจดี" };
export const creatorName = (p: Pick<Plan, "mr" | "unit">) => UNIT_PERSONA[unitOf(p.mr, p.unit)] ?? PLAN_CREATOR_SHORT;
export const creatorOf = (p: Pick<Plan, "mr" | "unit">) => creatorName(p) + " (" + unitOf(p.mr, p.unit) + ")";

/* MENU — เมนู "…" (core.js) */
export const MENU = [
  { Text: "ดูรายละเอียด", IconSwap: "quick_reference_all-24-300-round" },
  { Text: "แก้ไข", IconSwap: "stylus-24-300-round" },
  { Text: "ลบ", IconSwap: "delete-24-300-round" },
];
