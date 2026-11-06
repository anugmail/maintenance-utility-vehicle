"use client";
/* S6 P2 / S9 · ฟอร์มสร้าง/แก้ไขแผนเดินทาง — tripForm() ใน screens.js · spec S6.md P2 + S9.md (mode = hire)
   Content ช่องไฟ 32 (ลำดับส่วน 6 พ.ย. 2569 เจ้าของงาน "ย้าย ช่วงวันเดินทางขึ้นมาก่อนเลือกรถ" + "พนักงาน ขึ้นไปก่อนการเลือกรถ"):
     (แก้ไข) Alert Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล
     ข้อมูลแผนเดินทาง (Section header) — Text input ชื่อแผนเดินทาง · Horizontal radio groups รูปแบบดำเนินการ "ดำเนินการเอง" / "จ้างดำเนินการ" (ครึ่งแถว · มือถือเรียงลง)
     (จ้าง) ผู้รับจ้าง (Section header) — Input dropdown ค้นหาผู้รับจ้าง + Dropdown list (ชื่อ · ประเภทรถ) · Text input เลขที่สัญญา/ใบสั่งจ้าง (ถ้ามี)
     ช่วงวันเดินทาง | ช่วงวันทำงาน (Section header) — Text input 2 ช่อง + ช่องว่าง (หนึ่งในสาม) · desktop โฟกัสแล้วเปิด Date picker Type=Dual ใต้ช่องเริ่ม
     (ตรวจเอง) พนักงานที่เดินทาง (Section header + Badge "n คน") — 6 พ.ย. 2569 เจ้าของงาน "เปลี่ยนคำของพนักงาน กบค" + "จำนวนคนเดินทาง เพิ่ม ได้ไม่จำกัด"
       1 คน 1 แถว: Input dropdown ค้นหา "พนักงานคนที่ n" + Tertiary button ไอคอนลบอย่างเดียว · Secondary button "เพิ่มพนักงาน" (ไอคอน add) ใต้แถว
       แบบเดียวกับแถวพนักงานในค่าใช้จ่ายตอนปิดงาน (closeCosts) · ฟอร์มว่างแสดง 2 แถว · คนที่ 1 และ 2 บังคับ ("กรุณาเลือกพนักงาน") · ลบจนเหลือน้อยกว่า 2 แถว = เติมแถวว่างให้ครบ 2
     รถในแผนเดินทาง (Section header + Badge จำนวน + Secondary button "เพิ่มรถ") — Table (TRIP_CAR_COLS ไอคอนแก้ไข/ลบ) / Empty state/Data empty
       คอลัมน์ "ผู้ดูแลยานพาหนะ" = ชื่อ + เบอร์ (บรรทัดรอง) ค่าเริ่มต้นผู้ควบคุมรถ (6 พ.ย. 2569)
       ไอคอนลบ = เอารถออกจากใบนี้ (soft delete · 5 พ.ย. 2569) กลับไปเลือกได้ใน popup · popup แสดงรถทุกคันของไตรมาส คันที่อยู่ในแผนเดินทางอื่น = ติ๊กไม่ได้
     ปุ่ม ย้อนกลับ · ยืนยันการสร้างแผนเดินทาง | ส่งอนุมัติใหม่ — Disabled จนกว่าช่องบังคับครบ (รีวิว 5 พ.ย. 2569 แทน E.7 · S9 ฟอร์มเดียวกัน)
     Validation: ช่องบังคับที่ออกจากช่องโดยยังว่าง (Out of focus) — "กรุณาระบุชื่อแผนเดินทาง" · "กรุณาเลือกผู้รับจ้าง" · "กรุณาเลือกวันที่เริ่ม" · "กรุณาเลือกวันที่สิ้นสุด" · "กรุณาเลือกพนักงาน"
     Breadcrumbs บำรุงรักษาตามวาระ › <ชื่อแผน> › ไตรมาส n › สร้างแผนเดินทาง (ต่อจากหน้า "ไตรมาส n")
   popup: TripCarPicker (เพิ่มรถ) · TripCarEditModal (แก้ไขผู้ดูแลยานพาหนะและสถานที่) · ไม่มีช่องค่าใช้จ่าย (ย้ายไปปิดงาน S10 · 3 พ.ย. 2569) */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Alert } from "@/components/vms/Alert";
import { TH_PICKER } from "@/lib/thaiDate";
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
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { mrOf, planOf } from "@/lib/mock/closeout";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { CREATOR, SENT_AT, STAFF, VENDORS, qEditOf, quarterCars, carOf, ctrlCell, locCell, nextTripId, putTrip, quarterTrips, tripsOf, type Trip, type TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useOutside } from "@/lib/useOutside";
import { TripCarEditModal, type CarOverrides } from "./TripCarEditModal";
import { TripCarPicker } from "./TripCarPicker";
import { BtnRow, Content, DataTable, Section, quarterCrumbs, tripsHref, useBack } from "./ui";

