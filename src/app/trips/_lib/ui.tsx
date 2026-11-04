"use client";
/* ชิ้นประกอบหน้าของโฟลว์งานรายคัน (/trips/*) — ไม่ใช่ component ใหม่ จัดวางชิ้นไลบรารีตามตัวช่วยของ core.js / screens.js เท่านั้น
   ButtonRow = btnRow() · Grid = row() (มือถือเรียงลง · Spacer = ครึ่งแถว) · Section = col('Section', …, 16) · KvBox = kv()
   DataTable = tbl() + mobileCards() (+ กดแถวเปิดรายการ) · CannotPopup = cannotModal() · OilBlock = jobOil() + oilResult()
   PartEditModal = partEditModal() (+ ช่อง "จำนวนอะไหล่เก่า" "หมายเหตุ" ของหน้าปิดงาน) · PartAddModal = partAddModal() · BeforePhotos = photoFiles() (ผู้รับจ้างแก้ภาพก่อนเริ่มงาน)
   ใช้ร่วมทั้งแผนตรวจเอง (S10 S12) และแผนจ้าง (S23 S11) — ชิ้นเดียวทั้งโฟลว์ ไม่ทำซ้ำรายหน้า */
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { PopupModal } from "@/components/patterns/PopupModal";
import type { BadgeOutlineColor } from "@/components/vms/BadgeOutline";
import type { Crumb } from "@/components/vms/Breadcrumbs";
import type { KvPair } from "@/components/vms/ContentItemRow";
import { FileUpload, type UploadFile } from "@/components/vms/FileUpload";
import { HorizontalRadioGroups } from "@/components/vms/HorizontalRadioGroups";
import { MobileCards } from "@/components/vms/MobileTable";
import type { PillColor } from "@/components/vms/PillOutline";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import type { NewPart } from "@/lib/mock/hire";
import { carOf, getJob, getTrip, OIL_JOB_OPTS, OIL_RESULT_OPTS, oilSampled, patchJob, retRows, useJobs, type OilChoice, type OilSel, type PlanPart, type TripCar, type JobTrip } from "@/lib/mock/jobs";
import { useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

export const MENU_NAME = "บำรุงรักษาตามวาระ";
/* BADGE_OF — สีป้ายหัวหน้า (Badge outline มี 5 สี): Info → Brand · Warning → Brand */
export const badgeOf = ([t, c]: readonly [string, PillColor]): [string, BadgeOutlineColor] =>
  [t, c === "Info" || c === "Warning" || c === "Purple" ? "Brand" : c === "Gray" || c === "Success" || c === "Error" || c === "Brand" ? c : "Gray"];

export const tripHref = (t: JobTrip) => "/trips/detail/?trip=" + t.id;
export const jobHref = (t: JobTrip, carId: string, sub = "") => "/trips/job/" + sub + "?trip=" + t.id + "&car=" + carId;
/* Breadcrumbs ตาม pageHead(): ชื่อเมนู + ระดับกลาง + หน้าปัจจุบัน (ไลบรารีมี 3 ช่องลิงก์ — ช่องที่ 4 ของหน้ารับรถ/ปิดงานไม่แสดงตามจอ Figma)
   "แผน MR …" → หน้ารายละเอียดแผน /detail/ · "แผนเดินทาง ไตรมาส n" → หน้าแผนเดินทางของไตรมาส /quarter/trips/
   ผู้รับจ้างไม่มีหน้ารายละเอียดแผน/รายการแผนเดินทาง (Q48) ⇒ สองช่องนี้เป็นข้อความเฉย ๆ */
export const planHref = (t: JobTrip) => "/detail/?id=" + t.planId;
export const quarterTripsHref = (t: JobTrip) => "/quarter/trips/?id=" + t.planId + "&q=" + t.q;
export const tripCrumbs = (t: JobTrip, vendor = false): Crumb[] => [{ Text: MENU_NAME, href: "/" }, { Text: "แผน " + t.planMr, href: vendor ? undefined : planHref(t) },
  { Text: "แผนเดินทาง " + t.quarter, href: vendor ? undefined : quarterTripsHref(t) }, { Text: t.name }];
export const jobCrumbs = (t: JobTrip, last: string, vendor = false): Crumb[] => [{ Text: MENU_NAME, href: "/" }, { Text: "แผนเดินทาง " + t.quarter, href: vendor ? undefined : quarterTripsHref(t) },
  { Text: t.name, href: tripHref(t) }, { Text: last }];
/** Breadcrumbs ตามบทบาทที่เปิดอยู่ (เรียกบนสุดของ component) */
export function useCrumbs() {
  const vendor = useRole() === "ผู้รับจ้าง";
  return { trip: (t: JobTrip) => tripCrumbs(t, vendor), job: (t: JobTrip, last: string) => jobCrumbs(t, last, vendor) };
}

/* อ่าน ?trip=&car= + บทบาท */
export function useTripCar() {
  const sp = useSearchParams();
  const s = useJobs();
  const role = useRole();
  const trip = getTrip(s, sp.get("trip"));
  const carId = sp.get("car") ?? "";
  const car = trip && trip.carIds.includes(carId) ? carOf(carId) : undefined;
  const job = trip && car ? getJob(s, trip.id, car.id) : undefined;
  const vendor = role === "ผู้รับจ้าง";
  /* ทำงานในหน้างานได้: กบค. กับแผนตรวจเอง · ผู้รับจ้างกับแผนจ้าง */
  const actor = !!trip && ((trip.mode === "self" && role === "กบค.") || (trip.mode === "hire" && vendor));
  return { s, sp, role, trip, car, job, vendor, actor, kbk: role === "กบค." };
}

export function useBack() {
  const router = useRouter();
  return (href?: string) => (href ? router.push(href) : window.history.length > 1 ? router.back() : router.push("/"));
}

/* btnRow(): desktop ปุ่มแรกชิดซ้าย ปุ่มท้ายชิดขวา (ปุ่มเดียวชิดขวา) · มือถือเต็มกว้าง แบ่งเท่ากัน */
export function ButtonRow({ children }: { children: ReactNode }) {
  const mob = useBreakpoint() === "Mobile";
  return <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1" : "justify-between gap-3 [&>*:only-child]:ml-auto")}>{children}</div>;
}
/* row(): ช่องกว้างเท่ากัน ช่องไฟ 24 · n = จำนวนคอลัมน์ (มากกว่าลูก = มี Spacer) · มือถือเรียงลง ช่องไฟ 16 */
export function Grid({ n = 2, children, className }: { n?: 2 | 3; children: ReactNode; className?: string }) {
  const mob = useBreakpoint() === "Mobile";
  return <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6", className)}>{children}</div>;
}
export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx("flex flex-col gap-4", className)}>{children}</section>;
}
/* kv() ใต้ Section header (หน้า Create/Edit) */
export const KvBox = ({ pairs }: { pairs: KvPair[] }) => <DisplayBox pairs={pairs} />;

