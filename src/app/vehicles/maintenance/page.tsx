"use client";
/* S24 W.1–W.5 W.8–W.10 · หน้า ข้อมูลยานพาหนะ แท็บ "การบำรุงรักษา" = แดชบอร์ดการบำรุงรักษารายคัน (/vehicles/maintenance/) — maList() ใน screens.js
   Figma d6ce03a (R90) + 18a432e (รอบ 2 · 10 พ.ย. 2569): เจ้าของงาน "ตั้งใจอยากให้หน้านี้เป็นหน้า dashboard ที่สามารถกรองสิ่งต่างๆที่ต้องการ …"
     + "หน้าของ list อยากแสดงรายละเอียดอื่นๆ ตัวอย่างเช่นพวกอายุการใช้งาน หรืออะไรที่เกี่ยวข้องกับการบำรุงรักษา"
   12 พ.ย. 2569 แดชบอร์ดแบบ VMS+ (เจ้าของงาน _"อยากให้ออกแบบเป็นสไตล์นี้ … ให้เฉพาะ dashboard ที่ทำสิ่งนี้ได้ หน้าอื่นๆ ยังคงต้องตาม component เหมือนเดิม"_
     · สเปก userflow/figma-ref/vmsplus-dashboard-2569-11-12/SPEC-maintenance-dashboards.md · CLAUDE.md ข้อ 18 · ชิ้นกราฟ components/dashboard/ · COMPOSED.md หัวข้อ "แดชบอร์ดแบบ VMS+")
   โครง: Page header "ข้อมูลยานพาหนะ" (Breadcrumbs ยานพาหนะ · คงเดิม) → Tabs (ยานพาหนะ · การบำรุงรักษา + ป้ายจำนวนคันที่ใกล้ครบ/ครบกำหนด · คงเดิม)
     → หัวแดชบอร์ด (ไอคอน · "แดชบอร์ดการบำรุงรักษา" · ข้อมูล ณ MA_TODAY) → เรื่องที่ควรดู (กดแล้วกรองทั้งหน้า)
     → แผงตัวกรองพับได้ = ช่องตัวกรองเดิม 7 ช่อง (เลือกแล้วใช้ทันที) + ชิปตัวกรองที่เลือก (รวมที่มาจากการคลิกกราฟ) → การ์ดตัวเลข 6 ใบ
     → กราฟ 6 ใบ (สังกัด หน่วยงาน/เขต · สถานะกำหนด · กำหนด 12 เดือน · ผลตรวจน้ำมัน · ประเภท · อายุการใช้งาน) คลิกแถบ/ชิ้น/แท่ง = เพิ่ม/เอาตัวกรองนั้นออกทั้งหน้า
     → รายการยานพาหนะ: Table header (ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" ใช้กับตารางอย่างเดียว · ปุ่มตัวกรอง = กางแผงตัวกรอง · ส่งออก) + Table 8 คอลัมน์ MA_COLS (เรียงได้ทุกคอลัมน์)
       + pagination / Empty state/Search not found + ล้างตัวกรอง → หมายเหตุแหล่งข้อมูล
   MA_COLS: คอลัมน์สุดท้าย "ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก" แทน "ผู้ดูแลยานพาหนะ" (เจ้าของงาน 11 พ.ย. 2569 · BACKLOG ข้อ 65) = เปลี่ยนล่าสุด + 3 ปี + บรรทัดรองสีสถานะ MA_DUE
   ตัวกรอง 7 ช่อง: ประเภทยานพาหนะ · สังกัดยานพาหนะ · บำรุงรักษาล่าสุด · ครบกำหนดภายใน · รายการที่ครบกำหนด · ผลตรวจน้ำมันล่าสุด · ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก (11 พ.ย. 2569)
     + ตัวกรองจากกราฟ (เขต · สถานะกำหนด · เดือนที่ครบกำหนด · กลุ่มอายุ) ขึ้นเป็นชิปอย่างเดียว · ผลตรวจน้ำมันเพิ่มตัวเลือก "ยังไม่ตรวจ" (ชิ้นโดนัท)
   แท็บ "ยานพาหนะ" เป็นของระบบ Vehicle Management (ไม่พาไปไหน) · ข้อมูล lib/mock/maintenance.ts (ตัวเลขคิดใน ./dash.ts) · ?sample=S24 = ชุดตัวอย่างของหน้า /scenarios/ */
