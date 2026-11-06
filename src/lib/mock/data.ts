/* ข้อมูลจำลองชุดเดียวกับปลั๊กอิน Figma (Maintenance-Request-Form/figma-export/maintainance-plugin/screens.js) — ค่าสมมติทั้งหมด
   แก้ค่าที่นี่ให้ตรงกับ screens.js เท่านั้น ไม่ตั้งค่าเอง */
import type { PillColor } from "@/components/vms/PillOutline";

export type PlanStatus = "review" | "returned" | "approved" | "active" | "hist" | "passed" | "closed";

/* PST — สถานะแผน [ข้อความ, สี Pill outline] */
export const PST: Record<PlanStatus, [string, PillColor]> = {
  review: ["รออนุมัติ", "Warning"],
  returned: ["ส่งกลับแก้ไข", "Error"],
  approved: ["อนุมัติแล้ว", "Brand"],
  active: ["ดำเนินการ", "Info"],
  hist: ["รอหัวหน้าตรวจสอบ", "Warning"],
  passed: ["ประวัติผ่านแล้ว", "Success"],
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
  picks?: Record<number, number[]>; // ลำดับรถ → ลำดับอะไหล่ใน PARTS
  /* S21 อะไหล่ของรถ: จำนวนต่อคันที่แก้ไว้ (ไม่มี = CAR_QTY) · อะไหล่ที่ กบค. ระบุเอง (การ์ด "รายการเพิ่มเติม") */
  qty?: Record<number, Record<number, number>>;   // ลำดับรถ → ลำดับอะไหล่ → จำนวน
  manual?: Record<number, ManualPart[]>;          // ลำดับรถ → รายการเพิ่มเติม
  /* S21 น้ำมันไฮโดรลิกรายคัน (5 พ.ย. 2569): ลำดับใน OIL_PLAN_OPTS (ไม่มี = ยังไม่กำหนด) · เบอร์ รหัส ลิตร เมื่อเปลี่ยนน้ำมัน (ลิตร = qty[รถ][0] · picks มี 0) */
  oils?: Record<number, number>;
  oilSpec?: Record<number, OilSpec>;
  /* S2 S19 S22 วันที่และผลการพิจารณา */
  sentAt?: string;          // วันที่ส่ง (ส่งอนุมัติใหม่หลังแก้ไข S19) · ไม่มี = created
  approvedAt?: string;      // วันที่อนุมัติ (S2)
  returnReason?: string;    // เหตุผลที่ส่งกลับ (S2 → S19)
  ack?: Record<number, string>;   // ไตรมาสที่คลังรับทราบแล้ว → วันที่ (S22) · ไม่มี = ใช้ค่าตัวอย่าง WH_ACK / WH_LIST
  /* S21 การเบิกอะไหล่รายคัน (A_DRAW · 6 พ.ย. 2569): ลำดับรถ → "none" = ไม่เบิกอะไหล่ · ไม่มี = เบิก (ถ้ามีรายการ) / ยังไม่กำหนด */
  draw?: Record<number, "none">;
  /* หน่วยงานเจ้าของแผน (แผนที่สร้างในต้นแบบ · 6 พ.ย. 2569 กบค. สร้างแผนได้) · ไม่มี = PLAN_UNIT */
  unit?: string;
}

/* ManualPart — อะไหล่ที่ กบค. ระบุเอง (S21 · MANUAL + MANUAL_FIELDS ของ screens.js 5 พ.ย. 2569: ชื่อ · ยี่ห้อ · รุ่น · รหัส (ถ้ามี) · จำนวน · หน่วย)
   price = ราคาของการ์ด "รายการเพิ่มเติม" แบบเดิม (ที่เก็บเก่า) — ฟอร์มใหม่ไม่มีช่องราคา */
