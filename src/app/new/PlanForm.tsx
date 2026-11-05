"use client";
/* ฟอร์มแผนบำรุงรักษา planForm() ใน screens.js แบบ A (เจ้าของงานเลือก 5 พ.ย. 2569 · รีวิวทีมออกแบบ) — ใช้ร่วม S1 สร้างแผน (/new/) และ S19 แก้ไขแผน (/edit/?id=)
   ตาม `Section header` · `Input dropdown with badges` · `Tabs` · `Table header` · `Table cell` (Lead checkbox) · `Empty state/Data empty` (Graphic=vehicle) · `Empty state/Search not found`
   · `Radio text card` ของไฟล์ Component + หน้า 5.2 Vehicle Management (Vehicle list · Export reports - Select vehicles) ของ UI Release#2
   Content ช่องไฟ 32:
     (แก้ไข) Alert — ส่งกลับแก้ไข: Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล · อนุมัติแล้ว: Warning "แผนนี้อนุมัติแล้ว"
     ข้อมูลแผน (Section header) — ชื่อแผน (Text input) · ปีงบประมาณ (สร้าง: Input dropdown · แก้ไข: Readonly)
     เลือกรถเข้าแผนและจัดลงไตรมาส (Section header + ป้าย "ในแผน n คัน") — ภาค (หลายค่า) · เขต (หลายค่า เขตของทุกภาคที่เลือกรวมกัน · Disabled จนกว่าเลือกภาค) · ประเภทรถ
       เลือกภาคแล้ว (หรือมีรถในแผน): Tabs ทั้งหมด n · ไตรมาส 1–4 n (Pill) → Table header (หัว "รถในพื้นที่ที่เลือก" / "รถในไตรมาส n" + Badge "n คัน" · ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น"
       · ตัวกรอง + Pill จำนวนตัวกรอง · ปุ่ม "จัดลงไตรมาส (n)" Disabled เมื่อยังไม่ติ๊ก · ชิปตัวกรองกดเอาออกได้) → ตารางติ๊ก + Table pagination
       ทั้งหมด: ทะเบียน (ยี่ห้อ/รุ่น) · ประเภทรถ · เขต / หน่วยงานเจ้าของรถ · ไตรมาส (Pill "ไตรมาส n" Brand / "ยังไม่จัด" Gray)
       ไตรมาส n: Q_COLS (น้ำมันไฮโดรลิก · อะไหล่ · ไอคอนแก้ไข → S21) · มือถือ List with checkbox
       ยังไม่เลือกภาค: Empty state "ยังไม่มีรายการรถ" · ไตรมาสว่าง: "ยังไม่มีรถในไตรมาสนี้" · ไม่ตรงคำค้น/ตัวกรอง: Search not found + "ล้างตัวกรอง"
     อะไหล่ในไตรมาส n — (BACKLOG ข้อ 11 แทนที่ส่วนนี้)
     ปุ่ม ย้อนกลับ (แก้ไข: ยกเลิก) · บันทึกและส่งอนุมัติ — Disabled จนกว่า ชื่อแผน · ปีงบประมาณ · รถในไตรมาสอย่างน้อย 1 คัน ครบ
   popup "จัดลงไตรมาส" (Radio text card ไตรมาส 1–4 เรียงลง ช่องไฟ 12 · ไม่มีตัวเลือกเอาออก) → toast "จัดรถ n คันลงไตรมาส k สำเร็จ" · มือถือ bottom sheet
   เอาภาค เขต ประเภทรถ ชิปตัวกรอง หรือคำค้นออก = เปลี่ยนแค่แถวที่เห็น รถที่จัดแล้วไม่หาย (ไม่มี confirm)
   Validation: ช่องบังคับที่ออกจากช่องโดยยังว่าง (Out of focus) แสดง "กรุณาระบุชื่อแผน" / "กรุณาเลือกปีงบประมาณ"
   popup ยืนยัน: ออกจากหน้าเมื่อมีการแก้ไข · (แก้ไข) ยืนยันการแก้ไข */
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { PopupModal } from "@/components/patterns/PopupModal";
import { Alert } from "@/components/vms/Alert";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TabItem } from "@/components/vms/TabItem";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { Tabs } from "@/components/vms/Tabs";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { CAND, DISTRICTS, QUARTERS, REGIONS, VEHICLE_TYPES, YEARS, shortRegion, type Plan } from "@/lib/mock/data";
import { carsFor, emptyDraft, inQuarter, isDirty, matchQuery, planFromDraft, thaiToday, type Draft } from "@/lib/mock/plan";
import { carParam, draftFromPlan, draftKey, dropQuarterRow, oilOf, partCell, planId, planWithDraft, quarterRows, type QuarterRow } from "@/lib/mock/planFlow";
import { notify, setMock, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { CheckTable, type CheckRow } from "./CheckTable";

/* CARP_COLS (หน้ารายละเอียดแผน PlanBody · ดูอย่างเดียว) · PART_COLS.slice(0, 5) + ไอคอน (screens.js) */
export const CARP_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 180 },
  { head: "น้ำมันไฮโดรลิก", width: 140 }, { head: "เปลี่ยนล่าสุด", width: 120 }, { head: "อะไหล่", width: 120 }, { head: "", width: 104, Style: "Action icons" },
];
export const PART_COLS: TableColumn[] = [
  { head: "รายการอะไหล่", Style: "Lead text", SortIcon: "Swap" }, { head: "รหัส", width: 100 }, { head: "หมวด", width: 110 },
  { head: "ตามแผน", width: 100 }, { head: "หน่วย", width: 90 }, { head: "", width: 104, Style: "Action icons" },
];
/* PICK_COLS — แท็บทั้งหมด · Q_COLS — แท็บไตรมาส n (screens.js) */
const PICK_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 260 }, { head: "ประเภทรถ", width: 160 }, { head: "เขต / หน่วยงานเจ้าของรถ" }, { head: "ไตรมาส", width: 160, Style: "Badge" }];
const Q_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 240 }, { head: "ประเภทรถ", width: 130 }, { head: "เขต / หน่วยงานเจ้าของรถ" }, { head: "น้ำมันไฮโดรลิก", width: 200 }, { head: "อะไหล่", width: 200 }, { head: "", width: 72, Style: "Action icons" }];
const PER = 10;
/* S19: Alert เหนือฟอร์มแก้ไข (ALERT_RETURNED · ALERT_APPROVED) */
const ALERT_APPROVED = ["แผนนี้อนุมัติแล้ว", "เมื่อบันทึก แผนจะกลับเป็นสถานะรออนุมัติ และต้องให้ผู้อนุมัติตรวจสอบอีกครั้ง"] as const;

