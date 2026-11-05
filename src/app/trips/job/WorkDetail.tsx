"use client";
/* S10 P6 · งานรายคัน เสร็จสิ้น (ดู) — workDetail() ใน screens.js + S12 ส่วน "ผลการทดสอบน้ำมันไฮโดรลิก" (4 พ.ย. 2569 ทางเดียวที่บันทึกผลหลังปิดงาน)
   Page header (ทะเบียน · ป้าย "เสร็จสิ้น" · ไม่มีปุ่ม) → VehicleAndReporterInfo "ข้อมูลยานพาหนะและงาน" (14) → IncidentPhotoGallery "ภาพก่อนเริ่มงาน (n)" (ไม่มีภาพตอนจบงาน)
   → Section label "รายการงานและอะไหล่ที่ใช้จริง (n)" + Table WORK_COLS2 → Section label "ค่าใช้จ่ายของรถคันนี้ (บาท)" + Table + กล่องสรุป
   → (เฉพาะคันที่เก็บตัวอย่าง) Section label "ผลการทดสอบน้ำมันไฮโดรลิก": Horizontal radio groups ผ่าน/ไม่ผ่าน (ครึ่งแถว) + File upload + กล่อง เก็บตัวอย่างเมื่อ / บันทึกผลเมื่อ
     + ปุ่ม "บันทึกผลการทดสอบ" (ต้องเลือกผล "กรุณาเลือกผลการทดสอบ" · บันทึกแล้วแก้ได้อีก · toast "บันทึกผลการทดสอบน้ำมันไฮโดรลิกสำเร็จ") — บันทึกได้เฉพาะ กบค.
   → (เฉพาะรถเครน/รถกระเช้า 4 พ.ย. 2569) Section label "Safety Inspection": File upload "เอกสาร Safety Inspection" (ไฟล์จากหน้าปิดงาน) + กล่อง บันทึกเอกสารเมื่อ
     + ปุ่ม "บันทึกเอกสาร Safety Inspection" (toast "บันทึกเอกสาร Safety Inspection สำเร็จ") — ตาม "File upload" "Section label" "Primary button" ของไฟล์ Component
     + จอ S10 "หน้างานรายคัน — เพิ่มเอกสาร Safety Inspection ภายหลัง" / "บันทึกเอกสาร Safety Inspection สำเร็จ" · บันทึกได้เฉพาะ กบค. บทบาทอื่นดูรายการไฟล์อย่างเดียว */
import { useEffect, useState } from "react";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { FileUpload, type UploadFile } from "@/components/vms/FileUpload";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import {
  BUDGET_CUT, closeRows, costSummary, emptyClose, nf, OIL_JOB_OPTS, OIL_DEFAULT, oilSampled, ownerCostCenter, personSum, safetyOn, saveOilResult, saveSafetyDocs, tripRangeShort, WSTAT,
  type Job, type JobTrip, type OilSel, type TripCar,
} from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { badgeOf, ButtonRow, DataTable, useCrumbs, KvBox, OilResultFields, Section, toUpload, tripHref, useBack } from "../_lib/ui";
import { vehiclePairs } from "./JobPage";

const WORK_COLS2: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ที่ใช้", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "จำนวนที่ใช้จริง", width: 140 }, { head: "หน่วย", width: 110 }];
const COST_COLS: TableColumn[] = [{ head: "พนักงาน กบค. ซ่อม", Style: "Lead text" }, { head: "ค่าเบี้ยเลี้ยง/วัน", width: 150 }, { head: "ค่าที่พัก/วัน", width: 150 }, { head: "จำนวนวัน", width: 120 }, { head: "รวม", width: 150 }];

