"use client";
/* S22 · หน้า แผนที่ต้องเตรียมอะไหล่ (/warehouse/) — roleList() ใน screens.js · เฉพาะบทบาท กบค. คลัง (หน้าเริ่มของบทบาท)
   แผนเข้ารายการทันทีที่อนุมัติ (S2) — แผนอนุมัติแล้ว / ดำเนินการ · Table header (ค้นหา "ค้นหาเลขที่ MR, ชื่อแผน" + ตัวกรอง) + Table (WH_COLS) + Table pagination
   สถานะ (wst): ยังไม่รับทราบ "รอรับทราบ" Warning · บางไตรมาส "รับทราบ n/N ไตรมาส" Info · ครบ "รับทราบครบแล้ว" Success (N = ไตรมาสที่มีรถ) · "›" เปิดหน้าอะไหล่ที่ต้องเบิก */
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { WH_LIST } from "@/lib/mock/data";
import { planId, useRoleGuard, whStatusOf } from "@/lib/mock/planFlow";
import { useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

const PER = 10;
/* WH_COLS */
const COLS: TableColumn[] = [
  { head: "เลขที่ MR", width: 150, Style: "Lead text" }, { head: "ชื่อแผน" }, { head: "ปีงบประมาณ", width: 120 }, { head: "จำนวนรถ", width: 100 },
  { head: "วันที่อนุมัติ", width: 130 }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];

export default function WarehouseList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(["กบค. คลัง"]);
  const { plans } = useMock();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const rows = useMemo(() => {
    const q = query.trim();
    return plans.filter((p) => (p.status === "approved" || p.status === "active") && (!q || p.mr.includes(q) || p.name.includes(q)));
  }, [plans, query]);
  if (!ok) return <AppFrame>{null}</AppFrame>;
  const data: TableValue[][] = rows.slice((page - 1) * PER, page * PER).map((p) => [
    p.mr, p.name, p.year, p.cars + " คัน", p.approvedAt ?? WH_LIST[p.mr]?.approvedAt ?? "-", { pills: [whStatusOf(p)] },
    { actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label: "เปิด " + p.mr, onClick: () => router.push("/warehouse/detail/?id=" + planId(p) + "&q=1") }] },
  ]);
  const pager = <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />;
  return (
    <AppFrame>
      <PageHeader Title="แผนที่ต้องเตรียมอะไหล่" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" query={query} onQuery={(q) => { setQuery(q); setPage(1); }} />
        {mob ? <div className="flex flex-col gap-5"><MobileCards columns={COLS} rows={data} />{pager}</div> : <Table columns={COLS} rows={data} Pagination={pager} />}
      </section>
    </AppFrame>
  );
}
