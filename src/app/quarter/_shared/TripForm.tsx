"use client";
/* S6 P2 / S9 · ฟอร์มสร้าง/แก้ไขแผนเดินทาง — tripForm() ใน screens.js · spec S6.md P2 + S9.md (mode = hire)
   Content ช่องไฟ 32:
     (แก้ไข) Alert Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล
     ข้อมูลแผนเดินทาง (Section header) — Text input ชื่อแผนเดินทาง · Horizontal radio groups รูปแบบดำเนินการ (ครึ่งแถว · มือถือเรียงลง)
     (จ้าง) ผู้รับจ้าง (Section header) — Input dropdown ค้นหาผู้รับจ้าง + Dropdown list (ชื่อ · ประเภทรถ) · Text input เลขที่สัญญา/ใบสั่งจ้าง (ถ้ามี)
     รถในแผนเดินทาง (Section header + Badge จำนวน + Secondary button "เพิ่มรถ") — Table (TRIP_CAR_COLS ไอคอนแก้ไข/ลบ) / Alert Error + Empty state/Data empty
     ช่วงวันเดินทาง | ช่วงวันทำงาน (Section header) — Text input 2 ช่อง + ช่องว่าง (หนึ่งในสาม) · desktop โฟกัสแล้วเปิด Date picker Type=Dual ใต้ช่องเริ่ม
     (ตรวจเอง) พนักงาน กบค. ซ่อม (2-3 คน) — Input dropdown 3 ช่อง ค้นหาได้
     ปุ่ม ย้อนกลับ · ยืนยันการสร้างแผนเดินทาง | ส่งอนุมัติใหม่
   popup: TripCarPicker (เพิ่มรถ) · TripCarEditModal (แก้ไขเบอร์ติดต่อและสถานที่) · ไม่มีช่องค่าใช้จ่าย (ย้ายไปปิดงาน S10 · 3 พ.ย. 2569) */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Alert } from "@/components/vms/Alert";
import { DatePicker, type DateRange } from "@/components/vms/DatePicker";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { HorizontalRadioGroups } from "@/components/vms/HorizontalRadioGroups";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import type { TableColumn } from "@/components/vms/Table";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { mrOf } from "@/lib/mock/closeout";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { CREATOR, SENT_AT, STAFF, TRIP_CARS, VENDORS, carOf, locCell, nextTripId, phoneCell, putTrip, quarterTrips, tripsOf, type Trip, type TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useOutside } from "@/lib/useOutside";
import { TripCarEditModal, type CarOverrides } from "./TripCarEditModal";
import { TripCarPicker } from "./TripCarPicker";
import { BtnRow, Content, DataTable, MENU_HOME, Section, planDetailHref, quarterHref, tripsHref, useBack } from "./ui";

const TRIP_CAR_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 180, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 160 },
  { head: "เบอร์ติดต่อ", width: 150 }, { head: "สถานที่บำรุงรักษา", width: 290 }, { head: "", width: 104, Style: "Action icons" },
];
const MODES = ["กบค. ดำเนินการเอง", "จ้างดำเนินการ"];

/* วันที่แบบไทย dd/mm/ปี พ.ศ. ↔ Date */
const toThai = (d: Date) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + (d.getFullYear() + 543);
const fromThai = (s: string) => { const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };

interface Values { name: string; mode: "self" | "hire"; vendor: string; contract: string; carIds: string[]; locs: Record<string, string>; phones: Record<string, string>; d1: string; d2: string; staff: string[] }
const fromTrip = (t?: Trip, mode: "self" | "hire" = "self"): Values => t
  ? { name: t.name, mode: t.mode, vendor: t.vendor ?? "", contract: t.contract ?? "", carIds: [...t.carIds], locs: { ...t.locs }, phones: { ...t.phones }, d1: t.d1, d2: t.d2, staff: [...(t.staff ?? []), "", "", ""].slice(0, 3) }
  : { name: "", mode, vendor: "", contract: "", carIds: [], locs: {}, phones: {}, d1: "", d2: "", staff: ["", "", ""] };

