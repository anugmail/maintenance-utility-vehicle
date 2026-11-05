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
export const PLANS: Plan[] = [
  P(["MR Z7000001", "บำรุงรักษารถกระเช้า ภาค 1 ปีงบประมาณ 2570", "ภาค 1 (เหนือ)", "ไตรมาส 1", "12", "active", "03/10/2569", "รถกระเช้า", "2570", "ไตรมาส 1: 6 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 1"]),
  P(["MR Z7000002", "บำรุงรักษารถเครน ภาค 2 ปีงบประมาณ 2570", "ภาค 2 (ตะวันออกเฉียงเหนือ)", "ไตรมาส 2", "8", "approved", "05/10/2569", "รถเครน", "2570", "ไตรมาส 1: 0 · ไตรมาส 2: 4 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MR Z7000003", "บำรุงรักษารถขุด ภาค 3 ปีงบประมาณ 2570", "ภาค 3 (กลาง)", "ไตรมาส 1", "6", "review", "17/10/2569", "รถขุด", "2570", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
  P(["MR Z7100001", "บำรุงรักษารถกระเช้า ภาค 4 ปีงบประมาณ 2571", "ภาค 4 (ใต้)", "ไตรมาส 1", "9", "returned", "12/10/2569", "รถกระเช้า", "2571", "ไตรมาส 1: 3 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MR Z6900011", "บำรุงรักษารถกระเช้า ภาค 1 ปีงบประมาณ 2569", "ภาค 1 (เหนือ)", "ไตรมาส 4", "10", "closed", "02/06/2568", "รถกระเช้า", "2569", "ไตรมาส 1: 3 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
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
/* ประเภทรถ — ชุดที่ใช้ในชื่อแผนของ PLANS (Q29 ยังไม่รู้ว่าทะเบียนรถชุดไหน) */
export const VEHICLE_TYPES = ["รถกระเช้า", "รถเครน", "รถขุด"];

export type CarStatus = "ok" | "repair" | "transfer" | "dispose";
export interface Car { plate: string; model: string; owner: string; status: CarStatus; type: string }
/* CAND_SEED — รถที่เข้าเงื่อนไข ภาค 2 + รถกระเช้า (ทะเบียน · ยี่ห้อ/รุ่น · หน่วยงานเจ้าของรถ · สถานะรถ) — ลำดับนี้ห้ามเปลี่ยน (plan.alloc อ้างลำดับใน CAND) */
const CAND_SEED: Car[] = [
  { plate: "82-6789 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", status: "ok", type: "รถกระเช้า" },
  { plate: "82-1145 ขอนแก่น", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 ขอนแก่น", status: "ok", type: "รถกระเช้า" },
  { plate: "82-3302 อุดรธานี", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 อุดรธานี", status: "ok", type: "รถกระเช้า" },
  { plate: "82-4410 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", status: "ok", type: "รถกระเช้า" },
  { plate: "83-1207 อุดรธานี", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟฉ.1 อุดรธานี", status: "repair", type: "รถกระเช้า" },
  { plate: "84-5521 นครราชสีมา", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟฉ.3 นครราชสีมา", status: "ok", type: "รถกระเช้า" },
  { plate: "85-0918 อุบลราชธานี", model: "Isuzu FTR + กระเช้า Aichi SH15A", owner: "กฟฉ.2 อุบลราชธานี", status: "ok", type: "รถกระเช้า" },
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
  "รถกระเช้า": ["Isuzu FTR + กระเช้า Aichi SK17A", "Hino FC + กระเช้า Tadano AT-100", "Isuzu FRR + กระเช้า Aichi SK10A", "Hino FG + กระเช้า Tadano AT-146", "Isuzu FTR + กระเช้า Aichi SH15A"],
  "รถเครน": ["Hino FM + เครน Tadano TM-ZE304", "Isuzu FVM + เครน Unic URV554", "Hino FG + เครน Tadano TM-ZE364", "Isuzu FXZ + เครน Unic URV1006"],
  "รถขุด": ["Komatsu PC70-8", "Hitachi ZX70-5G", "Kubota KX080-4", "Caterpillar 307.5"],
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
export const CAND: Car[] = [...CAND_SEED, ...fillCars(CAND_SEED)];
/* dCode — รหัสเขตของรถ จากหน่วยงานเจ้าของรถ */
export const dCode = (c: Car) => c.owner.split(" ")[0];
/* regionOf · shortRegion · uniq (screens.js 5 พ.ย. 2569) — ภาคของรถจากรหัสเขต · "ภาค 2 (ตะวันออกเฉียงเหนือ)" → "ภาค 2" */
export const regionOf = (c: Car) => REGIONS.find((r) => DISTRICTS[r].includes(dCode(c))) ?? "";
export const shortRegion = (r: string) => r.split(" (")[0];
export const uniq = <T,>(a: T[]) => [...new Set(a)];

/* LAST_OIL — เปลี่ยนน้ำมันครั้งล่าสุดตามลำดับ CAND · OIL_OPTS */
const LAST_OIL_SEED = ["12/03/2568", "12/03/2568", "05/02/2567", "20/11/2566", "ไม่มีข้อมูล", "18/06/2568", "09/01/2566"];
/* รถจำลองเพิ่ม: วันที่วนปี 2566–2568 · ทุก 11 คันไม่มีข้อมูล */
export const LAST_OIL = [...LAST_OIL_SEED, ...CAND.slice(LAST_OIL_SEED.length).map((_, k) => k % 11 === 5 ? "ไม่มีข้อมูล"
  : String(1 + (k * 7) % 28).padStart(2, "0") + "/" + String(1 + (k * 5) % 12).padStart(2, "0") + "/" + (2566 + (k % 3)))];
export const OIL_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน"];

export const QUARTERS = ["ไตรมาส 1 (ต.ค.–ธ.ค.)", "ไตรมาส 2 (ม.ค.–มี.ค.)", "ไตรมาส 3 (เม.ย.–มิ.ย.)", "ไตรมาส 4 (ก.ค.–ก.ย.)"];
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
export const RETURN_REASON = "จำนวนไส้กรองไฮโดรลิกไม่ตรงกับรอบบำรุงรักษาของรถกระเช้า กรุณาตรวจสอบรถที่เลือกเข้าแผน";
/* ผู้สร้างแผน — ช่อง "ผู้สร้างแผน" ของรายละเอียดแผน · "ผู้สร้าง (กบค.)" ของรายการแผนรออนุมัติ */
export const PLAN_CREATOR = "นายวิชัย ทองดี (กบค.)";
export const PLAN_CREATOR_SHORT = "นายวิชัย ทองดี";

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