import { Suspense, useMemo, useRef, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PopupModal } from "@/components/patterns/PopupModal";
import { AlertBox, type DashAlert } from "@/components/dashboard/AlertCard";
import { BarList } from "@/components/dashboard/BarList";
import { ChartCard, ChartGrid, DashHead, DataAsOf, SourceNote, Toggle } from "@/components/dashboard/ChartCard";
import { ColumnChart } from "@/components/dashboard/ColumnChart";
import { Donut, LegendTable } from "@/components/dashboard/Donut";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { hueOf, nf, pct, type Hue } from "@/components/dashboard/palette";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { PLAN_CREATOR, VEHICLE_TYPES } from "@/lib/mock/data";
import { applySample, patchJob } from "@/lib/mock/jobs";
import {
  MA_DUE, MA_ITEMS, MA_LAST_OPTS, MA_NO_DATA, MA_OIL_OPTS, MA_TODAY, MA_VSTAT, MA_WAR, MA_WITHIN_OPTS,
  ageText, isDue, itemMatch, lastMatch, nextText, oilChangeOf, oilDueMatch, thaiDate, useMaCars, withinMatch, type MaCar,
} from "@/lib/mock/maintenance";
import { EXPORT_CARDS } from "@/lib/mock/partsDash";
import { notify } from "@/lib/mock/store";
import { useSample, type SampleMap } from "@/lib/useSample";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { RadioPick } from "@/app/parts/_lib/ui";
import { downloadCsv, openPrint } from "@/app/parts/_lib/exportFile";
import { ALL, LIST_TITLE, VEHICLE_ROOT, detailHref, MaGrid, useMaAccess, type MaSort, type MaValue } from "../_lib/ui";
import {
  AGE_GROUPS, DUE_ST, MONTH_KEYS, OVER, YEAR, YEAR_END_TEXT, ageGroup, avgAge, dueOf, longDate, maintainedThisYear, monthLabel, monthMatch, monthsOf,
  oilChangeThisYear, sortCars, zoneOf,
} from "./dash";

/* MA_COLS (18a432e) */
/* 11 พ.ย. 2569: ช่องสุดท้าย ผู้ดูแลยานพาหนะ (190) → ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก 240 ให้หัวคอลัมน์ไม่ถูกตัด · ทะเบียน 160 · บำรุงรักษาล่าสุด 130 · ประกัน 130 · สถานะยานพาหนะ 140 (เดิม 200 · 140 · 150 · 150) ให้หัวทุกช่องไม่ถูกตัด */
const MA_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 160, Style: "Lead text" }, { head: "อายุการใช้งาน", width: 170 }, { head: "บำรุงรักษาล่าสุด", width: 130 }, { head: "ครั้งถัดไป" },
  { head: "ผลตรวจน้ำมันล่าสุด", width: 160 }, { head: "ประกัน", width: 130, Style: "Badge" }, { head: "สถานะยานพาหนะ", width: 140, Style: "Badge" }, { head: "ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก", width: 240 },
];
const MA_TABS = ["ยานพาหนะ", "การบำรุงรักษา"];
const TITLE = "แดชบอร์ดการบำรุงรักษา";
const NOT_TESTED = "ยังไม่ตรวจ";   // ผลตรวจน้ำมัน: ยังไม่มีผล (ชิ้นโดนัท "ยังไม่ตรวจ")
const OIL_OPTS = [...MA_OIL_OPTS, NOT_TESTED];