export interface ManualPart { name: string; code: string; qty: number; brand?: string; model?: string; unit?: string; price?: string }
/* น้ำมันไฮโดรลิกของรถ (S21 · carPartsScreen) — JOB_OIL_OPTS · OIL_GRADES · OIL_SPEC ของ screens.js */
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
  P(["MR Z7000001", "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 และภาค 2 ปีงบประมาณ 2570", "ภาค 1, ภาค 2", "ไตรมาส 1", "12", "active", "03/10/2569", "กระเช้าแก้ไฟ", "2570", "ไตรมาส 1: 6 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 1"]),
  P(["MR Z7000002", "บำรุงรักษารถพ่วงฉีดน้ำ ภาค 2 ปีงบประมาณ 2570", "ภาค 2 (ตะวันออกเฉียงเหนือ)", "ไตรมาส 2", "8", "approved", "05/10/2569", "รถพ่วงฉีดน้ำ", "2570", "ไตรมาส 1: 0 · ไตรมาส 2: 4 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MR Z7000003", "บำรุงรักษากระเช้าฮอทไลน์ ภาค 3 ปีงบประมาณ 2570", "ภาค 3 (กลาง)", "ไตรมาส 1", "6", "review", "17/10/2569", "กระเช้าฮอทไลน์", "2570", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
  P(["MR Z7100001", "บำรุงรักษากระเช้าแก้ไฟ ภาค 4 ปีงบประมาณ 2571", "ภาค 4 (ใต้)", "ไตรมาส 1", "9", "returned", "12/10/2569", "กระเช้าแก้ไฟ", "2571", "ไตรมาส 1: 3 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MR Z6900011", "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 ปีงบประมาณ 2569", "ภาค 1 (เหนือ)", "ไตรมาส 4", "10", "closed", "02/06/2568", "กระเช้าแก้ไฟ", "2569", "ไตรมาส 1: 3 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
];

/* NEW_PLAN — แผนที่บันทึกในจอ "บันทึกและส่งอนุมัติสำเร็จ" (วันที่สร้างในต้นแบบ = วันนี้) */
export const NEW_PLAN_DATE = "30/10/2569";

export const REGIONS = ["ภาค 1 (เหนือ)", "ภาค 2 (ตะวันออกเฉียงเหนือ)", "ภาค 3 (กลาง)", "ภาค 4 (ใต้)"];
/* DISTRICTS — เขตภายใต้ภาค (R35) */
export const DISTRICTS: Record<string, string[]> = {
  [REGIONS[0]]: ["กฟน.1", "กฟน.2", "กฟน.3"],
  [REGIONS[1]]: ["กฟฉ.1", "กฟฉ.2", "กฟฉ.3"],
  [REGIONS[2]]: ["กฟก.1", "กฟก.2", "กฟก.3"],
  [REGIONS[3]]: ["กฟต.1", "กฟต.2", "กฟต.3"],
};
/* ประเภทยานพาหนะ (VTYPES · typeOf ของ screens.js 6 พ.ย. 2569) — ข้อมูลจาก API ตามโค้ดจริง resolveInspectionCarType ของ maintain-d-fe
   (src/domains/shared/types/vehicle-inspection.types.ts: กระเช้าฮอทไลน์ · กระเช้าแก้ไฟ · รถพ่วงฉีดน้ำ) · ค่าสมมติจากยี่ห้อ/รุ่น: ถังฉีดน้ำ = รถพ่วงฉีดน้ำ · Tadano = กระเช้าฮอทไลน์ · ที่เหลือ = กระเช้าแก้ไฟ */
export const VEHICLE_TYPES = ["กระเช้าฮอทไลน์", "กระเช้าแก้ไฟ", "รถพ่วงฉีดน้ำ"];
export const typeOf = (model: string) => /ฉีดน้ำ/.test(model) ? VEHICLE_TYPES[2] : /Tadano/.test(model) ? VEHICLE_TYPES[0] : VEHICLE_TYPES[1];

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
};
const MODELS: Record<string, string[]> = {
  /* 6 พ.ย. 2569 ยี่ห้อ/รุ่นของ CAND ใน screens.js แยกตามประเภท (typeOf) — รถเครน รถขุด เดิมไม่มีในประเภทตามโค้ดจริง */
  [VEHICLE_TYPES[0]]: ["Hino FC + กระเช้า Tadano AT-100", "Hino FG + กระเช้า Tadano AT-146"],
  [VEHICLE_TYPES[1]]: ["Isuzu FTR + กระเช้า Aichi SK17A", "Isuzu FRR + กระเช้า Aichi SK10A", "Isuzu FTR + กระเช้า Aichi SH15A"],
  [VEHICLE_TYPES[2]]: ["Hino FM + ถังฉีดน้ำ 6,000 ลิตร"],
};
const fillCars = (seed: Car[]): Car[] => VEHICLE_TYPES.flatMap((type, t) => REGIONS.flatMap((region, r) => {
  const ds = DISTRICTS[region];
  const have = seed.filter((c) => c.type === type && ds.includes(c.owner.split(" ")[0])).length;
  return Array.from({ length: Math.max(0, CARS_PER_TYPE - have) }, (_, k) => {
    const d = ds[k % ds.length], prov = PROVINCES[d][Math.floor(k / ds.length) % PROVINCES[d].length];
    const no = String(1000 + ((k * 397 + r * 131 + t * 53) % 9000));
    return { plate: [60, 70, 90][t] + r + "-" + no + " " + prov, model: MODELS[type][k % MODELS[type].length], owner: d + " " + prov, status: k % 9 === 4 ? "repair" : "ok", type };
  });
}));
/* CAND_LATE — รถที่ screens.js ต่อท้าย CAND 5 พ.ย. 2569 (80-5738 น่าน · 81-2210 เชียงใหม่ · 82-9012 ขอนแก่น เครน) · ต่อท้ายสุดของ CAND ลำดับเดิมไม่เลื่อน */
const CAND_LATE: Car[] = [
  car("80-5738 น่าน", "Isuzu FRR + กระเช้า Aichi SK10A", "กฟน.2 น่าน", "repair"),
  car("81-2210 เชียงใหม่", "Hino FG + กระเช้า Tadano AT-146", "กฟน.1 เชียงใหม่", "ok"),
  car("82-9012 ขอนแก่น", "Hino FM + ถังฉีดน้ำ 6,000 ลิตร", "กฟฉ.2 ขอนแก่น", "ok"),   // 6 พ.ย. 2569 เดิมรถเครน · ประเภทตามโค้ดจริงไม่มีรถเครน (screens.js CAND)
];
const GENERATED = fillCars(CAND_SEED);
export const CAND: Car[] = [...CAND_SEED, ...GENERATED, ...CAND_LATE];
/* UNIT_FLEET — รถทุกคันของหน่วยงานผู้สร้างแผน (FLEET = CAND ของ screens.js 10 คัน · 6 พ.ย. 2569 เจ้าของงาน "ต้องเอารถเข้า ไตรมาสทุกคัน")
   ลำดับใน CAND ตามลำดับ CAND ของ screens.js: CAND_SEED 7 คัน + CAND_LATE 3 คัน · ฟอร์มสร้างแผนเห็นและต้องจัดรถชุดนี้ทุกคัน (รถจำลองเพิ่ม 20 คันต่อประเภทไม่อยู่ในหน่วยงาน — BACKLOG ข้อ 21) */
export const UNIT_FLEET: number[] = [...CAND_SEED.map((_, i) => i), ...CAND_LATE.map((_, k) => CAND_SEED.length + GENERATED.length + k)];
/* หน่วยงานที่ใช้ flow นี้ (UNITS · PLAN_UNIT ของ screens.js 6 พ.ย. 2569 · ค่าสมมติ) — ผู้สร้างแผนและผู้ดำเนินการ = หน่วยงาน · กบค. ดูแผนทุกหน่วยงานอย่างเดียว */
export const UNITS = ["กกฟ.1", "กกฟ.2", "กรย.", "กบค."];   // 6 พ.ย. 2569 รอบ 2 "กบค จะทำแผนจะมีรถของ กฝช. ด้วย" ⇒ กบค. สร้างแผนได้อีกหน่วยงาน
export const PLAN_UNIT: Record<string, string> = { "MR Z7000004": "กกฟ.1", "MR Z7000001": "กกฟ.1", "MR Z7000002": "กกฟ.2", "MR Z7000003": "กรย.", "MR Z7100001": "กบค.", "MR Z6900011": "กรย." };
/* หน่วยงานเจ้าของแผน: แผนที่สร้างในต้นแบบเก็บ unit · แผนตัวอย่างใช้ PLAN_UNIT (MR Z7100001 = แผนของ กบค. ที่มีรถ กฝซ.) */
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
  : String(1 + (k * 7) % 28).padStart(2, "0") + "/" + String(1 + (k * 5) % 12).padStart(2, "0") + "/" + (2566 + (k % 3))), "14/10/2568", "ไม่มีข้อมูล", "ไม่มีข้อมูล"];   // CAND_LATE ตาม LAST_OIL ของ screens.js
