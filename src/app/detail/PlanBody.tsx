"use client";
/* เนื้อหน้ารายละเอียดแผน planBody() ใน screens.js — ใช้ร่วม S2 (ผู้อนุมัติ) · S19 S20 (หน่วยงาน · กบค.) · แถบสถานะคลังรับทราบ (o.wh) ตัดพร้อม S22 6 พ.ย. 2569
   1. VehicleAndReporterInfo "รายละเอียดแผน" (npKv 10 ช่อง · มือถือ = กล่องแสดงข้อมูลแถวละ 2)
   2. Section ช่องไฟ 16: Section label "รถในแผน (n)" · Tabs ไตรมาส 1–4 (ป้ายจำนวนรถ) · (wh) Alert สถานะคลังของไตรมาสที่เปิด · Table รถของไตรมาส ดูอย่างเดียว (CARP_COLS 6 คอลัมน์ ไม่มีไอคอน)
   อะไหล่ในแผน (detail/PlanParts.tsx) วางต่อจาก PlanBody ทุกหน้ารายละเอียดแผน — ผู้อนุมัติ S2 · ผู้สร้างแผนทุกสถานะ · A.32 กบค. ดูแผนของหน่วยงานอื่น · E.2 แผนที่ดำเนินการ (เจ้าของงาน 9 พ.ย. 2569 · Figma e3040ff ee5e68c)
   actions = ปุ่มใน Section label "รถในแผน" (Primary action Tertiary brand button · Secondary action Tertiary button) — หน้า กบค. ใส่ทางไปไตรมาสที่กำลังทำ
   ไตรมาสที่ไม่มีรถ: ตารางว่าง (spec S2 — ยังไม่เคาะว่าใช้ Empty state ของ S1 หรือไม่) · มือถือ: Mobile table
   แผนตัวอย่างที่ไม่มีรถรายคัน (MRZ7000001 ฯลฯ): ทุกไตรมาส = รถของหน้า "ไตรมาส n" (quarterCars · SAMPLE_PLAN_Q ของ trips.ts · 9 พ.ย. 2569) ค่าน้ำมัน เปลี่ยนล่าสุด อะไหล่ ตาม planDetailQ() ใน screens.js */
import { PagedTable } from "@/app/quarter/_shared/ui";
import type { ReactNode } from "react";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import { CARP_COLS } from "@/app/new/PlanForm";
import { QUARTERS, type Plan } from "@/lib/mock/data";
import { carOf as jobCar, OIL_JOB_OPTS, SAMPLE_OIL } from "@/lib/mock/jobs";
import { allocOf, carRow, carsIn, planId, planKv, quarterCount } from "@/lib/mock/planFlow";
import { useMock } from "@/lib/mock/store";
import { quarterCars } from "@/lib/mock/trips";

const COLS = CARP_COLS.slice(0, 6);

/* kv = กล่องรายละเอียดแผนแทน npKv (planFlow.planKv) — E.2 planDetailQ ของ screens.js ใช้ PLAN_KV (closeout.planKv: ไตรมาส · วันที่สร้าง · อนุมัติเมื่อ) กับแผนที่ดำเนินการแล้ว */
export function PlanBody({ plan, q, onQ, actions, kv }: { plan: Plan; q: number; onQ: (q: number) => void; actions?: ReactNode; kv?: [string, string][] }) {
  const mock = useMock();
  const a = allocOf(plan);
  /* แผนตัวอย่าง (ไม่มี alloc): ยานพาหนะของทุกไตรมาสจาก quarterCars (SAMPLE_PLAN_Q · ไตรมาสที่กำลังทำของ MRZ7000001 = 10 คันของ S6) + ที่เพิ่ม/เอาออกในหน้าไตรมาส
     ⇒ ป้ายแท็บ = แถวในตาราง = รายไตรมาสในกล่องรายละเอียดแผน · หัวข้อ (n) = จำนวนยานพาหนะ = ผลรวม (9 พ.ย. 2569 เจ้าของงาน "ทำไมเลือกไตรมาส 3 แล้วแสดงไม่รถ")
     ช่องน้ำมัน เปลี่ยนล่าสุด อะไหล่ แบบ planDetailQ ของ screens.js (TRIP_OIL · lastOil() · (i % 4) + 1 รายการ) ทุกไตรมาส */
  const sampleOf = (k: number) => quarterCars(mock, planId(plan), k);
  const count = (k: number) => (plan.alloc ? quarterCount(plan, k) : sampleOf(k).length);
  const rows = plan.alloc ? carsIn(a, q).map((i) => carRow(a, i))
    : sampleOf(q).map((c, i) => [c.plate, c.model, c.owner, OIL_JOB_OPTS[SAMPLE_OIL(c.id)], jobCar(c.id)?.lastOil ?? "ไม่มีข้อมูล", (i % 4) + 1 + " รายการ"]);
  const counts = [1, 2, 3, 4].map(count);
  const total = counts.reduce((n, x) => n + x, 0);
  /* กล่องรายละเอียดแผน: จำนวนยานพาหนะ และยานพาหนะรายไตรมาส ตามยานพาหนะที่แสดงจริง */
  const pairs = (kv ?? planKv(plan)).map(([k, v]): [string, string] => (k === "จำนวนยานพาหนะ" ? [k, total + " คัน"]
    : k === "ยานพาหนะรายไตรมาส" ? [k, counts.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · ")] : [k, v]));
  return (
    <>
      <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={pairs} />
      <section className="flex flex-col gap-4">
        <SectionLabel Title={"ยานพาหนะในแผน (" + total + ")"} Actions={actions} />
        <Tabs>{QUARTERS.map((t, i) => <TabItem key={t} Text={t} Badge={counts[i]} Active={q === i + 1} onClick={() => onQ(i + 1)} />)}</Tabs>
        {/* ไตรมาสที่ไม่มียานพาหนะ = Empty state/Data empty ภาพยานพาหนะ "ยังไม่มียานพาหนะในไตรมาสนี้" (หัวข้อของ noCarsInQ ใน screens.js · หน้านี้ดูอย่างเดียว ⇒ ไม่มีปุ่มเพิ่มและบรรทัดรองที่บอกวิธีจัดในฟอร์ม) */}
        {!rows.length ? <EmptyStateDataEmpty Graphic="vehicle" Text="ยังไม่มียานพาหนะในไตรมาสนี้" />
          : <PagedTable key={q} columns={COLS} rows={rows} />}{/* เกิน 10 คัน = หน้าละ 10 + Table pagination (tblShort f59001e) · เปลี่ยนแท็บกลับหน้า 1 */}
      </section>
    </>
  );
}