/* ตัวกรอง: 7 ช่องเดิม + ตัวกรองจากกราฟ (zones เขต · due สถานะกำหนด · months เดือนที่ครบกำหนด · ages กลุ่มอายุ) */
interface MaFilter { types: string[]; units: string[]; last: string; within: string; items: string[]; oil: string; oilDue: string; zones: string[]; due: string[]; months: string[]; ages: string[] }
const NONE: MaFilter = { types: [], units: [], last: ALL, within: ALL, items: [], oil: ALL, oilDue: ALL, zones: [], due: [], months: [], ages: [] };
type Multi = "types" | "units" | "items" | "zones" | "due" | "months" | "ages";
type Single = "last" | "within" | "oil" | "oilDue";
const SINGLE: { k: Single; label: string; options: string[] }[] = [
  { k: "last", label: "บำรุงรักษาล่าสุด", options: MA_LAST_OPTS }, { k: "within", label: "ครบกำหนดภายใน", options: MA_WITHIN_OPTS }, { k: "oil", label: "ผลตรวจน้ำมันล่าสุด", options: OIL_OPTS },
  { k: "oilDue", label: "ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก", options: MA_WITHIN_OPTS },
];
const match = (c: MaCar, f: MaFilter) =>
  (!f.types.length || f.types.includes(c.car.type)) && (!f.units.length || f.units.includes(c.car.owner))
  && (f.last === ALL || lastMatch(c, f.last)) && (f.within === ALL || withinMatch(c, f.within))
  && (!f.items.length || itemMatch(c, f.items)) && (f.oil === ALL || (f.oil === NOT_TESTED ? !c.result : c.result === f.oil)) && (f.oilDue === ALL || oilDueMatch(c, f.oilDue))
  && (!f.zones.length || f.zones.includes(zoneOf(c))) && (!f.due.length || f.due.includes(dueOf(c)))
  && (!f.months.length || f.months.some((m) => monthMatch(c, m))) && (!f.ages.length || f.ages.includes(ageGroup(c)));
/* ชิป: หลายค่า = ค่าที่เลือก · ค่าเดียว = "ชื่อช่อง ค่า" (W.9 W.10 "บำรุงรักษาล่าสุด เกิน 12 เดือน" "ครบกำหนดภายใน 3 เดือน") · จากกราฟ = "เขต …" "สถานะ …" "กำหนดบำรุงรักษา …" "อายุการใช้งาน …" */
const chipOf = (s: (typeof SINGLE)[number], v: string) => s.label + " " + (s.label.endsWith("ภายใน") ? v.replace(/^ภายใน /, "") : v);
const CHART_CHIP: Record<"zones" | "due" | "months" | "ages", (v: string) => string> = {
  zones: (v) => "เขต " + v, due: (v) => "สถานะ " + v, months: (v) => "กำหนดบำรุงรักษา " + monthLabel(v), ages: (v) => "อายุการใช้งาน " + v,
};
function chipList(f: MaFilter): { text: string; drop: () => MaFilter }[] {
  const multi = (k: "types" | "units" | "items", text = (v: string) => v) => f[k].map((v) => ({ text: text(v), drop: () => ({ ...f, [k]: f[k].filter((x) => x !== v) }) }));
  const chart = (k: keyof typeof CHART_CHIP) => f[k].map((v) => ({ text: CHART_CHIP[k](v), drop: () => ({ ...f, [k]: f[k].filter((x) => x !== v) }) }));
  return [...multi("types"), ...multi("units"), ...SINGLE.filter((s) => f[s.k] !== ALL).map((s) => ({ text: chipOf(s, f[s.k]), drop: () => ({ ...f, [s.k]: ALL }) })),
    ...multi("items"), ...chart("zones"), ...chart("due"), ...chart("months"), ...chart("ages")];
}

/* ?sample=S24 (ของต้นแบบ) — งานรายคันชุด T1_afterClose ของ S10 (82-6789 ปิดงานแล้ว 04/11/2569 รอผลตรวจน้ำมัน) + เอกสาร Safety Inspection ตอนปิดงาน */
const SAMPLES: SampleMap = {
  S24: { role: "หน่วยงาน (กบผ.)", apply: () => { applySample("T1_afterClose"); patchJob("T1", "82-6789", (j) => ({ ...j, safety: { files: [{ name: "Safety-Inspection-82-6789.pdf", size: "1.2 MB", bar: true }] } })); } },
};

/* maRow: ทะเบียน (ลิงก์ · ประเภท) · อายุการใช้งาน (เลขไมล์ · ชั่วโมง) · บำรุงรักษาล่าสุด (MR) · ครั้งถัดไป (วันที่ · รายการ · บรรทัดรองสถานะสี) · ผลตรวจน้ำมัน (เก็บตัวอย่าง วันที่) · ประกัน · สถานะยานพาหนะ
   · ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิก (วันที่ · บรรทัดรองสถานะสี · ไม่มีข้อมูล = "-") */
