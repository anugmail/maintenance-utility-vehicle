"use client";
/* ข้อมูลจำลองของแผนจ้างดำเนินการ (ชุด C2: S23 ผู้รับจ้าง · S11 กบค. ตรวจรับ) — ค่าชุดเดียวกับปลั๊กอิน Figma (screens.js: HIRE_T · HIRE_* · WORK · JOB_*)
   ชื่อ type/ค่าคงที่ยกตรงจาก maintainance-yearly-specs/mock-data.ts (Tone · Pill · JobStatus · JOB_STATUS · Car · QUARTER_CARS · Trip · WorkItem · Job · JOB_TIMES · JOB_TEXT · JOB_SETS · …)
   ⇒ ตอนรวมกับ model งานรายคันของชุด C1 ให้ยุบส่วน "สำเนาจาก mock-data.ts" ข้างล่างเป็นที่เดียว แล้วเก็บเฉพาะส่วน "สถานะงานจ้าง" ของไฟล์นี้
   เก็บใน localStorage คีย์ mt-next-v1 (ฟิลด์ hire ของ MockState — ไม่แก้ store.ts · ล้างข้อมูลจำลองแล้วกลับค่าตั้งต้น) */
import { setMock, useMock, type MockState } from "./store";
import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";

/* ================= สำเนาจาก mock-data.ts (ชื่อและรูปเดียวกัน) ================= */
export type Tone = "Gray" | "Info" | "Success" | "Warning" | "Error" | "Brand";
export type Pill = readonly [label: string, tone: Tone];
export type Quarter = 1 | 2 | 3 | 4;
export const MENU_NAME = "บำรุงรักษาตามวาระ";

export type TripStatus = "review" | "approved" | "returned" | "sent" | "done";
export const TRIP_STATUS: Record<TripStatus, Pill> = {
  sent: ["ส่งแจ้งแล้ว", "Info"], done: ["ดำเนินการแล้ว", "Success"], review: ["รออนุมัติ", "Warning"], approved: ["อนุมัติแล้ว", "Success"], returned: ["ส่งกลับแก้ไข", "Error"],
};
export type JobStatus = "todo" | "doing" | "done" | "cannot" | "worked" | "reported" | "wait" | "returned";
export const JOB_STATUS: Record<JobStatus, Pill> = {   // WSTAT
  todo: ["ยังไม่เริ่ม", "Gray"], doing: ["อยู่ระหว่างบำรุงรักษา", "Warning"], done: ["เสร็จสิ้น", "Success"], cannot: ["บำรุงรักษาไม่ได้", "Error"],
  worked: ["ดำเนินการบำรุงรักษาแล้ว", "Info"], reported: ["แจ้งบำรุงรักษาไม่ได้", "Info"], wait: ["รอตรวจรับ", "Warning"], returned: ["ส่งกลับแก้ไข", "Error"],
};
export const OIL_TAG = { wait: ["รอผลตรวจน้ำมัน", "Warning"], fail: ["น้ำมันไม่ผ่าน", "Error"] } as const satisfies Record<string, Pill>;
export const OIL_JOB_OPTIONS = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน", "เก็บตัวอย่างและเปลี่ยน"];
export const oilSampled = (k: number) => k === 0 || k === 2;   // OIL_SAMPLED

export const PEOPLE = {
  planCreator: "นายวิชัย ทองดี (กบค.)",
  jobBy: "นายวิชัย ทองดี (กบค.)",
  vendorBy: "นายประเสริฐ ศรีสุข (ผู้รับจ้าง)",   // HIRE_BY
};

