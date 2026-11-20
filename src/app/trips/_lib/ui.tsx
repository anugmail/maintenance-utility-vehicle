"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
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
import { PillOutline, type PillColor } from "@/components/vms/PillOutline";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { DatePicker } from "@/components/vms/DatePicker";
import { TH_PICKER } from "@/lib/thaiDate";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TablePagination } from "@/components/vms/TablePagination";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { carOf, getJob, getTrip, OIL_JOB_OPTS, OIL_RESULT_OPTS, oilSampled, retRows, useJobs, type NewPart, type OilChoice, type OilSel, type PlanPart, type TripCar, type JobTrip } from "@/lib/mock/jobs";
import { useMock, useRole } from "@/lib/mock/store";
import { canManage, usePlanGate } from "@/lib/mock/planFlow";
import { useBreakpoint } from "@/lib/useBreakpoint";

export const MENU_NAME = "บำรุงรักษาตามวาระ";
export const badgeOf = ([t, c]: readonly [string, PillColor]): [string, BadgeOutlineColor] =>
  [t, c === "Info" || c === "Warning" || c === "Purple" ? "Brand" : c === "Gray" || c === "Success" || c === "Error" || c === "Brand" ? c : "Gray"];

export const tripHref = (t: JobTrip) => "/trips/detail/?trip=" + t.id;
export const jobHref = (t: JobTrip, carId: string, sub = "") => "/trips/job/" + sub + "?trip=" + t.id + "&car=" + carId;
export const planHref = (t: JobTrip) => "/detail/?id=" + t.planId;
export const quarterTripsHref = (t: JobTrip) => "/quarter/trips/?id=" + t.planId + "&q=" + t.q;
export const tripCrumbs = (t: JobTrip): Crumb[] => [{ Text: MENU_NAME, href: "/" }, { Text: t.planName || t.planMr, href: planHref(t) },
  { Text: t.quarter, href: quarterTripsHref(t) }, { Text: t.name }];
export const jobCrumbs = (t: JobTrip, last: string): Crumb[] => [{ Text: MENU_NAME, href: "/" }, { Text: t.quarter, href: quarterTripsHref(t) },
  { Text: t.name, href: tripHref(t) }, { Text: last }];
export const useCrumbs = () => ({ trip: tripCrumbs, job: jobCrumbs });

export function useTripCar() {
  const sp = useSearchParams();
  const s = useJobs();
  const role = useRole();
  const trip = getTrip(s, sp.get("trip"));
  const carId = sp.get("car") ?? "";
  const car = trip && trip.carIds.includes(carId) ? carOf(carId) : undefined;
  const job = trip && car ? getJob(s, trip.id, car.id) : undefined;
  const plan = useMock().plans.find((x) => x.mr === trip?.planMr);
  const kbk = !!plan && canManage(role, plan);
  const vendor = role === "ผู้รับจ้าง" && trip?.mode === "hire";
  usePlanGate(plan);
  return { s, sp, role, trip, car, job, actor: !!trip && (kbk || vendor), kbk, vendor };
}

export function useBack() {
  const router = useRouter();
  return (href?: string) => (href ? router.push(href) : window.history.length > 1 ? router.back() : router.push("/"));
}

export function ButtonRow({ children }: { children: ReactNode }) {
  const mob = useBreakpoint() === "Mobile";
  return <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1" : "justify-between gap-3 [&>*:only-child]:ml-auto")}>{children}</div>;
}
export function Grid({ n = 2, children, className }: { n?: 2 | 3; children: ReactNode; className?: string }) {
  const mob = useBreakpoint() === "Mobile";
  return <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6", className)}>{children}</div>;
}
export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx("flex flex-col gap-4", className)}>{children}</section>;
}
export const KvBox = ({ pairs }: { pairs: KvPair[] }) => <DisplayBox pairs={pairs} />;

