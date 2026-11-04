"use client";
/* ชิ้นประกอบหน้าของโฟลว์งานรายคัน (/trips/*) — ไม่ใช่ component ใหม่ จัดวางชิ้นไลบรารีตามตัวช่วยของ core.js / screens.js เท่านั้น
   ButtonRow = btnRow() · Grid = row() (มือถือเรียงลง · Spacer = ครึ่งแถว) · Section = col('Section', …, 16) · KvBox = kv()
   DataTable = tbl() + mobileCards() (+ กดแถวเปิดรายการ) · CannotPopup = cannotModal() · OilBlock = jobOil() + oilResult() */
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { DisplayBox } from "@/components/patterns/DisplayBox";
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
import { carOf, getJob, getTrip, OIL_JOB_OPTS, OIL_RESULT_OPTS, oilSampled, retRows, useJobs, type OilChoice, type OilSel, type PlanPart, type TripCar, type JobTrip } from "@/lib/mock/jobs";
import { useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

export const MENU_NAME = "บำรุงรักษาตามวาระ";
/* BADGE_OF — สีป้ายหัวหน้า (Badge outline มี 5 สี): Info → Brand · Warning → Brand */
export const badgeOf = ([t, c]: [string, PillColor]): [string, BadgeOutlineColor] =>
  [t, c === "Info" || c === "Warning" || c === "Purple" ? "Brand" : c === "Gray" || c === "Success" || c === "Error" || c === "Brand" ? c : "Gray"];

export const tripHref = (t: JobTrip) => "/trips/detail/?trip=" + t.id;
export const jobHref = (t: JobTrip, carId: string, sub = "") => "/trips/job/" + sub + "?trip=" + t.id + "&car=" + carId;
/* Breadcrumbs ตาม pageHead(): ชื่อเมนู + ระดับกลาง + หน้าปัจจุบัน (ไลบรารีมี 3 ช่องลิงก์ — ช่องที่ 4 ของหน้ารับรถ/ปิดงานไม่แสดงตามจอ Figma)
   "แผน MR …" และ "แผนเดินทาง ไตรมาส n" เป็นหน้าของ batch อื่น — ยังไม่ผูกลิงก์ */
export const tripCrumbs = (t: JobTrip): Crumb[] => [{ Text: MENU_NAME, href: "/" }, { Text: "แผน " + t.planMr }, { Text: "แผนเดินทาง " + t.quarter }, { Text: t.name }];
export const jobCrumbs = (t: JobTrip, last: string): Crumb[] => [{ Text: MENU_NAME, href: "/" }, { Text: "แผนเดินทาง " + t.quarter }, { Text: t.name, href: tripHref(t) }, { Text: last }];

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
export function RetTable({ parts, used }: { parts: PlanPart[]; used?: number[] | null }) {
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