/* ช่องเลือกแบบค้นหาได้ (Input dropdown property Cursor + Dropdown list) */
function SearchPick({ label, placeholder, value, options, onPick, error }: { label: string; placeholder: string; value: string; options: { Text: string; SupportingText?: string }[]; onPick: (v: string) => void; error?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState<string | null>(null);
  const shown = q && q !== value ? options.filter((o) => o.Text.includes(q.trim())) : options;
  const close = (v: boolean) => { setOpen(v); if (!v) setQ(null); };
  return (
    <InputDropdown LabelText={label} Text={q ?? value} Placeholder={placeholder} LeadingIconSwap="search-24-300-round" onQuery={setQ} open={open} onOpenChange={close}
      State={error ? (open ? "Error Focused" : "Error") : undefined} HelperText={error}>
      {shown.length > 0 && (
        <DropdownList>
          {shown.map((o) => <DropdownListItem key={o.Text} Text={o.Text} SupportingText={o.SupportingText} State={o.Text === value ? "Selected" : "Default"} onClick={() => { onPick(o.Text); close(false); }} />)}
        </DropdownList>
      )}
    </InputDropdown>
  );
}

export function TripForm({ planId, q, edit, initialMode = "self" }: { planId: string; q: number; edit?: Trip; initialMode?: "self" | "hire" }) {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const kbk = useRole() === "กบค.";
  const [v, setV] = useState<Values>(() => fromTrip(edit, initialMode));
  const [errors, setErrors] = useState(false);
  const [picker, setPicker] = useState(false);
  const [editCar, setEditCar] = useState<TripCar | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const dateRef = useRef<HTMLDivElement>(null);
  const [closeDate] = useState(() => () => setDateOpen(false));
  useOutside(dateRef, dateOpen, closeDate);
  useEffect(() => {
    if (!dateOpen) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Tab") setDateOpen(false); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [dateOpen]);
  const back = useBack(tripsHref(planId, q));
  const put = (p: Partial<Values>) => setV((x) => ({ ...x, ...p }));
  const hire = v.mode === "hire";
  const nowQ = "ไตรมาส " + q;
  const head = edit ? "แก้ไขแผนเดินทาง" : "สร้างแผนเดินทาง";

  /* รถที่เลือกได้ = รถของไตรมาสที่ยังไม่อยู่ในแผนเดินทางใบอื่น (ซ่อน ไม่ทำเป็นสีจาง) และยังไม่อยู่ในใบนี้ */
  const others = quarterTrips(mock, planId, q).filter((t) => t.id !== edit?.id);
  const usedIds = new Set(others.flatMap((t) => t.carIds));
  const pool = TRIP_CARS.filter((c) => !usedIds.has(c.id) && !v.carIds.includes(c.id));
  const used = TRIP_CARS.filter((c) => usedIds.has(c.id)).length;
  const cars = v.carIds.map(carOf).filter((c): c is TripCar => !!c);
  const over: CarOverrides = { locs: v.locs, phones: v.phones };
  const drop = (id: string) => { const locs = { ...v.locs }, phones = { ...v.phones }; delete locs[id]; delete phones[id]; put({ carIds: v.carIds.filter((x) => x !== id), locs, phones }); };
  const carRows = cars.map((c) => {
    const acts = [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + c.plate, onClick: () => setEditCar(c) }, { IconSwap: "delete-24-300-round", label: "ลบ " + c.plate, onClick: () => drop(c.id) }];
    return [c.plate, c.model, c.owner, phoneCell(over, c), locCell(over, c), { actions: acts, mobileActions: acts }];
  });

  /* ตรวจและส่ง */
  const E = (m: string, bad: boolean) => (errors && bad ? m : undefined);
  const staffOk = !!v.staff[0] && !!v.staff[1];
  const valid = !!v.name.trim() && (!hire || !!v.vendor) && cars.length > 0 && !!v.d1.trim() && !!v.d2.trim() && (hire || staffOk);
  const submit = () => {
    if (!valid) { setErrors(true); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (mock.failSave) { notify("general error", "Error"); return; }
    const all = tripsOf(mock);
    const t: Trip = {
      id: edit?.id ?? nextTripId(all, v.mode), planId, quarter: q, name: v.name.trim(), mode: v.mode,
      vendor: hire ? v.vendor : undefined, contract: hire ? v.contract.trim() || undefined : undefined,
      carIds: v.carIds, locs: v.locs, phones: v.phones, d1: v.d1.trim(), d2: v.d2.trim(), status: "review",
      staff: hire ? undefined : v.staff.filter(Boolean), createdBy: edit?.createdBy ?? CREATOR, sentAt: edit?.sentAt ?? SENT_AT,
    };
    putTrip(t);
    notify(edit ? "ส่งแผนเดินทางให้ผู้อนุมัติใหม่แล้ว" : "สร้างแผนเดินทางสำเร็จ · ส่งให้ผู้อนุมัติแล้ว");
    router.push(tripsHref(planId, q));
  };

  const row = (kids: ReactNode, n: 2 | 3) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const range: DateRange = { start: fromThai(v.d1), end: fromThai(v.d2) };
  const staffPick = (i: number) => (
    <SearchPick key={i} label={"พนักงาน กบค. ซ่อม คนที่ " + (i + 1) + (i === 2 ? " (ถ้ามี)" : "")} placeholder="ค้นหาชื่อ-นามสกุล, รหัสพนักงาน" value={v.staff[i]}
      options={STAFF.filter((n) => !v.staff.some((s, j) => j !== i && s === n)).map((n) => ({ Text: n }))}
      onPick={(n) => put({ staff: v.staff.map((s, j) => (j === i ? n : s)) })} error={i < 2 ? E("กรุณาเลือกพนักงาน", !v.staff[i]) : undefined} />
  );

  return (
    <>
      <PageHeader Title={head + " · " + nowQ} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "แผน " + mrOf(planId), onClick: () => router.push(planDetailHref(planId)) }, { Text: nowQ, href: quarterHref(planId, q) }, { Text: head }]} />
      <Content>
        {edit?.returnReason && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={edit.returnReason} />}
        <Section>
          <SectionHeader Title="ข้อมูลแผนเดินทาง" />
          {row(<>
            <TextInput LabelText="ชื่อแผนเดินทาง" Text={v.name} Placeholder="ระบุชื่อแผนเดินทาง" onChange={(name) => put({ name })}
              State={E("x", !v.name.trim()) ? "Error" : undefined} HelperText={E("กรุณาระบุชื่อแผนเดินทาง", !v.name.trim())} />
            <HorizontalRadioGroups Label="รูปแบบดำเนินการ" options={MODES} value={MODES[hire ? 1 : 0]} onChange={(o) => put({ mode: o === MODES[1] ? "hire" : "self" })} />
          </>, 2)}
        </Section>

        {hire && (
          <Section>
            <SectionHeader Title="ผู้รับจ้าง" />
            {row(<>
              <SearchPick label="ผู้รับจ้าง" placeholder="ค้นหาชื่อผู้รับจ้าง" value={v.vendor} options={VENDORS.map((x) => ({ Text: x.name, SupportingText: x.types }))}
                onPick={(vendor) => put({ vendor })} error={E("กรุณาเลือกผู้รับจ้าง", !v.vendor)} />
              <TextInput LabelText="เลขที่สัญญา/ใบสั่งจ้าง" Optional Text={v.contract} Placeholder="ระบุเลขที่สัญญาหรือใบสั่งจ้าง" onChange={(contract) => put({ contract })} />
            </>, 2)}
          </Section>
        )}

        <Section>
          <SectionHeader Title="รถในแผนเดินทาง" Badge={cars.length || null}
            Actions={<SecondaryButton Text="เพิ่มรถ" LeadingIconSwap="add-24-300-round" onClick={() => setPicker(true)} />} />
          {cars.length
            ? <DataTable columns={TRIP_CAR_COLS} rows={carRows} rowKey={(r) => String(r[0])} />
            : <>
                {errors && <Alert Color="Error" Text="กรุณาเพิ่มรถเข้าแผนเดินทางอย่างน้อย 1 คัน" />}
                <EmptyStateDataEmpty Text="ยังไม่มีรถในแผนเดินทาง" SupportingText={"กดเพิ่มรถเพื่อเลือกรถของ" + nowQ + "ที่ยังไม่อยู่ในแผนเดินทางใด"} />
              </>}
        </Section>

        <Section>
          <SectionHeader Title={hire ? "ช่วงวันทำงาน" : "ช่วงวันเดินทาง"} />
          <div ref={dateRef} className="relative">
            {row(<>
              <TextInput LabelText={hire ? "วันที่เริ่มงาน" : "วันที่เดินทาง ตั้งแต่"} Text={v.d1} Placeholder="วว/ดด/ปปปป" onChange={(d1) => put({ d1 })} onFocus={() => !mob && setDateOpen(true)}
                State={E("x", !v.d1.trim()) ? "Error" : dateOpen ? "Focused" : undefined} HelperText={E("กรุณาเลือกวันที่เริ่ม", !v.d1.trim())} />
              <TextInput LabelText="ถึงวันที่" Text={v.d2} Placeholder="วว/ดด/ปปปป" onChange={(d2) => put({ d2 })} onFocus={() => !mob && setDateOpen(true)}
                State={E("x", !v.d2.trim()) ? "Error" : undefined} HelperText={E("กรุณาเลือกวันที่สิ้นสุด", !v.d2.trim())} />
              {!mob && <span />}
            </>, 3)}
            {dateOpen && !mob && (
              <div className="absolute top-full left-0 z-30 mt-1">
                <DatePicker Type="Dual" value={range} onCancel={() => setDateOpen(false)}
                  onApply={(r) => { put({ d1: r.start ? toThai(r.start) : "", d2: r.end ? toThai(r.end) : r.start ? toThai(r.start) : "" }); setDateOpen(false); }} />
              </div>
            )}
          </div>
        </Section>

        {!hire && (
          <Section>
            <SectionHeader Title="พนักงาน กบค. ซ่อม (2-3 คน)" />
            {row(<>{[0, 1, 2].map(staffPick)}</>, 3)}
          </Section>
        )}

        <BtnRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          <PrimaryButton Text={edit ? "ส่งอนุมัติใหม่" : "ยืนยันการสร้างแผนเดินทาง"} Size="lg" State={kbk ? "Default" : "Disabled"} onClick={submit} />
        </BtnRow>
      </Content>
      <TripCarPicker open={picker} pool={pool} used={used} nowQ={nowQ} onCancel={() => setPicker(false)}
        onAdd={(ids) => { put({ carIds: [...v.carIds, ...ids] }); setPicker(false); }} />
      <TripCarEditModal car={editCar} trip={over} onCancel={() => setEditCar(null)} onSave={(o) => { put(o); setEditCar(null); }} />
    </>
  );
}
