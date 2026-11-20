"use client";
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
const TABS: [string, TripStatus][] = [["รออนุมัติ", "review"], ["อนุมัติแล้ว", "approved"], ["ส่งกลับแก้ไข", "returned"]];

function ReviewList() {
  useSeed();
  const router = useRouter();
  const mock = useMock();
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