export function DataTable({ cols, rows: all, onRow, rowKey }: { cols: TableColumn[]; rows: TableValue[][]; onRow?: (i: number) => void; rowKey?: (r: TableValue[], i: number) => string }) {
  const mob = useBreakpoint() === "Mobile";
  const [page, setPage] = useState(1);
  const last = Math.max(1, Math.ceil(all.length / 10)), pg0 = Math.min(page, last), off = (pg0 - 1) * 10;
  const rows = all.slice(off, off + 10);
  const pager = all.length > 10 ? <TablePagination total={all.length} page={pg0} perPage={10} onPage={setPage} /> : undefined;
  const key = rowKey && ((r: TableValue[], i: number) => rowKey(r, off + i));
  if (mob) return <div className="flex flex-col gap-5"><MobileCards columns={cols} rows={rows} rowKey={key} />{pager}</div>;
  const click = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.target as HTMLElement;
    if (!onRow || el.closest("button, a, input")) return;
    const tr = el.closest("tbody tr");
    if (tr?.parentElement) onRow(off + Array.from(tr.parentElement.children).indexOf(tr));
  };
  return <div onClick={click} className={onRow ? "[&_tbody_tr]:cursor-pointer" : undefined}><Table columns={cols} rows={rows} rowKey={key} Pagination={pager} /></div>;
}

export const RET_COLS: TableColumn[] = [{ head: "ชื่ออะไหล่", Style: "Lead text" }, { head: "จำนวนตามแผน", width: 170 }, { head: "จำนวนที่ใช้", width: 170 }, { head: "จำนวนที่คืน", width: 170 }];
export function RetTable({ parts, used }: { parts: Pick<PlanPart, "part" | "planQty" | "unit">[]; used?: number[] | null }) {
  return <DataTable cols={RET_COLS} rows={retRows(parts, used)} />;
}
export function CannotPopup({ open, car, parts, used, reason, error, onReason, onOk, onCancel }: {
  open: boolean; car: TripCar; parts: PlanPart[]; used: number[] | null; reason: string; error: boolean;
  onReason: (v: string) => void; onOk: () => void; onCancel: () => void;
}) {
  return (
    <PopupModal open={open} title={"บำรุงรักษาไม่ได้ · " + car.plate} sub="ระบุสาเหตุ และตรวจรายการอะไหล่ของงานนี้เพื่อยืนยันการส่งคืน" width={800} ok="ยืนยัน" onOk={onOk} onCancel={onCancel}>
      <TextArea LabelText="สาเหตุที่บำรุงรักษาไม่ได้" Text={reason} Placeholder="ระบุสาเหตุที่บำรุงรักษาไม่ได้" onChange={onReason}
        State={error ? "Error" : undefined} HelperText={error ? "กรุณาระบุสาเหตุที่บำรุงรักษาไม่ได้" : undefined} />
      <Section>
        <SectionHeader Title="อะไหล่ส่งคืน" Badge={parts.length} />
        <RetTable parts={parts} used={used} />
      </Section>
    </PopupModal>
  );
}

export function OilCards({ value, onChange, Disabled }: { value: OilChoice; onChange?: (k: OilChoice) => void; Disabled?: boolean }) {
  return <RadioTextCards options={OIL_JOB_OPTS.map((Text) => ({ Text }))} value={OIL_JOB_OPTS[value]} Disabled={Disabled}
    onChange={(v) => onChange?.(OIL_JOB_OPTS.indexOf(v as (typeof OIL_JOB_OPTS)[number]) as OilChoice)} />;
}
export function LastOil({ car }: { car: TripCar }) {
  return <Grid><TextInput LabelText="เปลี่ยนน้ำมันครั้งล่าสุด" Text={car.lastOil} State="Readonly" readOnly /></Grid>;
}
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

export const toUpload = (f: File): UploadFile => ({ name: f.name, size: f.size >= 1e6 ? (f.size / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(f.size / 1024)) + " KB", bar: true });

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

const UNITS = ["ชิ้น", "ลิตร"];
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

