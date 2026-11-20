"use client";
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
import { tripPartRows } from "@/lib/mock/moves";
import { QPART_COLS, qpartRow } from "@/lib/mock/plan";
import { tripVCells, tripVCols, workOf } from "@/lib/mock/tripCols";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { canManage, usePlanGate } from "@/lib/mock/planFlow";
import { CREATOR, SENT_AT, STAFF, VENDORS, vendorTelOf, qEditOf, quarterCars, carOf, nextTripId, putTrip, quarterTrips, staffPos, staffTelOf, tripsOf, type Trip, type TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useOutside } from "@/lib/useOutside";
import { useProtoForm } from "@/lib/protoForm";
import { TripCarEditModal, fromThai, toThai, type CarOverrides } from "./TripCarEditModal";
import { TripCarPicker } from "./TripCarPicker";
import { useRowActions } from "@/components/patterns/RowActions";
import { carArea } from "@/lib/mock/carArea";
import { BtnRow, Content, DataTable, Section, quarterCrumbs, tripsHref, useBack } from "./ui";

const TRIP_CAR_COLS: TableColumn[] = [...tripVCols(), { head: "", width: 104, Style: "Action icons" }];
const TRIP_PARTS_EMPTY = "เพิ่มยานพาหนะเข้าแผนเดินทางแล้ว อะไหล่ของยานพาหนะแต่ละคันจะรวมมาที่นี่";
const MODES = ["ดำเนินการเอง", "จ้างดำเนินการ"];


interface Values { name: string; mode: "self" | "hire"; vendor: string; vendorTel: string; contract: string; carIds: string[]; locs: Record<string, string>; phones: Record<string, string>; names: Record<string, string>; works: Record<string, [string, string]>; d1: string; d2: string; staff: string[]; tels: string[] }
const atLeast2 = (a: string[]) => (a.length >= 2 ? a : [...a, "", ""].slice(0, 2));
const fromTrip = (t?: Trip, mode: "self" | "hire" = "self"): Values => {
  if (!t) return { name: "", mode, vendor: "", vendorTel: "", contract: "", carIds: [], locs: {}, phones: {}, names: {}, works: {}, d1: "", d2: "", staff: ["", ""], tels: ["", ""] };
  const staff = atLeast2([...(t.staff ?? [])]);
  return { name: t.name, mode: t.mode, vendor: t.vendor ?? "", vendorTel: t.mode === "hire" ? vendorTelOf(t) : "", contract: t.contract ?? "", carIds: [...t.carIds], locs: { ...t.locs }, phones: { ...t.phones }, names: { ...(t.names ?? {}) }, works: { ...(t.works ?? {}) }, d1: t.d1, d2: t.d2,
    staff, tels: staff.map((n) => (n ? staffTelOf(t, n) : "")) };
};

