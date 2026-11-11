"use client";
/* S27 ชิ้นที่ใช้ร่วมของหน้าประเมินความพึงพอใจ — ยกโครงจาก groupHead() / question() ของ contractor-eval-plugin (ประเมินผู้รับจ้าง) · satGroupHead() satQuestion() ของ screens.js บล็อก Y
   หัวด้าน = Featured icon (Color=Brand Size=md · ไอคอนด้าน) + Section header (ชื่อด้าน · Badge คะแนนด้าน "x/10") ช่องไฟ 16 กลางแนวตั้ง
   1 ข้อ = Input label (ข้อความตามแบบสำรวจ ไม่มี "(ถ้ามี)" = บังคับ) → ห่าง 12 → Rating ดาว 5 ดวงใต้ข้อความ (ดาวเริ่มว่าง)
   desktop ข้อเยื้องตรงชื่อด้าน 64 (ไอคอน 48 + ช่อง 16) · มือถือไม่เยื้อง · ระหว่างข้อ 24 · หัวด้าน → ข้อ 16
   อ้างอิง: Featured icon · Section header · Input label · Rating ของไฟล์ Component + หน้าฟอร์มประเมินผู้รับจ้าง (contractor-eval-plugin evalForm) · COMPOSED.md ศ. */
import { FeaturedIcon } from "@/components/vms/FeaturedIcon";
import { InputLabel } from "@/components/vms/InputLabel";
import { Rating } from "@/components/vms/Rating";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { cx } from "@/lib/cx";
import { SURVEY_GROUPS, SURVEY_START, groupScore, type SurveyAnswers } from "@/lib/mock/survey";
import { useBreakpoint } from "@/lib/useBreakpoint";

export function SurveyGroups({ answers, onPick }: { answers: SurveyAnswers; onPick?: (i: number, n: number) => void }) {
  const mob = useBreakpoint() === "Mobile";
  return (
    <>
      {SURVEY_GROUPS.map((g, gi) => (
        <section key={g.title} className="flex flex-col gap-4" data-group={g.title}>
          <div className="flex items-center gap-4">
            <FeaturedIcon Color="Brand" Size="md" IconSwap={g.icon} />
            <SectionHeader Title={g.title} Badge={groupScore(answers, gi)} className="min-w-0 flex-1" />
          </div>
          <div className={cx("flex flex-col gap-6", !mob && "pl-16")}>
            {g.items.map((q, qi) => {
              const i = SURVEY_START[gi] + qi;
              return (
                <div key={q} className="flex flex-col gap-3" data-question={q}>
                  <InputLabel LabelText={qi + 1 + ". " + q} />
                  <Rating Point={answers[i] ?? 0} label={q} onChange={onPick ? (n) => onPick(i, n) : undefined} />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}
