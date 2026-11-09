"use client";
/* อะไหล่ในแผน — planPartsSec() ใน planBody ของ screens.js (S2 6 พ.ย. 2569 · 9 พ.ย. 2569 เจ้าของงาน "อยากให้มี tab รวมทุกไตรมาส และแยกไตรมาส ทั้งก่อนอนุมัติ และ ผู้อนุมัติ")
   ใช้ทุกหน้ารายละเอียดแผน (planBody ของ screens.js แสดง planPartsSec เสมอ · Figma e3040ff ee5e68c): หน้าตรวจสอบของผู้อนุมัติ (S2) · หน้ารายละเอียดของผู้สร้างแผนทุกสถานะ (A.20–A.22 · S19 · S20)
   · กบค. ดูแผนของหน่วยงานอื่น (A.32) · แผนที่ดำเนินการ (E.2) — เจ้าของงาน 9 พ.ย. 2569 ส่งภาพ 4 จอ "ทำให้เป็นแบบนี้" + "หน้าอื่นที่ต้องมีอะใหล่รวม หรืออะใหล่แต่ละไตรมาส ก็ต้องมี section อะใหล่ด้วยนะ"
   Section label "อะไหล่ในแผน" + Tabs 5 ช่อง (ของไลบรารีพอดี): "รวมทุกไตรมาส" (แท็บแรก เปิดเป็นค่าเริ่มต้น · ยอด = ผลรวมไตรมาส 1–4) + ไตรมาส 1–4 · ไม่มีป้ายตัวเลขบนแท็บ (9 พ.ย. 2569)
   Table QPART_COLS (R81) ดูอย่างเดียว เรียงตามประเภท · คันที่ไม่เบิกอะไหล่ไม่นับ · ยอดรายไตรมาส = quarterPartRows (ชุดเดียวกับหัวข้ออะไหล่ในไตรมาส n ของหน้าไตรมาส · แผนตัวอย่างใช้ยอดรายคันสมมติ)
   ว่าง: แท็บรวม = "ยังไม่มีรายการอะไหล่" / "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะในแท็บไตรมาส รายการจะรวมมาที่นี่" · แท็บไตรมาส = "ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" · มือถือ Mobile table */
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
  const [q, setQ] = useState(0);   // 0 = รวมทุกไตรมาส (ค่าเริ่มต้น)
  const per = [1, 2, 3, 4].map((k) => byGroup(quarterPartRows(mock, planId(plan), k)));
  const all = byGroup(sumParts(per));
  const shown = q ? per[q - 1] : all;
  const rows = shown.map(qpartRow);
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel Title="อะไหล่ในแผน" />
      <Tabs>
        {/* 9 พ.ย. 2569 เจ้าของงาน "เอาเลขออกไปเลยได้ป่ะ ถ้าหมายถึงจำนวนชนิด" ⇒ หัวข้ออะไหล่รวมตามรายการไม่มีตัวเลขจำนวนชนิด (tabs ส่ง null = ไม่มี Pill) */}
        <TabItem Text={ALL_Q_LABEL} Active={q === 0} onClick={() => setQ(0)} />
        {QUARTERS.map((t, i) => <TabItem key={t} Text={t} Active={q === i + 1} onClick={() => setQ(i + 1)} />)}
      </Tabs>
      {!rows.length
        ? <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={q ? "ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" : "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะในแท็บไตรมาส รายการจะรวมมาที่นี่"} />
        : <PagedTable key={q} columns={QPART_COLS} rows={rows} rowKey={(_, i) => shown[i].key} />}{/* เกิน 10 รายการ = หน้าละ 10 + Table pagination (tblShort f59001e) */}
    </section>
  );
}
