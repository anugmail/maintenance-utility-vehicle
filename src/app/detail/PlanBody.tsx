"use client";
/* เนื้อหน้ารายละเอียดแผน planBody() ใน screens.js — ใช้ร่วม S2 (ผู้อนุมัติ) · S19 S20 S22 (กบค.)
   1. VehicleAndReporterInfo "รายละเอียดแผน" (npKv 10 ช่อง · มือถือ = กล่องแสดงข้อมูลแถวละ 2)
   2. Section ช่องไฟ 16: Section label "รถในแผน (n)" · Tabs ไตรมาส 1–4 (ป้ายจำนวนรถ) · (wh) Alert สถานะคลังของไตรมาสที่เปิด · Table รถของไตรมาส ดูอย่างเดียว (CARP_COLS 6 คอลัมน์ ไม่มีไอคอน)
   ไตรมาสที่ไม่มีรถ: ตารางว่าง (spec S2 — ยังไม่เคาะว่าใช้ Empty state ของ S1 หรือไม่) · มือถือ: Mobile table */
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { Alert } from "@/components/vms/Alert";
import { MobileCards } from "@/components/vms/MobileTable";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Table } from "@/components/vms/Table";
import { Tabs } from "@/components/vms/Tabs";
import { CARP_COLS } from "@/app/new/PlanForm";
import { QUARTERS, type Plan } from "@/lib/mock/data";
import { allocOf, carRow, carsIn, planKv, quarterCount, whQuarters } from "@/lib/mock/planFlow";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS = CARP_COLS.slice(0, 6);

/* แถบสถานะคลังรายไตรมาส (S20 S.6 · S22 U.8) — แผนอนุมัติแล้ว/ดำเนินการ · ไตรมาสที่เปิดมีรถ */
function WarehouseAlert({ plan, q }: { plan: Plan; q: number }) {
  const N = whQuarters(plan).length, ack = plan.ack ?? {}, n = Object.keys(ack).length;
  if (!quarterCount(plan, q)) return null;
  return ack[q]
    ? <Alert Color="Success" Text={"คลังรับทราบรายการอะไหล่ไตรมาส " + q + " แล้ว"} SupportingText={"รับทราบ " + n + " จาก " + N + " ไตรมาส · " + ack[q]} />
    : <Alert Color="Warning" Text={"รอคลังรับทราบรายการอะไหล่ไตรมาส " + q} SupportingText={"รับทราบ " + n + " จาก " + N + " ไตรมาส"} />;
}

export function PlanBody({ plan, q, onQ, wh }: { plan: Plan; q: number; onQ: (q: number) => void; wh?: boolean }) {
  const mob = useBreakpoint() === "Mobile";
  const a = allocOf(plan);
  const rows = carsIn(a, q).map((i) => carRow(a, i));
  return (
    <>
      <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan)} />
      <section className="flex flex-col gap-4">
        <SectionLabel Title={"รถในแผน (" + plan.cars + ")"} />
        <Tabs>{QUARTERS.map((t, i) => <TabItem key={t} Text={t} Badge={quarterCount(plan, i + 1)} Active={q === i + 1} onClick={() => onQ(i + 1)} />)}</Tabs>
        {wh && plan.alloc && <WarehouseAlert plan={plan} q={q} />}
        {mob ? <MobileCards columns={COLS} rows={rows} /> : <Table columns={COLS} rows={rows} />}
      </section>
    </>
  );
}