type Open = "" | "year" | "region" | "district" | "type";
type Pending = { spec: ConfirmSpec; run: () => void };

/** mode="create" = S1 (ฟอร์มใน mock.draft) · mode="edit" = S19 (ฟอร์มใน mock.edit ของแผน plan) · from = หน้าที่เปิดฟอร์มแก้ไขมา (ยกเลิกแล้วกลับไป) */
export function PlanForm({ mode, plan, from }: { mode: "create" | "edit"; plan?: Plan; from?: string }) {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const edit = mode === "edit" && plan;
  const base = (): Draft => (edit ? draftFromPlan(plan) : emptyDraft());
  const d: Draft = (edit ? mock.edit : mock.draft) ?? base();
  const [open, setOpen] = useState<Open>("");
  const [query, setQuery] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [assign, setAssign] = useState<string | null>(null);   // popup จัดลงไตรมาส: ตัวเลือกที่เลือก ("" = ยังไม่เลือก · null = ปิด)
  const [touched, setTouched] = useState<{ name?: boolean; year?: boolean }>({});
  const [pending, setPending] = useState<Pending | null>(null);

  const put = (patch: Partial<Draft>) => setMock((s) => (edit ? { ...s, edit: { ...(s.edit ?? base()), ...patch } } : { ...s, draft: { ...(s.draft ?? emptyDraft()), ...patch } }));
  const toggle = (k: Open) => (v: boolean) => {
    if (!v && k === "year" && open === "year" && !d.year) setTouched((t) => ({ ...t, year: true }));   // ปิดรายการปีโดยยังไม่เลือก = out of focus
    setOpen(v ? k : open === k ? "" : open);
  };
  const reset = () => { setPage(1); setTicked([]); };

  /* ---------- ภาค เขต ประเภทรถ — เปลี่ยนแค่แถวที่เห็น ไม่แตะรถที่จัดแล้ว ---------- */
  const setArea = (patch: Partial<Pick<Draft, "regions" | "districts" | "types">>) => { put(patch); reset(); };
  const removeRegion = (r: string) => setArea({ regions: d.regions.filter((x) => x !== r), districts: d.districts.filter((x) => !DISTRICTS[r].includes(x)) });
  const removeDistrict = (x: string) => setArea({ districts: d.districts.filter((y) => y !== x) });
  const removeType = (t: string) => setArea({ types: d.types.filter((y) => y !== t) });
  const flip = (list: string[], v: string, remove: (v: string) => void, add: (next: string[]) => void) => (list.includes(v) ? remove(v) : add([...list, v]));
  const chips = [...d.regions.map(shortRegion), ...d.districts, ...d.types];
  const removeChip = (c: string) => {
    const r = d.regions.find((x) => shortRegion(x) === c);
    if (r) removeRegion(r); else if (d.districts.includes(c)) removeDistrict(c); else removeType(c);
  };

  /* ---------- รถ ---------- */
  const nIn = Object.keys(d.alloc).length;
  const area = carsFor(d);
  const q = d.q;
  const inQ = (k: number) => inQuarter(d, k);
  const k = query.trim();
  const shown = (q ? inQ(q) : area).filter((i) => matchQuery(i, k));
  const last = Math.max(1, Math.ceil(shown.length / PER)), pg = Math.min(page, last);
  const rowsOnPage = shown.slice((pg - 1) * PER, pg * PER);
  const showTable = d.regions.length > 0 || nIn > 0;
  const nTicked = ticked.length;
  const qPill = (i: number): [string, "Brand" | "Gray"] => (d.alloc[i] ? ["ไตรมาส " + d.alloc[i], "Brand"] : ["ยังไม่จัด", "Gray"]);
  const toS21 = (car: number) => router.push("/car-parts/?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&car=" + carParam(car) + (from === "detail" ? "&from=detail" : ""));
  const rows: CheckRow[] = rowsOnPage.map((i) => {
    const c = CAND[i];
    if (!q) return { key: String(i), text: c.plate, sub: c.model, mobileSub: c.model + " · " + qPill(i)[0], cells: [c.type, c.owner, { pills: [qPill(i)] }] };
    const oil = oilOf(d, i), parts = partCell(d, i);
    return { key: String(i), text: c.plate, sub: c.model, mobileSub: "น้ำมัน " + oil + " · อะไหล่ " + parts,
      cells: [c.type, c.owner, oil, parts, { actions: [{ IconSwap: "stylus-24-300-round", label: "แก้ไขอะไหล่ " + c.plate, onClick: () => toS21(i) }] }] };
  });
  const doAssign = () => {
    const kq = QUARTERS.indexOf(assign ?? "") + 1;
    if (!kq) return;
    const alloc = { ...d.alloc };
    ticked.forEach((x) => { alloc[Number(x)] = kq; });
    put({ alloc });
    notify("จัดรถ " + ticked.length + " คันลงไตรมาส " + kq + " สำเร็จ");
    setTicked([]); setAssign(null);
  };
  const clearFilters = () => { setQuery(""); setArea({ districts: [], types: [] }); };

  /* ---------- อะไหล่ในไตรมาส (เดิม · BACKLOG ข้อ 11 แทนที่) ---------- */
  const qCars = q ? inQ(q) : [];
  const qRows = q ? quarterRows(d, q) : [];
  const dropPart = (r: QuarterRow) => setPending({
    spec: { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: r.name + " จะถูกเอาออกจากรถทุกคันในไตรมาส " + q, cancel: "ยกเลิก", ok: "เอาออก" },
    run: () => put(dropQuarterRow(d, q, r)),
  });
  const firstWith = (r: QuarterRow) => qCars.find((c) => (r.pi != null ? (d.picks[c] || []).includes(r.pi) : (d.manual?.[c] || []).some((m) => "m" + m.name + "|" + m.code === r.key))) ?? qCars[0];

  /* ---------- ออก / ตรวจและบันทึก ---------- */
  const back = from === "detail" && plan ? "/detail/?id=" + planId(plan) : "/";
  const complete = !!d.name.trim() && !!d.year && nIn > 0;   // รีวิว 5 พ.ย. 2569 "ต้องกรอกข้อมูลที่ require ครบถึงจะ enable ปุ่ม"
  const leave = () => {
    if (edit) {
      const go = () => { setMock((s) => ({ ...s, edit: null })); router.push(back); };
      if (draftKey(d) === draftKey(draftFromPlan(plan))) return go();
      return setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่แก้ไขไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ยืนยัน" }, run: go });
    }
    const go = () => { setMock((s) => ({ ...s, draft: null })); router.push("/"); };
    if (!isDirty(d)) return go();
    setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ออก" }, run: go });
  };
  const save = () => {
    if (!complete) return;
    if (edit) {
      return setPending({
        spec: { title: "ยืนยันการแก้ไข", sub: "แผนจะกลับเป็นสถานะรออนุมัติ และส่งให้ผู้อนุมัติตรวจสอบอีกครั้ง โปรดตรวจสอบก่อนยืนยัน", cancel: "ยกเลิก", ok: "ยืนยัน" },
        run: () => {
          if (mock.failSave) { notify("general error", "Error"); return; }
          setMock((s) => ({ ...s, edit: null, plans: s.plans.map((p) => (p.mr === plan.mr ? planWithDraft(p, d, thaiToday()) : p)) }));
          notify("บันทึกการแก้ไขแผนและส่งอนุมัติสำเร็จ");
          router.push("/");
        },
      });
    }
    if (mock.failSave) { notify("general error", "Error"); return; }
    setMock((s) => ({ ...s, draft: null, plans: [planFromDraft(d, s.plans, thaiToday(), s.retiredMr), ...s.plans] }));
    notify("ส่งแผนบำรุงรักษาเพื่ออนุมัติสำเร็จ");
    router.push("/");
  };

  const table = (cols: TableColumn[], rs: TableValue[][]) => (mob ? <MobileCards columns={cols} rows={rs} /> : <Table columns={cols} rows={rs} />);
  const row = (kids: ReactNode, n: number) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const empty = (t: string, s: string) => <EmptyStateDataEmpty Text={t} SupportingText={s} Graphic="vehicle" />;
  const heading = edit ? "แก้ไขแผน " + plan.mr : "สร้างแผนบำรุงรักษา";
  const nameErr = touched.name && !d.name.trim();
  const yearErr = touched.year && !d.year;

  const carBody = !showTable || (!q && !d.regions.length)
    ? empty("ยังไม่มีรายการรถ", "เลือกภาค เขต และประเภทรถเพื่อแสดงรถทั้งหมดของพื้นที่นั้น")
    : shown.length
      ? <CheckTable columns={q ? Q_COLS : PICK_COLS} rows={rows} ticked={ticked} onTicked={setTicked}
          Pagination={<TablePagination total={shown.length} page={pg} perPage={PER} onPage={setPage} />} />
      : q && !k
        ? empty("ยังไม่มีรถในไตรมาสนี้", "ติ๊กรถในแท็บทั้งหมด แล้วกดจัดลงไตรมาส")
        : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={clearFilters} />} />;

  return (
    <>
      <PageHeader Title={heading} onBack={leave} crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: edit ? heading : "สร้างแผน" }]} />
      <div className="flex flex-col gap-8">
        {edit && plan.status === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        {edit && plan.status === "approved" && <Alert Color="Warning" Text={ALERT_APPROVED[0]} SupportingText={ALERT_APPROVED[1]} />}
        <section className="flex flex-col gap-4">
          <SectionHeader Title="ข้อมูลแผน" />
          {row(<>
            <TextInput LabelText="ชื่อแผน" Text={d.name} Placeholder="ระบุชื่อแผน" onChange={(v) => put({ name: v })} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              State={nameErr ? "Error" : undefined} HelperText={nameErr ? "กรุณาระบุชื่อแผน" : undefined} />
            {edit ? <TextInput LabelText="ปีงบประมาณ" Text={d.year} State="Readonly" readOnly /> : (
              <InputDropdown LabelText="ปีงบประมาณ" Text={d.year} Placeholder="เลือกปีงบประมาณ" open={open === "year"} onOpenChange={toggle("year")}
                State={yearErr ? (open === "year" ? "Error Focused" : "Error") : undefined} HelperText={yearErr ? "กรุณาเลือกปีงบประมาณ" : undefined}>
                <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === d.year ? "Selected" : "Default"} onClick={() => { put({ year: y }); setOpen(""); }} />)}</DropdownList>
              </InputDropdown>
            )}
          </>, 2)}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title="เลือกรถเข้าแผนและจัดลงไตรมาส" Badge={nIn ? "ในแผน " + nIn + " คัน" : null} />
          {row(<>
            <InputDropdownWithBadges LabelText="ภาค" values={d.regions} Placeholder="เลือกภาค" onRemove={removeRegion} open={open === "region"} onOpenChange={toggle("region")}>
              <DropdownList>{REGIONS.map((r) => <DropdownListItem key={r} Text={r} State={d.regions.includes(r) ? "Selected" : "Default"} onClick={() => flip(d.regions, r, removeRegion, (regions) => setArea({ regions }))} />)}</DropdownList>
            </InputDropdownWithBadges>
            <InputDropdownWithBadges LabelText="เขต" values={d.districts} Placeholder="เลือกเขต" onRemove={removeDistrict} open={open === "district"} onOpenChange={toggle("district")}
              State={!d.regions.length ? "Disabled" : undefined}>
              <DropdownList>{d.regions.flatMap((r) => DISTRICTS[r]).map((x) => <DropdownListItem key={x} Text={x} State={d.districts.includes(x) ? "Selected" : "Default"} onClick={() => flip(d.districts, x, removeDistrict, (districts) => setArea({ districts }))} />)}</DropdownList>
            </InputDropdownWithBadges>
            <InputDropdownWithBadges LabelText="ประเภทรถ" values={d.types} Placeholder="เลือกประเภทรถ" onRemove={removeType} open={open === "type"} onOpenChange={toggle("type")}>
              <DropdownList>{VEHICLE_TYPES.map((t) => <DropdownListItem key={t} Text={t} State={d.types.includes(t) ? "Selected" : "Default"} onClick={() => flip(d.types, t, removeType, (types) => setArea({ types }))} />)}</DropdownList>
            </InputDropdownWithBadges>
          </>, 3)}
          {showTable && <>
            <Tabs>
              <TabItem Text="ทั้งหมด" Badge={area.length} Active={q === 0} onClick={() => { put({ q: 0 }); reset(); }} />
              {QUARTERS.map((_, i) => <TabItem key={i} Text={"ไตรมาส " + (i + 1)} Badge={inQ(i + 1).length} Active={q === i + 1} onClick={() => { put({ q: i + 1 }); reset(); }} />)}
            </Tabs>
            <TableHeader Title={q ? "รถในไตรมาส " + q : "รถในพื้นที่ที่เลือก"} Badge={shown.length + " คัน"} Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query}
              onQuery={(v) => { setQuery(v); setPage(1); }} FilterCount={chips.length} Filters={chips} onRemoveFilter={removeChip}
              Actions={<SecondaryButton Text={"จัดลงไตรมาส" + (nTicked ? " (" + nTicked + ")" : "")} Size={mob ? "lg" : "md"} State={nTicked ? "Default" : "Disabled"} onClick={() => nTicked && setAssign("")} />} />
          </>}
          {carBody}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title={"อะไหล่ในไตรมาส" + (q ? " " + q : "")} Badge={qRows.length || null}
            Actions={q ? <SecondaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" State={qCars.length ? "Default" : "Disabled"} onClick={() => qCars.length && toS21(qCars[0])} /> : undefined} />
          {qRows.length
            ? table(PART_COLS, qRows.map((r) => [r.name, r.code, r.group, String(r.qty), r.unit,
                { actions: [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + r.name, onClick: () => toS21(firstWith(r)) }, { IconSwap: "delete-24-300-round", label: "เอา " + r.name + " ออก", onClick: () => dropPart(r) }] }]))
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={!q ? "เปิดแท็บไตรมาสเพื่อดูอะไหล่ของรถในไตรมาสนั้น" : qCars.length ? "กดเพิ่มอะไหล่เพื่อเลือกอะไหล่ของรถในไตรมาสนี้" : "เลือกรถเข้าไตรมาสนี้ก่อน แล้วจึงเพิ่มอะไหล่ได้"} />}
        </section>

        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text={edit ? "ยกเลิก" : "ย้อนกลับ"} Size="lg" onClick={leave} />
          <PrimaryButton Text="บันทึกและส่งอนุมัติ" Size="lg" State={complete ? "Default" : "Disabled"} onClick={save} />
        </div>
      </div>
      <PopupModal open={assign !== null} title="จัดลงไตรมาส" sub={"รถที่เลือก " + nTicked + " คัน · รถที่จัดไว้แล้วจะย้ายไปไตรมาสที่เลือก"} ok="ยืนยัน" okDisabled={!assign}
        onCancel={() => setAssign(null)} onOk={doAssign}>
        <div role="radiogroup" className="flex flex-col gap-3">
          {QUARTERS.map((t) => <RadioTextCard key={t} Text={t} Selected={assign === t} onClick={() => setAssign(t)} />)}
        </div>
      </PopupModal>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}
