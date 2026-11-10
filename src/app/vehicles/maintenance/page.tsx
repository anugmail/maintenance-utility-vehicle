"use client";
/* S24 W.1–W.5 W.8–W.10 · หน้า ข้อมูลยานพาหนะ แท็บ "การบำรุงรักษา" = แดชบอร์ดการบำรุงรักษารายคัน (/vehicles/maintenance/) — maList() ใน screens.js
   Figma d6ce03a (R90) + 18a432e (รอบ 2 · 10 พ.ย. 2569): เจ้าของงาน "ตั้งใจอยากให้หน้านี้เป็นหน้า dashboard ที่สามารถกรองสิ่งต่างๆที่ต้องการ …"
     + "หน้าของ list อยากแสดงรายละเอียดอื่นๆ ตัวอย่างเช่นพวกอายุการใช้งาน หรืออะไรที่เกี่ยวข้องกับการบำรุงรักษา"
   โครงตาม MA Overview + Vehicle list ของ UI Release#2 หน้า Vehicle Management: Page header "ข้อมูลยานพาหนะ" (Breadcrumbs ยานพาหนะ) → Section ช่องไฟ 24:
     Tabs (ยานพาหนะ · การบำรุงรักษา + ป้ายจำนวนคันที่ใกล้ครบ/ครบกำหนด · ปฏิทินการจอง เอาออก 18a432e เป็นของระบบจองยานพาหนะ) → Metric item 4 ใบ (maMetrics)
     → Table header (ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" + ตัวกรอง + ชิป) → Table 8 คอลัมน์ MA_COLS (ไม่มีคอลัมน์ปุ่ม … · เลขทะเบียนเป็นลิงก์เปิดหน้ารายละเอียด แท็บข้อมูลยานพาหนะ)
     + pagination / Empty state/Search not found + ล้างตัวกรอง
   ตัวกรอง 6 ช่อง (FilterShell · Input dropdown with badges หลายค่า / Input dropdown ค่าเดียว): ประเภทยานพาหนะ · สังกัดยานพาหนะ · บำรุงรักษาล่าสุด · ครบกำหนดภายใน · รายการที่ครบกำหนด · ผลตรวจน้ำมันล่าสุด
   แท็บ "ยานพาหนะ" เป็นของระบบ Vehicle Management (ไม่พาไปไหน) · ข้อมูล lib/mock/maintenance.ts · ?sample=S24 = ชุดตัวอย่างของหน้า /scenarios/ */
import { Suspense, useMemo, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import type { TableColumn } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { VEHICLE_TYPES } from "@/lib/mock/data";
import { applySample, patchJob } from "@/lib/mock/jobs";
import {
  MA_DUE, MA_ITEMS, MA_LAST_OPTS, MA_NO_DATA, MA_OIL_OPTS, MA_VSTAT, MA_WAR, MA_WITHIN_OPTS,
  ageText, isDue, itemMatch, lastMatch, maMetrics, nextText, useMaCars, withinMatch, type MaCar,
} from "@/lib/mock/maintenance";
import { useSample, type SampleMap } from "@/lib/useSample";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { Metrics } from "@/app/parts/_lib/ui";
import { ALL, FilterShell, LIST_TITLE, VEHICLE_ROOT, detailHref, MaGrid, useMaAccess, type MaValue } from "../_lib/ui";

/* MA_COLS (18a432e) */
const MA_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 200, Style: "Lead text" }, { head: "อายุการใช้งาน", width: 170 }, { head: "บำรุงรักษาล่าสุด", width: 140 }, { head: "ครั้งถัดไป" },
  { head: "ผลตรวจน้ำมันล่าสุด", width: 160 }, { head: "ประกัน", width: 150, Style: "Badge" }, { head: "สถานะยานพาหนะ", width: 150, Style: "Badge" }, { head: "ผู้ดูแลยานพาหนะ", width: 190 },
];
const MA_TABS = ["ยานพาหนะ", "การบำรุงรักษา"];

