"use client";
import { PagedTable } from "@/app/quarter/_shared/ui";
import { useState } from "react";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import { QUARTERS, type Plan } from "@/lib/mock/data";
import { quarterPartRows, sumParts, type QPartRow } from "@/lib/mock/moves";
import { QPART_COLS, qpartRow } from "@/lib/mock/plan";
import { planId } from "@/lib/mock/planFlow";
import { useMock } from "@/lib/mock/store";

export const ALL_Q_LABEL = "รวมทุกไตรมาส";
const byGroup = (rows: QPartRow[]) => rows.map(({ sub: _s, ...r }) => (void _s, r)).sort((a, b) => a.group.localeCompare(b.group, "th"));

export function PlanParts({ plan }: { plan: Plan }) {
  const mock = useMock();
  const [q, setQ] = useState(0);
  const per = [1, 2, 3, 4].map((k) => byGroup(quarterPartRows(mock, planId(plan), k)));
  const all = byGroup(sumParts(per));
  const shown = q ? per[q - 1] : all;
  const rows = shown.map(qpartRow);
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel Title="อะไหล่ในแผน" />
      <Tabs>
        <TabItem Text={ALL_Q_LABEL} Active={q === 0} onClick={() => setQ(0)} />
        {QUARTERS.map((t, i) => <TabItem key={t} Text={t} Active={q === i + 1} onClick={() => setQ(i + 1)} />)}
      </Tabs>
      {!rows.length
        ? <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={q ? "ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" : "แผนนี้ไม่มีอะไหล่ที่ต้องเบิก"} />
        : <PagedTable key={q} columns={QPART_COLS} rows={rows} rowKey={(_, i) => shown[i].key} />}
    </section>
  );
}
