"use client";
import { acceptSample, accRows, splitBy } from "./acceptance";
import { carOf, tripCtrl } from "./jobs";
import { PLANS, creatorOf, unitOf } from "./data";
import { setMock, type MockState, type Role } from "./store";
import { SAMPLE_PLAN_Q } from "./trips";

declare module "./store" {
  interface MockState { evals?: Record<string, SurveyRecord> }
}

export const SURVEY_INFO_TITLE = "ข้อมูลผู้ใช้รถฯ";
export const SURVEY_INFO = ["ทะเบียนรถ", "ชื่อผู้ตอบแบบสอบถาม", "นามสกุลผู้ตอบแบบสอบถาม", "ตำแหน่ง ผู้ตอบแบบสอบถาม", "สังกัด"] as const;
export const SURVEY_GROUPS: { title: string; items: string[]; icon: string }[] = [
  { title: "ด้านระบบการให้บริการ", items: ["ความรวดเร็วในการรับบริการ", "ความสะดวกในการติดต่อเพื่อขอรับบริการ"], icon: "call-24-300-round" },
  { title: "ด้านเจ้าหน้าที่และ/หรือผู้ให้บริการ", items: ["อัธยาศัยของผู้ให้บริการ", "ความรู้ของผู้ให้บริการ", "การให้ความรู้และคำแนะนำแก่ผู้รับบริการ", "ความตั้งใจในการดำเนินการให้ผู้รับบริการ"], icon: "groups-24-300-round" },
  { title: "ด้านคุณภาพของสินค้าและ/หรือบริการ", items: ["คุณภาพของอะไหล่และการบริการ", "ระยะเวลาในการได้รับอะไหล่และการบริการ", "อุปกรณ์ เครื่องมือและเทคโนโลยีในการให้บริการ"], icon: "car_repair-24-300-round" },
  { title: "ด้านสภาพแวดล้อมต่างๆ", items: ["การทำความสะอาดพื้นที่หลังการให้บริการ", "การทำความสะอาดเครื่องจักรกลหลังการให้บริการ"], icon: "search_check-24-300-round" },
];
export const SURVEY_COUNT = SURVEY_GROUPS.reduce((n, g) => n + g.items.length, 0);
export const SURVEY_MAX = SURVEY_COUNT * 5;
export const SURVEY_START = SURVEY_GROUPS.map((_, i) => SURVEY_GROUPS.slice(0, i).reduce((n, g) => n + g.items.length, 0));
export const LEVEL = ["", "ต้องปรับปรุงมาก", "ต้องปรับปรุง", "พอใช้", "ดี", "ดีมาก"] as const;

export const SAT_TITLE = "แบบประเมินความพึงพอใจ";
export const SAT_HIDDEN_ROLE = "ผู้รับจ้าง";
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
export const EVAL_AT = "07/11/2569 09:30 น.";

export type EvalKind = "repair" | "ma" | "oh";
export const EVAL_KINDS: EvalKind[] = ["repair", "ma", "oh"];
export const KIND: Record<EvalKind, [string, "Info" | "Success" | "Brand"]> = { repair: ["งานซ่อม", "Info"], ma: ["บำรุงรักษาตามวาระ", "Success"], oh: ["Overhaul", "Brand"] };
export const NO_LABEL: Record<EvalKind, string> = { repair: "เลขที่ใบแจ้งซ่อม", ma: "เลขที่ MR", oh: "หมายเลขแผน" };

const CARETAKER_POS = "ชก.7";
const splitName = (n: string): [string, string] => { const i = n.indexOf(" "); return i < 0 ? [n, "-"] : [n.slice(0, i), n.slice(i + 1)]; };
export function surveyInfo(plate: string, caretaker: string, unit: string): string[] {
  const has = !!caretaker && caretaker !== "-";
  const [first, last] = has ? splitName(caretaker) : ["-", "-"];
  return [plate, first, last, has ? CARETAKER_POS : "-", unit || "-"];
}

