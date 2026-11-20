"use client";
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

export function PlanBody({ plan, q, onQ, actions, kv }: { plan: Plan; q: number; onQ: (q: number) => void; actions?: ReactNode; kv?: [string, string][] }) {
  const mock = useMock();
  const a = allocOf(plan);
  const sampleOf = (k: number) => quarterCars(mock, planId(plan), k);
  const count = (k: number) => (plan.alloc ? quarterCount(plan, k) : sampleOf(k).length);
  const rows = plan.alloc ? carsIn(a, q).map((i) => carRow(a, i))
    : sampleOf(q).map((c, i) => [c.plate, c.model, c.owner, OIL_JOB_OPTS[SAMPLE_OIL(c.id)], jobCar(c.id)?.lastOil ?? "ไม่มีข้อมูล", (i % 4) + 1 + " รายการ"]);
  const counts = [1, 2, 3, 4].map(count);
  const total = counts.reduce((n, x) => n + x, 0);
  const pairs = (kv ?? planKv(plan)).map(([k, v]): [string, string] => (k === "จำนวนยานพาหนะ" ? [k, total + " คัน"]
    : k === "ยานพาหนะรายไตรมาส" ? [k, counts.map((n, i) => "ไตรมาส " + (i + 1) + ": " + n).join(" · ")] : [k, v]));
  return (
    <>
      <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={pairs} />
      <section className="flex flex-col gap-4">
        <SectionLabel Title={"ยานพาหนะในแผน (" + total + ")"} Actions={actions} />
        <Tabs>{QUARTERS.map((t, i) => <TabItem key={t} Text={t} Badge={counts[i]} Active={q === i + 1} onClick={() => onQ(i + 1)} />)}</Tabs>
        {!rows.length ? <EmptyStateDataEmpty Graphic="vehicle" Text="ยังไม่มียานพาหนะในไตรมาสนี้" />
          : <PagedTable key={q} columns={COLS} rows={rows} />}
      </section>
    </>
  );
}
