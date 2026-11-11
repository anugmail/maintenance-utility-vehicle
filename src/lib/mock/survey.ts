/* แบบประเมินความพึงพอใจการให้บริการของ กบค. (S13 · เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 66)
   ที่มา: แบบสำรวจ "VMS+" ในระบบจัดการแบบฟอร์ม XCHO ของ กบค. (หน่วยงาน ผซก.1 กบค. ฝบร. ผชก.(ป-บส)) 5 ขั้น — ไฟล์ VMS+ _ Xcho-1.pdf … -5.pdf ที่เจ้าของงานส่ง
   เจ้าของงานเคาะ 11 พ.ย. 2569 _"ใช่ ประเมินแทน S13 หลังบำรุงรักษาเสร็จ"_ ⇒ แทนคะแนน 1–5 ข้อเดียว (RepairFeedback) ของ S13 · ผู้ประเมิน = ผู้ดูแลยานพาหนะ (R89)
   ข้อความหัวข้อ/คำถาม/สเกล ลอกจากแบบสำรวจตรงตัว (รวม "ผู้ใช้รถฯ" "ทะเบียนรถ" — ข้อความของแบบสำรวจ ไม่ใช่ข้อความที่เราตั้ง · ALLOW ของ check-wording)
   ทุกข้อในแบบสำรวจมีเครื่องหมาย * (จำเป็นต้องตอบ) ⇒ ในระบบนี้ = ช่องบังคับ (Input label ไม่มี "(ถ้ามี)" ตาม R6)
   ตรงกับ SURVEY ใน figma-export/maintainance-plugin/screens.js ของรีโป Maintenance-Request-Form (R94) */

/** ส่วนที่ 1 ข้อมูลผู้ใช้รถฯ — เติมจากยานพาหนะและผู้ดูแลยานพาหนะ (อ่านอย่างเดียว) */
export const SURVEY_INFO_TITLE = "ข้อมูลผู้ใช้รถฯ";
export const SURVEY_INFO = ["ทะเบียนรถ", "ชื่อผู้ตอบแบบสอบถาม", "นามสกุลผู้ตอบแบบสอบถาม", "ตำแหน่ง ผู้ตอบแบบสอบถาม", "สังกัด"] as const;
/** คำอธิบายสเกลใต้หัวข้อทุกด้าน (ตรงตัวตามแบบสำรวจ) */
export const SURVEY_SCALE = "โดย 1 คือคะแนนแย่สุด และ 5 คือคะแนนดีสุด";
/** ส่วนที่ 2–5 ด้านละหลายข้อ · คะแนน 1–5 ทุกข้อ · รวม 11 ข้อ (2 + 4 + 3 + 2) */
export const SURVEY_GROUPS: { title: string; items: string[] }[] = [
  { title: "ด้านระบบการให้บริการ", items: ["ความรวดเร็วในการรับบริการ", "ความสะดวกในการติดต่อเพื่อขอรับบริการ"] },
  { title: "ด้านเจ้าหน้าที่และ/หรือผู้ให้บริการ", items: ["อัธยาศัยของผู้ให้บริการ", "ความรู้ของผู้ให้บริการ", "การให้ความรู้และคำแนะนำแก่ผู้รับบริการ", "ความตั้งใจในการดำเนินการให้ผู้รับบริการ"] },
  { title: "ด้านคุณภาพของสินค้าและ/หรือบริการ", items: ["คุณภาพของอะไหล่และการบริการ", "ระยะเวลาในการได้รับอะไหล่และการบริการ", "อุปกรณ์ เครื่องมือและเทคโนโลยีในการให้บริการ"] },
  { title: "ด้านสภาพแวดล้อมต่างๆ", items: ["การทำความสะอาดพื้นที่หลังการให้บริการ", "การทำความสะอาดเครื่องจักรกลหลังการให้บริการ"] },
];
export const SURVEY_COUNT = SURVEY_GROUPS.reduce((n, g) => n + g.items.length, 0);
/** ลำดับข้อแรกของแต่ละด้าน (คำตอบเก็บเป็นอาร์เรย์เรียงตามข้อ) */
export const SURVEY_START = SURVEY_GROUPS.map((_, i) => SURVEY_GROUPS.slice(0, i).reduce((n, g) => n + g.items.length, 0));

/** ผลที่บันทึกตอนรับทราบ — info = 5 ช่องของส่วนที่ 1 · answers = คะแนน 11 ข้อ (null = ยังไม่ตอบ) */
export interface SurveyRecord { info: string[]; answers: number[] }
export type SurveyAnswers = (number | null)[];
export const emptyAnswers = (): SurveyAnswers => Array.from({ length: SURVEY_COUNT }, () => null);
export const surveyDone = (a: SurveyAnswers): a is number[] => a.length === SURVEY_COUNT && a.every((x) => x != null);
export const surveyLeft = (a: SurveyAnswers) => a.filter((x) => x == null).length;
/** คะแนนเฉลี่ย 2 ตำแหน่ง (เก็บใน job.score ให้หน้าที่อ่านคะแนนเดิมยังใช้ได้) */
export const surveyAvg = (a: number[]) => Math.round((a.reduce((s, x) => s + x, 0) / a.length) * 100) / 100;

/* ตำแหน่งของผู้ดูแลยานพาหนะ — ค่าสมมติ (ระบบจริงอ่านจากข้อมูลผู้ใช้ที่เข้าระบบ) */
const CARETAKER_POS = "ชก.7";
/** "นายสมชาย แก้วมณี" → ["นายสมชาย", "แก้วมณี"] */
const splitName = (n: string): [string, string] => { const i = n.indexOf(" "); return i < 0 ? [n, "-"] : [n.slice(0, i), n.slice(i + 1)]; };
/** ส่วนที่ 1 เติมให้: ทะเบียน (ยานพาหนะ) · ชื่อ · นามสกุล · ตำแหน่ง (ผู้ดูแลยานพาหนะ) · สังกัด (หน่วยงานเจ้าของยานพาหนะ) */
export function surveyInfo(plate: string, caretaker: string, unit: string): string[] {
  const [first, last] = caretaker && caretaker !== "-" ? splitName(caretaker) : ["-", "-"];
  return [plate, first, last, caretaker && caretaker !== "-" ? CARETAKER_POS : "-", unit || "-"];
}
/** คำตอบที่บันทึกแล้ว · ที่เก็บเก่ามีแต่ score ข้อเดียว (ก่อน 11 พ.ย. 2569) = ทุกข้อเท่ากับ score */
export function savedAnswers(j: { survey?: SurveyRecord; score?: number }): SurveyAnswers {
  if (j.survey?.answers?.length === SURVEY_COUNT) return j.survey.answers;
  return j.score ? Array.from({ length: SURVEY_COUNT }, () => Math.round(j.score!)) : emptyAnswers();
}
/** ค่าตัวอย่าง (ปุ่มต้นแบบ "กรอกข้อมูลตัวอย่าง" · seed รับทราบแล้ว) — ตรงกับจอ L.4 L.5 ของ screens.js */
export const SAMPLE_ANSWERS = [5, 4, 4, 5, 4, 4, 4, 3, 4, 5, 4];
export const sampleAnswers = (): number[] => [...SAMPLE_ANSWERS];