/* ตาราง: desktop Table · มือถือ Mobile table (การ์ด) · onRow = กดแถวเปิดรายการ (ยกเว้นกดปุ่มในแถว) */
export function DataTable({ cols, rows, onRow, rowKey }: { cols: TableColumn[]; rows: TableValue[][]; onRow?: (i: number) => void; rowKey?: (r: TableValue[], i: number) => string }) {
  const mob = useBreakpoint() === "Mobile";
  if (mob) return <MobileCards columns={cols} rows={rows} rowKey={rowKey} />;
  const click = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (!onRow || el.closest("button, a, input")) return;
    const tr = el.closest("tbody tr");
    if (tr?.parentElement) onRow(Array.from(tr.parentElement.children).indexOf(tr));
  };
  return <div onClick={click} className={onRow ? "[&_tbody_tr]:cursor-pointer" : undefined}><Table columns={cols} rows={rows} rowKey={rowKey} /></div>;
}

/* ---------- popup บำรุงรักษาไม่ได้ (cannotModal) — สาเหตุ + อะไหล่ส่งคืน (RET_COLS) ---------- */
export const RET_COLS: TableColumn[] = [{ head: "ชื่ออะไหล่", Style: "Lead text" }, { head: "จำนวนตามแผน", width: 170 }, { head: "จำนวนที่ใช้", width: 170 }, { head: "จำนวนที่คืน", width: 170 }];
export function RetTable({ parts, used }: { parts: Pick<PlanPart, "part" | "planQty" | "unit">[]; used?: number[] | null }) {
  return <DataTable cols={RET_COLS} rows={retRows(parts, used)} />;
}
export function CannotPopup({ open, car, parts, used, reason, error, onReason, onOk, onCancel }: {
  open: boolean; car: TripCar; parts: PlanPart[]; used: number[] | null; reason: string; error: boolean;
  onReason: (v: string) => void; onOk: () => void; onCancel: () => void;
}) {
  return (
    <PopupModal open={open} title={"บำรุงรักษาไม่ได้ · " + car.plate} width={800} ok="ยืนยัน" onOk={onOk} onCancel={onCancel}>
      <TextArea LabelText="สาเหตุที่บำรุงรักษาไม่ได้" Text={reason} Placeholder="ระบุสาเหตุที่บำรุงรักษาไม่ได้" onChange={onReason}
        State={error ? "Error" : undefined} HelperText={error ? "กรุณาระบุสาเหตุที่บำรุงรักษาไม่ได้" : undefined} />
      <Section>
        <SectionHeader Title="อะไหล่ส่งคืน" Badge={parts.length} />
        <RetTable parts={parts} used={used} />
      </Section>
    </PopupModal>
  );
}