export interface Car {
  id: string; plate: string; model: string; ownerUnit: string; district: string;
  type: "รถกระเช้า"; vehicleStatus: "ok" | "repair" | "transfer" | "dispose"; ownerPhone?: string; lastOilChange?: string;
}
/** รถ 10 คันของไตรมาส 1 แผน MR Z7000001 (TRIP_CARS + OWNER_PH) */
export const QUARTER_CARS: Car[] = [
  { id: "82-6789", plate: "82-6789 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", ownerUnit: "กฟฉ.1 ขอนแก่น", district: "กฟฉ.1", type: "รถกระเช้า", vehicleStatus: "ok", lastOilChange: "12/03/2568", ownerPhone: "081-472-3365" },
  { id: "82-1145", plate: "82-1145 ขอนแก่น", model: "Hino FC + กระเช้า Tadano AT-100", ownerUnit: "กฟฉ.1 ขอนแก่น", district: "กฟฉ.1", type: "รถกระเช้า", vehicleStatus: "ok", lastOilChange: "12/03/2568", ownerPhone: "081-472-3365" },
  { id: "80-5738", plate: "80-5738 น่าน", model: "Isuzu FRR + กระเช้า Aichi SK10A", ownerUnit: "กฟน.2 น่าน", district: "กฟน.2", type: "รถกระเช้า", vehicleStatus: "repair", ownerPhone: "054-710-224" },
  { id: "81-2210", plate: "81-2210 เชียงใหม่", model: "Hino FG + กระเช้า Tadano AT-146", ownerUnit: "กฟน.1 เชียงใหม่", district: "กฟน.1", type: "รถกระเช้า", vehicleStatus: "transfer", ownerPhone: "053-241-560" },
  { id: "80-9981", plate: "80-9981 ลำปาง", model: "Isuzu FTR + กระเช้า Aichi SH15A", ownerUnit: "กฟน.1 ลำปาง", district: "กฟน.1", type: "รถกระเช้า", vehicleStatus: "ok", ownerPhone: "089-635-1172" },
  { id: "82-3302", plate: "82-3302 อุดรธานี", model: "Hino FC + กระเช้า Tadano AT-100", ownerUnit: "กฟฉ.1 อุดรธานี", district: "กฟฉ.1", type: "รถกระเช้า", vehicleStatus: "ok", lastOilChange: "05/02/2567", ownerPhone: "042-221-908" },
  { id: "82-7720", plate: "82-7720 ขอนแก่น", model: "Isuzu FTR + กระเช้า Aichi SK17A", ownerUnit: "กฟฉ.1 ขอนแก่น", district: "กฟฉ.1", type: "รถกระเช้า", vehicleStatus: "ok", ownerPhone: "043-246-118" },
  { id: "80-3316", plate: "80-3316 พะเยา", model: "Hino FC + กระเช้า Tadano AT-100", ownerUnit: "กฟน.1 พะเยา", district: "กฟน.1", type: "รถกระเช้า", vehicleStatus: "ok", ownerPhone: "054-411-737" },
  { id: "81-6604", plate: "81-6604 เชียงราย", model: "Isuzu FRR + กระเช้า Aichi SK10A", ownerUnit: "กฟน.1 เชียงราย", district: "กฟน.1", type: "รถกระเช้า", vehicleStatus: "ok", ownerPhone: "053-711-402" },
  { id: "80-4458", plate: "80-4458 แพร่", model: "Hino FG + กระเช้า Tadano AT-146", ownerUnit: "กฟน.2 แพร่", district: "กฟน.2", type: "รถกระเช้า", vehicleStatus: "ok", ownerPhone: "054-511-226" },
];
export const carOf = (id: string) => QUARTER_CARS.find((c) => c.id === id);
/** เลขไมล์บนหน้างานรายคัน — ค่าคงที่ของ screens.js ไม่ใช่รายคัน */
export const ODOMETER = { selfJob: { km: "182,400 กม.", hours: "6,120 ชม." }, hireJob: { km: "176,050 กม.", hours: "5,840 ชม." } };
/** เปลี่ยนน้ำมันครั้งล่าสุด บนหน้างาน/ปิดงาน = LAST_OIL[0] เสมอ (mock-data.md §6 ข้อ 3) */
export const LAST_OIL_JOB = "12/03/2568";

