/* ตัวเลขของแดชบอร์ด S24 แบบ VMS+ (12 พ.ย. 2569) — คิดจากข้อมูลเดิมของหน้า (MaCar ของ lib/mock/maintenance.ts) ไม่เพิ่มแหล่งข้อมูลใหม่
   วันอ้างอิง = MA_TODAY (10/11/2569 ค่าคงที่ของต้นแบบ) · "ปีนี้" = ปี พ.ศ. ของ MA_TODAY (ปีปฏิทิน)
   สถานะกำหนดบำรุงรักษา = ครั้งถัดไป (c.next) ปกติ / ใกล้ครบ (ภายใน 6 เดือน) / เลยกำหนด · ยังไม่มีข้อมูล = ไม่มีบันทึกการบำรุงรักษา
   กำหนด 12 เดือนข้างหน้า = วันครบรอบบำรุงรักษา (MA_ITEMS[0]) และวันครบเปลี่ยนน้ำมันไฮดรอลิก (MA_ITEMS[2]) รายเดือน + แท่ง "เลยกำหนด" */
import { MA_TODAY, TODAY, dayOf, oilChangeOf, type MaCar } from "@/lib/mock/maintenance";

export const YEAR = Number(MA_TODAY.slice(6));
const YEAR_END = Date.UTC(YEAR - 543, 11, 31);
const TH_MON = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
/** "10/11/2569" → "10 พ.ย. 2569" */
export const longDate = (s: string) => { const [d, m, y] = s.split("/"); return Number(d) + " " + TH_MON[Number(m) - 1] + " " + y; };

/* ---------- สถานะกำหนดบำรุงรักษา ---------- */
export const DUE_ST = ["ปกติ", "ใกล้ครบกำหนด", "เลยกำหนด", "ยังไม่มีข้อมูล"] as const;
export const dueOf = (c: MaCar): string => (!c.next ? DUE_ST[3] : c.next.status === "over" ? DUE_ST[2] : c.next.status === "near" ? DUE_ST[1] : DUE_ST[0]);

/* ---------- อายุการใช้งาน ---------- */
export const ageOf = (c: MaCar) => (c.year ? YEAR - c.year : undefined);
const AGE_BANDS: [string, number, number][] = [["0–3 ปี", 0, 3], ["4–6 ปี", 4, 6], ["7–10 ปี", 7, 10], ["11–15 ปี", 11, 15], ["16 ปีขึ้นไป", 16, Infinity]];
export const NO_AGE = "ไม่มีข้อมูล";
export const AGE_GROUPS = [...AGE_BANDS.map((b) => b[0]), NO_AGE];
export const ageGroup = (c: MaCar) => { const a = ageOf(c); return a == null ? NO_AGE : AGE_BANDS.find(([, lo, hi]) => a >= lo && a <= hi)?.[0] ?? NO_AGE; };

/* ---------- เขต (รหัสหน้าชื่อหน่วยงาน "กฟฉ.1 ขอนแก่น" → "กฟฉ.1") ---------- */
export const zoneOf = (c: MaCar) => c.car.owner.split(" ")[0];

/* ---------- กำหนด 12 เดือนข้างหน้า ---------- */
const mk = (t: number) => { const d = new Date(t); return d.getUTCFullYear() * 12 + d.getUTCMonth(); };
const M0 = mk(TODAY);
export const OVER = "over";
export const MONTH_KEYS = [OVER, ...Array.from({ length: 12 }, (_, i) => String(M0 + i))];
export const monthLabel = (k: string) => (k === OVER ? "เลยกำหนด" : TH_MON[Number(k) % 12] + " " + String((Math.floor(Number(k) / 12) + 543) % 100).padStart(2, "0"));
const bucket = (t?: number) => (t == null ? undefined : t < TODAY ? OVER : mk(t) - M0 < 12 ? String(mk(t)) : undefined);
/** [รอบบำรุงรักษา, เปลี่ยนน้ำมันไฮดรอลิก] ของยานพาหนะคันนั้นตกเดือนไหน */
export const monthsOf = (c: MaCar) => [bucket(c.items[0]?.due), bucket(oilChangeOf(c)?.due)];
export const monthMatch = (c: MaCar, k: string) => monthsOf(c).includes(k);

/* ---------- การ์ดตัวเลข ---------- */
export const maintainedThisYear = (c: MaCar) => !!c.latest && Number(c.latest.date.slice(6, 10)) === YEAR;
export const oilChangeThisYear = (c: MaCar) => { const d = oilChangeOf(c)?.due; return d != null && d <= YEAR_END; };
export const avgAge = (cs: MaCar[]) => { const a = cs.map(ageOf).filter((x): x is number => x != null); return a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1) : "-"; };
export const YEAR_END_TEXT = "31/12/" + YEAR;

/* ---------- เรียงตาราง (คอลัมน์ MA_COLS) ---------- */
const INF = Number.MAX_SAFE_INTEGER;
export const SORT_KEY: ((c: MaCar) => string | number)[] = [
  (c) => c.car.plate, (c) => ageOf(c) ?? INF, (c) => (c.latest ? dayOf(c.latest.date) : INF), (c) => c.next?.due ?? INF,
  (c) => c.result ?? "", (c) => c.war, (c) => c.vstat, (c) => oilChangeOf(c)?.due ?? INF,
];
export function sortCars(cs: MaCar[], s: { col: number; dir: "Down" | "Up" } | null) {
  if (!s) return cs;
  const k = SORT_KEY[s.col], m = s.dir === "Down" ? 1 : -1;
  return [...cs].sort((a, b) => { const x = k(a), y = k(b); return m * (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "th")); });
}
