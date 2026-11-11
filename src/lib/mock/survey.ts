"use client";
/* S27 ประเมินความพึงพอใจการให้บริการของ กบค. — หน้าแยก (/satisfaction/) แบบเดียวกับ "ประเมินผู้รับจ้าง" (contractor-eval-plugin) · BACKLOG ข้อ 66 66ก · R94
   ที่มาเนื้อหา: แบบสำรวจ "VMS+" ของ กบค. ในระบบจัดการแบบฟอร์ม XCHO 5 ขั้น (หน่วยงาน ผซก.1 กบค. ฝบร. ผชก.(ป-บส)) — ไฟล์ VMS+ _ Xcho-1.pdf … -5.pdf ที่เจ้าของงานส่ง
   เจ้าของงาน 11 พ.ย. 2569: _"ใช่ ประเมินแทน S13 หลังบำรุงรักษาเสร็จ"_ → รอบต่อมา _"แบบประเมินความพอใจ น่าจะเป็นเรื่องนี้ ที่ให้เอาของที่ส่งไป ทำเป็นอีก 1 view"_
     + เคาะ: ย้ายออกจาก S13 ไปอยู่ view ใหม่ (S13 รับทราบอย่างเดียว · รับทราบแล้วเข้าแท็บ "ยังไม่ได้ประเมิน") · 1 แถว = ยานพาหนะ 1 คันที่บำรุงรักษาเสร็จ · ผู้ประเมิน = ผู้ดูแลยานพาหนะ (R89)
   ข้อความหัวข้อ/คำถาม/สเกล ลอกจากแบบสำรวจตรงตัว (รวม "ผู้ใช้รถฯ" "ทะเบียนรถ" — ALLOW ของ check-wording) · ทุกข้อมี * ⇒ บังคับทุกข้อ
   คะแนน: ข้อละ 1–5 ดาว (component Rating แบบประเมินผู้รับจ้าง) · ด้านละ 10 / 20 / 15 / 10 · รวมเต็ม 55 (11 ข้อ × 5 · ไม่แปลงเป็นร้อย)
   ตรงกับ SAT_* ใน figma-export/maintainance-plugin/screens.js ของรีโป Maintenance-Request-Form (บล็อก Y) */
import { ACK_AT, acceptSample, accRows, splitBy, type AccRow } from "./acceptance";
import { carOf, patchJob, tripCtrl } from "./jobs";
import type { MockState } from "./store";

/** ข้อมูลผู้ใช้รถฯ — เติมจากยานพาหนะและผู้ดูแลยานพาหนะ (อ่านอย่างเดียว) */
export const SURVEY_INFO_TITLE = "ข้อมูลผู้ใช้รถฯ";
export const SURVEY_INFO = ["ทะเบียนรถ", "ชื่อผู้ตอบแบบสอบถาม", "นามสกุลผู้ตอบแบบสอบถาม", "ตำแหน่ง ผู้ตอบแบบสอบถาม", "สังกัด"] as const;
/** คำอธิบายสเกล (ตรงตัวตามแบบสำรวจ) */
export const SURVEY_SCALE = "โดย 1 คือคะแนนแย่สุด และ 5 คือคะแนนดีสุด";
/** 4 ด้าน รวม 11 ข้อ (2 + 4 + 3 + 2) · ไอคอนด้าน = Featured icon แบบหัวหมวดของประเมินผู้รับจ้าง (ไอคอนที่ปลั๊กอินนำเข้าได้) */
export const SURVEY_GROUPS: { title: string; items: string[]; icon: string }[] = [
  { title: "ด้านระบบการให้บริการ", items: ["ความรวดเร็วในการรับบริการ", "ความสะดวกในการติดต่อเพื่อขอรับบริการ"], icon: "call-24-300-round" },
  { title: "ด้านเจ้าหน้าที่และ/หรือผู้ให้บริการ", items: ["อัธยาศัยของผู้ให้บริการ", "ความรู้ของผู้ให้บริการ", "การให้ความรู้และคำแนะนำแก่ผู้รับบริการ", "ความตั้งใจในการดำเนินการให้ผู้รับบริการ"], icon: "groups-24-300-round" },
  { title: "ด้านคุณภาพของสินค้าและ/หรือบริการ", items: ["คุณภาพของอะไหล่และการบริการ", "ระยะเวลาในการได้รับอะไหล่และการบริการ", "อุปกรณ์ เครื่องมือและเทคโนโลยีในการให้บริการ"], icon: "car_repair-24-300-round" },
  { title: "ด้านสภาพแวดล้อมต่างๆ", items: ["การทำความสะอาดพื้นที่หลังการให้บริการ", "การทำความสะอาดเครื่องจักรกลหลังการให้บริการ"], icon: "search_check-24-300-round" },
];
export const SURVEY_COUNT = SURVEY_GROUPS.reduce((n, g) => n + g.items.length, 0);   // 11
export const SURVEY_MAX = SURVEY_COUNT * 5;   // 55
export const SURVEY_START = SURVEY_GROUPS.map((_, i) => SURVEY_GROUPS.slice(0, i).reduce((n, g) => n + g.items.length, 0));

