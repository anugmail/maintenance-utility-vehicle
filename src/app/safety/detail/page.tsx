"use client";
/* S26 Safety Inspection · หน้ารายละเอียดของยานพาหนะ 1 คัน (/safety/detail/?car=<ทะเบียนไม่มีจังหวัด>) — เจ้าของงาน 11 พ.ย. 2569 (BACKLOG ข้อ 67)
   รอบ 2: _"safety inspection มี 2 หน้า คือหน้า list และหน้ารายละเอียด หน้ารายละเอียดเพิ่มผลโดยการอัปโหลด และเลือกได้ว่า ผ่าน ไม่ผ่าน ยกเลิก"_ + รอบ 3 ตัวเลือก ผ่าน · ไม่ผ่าน · ระงับ
   (ที่อยู่เดิม /safety/upload/ พาไปที่นี่ · MovedTo)
   Page header (ทะเบียน · ย้อนกลับ · Breadcrumbs งานซ่อมและบำรุงรักษา › Safety Inspection › ทะเบียน · Actions = Primary button "เพิ่มผล" ไอคอน add แบบ "สร้างแผน" ของรายการแผน)
   → VehicleAndReporterInfo "ข้อมูลยานพาหนะ" (ทะเบียน รหัสยานพาหนะ ยี่ห้อ/รุ่น ประเภท สังกัด)
   → VehicleAndReporterInfo "ผล Safety Inspection ล่าสุด" (วันที่ตรวจ ผล ครบกำหนดครั้งถัดไป บันทึกโดย) + File upload readonly รายการไฟล์ ปุ่มดาวน์โหลด (ข้อ 67ข)
   → Section label "ประวัติผล Safety Inspection (n)" + ตาราง (วันที่ตรวจ · ผล Pill · เอกสาร · บันทึกโดย) ใหม่สุดก่อน / Empty state/Data empty
       แถวที่ไม่ได้บันทึกจากหน้านี้ (ค่าตั้งต้น · เอกสารตอนปิดงาน S10) บันทึกโดย "-" · เอกสารตอนปิดงาน S10 มีชื่อไฟล์ · คอลัมน์ท้าย ปุ่มดาวน์โหลดไฟล์ละปุ่ม
   ดาวน์โหลด (เจ้าของงาน 11 พ.ย. 2569 "ต้องสามารถดาวน์โหลดเอกสารหลังจากอัปโหลดเอกสารได้"): lib/fileDownload.ts — ไฟล์ที่เลือกในแท็บนี้ = ไฟล์จริง · อื่นๆ = ไฟล์ข้อความแทนชื่อเดียวกัน
   เพิ่มผล = PopupModal (Modal ของไลบรารี · มือถือ Bottom sheet · แบบ popup วันเวลาปิดงาน S10) "เพิ่มผล Safety Inspection":
       Text input วันที่ตรวจ + Date picker Type=Single ภาษาไทย (ไม่เกินวันนี้ · ตั้งต้น 10/11/2569) · Input label "ผล Safety Inspection" + Radio text card ×3 ผ่าน · ไม่ผ่าน · ระงับ
       · File upload "เอกสาร Safety Inspection" PDF JPG PNG สูงสุด 10 ไฟล์ แสดงรายการไฟล์ (ชนิดอื่น = Error "รองรับเฉพาะไฟล์ PDF, JPG, PNG") · มือถือมีปุ่ม "ถ่ายรูป" (กล้องหลัง) · ไม่มีช่องหมายเหตุ
       · ปุ่ม ยกเลิก / บันทึก (Disabled จนมีไฟล์และเลือกผล · ลบไฟล์จนหมด = File upload Error)
       บันทึก → toast "บันทึกผล Safety Inspection สำเร็จ" · อยู่หน้าเดิม ผลล่าสุดและประวัติเปลี่ยนทันที (เสนอ · BACKLOG ค.)
   ผู้ดูแลยานพาหนะ: ดูอย่างเดียว ไม่มีปุ่มเพิ่มผล · ยานพาหนะที่ไม่อยู่ในรายการ → กลับหน้ารายการ */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { PopupModal } from "@/components/patterns/PopupModal";