export interface Trip {
  id: string; planId: string; quarter: Quarter; name: string; mode: "self" | "hire";
  vendor?: string; contract?: string; carIds: string[];
  locs: Record<string, string>; phones: Record<string, string>;
  d1: string; d2: string; status: TripStatus; staff?: string[];
  createdBy: string; sentAt: string; approvedAt?: string; returnReason?: string;
}
/** TRIP_V ในสถานะอนุมัติแล้ว (HIRE_T = tripAs(TRIP_V, 'approved')) */
export const TRIP_V: Trip = {
  id: "TV", planId: "Z7000001", quarter: 1, name: "จ้างบำรุงรักษา น่าน เชียงใหม่ เชียงราย", mode: "hire", vendor: "บริษัท สยามไฮดรอลิก เซอร์วิส จำกัด", contract: "สจ.69-0142",
  carIds: ["80-5738", "81-2210", "82-7720", "80-3316", "81-6604", "80-4458"], locs: { "82-7720": "ศูนย์บริการผู้รับจ้าง สาขาขอนแก่น" }, phones: { "82-7720": "095-118-4420" },
  d1: "17/11/2569", d2: "21/11/2569", status: "approved", createdBy: PEOPLE.planCreator, sentAt: "03/11/2569",
};
export const PLAN_Z7000001 = { id: "Z7000001", mr: "MR Z7000001", name: "บำรุงรักษารถกระเช้า ภาค 1 ปีงบประมาณ 2570", quarter: "ไตรมาส 1" };
export const tripLoc = (t: Pick<Trip, "locs">, c: Car) => t.locs[c.id] || "สำนักงาน " + c.ownerUnit;
export const tripPhone = (t: Pick<Trip, "phones">, c: Car) => t.phones[c.id] || c.ownerPhone || "-";

export interface WorkItem { task: string; part: string; planQty: number; usedQty: number; unit: string; }
export const WORK: WorkItem[] = [
  { task: "เปลี่ยนน้ำมันไฮโดรลิก", part: "น้ำมันไฮโดรลิก ISO VG 46", planQty: 30, usedQty: 30, unit: "ลิตร" },
  { task: "เปลี่ยนไส้กรองไฮโดรลิก", part: "ไส้กรองไฮโดรลิก", planQty: 2, usedQty: 2, unit: "ชิ้น" },
  { task: "เปลี่ยนไส้กรองน้ำมันเครื่อง", part: "ไส้กรองน้ำมันเครื่อง", planQty: 2, usedQty: 2, unit: "ชิ้น" },
  { task: "เปลี่ยนไส้กรองอากาศ", part: "ไส้กรองอากาศ", planQty: 2, usedQty: 1, unit: "ชิ้น" },
];
export interface OilResult { sel: -1 | 0 | 1; files: { name: string; size: string }[]; sampledAt: string; savedAt?: string; }
export interface Job {
  tripId: string; carId: string; status: JobStatus;
  oilChoice?: 0 | 1 | 2;
  oil?: "wait" | "fail";
  oilResult?: OilResult;
  startedAt?: string; startedBy?: string; closedAt?: string; recordedBy?: string;
  kmAfter?: string; hoursAfter?: string;
  cannotReason?: string; reportedBy?: string; reportedAt?: string; usedWhenCannot?: number[];
  sentAt?: string; sentBy?: string; returnReason?: string;
}
export const JOB_TIMES = {
  hire: { start: "17/11/2569 09:10 น.", end: "17/11/2569 13:25 น.", sent: "17/11/2569 16:40 น.", sentCannot: "18/11/2569 08:50 น.", reported: "18/11/2569 08:35 น.", by: PEOPLE.vendorBy, kmAfter: "176,090 กม.", hoursAfter: "5,846 ชม." },
};
export const JOB_TEXT = {
  cannotHire: "กระบอกสูบไฮโดรลิกหลักรั่ว ต้องส่งซ่อมก่อนจึงบำรุงรักษาได้",   // HIRE_WHY
  usedWhenCannot: [30, 2, 0, 0],                                                // CANNOT_USED
  backDone: "จำนวนไส้กรองอากาศที่คืนไม่ตรงกับภาพอะไหล่ใหม่ที่เหลือ กรุณาตรวจนับและแก้จำนวนที่คืน",   // HIRE_BACK
  backCannot: "กรุณาระบุตำแหน่งที่รั่วและผลตรวจเบื้องต้นในสาเหตุให้ชัดเจน",                  // HIRE_BACK_CANNOT
};
export const JOB_SETS = {
  TV_vendor: { "80-5738": "returned", "81-2210": "wait", "82-7720": "worked", "80-3316": "doing" },   // HIRE_VENDOR (S23)
  TV_kbk: { "80-5738": "wait", "81-2210": "wait", "82-7720": "doing" },                               // HIRE_MIX (S11)
} satisfies Record<string, Record<string, JobStatus>>;
export const HIRE_DONE_CAR = "80-5738", HIRE_CANNOT_CAR = "81-2210";
export const BEFORE_PHOTOS = ["รูปรถ + ทะเบียน", "อะไหล่ใหม่"];   // BEFORE

