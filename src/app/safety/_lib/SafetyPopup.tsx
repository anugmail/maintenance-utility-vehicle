"use client";
import { useState } from "react";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { PopupModal } from "@/components/patterns/PopupModal";
import { ContentDivider } from "@/components/vms/ContentDivider";
import { DatePicker } from "@/components/vms/DatePicker";
import { FileUpload, type UploadFile } from "@/components/vms/FileUpload";
import { InputLabel } from "@/components/vms/InputLabel";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { TextInput } from "@/components/vms/TextInput";
import { PEOPLE, thaiNow } from "@/lib/mock/jobs";
import { MA_TODAY } from "@/lib/mock/maintenance";
import { roleUnit } from "@/lib/mock/planFlow";
import { dueCell, type SafetyCar } from "@/lib/mock/safety";
import { SAFETY_CYCLES, SAFETY_RESULTS, cycleText, saveSafety, type SafetyCycle, type SafetyResult } from "@/lib/mock/safetyStore";
import { notify, useRole } from "@/lib/mock/store";
import { downloadFile, rememberFiles } from "@/lib/fileDownload";
import { useProtoForm } from "@/lib/protoForm";
import { TH_PICKER } from "@/lib/thaiDate";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { toUpload } from "@/app/trips/_lib/ui";
import { resultPill } from "./ui";

const FILE_ERR = "กรุณาแนบเอกสารการตรวจ ปจ.2 อย่างน้อย 1 ไฟล์";
const ACCEPT = ".pdf,application/pdf";
const TYPE_ERR = "รองรับเฉพาะไฟล์ PDF";
const okType = (f: File) => /\.pdf$/i.test(f.name) || f.type === "application/pdf";
const toThai = (d: Date) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + (d.getFullYear() + 543);
const fromThai = (v: string) => { const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };
const TODAY_D = fromThai(MA_TODAY)!;
const dueText = (c: SafetyCar) => { const d = dueCell(c); return typeof d === "string" ? d : d.text + (d.sub ? " (" + d.sub + ")" : ""); };
export function latestFiles(c: SafetyCar): UploadFile[] {
  if (!c.last) return [];
  const up = [...c.uploads].reverse().find((u) => u.date === c.last);
  return up ? up.files : c.base?.date === c.last ? c.base.files ?? [] : [];
}

export function SafetyPopup({ car: c, readonly, onClose }: { car: SafetyCar | null; readonly?: boolean; onClose: () => void }) {
  const role = useRole();
  const mob = useBreakpoint() === "Mobile";
  const [date, setDate] = useState(MA_TODAY);
  const [cal, setCal] = useState(false);
  const [result, setResult] = useState<SafetyResult | null>(null);
  const [cycle, setCycle] = useState<SafetyCycle | null>(12);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [touched, setTouched] = useState(false);
  const [badType, setBadType] = useState(false);
  const [seen, setSeen] = useState<string | null>(null);
  const reset = () => { setDate(MA_TODAY); setCal(false); setResult(null); setCycle(c?.cycle ?? 12); setFiles([]); setTouched(false); setBadType(false); };
  const key = c?.id ?? null;
  if (key !== seen) { if (key) reset(); setSeen(key); }
  const take = (fs: File[]) => {
    const good = fs.filter(okType);
    setBadType(good.length < fs.length);
    rememberFiles(good);
    setFiles((x) => [...x, ...good.map(toUpload)].slice(0, 10));
  };
  useProtoForm(c && !readonly ? {
    fill: () => { setDate(MA_TODAY); setResult(0); setCycle(c.cycle ?? 12); setFiles((x) => (x.length ? x : [{ name: "Safety-Inspection-" + c.id + ".pdf", size: "1.2 MB", bar: true }])); setTouched(false); setBadType(false); },
    clear: reset,
    dirty: result != null || files.length > 0 || date !== MA_TODAY || cycle !== (c?.cycle ?? 12),
  } : null);
  if (!c) return null;

  const canSave = !readonly && !!fromThai(date) && result != null && cycle != null && files.length > 0;
  const save = () => {
    if (!canSave || result == null || cycle == null) return;
    saveSafety(c.id, { date, result, cycle, files, savedAt: thaiNow(), savedBy: PEOPLE.staff[0] + " (" + (roleUnit(role) ?? role) + ")" });
    notify("บันทึกผลการตรวจ ปจ.2 สำเร็จ");
    onClose();
  };
  const fileErr = badType || (touched && files.length === 0);
  const lf = latestFiles(c);
  const summary = c.car.plate + " · " + c.peaId + " · " + c.car.type;
  return (
    <PopupModal open title="ผลการตรวจ ปจ.2" sub={summary} width={640}
      ok="บันทึก" okDisabled={!canSave} onOk={save} onCancel={onClose} showOk={!readonly} cancel={readonly ? "ปิด" : "ยกเลิก"}>
      <div className="flex flex-col gap-4">
        {mob && <p className="text-sm text-gray-600">{summary}</p>}
        <DisplayBox Title="ผลล่าสุด" perRow={2} pairs={[["วันที่ตรวจ", c.last ?? "-"], ["วาระการตรวจ", c.cycle ? cycleText(c.cycle) : "-"], ["ผล", resultPill(c)[0]], ["ครบกำหนดครั้งถัดไป", dueText(c)]]} />
        {lf.length > 0 && <FileUpload LabelText="เอกสารผลล่าสุด" readonly bar files={lf} onDownload={(i) => downloadFile(lf[i].name)} />}
        {!readonly && <>
          <ContentDivider />
          <TextInput LabelText="วันที่ตรวจ" LeadingIconSwap="calendar_month-24-300-round" Text={date} Placeholder="วว/ดด/ปปปป" readOnly State={cal ? "Focused" : "Filled"} onClick={() => setCal(true)} />
          {cal && <div className="flex"><DatePicker Type="Single" {...TH_PICKER} max={TODAY_D} today={TODAY_D} value={{ start: fromThai(date) ?? TODAY_D, end: fromThai(date) ?? TODAY_D }} month={fromThai(date) ?? TODAY_D}
            onCancel={() => setCal(false)} onApply={(r) => { if (r.start) setDate(toThai(r.start)); setCal(false); }} /></div>}
          <div className="flex flex-col gap-2">
            <InputLabel LabelText="วาระการตรวจ" />
            <RadioTextCards row options={SAFETY_CYCLES.map((n) => ({ Text: cycleText(n) }))} value={cycle == null ? null : cycleText(cycle)}
              onChange={(v) => setCycle(SAFETY_CYCLES.find((n) => cycleText(n) === v) ?? null)} />
          </div>
          <div className="flex flex-col gap-2">
            <InputLabel LabelText="ผลการตรวจ" />
            <RadioTextCards options={SAFETY_RESULTS.map((Text) => ({ Text }))} value={result == null ? null : SAFETY_RESULTS[result]}
              onChange={(v) => setResult(SAFETY_RESULTS.indexOf(v as (typeof SAFETY_RESULTS)[number]) as SafetyResult)} />
          </div>
          <FileUpload LabelText="เอกสารการตรวจ ปจ.2" files={files} hint="PDF · สูงสุด 10 ไฟล์" bar accept={ACCEPT}
            Error={fileErr} HelperText={badType ? TYPE_ERR : fileErr ? FILE_ERR : undefined}
            onDownload={(i) => downloadFile(files[i].name)}
            onFiles={take} onDelete={(i) => { setFiles((x) => x.filter((_, k) => k !== i)); setTouched(true); setBadType(false); }} />
        </>}
      </div>
    </PopupModal>
  );
}
