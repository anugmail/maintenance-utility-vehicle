"use client";
/* S4 · กบค. ดูอะไหล่และความคืบหน้าของแผนที่อนุมัติแล้ว (แดชบอร์ด · /parts/) — partsDash() ใน screens.js (บล็อก C · C.1–C.13 · 6 พ.ย. 2569)
   แทนหน้าความคืบหน้าอะไหล่รายไตรมาส (/quarter/parts/ เดิม · เทียบคงเหลือ Smart Inventory + เบิก/จอง) — เจ้าของงาน "หน้าที่จาก smart inventory จะเปลี่ยนเป็นหน้าแดชบอร์ด" · ไม่แสดงค่าจาก Smart Inventory
   ทางเข้า: เมนูย่อย "อะไหล่ของแผนที่อนุมัติแล้ว" ใต้ งานซ่อมและบำรุงรักษา ใน Sidebar navigation (ต่อจาก บำรุงรักษาตามวาระ)
   12 พ.ย. 2569 แดชบอร์ดแบบ VMS+ (เจ้าของงาน _"อยากให้ออกแบบเป็นสไตล์นี้ … ให้เฉพาะ dashboard ที่ทำสิ่งนี้ได้ หน้าอื่นๆ ยังคงต้องตาม component เหมือนเดิม"_
     · สเปก userflow/figma-ref/vmsplus-dashboard-2569-11-12/SPEC-maintenance-dashboards.md · CLAUDE.md ข้อ 18 · ชิ้นกราฟ components/dashboard/ · COMPOSED.md หัวข้อ "แดชบอร์ดแบบ VMS+")
   โครง: Page header "อะไหล่ของแผนที่อนุมัติแล้ว" (Breadcrumbs บำรุงรักษาตามวาระ · คงเดิม + บรรทัดอธิบาย + ป้ายข้อมูล ณ) → เรื่องที่ควรดู
     → แผงตัวกรองพับได้ = ช่องเดิม ปีงบประมาณ · หน่วยงานผู้ขอเบิก (กบค. เท่านั้น) · เขต · แผน (เลือกแล้วใช้ทันที) + ชิป (รวมไตรมาส/อะไหล่จากการคลิกกราฟ) → การ์ดตัวเลข 6 ใบ
     → กราฟ (อะไหล่รายไตรมาส 3 ช่อง · อะไหล่ที่ใช้มากที่สุด · ตามหน่วยงานผู้ขอเบิก · ความคืบหน้าของแผน) คลิกแท่ง/แถว/ชิ้น = เพิ่ม/เอาตัวกรองนั้นออกทั้งหน้า
     → ตาราง: Tabs 3 แท็บเดิม (รวมตามรายการ · แยกรายคัน · ความคืบหน้าของแผน + จำนวน · ย้ายมาอยู่ท้ายหน้า) → Table header (ค้นหาตามแท็บ · ตัวกรอง = กางแผง · ส่งออก)
       → Table (ทุกคอลัมน์เรียงได้) + pagination / Empty state/Search not found + ล้างตัวกรอง → หมายเหตุแหล่งข้อมูล
   ส่งออก: popup "ส่งออกรายงาน" (Radio text card รูปแบบไฟล์ PDF / Excel · ข้อมูลที่ส่งออก ตามตัวกรองที่ใช้อยู่ / ทั้งหมด) → toast "ส่งออกไฟล์สำเร็จ" (ไฟล์: _lib/exportFile.ts)
   แท็บความคืบหน้าของแผน: แถว = 1 ไตรมาสของ 1 แผน · ปุ่ม › ไปหน้าไตรมาส n ของแผนนั้น
   ต้นแบบ: ?sim=empty = ยังไม่มีแผนที่อนุมัติแล้ว (C.13) · ?seed=S4 = บทบาท กบค. (หน้า /scenarios/) · ข้อมูลเป็นค่าสมมติของจอ (lib/mock/partsDash.ts) ตัวเลขแดชบอร์ดคิดจากชุดเดิม */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PopupModal } from "@/components/patterns/PopupModal";
