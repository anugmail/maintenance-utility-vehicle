"use client";
/* S7 P1 · แผนเดินทางรออนุมัติ (/approvals/trips/ · ผู้อนุมัติ) — roleList() ใน screens.js · spec S7.md (F.1 F.8)
   Page header (ไม่มีย้อนกลับ) → Section ช่องไฟ 24: Table header (ค้นหาชื่อแผนเดินทาง, ผู้สร้าง + ตัวกรอง) + Table (TRIP_REVIEW_COLS) + Table pagination = จำนวนแถว
   แสดงเฉพาะใบที่ส่งมาให้ผู้อนุมัติ (สถานะ รออนุมัติ) · ส่งกลับแล้วหายจากรายการจนกว่าจะส่งใหม่ · ตัวกรอง: แผงยังไม่ออกแบบ (ไม่เปิดอะไร) */
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PageHeader } from "@/components/vms/PageHeader";
import type { TableColumn } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { mrOf } from "@/lib/mock/closeout";
import { useSeed } from "@/lib/mock/seedB";
import { useMock } from "@/lib/mock/store";
import { CREATOR_SHORT, TST, tripRange, tripsOf } from "@/lib/mock/trips";
import { DataTable, MENU_HOME, Section, go } from "../../quarter/_shared/ui";

const TRIP_REVIEW_COLS: TableColumn[] = [
  { head: "ชื่อแผนเดินทาง", Style: "Lead text" }, { head: "ช่วงวันเดินทาง", width: 220 }, { head: "ยานพาหนะ (คัน)", width: 100 }, { head: "ผู้สร้าง", width: 180 },
  { head: "วันที่ส่ง", width: 120, SortIcon: "Down" }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];

function ReviewList() {
  useSeed();
  const router = useRouter();
  const mock = useMock();
  const [query, setQuery] = useState("");
  const k = query.trim();
  const trips = tripsOf(mock).filter((t) => t.status === "review" && (!k || t.name.includes(k) || CREATOR_SHORT.includes(k)));
  const rows = trips.map((t) => [{ text: t.name, sub: mrOf(t.planId) + " · ไตรมาส " + t.quarter }, tripRange(t), String(t.carIds.length), CREATOR_SHORT, t.sentAt, { pills: [TST[t.status]] },
    go("เปิด " + t.name, () => router.push("/approvals/trips/detail/?trip=" + t.id))]);
  return (
    <>
      <PageHeader Title="แผนเดินทางรออนุมัติ" crumbs={[{ Text: MENU_HOME }]} />
      <Section gap={24}>
        <TableHeader Placeholder="ค้นหาชื่อแผนเดินทาง, ผู้สร้าง" query={query} onQuery={setQuery} />
        <DataTable columns={TRIP_REVIEW_COLS} rows={rows} pagination={rows.length} />
      </Section>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><ReviewList /></Suspense></AppFrame>;
}