export type SurveyAnswers = (number | null)[];
export interface SurveyRecord { info: string[]; answers: number[]; notes?: string[]; remark?: string; at?: string; by?: string }
export const emptyAnswers = (): SurveyAnswers => Array.from({ length: SURVEY_COUNT }, () => null);
export const emptyNotes = (): string[] => Array.from({ length: SURVEY_COUNT }, () => "");
export const surveyDone = (a: SurveyAnswers): a is number[] => a.length === SURVEY_COUNT && a.every((x) => x != null);
export const answered = (a: SurveyAnswers) => a.filter((x) => x != null).length;
export const total = (a: SurveyAnswers) => a.reduce<number>((s, x) => s + (x ?? 0), 0);
export const average = (a: SurveyAnswers) => { const n = answered(a); return n ? (total(a) / n).toFixed(2) : "-"; };
export const groupScore = (a: SurveyAnswers, gi: number) => {
  const g = SURVEY_GROUPS[gi];
  return total(a.slice(SURVEY_START[gi], SURVEY_START[gi] + g.items.length)) + "/" + g.items.length * 5;
};
export const SAMPLE_ANSWERS = [5, 4, 4, 5, 4, 4, 4, 3, 4, 5, 4];
export const sampleAnswers = (): number[] => [...SAMPLE_ANSWERS];
export const SAMPLE_DONE = [4, 4, 5, 4, 4, 5, 4, 4, 4, 4, 5];
export const SAMPLE_REMARK = "ช่างอธิบายงานที่ทำให้ฟังก่อนส่งคืน ควรแจ้งเวลาถึงล่วงหน้า";
export const SAMPLE_FORM_REMARK = "ช่างมาตรงเวลา อธิบายงานที่ทำก่อนส่งคืนยานพาหนะ";
const SAMPLE_NOTE_AT = 7, SAMPLE_NOTE = "รออะไหล่ไส้กรองไฮดรอลิก 2 วัน";
export const sampleNotes = () => emptyNotes().map((x, i) => (i === SAMPLE_NOTE_AT ? SAMPLE_NOTE : x));

export interface EvalRow {
  id: string;
  kind: EvalKind;
  no: string;
  work: string;
  plate: string; vtype: string; owner: string; caretaker: string;
  provider: string;
  closedAt: string;
  pairs: [string, string][];
  info: string[];
  survey?: SurveyRecord;
  evaluated: boolean;
  trip?: string; car?: string;
}

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

const maId = (trip: string, car: string) => "ma." + trip + "." + car;
function maRows(m: MockState): Seed[] {
  return accRows(m).filter((r) => r.accepted && !r.cannot && r.trip.mode !== "hire").map((r) => {
    const p = m.plans.find((x) => x.mr === r.mr);
    return { id: maId(r.trip.id, r.car.id), kind: "ma" as const, no: r.mr, work: r.trip.name, plate: r.car.plate, vtype: r.car.type, owner: r.car.owner,
      caretaker: tripCtrl(r.trip, r.car), provider: unitOf(r.mr, p?.unit), closedAt: (r.job.closedAt ?? r.date).slice(0, 10),
      pairs: [["ชื่อแผน", r.trip.planName || "-"], ["แผนเดินทาง", r.trip.name], ["ผู้ดำเนินการ", r.by], ["รับทราบผลเมื่อ", r.job.acceptedAt ?? "-"]] as [string, string][],
      trip: r.trip.id, car: r.car.id };
  });
}
const dayNo = (s: string) => { const [d, mo, y] = s.split("/").map(Number); return (y || 0) * 1e4 + (mo || 0) * 100 + (d || 0); };
export function evalRows(m: MockState): EvalRow[] {
  SEEDS ??= seeds();
  return [...maRows(m), ...SEEDS].map(({ done: d0, ...s }) => {
    const survey = m.evals?.[s.id] ?? d0;
    return { ...s, survey, evaluated: !!survey, info: survey?.info ?? surveyInfo(s.plate, s.caretaker, s.owner) };
  }).sort((a, b) => dayNo(b.closedAt) - dayNo(a.closedAt));
}
export const rowsFor = (m: MockState, role: Role) => evalRows(m).filter((r) => role !== "กบค." || r.provider === "กบค.");
export const canEvaluate = (role: Role) => role === "ผู้ดูแลยานพาหนะ";
export const evalRecord = (m: MockState, id: string | null) => (id ? evalRows(m).find((r) => r.id === id) : undefined);
export const legacyId = (trip: string | null, car: string | null) => (trip && car ? maId(trip, car) : null);
export const satFormHref = (r: Pick<EvalRow, "id">) => "/satisfaction/form/?id=" + r.id;
export const satResultHref = (r: Pick<EvalRow, "id">) => "/satisfaction/result/?id=" + r.id;
export const maEvalId = maId;
export const operatorOf = (by: string) => splitBy(by);

export function saveSurvey(r: EvalRow, answers: number[], notes: string[], remark: string) {
  const rec: SurveyRecord = { info: r.info, answers, notes: notes.some((x) => x.trim()) ? notes.map((x) => x.trim()) : undefined, remark: remark.trim() || undefined, at: EVAL_AT, by: r.caretaker };
  setMock((s) => ({ ...s, evals: { ...s.evals, [r.id]: rec } }));
}

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
