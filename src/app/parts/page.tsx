"use client";
/* S4 · กบค. ดูอะไหล่และความคืบหน้าของแผนที่อนุมัติแล้ว (แดชบอร์ด · /parts/) — partsDash() ใน screens.js (บล็อก C · C.1–C.13 · 6 พ.ย. 2569)
   แทนหน้าความคืบหน้าอะไหล่รายไตรมาส (/quarter/parts/ เดิม · เทียบคงเหลือ Smart Inventory + เบิก/จอง) — เจ้าของงาน "หน้าที่จาก smart inventory จะเปลี่ยนเป็นหน้าแดชบอร์ด" · ไม่แสดงค่าจาก Smart Inventory
   ทางเข้า: เมนูย่อย "อะไหล่ของแผนที่อนุมัติแล้ว" ใต้ งานซ่อมและบำรุงรักษา ใน Sidebar navigation (ต่อจาก บำรุงรักษาตามวาระ)
   ตาม MA Dashboard - Default ของหน้า "MA Overview" ใน UI Release#2 + Metric item · Tabs · Table header · Table · Empty state ของไฟล์ Component
   Page header "อะไหล่ของแผนที่อนุมัติแล้ว" (Breadcrumbs บำรุงรักษาตามวาระ) → Tabs 3 แท็บ (รวมตามรายการ · แยกรายคัน · ความคืบหน้าของแผน + จำนวน) → Metric item 4 ใบ
   → Section ช่องไฟ 24: Table header (ค้นหาตามแท็บ · ตัวกรอง · ส่งออก ไอคอน download) → Table (ทุกคอลัมน์เรียงได้) + pagination / Empty state/Search not found + ล้างตัวกรอง
   แผงตัวกรอง (FilterShell ตัวเดียวกับ S24 และฟอร์มแผน): ปีงบประมาณ · หน่วยงานผู้ขอเบิก · เขต · แผน (หลายค่า = Input dropdown with badges) → ชิปตัวกรองเหนือตาราง
   ส่งออก: popup "ส่งออกรายงาน" (Radio text card รูปแบบไฟล์ PDF / Excel · ข้อมูลที่ส่งออก ตามตัวกรองที่ใช้อยู่ / ทั้งหมด) → toast "ส่งออกไฟล์สำเร็จ" (ไฟล์: _lib/exportFile.ts)
   แท็บความคืบหน้าของแผน: แถว = 1 ไตรมาสของ 1 แผน · ปุ่ม › ไปหน้าไตรมาส n ของแผนนั้น
   ต้นแบบ: ?sim=empty = ยังไม่มีแผนที่อนุมัติแล้ว (C.13) · ?seed=S4 = บทบาท กบค. (หน้า /scenarios/) · ข้อมูลเป็นค่าสมมติของจอ (lib/mock/partsDash.ts) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PopupModal } from "@/components/patterns/PopupModal";
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
import { FilterShell } from "@/app/vehicles/_lib/ui";
import { MENU_HOME, go, tripsHref } from "@/app/quarter/_shared/ui";
import { PARTS, PLAN_CREATOR, YEARS } from "@/lib/mock/data";
import {
  DASH_AGG, DASH_CARS, DASH_CAR_COLS, DASH_DISTRICTS, DASH_HINT, DASH_PLANS, DASH_PROG, DASH_PROG_COLS, DASH_TABS, DASH_TITLE, DASH_UNITS, DASH_YEAR,
  EXPORT_ALL_SUB, EXPORT_CARDS, NO_FILTER, QPART_COLS, QST, aggRows, carRows, dashPlanOf, filterCount, progRows, sortAll,
  type CarRow, type DashFilter, type ProgRow,
} from "@/lib/mock/partsDash";
import { UNIT_ROLES, useRoleGuard } from "@/lib/mock/planFlow";
import { useSeed } from "@/lib/mock/seedB";
import { notify, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { Metrics, RadioPick, SORT0, SortTable, nextSort, sortRows, type Sort } from "./_lib/ui";
import { downloadCsv, openPrint } from "./_lib/exportFile";

/* Permission: กบค. ดูแผนที่อนุมัติแล้วของทุกหน่วยงาน · หน่วยงาน (กกฟ.1) เปิดได้ด้วย (เมนูเดียวกันทุกบทบาท · รอเคาะ BACKLOG ข้อ 22 หมวด ค.) */
/* 9 พ.ย. 2569 ตรวจสิทธิ์: หน่วยงานผู้ดำเนินการทุกหน่วยงานเปิดได้ เห็นเฉพาะแผนของหน่วยงานตัวเอง (ตัวกรองหน่วยงานถูกตั้งเป็นหน่วยงานตัวเองเสมอ) · กบค. ทุกหน่วยงาน */
const DASH_ROLES = ["กบค.", "หน่วยงาน (กกฟ.1)", "หน่วยงาน (กกฟ.2)", "หน่วยงาน (กรย.)"] as const;
const COLS = [sortAll(QPART_COLS), sortAll(DASH_CAR_COLS), sortAll(DASH_PROG_COLS)];
const ALL_N = [DASH_AGG.length, DASH_CARS.length, DASH_PROG.length];

