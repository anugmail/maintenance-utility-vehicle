"use client";
/* S26 Safety Inspection · หน้าอัปโหลดเอกสารของยานพาหนะ 1 คัน (/safety/upload/?car=<ทะเบียนไม่มีจังหวัด>) — เจ้าของงาน 11 พ.ย. 2569 (BACKLOG ข้อ 67)
   _"หน้าอัปโหลดเอกสาร จะแสดงไฟล์อัปโหลด และเลือกได้ว่า ผ่าน ไม่ผ่าน ยุบสภาพ"_
   Page header (ทะเบียน · ย้อนกลับ · Breadcrumbs งานซ่อมและบำรุงรักษา › Safety Inspection › ทะเบียน)
   → VehicleAndReporterInfo "ข้อมูลยานพาหนะ" (ทะเบียน ยี่ห้อ/รุ่น ประเภท สังกัด · ครั้งล่าสุด ผลล่าสุด ครบกำหนดครั้งถัดไป)
   → Section label "บันทึกผล Safety Inspection": Text input วันที่ตรวจ (ไอคอน calendar_month · กดเปิด Date picker Type=Single ภาษาไทย แบบช่องวันที่ของ popup วันเวลาปิดงาน S10 · ไม่เกินวันนี้)
       · Input label "ผล Safety Inspection" + Radio text card ×3 ผ่าน · ไม่ผ่าน · ยุบสภาพ (บังคับ · แบบตัวเลือกน้ำมันไฮดรอลิก S10)
       · File upload "เอกสาร Safety Inspection" PDF JPG สูงสุด 10 ไฟล์ แสดงรายการไฟล์ (File upload item base · ชุดเดียวกับหน้าปิดงาน S10) · บังคับอย่างน้อย 1 ไฟล์
       · ไม่มีช่องหมายเหตุ (ไลบรารีไม่มีช่องหมายเหตุคู่กับ Radio text card ในจอที่อ้างอิง — BACKLOG ค.)
       · ปุ่ม ยกเลิก (Secondary) · บันทึก (Primary · Disabled จนมีไฟล์และเลือกผล) → toast "บันทึกผล Safety Inspection สำเร็จ" → กลับหน้ารายการ แถวเปลี่ยนเป็นวันและผลใหม่
       · ลบไฟล์จนหมดหลังแนบแล้ว = File upload Error "กรุณาแนบเอกสาร Safety Inspection อย่างน้อย 1 ไฟล์"
   → Section label "ประวัติ Safety Inspection (n)" ตารางครั้งที่บันทึกจากหน้านี้ (วันที่ตรวจ · ผล · เอกสาร · บันทึกโดย) / Empty state/Data empty
   ผู้ดูแลยานพาหนะ: ดูอย่างเดียว (ไม่มีส่วนบันทึกผล) · ยานพาหนะที่ไม่อยู่ในรายการ (ไม่ต้องตรวจ / นอกขอบเขต) → กลับหน้ารายการ */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { DatePicker } from "@/components/vms/DatePicker";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { FileUpload, type UploadFile } from "@/components/vms/FileUpload";
import { InputLabel } from "@/components/vms/InputLabel";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import { TextInput } from "@/components/vms/TextInput";
import { MA_TODAY } from "@/lib/mock/maintenance";
import { roleUnit } from "@/lib/mock/planFlow";
import { PEOPLE, thaiNow } from "@/lib/mock/jobs";
import { SAFETY_HREF, SAFETY_TITLE, dueCell, useSafetyCars } from "@/lib/mock/safety";
import { SAFETY_PILL, SAFETY_RESULTS, saveSafety, type SafetyResult } from "@/lib/mock/safetyStore";
import { notify, useRole } from "@/lib/mock/store";
import { useProtoForm } from "@/lib/protoForm";
import { TH_PICKER } from "@/lib/thaiDate";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ButtonRow, Grid, Section, toUpload } from "@/app/trips/_lib/ui";
import { MaGrid, type MaValue } from "@/app/vehicles/_lib/ui";
import { SAFETY_ROOT, resultPill, useSafetyAccess } from "../_lib/ui";

const HIST_COLS: TableColumn[] = [{ head: "วันที่ตรวจ", width: 140, Style: "Lead text" }, { head: "ผล", width: 150, Style: "Badge" }, { head: "เอกสาร" }, { head: "บันทึกโดย", width: 260 }];
const FILE_ERR = "กรุณาแนบเอกสาร Safety Inspection อย่างน้อย 1 ไฟล์";
const toThai = (d: Date) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + (d.getFullYear() + 543);
const fromThai = (v: string) => { const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };
const TODAY_D = fromThai(MA_TODAY)!;