export interface SignSlot { LabelText: string; Placeholder: string; options: string[]; name: string | null; sig: string | null; req?: string; at?: string }
export function SignRequest({ Title, slots, onPick, onSend, readonly }: { Title: string; slots: SignSlot[]; onPick: (i: number, name: string) => void; onSend: (i: number) => void; readonly?: boolean }) {
  const mob = useBreakpoint() === "Mobile";
  const [open, setOpen] = useState(-1);
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader Title={Title} />
      <div className={cx("flex gap-4", mob ? "flex-col" : "[&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0")}>
        {slots.map((s, i) => (
          <div key={s.LabelText} className="flex flex-col gap-4">
            <InputDropdown LabelText={s.LabelText} Placeholder={s.Placeholder} Text={s.name ?? undefined} open={open === i} onOpenChange={(o) => setOpen(o && !readonly ? i : -1)}
              State={readonly ? "Disabled" : undefined}>
              <DropdownList>{s.options.map((o) => <DropdownListItem key={o} Text={o} State={o === s.name ? "Selected" : "Default"} onClick={() => { onPick(i, o); setOpen(-1); }} />)}</DropdownList>
            </InputDropdown>
            {s.sig ? (
              <div className="flex flex-wrap items-center gap-2"><PillOutline Text="ยืนยันแล้ว" Color="Success" /><span className="text-sm text-gray-600">{s.at ? "ยืนยันเมื่อ " + s.at : "ลงนามแล้ว"}</span></div>
            ) : s.req ? (
              <div className="flex flex-wrap items-center gap-2">
                <PillOutline Text="รอยืนยัน" Color="Warning" /><span className="text-sm text-gray-600">{"ส่งให้ " + (s.name ?? "-") + " เมื่อ " + s.req}</span>
                {!readonly && <SecondaryButton Text="ส่งอีกครั้ง" onClick={() => onSend(i)} />}
              </div>
            ) : (
              <div className="flex"><SecondaryButton Text="ส่งให้ลงนาม" LeadingIconSwap="send-24-300-round" State={s.name && !readonly ? "Default" : "Disabled"} onClick={() => onSend(i)} /></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export const splitAt = (s?: string): [string, string] => { const m = (s ?? "").match(/^(\d{2}\/\d{2}\/\d{4})(?:\s+(\d{1,2}:\d{2}))?/); return m ? [m[1], m[2] ?? ""] : ["", ""]; };
const timeOk = (v: string) => /^([01]?\d|2[0-3]):[0-5]\d$/.test(v);
export function DateTimeModal({ open, title, sub, label, value, ok, onOk, onCancel }: { open: boolean; title: string; sub?: string; label: string; value: string; ok: string; onOk: (at: string) => void; onCancel: () => void }) {
  const [d, setD] = useState(""), [tm, setTm] = useState(""), [cal, setCal] = useState(false), [seen, setSeen] = useState("");
  const key = open ? value : "";
  if (open && seen !== key) { const [a, b] = splitAt(value); setD(a); setTm(b); setCal(false); setSeen(key); }
  if (!open && seen) setSeen("");
  const date = fromThaiDate(d);
  const valid = !!date && timeOk(tm);
  return (
    <PopupModal open={open} title={title} sub={sub} ok={ok} okDisabled={!valid} onCancel={onCancel} onOk={() => valid && onOk(d + " " + tm.padStart(5, "0") + " น.")}>
      <div className="flex flex-col gap-4">
        <TextInput LabelText={"วันที่" + label} LeadingIconSwap="calendar_month-24-300-round" Text={d} Placeholder="วว/ดด/ปปปป" readOnly State={cal ? "Focused" : "Filled"} onClick={() => setCal(true)} />
        {cal && <div className="flex"><DatePicker Type="Single" {...TH_PICKER} value={{ start: date ?? new Date(), end: date ?? new Date() }} month={date ?? new Date()}
          onCancel={() => setCal(false)} onApply={(r) => { if (r.start) setD(toThaiDate(r.start)); setCal(false); }} /></div>}
        <TextInput LabelText={"เวลา" + label} LeadingIconSwap="schedule-24-300-round" Text={tm} Placeholder="00:00" inputMode="numeric"
          State={tm && !timeOk(tm) ? "Error" : undefined} HelperText={tm && !timeOk(tm) ? "กรุณาระบุเวลาเป็น ชั่วโมง:นาที เช่น 08:30" : undefined} onChange={(v) => setTm(v.replace(/[^\d:]/g, "").slice(0, 5))} />
      </div>
    </PopupModal>
  );
}
const toThaiDate = (x: Date) => String(x.getDate()).padStart(2, "0") + "/" + String(x.getMonth() + 1).padStart(2, "0") + "/" + (x.getFullYear() + 543);
const fromThaiDate = (s: string) => { const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };
