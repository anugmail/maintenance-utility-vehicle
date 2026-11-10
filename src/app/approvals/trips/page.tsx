"use client";
/* S7 P1 · อนุมัติแผนเดินทาง (/approvals/trips/ · ทุกบทบาทของต้นแบบ ข้อ 46) — tripReviewList() + roleList() ใน screens.js · spec S7.md (F.1 F.8 F.9 F.10)
   Page header "อนุมัติแผนเดินทาง" (ไม่มีย้อนกลับ) → Section ช่องไฟ 24: Tabs → Table header (ค้นหาชื่อแผนเดินทาง, ผู้สร้าง + ตัวกรอง) + Table (TRIP_REVIEW_COLS) + Table pagination = จำนวนแถว
   แท็บ (R88 · component-rules §5.36 · เจ้าของงาน 10 พ.ย. 2569) = REVIEW_TABS ของ screens.js ตาม `Tabs` + `Tab item` ของไฟล์ Component:
     รออนุมัติ (ตัวเลข = จำนวนใบที่รอ ไม่ขึ้นกับคำค้น) · อนุมัติแล้ว (TRIP_OK) · ส่งกลับแก้ไข (TRIP_RET) ไม่มีตัวเลข
     ส่งกลับแล้ว (F.8) ใบนั้นออกจากแท็บรออนุมัติ ตัวเลขลด ไปอยู่แท็บส่งกลับแก้ไขจนกว่าจะส่งใหม่
   ตัวกรอง: แผงยังไม่ออกแบบ (ไม่เปิดอะไร) */
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { PageHeader } from "@/components/vms/PageHeader";
import { TabItem } from "@/components/vms/TabItem";
import type { TableColumn } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { Tabs } from "@/components/vms/Tabs";
import { mrOf } from "@/lib/mock/closeout";
import { useSeed } from "@/lib/mock/seedB";
import { useMock } from "@/lib/mock/store";
import { CREATOR_SHORT, TST, tripRange, tripsOf, type TripStatus } from "@/lib/mock/trips";
import { DataTable, MENU_HOME, Section, go } from "../../quarter/_shared/ui";

const TRIP_REVIEW_COLS: TableColumn[] = [
  { head: "ชื่อแผนเดินทาง", Style: "Lead text" }, { head: "ช่วงวันเดินทาง", width: 220 }, { head: "ยานพาหนะ (คัน)", width: 100 }, { head: "ผู้สร้าง", width: 180 },
  { head: "วันที่ส่ง", width: 120, SortIcon: "Down" }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 60, Style: "Action icons" },
];
/* REVIEW_TABS — [ข้อความ, สถานะใบในแท็บ] · ตัวเลขเฉพาะแท็บรออนุมัติ */
const TABS: [string, TripStatus][] = [["รออนุมัติ", "review"], ["อนุมัติแล้ว", "approved"], ["ส่งกลับแก้ไข", "returned"]];

function ReviewList() {
  useSeed();
  const router = useRouter();
  const mock = useMock();
  /* ผู้สร้างแผนเดินทาง = ชื่อในใบ (ไม่มีวงเล็บหน่วยงาน) · ใบตัวอย่างของหน่วยงานอื่น (MRZ7000002 กกฟ.2) ไม่ใช่ CREATOR_SHORT */
  const creatorOf = (t: { createdBy?: string }) => t.createdBy?.replace(/ \(.*\)$/, "") ?? CREATOR_SHORT;
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");
  const k = query.trim();
  const all = tripsOf(mock);
  const pending = all.filter((t) => t.status === "review").length;
  const trips = all.filter((t) => t.status === TABS[tab][1] && (!k || t.name.includes(k) || creatorOf(t).includes(k)));
  const rows = trips.map((t) => [{ text: t.name, sub: mrOf(t.planId) + " · ไตรมาส " + t.quarter }, tripRange(t), String(t.carIds.length), creatorOf(t), t.sentAt, { pills: [TST[t.status]] },
    go("เปิด " + t.name, () => router.push("/approvals/trips/detail/?trip=" + t.id))]);
  return (
    <>
      <PageHeader Title="อนุมัติแผนเดินทาง" crumbs={[{ Text: MENU_HOME }]} />
      <Section gap={24}>
        <Tabs>{TABS.map(([t], i) => <TabItem key={t} Text={t} Badge={i === 0 ? pending : null} Active={tab === i} onClick={() => setTab(i)} />)}</Tabs>
        <TableHeader Placeholder="ค้นหาชื่อแผนเดินทาง, ผู้สร้าง" query={query} onQuery={setQuery} />
        <DataTable key={tab} columns={TRIP_REVIEW_COLS} rows={rows} pagination={rows.length} />
      </Section>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><ReviewList /></Suspense></AppFrame>;
}