/* ---------- น้ำมันไฮโดรลิก (jobOil) + ผลการทดสอบ (oilResult) ---------- */
export function OilCards({ value, onChange, Disabled }: { value: OilChoice; onChange?: (k: OilChoice) => void; Disabled?: boolean }) {
  return <RadioTextCards options={OIL_JOB_OPTS.map((Text) => ({ Text }))} value={OIL_JOB_OPTS[value]} Disabled={Disabled}
    onChange={(v) => onChange?.(OIL_JOB_OPTS.indexOf(v as (typeof OIL_JOB_OPTS)[number]) as OilChoice)} />;
}
export function LastOil({ car }: { car: TripCar }) {
  return <Grid><TextInput LabelText="เปลี่ยนน้ำมันครั้งล่าสุด" Text={car.lastOil} State="Readonly" readOnly /></Grid>;
}
/* ช่องผลการทดสอบ: Horizontal radio groups ครึ่งแถว + File upload (PDF JPG PNG สูงสุด 10 ไฟล์ แถบความคืบหน้า) */
export function OilResultFields({ sel, files, optional, error, readonly, onSel, onFiles, onDelete }: {
  sel: OilSel; files: UploadFile[]; optional?: boolean; error?: boolean; readonly?: boolean;
  onSel?: (s: OilSel) => void; onFiles?: (f: File[]) => void; onDelete?: (i: number) => void;
}) {
  return (
    <>
      <Grid>
        <HorizontalRadioGroups Label={"ผลการทดสอบ" + (optional ? " (ถ้ามี)" : "")} options={OIL_RESULT_OPTS} value={sel >= 0 ? OIL_RESULT_OPTS[sel] : null} Disabled={readonly}
          onChange={(v) => onSel?.(OIL_RESULT_OPTS.indexOf(v) as OilSel)} Error={error} HelperText={error ? "กรุณาเลือกผลการทดสอบ" : undefined} />
      </Grid>
      <FileUpload LabelText="ไฟล์ผลการทดสอบ" Optional files={files} hint="PDF, JPG, PNG · สูงสุด 10 ไฟล์" bar readonly={readonly} accept=".pdf,.jpg,.jpeg,.png"
        onFiles={onFiles} onDelete={onDelete} />
    </>
  );
}
export { oilSampled };

