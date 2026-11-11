"use client";
/* S1 · หน้า รายการแผนบำรุงรักษา (รากเว็บ / — ทางเข้าจากเมนู Sidebar "งานซ่อมและบำรุงรักษา > บำรุงรักษาตามวาระ" แบบระบบจริง) — listScreen() ใน screens.js
   ตาม `Table header` + `Empty state/Data empty` ของไฟล์ Component + Incident list ของหน้า 5.5 Repair & Maintenance Job (Admin) ใน UI Release#2 (รีวิวทีมออกแบบ 5 พ.ย. 2569 · A.1 A.2)
   Page header (Title "บำรุงรักษาตามวาระ" ไม่มีปุ่ม) → Section ช่องไฟ 24: Table header (ค้นหา + ตัวกรอง + Primary "สร้างแผน" ขวาของตัวกรอง) + Table 8 คอลัมน์ (PLAN_COLS · ภาค / ประเภทรถ 2 บรรทัดสรุปจากรถในแผน) + Table pagination
   ยังไม่มีแผน (A.2) = Empty state/Data empty "ไม่มีแผนบำรุงรักษา" + Primary "สร้างแผน" ไม่มี Table header (Admin State=Empty ของ RP & MA Job)
   มือถือ: ตารางเป็น Mobile table (1 แผน = 1 การ์ด) · ปุ่มหัวหน้าอยู่ใต้หัวข้อ · เมนู "…" เป็น bottom sheet
   เมนู "…" ตามสถานะ (S19 S20 · planMenu): ดูรายละเอียด → /detail/ · แก้ไข → /edit/ (S19) · ลบ → ยืนยันการลบแผน (S20) แล้ว toast "ลบแผนบำรุงรักษาสำเร็จ"
   สิทธิ์: สร้าง/แก้ไข/ลบ เฉพาะหน่วยงานผู้สร้างแผน (6 พ.ย. 2569 ผู้สร้างแผน = หน่วยงาน กกฟ.1 · กกฟ.2 · กรย. · กบค. — UNITS)
   หน่วยงาน กกฟ.1 กกฟ.2 กรย. (persona 9 พ.ย. 2569 · ownPlans ของ screens.js · A.1 A.39 A.40): เห็นเฉพาะแผนของหน่วยงานตัวเอง ไม่มีบรรทัดรองหน่วยงาน มีปุ่มสร้างแผน · ไม่มีแผนของตัวเอง = Empty state
   กบค. (listScreen view ของ screens.js · 6 พ.ย. 2569 รอบ 2 "กบค จะทำแผนจะมีรถของ กฝช. ด้วย"): รายการแผนทุกหน่วยงาน มีปุ่มสร้างแผน · คอลัมน์ "หน่วยงานเจ้าของเรื่อง" ต่อจากเลขที่ MR (PLAN_COLS_ALL · Figma 5dfd978 · 9 พ.ย. 2569 แทนบรรทัดรองใต้เลขที่ MR)
     · แผนของ กบค. (MRZ7100001) เมนู … ตามสถานะแบบปกติ · แผนของหน่วยงานอื่น เมนูเหลือดูรายละเอียด → รายละเอียดแผนไม่มีปุ่ม (canManage)
   ผู้อนุมัติเข้ารากแล้วไปหน้าเริ่มของบทบาท (routes.md §2: /approvals/plans/ · กบค. คลัง ตัดพร้อม S22 6 พ.ย. 2569)
   แผงตัวกรอง (listScreen o.filter · 6 พ.ย. 2569 รีวิว "filter หน้ารายการแผน เขต · หน่วยงานหน้างาน กรย. 12 เขต, กกฟ. 1and2" + "กบค. อยากเห็นทุกแผน"):
     ปุ่ม "ตัวกรอง" ของ Table header เปิด FilterShell (แผงตัวกรองแบบเดียวกับฟอร์มแผน S1 · มือถือ Bottom sheet) ช่อง `Input dropdown with badges` (Optional) หลายค่า
     เขต (12 เขตของภาค 1–4 · DISTRICTS ไม่รวม กกฟ.1 กกฟ.2 ของ สนง. ที่อยู่ในช่องหน่วยงานหน้างานแล้ว — Figma R93 132a652) · หน่วยงานหน้างาน (UNITS) · กดตกลงจึงใช้ → ชิปใต้แถวค้นหา (กดเอาออกทีละตัว) + Pill จำนวนบนปุ่มตัวกรอง · ไม่ตรง = Empty state/Search not found + ล้างตัวกรอง
     ตามแผงตัวกรอง "PEA Car Cost Filter" ของ UI Release#2 (แบบเดียวกับ R77 ของฟอร์มแผน) */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { AppFrame } from "@/components/shell/AppFrame";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { Table, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { DISTRICTS, HQ_REGION, MENU, UNITS, unitOf } from "@/lib/mock/data";
import { PLAN_COLS, PLAN_COLS_ALL, menuCount, planDistricts, planRow } from "@/lib/mock/plan";
import { DELETE_CONFIRM, PLAN_ROLES, canManage, deletePlan, roleHome, planId, startEdit, useHydrated, visiblePlans } from "@/lib/mock/planFlow";
import { FilterShell } from "@/app/vehicles/_lib/ui";
import { useMock, useRole } from "@/lib/mock/store";
import type { Plan } from "@/lib/mock/data";
import { useBreakpoint } from "@/lib/useBreakpoint";

const PER = 10;
/* คีย์แถว = เลขที่ MR (มุมมอง กบค. ช่องแรกเป็น { text, sub }) */
const mrKey = (r: TableValue[]) => { const v = r[0]; return v && typeof v === "object" && "text" in v ? v.text : String(v); };

export default function PlanList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const role = useRole();
  const plans = useMemo(() => visiblePlans(role, mock.plans), [role, mock.plans]);   // กกฟ.1 กกฟ.2 กรย. เห็นเฉพาะแผนของตัวเอง (ownPlans) · กบค. ทุกหน่วยงาน (allPlans · 9 พ.ย. 2569)
  const creator = PLAN_ROLES.includes(role);   // ผู้สร้างแผน: หน่วยงาน (กกฟ.1 · กกฟ.2 · กรย.) · กบค. (6 พ.ย. 2569 รอบ 2 · 9 พ.ย. 2569)
  const view = role === "กบค.";              // กบค. เห็นแผนทุกหน่วยงาน (หน่วยงานเป็นบรรทัดรองของเลขที่ MR)
  const hydrated = useHydrated();
  const home = hydrated ? roleHome(role, mock) : undefined;
  useEffect(() => { if (hydrated && home) router.replace(home); }, [hydrated, home, router]);
  const [del, setDel] = useState<Plan | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<{ mr: string; anchor: MenuAnchor } | null>(null);

  /* แผงตัวกรอง: ค่าที่ใช้แล้ว (applied) · ค่าในแผง (fd · ยังไม่กดตกลง) */
  type F = { districts: string[]; units: string[] };
  const NONE: F = { districts: [], units: [] };
  const [applied, setApplied] = useState<F>(NONE);
  const [panel, setPanel] = useState(false);
  const [fd, setFd] = useState<F>(NONE);
  const [open, setOpen] = useState<"" | "district" | "unit">("");
  const flip = (k: keyof F, v: string) => setFd((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));
  const drop = (k: keyof F) => (v: string) => setFd((f) => ({ ...f, [k]: f[k].filter((x) => x !== v) }));
  const closePanel = () => { setOpen(""); setPanel(false); };
  const chips = [...applied.districts, ...applied.units];
  const removeChip = (c: string) => { setApplied((a) => ({ districts: a.districts.filter((x) => x !== c), units: a.units.filter((x) => x !== c) })); setPage(1); };

  const rows = useMemo(() => {
    const q = query.trim();
    return plans.filter((p) => (!q || p.mr.includes(q) || p.name.includes(q))
      && (!applied.districts.length || planDistricts(p).some((d) => applied.districts.includes(d)))
      && (!applied.units.length || applied.units.includes(unitOf(p.mr, p.unit))));
  }, [plans, query, applied]);
  const shown = rows.slice((page - 1) * PER, page * PER);
  const opened = plans.find((p) => p.mr === menu?.mr);
  /* ดูรายละเอียด → /detail/ · แก้ไข → เริ่มฟอร์มแก้ไขจากข้อมูลแผน แล้วไป /edit/ · ลบ → ยืนยัน (S20 S.2) */
  const act = (p: Plan, i: number) => {
    if (i === 0) router.push("/detail/?id=" + planId(p));
    else if (i === 1) { startEdit(p); router.push("/edit/?id=" + planId(p)); }
    else setDel(p);
  };
  const nMenu = (p: Plan) => (canManage(role, p) ? menuCount(p) : 1);   // แผนหน่วยงานอื่น (มุมมอง กบค.) ดูรายละเอียดอย่างเดียว
  const items = opened ? MENU.slice(0, nMenu(opened)).map((m, i) => ({ ...m, onClick: () => act(opened, i) })) : [];

  const data = shown.map((p) => planRow(p, {
    actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + p.mr, onClick: (e) => setMenu({ mr: p.mr, anchor: anchorOf(e.currentTarget) }) }],
    // มือถือ: กางไอคอนดู แก้ไข ลบ ตามสถานะแผนบนการ์ดเลย (Mobile table item Style=Action icons · View Edit Delete · เจ้าของงาน 4 พ.ย. 2569)
    mobileActions: MENU.slice(0, nMenu(p)).map((m, i) => ({ IconSwap: m.IconSwap, label: m.Text + " " + p.mr, onClick: () => act(p, i) })),
  }, view));
  const create = creator ? <PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/new/")} /> : undefined;

  return (
    <AppFrame>
      <PageHeader Title="บำรุงรักษาตามวาระ" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      {hydrated && !plans.length ? (
        <EmptyStateDataEmpty Text="ไม่มีแผนบำรุงรักษา" SupportingText="เมื่อสร้างแผนบำรุงรักษา รายการแผนจะแสดงที่นี่" Actions={create} />
      ) : (
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} Actions={create}
          onFilter={() => { setFd(applied); setOpen(""); setPanel(true); }} FilterCount={chips.length} Filters={chips} onRemoveFilter={removeChip} />
        {!rows.length ? (
          <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={() => { setQuery(""); setApplied(NONE); setPage(1); }} />} />
        ) : mob ? (
          <div className="flex flex-col gap-5">
            <MobileCards columns={view ? PLAN_COLS_ALL : PLAN_COLS} rows={data} rowKey={mrKey} />
            <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />
          </div>
        ) : (
          <Table columns={view ? PLAN_COLS_ALL : PLAN_COLS} rows={data} rowKey={mrKey} Pagination={<TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />} />
        )}
      </section>
      )}
      <RowMenu anchor={menu?.anchor ?? null} items={items} onClose={() => setMenu(null)} />
      <FilterShell open={panel} onClose={closePanel} onClear={() => setFd(NONE)} onApply={() => { setApplied(fd); setPage(1); closePanel(); }}>
        <InputDropdownWithBadges LabelText="เขต" Optional values={fd.districts} Placeholder="เลือกเขต" onRemove={drop("districts")} open={open === "district"} onOpenChange={(v) => setOpen(v ? "district" : "")}>
          <DropdownList>{Object.entries(DISTRICTS).filter(([r]) => r !== HQ_REGION).flatMap(([, d]) => d).map((x) => <DropdownListItem key={x} Text={x} State={fd.districts.includes(x) ? "Selected" : "Default"} onClick={() => flip("districts", x)} />)}</DropdownList>
        </InputDropdownWithBadges>
        <InputDropdownWithBadges LabelText="หน่วยงานหน้างาน" Optional values={fd.units} Placeholder="เลือกหน่วยงานหน้างาน" onRemove={drop("units")} open={open === "unit"} onOpenChange={(v) => setOpen(v ? "unit" : "")}>
          <DropdownList>{UNITS.map((u) => <DropdownListItem key={u} Text={u} State={fd.units.includes(u) ? "Selected" : "Default"} onClick={() => flip("units", u)} />)}</DropdownList>
        </InputDropdownWithBadges>
      </FilterShell>
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(null)} onOk={() => { const mr = del?.mr; setDel(null); if (mr) deletePlan(mr); }} />
    </AppFrame>
  );
}