function SearchPick({ label, placeholder, value, options, onPick, error, onLeave }: { label: string; placeholder: string; value: string; options: { Text: string; SupportingText?: string }[]; onPick: (v: string) => void; error?: string; onLeave?: () => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState<string | null>(null);
  const shown = q && q !== value ? options.filter((o) => o.Text.includes(q.trim())) : options;
  const close = (v: boolean) => { if (!v && open) onLeave?.(); setOpen(v); if (!v) setQ(null); };
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
  const role = useRole();
  const owner = planOf(mock, planId);
  const kbk = !!owner && canManage(role, owner);
  const denied = usePlanGate(owner);
  const [v, setV] = useState<Values>(() => fromTrip(edit, initialMode));
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));
  const [picker, setPicker] = useState(false);
  const [editCar, setEditCar] = useState<TripCar | null>(null);
  const rowActs = useRowActions();
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
  const wasOpen = useRef(false);
  useEffect(() => { if (wasOpen.current && !dateOpen) setTouched((t) => ({ ...t, d1: true, d2: true })); wasOpen.current = dateOpen; }, [dateOpen]);
  const back = useBack(tripsHref(planId, q));
  const put = (p: Partial<Values>) => setV((x) => ({ ...x, ...p }));
  const hire = v.mode === "hire";
  const nowQ = "ไตรมาส " + q;
  const head = edit ? "แก้ไขแผนเดินทาง" : "สร้างแผนเดินทาง";

  const others = quarterTrips(mock, planId, q).filter((t) => t.id !== edit?.id);
  const taken: Record<string, string> = Object.fromEntries(others.flatMap((t) => t.carIds.map((id) => [id, t.name])));
  const qCars = quarterCars(mock, planId, q);
  const pool = qCars.filter((c) => !v.carIds.includes(c.id));
  const cars = v.carIds.map(carOf).filter((c): c is TripCar => !!c);
  const over: CarOverrides = { locs: v.locs, phones: v.phones, names: v.names };
  const drop = (id: string) => { const locs = { ...v.locs }, phones = { ...v.phones }, names = { ...v.names }, works = { ...v.works }; delete locs[id]; delete phones[id]; delete names[id]; delete works[id]; put({ carIds: v.carIds.filter((x) => x !== id), locs, phones, names, works }); };
  const vt = { d1: v.d1.trim() && v.d2.trim() ? v.d1.trim() : "", d2: v.d2.trim(), works: v.works, locs: v.locs, phones: v.phones, names: v.names, hire: v.mode === "hire" };
  const putDates = (p: Partial<Pick<Values, "d1" | "d2">>) => put({ ...p, works: {} });
  const parts = tripPartRows(mock, { planId, quarter: q, carIds: v.carIds });
  const carRows = cars.map((c) => {
    const acts = [{ IconSwap: "stylus-24-300-round", Text: "แก้ไข", onClick: () => setEditCar(c) }, { IconSwap: "delete-24-300-round", Text: "ลบ", onClick: () => drop(c.id) }];
    return [...tripVCells(c, vt), rowActs.cell(acts, c.plate)];
  });

  const E = (k: string, m: string, bad: boolean) => (touched[k] && bad ? m : undefined);
  const staffOk = !!v.staff[0] && !!v.staff[1];
  const valid = !!v.name.trim() && (!hire || (!!v.vendor && !!v.vendorTel.trim())) && cars.length > 0 && !!v.d1.trim() && !!v.d2.trim() && (hire || staffOk);
  const submit = () => {
    if (!valid) return;
    if (mock.failSave) { notify("general error", "Error"); return; }
    const all = tripsOf(mock);
    const t: Trip = {
      id: edit?.id ?? nextTripId(all, v.mode), planId, quarter: q, name: v.name.trim(), mode: v.mode,
      vendor: hire ? v.vendor : undefined, vendorTel: hire ? v.vendorTel.trim() : undefined, contract: hire ? v.contract.trim() || undefined : undefined,
      carIds: v.carIds, locs: v.locs, phones: v.phones, names: v.names, works: v.works, d1: v.d1.trim(), d2: v.d2.trim(), status: "review",
      staff: hire ? undefined : v.staff.filter(Boolean), staffTel: hire ? undefined : Object.fromEntries(v.staff.flatMap((n, i) => (n ? [[n, v.tels[i]?.trim() ?? ""]] : []))),
      createdBy: edit?.createdBy ?? CREATOR, sentAt: edit?.sentAt ?? SENT_AT,
    };
    putTrip(t);
    notify(edit ? "ส่งแผนเดินทางให้ผู้อนุมัติใหม่แล้ว" : "สร้างแผนเดินทางสำเร็จ · ส่งให้ผู้อนุมัติแล้ว");
    router.push(tripsHref(planId, q));
  };

  const row = (kids: ReactNode, n: 2 | 3) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const range: DateRange = { start: fromThai(v.d1), end: fromThai(v.d2) };
  const dropStaff = (i: number) => {
    const keep = (a: string[]) => atLeast2(a.filter((_, j) => j !== i));
    put({ staff: keep(v.staff), tels: keep(v.tels) }); setTouched((t) => ({ ...t, staff0: false, staff1: false }));
  };
  const staffRow = (i: number) => {
    const no = "คนที่ " + (i + 1);
    const pick = (
      <SearchPick label="ชื่อ-สกุล" placeholder="ค้นหาชื่อ-นามสกุล, รหัสพนักงาน" value={v.staff[i]}
        options={STAFF.filter((n) => !v.staff.some((s, j) => j !== i && s === n)).map((n) => ({ Text: n }))}
        onPick={(n) => put({ staff: v.staff.map((s, j) => (j === i ? n : s)), tels: v.staff.map((_, j) => (j === i ? staffTelOf(edit, n) : v.tels[j] ?? "")) })}
        error={i < 2 ? E("staff" + i, "กรุณาเลือกพนักงาน", !v.staff[i]) : undefined} onLeave={touch("staff" + i)} />
    );
    const pos = <TextInput LabelText="ตำแหน่ง" State="Readonly" readOnly Text={staffPos(v.staff[i])} Placeholder="-" aria-label={"ตำแหน่ง " + no} />;
    const tel = <TextInput LabelText="เบอร์โทร" Text={v.tels[i] ?? ""} Placeholder="0XX-XXX-XXXX" onChange={(x) => put({ tels: v.staff.map((_, j) => (j === i ? x : v.tels[j] ?? "")) })} aria-label={"เบอร์โทร " + no} />;
    const del = <TertiaryButton LeadingIconSwap="delete-24-300-round" ButtonText={false} aria-label={"ลบพนักงาน" + no} title={"ลบพนักงาน" + no} onClick={() => dropStaff(i)} />;
    return mob
      ? <div key={i} className="flex flex-col gap-4">{pick}{pos}{tel}<div className="flex">{del}</div></div>
      : <div key={i} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-6">{pick}{pos}{tel}{del}</div>;
  };
  const nStaff = v.staff.filter(Boolean).length;

  const blank = fromTrip(edit, edit ? edit.mode : initialMode);
  useProtoForm(kbk && !denied ? {
    fill: () => {
      const ids = v.carIds.length ? v.carIds : pool.filter((c) => !taken[c.id]).slice(0, 3).map((c) => c.id);
      const staff = hire || (v.staff[0] && v.staff[1]) ? v.staff : [v.staff[0] || STAFF.find((n) => n !== v.staff[1])!, v.staff[1] || STAFF.find((n) => n !== (v.staff[0] || STAFF[0]))!, ...v.staff.slice(2)];
      put({ name: v.name.trim() ? v.name : (hire ? "จ้างบำรุงรักษายานพาหนะ " : "ตรวจยานพาหนะ ") + nowQ, vendor: hire && !v.vendor ? VENDORS[0].name : v.vendor, vendorTel: hire && !v.vendorTel.trim() ? (VENDORS.find((x) => x.name === (v.vendor || VENDORS[0].name))?.tel ?? "") : v.vendorTel,
        d1: v.d1 || "17/11/2569", d2: v.d2 || "21/11/2569", carIds: ids, staff, tels: staff.map((n, i) => v.tels[i] || (n ? staffTelOf(edit, n) : "")) });
      setTouched({});
    },
    clear: () => { setV(blank); setTouched({}); },
    dirty: JSON.stringify(v) !== JSON.stringify(blank),
  } : null);
  if (denied) return null;
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
                onPick={(vendor) => put({ vendor, vendorTel: VENDORS.find((x) => x.name === vendor)?.tel ?? "" })} error={E("vendor", "กรุณาเลือกผู้รับจ้าง", !v.vendor)} onLeave={touch("vendor")} />
              <TextInput LabelText="เบอร์โทรผู้รับจ้าง" Text={v.vendorTel} Placeholder="0XX-XXX-XXXX" inputMode="tel" onChange={(vendorTel) => put({ vendorTel })} onBlur={touch("vendorTel")}
                State={E("vendorTel", "x", !v.vendorTel.trim()) ? "Error" : undefined} HelperText={E("vendorTel", "กรุณาระบุเบอร์โทรผู้รับจ้าง", !v.vendorTel.trim())} />
              <TextInput LabelText="เลขที่สัญญา/ใบสั่งจ้าง" Optional Text={v.contract} Placeholder="ระบุเลขที่สัญญาหรือใบสั่งจ้าง" onChange={(contract) => put({ contract })} />
            </>, 3)}
          </Section>
        )}


        <Section>
          <SectionHeader Title={hire ? "ช่วงวันทำงาน" : "ช่วงวันเดินทาง"} />
          <div ref={dateRef} className="relative">
            {row(<>
              <TextInput LabelText={hire ? "วันที่เริ่มงาน" : "วันที่เดินทาง ตั้งแต่"} Text={v.d1} Placeholder="วว/ดด/ปปปป" onChange={(d1) => putDates({ d1 })} onFocus={() => !mob && setDateOpen(true)} onBlur={() => !dateOpen && touch("d1")()}
                State={E("d1", "x", !v.d1.trim()) ? "Error" : dateOpen ? "Focused" : undefined} HelperText={E("d1", "กรุณาเลือกวันที่เริ่ม", !v.d1.trim())} />
              <TextInput LabelText="ถึงวันที่" Text={v.d2} Placeholder="วว/ดด/ปปปป" onChange={(d2) => putDates({ d2 })} onFocus={() => !mob && setDateOpen(true)} onBlur={() => !dateOpen && touch("d2")()}
                State={E("d2", "x", !v.d2.trim()) ? "Error" : undefined} HelperText={E("d2", "กรุณาเลือกวันที่สิ้นสุด", !v.d2.trim())} />
              {!mob && <span />}
            </>, 3)}
            {dateOpen && !mob && (
              <div className="absolute top-full left-0 z-30 mt-1">
                <DatePicker Type="Dual" {...TH_PICKER} value={range} onCancel={() => setDateOpen(false)}
                  onApply={(r) => { putDates({ d1: r.start ? toThai(r.start) : "", d2: r.end ? toThai(r.end) : r.start ? toThai(r.start) : "" }); setDateOpen(false); }} />
              </div>
            )}
          </div>
        </Section>

        {!hire && (
          <Section>
            <SectionHeader Title="พนักงานที่เดินทาง" Badge={nStaff ? nStaff + " คน" : null} />
            {v.staff.map((_, i) => staffRow(i))}
            <div className="flex"><SecondaryButton Text="เพิ่มพนักงาน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} className={mob ? "w-full" : undefined}
              onClick={() => put({ staff: [...v.staff, ""], tels: [...v.staff.map((_, j) => v.tels[j] ?? ""), ""] })} /></div>
          </Section>
        )}

        <Section>
          <SectionHeader Title="ยานพาหนะในแผนเดินทาง" Badge={cars.length || null}
            Actions={<SecondaryButton Text="เพิ่มยานพาหนะ" LeadingIconSwap="add-24-300-round" onClick={() => setPicker(true)} />} />
          {cars.length
            ? <DataTable columns={TRIP_CAR_COLS} rows={carRows} rowKey={(r) => String(r[0])} />
            : <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในแผนเดินทาง" SupportingText={"กดเพิ่มยานพาหนะเพื่อเลือกยานพาหนะของ" + nowQ + " ที่ยังไม่อยู่ในแผนเดินทางใด"} />}
        </Section>

        <Section>
          <SectionHeader Title="อะไหล่ของแผนเดินทาง" />
          {parts.length
            ? <DataTable columns={QPART_COLS} rows={parts.map(qpartRow)} rowKey={(_, i) => parts[i].key} />
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={TRIP_PARTS_EMPTY} />}
        </Section>

        <BtnRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          <PrimaryButton Text={edit ? "ส่งอนุมัติใหม่" : "ยืนยันการสร้างแผนเดินทาง"} Size="lg" State={kbk && valid ? "Default" : "Disabled"} onClick={submit} />
        </BtnRow>
      </Content>
      {rowActs.Menu}
      <TripCarPicker open={picker} pool={pool} taken={taken} nowQ={nowQ} areaOf={carArea} onCancel={() => setPicker(false)}
        onAdd={(ids) => { const e = qEditOf(mock, planId, q), pick = (o: Record<string, string>) => Object.fromEntries(ids.filter((x) => o[x]).map((x) => [x, o[x]]));
          put({ carIds: [...v.carIds, ...ids], phones: { ...v.phones, ...pick(e.phones) }, locs: { ...v.locs, ...pick(e.locs) }, names: { ...v.names, ...pick(e.names ?? {}) } }); setPicker(false); }} />
      <TripCarEditModal car={editCar} trip={over} work={editCar ? { d1: vt.d1, d2: vt.d2, value: vt.d1 ? workOf(vt, editCar.id) : ["", ""] } : undefined} onCancel={() => setEditCar(null)}
        onSave={(o, w) => { const works = { ...v.works }; if (editCar) { if (w) works[editCar.id] = w; else delete works[editCar.id]; } put({ ...o, works }); setEditCar(null); }} />
    </>
  );
}