/* ---------- ข้อความหน้าจอ (ตาม listScreen/evalForm/resultScreen ของ contractor-eval-plugin ปรับคำเป็นเรื่องนี้ · satList/satForm/satResult ของ screens.js) ---------- */
export const SAT_TITLE = "ประเมินความพึงพอใจ";
export const SAT_TABS = ["ยังไม่ได้ประเมิน", "ประเมินแล้ว"] as const;
export const SAT_EMPTY = ["ไม่มีรายการที่ต้องประเมิน", "ยานพาหนะที่บำรุงรักษาเสร็จจะเข้ามาที่นี่เมื่อผู้ดูแลยานพาหนะรับทราบผลการบำรุงรักษาแล้ว"] as const;
export const SAT_EMPTY_BTN = "ดูรายการที่ประเมินแล้ว";
export const SAT_ALERT = ["ให้คะแนนทุกข้อ 1 ถึง 5 ดาว", SURVEY_SCALE + " · คะแนนรวมเต็ม " + SURVEY_MAX + " (" + SURVEY_COUNT + " ข้อ × 5) · หมายเหตุไม่บังคับ"] as const;
export const SAT_REMARK = "หมายเหตุ/ข้อเสนอแนะเพิ่มเติม";
export const SAT_CONFIRM = (plate: string, sum: number) => ({ title: "ยืนยันการประเมิน", sub: "คุณต้องการบันทึกการประเมินความพึงพอใจของ " + plate + " ใช่หรือไม่? คะแนนรวม " + sum + " / " + SURVEY_MAX + " · บันทึกแล้วแก้ไขไม่ได้", ok: "ยืนยัน" });
export const SAT_LEAVE = { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ออก" };
export const SAT_OK = (plate: string) => "ประเมินความพึงพอใจสำเร็จ (" + plate + ")";
/** วันที่ประเมินของต้นแบบ (หลังวันรับทราบ ACK_AT) */
export const EVAL_AT = "07/11/2569 09:30 น.";

/* ---------- ข้อมูลผู้ใช้รถฯ ---------- */
const CARETAKER_POS = "ชก.7";   // ตำแหน่งผู้ดูแลยานพาหนะ — ค่าสมมติ (ระบบจริงอ่านจากข้อมูลผู้ใช้ที่เข้าระบบ)
const splitName = (n: string): [string, string] => { const i = n.indexOf(" "); return i < 0 ? [n, "-"] : [n.slice(0, i), n.slice(i + 1)]; };
/** ทะเบียน (ยานพาหนะ) · ชื่อ · นามสกุล · ตำแหน่ง (ผู้ดูแลยานพาหนะ) · สังกัด (หน่วยงานเจ้าของยานพาหนะ) */
export function surveyInfo(plate: string, caretaker: string, unit: string): string[] {
  const has = !!caretaker && caretaker !== "-";
  const [first, last] = has ? splitName(caretaker) : ["-", "-"];
  return [plate, first, last, has ? CARETAKER_POS : "-", unit || "-"];
}

/* ---------- คะแนน ---------- */
export type SurveyAnswers = (number | null)[];
export interface SurveyRecord { info: string[]; answers: number[]; remark?: string; at?: string; by?: string }
export const emptyAnswers = (): SurveyAnswers => Array.from({ length: SURVEY_COUNT }, () => null);
export const surveyDone = (a: SurveyAnswers): a is number[] => a.length === SURVEY_COUNT && a.every((x) => x != null);
export const answered = (a: SurveyAnswers) => a.filter((x) => x != null).length;
export const total = (a: SurveyAnswers) => a.reduce<number>((s, x) => s + (x ?? 0), 0);
export const average = (a: SurveyAnswers) => { const n = answered(a); return n ? (total(a) / n).toFixed(2) : "-"; };
/** คะแนนรายด้าน "x/10" */
export const groupScore = (a: SurveyAnswers, gi: number) => {
  const g = SURVEY_GROUPS[gi];
  return total(a.slice(SURVEY_START[gi], SURVEY_START[gi] + g.items.length)) + "/" + g.items.length * 5;
};
/** ค่าตัวอย่าง (จอ Y ของ screens.js) — ครบ 11 ข้อ = 46 · บางข้อ = 2 ด้านแรก 6 ข้อ */
export const SAMPLE_ANSWERS = [5, 4, 4, 5, 4, 4, 4, 3, 4, 5, 4];
export const sampleAnswers = (): number[] => [...SAMPLE_ANSWERS];
export const SAMPLE_DONE = [4, 4, 5, 4, 4, 5, 4, 4, 4, 4, 5];   // คันที่ประเมินไปก่อนแล้ว (แท็บประเมินแล้ว) = 47
export const SAMPLE_REMARK = "ช่างอธิบายงานที่ทำให้ฟังก่อนส่งคืน ควรแจ้งเวลาถึงล่วงหน้า";

/* ---------- แถวรายการ = ยานพาหนะที่รับทราบแล้ว (S13) และบำรุงรักษาเสร็จ (ไม่รวมคันที่บำรุงรักษาไม่ได้) ---------- */
export interface SatRow extends AccRow { evaluated: boolean; survey?: SurveyRecord; info: string[]; caretaker: string }
export function satRows(m: MockState): SatRow[] {
  return accRows(m).filter((r) => r.accepted && !r.cannot).map((r) => {
    const caretaker = tripCtrl(r.trip, r.car);
    return { ...r, evaluated: !!r.job.survey, survey: r.job.survey, caretaker, info: r.job.survey?.info ?? surveyInfo(r.car.plate, caretaker, r.car.owner) };
  });
}
export const satRecord = (m: MockState, tripId: string | null, carId: string | null) => satRows(m).find((r) => r.trip.id === tripId && r.car.id === carId);
export const satFormHref = (r: Pick<SatRow, "trip" | "car">) => "/satisfaction/form/?trip=" + r.trip.id + "&car=" + r.car.id;
export const satResultHref = (r: Pick<SatRow, "trip" | "car">) => "/satisfaction/result/?trip=" + r.trip.id + "&car=" + r.car.id;
export const operatorOf = (r: AccRow) => splitBy(r.by);

/** บันทึกการประเมิน (กดยืนยันใน popup) — บันทึกแล้วแก้ไม่ได้ · job.score = คะแนนรวม */
export function saveSurvey(r: SatRow, answers: number[], remark: string) {
  patchJob(r.trip.id, r.car.id, (j) => ({ ...j, survey: { info: r.info, answers, remark: remark.trim() || undefined, at: EVAL_AT, by: r.caretaker }, score: total(answers) }));
}

/* ---------- ?sample=S27 (ของต้นแบบ) — แผนเดินทาง T1 รับทราบครบ 3 คัน · 82-1145 ประเมินแล้ว · 82-6789 ยังไม่ได้ประเมิน · 80-9981 บำรุงรักษาไม่ได้ ไม่เข้ารายการ ---------- */
export function satSample() {
  acceptSample(true);
  const c = carOf("82-1145")!;
  patchJob("T1", c.id, (j) => ({ ...j, acceptedAt: ACK_AT, score: total(SAMPLE_DONE),
    survey: { info: surveyInfo(c.plate, c.ctrl, c.owner), answers: [...SAMPLE_DONE], remark: SAMPLE_REMARK, at: "06/11/2569 14:20 น.", by: c.ctrl } }));
}
export const SAT_SAMPLES = { S27: { role: "ผู้ดูแลยานพาหนะ" as const, apply: satSample } };
