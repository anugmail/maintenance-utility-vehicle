"use client";
/* S13 L.1 L.5 · S14 M.1 · หน้า การตรวจบำรุงรถรอตรวจสอบ ของหน่วยงานเจ้าของรถ (/acceptance/) — roleList() + ACC_COLS + accRows() ใน screens.js
   Page header (ไม่มีปุ่มย้อนกลับ) → Section ช่องไฟ 24: Table header (ค้นหา "ค้นหาทะเบียน, เลขที่ MR" + ตัวกรอง) + Table + Table pagination (= จำนวนแถว)
   แถวรถ: รอหน่วยงานยอมรับ / หน่วยงานยอมรับแล้ว · ยอมรับครบทุกคัน → แถว "ทั้งแผน (12 คัน)" ขึ้นบนสุด (ครบทุกคันแล้ว รอตรวจหลักฐาน → ยอมรับผลทั้งแผนแล้ว)
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
import {
  ACCEPTANCE_CARS, ACCEPTANCE_PLAN_ROW, ACCEPT_SAMPLES, ACCEPT_STATUS, PLAN_ACCEPT_STATUS, accCar, allCarsAccepted, useAcceptance,
} from "@/lib/mock/acceptance";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "../_c2/ui";

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
  const a = useAcceptance();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  if (pending) return null;

  const go = (href: string, label: string): TableValue => ({ actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label, onClick: () => router.push(href) }] });
  const all: { key: string; search: string; row: TableValue[] }[] = ACCEPTANCE_CARS.map((r) => {
    const car = accCar(r.carId)!;
    const st = a.accepted.includes(r.carId) ? ACCEPT_STATUS.ok : ACCEPT_STATUS.wait;
    return { key: r.carId, search: car.plate + " " + r.mr, row: [car.plate, r.date, r.by, r.mr, { pills: [[st[0], st[1]]] }, go("/acceptance/car/?trip=T1&car=" + r.carId, "เปิด " + car.plate)] };
  });
  if (allCarsAccepted(a)) {
    const st = a.planDone ? PLAN_ACCEPT_STATUS.done : PLAN_ACCEPT_STATUS.wait;
    all.unshift({ key: "plan", search: ACCEPTANCE_PLAN_ROW.join(" "), row: [...ACCEPTANCE_PLAN_ROW, { pills: [[st[0], st[1]]] }, go("/acceptance/plan/?id=Z7000001", "เปิด " + ACCEPTANCE_PLAN_ROW[3])] });
  }
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