/* Badge outline มี 5 สี — BADGE_OF ของ core.js (Info/Warning → Brand) */
export const BADGE_OF: Record<Tone, BadgeOutlineColor> = { Gray: "Gray", Info: "Brand", Success: "Success", Warning: "Brand", Error: "Error", Brand: "Brand" };
export const badgeOf = (p: Pill): [string, BadgeOutlineColor] => [p[0], BADGE_OF[p[1]]];

/* ================= สถานะงานจ้าง (ของชุด C2) ================= */
export interface FileRow { name: string; size: string }
/** Job + ส่วนที่ผู้รับจ้างแก้ได้ (อะไหล่ที่ใช้จริง · ภาพก่อนเริ่มงาน) + ผลตรวจรับ */
export interface HireJob extends Job {
  /** อะไหล่ของรถคันนี้: ตามแผน (planQty) + ใช้จริง (usedQty) · แถวที่ผู้รับจ้างเพิ่มเอง planQty 0 · คืน = planQty − usedQty */
  work: WorkItem[];
  /** รหัสอะไหล่ของแถวที่เพิ่มเอง (ถ้ามี) — คีย์ = ลำดับใน work */
  codes?: Record<number, string>;
  photos: FileRow[];
  reviewedAt?: string; reviewedBy?: string;
}
export interface HireState {
  /** แผนเดินทางจ้าง TV (กบค. แก้เบอร์/สถานที่ หรือเอารถออกได้) */
  trip: Trip;
  jobs: Record<string, HireJob>;
}
export type HireSample = "S23" | "S11";

const T = JOB_TIMES.hire;
const PHOTOS: FileRow[] = [{ name: "before-1.jpg", size: "2.4 MB" }, { name: "before-2.jpg", size: "2.4 MB" }];   // photoFiles() = jpg('before-1') …
const work = (used: "plan" | "actual" | "zero") => WORK.map((w) => ({ ...w, usedQty: used === "plan" ? w.planQty : used === "zero" ? 0 : w.usedQty }));

function jobFor(carId: string, st: JobStatus): HireJob {
  const base: HireJob = { tripId: "TV", carId, status: st, work: work("zero"), photos: [] };
  if (st === "todo") return base;
  const started = { startedAt: T.start, startedBy: T.by, oilChoice: 2 as const, photos: PHOTOS.map((p) => ({ ...p })) };
  if (st === "doing") return { ...base, ...started, work: work("plan") };
  const cannot = carId === HIRE_CANNOT_CAR;
  if (cannot) {
    return { ...base, status: st, cannotReason: JOB_TEXT.cannotHire, reportedBy: T.by, reportedAt: T.reported, usedWhenCannot: [0, 0, 0, 0],
      ...(st === "wait" ? { sentAt: T.sentCannot, sentBy: T.by } : {}),
      ...(st === "returned" ? { returnReason: JOB_TEXT.backCannot } : {}) };
  }
  return { ...base, ...started, status: st, closedAt: T.end, recordedBy: T.by, kmAfter: T.kmAfter, hoursAfter: T.hoursAfter, work: work("actual"),
    ...(st === "wait" ? { sentAt: T.sent, sentBy: T.by } : {}),
    ...(st === "returned" ? { returnReason: JOB_TEXT.backDone } : {}) };
}

/** ชุดตั้งต้น: S23 = มุมผู้รับจ้าง (HIRE_VENDOR) · S11 = มุม กบค. ก่อนตรวจรับ (HIRE_MIX) */
export function hireSeed(sample: HireSample): HireState {
  const set: Record<string, JobStatus> = sample === "S11" ? JOB_SETS.TV_kbk : JOB_SETS.TV_vendor;
  return { trip: { ...TRIP_V, locs: { ...TRIP_V.locs }, phones: { ...TRIP_V.phones }, carIds: [...TRIP_V.carIds] }, jobs: Object.fromEntries(TRIP_V.carIds.map((id) => [id, jobFor(id, set[id] ?? "todo")])) };
}