const TRIP_CAR_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 180, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของยานพาหนะ", width: 160 },
  { head: "ผู้ดูแลยานพาหนะ", width: 190 }, { head: "สถานที่บำรุงรักษา", width: 290 }, { head: "", width: 104, Style: "Action icons" },
];
const MODES = ["ดำเนินการเอง", "จ้างดำเนินการ"];   // 6 พ.ย. 2569 เจ้าของงาน "เปลี่ยนคำ กบค ดำเนินการเอง เป็น ดำเนินการเอง"

/* วันที่แบบไทย dd/mm/ปี พ.ศ. ↔ Date */
const toThai = (d: Date) => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + (d.getFullYear() + 543);
const fromThai = (s: string) => { const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/); return m ? new Date(Number(m[3]) - 543, Number(m[2]) - 1, Number(m[1])) : null; };

interface Values { name: string; mode: "self" | "hire"; vendor: string; contract: string; carIds: string[]; locs: Record<string, string>; phones: Record<string, string>; names: Record<string, string>; d1: string; d2: string; staff: string[] }
/* แถวพนักงานอย่างน้อย 2 แถว (ฟอร์มว่างแสดง 2 แถว) */
const atLeast2 = (a: string[]) => (a.length >= 2 ? a : [...a, "", ""].slice(0, 2));
const fromTrip = (t?: Trip, mode: "self" | "hire" = "self"): Values => t
  ? { name: t.name, mode: t.mode, vendor: t.vendor ?? "", contract: t.contract ?? "", carIds: [...t.carIds], locs: { ...t.locs }, phones: { ...t.phones }, names: { ...(t.names ?? {}) }, d1: t.d1, d2: t.d2, staff: atLeast2([...(t.staff ?? [])]) }
  : { name: "", mode, vendor: "", contract: "", carIds: [], locs: {}, phones: {}, names: {}, d1: "", d2: "", staff: ["", ""] };

