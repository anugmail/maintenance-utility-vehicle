"use client";
/* แบบประเมินความพึงพอใจ — เรื่องแยกของตัวเอง (/satisfaction/ · เมนูแยกใน Sidebar · BACKLOG ข้อ 75 76 · เดิม S27 ใต้บำรุงรักษาตามวาระ BACKLOG ข้อ 66 66ก · R94)
   เจ้าของงาน 12 พ.ย. 2569: _"เรื่องการประเมินเป็นเรื่องแยกที่จะไปผูกตาม flow ต่างๆ เลยอยากแยกใว้"_
     ⇒ 1 แถว = งาน 1 งานของยานพาหนะ 1 คันที่ปิดงานแล้ว จากหลาย flow: งานซ่อม · บำรุงรักษาตามวาระ · Overhaul (ประเภทงาน + เลขที่งาน/แผน)
     ⇒ ผู้ประเมิน = หน่วยงานของยานพาหนะ (บทบาท ผู้ดูแลยานพาหนะ) หลังปิดงาน
     ⇒ ผู้ถูกประเมิน = "หน่วยงานที่ให้บริการ" ระบบเติมให้ (อ่านอย่างเดียว) · บำรุงรักษาตามวาระ = หน่วยงานที่ดำเนินการแผน
       (แผนที่ กบค. ดำเนินการ = กบค. · แผนของกองอื่น กบผ. กปส. กรย. กส.1 กส.2 = กองนั้น) · งานซ่อม · Overhaul = กบค. (เสนอ ยังไม่เคาะ)
   โครงจอ = เฟรมประเมินผู้รับจ้าง A B C ที่เจ้าของงานวาง 12 พ.ย. 2569 (userflow/figma-ref/contractor-eval-ABC-2569-11-12.txt)
   ที่มาเนื้อหา: แบบสำรวจ "VMS+" ของ กบค. ในระบบจัดการแบบฟอร์ม XCHO 5 ขั้น (หน่วยงาน ผซก.1 กบค. ฝบร. ผชก.(ป-บส)) — ไฟล์ VMS+ _ Xcho-1.pdf … -5.pdf ที่เจ้าของงานส่ง
   ข้อความหัวข้อ/คำถาม ลอกจากแบบสำรวจตรงตัว (รวม "ผู้ใช้รถฯ" "ทะเบียนรถ" — ALLOW ของ check-wording) · ทุกข้อมี * ⇒ บังคับทุกข้อ
   คะแนน: ข้อละ 1–5 ดาว (component Rating แบบประเมินผู้รับจ้าง) · ด้านละ 10 / 20 / 15 / 10 · รวมเต็ม 55 (11 ข้อ × 5 · ไม่แปลงเป็นร้อย)
   ข้อความบนจอตรงกับปลั๊กอิน figma-export/satisfaction-plugin/ (รีโป Maintenance-Request-Form · ทำคู่กัน 12 พ.ย. 2569) */
import { acceptSample, accRows, splitBy } from "./acceptance";
import { carOf, tripCtrl } from "./jobs";
import { PLANS, creatorOf, unitOf } from "./data";
import { setMock, type MockState, type Role } from "./store";
import { SAMPLE_PLAN_Q } from "./trips";

/* ---------- ที่เก็บ: ผลประเมินคีย์ตามงาน (EvalRow.id) — ไม่มี = ยังไม่ได้ประเมิน (MOCK_V 9) ---------- */
declare module "./store" {
  interface MockState { evals?: Record<string, SurveyRecord> }
}