interface MaFilter { types: string[]; units: string[]; last: string; within: string; items: string[]; oil: string }
const NONE: MaFilter = { types: [], units: [], last: ALL, within: ALL, items: [], oil: ALL };
type Multi = "types" | "units" | "items";
type Single = "last" | "within" | "oil";
const SINGLE: { k: Single; label: string; options: string[] }[] = [
  { k: "last", label: "บำรุงรักษาล่าสุด", options: MA_LAST_OPTS }, { k: "within", label: "ครบกำหนดภายใน", options: MA_WITHIN_OPTS }, { k: "oil", label: "ผลตรวจน้ำมันล่าสุด", options: MA_OIL_OPTS },
];
const match = (c: MaCar, f: MaFilter) =>
  (!f.types.length || f.types.includes(c.car.type)) && (!f.units.length || f.units.includes(c.car.owner))
  && (f.last === ALL || lastMatch(c, f.last)) && (f.within === ALL || withinMatch(c, f.within))
  && (!f.items.length || itemMatch(c, f.items)) && (f.oil === ALL || c.result === f.oil);
/* ชิป: หลายค่า = ค่าที่เลือก · ค่าเดียว = "ชื่อช่อง ค่า" (W.9 W.10 "บำรุงรักษาล่าสุด เกิน 12 เดือน" "ครบกำหนดภายใน 3 เดือน") */
const chipOf = (s: (typeof SINGLE)[number], v: string) => s.label + " " + (s.label.endsWith("ภายใน") ? v.replace(/^ภายใน /, "") : v);
const chipsOf = (f: MaFilter) => [...f.types, ...f.units, ...SINGLE.filter((s) => f[s.k] !== ALL).map((s) => chipOf(s, f[s.k])), ...f.items];
const dropChip = (f: MaFilter, v: string): MaFilter => ({
  types: f.types.filter((x) => x !== v), units: f.units.filter((x) => x !== v), items: f.items.filter((x) => x !== v),
  last: chipOf(SINGLE[0], f.last) === v ? ALL : f.last, within: chipOf(SINGLE[1], f.within) === v ? ALL : f.within, oil: chipOf(SINGLE[2], f.oil) === v ? ALL : f.oil,
});

/* ?sample=S24 (ของต้นแบบ) — งานรายคันชุด T1_afterClose ของ S10 (82-6789 ปิดงานแล้ว 04/11/2569 รอผลตรวจน้ำมัน) + เอกสาร Safety Inspection ตอนปิดงาน */
const SAMPLES: SampleMap = {
  S24: { role: "หน่วยงาน (กกฟ.1)", apply: () => { applySample("T1_afterClose"); patchJob("T1", "82-6789", (j) => ({ ...j, safety: { files: [{ name: "Safety-Inspection-82-6789.pdf", size: "1.2 MB", bar: true }] } })); } },
};

/* maRow: ทะเบียน (ลิงก์ · ประเภท) · อายุการใช้งาน (เลขไมล์ · ชั่วโมง) · บำรุงรักษาล่าสุด (MR) · ครั้งถัดไป (วันที่ · รายการ · บรรทัดรองสถานะสี) · ผลตรวจน้ำมัน (เก็บตัวอย่าง วันที่) · ประกัน · สถานะยานพาหนะ · ผู้ดูแลยานพาหนะ (เบอร์) */
const maRow = (c: MaCar): MaValue[] => {
  const l = c.latest, st = c.next?.status;
  return [
    { text: c.car.plate, sub: c.car.type, href: detailHref(c.car.id, 0) },
    { text: ageText(c), sub: c.km ? c.km + " กม. · " + c.hours + " ชม." : undefined },
    l ? { text: l.date, sub: l.planMr } : "-",
    c.next ? { text: nextText(c), sub: st ? MA_DUE[st][0] : undefined, tone: st ? MA_DUE[st][1] : undefined } : { text: MA_NO_DATA },
    c.result && c.sampleAt ? { text: c.result, sub: "เก็บตัวอย่าง " + c.sampleAt } : "-",
    { pills: [MA_WAR[c.war]] }, { pills: [MA_VSTAT[c.vstat]] }, { text: c.car.ctrl || "-", sub: c.car.ownerPhone },
  ];
};

