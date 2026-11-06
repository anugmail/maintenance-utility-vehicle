"use client";
/* S24 W.7–W.8 · หน้ารายละเอียดรถ แท็บ "ตารางบำรุงรักษา" (/vehicles/detail/?car=<ทะเบียนไม่มีจังหวัด>) — maDetail() ใน screens.js
   ตาม Vehicle detail ของหน้า "Vehicle Management" ใน UI Release#2 (แท็บ ข้อมูลยานพาหนะ · ข้อมูลการเดินทาง · การเติมเชื้อเพลิง · ตารางบำรุงรักษา · ประวัติการซ่อมบำรุง)
   Page header (ทะเบียน · ย้อนกลับ · Breadcrumbs ยานพาหนะ › ข้อมูลยานพาหนะ › ทะเบียน) → Section ช่องไฟ 24: Tabs → VehicleAndReporterInfo "ข้อมูลยานพาหนะ" (6 คู่)
   → Section label "กำหนดครั้งถัดไป" + Table MA_NEXT_COLS (4 รายการ · Safety Inspection เฉพาะรถเครน/รถกระเช้า)
   → Section label "ประวัติการบำรุงรักษา (n)" + Table MA_HIST_COLS (ใหม่สุดก่อน · pagination)
   เมนู "…" ของบันทึก = ดูรายละเอียด → หน้างานรายคันที่ปิดแล้ว /trips/job/?trip=&car= (บันทึกที่มาจากงานรายคันในต้นแบบ) · ประวัติตั้งต้น = Disabled (ไม่มีหน้างาน)
   มือถือ: การ์ด + ไอคอนดูของบันทึกที่เปิดได้ (กติกาข้อ 14) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import type { TableColumn } from "@/components/vms/Table";
import { MENU } from "@/lib/mock/data";
import { MA_CYCLE, MA_DUE, MA_ITEMS, MA_NO_DATA, oilText, useMaCars, type MaRecord } from "@/lib/mock/maintenance";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { LIST_HREF, LIST_TITLE, MaGrid, MaTable, MaCards, VEHICLE_ROOT, useMaAccess, type MaValue } from "../_lib/ui";

const DETAIL_TABS = ["ข้อมูลยานพาหนะ", "ข้อมูลการเดินทาง", "การเติมเชื้อเพลิง", "ตารางบำรุงรักษา", "ประวัติการซ่อมบำรุง"];
const MA_NEXT_COLS: TableColumn[] = [{ head: "รายการ", Style: "Lead text" }, { head: "ครั้งล่าสุด", width: 220 }, { head: "รอบ", width: 220 }, { head: "ครบกำหนด", width: 320 }];
const MA_HIST_COLS: TableColumn[] = [
  { head: "วันที่ปิดงาน", width: 130 }, { head: "แผน", width: 140 }, { head: "งานที่ทำ" }, { head: "เลขไมล์", width: 120 }, { head: "ชั่วโมงเครื่องจักร", width: 140 },
  { head: "น้ำมันไฮโดรลิก", width: 170 }, { head: "ผู้บันทึก", width: 170 }, { head: "", width: 64, Style: "Action icons" },
];
const jobHref = (r: MaRecord) => "/trips/job/?trip=" + r.tripId + "&car=" + r.carId;

function MaDetail() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const { ok, owner } = useMaAccess();
  const cars = useMaCars(owner);
  const c = cars.find((x) => x.car.id === sp.get("car"));
  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState<{ r: MaRecord; anchor: MenuAnchor } | null>(null);
  /* ไม่พบรถ / รถนอกสังกัดของหน่วยงานเจ้าของรถ → กลับรายการ */
  useEffect(() => { if (ok && !c) router.replace(LIST_HREF); }, [ok, c, router]);
  if (!ok || !c) return null;

  const l = c.latest, car = c.car;
  const pairs: [string, string][] = [["ทะเบียน", car.plate], ["ยี่ห้อ/รุ่น", car.model], ["ประเภท", car.type], ["หน่วยงานเจ้าของยานพาหนะ", car.owner],
    ["เลขไมล์สะสม", l?.km ?? "-"], ["ชั่วโมงเครื่องจักรสะสม", l?.hours ?? "-"]];
  const next: MaValue[][] = (l ? c.items : MA_ITEMS.map((_, k) => ({ k, last: "-", dueText: "-", status: undefined }))).map((it) => [
    MA_ITEMS[it.k], it.last, MA_CYCLE[it.k],
    it.status ? { text: it.dueText, sub: MA_DUE[it.status][0], tone: MA_DUE[it.status][1] } : { text: it.dueText },
  ]);
  const view = (r: MaRecord) => router.push(jobHref(r));
  const hist: MaValue[][] = c.records.map((r) => [
    r.date, r.planMr, r.cannot ? { text: r.work, sub: r.cannot } : r.work, r.km ?? "-", r.hours ?? "-",
    r.oil == null ? "-" : { text: oilText(r.oil), sub: r.oilResult ? "ผลตรวจ " + r.oilResult : undefined }, r.by,
    { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + r.date + " " + r.planMr, onClick: (e) => setMenu({ r, anchor: anchorOf(e.currentTarget) }) }],
      mobileActions: r.fromJob ? [{ IconSwap: MENU[0].IconSwap, label: MENU[0].Text + " " + r.date + " " + r.planMr, onClick: () => view(r) }] : [] },
  ]);

  return (
    <>
      <PageHeader Title={car.plate} onBack={() => router.push(LIST_HREF)} crumbs={[{ Text: VEHICLE_ROOT }, { Text: LIST_TITLE, href: LIST_HREF }, { Text: car.plate }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{DETAIL_TABS.map((t, i) => <TabItem key={t} Text={t} Active={i === 3} />)}</Tabs>
        <VehicleAndReporterInfo pairs={pairs} />
        <section className="flex flex-col gap-4">
          <SectionLabel Title="กำหนดครั้งถัดไป" />
          {mob ? <MaCards cols={MA_NEXT_COLS} rows={next} /> : <MaTable cols={MA_NEXT_COLS} rows={next} />}
        </section>
        <section className="flex flex-col gap-4">
          <SectionLabel Title={"ประวัติการบำรุงรักษา (" + c.records.length + ")"} />
          {hist.length ? <MaGrid cols={MA_HIST_COLS} rows={hist} page={page} onPage={setPage} /> : <EmptyStateDataEmpty Text={MA_NO_DATA} />}
        </section>
      </section>
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? [{ ...MENU[0], Disabled: !menu.r.fromJob, onClick: () => view(menu.r) }] : []} onClose={() => setMenu(null)} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><MaDetail /></Suspense></AppFrame>;
}
