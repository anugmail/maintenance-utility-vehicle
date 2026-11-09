"use client";
/* เนื้อหน้ารายละเอียดแผน planBody() ใน screens.js — ใช้ร่วม S2 (ผู้อนุมัติ) · S19 S20 (หน่วยงาน · กบค.) · แถบสถานะคลังรับทราบ (o.wh) ตัดพร้อม S22 6 พ.ย. 2569
   1. VehicleAndReporterInfo "รายละเอียดแผน" (npKv 10 ช่อง · มือถือ = กล่องแสดงข้อมูลแถวละ 2)
   2. Section ช่องไฟ 16: Section label "รถในแผน (n)" · Tabs ไตรมาส 1–4 (ป้ายจำนวนรถ) · (wh) Alert สถานะคลังของไตรมาสที่เปิด · Table รถของไตรมาส ดูอย่างเดียว (CARP_COLS 6 คอลัมน์ ไม่มีไอคอน)
   อะไหล่ในแผน (detail/PlanParts.tsx) วางต่อจาก PlanBody เฉพาะหน้าผู้อนุมัติ S2 และ A.32 กบค. ดูแผนของหน่วยงานอื่น — หน้าของผู้สร้างแผนไม่มี (เจ้าของงาน 9 พ.ย. 2569 · Figma 1c33952 27aae0c)
   actions = ปุ่มใน Section label "รถในแผน" (Primary action Tertiary brand button · Secondary action Tertiary button) — หน้า กบค. ใส่ทางไปไตรมาสที่กำลังทำ
   ไตรมาสที่ไม่มีรถ: ตารางว่าง (spec S2 — ยังไม่เคาะว่าใช้ Empty state ของ S1 หรือไม่) · มือถือ: Mobile table
   แผนตัวอย่างที่ไม่มีรถรายคัน (MR Z7000001 ฯลฯ): ไตรมาสที่กำลังทำ = รถของหน้า "ไตรมาส n" (quarterCars · 10 คันของ S6) ค่าน้ำมัน เปลี่ยนล่าสุด อะไหล่ ตาม planDetailQ() ใน screens.js (5 พ.ย. 2569) */
import type { ReactNode } from "react";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { MobileCards } from "@/components/vms/MobileTable";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Table } from "@/components/vms/Table";
import { Tabs } from "@/components/vms/Tabs";
import { CARP_COLS } from "@/app/new/PlanForm";
import { QUARTERS, type Plan } from "@/lib/mock/data";
import { carOf as jobCar, OIL_JOB_OPTS, SAMPLE_OIL } from "@/lib/mock/jobs";
import { allocOf, carRow, carsIn, planId, planKv, quarterCount } from "@/lib/mock/planFlow";
import { useMock } from "@/lib/mock/store";
import { quarterCars } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";

const COLS = CARP_COLS.slice(0, 6);

export function PlanBody({ plan, q, onQ, actions }: { plan: Plan; q: number; onQ: (q: number) => void; actions?: ReactNode }) {
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const a = allocOf(plan);
  const nowQ = Number(plan.nowQ.replace(/\D/g, "")) || 1;
  const sample = !plan.alloc ? quarterCars(mock, planId(plan), nowQ) : [];   // แผนตัวอย่าง: รถของไตรมาสที่กำลังทำ
  const count = (k: number) => (!plan.alloc && k === nowQ ? sample.length : quarterCount(plan, k));
  const rows = plan.alloc ? carsIn(a, q).map((i) => carRow(a, i))
    : q === nowQ ? sample.map((c, i) => [c.plate, c.model, c.owner, OIL_JOB_OPTS[SAMPLE_OIL(c.id)], jobCar(c.id)?.lastOil ?? "ไม่มีข้อมูล", (i % 4) + 1 + " รายการ"]) : [];   // planDetailQ: TRIP_OIL · lastOil() (5 พ.ย. 2569)
  const total = plan.alloc ? plan.cars : [1, 2, 3, 4].reduce((n, k) => n + count(k), 0);
  return (
    <>
      <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan)} />
      <section className="flex flex-col gap-4">
        <SectionLabel Title={"ยานพาหนะในแผน (" + total + ")"} Actions={actions} />
        <Tabs>{QUARTERS.map((t, i) => <TabItem key={t} Text={t} Badge={count(i + 1)} Active={q === i + 1} onClick={() => onQ(i + 1)} />)}</Tabs>
        {mob ? <MobileCards columns={COLS} rows={rows} /> : <Table columns={COLS} rows={rows} />}
      </section>
    </>
  );
}
