"use client";
/* S1 · หน้า รายการแผนบำรุงรักษา (รากเว็บ / — ทางเข้าจากเมนู Sidebar "งานซ่อมและบำรุงรักษา > บำรุงรักษาตามวาระ" แบบระบบจริง) — listScreen() ใน screens.js
   Page header (Title "บำรุงรักษาตามวาระ" · ปุ่ม "สร้างแผน") → Section ช่องไฟ 24: Table header (ค้นหา + ตัวกรอง) + Table 8 คอลัมน์ (PLAN_COLS) + Table pagination
   มือถือ: ตารางเป็น Mobile table (1 แผน = 1 การ์ด) · ปุ่มหัวหน้าอยู่ใต้หัวข้อ · เมนู "…" เป็น bottom sheet
   เมนู "…" ตามสถานะ (S19 S20 · planMenu): ดูรายละเอียด → /detail/ · แก้ไข → /edit/ (S19) · ลบ → ยืนยันการลบแผน (S20) แล้ว toast "ลบแผนบำรุงรักษาสำเร็จ"
   สิทธิ์: สร้าง/แก้ไข/ลบ เฉพาะ กบค. (หัวข้อ 1 Permission ของไฟล์ userflow) · ผู้อนุมัติ / กบค. คลัง เข้ารากแล้วไปหน้าเริ่มของบทบาท (routes.md §2: /approvals/plans/ · /warehouse/) */
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { AppFrame } from "@/components/shell/AppFrame";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { Table } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { MENU } from "@/lib/mock/data";
import { PLAN_COLS, menuCount, planRow } from "@/lib/mock/plan";
import { DELETE_CONFIRM, ROLE_HOME, deletePlan, planId, startEdit, useHydrated } from "@/lib/mock/planFlow";
import { useMock, useRole } from "@/lib/mock/store";
import type { Plan } from "@/lib/mock/data";
import { useBreakpoint } from "@/lib/useBreakpoint";

const PER = 10;

export default function PlanList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const { plans } = useMock();
  const role = useRole();
  const kbk = role === "กบค.";
  const hydrated = useHydrated();
  const home = ROLE_HOME[role];
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
  }));
  const create = kbk ? <PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/new/")} /> : undefined;

  return (
    <AppFrame>
      <PageHeader Title="บำรุงรักษาตามวาระ" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} Actions={create} />
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} />
        {mob ? (
          <div className="flex flex-col gap-5">
            <MobileCards columns={PLAN_COLS} rows={data} rowKey={(r) => String(r[0])} />
            <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />
          </div>
        ) : (
          <Table columns={PLAN_COLS} rows={data} rowKey={(r) => String(r[0])} Pagination={<TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />} />
        )}
      </section>
      <RowMenu anchor={menu?.anchor ?? null} items={items} onClose={() => setMenu(null)} />
      <ConfirmDialog spec={del ? DELETE_CONFIRM : null} onCancel={() => setDel(null)} onOk={() => { const mr = del?.mr; setDel(null); if (mr) deletePlan(mr); }} />
    </AppFrame>
  );
}
