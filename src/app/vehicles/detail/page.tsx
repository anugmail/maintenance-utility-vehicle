"use client";
/* S24 W.6–W.8 W.11–W.15 · หน้ารายละเอียดยานพาหนะ (/vehicles/detail/?car=<ทะเบียนไม่มีจังหวัด>&tab=<ชื่อแท็บ>) — maDetail() ใน screens.js
   Figma d6ce03a (R90) + 18a432e: เจ้าของงาน 10 พ.ย. 2569 "อยากให้ออกแบบรายละเอียดรถแต่ละคัน โดยเห็นว่ามีแท็บประวัติการซ่อม เลยอยากให้เพิ่ม tab ประกัน การ overhaul ตารางบำรุงรักษา"
   โครงตาม Vehicle detail หน้า 5.2 Vehicle Management ของ UI Release#2 + DASH รายคันของปลั๊กอิน Overhaul · ดูอย่างเดียว ไม่มีปุ่มแก้ไข (ยกเว้นเครื่องมือกลของ กบค.)
   Page header (ทะเบียน + Pill outline สถานะยานพาหนะ แบบ Page header Page=View ของเฟรม Vehicle info · ย้อนกลับ · Breadcrumbs ยานพาหนะ › ข้อมูลยานพาหนะ › ทะเบียน)
     → Section ช่องไฟ 24: Tabs 5 ช่อง (12 พ.ย. 2569 · BACKLOG ข้อ 85 · เจ้าของงาน _"tab นี้ มีเพิ่ม โดยแบ่ง ประวัติการบำรุงรักษาเครื่องจักร ประวัติการบำรุงรักษาเครื่องยนต์
       ประวัติการซ่อมบำรุงจะแสดงทั้งการซ่อมและบำรุง ตัดtab การรับประกัน เดี๋ยวจะเอาข้อมูลไปใส่ในข้อมูลรถ และ tab overhaul ก็เอาออก ให้เป็นส่วนหนึ่งของประวัติการซ่อมบำรุง
       โดยมีแทกว่าเป็นการ overhaul ถ้าการซ่อมนั้นผ่านการ overhaul มา"_)
     info ข้อมูลยานพาหนะ = แบบ Vehicle info ของ VMS+ (BACKLOG ข้อ 83 · _lib/VehicleInfo.tsx) + เครื่องมือกล (การ์ด ข้อ 84) + การรับประกัน (ย้ายจากแท็บเดิม)
     · schedule ตารางบำรุงรักษา (Section label "กำหนดครั้งถัดไป" 5 รายการ MA_NEXT_COLS + "ประวัติการบำรุงรักษา (n)" MA_HIST_COLS · เมนู … ดูรายละเอียดงานที่ปิดแล้ว · คงเดิม)
     · machine ประวัติการบำรุงรักษาเครื่องจักร = บันทึกบำรุงรักษาตามวาระของ flow นี้ (กระเช้า/ถังฉีดน้ำ: ไส้กรองไฮดรอลิก น้ำมันไฮดรอลิก ไส้กรองอากาศ การตรวจ ปจ.2)
         = มุมมอง "บำรุงรักษาเครื่องจักร" เดิมของแท็บประวัติการซ่อมบำรุง (machineHistoryOf().ma · MA_HIST_COLS)
     · engine ประวัติการบำรุงรักษาเครื่องยนต์ = เช็คระยะของแชสซีที่ศูนย์บริการยี่ห้อ (engineHistoryOf · ค่าสมมติ · ENGINE_COLS)
     · history ประวัติการซ่อมบำรุง = Metric item 2 ใบ (บำรุงรักษาเครื่องจักรล่าสุด · ซ่อมเครื่องจักรล่าสุด) + ตารางรวม ซ่อม + บำรุงรักษา (เครื่องจักร + เครื่องยนต์) + ซ่อมตัวยานพาหนะ
         เรียงวันที่ปิดงานใหม่สุดก่อน (serviceHistoryOf) · คอลัมน์ "ประเภท" Pill outline บำรุงรักษา / ซ่อม + Pill "Overhaul" (Purple) ต่อท้ายเมื่องานนั้นมาจาก Overhaul
     ตัวสลับ 2 มุมมองในแท็บประวัติเดิม (Tabs ซ้อน) เอาออก · แท็บการรับประกัน · Overhaul เอาออก
   ที่อยู่เดิม ?tab=0–4 ยังเปิดได้ (TAB_LEGACY): 0 → info · 1 → schedule · 2 → machine (มี &view=repair → history) · 3 การรับประกัน → info · 4 Overhaul → history
   มือถือ: การ์ด Mobile table (+ ไอคอนดูของบันทึกที่เปิดได้ · กติกาข้อ 14) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TabItem } from "@/components/vms/TabItem";
import { Tabs } from "@/components/vms/Tabs";
import type { TableColumn } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { MENU } from "@/lib/mock/data";
import { NO_HIST } from "@/lib/mock/vehicleHistory";
import { Metrics } from "@/app/parts/_lib/ui";
import { OIL_JOB_OPTS } from "@/lib/mock/jobs";
import {
  MA_CYCLE, MA_DUE, MA_ITEMS, MA_KIND, MA_NO_DATA, MA_NO_SAMPLE, MA_VSTAT, MA_WAR, machineHistoryOf, thaiDate, useMaCars, type MaRecord,
} from "@/lib/mock/maintenance";
import { engineHistoryOf, serviceHistoryOf, type ServiceRow } from "@/lib/mock/vehicleInfo";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { VehicleInfo } from "../_lib/VehicleInfo";
import { TAB_KEYS, TAB_TITLES, tabHref, tabOf, type TabKey } from "../_lib/tabs";
import { LIST_HREF, LIST_TITLE, MaGrid, MaTable, MaCards, VEHICLE_ROOT, useMaAccess, type MaValue } from "../_lib/ui";

const MA_NEXT_COLS: TableColumn[] = [{ head: "รายการ", Style: "Lead text" }, { head: "ครั้งล่าสุด", width: 220 }, { head: "รอบ", width: 220 }, { head: "ครบกำหนด", width: 320 }];
const MA_HIST_COLS: TableColumn[] = [
  { head: "วันที่ปิดงาน", width: 130, Style: "Lead text" }, { head: "เลขที่ MR", width: 140 }, { head: "งานที่ทำ" }, { head: "ไส้กรองอากาศ", width: 130 },
  { head: "น้ำมันไฮดรอลิก", width: 180 }, { head: "การตรวจ ปจ.2", width: 150 }, { head: "ผู้ดำเนินการ", width: 170 }, { head: "", width: 64, Style: "Action icons" },
];
/* ประวัติการซ่อมบำรุง (ซ่อม + บำรุงรักษา · 11 พ.ย. 2569 · 12 พ.ย. 2569 รวมเครื่องยนต์ ซ่อมตัวยานพาหนะ ป้าย Overhaul): หมายเลขงาน (บรรทัดรอง ประเภทการซ่อม / แผน Overhaul / แผนเดินทาง) · วันที่ปิดงาน · ประเภท (Pill) · ศูนย์บริการ · อาการ / รายละเอียด · การรับประกัน · ค่าซ่อม */
const MA_REPAIR_COLS: TableColumn[] = [
  { head: "หมายเลขงาน", width: 160, Style: "Lead text" }, { head: "วันที่ปิดงาน", width: 130 }, { head: "ประเภท", width: 140, Style: "Badge" }, { head: "ศูนย์บริการ", width: 170 },
  { head: "อาการ / รายละเอียด" }, { head: "การรับประกัน", width: 150, Style: "Badge" }, { head: "ค่าซ่อม (บาท)", width: 120 }, { head: "", width: 64, Style: "Action icons" },
];
/* ประวัติการบำรุงรักษาเครื่องยนต์ (ค่าสมมติ engineHistoryOf) */
const ENGINE_COLS: TableColumn[] = [
  { head: "วันที่ปิดงาน", width: 130, Style: "Lead text" }, { head: "เลขที่งาน", width: 150 }, { head: "ศูนย์บริการ", width: 220 }, { head: "งานที่ทำ" },
  { head: "เลขไมล์ (กม.)", width: 130 }, { head: "ค่าใช้จ่าย (บาท)", width: 140 },
];
const OIL_HIST = ["เก็บตัวอย่าง", "เปลี่ยนน้ำมัน", OIL_JOB_OPTS[2]];
const jobHref = (r: MaRecord) => "/trips/job/?trip=" + r.tripId + "&car=" + r.carId;

