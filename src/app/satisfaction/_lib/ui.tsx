"use client";
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

export const jobPairs = (r: EvalRow): [string, string][] => [["ประเภทงาน", KIND[r.kind][0]], [NO_LABEL[r.kind], r.no], ["ทะเบียน", r.plate], ["ประเภทยานพาหนะ", r.vtype],
  ...r.pairs, ["วันที่ปิดงาน", r.closedAt], [PROVIDER_LABEL, r.provider]];
