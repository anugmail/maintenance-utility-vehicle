import type { PillColor } from "@/components/vms/PillOutline";

export type PlanStatus = "review" | "returned" | "approved" | "active" | "closed";

export const PST: Record<PlanStatus, [string, PillColor]> = {
  review: ["รออนุมัติ", "Warning"],
  returned: ["ส่งกลับแก้ไข", "Error"],
  approved: ["อนุมัติแล้ว", "Brand"],
  active: ["ดำเนินการ", "Info"],
  closed: ["ปิดงานแล้ว", "Gray"],
};

export interface Plan {
  mr: string;
  name: string;
  region: string;
  nowQ: string;
  cars: number;
  status: PlanStatus;
  created: string;
  type: string;
  year: string;
  perQ: string;
  regions?: string[];
  districts?: string[];
  types?: string[];
  alloc?: Record<number, number>;
  picks?: Record<number, number[]>;
  qty?: Record<number, Record<number, number>>;
  manual?: Record<number, ManualPart[]>;
  oils?: Record<number, number>;
  oilSpec?: Record<number, OilSpec>;
  sentAt?: string;
  approvedAt?: string;
  returnReason?: string;
  ack?: Record<number, string>;
  draw?: Record<number, "none">;
  unit?: string;
}

export interface ManualPart { name: string; code: string; qty: number; brand?: string; model?: string; unit?: string; price?: string }
export const OIL_PLAN_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน", "เก็บตัวอย่างและเปลี่ยน"];
export const OIL_GRADES = ["ISO VG 32", "ISO VG 46", "ISO VG 68"];
export interface OilSpec { grade: string; code: string; litre: string }
export const OIL_SPEC: OilSpec = { grade: "ISO VG 46", code: "OL-0011", litre: "30" };
export const oilChanges = (k?: number | null) => k === 1 || k === 2;
export const PART_BM: [string, string][] = [["PTT", "Hydraulic AW 46"], ["Donaldson", "P550388"], ["Sakura", "C-1809"], ["Sakura", "A-1033"], ["Isuzu", "8-98159693-0"]];

const P = (a: [string, string, string, string, string, PlanStatus, string, string, string, string]): Plan =>
  ({ mr: a[0], name: a[1], region: a[2], nowQ: a[3], cars: Number(a[4]), status: a[5], created: a[6], type: a[7], year: a[8], perQ: a[9] });