function MaDetail() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const { ok, owner, unit } = useMaAccess();
  const cars = useMaCars(owner, unit);
  const c = cars.find((x) => x.car.id === sp.get("car"));
  const tab = tabOf(sp.get("tab"), sp.get("view"));
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<{ r: MaRecord; anchor: MenuAnchor } | null>(null);
  /* ไม่พบยานพาหนะ / นอกขอบเขตที่บทบาทเห็น → กลับรายการ */
  useEffect(() => { if (ok && !c) router.replace(LIST_HREF); }, [ok, c, router]);
  if (!ok || !c) return null;

  const car = c.car;
  const go = (t: TabKey) => { setPage(1); setQuery(""); router.replace(tabHref(car.id, t)); };
  const open = (r: MaRecord) => router.push(jobHref(r));
  /* ประวัติการบำรุงรักษา (MA_HIST_COLS) — ใช้ทั้งแท็บตารางบำรุงรักษาและแท็บประวัติการบำรุงรักษาเครื่องจักร */
  const histRows = (records: MaRecord[]): MaValue[][] => records.map((r) => [
    r.date, r.planMr, r.cannot ? { text: r.work, sub: r.cannot } : r.work, r.air ? "เปลี่ยน" : "-",
    r.oil == null ? "-" : { text: OIL_HIST[r.oil], sub: r.oilResult ? "ผลตรวจ " + r.oilResult : undefined }, r.safety ? "บันทึกเอกสารแล้ว" : "-", r.by,
    { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + r.date + " " + r.planMr, onClick: (e) => setMenu({ r, anchor: anchorOf(e.currentTarget) }) }],
      mobileActions: r.fromJob ? [{ IconSwap: MENU[0].IconSwap, label: MENU[0].Text + " " + r.date + " " + r.planMr, onClick: () => open(r) }] : [] },
  ]);
  const grid = (cols: TableColumn[], rows: MaValue[][]) => (mob ? <MaCards cols={cols} rows={rows} /> : <MaTable cols={cols} rows={rows} />);

  const search = (Placeholder: string) => <TableHeader Placeholder={Placeholder} query={query} onQuery={(v) => { setQuery(v); setPage(1); }} />;
  const q = query.trim();
  /* ไม่มีบันทึกเลย = Empty state/Data empty · ค้นไม่พบ = Empty state/Search not found */
  const listOrEmpty = (cols: TableColumn[], rows: MaValue[][], all: number, emptyText: string) => (rows.length ? <MaGrid cols={cols} rows={rows} page={page} onPage={setPage} />
    : all && q ? <EmptyStateSearchNotFound /> : <EmptyStateDataEmpty Text={emptyText} />);
  /* ประวัติการบำรุงรักษาเครื่องจักร — บันทึกการบำรุงรักษาตามวาระ · ค้นหาเลขที่ MR งานที่ทำ */
  const maHistory = (all: MaRecord[]) => {
    const recs = all.filter((r) => !q || [r.planMr, r.work, r.cannot ?? ""].some((t) => t.includes(q)));
    return <>{search("ค้นหาเลขที่ MR, งานที่ทำ")}{listOrEmpty(MA_HIST_COLS, histRows(recs), all.length, MA_NO_DATA)}</>;
  };
  /* ประวัติการซ่อมบำรุง — ซ่อม + บำรุงรักษา (เครื่องจักร เครื่องยนต์) เรียงวันที่ปิดงานใหม่สุดก่อน · ป้ายประเภท + ป้าย Overhaul · ค้นหาหมายเลขงาน อาการ */
  const serviceHistory = (all: ServiceRow[]) => {
    const rows: MaValue[][] = all.filter((h) => !q || [h.no, h.text, h.detail].some((t) => t.includes(q))).map((h) => {
      const r = h.rec?.fromJob ? h.rec : undefined;
      const pills = h.kind === "overhaul" ? [MA_KIND.repair, MA_KIND.overhaul] : [MA_KIND[h.kind]];
      return [h.sub ? { text: h.no, sub: h.sub } : h.no, h.date, { pills }, h.center, h.detail ? { text: h.text, sub: h.detail } : h.text, h.war ? { pills: [MA_WAR[h.war]] } : "-", h.cost,
        { actions: [{ IconSwap: "quick_reference_all-24-300-round", label: "ดูรายละเอียด " + h.no + " " + h.date, onClick: r ? () => open(r) : undefined }],
          mobileActions: r ? [{ IconSwap: MENU[0].IconSwap, label: MENU[0].Text + " " + h.no + " " + h.date, onClick: () => open(r) }] : [] }];
    });
    return <>{search("ค้นหาหมายเลขงาน, อาการ")}{listOrEmpty(MA_REPAIR_COLS, rows, all.length, "ยังไม่มีประวัติการซ่อมบำรุง")}</>;
  };

  let body: React.ReactNode = null;
  if (tab === "info") {
    body = <VehicleInfo c={c} page={page} onPage={setPage} />;
  } else if (tab === "schedule") {
    const next: MaValue[][] = MA_ITEMS.map((t, k) => {
      const it = c.items[k];
      const due: MaValue = !it ? "-" : it.due == null ? { text: k === 3 && c.latest ? MA_NO_SAMPLE : "-" }
        : it.status ? { text: thaiDate(it.due), sub: MA_DUE[it.status][0], tone: MA_DUE[it.status][1] } : { text: thaiDate(it.due) };
      return [t, it?.last ?? "-", MA_CYCLE[k], due];
    });
    const hist = histRows(c.records);
    body = <>
      <section className="flex flex-col gap-4"><SectionLabel Title="กำหนดครั้งถัดไป" />{grid(MA_NEXT_COLS, next)}</section>
      <section className="flex flex-col gap-4">
        <SectionLabel Title={"ประวัติการบำรุงรักษา (" + c.records.length + ")"} />
        {hist.length ? <MaGrid cols={MA_HIST_COLS} rows={hist} page={page} onPage={setPage} /> : <EmptyStateDataEmpty Text={MA_NO_DATA} />}
      </section>
    </>;
  } else if (tab === "machine") {
    body = maHistory(machineHistoryOf(c).ma);
  } else if (tab === "engine") {
    const all = engineHistoryOf(c);
    const recs = all.filter((e) => !q || [e.no, e.work, e.center].some((t) => t.includes(q)));
    body = <>{search("ค้นหาเลขที่งาน, งานที่ทำ")}{listOrEmpty(ENGINE_COLS, recs.map((e) => [e.date, e.no, e.center, e.work, e.km, e.cost]), all.length, "ยังไม่มีประวัติการบำรุงรักษาเครื่องยนต์")}</>;
  } else {
    /* วันล่าสุด 2 ใบ (Metric item · แบบการ์ดตัวเลขของแดชบอร์ด) · ค่าเท่าคอลัมน์ของฟอร์มแผน (vehicleHistory.ts) */
    const h = serviceHistoryOf(c);
    body = <>
      <Metrics items={[["บำรุงรักษาเครื่องจักรล่าสุด", h.lastMa ?? NO_HIST, "Brand"], ["ซ่อมเครื่องจักรล่าสุด", h.lastRepair ?? NO_HIST, "Warning"]]} />
      {serviceHistory(h.rows)}
    </>;
  }

  return (
    <>
      <PageHeader Title={car.plate} Pill={MA_VSTAT[c.vstat]} onBack={() => router.push(LIST_HREF)} crumbs={[{ Text: VEHICLE_ROOT }, { Text: LIST_TITLE, href: LIST_HREF }, { Text: car.plate }]} />
      <section className="flex flex-col gap-6">
        <Tabs>{TAB_KEYS.map((k) => <TabItem key={k} Text={TAB_TITLES[k]} Active={k === tab} onClick={() => go(k)} />)}</Tabs>
        {body}
      </section>
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? [{ ...MENU[0], Disabled: !menu.r.fromJob, onClick: () => open(menu.r) }] : []} onClose={() => setMenu(null)} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><MaDetail /></Suspense></AppFrame>;
}
