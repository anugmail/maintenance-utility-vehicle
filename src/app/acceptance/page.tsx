"use client";
/* S13 L.1 L.6 · หน้า ผลการบำรุงรักษารอรับทราบ ของผู้ดูแลยานพาหนะ (/acceptance/) — ackList() = roleList() + ACC_COLS + accRows() ใน screens.js (Figma 9607c3b · 10 พ.ย. 2569)
   Page header (ไม่มีปุ่มย้อนกลับ) → Section ช่องไฟ 24: Table header (ค้นหา "ค้นหาทะเบียน, แผนเดินทาง") + Table + Table pagination (= จำนวนแถว)
   คอลัมน์ ทะเบียน (บรรทัดรอง ประเภทยานพาหนะ) · วันดำเนินการ · ผู้ดำเนินการ (บรรทัดรอง หน่วยงาน) · แผนเดินทาง (บรรทัดรอง เลขที่ MR) · สถานะ (รอรับทราบ / รับทราบแล้ว) · ›
   แถว = งานรายคันที่เสร็จสิ้น/บำรุงรักษาไม่ได้ของแผนเดินทางที่อนุมัติแล้ว (คันที่บำรุงรักษาไม่ได้ก็รอรับทราบ Q19) · ไม่มีแถวทั้งแผนแล้ว (S14 ตัดออก)
   กระดิ่งมีจุดแดงเมื่อมีแจ้งเตือนที่ยังไม่อ่าน (L.1) · กดกระดิ่ง = แผงแจ้งเตือน (L.6 "ปิดงานบำรุงรักษา … รอผู้ดูแลยานพาหนะรับทราบผลและประเมินความพึงพอใจ") → ผลของคันนั้น
   ต้นแบบ: ผู้ดูแลยานพาหนะเห็นทุกคันในรายการ (ACK_CARS ของ screens.js = ยานพาหนะที่ผู้ดูแลคนนี้ดูแล · ระบบจริงกรองตามชื่อผู้ดูแลในแผนเดินทาง)
   อ้างอิง: Table header · Table · Table pagination · Mobile table ของไฟล์ Component + หน้ารายการ (roleList) ของ UI Release#2 ผ่าน screens.js */
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { ACCEPT_SAMPLES, ACCEPT_STATUS, ACK_LIST, accCarHref, accRows, splitBy } from "@/lib/mock/acceptance";
import { useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "@/lib/useSample";
import { useBell } from "../trips-view/_shared/Bell";

/* ACC_COLS */
const COLS: TableColumn[] = [
  { head: "ทะเบียน", Style: "Lead text" }, { head: "วันดำเนินการ", width: 140 }, { head: "ผู้ดำเนินการ", width: 220 },
  { head: "แผนเดินทาง", width: 260 }, { head: "สถานะ", width: 160, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];
const PER = 10;

function AckList() {
  const router = useRouter();
  const pending = useSample(ACCEPT_SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  if (pending) return null;

  const all = accRows(mock).map((r) => {
    const st = r.accepted ? ACCEPT_STATUS.ok : ACCEPT_STATUS.wait;
    const [name, unit] = splitBy(r.by);
    const row: TableValue[] = [{ text: r.car.plate, sub: r.car.type }, r.date, unit ? { text: name, sub: unit } : name, { text: r.trip.name, sub: r.mr },
      { pills: [[st[0], st[1]]] }, { actions: [{ IconSwap: "keyboard_arrow_right-20-400-round", label: "เปิด " + r.car.plate, onClick: () => router.push(accCarHref(r)) }] }];
    return { key: r.trip.id + ":" + r.car.id, search: r.car.plate + " " + r.trip.name, row };
  });
  const q = query.trim();
  const rows = q ? all.filter((r) => r.search.includes(q)) : all;
  const shown = rows.slice((page - 1) * PER, page * PER);
  const pager = <TablePagination total={rows.length} page={page} perPage={PER} onPage={setPage} />;

  return (
    <>
      <PageHeader Title={ACK_LIST} crumbs={[{ Text: "บำรุงรักษาตามวาระ" }]} />
      <section className="flex flex-col gap-6">
        <TableHeader Placeholder="ค้นหาทะเบียน, แผนเดินทาง" query={query} onQuery={(v) => { setQuery(v); setPage(1); }} />
        {mob ? (
          <div className="flex flex-col gap-5"><MobileCards columns={COLS} rows={shown.map((r) => r.row)} rowKey={(_, i) => shown[i].key} />{pager}</div>
        ) : (
          <Table columns={COLS} rows={shown.map((r) => r.row)} rowKey={(_, i) => shown[i].key} Pagination={pager} />
        )}
      </section>
    </>
  );
}

function Frame() {
  const { bell, panel } = useBell();
  return <AppFrame bell={bell}><Suspense><AckList /></Suspense>{panel}</AppFrame>;
}

export default function Page() {
  return <Suspense><Frame /></Suspense>;
}
