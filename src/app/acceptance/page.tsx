"use client";
/* S13 L.1 L.5 · S14 M.1 · หน้า การตรวจบำรุงรถรอตรวจสอบ ของหน่วยงานเจ้าของรถ (/acceptance/) — roleList() + ACC_COLS + accRows() ใน screens.js
   Page header (ไม่มีปุ่มย้อนกลับ) → Section ช่องไฟ 24: Table header (ค้นหา "ค้นหาทะเบียน, เลขที่ MR" + ตัวกรอง) + Table + Table pagination (= จำนวนแถว)
   แถวรถ = งานรายคันที่เสร็จสิ้น/บำรุงรักษาไม่ได้ของแผนเดินทางที่อนุมัติแล้ว (S10 ปิดงาน · S11 อนุมัติงานผู้รับจ้าง) — รอหน่วยงานยอมรับ / หน่วยงานยอมรับแล้ว
   รถทุกคันของแผนถึงขั้นนี้และยอมรับครบ → แถว "ทั้งแผน (n คัน)" ของแผนนั้นขึ้นบนสุด (ครบทุกคันแล้ว รอตรวจหลักฐาน → ยอมรับผลทั้งแผนแล้ว)
   "›" เปิดผลรายคัน (S13) / หลักฐานทั้งแผน (S14) · มือถือ: Mobile table การ์ดละแถว
   อ้างอิง: Table header · Table · Table pagination · Mobile table ของไฟล์ Component + หน้ารายการ (roleList) ของ UI Release#2 ผ่าน screens.js */
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { ACCEPT_SAMPLES, ACCEPT_STATUS, PLAN_ACCEPT_STATUS, accCarHref, accPlans, accRows } from "@/lib/mock/acceptance";
import { planOf } from "@/lib/mock/closeout";
import { useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "@/lib/useSample";

/* ACC_COLS */
const COLS: TableColumn[] = [
  { head: "ทะเบียน / แผน", Style: "Lead text" }, { head: "วันที่บำรุง", width: 140 }, { head: "ผู้ทำ", width: 220 },
  { head: "เลขที่ MR", width: 140 }, { head: "สถานะ", width: 200, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];
const PER = 10;

function AcceptList() {
  const router = useRouter();
  const pending = useSample(ACCEPT_SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  if (pending) return null;

  const go = (href: string, label: string): TableValue => ({ actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label, onClick: () => router.push(href) }] });
  const all: { key: string; search: string; row: TableValue[] }[] = accRows(mock).map((r) => {
    const st = r.accepted ? ACCEPT_STATUS.ok : ACCEPT_STATUS.wait;
    return { key: r.trip.id + ":" + r.car.id, search: r.car.plate + " " + r.mr, row: [r.car.plate, r.date, r.by, r.mr, { pills: [[st[0], st[1]]] }, go(accCarHref(r), "เปิด " + r.car.plate)] };
  });
  accPlans(mock).filter((p) => p.ready).reverse().forEach((p) => {
    const st = p.done ? PLAN_ACCEPT_STATUS.done : PLAN_ACCEPT_STATUS.wait;
    const row = ["ทั้งแผน (" + (planOf(mock, p.planId)?.cars ?? p.rows.length) + " คัน)", p.range, p.by, p.mr];
    all.unshift({ key: "plan-" + p.planId, search: row.join(" "), row: [...row, { pills: [[st[0], st[1]]] }, go("/acceptance/plan/?id=" + p.planId, "เปิด " + p.mr)] });
  });
  const q = query.trim();
  const rows = q ? all.filter((r) => r.search.includes(q)) : all;
  const shown = rows.slice((page - 1) * PER, page * PER);
  const pager = <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />;

  return (
    <>
      <PageHeader Title="การตรวจบำรุงรถรอตรวจสอบ" crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาทะเบียน, เลขที่ MR" query={query} onQuery={(v) => { setQuery(v); setPage(1); }} />
        {mob ? (
          <div className="flex flex-col gap-5"><MobileCards columns={COLS} rows={shown.map((r) => r.row)} rowKey={(_, i) => shown[i].key} />{pager}</div>
        ) : (
          <Table columns={COLS} rows={shown.map((r) => r.row)} rowKey={(_, i) => shown[i].key} Pagination={pager} />
        )}
      </section>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><AcceptList /></Suspense></AppFrame>;
}