/* ไฟล์ที่เลือก → แถวไฟล์ของ File upload (ขนาดแบบ "2.4 MB" / "420 KB") */
export const toUpload = (f: File): UploadFile => ({ name: f.name, size: f.size >= 1e6 ? (f.size / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(f.size / 1024)) + " KB", bar: true });

/* ---------- popup แก้ไขอะไหล่ (partEditModal) — รายการงาน · จำนวนตามแผน · จำนวนที่ใช้จริง · จำนวนที่คืน (= ตามแผน − ใช้จริง)
   extra = หน้าปิดงาน (+ จำนวนอะไหล่เก่า · หมายเหตุ ตามหัวคอลัมน์ตาราง) · ใช้จริงเกินแผนไม่ได้ (แถวที่เพิ่มเองไม่มีแผน) ⇒ ปุ่ม "บันทึก" Disabled ---------- */
export interface PartEditItem { part: string; task: string; planQty: number; unit: string; used: number; old?: number; note?: string; added?: boolean }
export interface PartEditValue { used: number; old: number; note: string }
const onlyDigits = (v: string) => v.replace(/\D/g, "");
export function PartEditModal({ item, extra, onSave, onCancel }: { item: PartEditItem | null; extra?: boolean; onSave: (v: PartEditValue) => void; onCancel: () => void }) {
  return item ? <PartEditBody key={item.part} item={item} extra={extra} onSave={onSave} onCancel={onCancel} /> : null;
}
function PartEditBody({ item, extra, onSave, onCancel }: { item: PartEditItem; extra?: boolean; onSave: (v: PartEditValue) => void; onCancel: () => void }) {
  const [used, setUsed] = useState(String(item.used));
  const [old, setOld] = useState(String(item.old ?? 0));
  const [note, setNote] = useState(item.note ?? "");
  const u = Number(used || 0);
  const ok = used !== "" && (item.added || item.planQty <= 0 || u <= item.planQty);
  return (
    <PopupModal open title={"แก้ไขอะไหล่ · " + item.part} ok="บันทึก" okDisabled={!ok} onCancel={onCancel} onOk={() => ok && onSave({ used: u, old: Number(old || 0), note: note.trim() })}>
      <TextInput LabelText="รายการงาน" Text={item.task} State="Readonly" readOnly />
      <Grid n={3}>
        <TextInput LabelText="จำนวนตามแผน" Text={item.planQty + " " + item.unit} State="Readonly" readOnly />
        <TextInput LabelText={"จำนวนที่ใช้จริง (" + item.unit + ")"} Text={used} Placeholder="0" inputMode="numeric" onChange={(v) => setUsed(onlyDigits(v))} />
        <TextInput LabelText="จำนวนที่คืน" Text={Math.max(0, item.planQty - u) + " " + item.unit} State="Readonly" readOnly />
      </Grid>
      {extra && (
        <Grid>
          <TextInput LabelText="จำนวนอะไหล่เก่า" Text={old} Placeholder="0" inputMode="numeric" onChange={(v) => setOld(onlyDigits(v))} />
          <TextInput LabelText="หมายเหตุ" Optional Text={note} Placeholder="ระบุหมายเหตุ" onChange={setNote} />
        </Grid>
      )}
    </PopupModal>
  );
}

/* ---------- popup เพิ่มอะไหล่ที่ใช้จริง (partAddModal) — ชื่ออะไหล่ · รหัสอะไหล่ (ถ้ามี) · จำนวนที่ใช้จริง + หน่วย (Input dropdown)
   ไม่มีข้อความ error ในสเปก ⇒ ปุ่ม "เพิ่ม" กดได้เมื่อกรอกครบ ---------- */