type Ext = MockState & { hire?: HireState };
export function useHire(): HireState {
  const s = useMock() as Ext;
  return s.hire ?? DEFAULT;
}
const DEFAULT = hireSeed("S23");
function write(fn: (h: HireState) => HireState) {
  setMock((s) => { const e = s as Ext; return { ...e, hire: fn(e.hire ?? hireSeed("S23")) } as MockState; });
}
export function applyHireSample(sample: HireSample) { write(() => hireSeed(sample)); }
export function updateJob(carId: string, fn: (j: HireJob) => HireJob) {
  write((h) => (h.jobs[carId] ? { ...h, jobs: { ...h.jobs, [carId]: fn(h.jobs[carId]) } } : h));
}
export function updateTrip(fn: (t: Trip) => Trip) { write((h) => ({ ...h, trip: fn(h.trip) })); }

/* ---------- ทางต่อกับหน้ารับรถ / ปิดงานของ S10 (ชุด C1 · /trips/job/receive/ · /trips/job/close/) ----------
   หน้าของ C1 เรียกเมื่อ trip.mode = "hire": เริ่มงานสำเร็จ → hireStarted · ปิดงานสำเร็จ (หรือแก้ไขงาน) → hireClosed แล้วกลับ /trips/hire/job/ */
export function hireStarted(carId: string) {
  updateJob(carId, (j) => ({ ...j, status: "doing", startedAt: T.start, startedBy: T.by, oilChoice: j.oilChoice ?? 2, cannotReason: undefined, reportedAt: undefined, reportedBy: undefined, usedWhenCannot: undefined,
    work: j.work.map((w) => ({ ...w, usedQty: w.planQty })) }));
}
export function hireClosed(carId: string, patch?: Partial<HireJob>) {
  updateJob(carId, (j) => ({ ...j, status: "worked", closedAt: j.closedAt ?? T.end, recordedBy: T.by, kmAfter: j.kmAfter ?? T.kmAfter, hoursAfter: j.hoursAfter ?? T.hoursAfter, ...patch }));
}

/* ---------- ตัวช่วยแสดงผล ---------- */
export const isCannotJob = (j: HireJob) => !!j.cannotReason;
/** jobWork(): เลือกเก็บตัวอย่างอย่างเดียว = ไม่มีแถวเปลี่ยนน้ำมัน (แถวแรก) */
export const jobWork = (j: HireJob) => j.work.map((w, k) => ({ w, k })).filter(({ k }) => k > 0 || j.oilChoice !== 0);
/** retRows(): ชื่ออะไหล่ · จำนวนตามแผน · จำนวนที่ใช้ · จำนวนที่คืน */
export const retCells = (w: WorkItem) => [w.part, w.planQty + " " + w.unit, w.usedQty + " " + w.unit, Math.max(0, w.planQty - w.usedQty) + " " + w.unit];
/** ความคืบหน้า (tripDetail): เสร็จสิ้น x จาก n คัน + ส่วนที่ไม่เป็นศูนย์ (ดำเนินการบำรุงรักษาแล้ว/แจ้งไม่ได้ไม่นับ) */
export function tripProgress(h: HireState) {
  const st = h.trip.carIds.map((id) => h.jobs[id]?.status ?? "todo");
  const cnt = (k: JobStatus) => st.filter((s) => s === k).length;
  return "เสร็จสิ้น " + cnt("done") + " จาก " + st.length + " คัน" + ([["doing", "อยู่ระหว่างบำรุงรักษา"], ["cannot", "บำรุงรักษาไม่ได้"], ["wait", "รอตรวจรับ"], ["returned", "ส่งกลับแก้ไข"]] as [JobStatus, string][])
    .map(([k, l]) => (cnt(k) ? " · " + l + " " + cnt(k) : "")).join("");
}
/** tripKv() แผนจ้าง 9 ช่อง */
export const tripKv = (t: Trip): [string, string][] => [
  ["ชื่อแผนเดินทาง", t.name], ["แผน", PLAN_Z7000001.mr + " " + PLAN_Z7000001.name], ["ไตรมาส", PLAN_Z7000001.quarter], ["รูปแบบดำเนินการ", "จ้างดำเนินการ"],
  ["ผู้รับจ้าง", t.vendor ?? "-"], ["เลขที่สัญญา/ใบสั่งจ้าง", t.contract || "-"], ["ช่วงวันทำงาน", t.d1 + " – " + t.d2], ["ผู้สร้าง", t.createdBy], ["วันที่ส่ง", t.sentAt],
];
export const fileSize = (bytes: number) => (bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(1) + " MB" : Math.max(1, Math.round(bytes / 1024)) + " KB");
