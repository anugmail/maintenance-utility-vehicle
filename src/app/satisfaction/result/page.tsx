"use client";
/* S27 Y.11 · หน้า ผลประเมินความพึงพอใจ (/satisfaction/result/?trip=T1&car=82-1145) — satResult() ใน screens.js · ยกโครงจาก resultScreen() ของ contractor-eval-plugin (ประเมินผู้รับจ้าง)
   หน้า Detail ⇒ Section label (R5/R11) · Page header "ผลประเมินความพึงพอใจ {เลขที่ MR} · {ทะเบียน}" ป้าย "ประเมินแล้ว" ย้อนกลับ
   Content ช่องไฟ 32: ข้อมูลงานบำรุงรักษา · ข้อมูลผู้ใช้รถฯ → สรุปผลการประเมิน (คะแนนรวม x / 55 · ค่าเฉลี่ย · ผู้ประเมิน · วันที่ประเมิน · คะแนนรายด้าน · หมายเหตุ)
     → ต่อด้าน Section label "ชื่อด้าน x / 10" + Table (ข้อ · รายการประเมิน · คะแนน) · คะแนนเป็นตัวเลข 1–5 (แบบสำรวจไม่มีชื่อระดับ · ประเมินผู้รับจ้างมีชื่อระดับรอเคาะ)
   ไม่มีปุ่มพิมพ์แบบประเมิน (PDF) และไม่มีส่วนแนบแบบที่ลงนาม — แบบสำรวจตอบออนไลน์ ไม่มีผู้ลงนามฝั่งผู้ให้บริการ (เสนอ ยังไม่เคาะ)
   อ้างอิง: Page header · Section label · Table · Mobile table ของไฟล์ Component + DisplayBox (COMPOSED.md) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { Table, type TableColumn } from "@/components/vms/Table";
import { useMock } from "@/lib/mock/store";
import { SAT_REMARK, SAT_SAMPLES, SAT_TITLE, SURVEY_GROUPS, SURVEY_INFO, SURVEY_INFO_TITLE, SURVEY_MAX, SURVEY_START, average, groupScore, operatorOf, satRecord, total } from "@/lib/mock/survey";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "@/lib/useSample";
import { ButtonRow } from "../../trips/_lib/ui";

const DETAIL_COLS: TableColumn[] = [{ head: "ข้อ", width: 80 }, { head: "รายการประเมิน" }, { head: "คะแนน", width: 160 }];
const slash = (s: string) => s.replace("/", " / ");

function SatResult() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(SAT_SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  if (pending) return null;
  const r = satRecord(mock, sp.get("trip"), sp.get("car"));
  if (!r || !r.survey) return <EmptyStateSearchNotFound />;
  const a = r.survey.answers, [opName, opUnit] = operatorOf(r);
  const back = () => router.push("/satisfaction/?tab=1");
  return (
    <>
      <PageHeader Title={"ผล" + SAT_TITLE + " " + r.mr + " · " + r.car.plate} Badge={["ประเมินแล้ว", "Success"]} onBack={back}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: SAT_TITLE, href: "/satisfaction/?tab=1" }, { Text: r.car.plate }]} />
      <div className="flex flex-col gap-8">
        <DisplayBox Title="ข้อมูลงานบำรุงรักษา" pairs={[["เลขที่ MR", r.mr], ["แผนเดินทาง", r.trip.name], ["ประเภทยานพาหนะ", r.car.type], ["วันดำเนินการ", r.date || "-"],
          ["ผู้ดำเนินการ", opUnit ? opName + " (" + opUnit + ")" : opName], ["รับทราบเมื่อ", r.job.acceptedAt ?? "-"]]} />
        <DisplayBox Title={SURVEY_INFO_TITLE} pairs={SURVEY_INFO.map((l, i) => [l, r.info[i]] as [string, string])} />
        <DisplayBox Title="สรุปผลการประเมิน" pairs={([["คะแนนรวม", total(a) + " / " + SURVEY_MAX], ["ค่าเฉลี่ย", average(a) + " จาก 5"], ["ผู้ประเมิน", r.survey.by ?? r.caretaker], ["วันที่ประเมิน", r.survey.at ?? "-"]] as [string, string][])
          .concat(SURVEY_GROUPS.map((g, gi) => [g.title, slash(groupScore(a, gi))] as [string, string]), [[SAT_REMARK, r.survey.remark || "-"]])} />
        {SURVEY_GROUPS.map((g, gi) => {
          const rows = g.items.map((q, qi) => [String(qi + 1), q, String(a[SURVEY_START[gi] + qi])]);
          return (
            <section key={g.title} className="flex flex-col gap-4">
              <SectionLabel Title={g.title + " " + slash(groupScore(a, gi))} />
              {mob ? <MobileCards columns={DETAIL_COLS} rows={rows} /> : <Table columns={DETAIL_COLS} rows={rows} />}
            </section>
          );
        })}
        <ButtonRow><SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} /></ButtonRow>
      </div>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SatResult /></Suspense></AppFrame>;
}