const UNITS = ["ชิ้น", "ลิตร"];   // หน่วยของอะไหล่ในข้อมูลตัวอย่าง (PARTS)
const EMPTY_PART: NewPart = { name: "", code: "", qty: "", unit: "" };
export function PartAddModal({ open, onAdd, onCancel }: { open: boolean; onAdd: (p: NewPart) => void; onCancel: () => void }) {
  const [p, setP] = useState<NewPart>(EMPTY_PART);
  const [unitOpen, setUnitOpen] = useState(false);
  if (!open) return null;
  const ok = !!p.name.trim() && /^\d+$/.test(p.qty) && Number(p.qty) > 0 && !!p.unit;
  const close = () => { setP(EMPTY_PART); onCancel(); };
  return (
    <PopupModal open title="เพิ่มอะไหล่ที่ใช้จริง" ok="เพิ่ม" okDisabled={!ok} onCancel={close} onOk={() => { if (!ok) return; onAdd(p); setP(EMPTY_PART); }}>
      <TextInput LabelText="ชื่ออะไหล่" Text={p.name} Placeholder="ระบุชื่ออะไหล่" onChange={(name) => setP({ ...p, name })} />
      <TextInput LabelText="รหัสอะไหล่" Optional Text={p.code} Placeholder="ระบุรหัสอะไหล่" onChange={(code) => setP({ ...p, code })} />
      <Grid>
        <TextInput LabelText="จำนวนที่ใช้จริง" Text={p.qty} Placeholder="0" inputMode="numeric" onChange={(qty) => setP({ ...p, qty: onlyDigits(qty) })} />
        <InputDropdown LabelText="หน่วย" Text={p.unit} Placeholder="เลือกหน่วย" open={unitOpen} onOpenChange={setUnitOpen}>
          <DropdownList>
            {UNITS.map((u) => <DropdownListItem key={u} Text={u} State={u === p.unit ? "Selected" : "Default"} onClick={() => { setP({ ...p, unit: u }); setUnitOpen(false); }} />)}
          </DropdownList>
        </InputDropdown>
      </Grid>
    </PopupModal>
  );
}

/* ---------- ภาพก่อนเริ่มงาน แก้ไขได้ (ผู้รับจ้าง · photoFiles()) — File upload: แถบความคืบหน้าเดินทีละ 20% ทุก 0.7 วิ (จำลอง) ครบแล้วเข้ารายการภาพของงาน
   ไฟล์ที่ไม่ใช่ JPG/PNG = State Error · สูงสุด 10 ภาพ ---------- */
interface Uploading extends UploadFile { id: number; progress: number }
export function BeforePhotos({ trip, car, photos }: { trip: JobTrip; car: TripCar; photos: UploadFile[] }) {
  const [ups, setUps] = useState<Uploading[]>([]);
  const active = ups.some((u) => !u.err);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setUps((us) => us.map((u) => (u.err ? u : { ...u, progress: Math.min(100, u.progress + 20) }))), 700);
    return () => clearInterval(t);
  }, [active]);
  useEffect(() => {
    const done = ups.filter((u) => !u.err && u.progress >= 100);
    if (!done.length) return;
    patchJob(trip.id, car.id, (j) => ({ ...j, photos: [...(j.photos ?? []), ...done.map((u) => ({ name: u.name, size: u.size, bar: true }))].slice(0, 10) }));
    setUps((us) => us.filter((u) => !done.some((d) => d.id === u.id)));
  }, [ups, trip.id, car.id]);
  const onFiles = (fs: File[]) => {
    const room = 10 - photos.length - ups.length;
    setUps((us) => [...us, ...fs.slice(0, Math.max(0, room)).map((f, i) => ({ ...toUpload(f), bar: false, id: Date.now() + i, progress: 0, err: !/\.(jpe?g|png)$/i.test(f.name) }))]);
  };
  const onDelete = (i: number) => {
    if (i < photos.length) patchJob(trip.id, car.id, (j) => ({ ...j, photos: (j.photos ?? []).filter((_, k) => k !== i) }));
    else { const u = ups[i - photos.length]; setUps((us) => us.filter((x) => x.id !== u?.id)); }
  };
  return <FileUpload LabelText="ภาพก่อนเริ่มงาน" hint="JPG, PNG · สูงสุด 10 ภาพ" bar accept="image/jpeg,image/png" files={[...photos, ...ups]} onFiles={onFiles} onDelete={onDelete} onDownload={() => {}} />;
}