function SafetyUpload() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const role = useRole();
  const { ok, owner } = useSafetyAccess();
  const cars = useSafetyCars(owner);
  const c = cars.find((x) => x.id === sp.get("car"));
  const [date, setDate] = useState(MA_TODAY);
  const [cal, setCal] = useState(false);
  const [result, setResult] = useState<SafetyResult | null>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [touched, setTouched] = useState(false);
  useEffect(() => { if (ok && !c) router.replace(SAFETY_HREF); }, [ok, c, router]);
  /* ปุ่มต้นแบบ (แถบต้นแบบ · CLAUDE.md ข้อ 17): กรอกข้อมูลตัวอย่าง = วันนี้ · ผ่าน · ไฟล์ 1 ไฟล์ · ล้างค่า = ค่าเริ่มของฟอร์ม */
  useProtoForm(ok && c && !owner ? {
    fill: () => { setDate(MA_TODAY); setResult(0); setFiles((x) => (x.length ? x : [{ name: "Safety-Inspection-" + c.id + ".pdf", size: "1.2 MB", bar: true }])); setTouched(false); },
    clear: () => { setDate(MA_TODAY); setResult(null); setFiles([]); setTouched(false); setCal(false); },
    dirty: result != null || files.length > 0 || date !== MA_TODAY,
  } : null);
  if (!ok || !c) return null;

  const plate = c.car.plate;
  const back = () => router.push(SAFETY_HREF);
  const canSave = !!fromThai(date) && result != null && files.length > 0;
  const save = () => {
    if (!canSave || result == null) return;
    saveSafety(c.id, { date, result, files, savedAt: thaiNow(), savedBy: PEOPLE.staff[0] + " (" + (roleUnit(role) ?? role) + ")" });
    notify("บันทึกผล Safety Inspection สำเร็จ");
    back();
  };
  const fileErr = touched && files.length === 0;
  const hist: MaValue[][] = [...c.uploads].reverse().map((u) => [u.date, { pills: [SAFETY_PILL[u.result]] }, u.files.map((f) => f.name).join(", ") || "-", { text: u.savedBy, sub: u.savedAt }]);

  return (
    <>
      <PageHeader Title={plate} onBack={back} crumbs={[{ Text: SAFETY_ROOT }, { Text: SAFETY_TITLE, href: SAFETY_HREF }, { Text: plate }]} />
      <VehicleAndReporterInfo pairs={[["ทะเบียน", plate], ["รหัสยานพาหนะ", c.peaId], ["ยี่ห้อ/รุ่น", c.car.model], ["ประเภทยานพาหนะ", c.car.type], ["สังกัดยานพาหนะ", c.car.owner],
        ["Safety Inspection ล่าสุด", c.last ?? "-"], ["ผลล่าสุด", resultPill(c)[0]], ["ครบกำหนดครั้งถัดไป", (() => { const d = dueCell(c); return typeof d === "string" ? d : d.text + (d.sub ? " (" + d.sub + ")" : ""); })()]]} />
      {!owner && (
        <Section>
          <SectionLabel Title="บันทึกผล Safety Inspection" SupportingText="แนบเอกสารผลการตรวจ และเลือกผล" />
          <Grid>
            <div className="flex flex-col gap-2">
              <TextInput LabelText="วันที่ตรวจ" LeadingIconSwap="calendar_month-24-300-round" Text={date} Placeholder="วว/ดด/ปปปป" readOnly State={cal ? "Focused" : "Filled"} onClick={() => setCal(true)} />
              {cal && <div className="flex"><DatePicker Type="Single" {...TH_PICKER} max={TODAY_D} today={TODAY_D} value={{ start: fromThai(date) ?? TODAY_D, end: fromThai(date) ?? TODAY_D }} month={fromThai(date) ?? TODAY_D}
                onCancel={() => setCal(false)} onApply={(r) => { if (r.start) setDate(toThai(r.start)); setCal(false); }} /></div>}
            </div>
          </Grid>
          <div className="flex flex-col gap-2">
            <InputLabel LabelText="ผล Safety Inspection" />
            <RadioTextCards options={SAFETY_RESULTS.map((Text) => ({ Text }))} value={result == null ? null : SAFETY_RESULTS[result]} row={false}
              onChange={(v) => setResult(SAFETY_RESULTS.indexOf(v as (typeof SAFETY_RESULTS)[number]) as SafetyResult)} />
          </div>
          <FileUpload LabelText="เอกสาร Safety Inspection" files={files} hint="PDF, JPG · สูงสุด 10 ไฟล์" bar accept=".pdf,.jpg,.jpeg"
            Error={fileErr} HelperText={fileErr ? FILE_ERR : undefined}
            onFiles={(fs) => setFiles((x) => [...x, ...fs.map(toUpload)].slice(0, 10))} onDelete={(i) => { setFiles((x) => x.filter((_, k) => k !== i)); setTouched(true); }} />
          <ButtonRow>
            <SecondaryButton Text="ยกเลิก" Size={mob ? "lg" : "md"} onClick={back} />
            <PrimaryButton Text="บันทึก" Size={mob ? "lg" : "md"} State={canSave ? "Default" : "Disabled"} disabled={!canSave} onClick={save} />
          </ButtonRow>
        </Section>
      )}
      <Section>
        <SectionLabel Title={"ประวัติ Safety Inspection (" + hist.length + ")"} />
        {hist.length ? <MaGrid cols={HIST_COLS} rows={hist} page={1} onPage={() => {}} />
          : <EmptyStateDataEmpty Text="ยังไม่มีประวัติการบันทึกผล" SupportingText="เมื่อบันทึกผล Safety Inspection ของยานพาหนะคันนี้ รายการจะมาอยู่ที่นี่" />}
      </Section>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SafetyUpload /></Suspense></AppFrame>;
}