import { AlertBox, type DashAlert } from "@/components/dashboard/AlertCard";
import { BarList, StackBarList } from "@/components/dashboard/BarList";
import { ChartCard, ChartGrid, DataAsOf, SourceNote } from "@/components/dashboard/ChartCard";
import { ColumnChart } from "@/components/dashboard/ColumnChart";
import { Donut } from "@/components/dashboard/Donut";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { KpiRow } from "@/components/dashboard/KpiCard";
import { HUE, hueAt, nf, pct, type Hue } from "@/components/dashboard/palette";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import type { TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { MENU_HOME, go, tripsHref } from "@/app/quarter/_shared/ui";
import { longDate } from "@/app/vehicles/maintenance/dash";
import { cx } from "@/lib/cx";
import { PARTS, PLAN_CREATOR, YEARS } from "@/lib/mock/data";
import { MA_TODAY } from "@/lib/mock/maintenance";
import {
  DASH_AGG, DASH_CARS, DASH_CAR_COLS, DASH_DISTRICTS, DASH_HINT, DASH_PLANS, DASH_PROG, DASH_PROG_COLS, DASH_TABS, DASH_TITLE, DASH_UNITS, DASH_YEAR,
  EXPORT_ALL_SUB, EXPORT_CARDS, NO_FILTER, QPART_COLS, QST, aggRows, carRows, dashMine, dashPlanOf, planMatch, progRows, sortAll,
  type AggRow, type CarRow, type DashFilter, type ProgRow,
} from "@/lib/mock/partsDash";
import { UNIT_ROLES, useRoleGuard } from "@/lib/mock/planFlow";
import { useSeed } from "@/lib/mock/seedB";
import { notify, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { RadioPick, SORT0, SortTable, nextSort, sortRows, type Sort } from "./_lib/ui";
import { downloadCsv, openPrint } from "./_lib/exportFile";

/* Permission (เคาะ 10 พ.ย. 2569 · Figma 76efd87 C.14 C.15 · เจ้าของงาน "ผู้สร้างแผนเห็นเฉพาะแผนของหน่วยงานตัวเอง ยกเว้น กบค จะเห็นแผนของหน่วยงานอื่นด้วย แต่แก้ไขไม่ได้"):
   หน่วยงาน (กบผ. กปส. กรย. กส.1 กส.2) เห็นเฉพาะแผนของหน่วยงานตัวเอง — การ์ดตัวเลข กราฟ เรื่องที่ควรดู ตัวเลขบนแท็บ ตาราง นับตามแผนที่เห็น · แผงตัวกรองไม่มี "หน่วยงานผู้ขอเบิก" · ตัวเลือกแผนเฉพาะแผนของตัวเอง
   กบค. เห็นทุกหน่วยงาน ดูอย่างเดียว · แผงตัวกรองมี "หน่วยงานผู้ขอเบิก" */
const DASH_ROLES = ["กบค.", "หน่วยงาน (กบผ.)", "หน่วยงาน (กปส.)", "หน่วยงาน (กรย.)", "หน่วยงาน (กส.1)", "หน่วยงาน (กส.2)"] as const;   // ข้อ 70 เพิ่ม กส.1 กส.2
const COLS = [sortAll(QPART_COLS), sortAll(DASH_CAR_COLS), sortAll(DASH_PROG_COLS)];
const ALL_N = [DASH_AGG.length, DASH_CARS.length, DASH_PROG.length];
const QS = [1, 2, 3, 4];

const carRow = (r: CarRow): TableValue[] => {
  const p = PARTS[r.part];
  return [r.plate, { text: r.mr, sub: dashPlanOf(r.mr)?.unit }, "ไตรมาส " + r.q, p.name, p.code, p.group, r.qty, p.unit];
};

/* ตัวกรองจากกราฟ: ไตรมาส (แท่งรายไตรมาส) · อะไหล่ (แถวอะไหล่ที่ใช้มากที่สุด) — ใช้กับแท็บแยกรายคัน ความคืบหน้า (ไตรมาส) และยอดรวมตามรายการ (อะไหล่) */
interface Pick { qs: number[]; parts: string[] }
const NO_PICK: Pick = { qs: [], parts: [] };
const pickCar = (r: CarRow, k: Pick) => (!k.qs.length || k.qs.includes(r.q)) && (!k.parts.length || k.parts.includes(PARTS[r.part].name));
const pickProg = (r: ProgRow, k: Pick) => !k.qs.length || k.qs.includes(r[1]);
const pickAgg = (r: AggRow, k: Pick) => !k.parts.length || k.parts.includes(r[0]);

/* ชิปตัวกรอง = ค่าที่เลือก (ปีงบประมาณ · หน่วยงาน · เขต · เลขที่ MR) + ไตรมาส n + ชื่ออะไหล่ */
const chipsOf = (f: DashFilter, k: Pick) => [...(f.year ? [f.year] : []), ...f.units, ...f.districts, ...f.plans, ...k.qs.map((q) => "ไตรมาส " + q), ...k.parts];
type Multi = "units" | "districts" | "plans";
const flipIn = <T,>(xs: T[], v: T) => (xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v]);
const sum = (xs: number[]) => xs.reduce((a, x) => a + x, 0);
const GROUP_HUE: Record<string, Hue> = { "ไส้กรอง": "blue", "น้ำมัน": "purple" };

function PartsDash() {
  const router = useRouter();
  const sp = useSearchParams();
  const seeding = useSeed();
  const ok = useRoleGuard(DASH_ROLES);
  const role = useRole();
  const mob = useBreakpoint() === "Mobile";
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DashFilter>(NO_FILTER);
  const [pick, setPick] = useState<Pick>(NO_PICK);
  const [sort, setSort] = useState<Sort>(SORT0);
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState(false);
  const [open, setOpen] = useState("");
  const [exp, setExp] = useState<{ format: string; scope: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const progRow = (r: ProgRow): TableValue[] => {
    const p = dashPlanOf(r[0]), id = r[0].replace(/^MR/, "");
    return [{ text: r[0], sub: p?.unit }, p?.name ?? "", "ไตรมาส " + r[1], r[2] + " ใบ", r[3] + "/" + r[4] + " คัน", { pills: [QST[r[5]]] },
      go("ไปหน้าไตรมาส " + r[1] + " ของ " + r[0], () => router.push(tripsHref(id, r[1])))];
  };
  const scope = UNIT_ROLES[role];   // หน่วยงาน = แผนของตัวเองเท่านั้น
  const eff = (f: DashFilter): DashFilter => (scope ? { ...f, units: [scope] } : f);
  const rowsOf = (t: number, q = query, f = filter, k = pick): TableValue[][] =>
    t === 0 ? aggRows(q, eff(f)).filter((r) => pickAgg(r, k)) : t === 1 ? carRows(q, eff(f)).filter((r) => pickCar(r, k)).map(carRow) : progRows(q, eff(f)).filter((r) => pickProg(r, k)).map(progRow);
  const rows = sortRows(rowsOf(tab), sort);
  const allRows = (t: number): TableValue[][] => (scope ? rowsOf(t, "", NO_FILTER, NO_PICK) : t === 0 ? DASH_AGG : t === 1 ? DASH_CARS.map(carRow) : DASH_PROG.map(progRow));
  const allN = scope ? [0, 1, 2].map((t) => allRows(t).length) : ALL_N;   // หน่วยงาน = นับเฉพาะแผนของตัวเอง
  const chips = chipsOf(filter, pick);

  if (seeding || !ok) return null;

  const pickTab = (i: number) => { setTab(i); setSort(SORT0); setPage(1); };
  const putQuery = (q: string) => { setQuery(q); setPage(1); };
  const putFilter = (f: DashFilter) => { setFilter(f); setPage(1); };
  const putPick = (k: Pick) => { setPick(k); setPage(1); };
  const clearAll = () => { putFilter(NO_FILTER); putPick(NO_PICK); };
  const reset = () => { setQuery(""); clearAll(); };
  const toggle = (k: string) => (o: boolean) => setOpen(o ? k : "");
  const flip = (k: Multi, v: string) => putFilter({ ...filter, [k]: flipIn(filter[k], v) });
  const dropChip = (v: string) => {
    if (pick.parts.includes(v) || pick.qs.some((q) => "ไตรมาส " + q === v)) return putPick({ qs: pick.qs.filter((q) => "ไตรมาส " + q !== v), parts: pick.parts.filter((x) => x !== v) });
    putFilter({ year: filter.year === v ? "" : filter.year, units: filter.units.filter((x) => x !== v), districts: filter.districts.filter((x) => x !== v), plans: filter.plans.filter((x) => x !== v) });
  };
  const openPanel = () => { setPanel(true); setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 0); };

  /* ---------- ข้อมูลตามตัวกรอง (ทั้งหน้า) ---------- */
  const f = eff(filter);
  const plans = DASH_PLANS.filter((p) => planMatch(p, f));
  const progBase = progRows("", f), prog = progBase.filter((r) => pickProg(r, pick));
  const carBase = carRows("", f).filter((r) => pickCar(r, { qs: [], parts: pick.parts }));   // ไม่กรองไตรมาส (แท่งรายไตรมาสแสดงครบ 4 ไตรมาส แท่งที่เลือกเด่น)
  const agg = aggRows("", f).filter((r) => pickAgg(r, pick));
  const unitSum = (u: string) => sum(agg.filter((r) => r[4] === u).map((r) => Number(r[3])));

  /* ---------- เรื่องที่ควรดู (แผนที่บทบาทนี้เห็น ไม่ขึ้นกับตัวกรอง) ----------
     ไตรมาสปัจจุบันของแผน = ไตรมาสแรกที่ยังไม่เสร็จและมียานพาหนะ (ตามสถานะในความคืบหน้าของแผน · ข้อมูลจำลองไม่มีวันเริ่ม/สิ้นสุดของไตรมาส)
     ช้ากว่ากำหนด = ไตรมาสที่ยังไม่เสร็จ แต่ไตรมาสหลังจากนั้นของแผนเดียวกันเริ่มแล้ว · ไม่มีเรื่อง = บรรทัดเดียว */
  const mine = DASH_PROG.filter((r) => dashMine(scope)(r[0]));
  const current = [...new Set(mine.map((r) => r[0]))].map((mr) => mine.filter((r) => r[0] === mr && r[5] !== "done" && r[4] > 0).sort((a, b) => a[1] - b[1])[0]).filter((r): r is ProgRow => !!r);
  const noTrip = current.filter((r) => r[2] === 0);
  const late = mine.filter((r) => r[5] !== "done" && mine.some((x) => x[0] === r[0] && x[1] > r[1] && x[5] !== "todo"));
  const focus = (rs: ProgRow[]) => () => { putFilter({ ...NO_FILTER, plans: [...new Set(rs.map((r) => r[0]))] }); putPick({ qs: [...new Set(rs.map((r) => r[1]))], parts: [] }); pickTab(2); };
  const alerts: DashAlert[] = [
    ...(noTrip.length ? [{ key: "notrip", tone: "warning" as const, title: "ไตรมาสปัจจุบันที่ยังไม่มีแผนเดินทาง " + noTrip.length + " ไตรมาส", text: noTrip.map((r) => r[0] + " ไตรมาส " + r[1]).join(" · ") + " — สร้างแผนเดินทางก่อนเริ่มบำรุงรักษา", onClick: focus(noTrip) }] : []),
    ...(late.length ? [{ key: "late", tone: "warning" as const, title: "ไตรมาสที่บำรุงรักษาช้ากว่ากำหนด " + late.length + " ไตรมาส", text: "ยังไม่เสร็จแต่ไตรมาสถัดไปของแผนเริ่มแล้ว", onClick: focus(late) }] : []),
  ];

  /* ---------- การ์ดตัวเลข ---------- */
  const carsIn = pick.qs.length ? sum(prog.map((r) => r[4])) : sum(plans.map((p) => p.cars));
  const done = sum(prog.map((r) => r[3]));
  const pcs = unitSum("ชิ้น"), litre = unitSum("ลิตร");
  const kpis = [
    { tone: "magenta" as const, icon: "assignment_turned_in-24-300-round", label: "แผนที่อนุมัติแล้ว", value: nf(plans.length), unit: "แผน", sub: "ปีงบประมาณ " + (filter.year || DASH_YEAR) },
    { tone: "blue" as const, icon: "local_shipping-24-300-round", label: "ยานพาหนะในแผน", value: nf(carsIn), unit: "คัน", sub: pick.qs.length ? "ใน" + pick.qs.map((q) => "ไตรมาส " + q).join(" ") : "รวมทุกไตรมาสของแผน" },
    { tone: "navy" as const, icon: "category-24-300-round", label: "รายการอะไหล่", value: nf(agg.length), unit: "รายการ", sub: "ชนิดอะไหล่และน้ำมันที่ต้องใช้" },
    { tone: "green" as const, icon: "settings-24-300-round", label: "จำนวนอะไหล่รวม", value: nf(pcs), unit: "ชิ้น", sub: "ไส้กรองและอะไหล่ที่ระบุเอง" },
    { tone: "purple" as const, icon: "oil_barrel-24-300-round", label: "น้ำมันไฮดรอลิก", value: nf(litre), unit: "ลิตร", sub: agg.find((r) => r[4] === "ลิตร")?.[0] ?? "ไม่มีในตัวกรองนี้" },
    { tone: "orange" as const, icon: "trending_up-24-300-round", label: "ความคืบหน้า", value: pct(done, carsIn), sub: "บำรุงรักษาแล้ว " + nf(done) + " / " + nf(carsIn) + " คัน" },
  ];

  /* ---------- กราฟ ---------- */
  const qActive = (q: number) => pick.qs.includes(q);
  const partQ = (group: string) => QS.map((q) => ({ key: String(q), label: "ไตรมาส " + q, values: [sum(carBase.filter((r) => r.q === q && PARTS[r.part].group === group).map((r) => Number(r.qty)))], active: qActive(q) }));
  const carQ = QS.map((q) => { const rs = progBase.filter((r) => r[1] === q); return { key: String(q), label: "ไตรมาส " + q, values: [sum(rs.map((r) => r[3])), sum(rs.map((r) => r[4] - r[3]))], active: qActive(q) }; });
  const onQ = (k: string) => putPick({ ...pick, qs: flipIn(pick.qs, Number(k)).sort() });
  const minis: { title: string; unit: string; hue: Hue; groups: typeof carQ; series: { key: string; label: string; hue: Hue }[] }[] = [
    { title: "ไส้กรอง", unit: "ชิ้น", hue: "blue", groups: partQ("ไส้กรอง"), series: [{ key: "f", label: "ไส้กรอง", hue: "blue" }] },
    { title: "น้ำมันไฮดรอลิก", unit: "ลิตร", hue: "purple", groups: partQ("น้ำมัน"), series: [{ key: "o", label: "น้ำมันไฮดรอลิก", hue: "purple" }] },
    { title: "ยานพาหนะในไตรมาส", unit: "คัน", hue: "green", groups: carQ, series: [{ key: "d", label: "บำรุงรักษาแล้ว", hue: "green" }, { key: "r", label: "ยังไม่บำรุงรักษา", hue: "gray" }] },
  ];
  const top = [...agg].sort((a, b) => Number(b[3]) - Number(a[3])).map((r) => {
    const same = agg.filter((x) => x[4] === r[4]).map((x) => Number(x[3]));
    return { key: r[0], label: r[0], value: Number(r[3]), unit: r[4], sub: "รหัส " + r[1] + " · " + r[2] + " · % ของยอด" + r[4] + "รวม", hue: GROUP_HUE[r[2]] ?? "gray",
      max: Math.max(...same), total: sum(same), active: pick.parts.includes(r[0]) };
  });
  const unitSlices = DASH_UNITS.map((u, i) => ({ key: u, label: u, value: sum(plans.filter((p) => p.unit === u).map((p) => p.cars)), hue: hueAt(i), active: filter.units.includes(u) }))
    .filter((s) => s.value > 0 || s.active);
  const planBars = plans.map((p) => {
    const rs = prog.filter((r) => r[0] === p.mr);
    return { key: p.mr, label: p.mr, sub: p.name + " · " + p.unit, active: filter.plans.includes(p.mr),
      values: [sum(rs.map((r) => r[3])), sum(rs.filter((r) => r[5] === "doing").map((r) => r[4] - r[3])), sum(rs.filter((r) => r[5] === "todo").map((r) => r[4] - r[3]))] };
  });

  const doExport = () => {
    if (!exp) return;
    const all = exp.scope === "ทั้งหมด";
    const doc = {
      title: "รายงาน" + DASH_TITLE + " · ปีงบประมาณ " + DASH_YEAR,
      info: [["หน่วยงานที่ออกเอกสาร", "กบผ. การไฟฟ้าส่วนภูมิภาค"], ["ตัวกรอง", all || !chips.length ? "-" : chips.join(", ")], ["พิมพ์เมื่อ", new Date().toLocaleString("th-TH")], ["ผู้พิมพ์", PLAN_CREATOR]] as [string, string][],
      section: DASH_TABS[tab] + " (" + (all ? allN[tab] : rows.length) + ")",
      cols: COLS[tab], rows: all ? allRows(tab) : rows, file: DASH_TITLE + "-" + DASH_TABS[tab],
    };
    if (exp.format === "PDF") openPrint(doc); else downloadCsv(doc);
    setExp(null);
    notify("ส่งออกไฟล์สำเร็จ");
  };

  const empty = sp.get("sim") === "empty";
  const desc = "อะไหล่และน้ำมันไฮดรอลิกที่ต้องใช้ตามแผนบำรุงรักษาที่อนุมัติแล้ว แยกตามไตรมาส แผน และหน่วยงาน — คลิกกราฟหรือรายการเพื่อกรองทั้งหน้า";
  return (
    <>
      <PageHeader Title={DASH_TITLE} crumbs={[{ Text: MENU_HOME }]} SupportingText={empty ? undefined : desc}
        Actions={empty ? undefined : <DataAsOf text={"ข้อมูล ณ " + longDate(MA_TODAY)} sub={"แผนที่อนุมัติแล้ว ปีงบประมาณ " + DASH_YEAR} />} />
      {empty ? (
        <EmptyStateDataEmpty Text="ยังไม่มีแผนที่อนุมัติแล้ว" SupportingText="เมื่อแผนบำรุงรักษาได้รับอนุมัติ อะไหล่และความคืบหน้าของแผนจะรวมมาที่นี่" />
      ) : <section className="flex flex-col gap-6">
        <AlertBox alerts={alerts} emptyText="ยังไม่มีเรื่องที่ต้องรีบดู ไตรมาสที่กำลังดำเนินการของทุกแผนมีแผนเดินทางแล้ว และยังไม่มีไตรมาสที่ช้ากว่ากำหนด" />
        <div ref={panelRef} className="scroll-mt-4">
          <FilterPanel open={panel} onToggle={() => setPanel(!panel)} text="เลือกปีงบประมาณ หน่วยงาน เขต หรือแผน หรือคลิกกราฟด้านล่าง ข้อมูลทั้งหน้าจะอัปเดตตาม"
            chips={chips} onRemove={dropChip} onClear={clearAll}>
            <InputDropdown LabelText="ปีงบประมาณ" Optional Size={mob ? "lg" : "md"} Text={filter.year} Placeholder="เลือกปีงบประมาณ" open={open === "year"} onOpenChange={toggle("year")}>
              <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === filter.year ? "Selected" : "Default"} onClick={() => { putFilter({ ...filter, year: filter.year === y ? "" : y }); setOpen(""); }} />)}</DropdownList>
            </InputDropdown>
            {!scope && <InputDropdownWithBadges LabelText="หน่วยงานผู้ขอเบิก" Optional values={filter.units} Placeholder="เลือกหน่วยงานผู้ขอเบิก" onRemove={(v) => flip("units", v)} open={open === "unit"} onOpenChange={toggle("unit")}>
              <DropdownList>{DASH_UNITS.map((u) => <DropdownListItem key={u} Text={u} State={filter.units.includes(u) ? "Selected" : "Default"} onClick={() => flip("units", u)} />)}</DropdownList>
            </InputDropdownWithBadges>}
            <InputDropdownWithBadges LabelText="เขต" Optional values={filter.districts} Placeholder="เลือกเขต" onRemove={(v) => flip("districts", v)} open={open === "district"} onOpenChange={toggle("district")}>
              <DropdownList>{DASH_DISTRICTS.map((d) => <DropdownListItem key={d} Text={d} State={filter.districts.includes(d) ? "Selected" : "Default"} onClick={() => flip("districts", d)} />)}</DropdownList>
            </InputDropdownWithBadges>
            <InputDropdownWithBadges LabelText="แผน" Optional values={filter.plans} Placeholder="เลือกแผน" onRemove={(v) => flip("plans", v)} open={open === "plan"} onOpenChange={toggle("plan")}>
              <DropdownList>{DASH_PLANS.filter((p) => !scope || p.unit === scope).map((p) => <DropdownListItem key={p.mr} Text={p.mr} SupportingText={p.name} State={filter.plans.includes(p.mr) ? "Selected" : "Default"} onClick={() => flip("plans", p.mr)} />)}</DropdownList>
            </InputDropdownWithBadges>
          </FilterPanel>
        </div>
        <KpiRow items={kpis} />
        <ChartGrid>
          <ChartCard className="lg:col-span-3" icon="bar_chart-24-300-round" title="อะไหล่รายไตรมาส" sub="อะไหล่และน้ำมันไฮดรอลิกที่ต้องใช้ และยานพาหนะในแต่ละไตรมาส"
            source="อะไหล่จากอะไหล่รายคันของแผน (แท็บแยกรายคัน) · ยานพาหนะจากความคืบหน้าของแผน">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {minis.map((m) => (
                <div key={m.title} data-mini={m.title} className="flex min-w-0 flex-col gap-2 rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <span aria-hidden="true" className={cx("size-2.5 rounded-full", HUE[m.hue].bg)} />{m.title} <span className="font-normal text-gray-500">({m.unit})</span>
                    </span>
                    <span className="text-lg font-bold text-gray-900">{nf(sum(m.groups.map((g) => sum(g.values))))}</span>
                  </div>
                  <ColumnChart compact height="h-36" unit={m.unit} series={m.series} groups={m.groups} onPick={onQ} />
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard className="lg:col-span-2" icon="leaderboard-24-300-round" hue="purple" title="อะไหล่ที่ใช้มากที่สุด" sub={"10 อันดับแรกตามจำนวน · แถบเทียบในหน่วยเดียวกัน · ทั้งหมด " + top.length + " รายการ"}
            source="ยอดรวมตามรายการของแผนที่ตรงตัวกรอง (ไม่แยกไตรมาส)">
            <BarList items={top} limit={10} onPick={(k) => putPick({ ...pick, parts: flipIn(pick.parts, k) })} />
          </ChartCard>
          <ChartCard icon="donut_large-24-300-round" hue="green" title="ตามหน่วยงานผู้ขอเบิก" sub="ยานพาหนะในแผนแยกตามหน่วยงานเจ้าของแผน" source="หน่วยงานเจ้าของแผนที่อนุมัติแล้ว" hint={scope ? false : undefined}>
            <Donut slices={unitSlices} unit="คัน" labelHead="หน่วยงาน" onPick={scope ? undefined : (k) => flip("units", k)} />
          </ChartCard>
          <ChartCard className="lg:col-span-3" icon="stacked_bar_chart-24-300-round" hue="orange" title="ความคืบหน้าของแผน" sub="ยานพาหนะของแต่ละแผน บำรุงรักษาแล้ว · กำลังดำเนินการ · ยังไม่เริ่ม"
            source="ความคืบหน้ารายไตรมาสของแผน (แท็บความคืบหน้าของแผน)">
            <StackBarList unit="คัน" items={planBars} onPick={(k) => flip("plans", k)}
              series={[{ key: "done", label: "บำรุงรักษาแล้ว", hue: "green" }, { key: "doing", label: "กำลังดำเนินการ", hue: "blue" }, { key: "todo", label: "ยังไม่เริ่ม", hue: "gray" }]} />
          </ChartCard>
        </ChartGrid>
        <section aria-label="รายการอะไหล่และความคืบหน้า" className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-4 shadow-field md:p-6">
          <Tabs>{DASH_TABS.map((t, i) => <TabItem key={t} Text={t} Badge={allN[i]} Active={tab === i} onClick={() => pickTab(i)} />)}</Tabs>
          <TableHeader Placeholder={DASH_HINT[tab]} query={query} onQuery={putQuery} onFilter={openPanel} FilterCount={chips.length}
            Actions={<SecondaryButton Text="ส่งออก" LeadingIconSwap="download-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setExp({ format: "PDF", scope: "ตามตัวกรองที่ใช้อยู่" })} />} />
          {rows.length
            ? <SortTable cols={COLS[tab]} rows={rows} sort={sort} onSort={(c) => { setSort(nextSort(sort, c)); setPage(1); }} page={page} onPage={setPage} />
            : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={reset} />} />}
        </section>
        <SourceNote>
          ข้อมูลจำลองของต้นแบบ แผนที่อนุมัติแล้วปีงบประมาณ {DASH_YEAR} · ยอดรวมตามรายการเป็นยอดของทุกแผนที่ตรงตัวกรอง ไม่แยกไตรมาส · อะไหล่รายคันมีเฉพาะยานพาหนะที่กำหนดอะไหล่แล้ว
          · ไม่แสดงค่าคงเหลือจาก Smart Inventory · ตัวกรองและการคลิกกราฟใช้กับทั้งหน้า ช่องค้นหาใช้กับตารางเท่านั้น
        </SourceNote>
      </section>}

      <PopupModal open={!!exp} title="ส่งออกรายงาน" sub="ส่งออกข้อมูลตามแท็บที่เปิดอยู่" ok="ส่งออก" onCancel={() => setExp(null)} onOk={doExport}>
        {exp && <>
          <RadioPick title="รูปแบบไฟล์" options={EXPORT_CARDS} value={exp.format} onChange={(v) => setExp({ ...exp, format: v })} />
          <RadioPick title="ข้อมูลที่ส่งออก" value={exp.scope} onChange={(v) => setExp({ ...exp, scope: v })} options={[
            { Text: "ตามตัวกรองที่ใช้อยู่", SupportingText: rows.length + " รายการตามแท็บ " + DASH_TABS[tab] + (chips.length ? " และตัวกรองที่ใช้อยู่" : "") },
            { Text: "ทั้งหมด", SupportingText: allN[tab] + EXPORT_ALL_SUB },
          ]} />
        </>}
      </PopupModal>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><PartsDash /></Suspense></AppFrame>;
}
