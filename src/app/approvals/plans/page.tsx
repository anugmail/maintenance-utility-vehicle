"use client";
/* S2 · หน้า อนุมัติแผนบำรุงรักษา (/approvals/plans/) — planReviewList() + roleList() ใน screens.js · ทุกบทบาทของต้นแบบ (ข้อ 46)
   Page header "อนุมัติแผนบำรุงรักษา" (ไม่มีย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ) → Section ช่องไฟ 24: Tabs → Table header (ค้นหา "ค้นหาชื่อแผน, ผู้สร้าง" + ตัวกรอง) + Table (REVIEW_COLS) + Table pagination
   แท็บ (R88 · component-rules §5.36 · เจ้าของงาน 10 พ.ย. 2569 "หน้าอนุมัติต้องมี tab รออนุมัติ อนุมัติแล้ว และ ส่งกลับแก้ไขด้วย") = REVIEW_TABS ของ screens.js
     ตาม `Tabs` + `Tab item` ของไฟล์ Component + จอ B.1 B.8 B.10 B.11 ของ Figma:
     รออนุมัติ (ตัวเลข = จำนวนแผนที่รอ ไม่ขึ้นกับคำค้น) · อนุมัติแล้ว · ส่งกลับแก้ไข (ไม่มีตัวเลข)
     ส่งกลับแล้ว (B.8) แผนออกจากแท็บรออนุมัติ ตัวเลขลด ไปอยู่แท็บส่งกลับแก้ไข
     แท็บอนุมัติแล้ว (B.10): REVIEW_DONE ของ screens.js มีแผนอนุมัติแล้ว (MRZ7000002) กับแผนที่เริ่มดำเนินการ (MRZ7000001) ป้าย "อนุมัติแล้ว" ทั้งคู่ ไม่มีแผนปิดงานแล้ว
       ⇒ แผนที่ผ่านการอนุมัติแล้วและยังไม่ปิดงาน ป้ายอนุมัติแล้ว (ยังไม่เคาะ §5.36 — BACKLOG ค.)
   "›" เปิดหน้าตรวจสอบแผน · มือถือ: Mobile table */
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
/* REVIEW_COLS */
const COLS: TableColumn[] = [
  { head: "ชื่อแผน", Style: "Lead text", SortIcon: "Swap" }, { head: "ปีงบประมาณ", width: 120 }, { head: "ผู้สร้าง", width: 180 }, { head: "ภาค / ประเภทยานพาหนะ", width: 200 },
  { head: "จำนวนยานพาหนะ", width: 100 }, { head: "วันที่ส่ง", width: 120, SortIcon: "Down" }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];
/* REVIEW_TABS — [ข้อความ, สถานะแผนในแท็บ] · ตัวเลขเฉพาะแท็บรออนุมัติ */
const TABS: [string, PlanStatus[]][] = [["รออนุมัติ", ["review"]], ["อนุมัติแล้ว", ["approved", "active", "hist", "passed"]], ["ส่งกลับแก้ไข", ["returned"]]];

export default function ApprovalList() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(ROLES);   // ทุกบทบาทของต้นแบบอนุมัติได้ (9 พ.ย. 2569 เจ้าของงาน "ตอนอนุมัติให้เห็น เมนูของทุกคนไปเลย" · ระบบจริงหาผู้อนุมัติจากสายบังคับบัญชา upper/lower)
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
    p.name, p.year, { text: creatorName(p), sub: unitOf(p.mr, p.unit) }, scopeCell(p),   // reviewRow 6 พ.ย. 2569: ชื่อ + หน่วยงานบรรทัดรอง · ชื่อ = persona ของหน่วยงาน (9 พ.ย. 2569)
    p.cars + " คัน", p.sentAt ?? p.created, { pills: [PST[tab === 1 ? "approved" : p.status]] },
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
