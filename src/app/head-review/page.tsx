"use client";
/* S16 P1 · ประวัติรอตรวจสอบ (/head-review/ · หัวหน้า กบค.) — roleList() + hqRows() ใน screens.js · spec S16.md (O.1)
   Page header (ไม่มีย้อนกลับ) → Section ช่องไฟ 24: Table header (ค้นหาเลขที่ MR, ชื่อแผน + ตัวกรอง) + Table (HQ_COLS) + pagination
   แผนที่ กบค. ส่งประวัติแล้ว (S15) + MR Z6900011 (ผ่านแล้ว ตัวอย่าง) · สถานะ HST: รอหัวหน้าตรวจสอบ · ผ่านแล้ว · ตีกลับ */
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PageHeader } from "@/components/vms/PageHeader";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { HQ_OTHER, HST, SENT_AT, closeoutOf, headStatusOf, planOf } from "@/lib/mock/closeout";
import { useSeed } from "@/lib/mock/seedB";
import { useMock } from "@/lib/mock/store";
import { CREATOR_SHORT } from "@/lib/mock/trips";
import { DataTable, MENU_HOME, Section, go } from "../quarter/_shared/ui";

const HQ_COLS: TableColumn[] = [
  { head: "เลขที่ MR", width: 140, Style: "Lead text" }, { head: "แผน" }, { head: "กบค. ผู้ส่ง", width: 200 }, { head: "จำนวนรถ", width: 110 },
  { head: "วันที่ส่ง", width: 120, SortIcon: "Down" }, { head: "สถานะ", width: 180, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];

function HeadList() {
  useSeed();
  const router = useRouter();
  const mock = useMock();
  const [query, setQuery] = useState("");
  const open = (id: string) => () => router.push("/head-review/detail/?id=" + id);
  const rows: TableValue[][] = [];
  const p = planOf(mock, "Z7000001"), c = closeoutOf(mock, "Z7000001");
  if (p && c.sentAt) rows.push([p.mr, p.name, CREATOR_SHORT, p.cars + " คัน", c.sentAt ?? SENT_AT, { pills: [HST[headStatusOf(p, c)]] }, go("เปิด " + p.mr, open("Z7000001"))]);
  rows.push([HQ_OTHER.mr, HQ_OTHER.plan, HQ_OTHER.sender, HQ_OTHER.cars, HQ_OTHER.sentAt, { pills: [HST.ok] }, go("เปิด " + HQ_OTHER.mr, open(HQ_OTHER.id))]);
  const k = query.trim();
  const shown = k ? rows.filter((r) => String(r[0]).includes(k) || String(r[1]).includes(k)) : rows;
  return (
    <>
      <PageHeader Title="ประวัติรอตรวจสอบ" crumbs={[{ Text: MENU_HOME }]} />
      <Section gap={24}>
        <TableHeader Placeholder="ค้นหาเลขที่ MR, ชื่อแผน" query={query} onQuery={setQuery} />
        <DataTable columns={HQ_COLS} rows={shown} pagination={shown.length} rowKey={(r) => String(r[0])} />
      </Section>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><HeadList /></Suspense></AppFrame>;
}
