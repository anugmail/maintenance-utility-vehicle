"use client";
/* S1 · หน้า รายการแผนบำรุงรักษา — listScreen() ใน screens.js
   Page header (Title "บำรุงรักษาตามวาระ" · ปุ่ม "สร้างแผน") → Section ช่องไฟ 24: Table header (ค้นหา + ตัวกรอง) + Table 8 คอลัมน์ (PLAN_COLS) + Table pagination
   มือถือ: ตารางเป็น Mobile table (1 แผน = 1 การ์ด) · ปุ่มหัวหน้าอยู่ใต้หัวข้อ · เมนู "…" เป็น bottom sheet
   เมนู "…" ตามสถานะ (S19 S20): ดูรายละเอียด แก้ไข ลบ → หน้าของ S19/S20 ยังไม่ทำ ไปหน้า "เร็วๆ นี้"
   สิทธิ์: สร้าง/แก้ไข/ลบ เฉพาะ กบค. (หัวข้อ 1 Permission ของไฟล์ userflow) */
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

const PER = 10;
const MENU_TO = ["S19", "S19", "S20"];   // ดูรายละเอียด → รายละเอียดแผน (S19/S20) · แก้ไข → S19 · ลบ → S20

export default function PlanList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const { plans } = useMock();
  const kbk = useRole() === "กบค.";
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<{ mr: string; anchor: MenuAnchor } | null>(null);

  const rows = useMemo(() => {
    const q = query.trim();
    return q ? plans.filter((p) => p.mr.includes(q) || p.name.includes(q)) : plans;
  }, [plans, query]);
  const shown = rows.slice((page - 1) * PER, page * PER);
  const open = plans.find((p) => p.mr === menu?.mr);
  const items = open ? MENU.slice(0, kbk ? menuCount(open) : 1).map((m, i) => ({ ...m, onClick: () => router.push("/soon/?s=" + MENU_TO[i]) })) : [];

  const data = shown.map((p) => planRow(p, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + p.mr, onClick: (e) => setMenu({ mr: p.mr, anchor: anchorOf(e.currentTarget) }) }] }));
  const create = kbk ? <PrimaryButton Text="สร้างแผน" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => router.push("/plans/new/")} /> : undefined;

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
    </AppFrame>
  );
}