import { DatePicker } from "@/components/vms/DatePicker";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { FileUpload, type UploadFile } from "@/components/vms/FileUpload";
import { InputLabel } from "@/components/vms/InputLabel";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import { TextInput } from "@/components/vms/TextInput";
import { MA_TODAY, dayOf } from "@/lib/mock/maintenance";
import { roleUnit } from "@/lib/mock/planFlow";
import { PEOPLE, thaiNow } from "@/lib/mock/jobs";
import { SAFETY_HREF, SAFETY_TITLE, dueCell, useSafetyCars, type SafetyCar } from "@/lib/mock/safety";
import { SAFETY_NONE, SAFETY_PILL, SAFETY_RESULTS, saveSafety, type SafetyResult } from "@/lib/mock/safetyStore";
import { notify, useRole } from "@/lib/mock/store";
import { useProtoForm } from "@/lib/protoForm";
import { TH_PICKER } from "@/lib/thaiDate";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { downloadFile, rememberFiles } from "@/lib/fileDownload";
import { Section, toUpload } from "@/app/trips/_lib/ui";
import { MaGrid, type MaValue } from "@/app/vehicles/_lib/ui";
import { SAFETY_ROOT, resultPill, useSafetyAccess } from "../_lib/ui";

/* ข้อ 67ข: คอลัมน์ท้าย = Action icons ไอคอน download-24-300-round (Download action ของ _File upload item base) ไฟล์ละ 1 ปุ่ม */
const HIST_COLS: TableColumn[] = [{ head: "วันที่ตรวจ", width: 140, Style: "Lead text" }, { head: "ผล", width: 150, Style: "Badge" }, { head: "เอกสาร" }, { head: "บันทึกโดย", width: 280 },
  { head: "", width: 120, Style: "Action icons" }];
const FILE_ERR = "กรุณาแนบเอกสาร Safety Inspection อย่างน้อย 1 ไฟล์";
/* ชนิดไฟล์ (เจ้าของงาน 11 พ.ย. 2569 "ไฟล์รองรับ ไฟล์ pdf jpeg png ถ่ายรูปได้" · BACKLOG ข้อ 67ค) — ลากวางข้ามตัวกรอง accept ได้ ⇒ ตรวจซ้ำตอนรับไฟล์ */
const ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const TYPE_ERR = "รองรับเฉพาะไฟล์ PDF, JPG, PNG";
const okType = (f: File) => /\.(pdf|jpe?g|png)$/i.test(f.name) || ["application/pdf", "image/jpeg", "image/png"].includes(f.type);
const toThai = (d: Date) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + (d.getFullYear() + 543);
const fromThai = (v: string) => { const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };
const TODAY_D = fromThai(MA_TODAY)!;
const dueText = (c: SafetyCar) => { const d = dueCell(c); return typeof d === "string" ? d : d.text + (d.sub ? " (" + d.sub + ")" : ""); };

/* ประวัติ: ครั้งที่บันทึกจากหน้านี้ + ครั้งล่าสุดก่อนหน้า (base) · ใหม่สุดก่อน (วันเท่ากัน = ที่บันทึกทีหลังก่อน) */
interface HistItem { date: string; result?: SafetyResult; files: UploadFile[]; by: string; at?: string; n: number }
function historyOf(c: SafetyCar): HistItem[] {
  const up: HistItem[] = c.uploads.map((u, n) => ({ date: u.date, result: u.result, files: u.files, by: u.savedBy, at: u.savedAt, n: n + 1 }));
  const base: HistItem[] = c.base ? [{ date: c.base.date, result: c.base.result, files: c.base.files ?? [], by: "-", n: 0 }] : [];
  return [...base, ...up].sort((a, b) => dayOf(b.date) - dayOf(a.date) || b.n - a.n);
}