export function WorkDetail({ trip, car, job, kbk }: { trip: JobTrip; car: TripCar; job: Job; kbk: boolean }) {
  const crumbs = useCrumbs();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const f = job.close ?? emptyClose(job, trip, car);
  const oil = job.oilChoice ?? OIL_DEFAULT;
  const res = job.oilResult;
  const [sel, setSel] = useState<OilSel>(res?.sel ?? -1);
  const [files, setFiles] = useState<UploadFile[]>(res?.files ?? []);
  const [err, setErr] = useState(false);
  useEffect(() => { setSel(res?.sel ?? -1); setFiles(res?.files ?? []); }, [res?.sel, res?.files]);
  const sf = job.safety;
  const sfInit = sf?.files ?? f.safetyFiles ?? [];
  const [safety, setSafety] = useState<UploadFile[]>(sfInit);
  useEffect(() => { setSafety(sf?.files ?? f.safetyFiles ?? []); }, [sf?.files, f.safetyFiles]);

  const pairs: [string, string][] = [...vehiclePairs(trip, car), ["แผน", trip.planMr], ["แผนเดินทาง", trip.name + " · " + tripRangeShort(trip)],
    ["เริ่มงาน", job.startedAt ?? "-"], ["ปิดงาน", job.closedAt ?? "-"], ["ผู้บันทึก", job.recordedBy ?? "-"], ["น้ำมันไฮโดรลิก", OIL_JOB_OPTS[oil]],
    ["เลขไมล์หลังทำ", job.kmAfter ?? "-"], ["ชั่วโมงเครื่องจักรหลังทำ", job.hoursAfter ?? "-"]];
  const taskOf = (part: string) => job.parts.find((p) => p.part === part)?.task ?? "-";
  const work = closeRows(f).map((r) => [taskOf(r.part), r.part, String(r.planQty), String(r.used), r.unit]);
  const costs = f.costs.filter((r) => r.name).map((r) => [r.name!, nf(Number(r.perDiem.replace(/\D/g, "")) || 0), nf(Number(r.lodging.replace(/\D/g, "")) || 0), String(r.days ?? 0), nf(personSum(r))]);
  const sum = costSummary(f);
  const photos = job.photos ?? [];
  const save = () => {
    if (sel < 0) { setErr(true); return; }
    saveOilResult(trip, car.id, sel, files);
    notify("บันทึกผลการทดสอบน้ำมันไฮโดรลิกสำเร็จ");
  };
  const saveSafety = () => {
    saveSafetyDocs(trip, car.id, safety);
    notify("บันทึกเอกสาร Safety Inspection สำเร็จ");
  };

  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} />
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะและงาน" pairs={pairs} />
      <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + photos.length + ")"} photos={photos.map((p) => ({ alt: p.name }))} />
      <Section>
        <SectionLabel Title={"รายการงานและอะไหล่ที่ใช้จริง (" + work.length + ")"} />
        <DataTable cols={WORK_COLS2} rows={work} />
      </Section>
      <Section>
        <SectionLabel Title="ค่าใช้จ่ายของรถคันนี้ (บาท)" />
        <DataTable cols={COST_COLS} rows={costs} />
        <KvBox pairs={[["รวมค่าเบี้ยเลี้ยง", nf(sum.perDiem) + " บาท"], ["รวมค่าที่พัก", nf(sum.lodging) + " บาท"], ["ค่าเดินทาง (รวมทุกคน)", nf(sum.travel) + " บาท"],
          ["รวมค่าใช้จ่ายของรถคันนี้", nf(sum.total) + " บาท"], ["งบที่ตัด", BUDGET_CUT[f.budgetType ?? 0]], ["ศูนย์ต้นทุน", f.costCenter ?? ownerCostCenter(car)]]} />
      </Section>
      {oilSampled(oil) && (
        <Section>
          <SectionLabel Title="ผลการทดสอบน้ำมันไฮโดรลิก" />
          <OilResultFields sel={sel} files={files} error={err} readonly={!kbk}
            onSel={(v) => { setSel(v); setErr(false); }}
            onFiles={(fs) => setFiles((x) => [...x, ...fs.map(toUpload)].slice(0, 10))} onDelete={(i) => setFiles((x) => x.filter((_, k) => k !== i))} />
          <KvBox pairs={[["เก็บตัวอย่างเมื่อ", (res?.sampledAt || job.closedAt?.slice(0, 10) || "-") + " โดย " + (res?.sampledBy || job.recordedBy || "-")],
            ...(res?.savedAt ? [["บันทึกผลเมื่อ", res.savedAt + " โดย " + (res.savedBy ?? "-")] as [string, string]] : [])]} />
          {kbk && <ButtonRow><PrimaryButton Text="บันทึกผลการทดสอบ" Size={mob ? "lg" : "md"} onClick={save} /></ButtonRow>}
        </Section>
      )}
      {safetyOn(car) && (
        <Section>
          <SectionLabel Title="Safety Inspection" />
          <FileUpload LabelText="เอกสาร Safety Inspection" Optional files={safety} hint="PDF, PNG, or JPG (สูงสุด 10 ไฟล์)" bar readonly={!kbk} accept=".pdf,.jpg,.jpeg,.png"
            onFiles={(fs) => setSafety((x) => [...x, ...fs.map(toUpload)].slice(0, 10))} onDelete={(i) => setSafety((x) => x.filter((_, k) => k !== i))} />
          {sf?.savedAt && <KvBox pairs={[["บันทึกเอกสารเมื่อ", sf.savedAt + " โดย " + (sf.savedBy ?? "-")]]} />}
          {kbk && <ButtonRow><PrimaryButton Text="บันทึกเอกสาร Safety Inspection" Size={mob ? "lg" : "md"} onClick={saveSafety} /></ButtonRow>}
        </Section>
      )}
    </>
  );
}
