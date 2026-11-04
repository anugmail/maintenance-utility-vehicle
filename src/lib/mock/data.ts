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
}

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
/* CAND — รถที่เข้าเงื่อนไข ภาค 2 + รถกระเช้า (ทะเบียน · ยี่ห้อ/รุ่น · หน่วยงานเจ้าของรถ · สถานะรถ) */
export const CAND: Car[] = [
  { plate: "82-6789 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", status: "ok", type: "รถกระเช้า" },
  { plate: "82-1145 ขอนแก่น", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 ขอนแก่น", status: "ok", type: "รถกระเช้า" },
  { plate: "82-3302 อุดรธานี", model: "Hino FC + กระเช้า Tadano AT-100", owner: "กฟฉ.1 อุดรธานี", status: "ok", type: "รถกระเช้า" },
  { plate: "82-4410 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", owner: "กฟฉ.1 ขอนแก่น", status: "ok", type: "รถกระเช้า" },
  { plate: "83-1207 อุดรธานี", model: "Isuzu FRR + กระเช้า Aichi SK10A", owner: "กฟฉ.1 อุดรธานี", status: "repair", type: "รถกระเช้า" },
  { plate: "84-5521 นครราชสีมา", model: "Hino FG + กระเช้า Tadano AT-146", owner: "กฟฉ.3 นครราชสีมา", status: "ok", type: "รถกระเช้า" },
  { plate: "85-0918 อุบลราชธานี", model: "Isuzu FTR + กระเช้า Aichi SH15A", owner: "กฟฉ.2 อุบลราชธานี", status: "ok", type: "รถกระเช้า" },
];
/* dCode — รหัสเขตของรถ จากหน่วยงานเจ้าของรถ */
export const dCode = (c: Car) => c.owner.split(" ")[0];

/* LAST_OIL — เปลี่ยนน้ำมันครั้งล่าสุดตามลำดับ CAND · OIL_OPTS */
export const LAST_OIL = ["12/03/2568", "12/03/2568", "05/02/2567", "20/11/2566", "ไม่มีข้อมูล", "18/06/2568", "09/01/2566"];
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

/* WH_ACK — จำนวนไตรมาสที่คลังรับทราบแล้วต่อเลขที่ MR (S22) */
export const WH_ACK: Record<string, number> = { "MR Z7000004": 1, "MR Z7000001": 2 };

/* MENU — เมนู "…" (core.js) */
export const MENU = [
  { Text: "ดูรายละเอียด", IconSwap: "quick_reference_all-24-300-round" },
  { Text: "แก้ไข", IconSwap: "stylus-24-300-round" },
  { Text: "ลบ", IconSwap: "delete-24-300-round" },
];