export const OIL_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน"];

/* 6 พ.ย. 2569 เจ้าของงาน "ไตรเป็นตามปีปฎิทิน" (เดิมไตรมาส 1 = ต.ค.–ธ.ค. ตามปีงบ) · ป้ายช่อง "ปีงบประมาณ" คงเดิม */
export const QUARTERS = ["ไตรมาส 1 (ม.ค.–มี.ค.)", "ไตรมาส 2 (เม.ย.–มิ.ย.)", "ไตรมาส 3 (ก.ค.–ก.ย.)", "ไตรมาส 4 (ต.ค.–ธ.ค.)"];
/* YEARS — เจ้าของงาน "ไม่จำกัดปี" จำนวนปีที่แสดงยังไม่รู้ (Q31) */
export const YEARS = ["2568", "2569", "2570", "2571", "2572"];

/* PARTS — รายการ · รหัส · หมวด · จำนวนตามแผน · หน่วย · คงเหลือ · สถานะเมื่อจอง */
export interface Part { name: string; code: string; group: string; planQty: number; unit: string; stock: number; st: "ok" | "short" }
export const PARTS: Part[] = [
  { name: "น้ำมันไฮโดรลิก ISO VG 46", code: "OL-0011", group: "น้ำมัน", planQty: 60, unit: "ลิตร", stock: 420, st: "ok" },
  { name: "ไส้กรองไฮโดรลิก", code: "FL-0022", group: "ไส้กรอง", planQty: 12, unit: "ชิ้น", stock: 3, st: "short" },
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
export const RETURN_REASON = "จำนวนไส้กรองไฮโดรลิกไม่ตรงกับรอบบำรุงรักษาของกระเช้าแก้ไฟ กรุณาตรวจสอบยานพาหนะที่เลือกเข้าแผน";
/* ผู้สร้างแผน (CREATOR · 6 พ.ย. 2569 ผู้สร้างแผน = หน่วยงาน) — ช่อง "ผู้สร้างแผน" ของรายละเอียดแผน · "ผู้สร้าง" + บรรทัดรองหน่วยงาน ของรายการแผนรออนุมัติ */
export const PLAN_CREATOR = "นายวิชัย ทองดี (กกฟ.1)";
export const PLAN_CREATOR_SHORT = "นายวิชัย ทองดี";
/* ผู้สร้างแผน = ชื่อ (หน่วยงานเจ้าของแผน) — แผนของ กกฟ.1 = CREATOR ของ screens.js · แผนของหน่วยงานอื่นใส่หน่วยงานของแผนนั้น */
export const creatorOf = (p: Pick<Plan, "mr" | "unit">) => PLAN_CREATOR_SHORT + " (" + unitOf(p.mr, p.unit) + ")";

/* WH_LIST — แถวตัวอย่างของหน้า "แผนที่ต้องเตรียมอะไหล่" (S22 U.1 · whRow ใน screens.js) สำหรับแผนที่ไม่มีข้อมูลรับทราบจริง: วันที่อนุมัติ · จำนวนไตรมาสที่รับทราบ
   (จอ S22 คิด Z7000002 = รับทราบ 1/3 · Z7000001 = ครบ ต่างจากคอลัมน์คลังรับทราบของ S1 ที่ใช้ WH_ACK — ข้อมูลตัวอย่างของ screens.js คนละชุด) */
export const WH_LIST: Record<string, { approvedAt: string; acked: number }> = {
  "MR Z7000002": { approvedAt: "08/10/2569", acked: 1 },
  "MR Z7000001": { approvedAt: "06/10/2569", acked: 4 },
};

/* WH_ACK — จำนวนไตรมาสที่คลังรับทราบแล้วต่อเลขที่ MR (S22) */
export const WH_ACK: Record<string, number> = { "MR Z7000004": 1, "MR Z7000001": 2 };

/* MENU — เมนู "…" (core.js) */
export const MENU = [
  { Text: "ดูรายละเอียด", IconSwap: "quick_reference_all-24-300-round" },
  { Text: "แก้ไข", IconSwap: "stylus-24-300-round" },
  { Text: "ลบ", IconSwap: "delete-24-300-round" },
];
