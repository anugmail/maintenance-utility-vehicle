"use client";
/* แบบประเมินความพึงพอใจ (เรื่องแยก · BACKLOG ข้อ 75) ชิ้นที่ใช้ร่วม — ยกโครงจาก groupHead() / question() ของ contractor-eval-plugin (ประเมินผู้รับจ้าง)
   + เฟรม B ของเจ้าของงาน 12 พ.ย. 2569 (userflow/figma-ref/contractor-eval-ABC-2569-11-12.txt: "แต่ละข้อ = Rating ดาว + หมายเหตุข้อ n (ถ้ามี)")
   หัวด้าน = Featured icon (Color=Brand Size=md · ไอคอนด้าน) + Section header (ชื่อด้าน · Badge คะแนนด้าน "x/10") ช่องไฟ 16 กลางแนวตั้ง
   1 ข้อ = Input label (ข้อความตามแบบสำรวจ ไม่มี "(ถ้ามี)" = บังคับ) → ห่าง 12 → Rating ดาว 5 ดวง (ดาวเริ่มว่าง) → ห่าง 12 → Text input "หมายเหตุข้อ n" Optional (ไม่บังคับ · กว้างตั้งต้น 352 ของไลบรารี)
   desktop ข้อเยื้องตรงชื่อด้าน 64 (ไอคอน 48 + ช่อง 16) · มือถือไม่เยื้อง ช่องเต็มแถว Size=lg · ระหว่างข้อ 24 · หัวด้าน → ข้อ 16
   อ่านอย่างเดียว (บทบาทที่ไม่ใช่ผู้ดูแลยานพาหนะ) = Rating แสดงผล + Text input State=Readonly
   อ้างอิง: Featured icon · Section header · Input label · Rating · Text input ของไฟล์ Component + หน้าฟอร์มประเมินผู้รับจ้าง (contractor-eval-plugin evalForm) · COMPOSED.md ศ. */
import { FeaturedIcon } from "@/components/vms/FeaturedIcon";
import { InputLabel } from "@/components/vms/InputLabel";
import { Rating } from "@/components/vms/Rating";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { KIND, NO_LABEL, PROVIDER_LABEL, SAT_NOTE, SURVEY_GROUPS, SURVEY_START, groupScore, type EvalRow, type SurveyAnswers } from "@/lib/mock/survey";
import { useBreakpoint } from "@/lib/useBreakpoint";

export function SurveyGroups({ answers, notes, onPick, onNote }: { answers: SurveyAnswers; notes: string[]; onPick?: (i: number, n: number) => void; onNote?: (i: number, t: string) => void }) {
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
                  <TextInput LabelText={SAT_NOTE(i + 1)} Optional Size={mob ? "lg" : "md"} Text={notes[i] ?? ""} Placeholder="ระบุหมายเหตุ" readOnly={!onNote}
                    onChange={onNote ? (t) => onNote(i, t) : undefined} data-note={i + 1} className={mob ? "w-full" : "w-88 max-w-full"} />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </>
  );
}

/** กล่องข้อมูลงาน (ฟอร์ม · หน้าดูผล ใช้ร่วม) — ประเภทงาน · เลขที่งาน · ทะเบียน · ประเภทยานพาหนะ · ช่องตามประเภทงาน · วันที่ปิดงาน · หน่วยงานที่ให้บริการ (ระบบเติม อ่านอย่างเดียว) */
export const jobPairs = (r: EvalRow): [string, string][] => [["ประเภทงาน", KIND[r.kind][0]], [NO_LABEL[r.kind], r.no], ["ทะเบียน", r.plate], ["ประเภทยานพาหนะ", r.vtype],
  ...r.pairs, ["วันที่ปิดงาน", r.closedAt], [PROVIDER_LABEL, r.provider]];
