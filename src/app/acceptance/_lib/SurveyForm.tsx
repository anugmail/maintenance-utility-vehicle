"use client";
/* แบบประเมินความพึงพอใจการให้บริการของ กบค. ในหน้า S13 (survey() ใน screens.js · R94 · เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 66) — แทน RepairFeedback คะแนนข้อเดียว
   เนื้อหาตามแบบสำรวจ XCHO 5 ขั้น (lib/mock/survey.ts) แต่หน้าตาเป็น component ของไลบรารีเท่านั้น ไม่ลอกหน้าตา XCHO · ไม่มี component แบบประเมินทั้งก้อน ⇒ ประกอบ (COMPOSED.md ว.)
   - 5 ส่วนเรียงในหน้าเดียว (ไม่ใช่ขั้นตอน): Section header ต่อส่วน (หัวข้อตามแบบสำรวจ · Supporting text = คำอธิบายสเกลของด้านที่ 2–5)
     แบบเดียวกับฟอร์มประเมินผู้รับจ้างที่เจ้าของงานเลือก "หน้าเต็ม" หมวดเรียงลง (Diagram/07 หัวข้อ 6.4) · หน้า S13 เป็นหน้าผลรายคันที่มีปุ่มรับทราบท้ายหน้าอยู่แล้ว
   - ข้อมูลผู้ใช้รถฯ 5 ช่อง = Text input State=Readonly เติมจากยานพาหนะและผู้ดูแลยานพาหนะ (แบบช่องตำแหน่งของแถวพนักงาน R86) · desktop 2 ช่องต่อแถว มือถือเรียงลง
   - คำถาม = Input label (ป้าย 16 SemiBold · ไม่มี "(ถ้ามี)" = บังคับ R6) → ห่าง 8 → Radio text card "1"…"5" แถวเดียวกว้างเท่ากัน (แถวของ RepairFeedback: ช่องไฟ 12 · มือถือ 8 ขอบในข้าง 12)
     ไลบรารีไม่มี component สเกลคะแนนตัวเลข (Rating เป็นดาว ไม่มีเลข 1–5 ของแบบสำรวจ) ⇒ ใช้ Radio text card แบบ RepairFeedback เดิมของ S13
   - ไม่มีค่าเริ่มต้น · readonly (รับทราบแล้ว / บทบาทอื่น) = การ์ดแสดงค่าที่บันทึก กดไม่ได้
   อ้างอิง: Section header · Text input · Input label · Radio text card ของไฟล์ Component + RepairFeedback ของไฟล์ Maintain-D + จอ L.2 L.4 L.5 L.7 ของ screens.js */
import { InputLabel } from "@/components/vms/InputLabel";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { SURVEY_GROUPS, SURVEY_INFO, SURVEY_INFO_TITLE, SURVEY_SCALE, SURVEY_START, type SurveyAnswers } from "@/lib/mock/survey";
import { useBreakpoint } from "@/lib/useBreakpoint";

function Question({ text, value, onPick }: { text: string; value: number | null; onPick?: (n: number) => void }) {
  const mob = useBreakpoint() === "Mobile";
  return (
    <div className="flex flex-col gap-2" data-question={text}>
      <InputLabel LabelText={text} />
      <div role="radiogroup" aria-label={text} className={cx("flex [&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0", mob ? "gap-2" : "gap-3")}>
        {[1, 2, 3, 4, 5].map((n) => (
          <RadioTextCard key={n} Text={String(n)} Selected={value === n} onClick={onPick ? () => onPick(n) : undefined}
            className={cx(!onPick && "cursor-default", mob ? (value === n ? "px-[11px]" : "px-3") : undefined)} />
        ))}
      </div>
    </div>
  );
}

export function SurveyForm({ info, answers, onChange }: { info: string[]; answers: SurveyAnswers; onChange?: (a: SurveyAnswers) => void }) {
  const mob = useBreakpoint() === "Mobile";
  const pick = (i: number) => (onChange ? (n: number) => onChange(answers.map((x, k) => (k === i ? n : x))) : undefined);
  return (
    <div className="flex flex-col gap-8" data-survey>
      <section className="flex flex-col gap-4">
        <SectionHeader Title={SURVEY_INFO_TITLE} />
        <div className={cx("grid gap-4", mob ? "grid-cols-1" : "grid-cols-2 gap-x-6")}>
          {SURVEY_INFO.map((label, i) => <TextInput key={label} LabelText={label} Text={info[i]} State="Readonly" />)}
        </div>
      </section>
      {SURVEY_GROUPS.map((g, gi) => (
        <section key={g.title} className="flex flex-col gap-4">
          <SectionHeader Title={g.title} SupportingText={SURVEY_SCALE} />
          <div className="flex flex-col gap-6">
            {g.items.map((q, qi) => { const i = SURVEY_START[gi] + qi; return <Question key={q} text={q} value={answers[i] ?? null} onPick={pick(i)} />; })}
          </div>
        </section>
      ))}
    </div>
  );
}
