"use client";
/* S1 · หน้า รายการแผนบำรุงรักษา (รากเว็บ / — ทางเข้าจากเมนู Sidebar "งานซ่อมและบำรุงรักษา > บำรุงรักษาตามวาระ" แบบระบบจริง) — listScreen() ใน screens.js
   ตาม `Table header` + `Empty state/Data empty` ของไฟล์ Component + Incident list ของหน้า 5.5 Repair & Maintenance Job (Admin) ใน UI Release#2 (รีวิวทีมออกแบบ 5 พ.ย. 2569 · A.1 A.2)
   Page header (Title "บำรุงรักษาตามวาระ" ไม่มีปุ่ม) → Section ช่องไฟ 24: Table header (ค้นหา + ตัวกรอง + Primary "สร้างแผน" ขวาของตัวกรอง) + Table 8 คอลัมน์ (PLAN_COLS · ภาค / ประเภทรถ 2 บรรทัดสรุปจากรถในแผน) + Table pagination
   ยังไม่มีแผน (A.2) = Empty state/Data empty "ไม่มีแผนบำรุงรักษา" + Primary "สร้างแผน" ไม่มี Table header (Admin State=Empty ของ RP & MA Job)
   มือถือ: ตารางเป็น Mobile table (1 แผน = 1 การ์ด) · ปุ่มหัวหน้าอยู่ใต้หัวข้อ · เมนู "…" เป็น bottom sheet
   เมนู "…" ตามสถานะ (S19 S20 · planMenu): ดูรายละเอียด → /detail/ · แก้ไข → /edit/ (S19) · ลบ → ยืนยันการลบแผน (S20) แล้ว toast "ลบแผนบำรุงรักษาสำเร็จ"
   สิทธิ์: สร้าง/แก้ไข/ลบ เฉพาะหน่วยงานผู้สร้างแผน (6 พ.ย. 2569 ผู้สร้างแผน = หน่วยงาน กกฟ.1 · กกฟ.2 · กรย. — เดิม กบค.)
   กบค. (6 พ.ย. 2569 "กบค แค่เห็นแผนทั้งหมด" · listScreen view ของ screens.js): รายการแผนทุกหน่วยงาน ไม่มีปุ่มสร้างแผน · เลขที่ MR มีบรรทัดรอง = หน่วยงาน · เมนู … เหลือดูรายละเอียด → รายละเอียดแผนไม่มีปุ่ม · ผู้อนุมัติ / กบค. คลัง เข้ารากแล้วไปหน้าเริ่มของบทบาท (routes.md §2: /approvals/plans/ · /warehouse/) */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { AppFrame } from "@/components/shell/AppFrame";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { Table, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { MENU } from "@/lib/mock/data";
import { PLAN_COLS, menuCount, planRow } from "@/lib/mock/plan";
import { DELETE_CONFIRM, deletePlan, roleHome, planId, startEdit, useHydrated } from "@/lib/mock/planFlow";
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
  const { plans } = mock;
  const role = useRole();
  const kbk = role === "หน่วยงาน (กกฟ.1)";   // ผู้สร้างแผน (ชื่อตัวแปรเดิม)
  const view = role === "กบค.";              // กบค. ดูแผนทุกหน่วยงานอย่างเดียว
  const hydrated = useHydrated();
  const home = hydrated ? roleHome(role, mock) : undefined;
  useEffect(() => { if (hydrated && home) router.replace(home); }, [hydrated, home, router]);
  const [del, setDel] = useState<Plan | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<{ mr: string; anchor: MenuAnchor } | null>(null);

  const rows = useMemo(() => {
    const q = query.trim();
    return q ? plans.filter((p) => p.mr.includes(q) || p.name.includes(q)) : plans;
  }, [plans, query]);
  const shown = rows.slice((page - 1) * PER, page * PER);
  const open = plans.find((p) => p.mr === menu?.mr);
  /* ดูรายละเอียด → /detail/ · แก้ไข → เริ่มฟอร์มแก้ไขจากข้อมูลแผน แล้วไป /edit/ · ลบ → ยืนยัน (S20 S.2) */
  const act = (p: Plan, i: number) => {
    if (i === 0) router.push("/detail/?id=" + planId(p));
    else if (i === 1) { startEdit(p); router.push("/edit/?id=" + planId(p)); }
    else setDel(p);
  };
  const items = open ? MENU.slice(0, kbk ? menuCount(open) : 1).map((m, i) => ({ ...m, onClick: () => act(open, i) })) : [];

  const data = shown.map((p) => planRow(p, {
    actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + p.mr, onClick: (e) => setMenu({ mr: p.mr, anchor: anchorOf(e.currentTarget) }) }],
    // มือถือ: กางไอคอนดู แก้ไข ลบ ตามสถานะแผนบนการ์ดเลย (Mobile table item Style=Action icons · View Edit Delete · เจ้าของงาน 4 พ.ย. 2569)
    mobileActions: MENU.slice(0, kbk ? menuCount(p) : 1).map((m, i) => ({ IconSwap: m.IconSwap, label: m.Text + " " + p.mr, onClick: () => act(p, i) })),
  }, view));
  const create = kbk ? <PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/new/")} /> : undefined;

  return (
    <AppFrame>
      <PageHeader Title="บำรุงรักษาตามวาระ" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      {hydrated && !plans.length ? (
        <EmptyStateDataEmpty Text="ไม่มีแผนบำรุงรักษา" SupportingText="เมื่อสร้างแผนบำรุงรักษา รายการแผนจะแสดงที่นี่" Actions={create} />
      ) : (
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} Actions={create} />
        {mob ? (
          <div className="flex flex-col gap-5">
            <MobileCards columns={PLAN_COLS} rows={data} rowKey={mrKey} />
            <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />
          </div>
        ) : (
          <Table columns={PLAN_COLS} rows={data} rowKey={mrKey} Pagination={<TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />} />
        )}
      </section>
      )}
      <RowMenu anchor={menu?.anchor ?? null} items={items} onClose={() => setMenu(null)} />
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(null)} onOk={() => { const mr = del?.mr; setDel(null); if (mr) deletePlan(mr); }} />
    </AppFrame>
  );
}
