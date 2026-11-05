"use client";
/* S2 · หน้า แผนรออนุมัติ (/approvals/plans/) — roleList() ใน screens.js · เฉพาะบทบาท ผู้อนุมัติ (หน้าเริ่มของบทบาท)
   Page header "แผนรออนุมัติ" (ไม่มีย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ) → Section ช่องไฟ 24: Table header (ค้นหา "ค้นหาชื่อแผน, ผู้สร้าง" + ตัวกรอง) + Table (REVIEW_COLS) + Table pagination
   แถว = แผนที่ส่งมา (รออนุมัติ · ส่งกลับแก้ไข ยังอยู่ในรายการตามจอ B.8) · "›" เปิดหน้าตรวจสอบแผน · มือถือ: Mobile table */
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { PLAN_CREATOR_SHORT, PST } from "@/lib/mock/data";
import { scopeCell } from "@/lib/mock/plan";
import { planId, useRoleGuard } from "@/lib/mock/planFlow";
import { useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

const PER = 10;
/* REVIEW_COLS */
const COLS: TableColumn[] = [
  { head: "ชื่อแผน", Style: "Lead text", SortIcon: "Swap" }, { head: "ปีงบประมาณ", width: 120 }, { head: "ผู้สร้าง (กบค.)", width: 180 }, { head: "ภาค / ประเภทรถ", width: 200 },
  { head: "จำนวนรถ", width: 100 }, { head: "วันที่ส่ง", width: 120, SortIcon: "Down" }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];

export default function ApprovalList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(["ผู้อนุมัติ"]);
  const { plans } = useMock();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const rows = useMemo(() => {
    const q = query.trim();
    return plans.filter((p) => (p.status === "review" || p.status === "returned") && (!q || p.name.includes(q) || PLAN_CREATOR_SHORT.includes(q)));
  }, [plans, query]);
  if (!ok) return <AppFrame>{null}</AppFrame>;
  const data: TableValue[][] = rows.slice((page - 1) * PER, page * PER).map((p) => [
    p.name, p.year, PLAN_CREATOR_SHORT, scopeCell(p), p.cars + " คัน", p.sentAt ?? p.created, { pills: [PST[p.status]] },
    { actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label: "เปิด " + p.name, onClick: () => router.push("/approvals/plans/detail/?id=" + planId(p)) }] },
  ]);
  const pager = <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />;
  return (
    <AppFrame>
      <PageHeader Title="แผนรออนุมัติ" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาชื่อแผน, ผู้สร้าง" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} />
        {mob ? <div className="flex flex-col gap-5"><MobileCards columns={COLS} rows={data} />{pager}</div> : <Table columns={COLS} rows={data} Pagination={pager} />}
      </section>
    </AppFrame>
  );
}