/** ข้อมูลผู้ใช้รถฯ — เติมจากยานพาหนะและผู้ดูแลยานพาหนะ (อ่านอย่างเดียว) */
export const SURVEY_INFO_TITLE = "ข้อมูลผู้ใช้รถฯ";
export const SURVEY_INFO = ["ทะเบียนรถ", "ชื่อผู้ตอบแบบสอบถาม", "นามสกุลผู้ตอบแบบสอบถาม", "ตำแหน่ง ผู้ตอบแบบสอบถาม", "สังกัด"] as const;
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
/** ชื่อระดับ 1–5 (ตามเฟรมประเมินผู้รับจ้าง · ข้อความที่เจ้าของงานกำหนด 12 พ.ย. 2569) — ช่องคะแนนในหน้าผล "5 · ดีมาก" */
export const LEVEL = ["", "ต้องปรับปรุงมาก", "ต้องปรับปรุง", "พอใช้", "ดี", "ดีมาก"] as const;

/* ---------- ข้อความหน้าจอ (เจ้าของงานกำหนดตรงตัว 12 พ.ย. 2569 · ตรงกับปลั๊กอิน satisfaction-plugin) ---------- */
export const SAT_TITLE = "แบบประเมินความพึงพอใจ";
export const SAT_TABS = ["ยังไม่ได้ประเมิน", "ประเมินแล้ว"] as const;
export const SAT_EMPTY = ["ไม่มีรายการที่ต้องประเมิน", "งานจะเข้ามาที่นี่เมื่อปิดงานแล้ว"] as const;
export const SAT_EMPTY_BTN = "ดูรายการที่ประเมินแล้ว";
export const SAT_SEARCH = "ค้นหาเลขที่งาน, ทะเบียน";
export const SAT_ALERT = ["ให้คะแนนทุกข้อ 1 ถึง 5 ดาว",
  LEVEL.slice(1).map((l, i) => i + 1 + " " + l).join(" · ") + " · คะแนนรวมเต็ม " + SURVEY_MAX + " (" + SURVEY_COUNT + " ข้อ × 5) · หมายเหตุไม่บังคับ"] as const;
export const SAT_REMARK = "หมายเหตุ/ข้อเสนอแนะเพิ่มเติม";
export const SAT_NOTE = (n: number) => "หมายเหตุข้อ " + n;
export const SAT_CONFIRM = (r: Pick<EvalRow, "provider" | "no">, sum: number) => ({ title: "ยืนยันการประเมิน",
  sub: "คุณต้องการบันทึกคะแนนการประเมินสำหรับ " + r.provider + " (" + r.no + ") ใช่หรือไม่? คะแนนรวม " + sum + " / " + SURVEY_MAX + " · บันทึกแล้วแก้ไขไม่ได้", ok: "ยืนยัน" });
