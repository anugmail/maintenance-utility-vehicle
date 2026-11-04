"use client";
/* S22 · หน้า อะไหล่ที่ต้องเบิกรายไตรมาส (/warehouse/detail/?id=Z7000004&q=1) — warehouseScreen() ใน screens.js · เฉพาะบทบาท กบค. คลัง
   Page header · ย้อนกลับ · Breadcrumbs บำรุงรักษาตามวาระ › แผนที่ต้องเตรียมอะไหล่ › ชื่อแผน · Badge outline = สถานะคลัง (Info/Warning → Brand)
   เนื้อหา ช่องไฟ 32: VehicleAndReporterInfo "รายละเอียดแผน" → Section ช่องไฟ 16: Section label "อะไหล่ที่ต้องเบิกรายไตรมาส" · Tabs ไตรมาส (ป้าย = จำนวนแถวอะไหล่)
     · (รับทราบแล้ว) Alert Success · Table WH_PART_COLS (ยอดรวมอะไหล่ที่ กบค. เลือกให้รถของไตรมาส รวมรายการเพิ่มเติม เทียบคงเหลือ) / ไตรมาสไม่มีรถ: Empty state/Data empty
     ปุ่ม ย้อนกลับ · รับทราบไตรมาส n — เฉพาะไตรมาสที่มีแถวและยังไม่รับทราบ → ยืนยัน → toast · กบค. เห็นที่คอลัมน์คลังรับทราบ (S1) และแถบในรายละเอียดแผน */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { Alert } from "@/components/vms/Alert";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Table, type TableColumn } from "@/components/vms/Table";
import { Tabs } from "@/components/vms/Tabs";
import { cx } from "@/lib/cx";
import { QUARTERS } from "@/lib/mock/data";
import { thaiToday } from "@/lib/mock/plan";
import { badgeOf, findPlan, planId, planKv, updatePlan, useRoleGuard, whRows, whStatusOf } from "@/lib/mock/planFlow";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

const LIST = "/warehouse/";
/* WH_PART_COLS */
const COLS: TableColumn[] = [
  { head: "รายการอะไหล่", Style: "Lead text" }, { head: "รหัส", width: 110 }, { head: "จำนวนที่ต้องเบิก", width: 150 },
  { head: "หน่วย", width: 90 }, { head: "คงเหลือในคลัง", width: 140 }, { head: "ไม่พอ", width: 110 },
];

function WarehouseDetail() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(["กบค. คลัง"]);
  const wh = useRole() === "กบค. คลัง";
  const plan = findPlan(useMock().plans, sp.get("id"));
  const [asking, setAsking] = useState(false);
  const gone = ok && !plan;
  useEffect(() => { if (gone) router.replace(LIST); }, [gone, router]);
  if (!ok || !plan) return null;

  const q = Math.min(4, Math.max(1, Number(sp.get("q")) || 1));
  const rows = whRows(plan, q);
  const done = !!plan.ack?.[q];
  const st = whStatusOf(plan);
  const tab = (n: number) => router.replace("/warehouse/detail/?id=" + planId(plan) + "&q=" + n);
  const ack = () => {
    setAsking(false);
    updatePlan(plan.mr, (p) => ({ ...p, ack: { ...(p.ack ?? {}), [q]: thaiToday() } }));
    notify("รับทราบรายการอะไหล่ไตรมาส " + q + " แล้ว");
  };

  return (
    <>
      <PageHeader Title="อะไหล่ที่ต้องเบิกรายไตรมาส" Badge={[st[0], badgeOf(st[1])]} onBack={() => router.push(LIST)}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "แผนที่ต้องเตรียมอะไหล่", href: LIST }, { Text: plan.name }]} />
      <div className="flex flex-col gap-8">
        <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan)} />
        <section className="flex flex-col gap-4">
          <SectionLabel Title="อะไหล่ที่ต้องเบิกรายไตรมาส" />
          <Tabs>{QUARTERS.map((t, i) => <TabItem key={t} Text={t} Badge={whRows(plan, i + 1).length} Active={q === i + 1} onClick={() => tab(i + 1)} />)}</Tabs>
          {done && <Alert Color="Success" Text={"รับทราบไตรมาส " + q + " แล้ว " + plan.ack?.[q]} SupportingText="กบค. เห็นสถานะนี้ในหน้ารายการและหน้ารายละเอียดแผน" />}
          {rows.length
            ? (mob ? <MobileCards columns={COLS} rows={rows} /> : <Table columns={COLS} rows={rows} />)
            : <EmptyStateDataEmpty Text="ไม่มีอะไหล่ที่ต้องเบิก" SupportingText="ไตรมาสนี้ไม่มีรถในแผน ไม่ต้องรับทราบ" />}
        </section>
        {wh && rows.length > 0 && !done && (
          <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => router.push(LIST)} />
            <PrimaryButton Text={"รับทราบไตรมาส " + q} Size="lg" onClick={() => setAsking(true)} />
          </div>
        )}
      </div>
      <ConfirmDialog spec={asking ? { title: "ยืนยันรับทราบรายการอะไหล่ไตรมาส " + q, sub: plan.name + " · " + rows.length + " รายการ · กบค. จะเห็นว่าคลังรับทราบไตรมาสนี้แล้ว", cancel: "ยกเลิก", ok: "รับทราบ" } : null}
        onCancel={() => setAsking(false)} onOk={ack} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><WarehouseDetail /></Suspense></AppFrame>;
}