function AddResult({ open, carId, onClose }: { open: boolean; carId: string; onClose: () => void }) {
  const role = useRole();
  const [date, setDate] = useState(MA_TODAY);
  const [cal, setCal] = useState(false);
  const [result, setResult] = useState<SafetyResult | null>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [touched, setTouched] = useState(false);
  const [badType, setBadType] = useState(false);
  const [seen, setSeen] = useState(false);
  const mob = useBreakpoint() === "Mobile";
  const cam = useRef<HTMLInputElement>(null);
  const reset = () => { setDate(MA_TODAY); setCal(false); setResult(null); setFiles([]); setTouched(false); setBadType(false); };
  /* รับไฟล์ (เลือก · ลากวาง · ถ่ายรูป): ชนิดไม่รองรับ = ไม่รับ + Error · จำไฟล์จริงไว้ดาวน์โหลด (lib/fileDownload.ts) */
  const take = (fs: File[]) => {
    const good = fs.filter(okType);
    setBadType(good.length < fs.length);
    rememberFiles(good);
    setFiles((x) => [...x, ...good.map(toUpload)].slice(0, 10));
  };
  /* เปิด popup ใหม่ = ค่าเริ่ม (แบบ DateTimeModal) */
  if (open && !seen) { reset(); setSeen(true); }
  if (!open && seen) setSeen(false);
  /* ปุ่มต้นแบบ (แถบต้นแบบ · CLAUDE.md ข้อ 17) เมื่อ popup เปิด: กรอกข้อมูลตัวอย่าง = วันนี้ · ผ่าน · ไฟล์ 1 ไฟล์ · ล้างค่า = ค่าเริ่มของ popup */
  useProtoForm(open ? {
    fill: () => { setDate(MA_TODAY); setResult(0); setFiles((x) => (x.length ? x : [{ name: "Safety-Inspection-" + carId + ".pdf", size: "1.2 MB", bar: true }])); setTouched(false); },
    clear: reset,
    dirty: result != null || files.length > 0 || date !== MA_TODAY,
  } : null);
  const canSave = !!fromThai(date) && result != null && files.length > 0;
  const save = () => {
    if (!canSave || result == null) return;
    saveSafety(carId, { date, result, files, savedAt: thaiNow(), savedBy: PEOPLE.staff[0] + " (" + (roleUnit(role) ?? role) + ")" });
    notify("บันทึกผล Safety Inspection สำเร็จ");
    onClose();
  };
  const fileErr = badType || (touched && files.length === 0);
  return (
    <PopupModal open={open} title="เพิ่มผล Safety Inspection" sub="แนบเอกสารผลการตรวจ และเลือกผล" width={640} ok="บันทึก" okDisabled={!canSave} onOk={save} onCancel={onClose}>
      <div className="flex flex-col gap-4">
        <TextInput LabelText="วันที่ตรวจ" LeadingIconSwap="calendar_month-24-300-round" Text={date} Placeholder="วว/ดด/ปปปป" readOnly State={cal ? "Focused" : "Filled"} onClick={() => setCal(true)} />
        {cal && <div className="flex"><DatePicker Type="Single" {...TH_PICKER} max={TODAY_D} today={TODAY_D} value={{ start: fromThai(date) ?? TODAY_D, end: fromThai(date) ?? TODAY_D }} month={fromThai(date) ?? TODAY_D}
          onCancel={() => setCal(false)} onApply={(r) => { if (r.start) setDate(toThai(r.start)); setCal(false); }} /></div>}
        <div className="flex flex-col gap-2">
          <InputLabel LabelText="ผล Safety Inspection" />
          <RadioTextCards options={SAFETY_RESULTS.map((Text) => ({ Text }))} value={result == null ? null : SAFETY_RESULTS[result]}
            onChange={(v) => setResult(SAFETY_RESULTS.indexOf(v as (typeof SAFETY_RESULTS)[number]) as SafetyResult)} />
        </div>
        <FileUpload LabelText="เอกสาร Safety Inspection" files={files} hint="PDF, JPG, PNG · สูงสุด 10 ไฟล์" bar accept={ACCEPT}
          Error={fileErr} HelperText={badType ? TYPE_ERR : fileErr ? FILE_ERR : undefined}
          onDownload={(i) => downloadFile(files[i].name)}
          onFiles={take} onDelete={(i) => { setFiles((x) => x.filter((_, k) => k !== i)); setTouched(true); setBadType(false); }} />
        {/* ถ่ายรูป (มือถือ): ไลบรารีไม่มี File upload แบบกล้อง และต้นแบบยังไม่มีจุดถ่ายรูป ⇒ Secondary button ไอคอน photo_camera + input accept="image/*" capture="environment" (BACKLOG ค.) */}
        {mob && <>
          <SecondaryButton Text="ถ่ายรูป" LeadingIconSwap="photo_camera-24-300-round" Size="lg" disabled={files.length >= 10} onClick={() => cam.current?.click()} />
          <input ref={cam} type="file" hidden accept="image/*" capture="environment" aria-label="ถ่ายรูปเอกสาร Safety Inspection" data-camera
            onChange={(e) => { take(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
        </>}
      </div>
    </PopupModal>
  );
}

function SafetyDetail() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const { ok, owner } = useSafetyAccess();
  const cars = useSafetyCars(owner);
  const c = cars.find((x) => x.id === sp.get("car"));
  const [adding, setAdding] = useState(false);
  const [page, setPage] = useState(1);
  useEffect(() => { if (ok && !c) router.replace(SAFETY_HREF); }, [ok, c, router]);
  if (!ok || !c) return null;

  const plate = c.car.plate;
  const hist = historyOf(c);
  const latest = hist[0];
  const rows: MaValue[][] = hist.map((h) => {
    const dl = h.files.map((f) => ({ IconSwap: "download-24-300-round", label: "ดาวน์โหลด " + f.name, onClick: () => downloadFile(f.name) }));
    return [h.date, { pills: [h.result == null ? SAFETY_NONE : SAFETY_PILL[h.result]] }, h.files.map((f) => f.name).join(", ") || "-", h.at ? { text: h.by, sub: h.at } : h.by, { actions: dl, mobileActions: dl }];
  });
  const latestFiles = latest && latest.date === c.last ? latest.files : [];
  const add = owner ? undefined : <PrimaryButton Text="เพิ่มผล" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setAdding(true)} />;

  return (
    <>
      <PageHeader Title={plate} onBack={() => router.push(SAFETY_HREF)} crumbs={[{ Text: SAFETY_ROOT }, { Text: SAFETY_TITLE, href: SAFETY_HREF }, { Text: plate }]} Actions={add} />
      <VehicleAndReporterInfo pairs={[["ทะเบียน", plate], ["รหัสยานพาหนะ", c.peaId], ["ยี่ห้อ/รุ่น", c.car.model], ["ประเภทยานพาหนะ", c.car.type], ["สังกัดยานพาหนะ", c.car.owner]]} />
      <VehicleAndReporterInfo Title="ผล Safety Inspection ล่าสุด" pairs={[["วันที่ตรวจ", c.last ?? "-"], ["ผล", resultPill(c)[0]], ["ครบกำหนดครั้งถัดไป", dueText(c)],
        ["บันทึกโดย", latest && latest.date === c.last ? latest.by : "-"]]} />
      {/* เอกสารของผลล่าสุด = File upload readonly + Download action (ข้อ 67ข · ไฟล์แนบแบบหน้างานรายคัน S10) */}
      {latestFiles.length > 0 && <FileUpload LabelText="เอกสาร Safety Inspection ล่าสุด" readonly bar files={latestFiles} onDownload={(i) => downloadFile(latestFiles[i].name)} />}
      <Section>
        <SectionLabel Title={"ประวัติผล Safety Inspection (" + hist.length + ")"} />
        {rows.length ? <MaGrid cols={HIST_COLS} rows={rows} page={page} onPage={setPage} />
          : <EmptyStateDataEmpty Text="ยังไม่มีผล Safety Inspection" SupportingText={owner ? undefined : "กดเพิ่มผลเพื่อแนบเอกสารและบันทึกผลการตรวจของยานพาหนะคันนี้"} />}
      </Section>
      {!owner && <AddResult open={adding} carId={c.id} onClose={() => setAdding(false)} />}
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><SafetyDetail /></Suspense></AppFrame>;
}
