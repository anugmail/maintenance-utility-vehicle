"use client";
/* S8 P1 · แผนเดินทางบำรุงรักษา (/trips-view/ · กรย. · หน่วยงานเจ้าของรถ) — roleList() + bell() + notiPanel() ใน screens.js · spec S8.md (G.1 G.2 G.4)
   Page header (ไม่มีย้อนกลับ) → Section ช่องไฟ 24: Table header (ค้นหาชื่อแผนเดินทาง, ทะเบียน + ตัวกรอง) + Table (TRIP_SEEN_COLS) + pagination
   แสดงแผนเดินทางที่อนุมัติแล้ว · หน่วยงานเจ้าของรถเห็นเฉพาะใบที่มีรถของหน่วยงาน และนับเฉพาะรถของตน · กระดิ่ง + แผงแจ้งเตือน (_shared/Bell) */
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PageHeader } from "@/components/vms/PageHeader";
import type { TableColumn } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { mrOf } from "@/lib/mock/closeout";
import { useSeed } from "@/lib/mock/seedB";
import { useMock } from "@/lib/mock/store";
import { OWN_UNIT, TST, tripCars, tripRange, tripsOf } from "@/lib/mock/trips";
import { DataTable, MENU_HOME, Section, go } from "../quarter/_shared/ui";
import { useBell, useViewer } from "./_shared/Bell";

const TRIP_SEEN_COLS: TableColumn[] = [
  { head: "ชื่อแผนเดินทาง", Style: "Lead text" }, { head: "ช่วงวันเดินทาง", width: 220 }, { head: "ยานพาหนะ (คัน)", width: 100 },
  { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];

function SeenList() {
  useSeed();
  const router = useRouter();
  const mock = useMock();
  const who = useViewer();
  const [query, setQuery] = useState("");
  const k = query.trim();
  const trips = tripsOf(mock).filter((t) => t.status === "approved")
    .map((t) => ({ t, cars: tripCars(t, who === "owner" ? OWN_UNIT : undefined) }))
    .filter(({ t, cars }) => cars.length > 0 && (!k || t.name.includes(k) || cars.some((c) => c.plate.includes(k))));
  const rows = trips.map(({ t, cars }) => [{ text: t.name, sub: mrOf(t.planId) + " · ไตรมาส " + t.quarter }, tripRange(t), String(cars.length), { pills: [TST.approved] },
    go("เปิด " + t.name, () => router.push("/trips-view/detail/?trip=" + t.id))]);
  return (
    <>
      <PageHeader Title="แผนเดินทางบำรุงรักษา" crumbs={[{ Text: MENU_HOME }]} />
      <Section gap={24}>
        <TableHeader Placeholder="ค้นหาชื่อแผนเดินทาง, ทะเบียน" query={query} onQuery={setQuery} />
        <DataTable columns={TRIP_SEEN_COLS} rows={rows} pagination={rows.length} />
      </Section>
    </>
  );
}

function Frame() {
  const { bell, panel } = useBell();
  return <AppFrame bell={bell}><Suspense><SeenList /></Suspense>{panel}</AppFrame>;
}

export default function Page() {
  return <Suspense><Frame /></Suspense>;
}