const maRow = (c: MaCar): MaValue[] => {
  const l = c.latest, st = c.next?.status, o = oilChangeOf(c), ost = o?.status;
  return [
    { text: c.car.plate, sub: c.car.type, href: detailHref(c.car.id, 0) },
    { text: ageText(c), sub: c.km ? c.km + " กม. · " + c.hours + " ชม." : undefined },
    l ? { text: l.date, sub: l.planMr } : "-",
    c.next ? { text: nextText(c), sub: st ? MA_DUE[st][0] : undefined, tone: st ? MA_DUE[st][1] : undefined } : { text: MA_NO_DATA },
    c.result && c.sampleAt ? { text: c.result, sub: "เก็บตัวอย่าง " + c.sampleAt } : "-",
    { pills: [MA_WAR[c.war]] }, { pills: [MA_VSTAT[c.vstat]] },
    o?.due != null ? { text: thaiDate(o.due), sub: ost ? MA_DUE[ost][0] : undefined, tone: ost ? MA_DUE[ost][1] : undefined } : "-",
  ];
};
/* ไฟล์ส่งออก: ช่องลิงก์/สีเป็นข้อความ + บรรทัดรอง */
const exportRow = (c: MaCar): TableValue[] => maRow(c).map((v) => (v && typeof v === "object" && "text" in v ? { text: v.text, sub: v.sub } : (v as TableValue)));

const count = <T,>(xs: T[], f: (x: T) => boolean) => xs.filter(f).length;
const groupBy = <T,>(xs: T[], key: (x: T) => string) => { const m = new Map<string, T[]>(); xs.forEach((x) => m.set(key(x), [...(m.get(key(x)) ?? []), x])); return m; };
const STATUS_HUE: Hue[] = ["green", "orange", "red", "gray"];
const OIL_HUE: Record<string, Hue> = { "ผ่าน": "green", "ไม่ผ่าน": "red", "รอผลตรวจ": "orange", [NOT_TESTED]: "gray" };