/* ช่องเลือกแบบค้นหาได้ (Input dropdown property Cursor + Dropdown list) */
function SearchPick({ label, placeholder, value, options, onPick, error, onLeave }: { label: string; placeholder: string; value: string; options: { Text: string; SupportingText?: string }[]; onPick: (v: string) => void; error?: string; onLeave?: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState<string | null>(null);
  const shown = q && q !== value ? options.filter((o) => o.Text.includes(q.trim())) : options;
  const close = (v: boolean) => { if (!v && open) onLeave?.(); setOpen(v); if (!v) setQ(null); };   // ปิดรายการ = ออกจากช่อง (out of focus)
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
  const kbk = useRole() === "หน่วยงาน (กกฟ.1)";
  const [v, setV] = useState<Values>(() => fromTrip(edit, initialMode));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));
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
  /* ปฏิทินปิด (เลือกเสร็จ / ยกเลิก / คลิกนอก) = ออกจากช่องวันที่ */
  const wasOpen = useRef(false);
  useEffect(() => { if (wasOpen.current && !dateOpen) setTouched((t) => ({ ...t, d1: true, d2: true })); wasOpen.current = dateOpen; }, [dateOpen]);
  const back = useBack(tripsHref(planId, q));
  const put = (p: Partial<Values>) => setV((x) => ({ ...x, ...p }));
  const hire = v.mode === "hire";
  const nowQ = "ไตรมาส " + q;
  const head = edit ? "แก้ไขแผนเดินทาง" : "สร้างแผนเดินทาง";

  /* popup เพิ่มรถ = รถทุกคันของไตรมาสที่ยังไม่อยู่ในใบนี้ · คันที่อยู่ในแผนเดินทางใบอื่น = แสดงแต่เลือกไม่ได้ (taken · 5 พ.ย. 2569) */
  const others = quarterTrips(mock, planId, q).filter((t) => t.id !== edit?.id);
  const taken: Record<string, string> = Object.fromEntries(others.flatMap((t) => t.carIds.map((id) => [id, t.name])));
  const qCars = quarterCars(mock, planId, q);
  const pool = qCars.filter((c) => !v.carIds.includes(c.id));
  const cars = v.carIds.map(carOf).filter((c): c is TripCar => !!c);
  const over: CarOverrides = { locs: v.locs, phones: v.phones, names: v.names };
  const drop = (id: string) => { const locs = { ...v.locs }, phones = { ...v.phones }, names = { ...v.names }; delete locs[id]; delete phones[id]; delete names[id]; put({ carIds: v.carIds.filter((x) => x !== id), locs, phones, names }); };
  const carRows = cars.map((c) => {
    const acts = [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + c.plate, onClick: () => setEditCar(c) }, { IconSwap: "delete-24-300-round", label: "ลบ " + c.plate, onClick: () => drop(c.id) }];
    return [c.plate, c.model, c.owner, ctrlCell(over, c), locCell(over, c), { actions: acts, mobileActions: acts }];
  });

  /* ตรวจและส่ง — ข้อความ error ขึ้นเมื่อออกจากช่องโดยยังว่าง (touched) · ปุ่มยืนยัน Disabled จนกว่าครบ */
  const E = (k: string, m: string, bad: boolean) => (touched[k] && bad ? m : undefined);
  const staffOk = !!v.staff[0] && !!v.staff[1];
  const valid = !!v.name.trim() && (!hire || !!v.vendor) && cars.length > 0 && !!v.d1.trim() && !!v.d2.trim() && (hire || staffOk);
  const submit = () => {
    if (!valid) return;
    if (mock.failSave) { notify("general error", "Error"); return; }
    const all = tripsOf(mock);
    const t: Trip = {
      id: edit?.id ?? nextTripId(all, v.mode), planId, quarter: q, name: v.name.trim(), mode: v.mode,
      vendor: hire ? v.vendor : undefined, contract: hire ? v.contract.trim() || undefined : undefined,
      carIds: v.carIds, locs: v.locs, phones: v.phones, names: v.names, d1: v.d1.trim(), d2: v.d2.trim(), status: "review",
      staff: hire ? undefined : v.staff.filter(Boolean), createdBy: edit?.createdBy ?? CREATOR, sentAt: edit?.sentAt ?? SENT_AT,
    };
    putTrip(t);
    notify(edit ? "ส่งแผนเดินทางให้ผู้อนุมัติใหม่แล้ว" : "สร้างแผนเดินทางสำเร็จ · ส่งให้ผู้อนุมัติแล้ว");
    router.push(tripsHref(planId, q));
  };

  const row = (kids: ReactNode, n: 2 | 3) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const range: DateRange = { start: fromThai(v.d1), end: fromThai(v.d2) };
  /* แถวพนักงาน 1 คน = Input dropdown ค้นหา + ปุ่มลบไอคอนอย่างเดียว (แบบ costRow ของหน้าปิดงาน · desktop ช่องครึ่งแถว ปุ่มลบชิดช่อง) */
  const dropStaff = (i: number) => { put({ staff: atLeast2(v.staff.filter((_, j) => j !== i)) }); setTouched((t) => ({ ...t, staff0: false, staff1: false })); };
  const staffRow = (i: number) => {
    const pick = (
      <SearchPick label={"พนักงานคนที่ " + (i + 1)} placeholder="ค้นหาชื่อ-นามสกุล, รหัสพนักงาน" value={v.staff[i]}
        options={STAFF.filter((n) => !v.staff.some((s, j) => j !== i && s === n)).map((n) => ({ Text: n }))}
        onPick={(n) => put({ staff: v.staff.map((s, j) => (j === i ? n : s)) })} error={i < 2 ? E("staff" + i, "กรุณาเลือกพนักงาน", !v.staff[i]) : undefined} onLeave={touch("staff" + i)} />
    );
    const del = <TertiaryButton LeadingIconSwap="delete-24-300-round" ButtonText={false} aria-label={"ลบพนักงานคนที่ " + (i + 1)} title={"ลบพนักงานคนที่ " + (i + 1)} onClick={() => dropStaff(i)} />;
    return mob
      ? <div key={i} className="flex flex-col gap-4">{pick}<div className="flex">{del}</div></div>
      : <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-6">{pick}{del}<span /></div>;
  };
  const nStaff = v.staff.filter(Boolean).length;

  return (
    <>
      <PageHeader Title={head + " · " + nowQ} onBack={back} crumbs={quarterCrumbs(planId, planOf(mock, planId)?.name ?? mrOf(planId), q, head)} />
      <Content>
        {edit?.returnReason && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={edit.returnReason} />}
        <Section>
          <SectionHeader Title="ข้อมูลแผนเดินทาง" />
          {row(<>
            <TextInput LabelText="ชื่อแผนเดินทาง" Text={v.name} Placeholder="ระบุชื่อแผนเดินทาง" onChange={(name) => put({ name })} onBlur={touch("name")}
              State={E("name", "x", !v.name.trim()) ? "Error" : undefined} HelperText={E("name", "กรุณาระบุชื่อแผนเดินทาง", !v.name.trim())} />
            <HorizontalRadioGroups Label="รูปแบบดำเนินการ" options={MODES} value={MODES[hire ? 1 : 0]} onChange={(o) => put({ mode: o === MODES[1] ? "hire" : "self" })} />
          </>, 2)}
        </Section>

        {hire && (
          <Section>
            <SectionHeader Title="ผู้รับจ้าง" />
            {row(<>
              <SearchPick label="ผู้รับจ้าง" placeholder="ค้นหาชื่อผู้รับจ้าง" value={v.vendor} options={VENDORS.map((x) => ({ Text: x.name, SupportingText: x.types }))}
                onPick={(vendor) => put({ vendor })} error={E("vendor", "กรุณาเลือกผู้รับจ้าง", !v.vendor)} onLeave={touch("vendor")} />
              <TextInput LabelText="เลขที่สัญญา/ใบสั่งจ้าง" Optional Text={v.contract} Placeholder="ระบุเลขที่สัญญาหรือใบสั่งจ้าง" onChange={(contract) => put({ contract })} />
            </>, 2)}
          </Section>
        )}


        <Section>
          <SectionHeader Title={hire ? "ช่วงวันทำงาน" : "ช่วงวันเดินทาง"} />
          <div ref={dateRef} className="relative">
            {row(<>
              <TextInput LabelText={hire ? "วันที่เริ่มงาน" : "วันที่เดินทาง ตั้งแต่"} Text={v.d1} Placeholder="วว/ดด/ปปปป" onChange={(d1) => put({ d1 })} onFocus={() => !mob && setDateOpen(true)} onBlur={() => !dateOpen && touch("d1")()}
                State={E("d1", "x", !v.d1.trim()) ? "Error" : dateOpen ? "Focused" : undefined} HelperText={E("d1", "กรุณาเลือกวันที่เริ่ม", !v.d1.trim())} />
              <TextInput LabelText="ถึงวันที่" Text={v.d2} Placeholder="วว/ดด/ปปปป" onChange={(d2) => put({ d2 })} onFocus={() => !mob && setDateOpen(true)} onBlur={() => !dateOpen && touch("d2")()}
                State={E("d2", "x", !v.d2.trim()) ? "Error" : undefined} HelperText={E("d2", "กรุณาเลือกวันที่สิ้นสุด", !v.d2.trim())} />
              {!mob && <span />}
            </>, 3)}
            {dateOpen && !mob && (
              <div className="absolute top-full left-0 z-30 mt-1">
                <DatePicker Type="Dual" {...TH_PICKER} value={range} onCancel={() => setDateOpen(false)}
                  onApply={(r) => { put({ d1: r.start ? toThai(r.start) : "", d2: r.end ? toThai(r.end) : r.start ? toThai(r.start) : "" }); setDateOpen(false); }} />
              </div>
            )}
          </div>
        </Section>

        {!hire && (
          <Section>
            <SectionHeader Title="พนักงานที่เดินทาง" Badge={nStaff ? nStaff + " คน" : null} />
            {v.staff.map((_, i) => staffRow(i))}
            <div className="flex"><SecondaryButton Text="เพิ่มพนักงาน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} className={mob ? "w-full" : undefined}
              onClick={() => put({ staff: [...v.staff, ""] })} /></div>
          </Section>
        )}

        <Section>
          <SectionHeader Title="ยานพาหนะในแผนเดินทาง" Badge={cars.length || null}
            Actions={<SecondaryButton Text="เพิ่มยานพาหนะ" LeadingIconSwap="add-24-300-round" onClick={() => setPicker(true)} />} />
          {cars.length
            ? <DataTable columns={TRIP_CAR_COLS} rows={carRows} rowKey={(r) => String(r[0])} />
            : <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในแผนเดินทาง" SupportingText={"กดเพิ่มยานพาหนะเพื่อเลือกยานพาหนะของ" + nowQ + " ที่ยังไม่อยู่ในแผนเดินทางใด"} />}
        </Section>

        <BtnRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          <PrimaryButton Text={edit ? "ส่งอนุมัติใหม่" : "ยืนยันการสร้างแผนเดินทาง"} Size="lg" State={kbk && valid ? "Default" : "Disabled"} onClick={submit} />
        </BtnRow>
      </Content>
      <TripCarPicker open={picker} pool={pool} taken={taken} nowQ={nowQ} onCancel={() => setPicker(false)}
        onAdd={(ids) => { const e = qEditOf(mock, planId, q), pick = (o: Record<string, string>) => Object.fromEntries(ids.filter((x) => o[x]).map((x) => [x, o[x]]));
          put({ carIds: [...v.carIds, ...ids], phones: { ...v.phones, ...pick(e.phones) }, locs: { ...v.locs, ...pick(e.locs) }, names: { ...v.names, ...pick(e.names ?? {}) } }); setPicker(false); }} />
      <TripCarEditModal car={editCar} trip={over} onCancel={() => setEditCar(null)} onSave={(o) => { put(o); setEditCar(null); }} />
    </>
  );
}