const carRow = (r: CarRow): TableValue[] => {
  const p = PARTS[r.part];
  return [r.plate, { text: r.mr, sub: dashPlanOf(r.mr)?.unit }, "ไตรมาส " + r.q, p.name, p.code, p.group, r.qty, p.unit];
};

/* ชิปตัวกรอง = ค่าที่เลือก (ปีงบประมาณ · หน่วยงาน · เขต · เลขที่ MR) */
const chipsOf = (f: DashFilter) => [...(f.year ? [f.year] : []), ...f.units, ...f.districts, ...f.plans];
const dropChip = (f: DashFilter, v: string): DashFilter => ({
  year: f.year === v ? "" : f.year, units: f.units.filter((x) => x !== v), districts: f.districts.filter((x) => x !== v), plans: f.plans.filter((x) => x !== v),
});
type Multi = "units" | "districts" | "plans";

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
  const [sort, setSort] = useState<Sort>(SORT0);
  const [page, setPage] = useState(1);
  const [panel, setPanel] = useState(false);
  const [draft, setDraft] = useState<DashFilter>(NO_FILTER);
  const [open, setOpen] = useState("");
  const [exp, setExp] = useState<{ format: string; scope: string } | null>(null);

  const progRow = (r: ProgRow): TableValue[] => {
    const p = dashPlanOf(r[0]), id = r[0].replace(/^MR/, "");
    return [{ text: r[0], sub: p?.unit }, p?.name ?? "", "ไตรมาส " + r[1], r[2] + " ใบ", r[3] + "/" + r[4] + " คัน", { pills: [QST[r[5]]] },
      go("ไปหน้าไตรมาส " + r[1] + " ของ " + r[0], () => router.push(tripsHref(id, r[1])))];
  };
  const scope = UNIT_ROLES[role];   // หน่วยงาน = แผนของตัวเองเท่านั้น
  const eff = (f: DashFilter): DashFilter => (scope ? { ...f, units: [scope] } : f);
  const rowsOf = (t: number, q = query, f = filter): TableValue[][] =>
    t === 0 ? aggRows(q, eff(f)) : t === 1 ? carRows(q, eff(f)).map(carRow) : progRows(q, eff(f)).map(progRow);
  const rows = sortRows(rowsOf(tab), sort);
  const allRows = (t: number): TableValue[][] => (scope ? rowsOf(t, "", NO_FILTER) : t === 0 ? DASH_AGG : t === 1 ? DASH_CARS.map(carRow) : DASH_PROG.map(progRow));
  const allN = scope ? [0, 1, 2].map((t) => allRows(t).length) : ALL_N;   // หน่วยงาน = นับเฉพาะแผนของตัวเอง
  const chips = chipsOf(filter);

  if (seeding || !ok) return null;

  const pickTab = (i: number) => { setTab(i); setSort(SORT0); setPage(1); };
  const putQuery = (q: string) => { setQuery(q); setPage(1); };
  const putFilter = (f: DashFilter) => { setFilter(f); setPage(1); };
  const reset = () => { setQuery(""); putFilter(NO_FILTER); };
  const openPanel = () => { setDraft(filter); setOpen(""); setPanel(true); };
  const toggle = (k: string) => (o: boolean) => setOpen(o ? k : "");
  const flip = (k: Multi, v: string) => setDraft({ ...draft, [k]: draft[k].includes(v) ? draft[k].filter((x) => x !== v) : [...draft[k], v] });
  const drop = (k: Multi) => (v: string) => setDraft({ ...draft, [k]: draft[k].filter((x) => x !== v) });

  const doExport = () => {
    if (!exp) return;
    const all = exp.scope === "ทั้งหมด";
    const doc = {
      title: "รายงาน" + DASH_TITLE + " · ปีงบประมาณ " + DASH_YEAR,
      info: [["หน่วยงานที่ออกเอกสาร", "กกฟ.1 การไฟฟ้าส่วนภูมิภาค"], ["ตัวกรอง", all || !chips.length ? "-" : chips.join(", ")], ["พิมพ์เมื่อ", new Date().toLocaleString("th-TH")], ["ผู้พิมพ์", PLAN_CREATOR]] as [string, string][],
      section: DASH_TABS[tab] + " (" + (all ? allN[tab] : rows.length) + ")",
      cols: COLS[tab], rows: all ? allRows(tab) : rows, file: DASH_TITLE + "-" + DASH_TABS[tab],
    };
    if (exp.format === "PDF") openPrint(doc); else downloadCsv(doc);
    setExp(null);
    notify("ส่งออกไฟล์สำเร็จ");
  };

  const empty = sp.get("sim") === "empty";
  return (
    <>
      <PageHeader Title={DASH_TITLE} crumbs={[{ Text: MENU_HOME }]} />
      {empty ? (
        <EmptyStateDataEmpty Text="ยังไม่มีแผนที่อนุมัติแล้ว" SupportingText="เมื่อแผนบำรุงรักษาได้รับอนุมัติ อะไหล่และความคืบหน้าของแผนจะรวมมาที่นี่" />
      ) : <>
        <Tabs>{DASH_TABS.map((t, i) => <TabItem key={t} Text={t} Badge={allN[i]} Active={tab === i} onClick={() => pickTab(i)} />)}</Tabs>
        <Metrics />
        <section className="flex flex-col gap-6">
          <TableHeader Placeholder={DASH_HINT[tab]} query={query} onQuery={putQuery} onFilter={openPanel} FilterCount={filterCount(filter)}
            Filters={chips} onRemoveFilter={(v) => putFilter(dropChip(filter, v))}
            Actions={<SecondaryButton Text="ส่งออก" LeadingIconSwap="download-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setExp({ format: "PDF", scope: "ตามตัวกรองที่ใช้อยู่" })} />} />
          {rows.length
            ? <SortTable cols={COLS[tab]} rows={rows} sort={sort} onSort={(c) => { setSort(nextSort(sort, c)); setPage(1); }} page={page} onPage={setPage} />
            : <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={reset} />} />}
        </section>
      </>}

      <FilterShell open={panel} onClose={() => setPanel(false)} onClear={() => setDraft(NO_FILTER)} onApply={() => { putFilter(draft); setPanel(false); }}>
        <InputDropdown LabelText="ปีงบประมาณ" Optional Size={mob ? "lg" : "md"} Text={draft.year} Placeholder="เลือกปีงบประมาณ" open={open === "year"} onOpenChange={toggle("year")}>
          <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === draft.year ? "Selected" : "Default"} onClick={() => { setDraft({ ...draft, year: draft.year === y ? "" : y }); setOpen(""); }} />)}</DropdownList>
        </InputDropdown>
        <InputDropdownWithBadges LabelText="หน่วยงานผู้ขอเบิก" Optional values={draft.units} Placeholder="เลือกหน่วยงานผู้ขอเบิก" onRemove={drop("units")} open={open === "unit"} onOpenChange={toggle("unit")}>
          <DropdownList>{DASH_UNITS.map((u) => <DropdownListItem key={u} Text={u} State={draft.units.includes(u) ? "Selected" : "Default"} onClick={() => flip("units", u)} />)}</DropdownList>
        </InputDropdownWithBadges>
        <InputDropdownWithBadges LabelText="เขต" Optional values={draft.districts} Placeholder="เลือกเขต" onRemove={drop("districts")} open={open === "district"} onOpenChange={toggle("district")}>
          <DropdownList>{DASH_DISTRICTS.map((d) => <DropdownListItem key={d} Text={d} State={draft.districts.includes(d) ? "Selected" : "Default"} onClick={() => flip("districts", d)} />)}</DropdownList>
        </InputDropdownWithBadges>
        <InputDropdownWithBadges LabelText="แผน" Optional values={draft.plans} Placeholder="เลือกแผน" onRemove={drop("plans")} open={open === "plan"} onOpenChange={toggle("plan")}>
          <DropdownList>{DASH_PLANS.map((p) => <DropdownListItem key={p.mr} Text={p.mr} SupportingText={p.name} State={draft.plans.includes(p.mr) ? "Selected" : "Default"} onClick={() => flip("plans", p.mr)} />)}</DropdownList>
        </InputDropdownWithBadges>
      </FilterShell>

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