function MaList() {
  const mob = useBreakpoint() === "Mobile";
  const seeding = useSample(SAMPLES);
  const { ok, owner, unit } = useMaAccess();
  const cars = useMaCars(owner, unit);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MaFilter>(NONE);
  const [draft, setDraft] = useState<MaFilter>(NONE);
  const [panel, setPanel] = useState(false);
  const [open, setOpen] = useState("");
  const [page, setPage] = useState(1);

  const owners = useMemo(() => [...new Set(cars.map((c) => c.car.owner))], [cars]);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars.filter((c) => (!q || [c.car.plate, c.car.model].some((s) => s.toLowerCase().includes(q))) && match(c, filter));
  }, [cars, query, filter]);
  if (seeding || !ok) return null;

  const due = cars.filter(isDue).length;
  const chips = chipsOf(filter);
  const put = (f: MaFilter) => { setFilter(f); setPage(1); };
  const reset = () => { setQuery(""); put(NONE); };
  const toggle = (k: string) => (o: boolean) => setOpen(o ? k : "");
  const flip = (k: Multi, v: string) => setDraft({ ...draft, [k]: draft[k].includes(v) ? draft[k].filter((x) => x !== v) : [...draft[k], v] });
  const multi = (k: Multi, label: string, options: string[]) => (
    <InputDropdownWithBadges key={k} LabelText={label} Optional values={draft[k]} Placeholder={ALL} onRemove={(v) => setDraft({ ...draft, [k]: draft[k].filter((x) => x !== v) })} open={open === k} onOpenChange={toggle(k)}>
      <DropdownList>{options.map((o) => <DropdownListItem key={o} Text={o} State={draft[k].includes(o) ? "Selected" : "Default"} onClick={() => flip(k, o)} />)}</DropdownList>
    </InputDropdownWithBadges>
  );
  const single = ({ k, label, options }: (typeof SINGLE)[number]) => (
    <InputDropdown key={k} LabelText={label} Optional Size={mob ? "lg" : "md"} Text={draft[k]} open={open === k} onOpenChange={toggle(k)}>
      <DropdownList>{[ALL, ...options].map((o) => <DropdownListItem key={o} Text={o} State={o === draft[k] ? "Selected" : "Default"} onClick={() => { setDraft({ ...draft, [k]: o }); setOpen(""); }} />)}</DropdownList>
    </InputDropdown>
  );

  return (
    <>
      <PageHeader Title={LIST_TITLE} crumbs={[{ Text: VEHICLE_ROOT }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{MA_TABS.map((t, i) => <TabItem key={t} Text={t} Active={i === 1} Badge={i === 1 ? due : undefined} />)}</Tabs>
        <Metrics items={maMetrics(cars)} />
        <TableHeader Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} onFilter={() => { setDraft(filter); setOpen(""); setPanel(true); }}
          FilterCount={chips.length} Filters={chips} onRemoveFilter={(v) => put(dropChip(filter, v))} />
        {shown.length ? <MaGrid cols={MA_COLS} rows={shown.map(maRow)} page={page} onPage={setPage} />
          : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={reset} />} />}
      </section>
      <FilterShell open={panel} onClose={() => setPanel(false)} onClear={() => setDraft(NONE)} onApply={() => { put(draft); setPanel(false); }}>
        {multi("types", "ประเภทยานพาหนะ", VEHICLE_TYPES)}
        {multi("units", "สังกัดยานพาหนะ", owners)}
        {single(SINGLE[0])}
        {single(SINGLE[1])}
        {multi("items", "รายการที่ครบกำหนด", [...MA_ITEMS])}
        {single(SINGLE[2])}
      </FilterShell>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><MaList /></Suspense></AppFrame>;
}
