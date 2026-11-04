"use client";
/* S24 W.1–W.6 · หน้า ข้อมูลยานพาหนะ แท็บ "การบำรุงรักษา" (/vehicles/maintenance/) — maList() ใน screens.js
   ตาม Vehicle list ของหน้า "Vehicle Management" ใน UI Release#2 + Tabs · Table header · Table · Table pagination · Empty state/Search not found ของไฟล์ Component
   Page header "ข้อมูลยานพาหนะ" (Breadcrumbs ยานพาหนะ) → Section ช่องไฟ 24: Tabs (ปฏิทินการจอง · ยานพาหนะ · การบำรุงรักษา + ป้ายจำนวนคันที่ใกล้ครบ/ครบกำหนด)
   → Table header (ค้นหา "เลขทะเบียน, ยี่ห้อ, รุ่น" ค้นทันทีที่พิมพ์ + ปุ่ม ตัวกรอง + ชิปตัวกรอง) → Table 8 คอลัมน์ (MA_COLS) + pagination / ไม่พบข้อมูล + ปุ่ม ล้างตัวกรอง
   เมนู "…" = ดูรายละเอียด → /vehicles/detail/?car= (มือถือ: ไอคอนดูบนการ์ด · กติกาข้อ 14) · แท็บอื่นยังไม่ทำ (ไม่พาไปไหน)
   ข้อมูล: lib/mock/maintenance.ts (ประวัติตั้งต้น + งานรายคันที่ปิดแล้ว) · ?sample=S24 = ชุดตัวอย่างของหน้า /scenarios/ */
import { useRouter } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import type { TableColumn } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { MENU, VEHICLE_TYPES } from "@/lib/mock/data";
import { applySample, patchJob } from "@/lib/mock/jobs";
import { MA_DUE, MA_ITEMS, MA_NO_DATA, MA_STATUS_OPTS, isDue, nextText, useMaCars, type MaCar } from "@/lib/mock/maintenance";
import { useSample, type SampleMap } from "@/lib/useSample";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { ALL, FilterPanel, LIST_TITLE, VEHICLE_ROOT, detailHref, MaGrid, useMaAccess, type FilterField, type MaValue } from "../_lib/ui";

/* MA_COLS: [หัว, กว้าง, Style] */
const MA_COLS: TableColumn[] = [
  { head: "เลขทะเบียน", width: 230, Style: "Lead text" }, { head: "ประเภทยานพาหนะ", width: 170 }, { head: "บำรุงรักษาล่าสุด", width: 150 }, { head: "เลขไมล์", width: 140 },
  { head: "น้ำมันไฮโดรลิก", width: 170 }, { head: "Safety Inspection", width: 150 }, { head: "กำหนดครั้งถัดไป" }, { head: "", width: 64, Style: "Action icons" },
];
const MA_TABS = ["ปฏิทินการจอง", "ยานพาหนะ", "การบำรุงรักษา"];
/* ตัวกรอง 4 ช่อง (ไม่บังคับ ค่าตั้งต้น ทั้งหมด) · สังกัดยานพาหนะ = หน่วยงานของรถที่เห็นในรายการ */
const fieldsOf = (owners: string[]): FilterField[] => [
  { label: "ประเภทยานพาหนะ", options: VEHICLE_TYPES }, { label: "สังกัดยานพาหนะ", options: owners },
  { label: "สถานะกำหนดการ", options: MA_STATUS_OPTS }, { label: "รายการที่ครบกำหนด", options: [...MA_ITEMS] },
];
const NONE = [ALL, ALL, ALL, ALL];
const match = (c: MaCar, f: string[]) =>
  (f[0] === ALL || c.car.type === f[0]) && (f[1] === ALL || c.car.owner === f[1])
  && (f[2] === ALL || (!!c.next?.status && MA_DUE[c.next.status][0] === f[2])) && (f[3] === ALL || (!!c.next && MA_ITEMS[c.next.k] === f[3]));

/* ?sample=S24 (ของต้นแบบ) — งานรายคันชุด T1_afterClose ของ S10 (82-6789 ปิดงานแล้ว 04/11/2569 รอผลตรวจน้ำมัน) + เอกสาร Safety Inspection ตอนปิดงาน (SAFETY_FILES[0] ของ screens.js) */
const SAMPLES: SampleMap = {
  S24: { role: "กบค.", apply: () => { applySample("T1_afterClose"); patchJob("T1", "82-6789", (j) => ({ ...j, safety: { files: [{ name: "Safety-Inspection-82-6789.pdf", size: "1.2 MB", bar: true }] } })); } },
};

const maRow = (c: MaCar, open: (e: React.MouseEvent<HTMLButtonElement>) => void, view: () => void): MaValue[] => {
  const l = c.latest, n = c.next, st = n?.status;
  return [
    { text: c.car.plate, sub: c.car.model }, { text: c.car.type, sub: c.car.owner },
    l ? { text: l.date, sub: l.planMr } : "-", l ? { text: l.km ?? "-", sub: l.hours } : "-",
    l ? { text: c.oilAt ? "เปลี่ยน " + c.oilAt : "-", sub: c.oilResult ? "ผลตรวจ " + c.oilResult : undefined } : "-",
    l ? c.safety ?? "-" : "-",
    l ? { text: nextText(c), sub: st ? MA_DUE[st][0] : undefined, tone: st ? MA_DUE[st][1] : undefined } : { text: MA_NO_DATA },
    { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.car.plate, onClick: open }],
      mobileActions: [{ IconSwap: MENU[0].IconSwap, label: MENU[0].Text + " " + c.car.plate, onClick: view }] },
  ];
};

function MaList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const seeding = useSample(SAMPLES);
  const { ok, owner } = useMaAccess();
  const cars = useMaCars(owner);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>(NONE);
  const [panel, setPanel] = useState(false);
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<{ id: string; anchor: MenuAnchor } | null>(null);

  const fields = useMemo(() => fieldsOf([...new Set(cars.map((c) => c.car.owner))]), [cars]);
  const due = cars.filter(isDue).length;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cars.filter((c) => (!q || [c.car.plate, c.car.model].some((s) => s.toLowerCase().includes(q))) && match(c, filters));
  }, [cars, query, filters]);
  const chips = filters.map((v, i) => ({ v, i })).filter((x) => x.v !== ALL);
  const reset = () => { setQuery(""); setFilters(NONE); setPage(1); };
  const view = (id: string) => router.push(detailHref(id));
  const rows = shown.map((c) => maRow(c, (e) => setMenu({ id: c.car.id, anchor: anchorOf(e.currentTarget) }), () => view(c.car.id)));
  if (seeding || !ok) return null;

  return (
    <>
      <PageHeader Title={LIST_TITLE} crumbs={[{ Text: VEHICLE_ROOT }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{MA_TABS.map((t, i) => <TabItem key={t} Text={t} Active={i === 2} Badge={i === 2 ? due : undefined} />)}</Tabs>
        <TableHeader Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} onFilter={() => setPanel(true)}
          Filters={chips.map((c) => c.v)} onRemoveFilter={(v) => { setFilters(filters.map((x) => (x === v ? ALL : x))); setPage(1); }} />
        {rows.length ? <MaGrid cols={MA_COLS} rows={rows} page={page} onPage={setPage} />
          : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={reset} />} />}
      </section>
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? [{ ...MENU[0], onClick: () => view(menu.id) }] : []} onClose={() => setMenu(null)} />
      <FilterPanel open={panel} fields={fields} value={filters} onClose={() => setPanel(false)} onApply={(v) => { setFilters(v); setPanel(false); setPage(1); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><MaList /></Suspense></AppFrame>;
}