function MaList() {
  const mob = useBreakpoint() === "Mobile";
  const seeding = useSample(SAMPLES);
  const { ok, owner, unit } = useMaAccess();
  const cars = useMaCars(owner, unit);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<MaFilter>(NONE);
  const [panel, setPanel] = useState(false);
  const [open, setOpen] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<MaSort | null>(null);
  const [byZone, setByZone] = useState(false);
  const [exp, setExp] = useState<{ format: string; scope: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const owners = useMemo(() => [...new Set(cars.map((c) => c.car.owner))], [cars]);
  /* ลำดับสีตามหมวด = ลำดับจากข้อมูลทั้งหมดก่อนกรอง (สียึดตัวรายการ) */
  const ownerOrder = useMemo(() => [...groupBy(cars, (c) => c.car.owner)].sort((a, b) => b[1].length - a[1].length).map((x) => x[0]), [cars]);
  const zoneOrder = useMemo(() => [...groupBy(cars, zoneOf)].sort((a, b) => b[1].length - a[1].length).map((x) => x[0]), [cars]);
  const fc = useMemo(() => cars.filter((c) => match(c, filter)), [cars, filter]);   // ทั้งหน้า (การ์ด กราฟ ตาราง)
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortCars(fc.filter((c) => !q || [c.car.plate, c.car.model].some((s) => s.toLowerCase().includes(q))), sort);
  }, [fc, query, sort]);
  if (seeding || !ok) return null;

  const due = cars.filter(isDue).length;
  const chipItems = chipList(filter);
  const chips = chipItems.map((c) => c.text);
  const put = (f: MaFilter) => { setFilter(f); setPage(1); };
  const reset = () => { setQuery(""); put(NONE); };
  const toggle = (k: string) => (o: boolean) => setOpen(o ? k : "");
  const flip = (k: Multi, v: string) => put({ ...filter, [k]: filter[k].includes(v) ? filter[k].filter((x) => x !== v) : [...filter[k], v] });
  const setOne = (k: Single, v: string) => put({ ...filter, [k]: filter[k] === v ? ALL : v });
  const openPanel = () => { setPanel(true); setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0); };
  const multi = (k: "types" | "units" | "items", label: string, options: string[]) => (
    <InputDropdownWithBadges key={k} LabelText={label} Optional values={filter[k]} Placeholder={ALL} onRemove={(v) => flip(k, v)} open={open === k} onOpenChange={toggle(k)}>
      <DropdownList>{options.map((o) => <DropdownListItem key={o} Text={o} State={filter[k].includes(o) ? "Selected" : "Default"} onClick={() => flip(k, o)} />)}</DropdownList>
    </InputDropdownWithBadges>
  );
  const single = ({ k, label, options }: (typeof SINGLE)[number]) => (
    <InputDropdown key={k} LabelText={label} Optional Size={mob ? "lg" : "md"} Text={filter[k]} open={open === k} onOpenChange={toggle(k)}>
      <DropdownList>{[ALL, ...options].map((o) => <DropdownListItem key={o} Text={o} State={o === filter[k] ? "Selected" : "Default"} onClick={() => { put({ ...filter, [k]: o }); setOpen(""); }} />)}</DropdownList>
    </InputDropdown>
  );

  /* ---------- เรื่องที่ควรดู (นับจากยานพาหนะทั้งหมดที่เห็นได้ ไม่ขึ้นกับตัวกรอง) ---------- */
  const nOver = count(cars, (c) => c.next?.status === "over"), nOil = count(cars, (c) => oilDueMatch(c, MA_WITHIN_OPTS[1]));
  const nFail = count(cars, (c) => c.result === "ไม่ผ่าน"), nNone = count(cars, (c) => !c.latest);
  const alerts: DashAlert[] = ([
    nOver && { key: "over", tone: "warning", title: "เลยกำหนดบำรุงรักษา " + nOver + " คัน", text: "ครั้งถัดไปเลยวันครบกำหนดแล้ว ควรจัดเข้าแผนเดินทางของไตรมาส", k: "within", v: MA_WITHIN_OPTS[0] },
    nOil && { key: "oil", tone: "warning", title: "ครบกำหนดเปลี่ยนน้ำมันไฮดรอลิกภายใน 1 เดือน " + nOil + " คัน", text: "รวมคันที่เลยกำหนดเปลี่ยนน้ำมันแล้ว (เปลี่ยนทุก 3 ปี)", k: "oilDue", v: MA_WITHIN_OPTS[1] },
    nFail && { key: "fail", tone: "warning", title: "ผลตรวจน้ำมันล่าสุดไม่ผ่าน " + nFail + " คัน", text: "ผลตรวจตัวอย่างน้ำมันไฮดรอลิกครั้งล่าสุดไม่ผ่าน ควรเปลี่ยนน้ำมันก่อนครบรอบ", k: "oil", v: "ไม่ผ่าน" },
    nNone && { key: "none", tone: "info", title: "ยังไม่มีข้อมูลบำรุงรักษาล่าสุด " + nNone + " คัน", text: "ยังไม่มีบันทึกการบำรุงรักษาในระบบ จึงคำนวณกำหนดครั้งถัดไปไม่ได้", k: "last", v: MA_LAST_OPTS[3] },
  ].filter(Boolean) as { key: string; tone: "warning" | "info"; title: string; text: string; k: Single; v: string }[])
    .map(({ k, v, ...a }) => ({ ...a, active: filter[k] === v, onClick: () => setOne(k, v) }));

  /* ---------- การ์ดตัวเลข ---------- */
  const n = fc.length, filtered = chips.length > 0;
  const nYear = count(fc, maintainedThisYear), nNear = count(fc, (c) => c.next?.status === "near"), nLate = count(fc, (c) => c.next?.status === "over"), nOilYear = count(fc, oilChangeThisYear);
  const kpis = [
    { tone: "blue" as const, icon: "local_shipping-24-300-round", label: "ยานพาหนะทั้งหมด", value: nf(n), unit: "คัน", sub: filtered ? "จาก " + nf(cars.length) + " คันที่เห็นได้" : "ยานพาหนะที่ติดตั้งเครื่องมือกล" },
    { tone: "green" as const, icon: "task_alt-24-300-round", label: "บำรุงรักษาแล้วในปีนี้", value: nf(nYear), unit: "คัน", sub: pct(nYear, n) + " ของทั้งหมด · ปี " + YEAR },
    { tone: "orange" as const, icon: "schedule-24-300-round", label: "ใกล้ครบกำหนด", value: nf(nNear), unit: "คัน", sub: "ครั้งถัดไปภายใน 6 เดือน · " + pct(nNear, n) },
    { tone: "red" as const, icon: "error-24-300-round", label: "เลยกำหนด", value: nf(nLate), unit: "คัน", sub: "ครั้งถัดไปเลยวันครบแล้ว · " + pct(nLate, n) },
    { tone: "purple" as const, icon: "oil_barrel-24-300-round", label: "ครบเปลี่ยนน้ำมันไฮดรอลิกในปีนี้", value: nf(nOilYear), unit: "คัน", sub: "ครบภายใน " + YEAR_END_TEXT + " รวมที่เลยกำหนด" },
    { tone: "navy" as const, icon: "history-24-300-round", label: "อายุการใช้งานเฉลี่ย", value: avgAge(fc), unit: "ปี", sub: "นับจากปีที่จดทะเบียนถึงปี " + YEAR },
  ];

  /* ---------- กราฟ ---------- */
  const dueN = (cs: MaCar[]) => count(cs, isDue);
  const byOwner = [...groupBy(fc, byZone ? zoneOf : (c) => c.car.owner)].sort((a, b) => b[1].length - a[1].length).map(([k, cs]) => ({
    key: k, label: k, value: cs.length, hue: hueOf(byZone ? zoneOrder : ownerOrder, k),
    sub: (byZone ? new Set(cs.map((c) => c.car.owner)).size + " หน่วยงาน · " : "") + "ครบหรือใกล้ครบกำหนด " + dueN(cs) + " คัน",
    active: byZone ? filter.zones.includes(k) : filter.units.includes(k),
  }));
  const statusSlices = DUE_ST.map((s, i) => ({ key: s, label: s, value: count(fc, (c) => dueOf(c) === s), hue: STATUS_HUE[i], active: filter.due.includes(s) }));
  const oilSlices = ["ผ่าน", "ไม่ผ่าน", "รอผลตรวจ", NOT_TESTED].map((s) => ({ key: s, label: s, value: count(fc, (c) => (s === NOT_TESTED ? !c.result : c.result === s)), hue: OIL_HUE[s], active: filter.oil === s }))
    .filter((s) => s.value > 0 || s.key !== "รอผลตรวจ");
  const monthGroups = MONTH_KEYS.map((k) => ({ key: k, label: monthLabel(k), values: [count(fc, (c) => monthsOf(c)[0] === k), count(fc, (c) => monthsOf(c)[1] === k)], active: filter.months.includes(k) }));
  const typeItems = VEHICLE_TYPES.map((t, i) => ({ key: t, label: t, value: count(fc, (c) => c.car.type === t), hue: (["blue", "green", "orange"] as Hue[])[i] ?? "gray",
    sub: "ครบหรือใกล้ครบกำหนด " + dueN(fc.filter((c) => c.car.type === t)) + " คัน", active: filter.types.includes(t) })).filter((x) => x.value > 0 || x.active).sort((a, b) => b.value - a.value);
  const ageCounts = AGE_GROUPS.map((g) => count(fc, (c) => ageGroup(c) === g));
  const ageGroups = AGE_GROUPS.map((g, i) => ({ key: g, label: g, values: [ageCounts[i]], active: filter.ages.includes(g) })).filter((g, i) => ageCounts[i] > 0 || g.key !== AGE_GROUPS[5] || g.active);

  /* ---------- ส่งออก (popup แบบ S4 · ตามตัวกรองและคำค้นที่ใช้อยู่ / ทั้งหมด) ---------- */
  const doExport = () => {
    if (!exp) return;
    const all = exp.scope === "ทั้งหมด";
    const doc = {
      title: "รายงาน" + TITLE + " · ข้อมูล ณ " + MA_TODAY,
      info: [["หน่วยงานที่ออกเอกสาร", "กบผ. การไฟฟ้าส่วนภูมิภาค"], ["ตัวกรอง", all || !chips.length ? "-" : chips.join(", ")], ["พิมพ์เมื่อ", new Date().toLocaleString("th-TH")], ["ผู้พิมพ์", PLAN_CREATOR]] as [string, string][],
      section: "รายการยานพาหนะ (" + (all ? cars.length : shown.length) + ")", cols: MA_COLS, rows: (all ? cars : shown).map(exportRow), file: TITLE,
    };
    if (exp.format === "PDF") openPrint(doc); else downloadCsv(doc);
    setExp(null);
    notify("ส่งออกไฟล์สำเร็จ");
  };

  return (
    <>
      <PageHeader Title={LIST_TITLE} crumbs={[{ Text: VEHICLE_ROOT }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{MA_TABS.map((t, i) => <TabItem key={t} Text={t} Active={i === 1} Badge={i === 1 ? due : undefined} />)}</Tabs>
        <DashHead icon="build-24-300-round" title={TITLE} text="ยานพาหนะที่ติดตั้งเครื่องมือกล แยกตามสังกัด ประเภท และกำหนดบำรุงรักษาครั้งถัดไป — คลิกกราฟหรือรายการเพื่อกรองทั้งหน้า"
          asOf={<DataAsOf text={"ข้อมูล ณ " + longDate(MA_TODAY)} sub="คำนวณจากบันทึกเมื่อปิดงานบำรุงรักษา" />} />
        <AlertBox alerts={alerts} emptyText="ยังไม่มีเรื่องที่ต้องรีบดู ยานพาหนะทุกคันยังไม่ถึงกำหนด" />
        <div ref={panelRef} className="scroll-mt-4">
          <FilterPanel open={panel} onToggle={() => setPanel(!panel)} text="เลือกประเภท สังกัด กำหนดครบ หรือผลตรวจน้ำมัน หรือคลิกกราฟด้านล่าง ข้อมูลทั้งหน้าจะอัปเดตตาม"
            chips={chips} onRemove={(t) => { const c = chipItems.find((x) => x.text === t); if (c) put(c.drop()); }} onClear={() => put(NONE)}>
            {multi("types", "ประเภทยานพาหนะ", VEHICLE_TYPES)}
            {multi("units", "สังกัดยานพาหนะ", owners)}
            {single(SINGLE[0])}
            {single(SINGLE[1])}
            {multi("items", "รายการที่ครบกำหนด", [...MA_ITEMS])}
            {single(SINGLE[2])}
            {single(SINGLE[3])}
          </FilterPanel>
        </div>
        <KpiRow items={kpis} />
        <ChartGrid>
          <ChartCard className="lg:col-span-2" icon="corporate_fare-24-300-round" title="ยานพาหนะตามสังกัด" sub={byZone ? "แยกตามเขต · จำนวนคันและคันที่ครบหรือใกล้ครบกำหนด" : "แยกตามหน่วยงาน · จำนวนคันและคันที่ครบหรือใกล้ครบกำหนด"}
            action={<Toggle label="แยกตาม" options={["หน่วยงาน", "เขต"]} value={byZone ? "เขต" : "หน่วยงาน"} onChange={(v) => setByZone(v === "เขต")} />}
            source="สังกัดปัจจุบันของยานพาหนะ">
            <BarList items={byOwner} unit="คัน" onPick={(k) => flip(byZone ? "zones" : "units", k)} />
          </ChartCard>
          <ChartCard icon="donut_large-24-300-round" hue="green" title="สถานะกำหนดบำรุงรักษา" sub="ตามครั้งถัดไปของแต่ละคัน" source="ใกล้ครบ = ภายใน 6 เดือน">
            <Donut slices={statusSlices} unit="คัน" labelHead="สถานะ" onPick={(k) => flip("due", k)} />
          </ChartCard>
          <ChartCard className="lg:col-span-2" icon="calendar_month-24-300-round" hue="purple" title="กำหนดบำรุงรักษา 12 เดือนข้างหน้า" sub="จำนวนคันที่ครบกำหนดในแต่ละเดือน แยกบำรุงรักษาตามวาระและเปลี่ยนน้ำมันไฮดรอลิก"
            source={"รอบบำรุงรักษา 12 เดือนจากครั้งล่าสุด · เปลี่ยนน้ำมันไฮดรอลิกทุก 3 ปี · นับจาก " + MA_TODAY}>
            <ColumnChart scroll={mob} unit="คัน" onPick={(k) => flip("months", k)} groups={monthGroups}
              series={[{ key: "ma", label: "บำรุงรักษาตามวาระ", hue: "blue" }, { key: "oil", label: "เปลี่ยนน้ำมันไฮดรอลิก", hue: "purple" }]} />
          </ChartCard>
          <ChartCard icon="water_drop-24-300-round" hue="orange" title="ผลตรวจน้ำมันล่าสุด" sub="ผลตรวจตัวอย่างน้ำมันไฮดรอลิกครั้งล่าสุด" source="ผลตรวจที่บันทึกหลังปิดงาน">
            <Donut slices={oilSlices} unit="คัน" labelHead="ผลตรวจ" onPick={(k) => setOne("oil", k)} />
          </ChartCard>
          <ChartCard className="lg:col-span-2" icon="hourglass-24-300-round" hue="navy" title="อายุการใช้งาน" sub="จำนวนคันตามกลุ่มอายุ นับจากปีที่จดทะเบียน" source={"อายุนับถึงปี " + YEAR}>
            <ColumnChart unit="คัน" onPick={(k) => flip("ages", k)} groups={ageGroups} series={[{ key: "n", label: "จำนวน", hue: "navy" }]} />
            <LegendTable head={["กลุ่มอายุ", "จำนวน (คัน)", "%"]} onPick={(k) => flip("ages", k)} foot={["รวม", nf(n), n ? "100%" : "0.0%"]}
              rows={ageGroups.map((g) => ({ key: g.key, hue: "navy" as Hue, label: g.label, cells: [nf(g.values[0]), pct(g.values[0], n)], active: g.active }))} />
          </ChartCard>
          <ChartCard icon="local_shipping-24-300-round" hue="blue" title="ตามประเภทยานพาหนะ" sub={typeItems.length + " ประเภท"} source="ประเภทตามทะเบียนยานพาหนะ">
            <BarList items={typeItems} unit="คัน" onPick={(k) => flip("types", k)} />
          </ChartCard>
        </ChartGrid>
        <section aria-label="รายการยานพาหนะ" className="flex flex-col gap-5 rounded-xl border border-gray-200 bg-white p-4 shadow-field md:px-4 md:py-6">
          <TableHeader Title="รายการยานพาหนะ" Badge={nf(shown.length) + " คัน"} Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query} onQuery={(q) => { setQuery(q); setPage(1); }}
            onFilter={openPanel} FilterCount={chips.length}
            Actions={<SecondaryButton Text="ส่งออก" LeadingIconSwap="download-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setExp({ format: "PDF", scope: "ตามตัวกรองที่ใช้อยู่" })} />} />
          {shown.length ? <MaGrid cols={MA_COLS} rows={shown.map(maRow)} page={page} onPage={setPage} sort={sort}
              onSort={(c) => { setSort(sort?.col === c ? { col: c, dir: sort.dir === "Down" ? "Up" : "Down" } : { col: c, dir: "Down" }); setPage(1); }} />
            : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={reset} />} />}
        </section>
        <SourceNote>
          ข้อมูลจำลองของต้นแบบ คำนวณ ณ {MA_TODAY} จากบันทึกการบำรุงรักษาเมื่อปิดงาน ผลตรวจน้ำมัน และการตรวจ ปจ.2 · ตัวกรองและการคลิกกราฟใช้กับทั้งหน้า ช่องค้นหาใช้กับรายการยานพาหนะเท่านั้น
          · เรื่องที่ควรดูนับจากยานพาหนะทุกคันที่เห็นได้
        </SourceNote>
      </section>

      <PopupModal open={!!exp} title="ส่งออกรายงาน" sub="ส่งออกรายการยานพาหนะของแดชบอร์ดการบำรุงรักษา" ok="ส่งออก" onCancel={() => setExp(null)} onOk={doExport}>
        {exp && <>
          <RadioPick title="รูปแบบไฟล์" options={EXPORT_CARDS} value={exp.format} onChange={(v) => setExp({ ...exp, format: v })} />
          <RadioPick title="ข้อมูลที่ส่งออก" value={exp.scope} onChange={(v) => setExp({ ...exp, scope: v })} options={[
            { Text: "ตามตัวกรองที่ใช้อยู่", SupportingText: shown.length + " คัน" + (chips.length || query ? " ตามตัวกรองและคำค้นที่ใช้อยู่" : "") },
            { Text: "ทั้งหมด", SupportingText: cars.length + " คัน ทุกคันที่เห็นได้" },
          ]} />
        </>}
      </PopupModal>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><MaList /></Suspense></AppFrame>;
}