export const PLANS: Plan[] = [
  P(["MRZ7000001", "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 และภาค 2 ปีงบประมาณ 2570", "ภาค 1, ภาค 2", "ไตรมาส 1", "16", "active", "03/10/2569", "กระเช้าแก้ไฟ", "2570", "ไตรมาส 1: 10 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 1"]),
  P(["MRZ7000002", "บำรุงรักษารถพ่วงฉีดน้ำ ภาค 2 ปีงบประมาณ 2570", "ภาค 2 (ตะวันออกเฉียงเหนือ)", "ไตรมาส 2", "8", "approved", "05/10/2569", "รถพ่วงฉีดน้ำ", "2570", "ไตรมาส 1: 0 · ไตรมาส 2: 4 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MRZ7000003", "บำรุงรักษากระเช้าฮอทไลน์ ภาค 3 ปีงบประมาณ 2570", "ภาค 3 (กลาง)", "ไตรมาส 1", "6", "review", "17/10/2569", "กระเช้าฮอทไลน์", "2570", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
  P(["MRZ7100001", "บำรุงรักษากระเช้าแก้ไฟ ภาค 4 ปีงบประมาณ 2571", "ภาค 4 (ใต้)", "ไตรมาส 1", "9", "returned", "12/10/2569", "กระเช้าแก้ไฟ", "2571", "ไตรมาส 1: 3 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MRZ6900011", "บำรุงรักษากระเช้าแก้ไฟ ภาค 1 ปีงบประมาณ 2569", "ภาค 1 (เหนือ)", "ไตรมาส 4", "10", "closed", "02/06/2568", "กระเช้าแก้ไฟ", "2569", "ไตรมาส 1: 3 · ไตรมาส 2: 3 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MRZ6900012", "บำรุงรักษายานพาหนะ กบผ. ปีงบประมาณ 2569", "ภาค 1, ภาค 2", "ไตรมาส 4", "9", "closed", "05/06/2568", "กระเช้าแก้ไฟ", "2569", "ไตรมาส 1: 3 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 2"]),
  P(["MRZ7100002", "บำรุงรักษายานพาหนะ กปส. ปีงบประมาณ 2571", "ภาค 3, ภาค 4", "ไตรมาส 1", "7", "review", "15/10/2569", "กระเช้าฮอทไลน์, รถพ่วงฉีดน้ำ", "2571", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 2 · ไตรมาส 4: 1"]),
  P(["MRZ7100003", "บำรุงรักษากระเช้าฮอทไลน์ กรย. ปีงบประมาณ 2571", "ภาค 3 (กลาง)", "ไตรมาส 1", "6", "approved", "20/10/2569", "กระเช้าฮอทไลน์", "2571", "ไตรมาส 1: 2 · ไตรมาส 2: 2 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
  P(["MRZ7100004", "บำรุงรักษากระเช้าแก้ไฟ กบค. ปีงบประมาณ 2571", "ภาค 4 (ใต้)", "ไตรมาส 1", "5", "approved", "22/10/2569", "กระเช้าแก้ไฟ", "2571", "ไตรมาส 1: 2 · ไตรมาส 2: 1 · ไตรมาส 3: 1 · ไตรมาส 4: 1"]),
];

export const NEW_PLAN_DATE = "30/10/2569";

export const HQ_REGION = "สนง. (สำนักงานใหญ่)";
export const REGIONS = ["ภาค 1 (เหนือ)", "ภาค 2 (ตะวันออกเฉียงเหนือ)", "ภาค 3 (กลาง)", "ภาค 4 (ใต้)", HQ_REGION];
export const DISTRICTS: Record<string, string[]> = {
  [REGIONS[0]]: ["กฟน.1", "กฟน.2", "กฟน.3"],
  [REGIONS[1]]: ["กฟฉ.1", "กฟฉ.2", "กฟฉ.3"],
  [REGIONS[2]]: ["กฟก.1", "กฟก.2", "กฟก.3"],
  [REGIONS[3]]: ["กฟต.1", "กฟต.2", "กฟต.3"],
  [HQ_REGION]: ["กบค.", "กรย.", "กบผ.", "กปส.", "กส.1", "กส.2"],
};
export const VEHICLE_TYPES = ["กระเช้าฮอทไลน์", "กระเช้าแก้ไฟ", "รถพ่วงฉีดน้ำ"];
export const typeOf = (model: string) => /ฉีดน้ำ/.test(model) ? VEHICLE_TYPES[2] : /Tadano/.test(model) ? VEHICLE_TYPES[0] : VEHICLE_TYPES[1];
export const machineOf = (model: string): { vehicle: string; brand: string; model: string } => {
  const [vehicle, rest] = model.split(" + ");
  if (!rest) return { vehicle: model, brand: "-", model: "-" };
  const m = rest.match(/^\S*[\u0E00-\u0E7F]\S*\s+([A-Za-z][\w.-]*)\s+(.+)$/);
  return m ? { vehicle, brand: m[1], model: m[2] } : { vehicle, brand: "-", model: rest };
};

export type CarStatus = "ok" | "repair" | "transfer" | "dispose";
export interface Car { plate: string; model: string; owner: string; status: CarStatus; type: string }
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
const CARS_PER_TYPE = 20;
const PROVINCES: Record<string, string[]> = {
  "กฟน.1": ["เชียงใหม่", "ลำพูน", "เชียงราย"], "กฟน.2": ["ลำปาง", "แพร่", "น่าน"], "กฟน.3": ["นครสวรรค์", "ลพบุรี", "พิจิตร"],
  "กฟฉ.1": ["ขอนแก่น", "อุดรธานี", "หนองคาย"], "กฟฉ.2": ["อุบลราชธานี", "ร้อยเอ็ด", "ยโสธร"], "กฟฉ.3": ["นครราชสีมา", "บุรีรัมย์", "ชัยภูมิ"],
  "กฟก.1": ["พระนครศรีอยุธยา", "สระบุรี", "ปทุมธานี"], "กฟก.2": ["ชลบุรี", "ระยอง", "ฉะเชิงเทรา"], "กฟก.3": ["นครปฐม", "ราชบุรี", "สุพรรณบุรี"],
  "กฟต.1": ["เพชรบุรี", "ประจวบคีรีขันธ์", "ชุมพร"], "กฟต.2": ["นครศรีธรรมราช", "สุราษฎร์ธานี", "พัทลุง"], "กฟต.3": ["สงขลา", "ตรัง", "ยะลา"],
  "กบค.": ["กรุงเทพมหานคร"], "กรย.": ["กรุงเทพมหานคร"], "กบผ.": ["กรุงเทพมหานคร"], "กปส.": ["กรุงเทพมหานคร"], "กส.1": ["กรุงเทพมหานคร"], "กส.2": ["กรุงเทพมหานคร"],
};
const MODELS: Record<string, string[]> = {
  [VEHICLE_TYPES[0]]: ["Hino FC + กระเช้า Tadano AT-100", "Hino FG + กระเช้า Tadano AT-146"],
  [VEHICLE_TYPES[1]]: ["Isuzu FTR + กระเช้า Aichi SK17A", "Isuzu FRR + กระเช้า Aichi SK10A", "Isuzu FTR + กระเช้า Aichi SH15A"],
  [VEHICLE_TYPES[2]]: ["Hino FM + ถังฉีดน้ำ 6,000 ลิตร"],
};
const fillCars = (seed: Car[], regions: string[], districts?: string[], noSeed = 0): Car[] => VEHICLE_TYPES.flatMap((type, t) => regions.map((region) => [region, REGIONS.indexOf(region)] as const).flatMap(([region, r]) => {
  const ds = districts ?? DISTRICTS[region];
  const have = seed.filter((c) => c.type === type && ds.includes(c.owner.split(" ")[0])).length;
  return Array.from({ length: Math.max(0, CARS_PER_TYPE - have) }, (_, k) => {
    const d = ds[k % ds.length], prov = PROVINCES[d][Math.floor(k / ds.length) % PROVINCES[d].length];
    const no = String(1000 + ((k * 397 + r * 131 + t * 53 + noSeed) % 9000));
    return { plate: [60, 70, 90][t] + r + "-" + no + " " + prov, model: MODELS[type][k % MODELS[type].length], owner: d + " " + prov, status: k % 9 === 4 ? "repair" : "ok", type };
  });
}));
const CAND_LATE: Car[] = [
  car("80-5738 น่าน", "Isuzu FRR + กระเช้า Aichi SK10A", "กฟน.2 น่าน", "repair"),
  car("81-2210 เชียงใหม่", "Hino FG + กระเช้า Tadano AT-146", "กฟน.1 เชียงใหม่", "ok"),
  car("82-9012 ขอนแก่น", "Hino FM + ถังฉีดน้ำ 6,000 ลิตร", "กฟฉ.2 ขอนแก่น", "ok"),
];
const GENERATED = fillCars(CAND_SEED, REGIONS.filter((r) => r !== HQ_REGION));
const GENERATED_HQ = fillCars([], [HQ_REGION], ["กบผ.", "กปส."]);
const GENERATED_HQ2 = fillCars([], [HQ_REGION], ["กบค.", "กรย.", "กส.1", "กส.2"], 4500);
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
export const FIG_EXTRA_IDS = new Set(CAND_FIG.map((c) => c.plate.split(" ")[0]));
export const FIG_FLEET: number[] = [...CAND_SEED.map((_, i) => i), ...CAND_LATE.map((_, k) => CAND_SEED.length + GENERATED.length + k)];
export const UNIT_FLEET: number[] = CAND.map((_, i) => i).filter((i) => i < FIG_FROM || i >= FIG_FROM + CAND_FIG.length);
export const UNITS = ["กบผ.", "กปส.", "กรย.", "กบค.", "กส.1", "กส.2"];
export const PLAN_UNIT: Record<string, string> = { "MRZ7000004": "กบผ.", "MRZ7000001": "กบผ.", "MRZ7000002": "กปส.", "MRZ7000003": "กรย.", "MRZ7100001": "กบค.", "MRZ6900012": "กบผ.", "MRZ7100002": "กปส.", "MRZ6900011": "กรย.", "MRZ7100003": "กรย.", "MRZ7100004": "กบค." };
export const unitOf = (mr: string, unit?: string) => unit ?? PLAN_UNIT[mr] ?? UNITS[0];
export const dCode = (c: Car) => c.owner.split(" ")[0];
export const regionOf = (c: Car) => REGIONS.find((r) => DISTRICTS[r].includes(dCode(c))) ?? "";
export const shortRegion = (r: string) => r.split(" (")[0];
export const uniq = <T,>(a: T[]) => [...new Set(a)];

const LAST_OIL_SEED = ["12/03/2568", "12/03/2567", "05/02/2567", "20/11/2566", "ไม่มีข้อมูล", "18/06/2568", "09/01/2566"];
export const LAST_OIL = [...LAST_OIL_SEED, ...GENERATED.map((_, k) => k % 11 === 5 ? "ไม่มีข้อมูล"
  : String(1 + (k * 7) % 28).padStart(2, "0") + "/" + String(1 + (k * 5) % 12).padStart(2, "0") + "/" + (2566 + (k % 3))), "14/10/2568", "ไม่มีข้อมูล", "ไม่มีข้อมูล",
  ...GENERATED_HQ.map((_, k) => String(1 + (k * 7) % 28).padStart(2, "0") + "/" + String(1 + (k * 5) % 12).padStart(2, "0") + "/" + (2566 + (k % 3))),
  "10/01/2569", "18/06/2567", "05/02/2567", "20/09/2569", "01/10/2566", ...Array(7).fill("ไม่มีข้อมูล"),
  ...GENERATED_HQ2.map((_, k) => k % 11 === 3 ? "ไม่มีข้อมูล" : String(1 + (k * 5) % 28).padStart(2, "0") + "/" + String(1 + (k * 7) % 12).padStart(2, "0") + "/" + (2566 + (k % 3)))];
export const OIL_OPTS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน"];

export const QUARTERS = ["ไตรมาส 1 (ม.ค.–มี.ค.)", "ไตรมาส 2 (เม.ย.–มิ.ย.)", "ไตรมาส 3 (ก.ค.–ก.ย.)", "ไตรมาส 4 (ต.ค.–ธ.ค.)"];
export const YEARS = ["2568", "2569", "2570", "2571", "2572"];

export interface Part { name: string; code: string; group: string; planQty: number; unit: string; stock: number; st: "ok" | "short" }
export const PARTS: Part[] = [
  { name: "น้ำมันไฮดรอลิก ISO VG 46", code: "OL-0011", group: "น้ำมัน", planQty: 60, unit: "ลิตร", stock: 420, st: "ok" },
  { name: "ไส้กรองไฮดรอลิก", code: "FL-0022", group: "ไส้กรอง", planQty: 12, unit: "ชิ้น", stock: 3, st: "short" },
  { name: "ไส้กรองน้ำมันเครื่อง", code: "FL-0031", group: "ไส้กรอง", planQty: 12, unit: "ชิ้น", stock: 40, st: "ok" },
  { name: "ไส้กรองอากาศ", code: "FL-0040", group: "ไส้กรอง", planQty: 12, unit: "ชิ้น", stock: 60, st: "ok" },
  { name: "ไส้กรองเชื้อเพลิง", code: "FL-0052", group: "ไส้กรอง", planQty: 4, unit: "ชิ้น", stock: 1, st: "short" },
];
export const CAR_QTY = [30, 2, 2, 2, 2];
export const CAR_PICK = [1, 2, 3];

export const PART_WH = ["Smart Inventory", "Smart Inventory", "Smart Inventory", "คลังสำรอง", "คลังสำรอง"];
export const PART_PRICE = [120, 680, 250, 420, 350];

export const RETURN_REASON = "จำนวนไส้กรองไฮดรอลิกไม่ตรงกับรอบบำรุงรักษาของกระเช้าแก้ไฟ กรุณาตรวจสอบยานพาหนะที่เลือกเข้าแผน";
export const PLAN_CREATOR = "นายวิชัย ทองดี (กบผ.)";
export const PLAN_CREATOR_SHORT = "นายวิชัย ทองดี";
export const UNIT_PERSONA: Record<string, string> = { "กบผ.": "นายวิชัย ทองดี", "กปส.": "นายอนุชา บุญมา", "กรย.": "นางสาวพิมพ์ชนก ศรีสุข", "กส.1": "นายสมศักดิ์ แก้วมณี", "กส.2": "นางสาวกนกวรรณ ใจดี" };
export const creatorName = (p: Pick<Plan, "mr" | "unit">) => UNIT_PERSONA[unitOf(p.mr, p.unit)] ?? PLAN_CREATOR_SHORT;
export const creatorOf = (p: Pick<Plan, "mr" | "unit">) => creatorName(p) + " (" + unitOf(p.mr, p.unit) + ")";

export const MENU = [
  { Text: "ดูรายละเอียด", IconSwap: "quick_reference_all-24-300-round" },
  { Text: "แก้ไข", IconSwap: "stylus-24-300-round" },
  { Text: "ลบ", IconSwap: "delete-24-300-round" },
];
