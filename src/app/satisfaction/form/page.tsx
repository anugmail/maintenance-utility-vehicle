"use client";
/* S27 Y.4–Y.10 · ฟอร์ม ประเมินความพึงพอใจ (/satisfaction/form/?trip=T1&car=82-6789) — satForm() ใน screens.js · ยกโครงจาก evalForm() ของ contractor-eval-plugin (ประเมินผู้รับจ้าง)
   หน้า Create ⇒ Section header (R3) · Page header "ประเมินความพึงพอใจ {เลขที่ MR} · {ทะเบียน}" ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › ประเมินความพึงพอใจ › ทะเบียน
   Content ช่องไฟ 32:
     ข้อมูลงานบำรุงรักษา (เลขที่ MR · แผนเดินทาง · ประเภทยานพาหนะ · วันดำเนินการ · ผู้ดำเนินการ · รับทราบเมื่อ) · ข้อมูลผู้ใช้รถฯ (5 ช่องตามแบบสำรวจ เติมให้ อ่านอย่างเดียว · กล่องแสดงข้อมูล)
     → Alert Info "ให้คะแนนทุกข้อ 1 ถึง 5 ดาว" (สเกลตามแบบสำรวจ · เต็ม 55) → 4 ด้าน (หัวด้าน Featured icon + Section header Badge "x/10" · ข้อ = Input label + Rating)
     → หมายเหตุ/ข้อเสนอแนะเพิ่มเติม (Text area ไม่บังคับ · ช่องเดียวท้ายฟอร์มแบบประเมินผู้รับจ้าง — แบบสำรวจ XCHO ไม่มี · เสนอ)
     → สรุปคะแนน (ให้คะแนนแล้ว n / 11 ข้อ · คะแนนรวม x / 55 · ค่าเฉลี่ย · ผลระดับ "รอเคาะเกณฑ์") → ยกเลิก / บันทึกการประเมิน (Disabled จนครบ 11 ข้อ)
   บันทึก → popup "ยืนยันการประเมิน" (บันทึกแล้วแก้ไขไม่ได้) → toast "ประเมินความพึงพอใจสำเร็จ ({ทะเบียน})" → รายการแท็บประเมินแล้ว
   ยกเลิก/ย้อนกลับระหว่างกรอก → popup "ยืนยันการออก" (ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก) · ยังไม่กรอก = ออกทันที · ผู้ประเมิน = ผู้ดูแลยานพาหนะ (บทบาทอื่นไม่มีปุ่มบันทึก)
   ประเมินแล้ว → พาไปหน้าดูผล · อ้างอิง: Page header · Section header · Alert · Featured icon · Input label · Rating · Text area · Primary/Secondary button ของไฟล์ Component + ConfirmDialog · DisplayBox (COMPOSED.md) */
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
import { SAT_ALERT, SAT_CONFIRM, SAT_LEAVE, SAT_OK, SAT_REMARK, SAT_SAMPLES, SAT_TITLE, SURVEY_COUNT, SURVEY_INFO, SURVEY_INFO_TITLE, SURVEY_MAX,
  answered, average, emptyAnswers, operatorOf, sampleAnswers, satRecord, satResultHref, saveSurvey, surveyDone, total, type SurveyAnswers } from "@/lib/mock/survey";
import { useProtoForm } from "@/lib/protoForm";
import { useSample } from "@/lib/useSample";
import { ButtonRow } from "../../trips/_lib/ui";
import { SurveyGroups } from "../_lib/ui";

function SatForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(SAT_SAMPLES);
  const keeper = useRole() === "ผู้ดูแลยานพาหนะ";
  const mock = useMock();
  const [answers, setAnswers] = useState<SurveyAnswers>(emptyAnswers);
  const [remark, setRemark] = useState("");
  const [dlg, setDlg] = useState<"save" | "leave" | null>(null);
  const saved = useRef(false);   // เพิ่งบันทึก ⇒ ไปรายการแท็บประเมินแล้ว (ไม่พาไปหน้าดูผล)
  const r0 = pending ? undefined : satRecord(mock, sp.get("trip"), sp.get("car"));
  const dirty = answers.some((x) => x != null) || !!remark.trim();
  /* ปุ่มต้นแบบ (แถบต้นแบบ · lib/protoForm.ts): กรอกข้อมูลตัวอย่าง = ครบ 11 ข้อ + หมายเหตุ (ค่าจอ Y.6) ⇒ บันทึกการประเมินกดได้ · ล้างค่า = ว่างทั้งฟอร์ม */
  useProtoForm(keeper && r0 && !r0.evaluated ? { fill: () => { setAnswers(sampleAnswers()); setRemark("ช่างมาตรงเวลา อธิบายงานที่ทำก่อนส่งคืนยานพาหนะ"); }, clear: () => { setAnswers(emptyAnswers()); setRemark(""); }, dirty } : null);
  useEffect(() => { if (r0?.evaluated && !saved.current) router.replace(satResultHref(r0)); }, [r0, router]);
  if (pending) return null;
  if (!r0) return <EmptyStateSearchNotFound />;
  if (r0.evaluated) return null;
  const r = r0;
  const [opName, opUnit] = operatorOf(r);
  const n = answered(answers), sum = total(answers);
  const leave = () => router.push("/satisfaction/");
  const cancel = () => (dirty ? setDlg("leave") : leave());
  const spec: ConfirmSpec | null = dlg === "save" ? SAT_CONFIRM(r.car.plate, sum) : dlg === "leave" ? SAT_LEAVE : null;
  const ok = () => {
    if (dlg === "leave") { setDlg(null); leave(); return; }
    if (!surveyDone(answers)) return;
    saved.current = true;
    saveSurvey(r, answers, remark);
    setDlg(null);
    notify(SAT_OK(r.car.plate));
    router.push("/satisfaction/?tab=1");
  };

  return (
    <>
      <PageHeader Title={SAT_TITLE + " " + r.mr + " · " + r.car.plate} onBack={cancel}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: SAT_TITLE, href: "/satisfaction/" }, { Text: r.car.plate }]} />
      <div className="flex flex-col gap-8" data-survey>
        <section className="flex flex-col gap-4">
          <SectionHeader Title="ข้อมูลงานบำรุงรักษา" />
          <DisplayBox pairs={[["เลขที่ MR", r.mr], ["แผนเดินทาง", r.trip.name], ["ประเภทยานพาหนะ", r.car.type], ["วันดำเนินการ", r.date || "-"],
            ["ผู้ดำเนินการ", opUnit ? opName + " (" + opUnit + ")" : opName], ["รับทราบเมื่อ", r.job.acceptedAt ?? "-"]]} />
        </section>
        <section className="flex flex-col gap-4">
          <SectionHeader Title={SURVEY_INFO_TITLE} />
          <DisplayBox pairs={SURVEY_INFO.map((l, i) => [l, r.info[i]] as [string, string])} />
        </section>
        <Alert Color="Info" Text={SAT_ALERT[0]} SupportingText={SAT_ALERT[1]} />
        <SurveyGroups answers={answers} onPick={keeper ? (i, v) => setAnswers((a) => a.map((x, k) => (k === i ? v : x))) : undefined} />
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
