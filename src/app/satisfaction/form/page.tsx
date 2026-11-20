"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { Alert } from "@/components/vms/Alert";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TextArea } from "@/components/vms/TextArea";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { EVAL_AT, SAT_ALERT, SAT_CONFIRM, SAT_FAIL, SAT_LEAVE, SAT_OK, SAT_REMARK, SAT_SAMPLES, SAT_TITLE, SAMPLE_FORM_REMARK, SURVEY_COUNT,
  SURVEY_INFO, SURVEY_INFO_TITLE, SURVEY_MAX, answered, average, canEvaluate, emptyAnswers, emptyNotes, evalRecord, legacyId, sampleAnswers, sampleNotes, satResultHref, saveSurvey,
  surveyDone, total, type SurveyAnswers } from "@/lib/mock/survey";
import { useProtoForm } from "@/lib/protoForm";
import { useSample } from "@/lib/useSample";
import { ButtonRow } from "../../trips/_lib/ui";
import { SurveyGroups, jobPairs, useSatGuard } from "../_lib/ui";

function SatForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(SAT_SAMPLES);
  const out = useSatGuard();
  const keeper = canEvaluate(useRole());
  const mock = useMock();
  const [answers, setAnswers] = useState<SurveyAnswers>(emptyAnswers);
  const [notes, setNotes] = useState<string[]>(emptyNotes);
  const [remark, setRemark] = useState("");
  const [dlg, setDlg] = useState<"save" | "leave" | null>(null);
  const saved = useRef(false);
  const id = sp.get("id") ?? legacyId(sp.get("trip"), sp.get("car"));
  const r0 = pending ? undefined : evalRecord(mock, id);
  const dirty = answers.some((x) => x != null) || notes.some((x) => !!x.trim()) || !!remark.trim();
  useProtoForm(keeper && r0 && !r0.evaluated ? {
    fill: () => { setAnswers(sampleAnswers()); setNotes(sampleNotes()); setRemark(SAMPLE_FORM_REMARK); },
    clear: () => { setAnswers(emptyAnswers()); setNotes(emptyNotes()); setRemark(""); }, dirty } : null);
  useEffect(() => { if (r0?.evaluated && !saved.current) router.replace(satResultHref(r0)); }, [r0, router]);
  if (pending || out) return null;
  if (!r0) return <EmptyStateSearchNotFound />;
  if (r0.evaluated) return null;
  const r = r0;
  const n = answered(answers), sum = total(answers);
  const leave = () => router.push("/satisfaction/");
  const cancel = () => (dirty ? setDlg("leave") : leave());
  const spec: ConfirmSpec | null = dlg === "save" ? SAT_CONFIRM(r, sum) : dlg === "leave" ? SAT_LEAVE : null;
  const ok = () => {
    if (dlg === "leave") { setDlg(null); leave(); return; }
    if (!surveyDone(answers)) return;
    setDlg(null);
    if (mock.failSave) { notify(SAT_FAIL, "Error"); return; }
    saved.current = true;
    saveSurvey(r, answers, notes, remark);
    notify(SAT_OK(r.no));
    router.push("/satisfaction/?tab=1");
  };

  return (
    <>
      <PageHeader Title={SAT_TITLE + " " + r.no} onBack={cancel} crumbs={[{ Text: SAT_TITLE, href: "/satisfaction/" }, { Text: r.no }]} />
      <div className="flex flex-col gap-8" data-survey>
        <section className="flex flex-col gap-4" data-job>
          <SectionHeader Title="ข้อมูลงาน" />
          <DisplayBox pairs={[...jobPairs(r), ["วันที่ประเมิน", EVAL_AT.slice(0, 10)], ["ผู้ประเมิน", r.caretaker]]} />
        </section>
        <section className="flex flex-col gap-4">
          <SectionHeader Title={SURVEY_INFO_TITLE} />
          <DisplayBox pairs={SURVEY_INFO.map((l, i) => [l, r.info[i]] as [string, string])} />
        </section>
        <Alert Color="Info" Text={SAT_ALERT[0]} SupportingText={SAT_ALERT[1]} />
        <SurveyGroups answers={answers} notes={notes}
          onPick={keeper ? (i, v) => setAnswers((a) => a.map((x, k) => (k === i ? v : x))) : undefined}
          onNote={keeper ? (i, t) => setNotes((a) => a.map((x, k) => (k === i ? t : x))) : undefined} />
        <section className="flex flex-col gap-4">
          <SectionHeader Title={SAT_REMARK} />
          <TextArea LabelText={SAT_REMARK} Optional Text={remark} Placeholder="ระบุหมายเหตุหรือข้อเสนอแนะ" onChange={setRemark} readOnly={!keeper} />
        </section>
        <section className="flex flex-col gap-4" data-summary>
          <SectionHeader Title="สรุปคะแนน" />
          <DisplayBox pairs={[["ให้คะแนนแล้ว", n + " / " + SURVEY_COUNT + " ข้อ"], ["คะแนนรวม", sum + " / " + SURVEY_MAX], ["ค่าเฉลี่ย", n ? average(answers) + " จาก 5" : "-"], ["ผลระดับ", "รอเคาะเกณฑ์"]]} />
        </section>
        <ButtonRow>
          <SecondaryButton Text="ยกเลิก" Size="lg" onClick={cancel} />
          {keeper && <PrimaryButton Text="บันทึกการประเมิน" Size="lg" State={surveyDone(answers) ? "Default" : "Disabled"} onClick={() => surveyDone(answers) && setDlg("save")} />}
        </ButtonRow>
      </div>
      <ConfirmDialog spec={spec} onCancel={() => setDlg(null)} onOk={ok} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SatForm /></Suspense></AppFrame>;
}
