"use client";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { TabItem } from "@/components/vms/TabItem";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { Tabs } from "@/components/vms/Tabs";
import { PST, creatorName, unitOf, type PlanStatus } from "@/lib/mock/data";
import { scopeCell } from "@/lib/mock/plan";
import { planId, useRoleGuard } from "@/lib/mock/planFlow";
import { useMock, ROLES } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

const PER = 10;
const COLS: TableColumn[] = [
  { head: "ชื่อแผน", Style: "Lead text", SortIcon: "Swap" }, { head: "ปีงบประมาณ", width: 120 }, { head: "ผู้สร้าง", width: 180 }, { head: "ภาค / ประเภทยานพาหนะ", width: 200 },
  { head: "จำนวนยานพาหนะ", width: 100 }, { head: "วันที่ส่ง", width: 120, SortIcon: "Down" }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];
const TABS: [string, PlanStatus[]][] = [["รออนุมัติ", ["review"]], ["อนุมัติแล้ว", ["approved", "active", "closed"]], ["ส่งกลับแก้ไข", ["returned"]]];

export default function ApprovalList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(ROLES);
  const { plans } = useMock();
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pending = plans.filter((p) => p.status === "review").length;
  const rows = useMemo(() => {
    const q = query.trim();
    return plans.filter((p) => TABS[tab][1].includes(p.status) && (!q || p.name.includes(q) || creatorName(p).includes(q)));
  }, [plans, query, tab]);
  if (!ok) return <AppFrame>{null}</AppFrame>;
  const data: TableValue[][] = rows.slice((page - 1) * PER, page * PER).map((p) => [
    p.name, p.year, { text: creatorName(p), sub: unitOf(p.mr, p.unit) }, scopeCell(p),
    p.cars + " คัน", p.sentAt ?? p.created, { pills: [PST[p.status]] },
    { actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label: "เปิด " + p.name, onClick: () => router.push("/approvals/plans/detail/?id=" + planId(p)) }] },
  ]);
  const pager = <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />;
  return (
    <AppFrame>
      <PageHeader Title="อนุมัติแผนบำรุงรักษา" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{TABS.map(([t], i) => <TabItem key={t} Text={t} Badge={i === 0 ? pending : null} Active={tab === i} onClick={() => { setTab(i); setPage(1); }} />)}</Tabs>
        <TableHeader Placeholder="ค้นหาชื่อแผน, ผู้สร้าง" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} />
        {mob ? <div className="flex flex-col gap-5"><MobileCards columns={COLS} rows={data} />{pager}</div> : <Table columns={COLS} rows={data} Pagination={pager} />}
      </section>
    </AppFrame>
  );
}