export const SAT_LEAVE = { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ออก" };
export const SAT_FAIL = "บันทึกการประเมินไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
export const SAT_OK = (no: string) => "ประเมินความพึงพอใจสำเร็จ (" + no + ")";
export const PROVIDER_LABEL = "หน่วยงานที่ให้บริการ";
/** วันที่ประเมินของต้นแบบ (หลังวันรับทราบ ACK_AT ของ S13) */
export const EVAL_AT = "07/11/2569 09:30 น.";

/* ---------- ประเภทงาน (Pill ตาม JOB ของ contractor-eval-plugin: งานซ่อม Info · บำรุงรักษา Success · Overhaul Brand) ---------- */
export type EvalKind = "repair" | "ma" | "oh";
export const EVAL_KINDS: EvalKind[] = ["repair", "ma", "oh"];
export const KIND: Record<EvalKind, [string, "Info" | "Success" | "Brand"]> = { repair: ["งานซ่อม", "Info"], ma: ["บำรุงรักษาตามวาระ", "Success"], oh: ["Overhaul", "Brand"] };
/** ป้ายของเลขที่งานในกล่องข้อมูลงาน (งานซ่อม = ใบแจ้งซ่อม Maintain-D · บำรุงรักษา = แผน MR · Overhaul = แผน OR) */
export const NO_LABEL: Record<EvalKind, string> = { repair: "เลขที่ใบแจ้งซ่อม", ma: "เลขที่ MR", oh: "หมายเลขแผน" };

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
/** ผลประเมิน 1 งาน · notes = หมายเหตุรายข้อ (ไม่บังคับ · ไม่มีสักข้อ = ไม่เก็บ) */
export interface SurveyRecord { info: string[]; answers: number[]; notes?: string[]; remark?: string; at?: string; by?: string }
export const emptyAnswers = (): SurveyAnswers => Array.from({ length: SURVEY_COUNT }, () => null);
export const emptyNotes = (): string[] => Array.from({ length: SURVEY_COUNT }, () => "");
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
export const SAMPLE_DONE = [4, 4, 5, 4, 4, 5, 4, 4, 4, 4, 5];   // ประเมินไปก่อนแล้ว (แท็บประเมินแล้ว) = 47
export const SAMPLE_REMARK = "ช่างอธิบายงานที่ทำให้ฟังก่อนส่งคืน ควรแจ้งเวลาถึงล่วงหน้า";
export const SAMPLE_FORM_REMARK = "ช่างมาตรงเวลา อธิบายงานที่ทำก่อนส่งคืนยานพาหนะ";
/** หมายเหตุรายข้อตัวอย่าง: ข้อ 8 (ด้านคุณภาพ · ระยะเวลาในการได้รับอะไหล่และการบริการ) ที่ให้ 3 คะแนน */
const SAMPLE_NOTE_AT = 7, SAMPLE_NOTE = "รออะไหล่ไส้กรองไฮดรอลิก 2 วัน";
export const sampleNotes = () => emptyNotes().map((x, i) => (i === SAMPLE_NOTE_AT ? SAMPLE_NOTE : x));

/* ---------- แถวรายการ ---------- */
export interface EvalRow {
  /** คีย์ของงาน (อักขระที่ใช้ใน URL ?id= ได้ตรงๆ) — ma.<แผนเดินทาง หรือ แผน>.<ยานพาหนะ> · rp.<เลขที่ใบแจ้งซ่อม> · oh.<หมายเลขแผน>.<ยานพาหนะ> */
  id: string;
  kind: EvalKind;
  /** เลขที่งาน/แผน: MTD-… (งานซ่อม) · MRZ… (บำรุงรักษาตามวาระ) · ORZ… (Overhaul) */
  no: string;
  /** งาน: อาการที่แจ้งซ่อม · ชื่อแผนเดินทาง · ชื่อ Purchase Order */
  work: string;
  plate: string; vtype: string; owner: string; caretaker: string;
  /** หน่วยงานที่ให้บริการ (ผู้ถูกประเมิน · ระบบเติมให้) */
  provider: string;
  /** วันที่ปิดงาน dd/mm/yyyy */
  closedAt: string;
  /** ช่องเฉพาะประเภทงานของกล่องข้อมูลงาน (ต่อจาก ประเภทงาน · เลขที่งาน · ทะเบียน · ประเภทยานพาหนะ) */
  pairs: [string, string][];
  info: string[];
  survey?: SurveyRecord;
  evaluated: boolean;
  /** งานบำรุงรักษาตามวาระที่มาจาก S13 (แผนเดินทาง · ยานพาหนะ) */
  trip?: string; car?: string;
}

/* งานจาก flow อื่น (ค่าสมมติชุดเดียวกับปลั๊กอิน Figma ของแต่ละ flow):
   - งานซ่อม: ใบแจ้งซ่อม Maintain-D (mock/Maintenance-Request-Form.html JOBS · MTD-690716-031 82-6789 ขอนแก่น) + REC.repair ของ contractor-eval-plugin (MTD-691003-014 82-1145 ขอนแก่น RAM000245 ซ่อมเสร็จ 15/10/2569)
   - Overhaul: REC.oh ของ contractor-eval-plugin = PO-690201 ซ่อมระบบไฮดรอลิกกระเช้า แผน ORZ6900002 (PLANS ของ overhaul2-plugin) 72-6648 สงขลา HINO FG1J ปิดงาน 05/10/2569
   - บำรุงรักษาตามวาระของแผนที่ กบค. ดำเนินการ: MRZ7100004 (PLAN_UNIT กบค.) ไตรมาส 1 คันแรก (SAMPLE_PLAN_Q) · ของกองอื่นที่ประเมินแล้ว: MRZ6900011 (กรย.) 80-4458 แพร่ (MA_ROWS ของ S24 บำรุงรักษา 01/10/2568)
   ค่าสมมติ: ผู้ดูแลยานพาหนะของ 72-6648 · 73-5019 (ข้อมูลยานพาหนะไม่มีชื่อ) · สังกัดของ 72-6648 · หมายเลขงานซ่อม RAM000198 · อาการของ MTD-691003-014 */
type Seed = Omit<EvalRow, "evaluated" | "survey" | "info"> & { done?: SurveyRecord };
const planName = (mr: string) => PLANS.find((p) => p.mr === mr)?.name ?? "-";
const planBy = (mr: string) => { const p = PLANS.find((x) => x.mr === mr); return p ? creatorOf(p) : "-"; };
const KBK_PLAN = "MRZ7100004", KBK_CAR = SAMPLE_PLAN_Q[KBK_PLAN]?.[1]?.[0];
const kbkCar = KBK_CAR ? carOf(KBK_CAR.id) : undefined;
const c1145 = carOf("82-1145"), c6789 = carOf("82-6789"), c4458 = carOf("80-4458");
const doneRec = (plate: string, by: string, owner: string, answers: number[], at: string, remark?: string): SurveyRecord =>
  ({ info: surveyInfo(plate, by, owner), answers, remark, at, by });
const seeds = (): Seed[] => [
  { id: "rp.MTD-691003-014", kind: "repair", no: "MTD-691003-014", work: "ระบบไฮดรอลิกกระเช้ารั่วซึม", plate: c1145?.plate ?? "82-1145 ขอนแก่น", vtype: c1145?.type ?? "-", owner: c1145?.owner ?? "-",
    caretaker: c1145?.ctrl || "-", provider: "กบค.", closedAt: "15/10/2569",
    pairs: [["หมายเลขงานซ่อม", "RAM000245"], ["อาการที่แจ้ง", "ระบบไฮดรอลิกกระเช้ารั่วซึม"], ["วันที่ / เวลาที่ซ่อมเสร็จ", "15/10/2569 16:30 น."]] },
  { id: "oh.ORZ6900002.72-6648", kind: "oh", no: "ORZ6900002", work: "ซ่อมระบบไฮดรอลิกกระเช้า", plate: "72-6648 สงขลา", vtype: "รถกระเช้า", owner: "กฟต.3 สงขลา",
    caretaker: "นายอดิศักดิ์ ทองสุข", provider: "กบค.", closedAt: "05/10/2569",
    pairs: [["ชื่อแผน", "Overhaul ประจำปีงบ 2569 — รถกระเช้า"], ["ใบสั่งจ้างเลขที่", "PO-690201"], ["ชื่อ Purchase Order", "ซ่อมระบบไฮดรอลิกกระเช้า"], ["ยี่ห้อ/รุ่น", "HINO FG1J"]] },
  ...(kbkCar ? [{ id: "ma." + KBK_PLAN + "." + kbkCar.id, kind: "ma" as const, no: KBK_PLAN, work: "ตรวจยานพาหนะ " + kbkCar.plate.split(" ").slice(1).join(" "), plate: kbkCar.plate,
    vtype: kbkCar.type, owner: kbkCar.owner, caretaker: kbkCar.ctrl || "นายธนกร ศรีสมุทร", provider: unitOf(KBK_PLAN), closedAt: "05/11/2569",
    pairs: [["ชื่อแผน", planName(KBK_PLAN)], ["ไตรมาส", "ไตรมาส 1"], ["ผู้ดำเนินการ", planBy(KBK_PLAN)]] as [string, string][] }] : []),
  /* ประเมินแล้ว (แท็บประเมินแล้วตั้งต้น) */
  { id: "rp.MTD-690716-031", kind: "repair", no: "MTD-690716-031", work: "กระเช้าเอียง/ล็อกไม่อยู่", plate: c6789?.plate ?? "82-6789 ขอนแก่น", vtype: c6789?.type ?? "-", owner: c6789?.owner ?? "-",
    caretaker: c6789?.ctrl || "-", provider: "กบค.", closedAt: "24/09/2569",
    pairs: [["หมายเลขงานซ่อม", "RAM000198"], ["อาการที่แจ้ง", "กระเช้าเอียง/ล็อกไม่อยู่"], ["วันที่ / เวลาที่ซ่อมเสร็จ", "24/09/2569 15:10 น."]],
    done: doneRec(c6789?.plate ?? "82-6789 ขอนแก่น", c6789?.ctrl || "-", c6789?.owner ?? "-", [5, 4, 4, 4, 4, 5, 4, 3, 4, 4, 4], "27/09/2569 10:15 น.", "ซ่อมเสร็จตามนัด ควรแจ้งความคืบหน้าระหว่างรออะไหล่") },
  { id: "ma.MRZ6900011.80-4458", kind: "ma", no: "MRZ6900011", work: "ตรวจยานพาหนะ แพร่", plate: c4458?.plate ?? "80-4458 แพร่", vtype: c4458?.type ?? "-", owner: c4458?.owner ?? "-",
    caretaker: c4458?.ctrl || "-", provider: unitOf("MRZ6900011"), closedAt: "01/10/2568",
    pairs: [["ชื่อแผน", planName("MRZ6900011")], ["ไตรมาส", "ไตรมาส 1"], ["ผู้ดำเนินการ", planBy("MRZ6900011")]],
    done: doneRec(c4458?.plate ?? "80-4458 แพร่", c4458?.ctrl || "-", c4458?.owner ?? "-", [4, 5, 4, 4, 5, 4, 4, 4, 4, 5, 5], "03/10/2568 14:00 น.") },
];
let SEEDS: Seed[] | null = null;

/* งานบำรุงรักษาตามวาระจาก S13 (ผู้ดูแลยานพาหนะรับทราบแล้ว ไม่รวมคันที่บำรุงรักษาไม่ได้) — หน่วยงานที่ให้บริการ = หน่วยงานเจ้าของแผน (ผู้ดำเนินการ) */
const maId = (trip: string, car: string) => "ma." + trip + "." + car;
function maRows(m: MockState): Seed[] {
  return accRows(m).filter((r) => r.accepted && !r.cannot).map((r) => {
    const p = m.plans.find((x) => x.mr === r.mr);
    return { id: maId(r.trip.id, r.car.id), kind: "ma" as const, no: r.mr, work: r.trip.name, plate: r.car.plate, vtype: r.car.type, owner: r.car.owner,
      caretaker: tripCtrl(r.trip, r.car), provider: unitOf(r.mr, p?.unit), closedAt: (r.job.closedAt ?? r.date).slice(0, 10),
      pairs: [["ชื่อแผน", r.trip.planName || "-"], ["แผนเดินทาง", r.trip.name], ["ผู้ดำเนินการ", r.by], ["รับทราบผลเมื่อ", r.job.acceptedAt ?? "-"]] as [string, string][],
      trip: r.trip.id, car: r.car.id };
  });
}
const dayNo = (s: string) => { const [d, mo, y] = s.split("/").map(Number); return (y || 0) * 1e4 + (mo || 0) * 100 + (d || 0); };
/** ทุกงานที่ปิดแล้ว (เรียงวันที่ปิดงานใหม่สุดก่อน) */
export function evalRows(m: MockState): EvalRow[] {
  SEEDS ??= seeds();
  return [...maRows(m), ...SEEDS].map(({ done: d0, ...s }) => {
    const survey = m.evals?.[s.id] ?? d0;
    return { ...s, survey, evaluated: !!survey, info: survey?.info ?? surveyInfo(s.plate, s.caretaker, s.owner) };
  }).sort((a, b) => dayNo(b.closedAt) - dayNo(a.closedAt));
}
/** แถวที่บทบาทเห็น — กบค. เห็นเฉพาะการประเมินที่ประเมิน กบค. (ดูอย่างเดียว) · บทบาทอื่นเห็นทุกงาน (แบบ S27 เดิม) · กรอกได้เฉพาะผู้ดูแลยานพาหนะ */
export const rowsFor = (m: MockState, role: Role) => evalRows(m).filter((r) => role !== "กบค." || r.provider === "กบค.");
export const canEvaluate = (role: Role) => role === "ผู้ดูแลยานพาหนะ";
export const evalRecord = (m: MockState, id: string | null) => (id ? evalRows(m).find((r) => r.id === id) : undefined);
/** ที่อยู่เดิมของ S27 (?trip=&car=) → คีย์งาน */
export const legacyId = (trip: string | null, car: string | null) => (trip && car ? maId(trip, car) : null);
export const satFormHref = (r: Pick<EvalRow, "id">) => "/satisfaction/form/?id=" + r.id;
export const satResultHref = (r: Pick<EvalRow, "id">) => "/satisfaction/result/?id=" + r.id;
/** S13 → ฟอร์มประเมินของงานบำรุงรักษาคันนั้น (เมนูแบบประเมินความพึงพอใจ) */
export const maEvalId = maId;
export const operatorOf = (by: string) => splitBy(by);

/** บันทึกการประเมิน (กดยืนยันใน popup) — บันทึกแล้วแก้ไม่ได้ */
export function saveSurvey(r: EvalRow, answers: number[], notes: string[], remark: string) {
  const rec: SurveyRecord = { info: r.info, answers, notes: notes.some((x) => x.trim()) ? notes.map((x) => x.trim()) : undefined, remark: remark.trim() || undefined, at: EVAL_AT, by: r.caretaker };
  setMock((s) => ({ ...s, evals: { ...s.evals, [r.id]: rec } }));
}

/* ---------- ?sample= (ของต้นแบบ) ----------
   S27 = แผนเดินทาง T1 รับทราบครบ 3 คัน · 82-1145 ประเมินแล้ว · 82-6789 ยังไม่ได้ประเมิน (หน่วยงานที่ให้บริการ กบผ.) · 80-9981 บำรุงรักษาไม่ได้ ไม่เข้ารายการ
         + งานซ่อม Overhaul และแผนของ กบค. ตามค่าตั้งต้น
   S27_empty = ทุกงานประเมินแล้ว (แท็บยังไม่ได้ประเมินว่าง) · S27_kbk = ชุด S27 ในบทบาท กบค. (ดูเฉพาะการประเมินที่ประเมิน กบค.) */
export function satSample() {
  acceptSample(true);
  const c = carOf("82-1145")!;
  setMock((s) => ({ ...s, evals: { [maId("T1", c.id)]: { info: surveyInfo(c.plate, c.ctrl, c.owner), answers: [...SAMPLE_DONE], remark: SAMPLE_REMARK, at: "06/11/2569 14:20 น.", by: c.ctrl } } }));
}
export function satEmptySample() {
  satSample();
  setMock((s) => ({ ...s, evals: Object.fromEntries(evalRows(s).map((r) => [r.id, r.survey ?? { info: r.info, answers: [...SAMPLE_DONE], at: EVAL_AT, by: r.caretaker }])) }));
}
export const SAT_SAMPLES = {
  S27: { role: "ผู้ดูแลยานพาหนะ" as const, apply: satSample },
  S27_empty: { role: "ผู้ดูแลยานพาหนะ" as const, apply: satEmptySample },
  S27_kbk: { role: "กบค." as const, apply: satSample },
};
