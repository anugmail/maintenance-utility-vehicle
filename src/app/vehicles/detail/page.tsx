"use client";
/* S24 W.6–W.8 W.11–W.15 · หน้ารายละเอียดยานพาหนะ 5 แท็บ (/vehicles/detail/?car=<ทะเบียนไม่มีจังหวัด>&tab=0–3) — maDetail() ใน screens.js
   Figma d6ce03a (R90) + 18a432e: เจ้าของงาน 10 พ.ย. 2569 "อยากให้ออกแบบรายละเอียดรถแต่ละคัน โดยเห็นว่ามีแท็บประวัติการซ่อม เลยอยากให้เพิ่ม tab ประกัน การ overhaul ตารางบำรุงรักษา"
   โครงตาม Vehicle detail หน้า 5.2 Vehicle Management ของ UI Release#2 + DASH รายคันของปลั๊กอิน Overhaul · ดูอย่างเดียว ไม่มีปุ่มแก้ไข
   Page header (ทะเบียน · ย้อนกลับ · Breadcrumbs ยานพาหนะ › ข้อมูลยานพาหนะ › ทะเบียน) → Section ช่องไฟ 24: Tabs 5 ช่อง
     ข้อมูลยานพาหนะ (11 คู่ · + ปีที่จดทะเบียน อายุการใช้งาน สถานะยานพาหนะ 18a432e)
     · ตารางบำรุงรักษา (Section label "กำหนดครั้งถัดไป" 5 รายการ MA_NEXT_COLS + "ประวัติการบำรุงรักษา (n)" MA_HIST_COLS · เมนู … ดูรายละเอียดงานที่ปิดแล้ว)
     · ประวัติการซ่อมบำรุง (Table header ค้นหา + MA_REPAIR_COLS) · การรับประกัน (MA_WAR_COLS / Empty state ยังไม่มีงานที่อยู่ในประกัน)
     · Overhaul = มีในแถบแต่ไม่มีจอเนื้อหา (เจ้าของงาน 10 พ.ย. 2569 "มี tab แต่ไม่มี display ออกมา") ⇒ กดไม่ได้
   มือถือ: การ์ด Mobile table (+ ไอคอนดูของบันทึกที่เปิดได้ · กติกาข้อ 14) */
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
import { TableHeader } from "@/components/vms/TableHeader";
import { MENU } from "@/lib/mock/data";
import { OIL_JOB_OPTS } from "@/lib/mock/jobs";
import {
  MA_CYCLE, MA_DUE, MA_ITEMS, MA_NO_DATA, MA_NO_SAMPLE, MA_VSTAT, MA_WAR, ageText, repairsOf, thaiDate, useMaCars, warrantyOf, type MaRecord,
} from "@/lib/mock/maintenance";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { LIST_HREF, LIST_TITLE, MaGrid, MaTable, MaCards, VEHICLE_ROOT, detailHref, useMaAccess, type MaValue } from "../_lib/ui";

const MA_VTABS = ["ข้อมูลยานพาหนะ", "ตารางบำรุงรักษา", "ประวัติการซ่อมบำรุง", "การรับประกัน", "Overhaul"];
const MA_NEXT_COLS: TableColumn[] = [{ head: "รายการ", Style: "Lead text" }, { head: "ครั้งล่าสุด", width: 220 }, { head: "รอบ", width: 220 }, { head: "ครบกำหนด", width: 320 }];
const MA_HIST_COLS: TableColumn[] = [
  { head: "วันที่ปิดงาน", width: 130, Style: "Lead text" }, { head: "เลขที่ MR", width: 140 }, { head: "งานที่ทำ" }, { head: "ไส้กรองอากาศ", width: 130 },
  { head: "น้ำมันไฮดรอลิก", width: 180 }, { head: "Safety Inspection", width: 150 }, { head: "ผู้ดำเนินการ", width: 170 }, { head: "", width: 64, Style: "Action icons" },
];
const MA_REPAIR_COLS: TableColumn[] = [
  { head: "หมายเลขงาน", width: 150, Style: "Lead text" }, { head: "วันที่ซ่อมเสร็จ", width: 130 }, { head: "ศูนย์บริการ", width: 170 }, { head: "ประเภทการซ่อม", width: 160 },
  { head: "อาการ / รายละเอียดการซ่อม" }, { head: "การรับประกัน", width: 170, Style: "Badge" }, { head: "ค่าซ่อม (บาท)", width: 120 }, { head: "", width: 64, Style: "Action icons" },
];
const MA_WAR_COLS: TableColumn[] = [
  { head: "ประเภทงาน", width: 140, Style: "Lead text" }, { head: "เลขที่งาน / PO", width: 150 }, { head: "ผู้รับจ้าง" }, { head: "รายการที่รับประกัน", width: 220 },
  { head: "วันเริ่ม", width: 120 }, { head: "วันหมดอายุ", width: 170 }, { head: "สถานะ", width: 150, Style: "Badge" },
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
  const tab = Math.min(3, Math.max(0, Number(sp.get("tab") ?? 0) || 0));
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<{ r: MaRecord; anchor: MenuAnchor } | null>(null);
  /* ไม่พบยานพาหนะ / นอกขอบเขตที่บทบาทเห็น → กลับรายการ */
  useEffect(() => { if (ok && !c) router.replace(LIST_HREF); }, [ok, c, router]);
  if (!ok || !c) return null;

  const car = c.car;
  const go = (t: number) => { setPage(1); router.replace(detailHref(car.id, t)); };
  const view = (r: MaRecord) => router.push(jobHref(r));
  const grid = (cols: TableColumn[], rows: MaValue[][]) => (mob ? <MaCards cols={cols} rows={rows} /> : <MaTable cols={cols} rows={rows} />);

  let body: React.ReactNode = null;
  if (tab === 0) {
    body = <VehicleAndReporterInfo pairs={[["ทะเบียน", car.plate], ["ยี่ห้อ/รุ่น", car.model], ["ประเภทยานพาหนะ", car.type], ["หน่วยงานเจ้าของยานพาหนะ", car.owner],
      ["ผู้ดูแลยานพาหนะ", car.ctrl || "-"], ["เบอร์ติดต่อ", car.ownerPhone || "-"], ["ปีที่จดทะเบียน", c.year ? String(c.year) : "-"], ["อายุการใช้งาน", ageText(c)],
      ["เลขไมล์สะสม", c.km ? c.km + " กม." : "-"], ["ชั่วโมงเครื่องจักรสะสม", c.hours ? c.hours + " ชม." : "-"], ["สถานะยานพาหนะ", MA_VSTAT[c.vstat][0]]]} />;
  } else if (tab === 1) {
    const next: MaValue[][] = MA_ITEMS.map((t, k) => {
      const it = c.items[k];
      const due: MaValue = !it ? "-" : it.due == null ? { text: k === 3 && c.latest ? MA_NO_SAMPLE : "-" }
        : it.status ? { text: thaiDate(it.due), sub: MA_DUE[it.status][0], tone: MA_DUE[it.status][1] } : { text: thaiDate(it.due) };
      return [t, it?.last ?? "-", MA_CYCLE[k], due];
    });
    const hist: MaValue[][] = c.records.map((r) => [
      r.date, r.planMr, r.cannot ? { text: r.work, sub: r.cannot } : r.work, r.air ? "เปลี่ยน" : "-",
      r.oil == null ? "-" : { text: OIL_HIST[r.oil], sub: r.oilResult ? "ผลตรวจ " + r.oilResult : undefined }, r.safety ? "บันทึกเอกสารแล้ว" : "-", r.by,
      { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + r.date + " " + r.planMr, onClick: (e) => setMenu({ r, anchor: anchorOf(e.currentTarget) }) }],
        mobileActions: r.fromJob ? [{ IconSwap: MENU[0].IconSwap, label: MENU[0].Text + " " + r.date + " " + r.planMr, onClick: () => view(r) }] : [] },
    ]);
    body = <>
      <section className="flex flex-col gap-4"><SectionLabel Title="กำหนดครั้งถัดไป" />{grid(MA_NEXT_COLS, next)}</section>
      <section className="flex flex-col gap-4">
        <SectionLabel Title={"ประวัติการบำรุงรักษา (" + c.records.length + ")"} />
        {hist.length ? <MaGrid cols={MA_HIST_COLS} rows={hist} page={page} onPage={setPage} /> : <EmptyStateDataEmpty Text={MA_NO_DATA} />}
      </section>
    </>;
  } else if (tab === 2) {
    const q = query.trim();
    const jobOf = (no: string) => c.records.find((r) => r.fromJob && r.planMr === no);
    const rows: MaValue[][] = repairsOf(c).filter((h) => !q || [h[0], h[5], h[6]].some((s) => s.includes(q))).map((h) => {
      const j = jobOf(h[0]);
      return [h[0], h[1], h[2], h[4] ? { text: h[3], sub: h[4] } : h[3], { text: h[5], sub: h[6] }, { pills: [MA_WAR[h[7]]] }, h[8],
        { actions: [{ IconSwap: "quick_reference_all-24-300-round", label: "ดูรายละเอียด " + h[0], onClick: j ? () => view(j) : undefined }] }];
    });
    body = <>
      <TableHeader Placeholder="ค้นหาหมายเลขงาน, อาการ" query={query} onQuery={(v) => { setQuery(v); setPage(1); }} />
      <MaGrid cols={MA_REPAIR_COLS} rows={rows} page={page} onPage={setPage} />
    </>;
  } else {
    const w = warrantyOf(c);
    body = w.length
      ? <MaGrid cols={MA_WAR_COLS} rows={w.map((x) => [x[0], x[1], x[2], x[3], x[4], x[6] ? { text: x[5], sub: x[6] } : x[5], { pills: [MA_WAR[x[7]]] }])} page={page} onPage={setPage} />
      : <EmptyStateDataEmpty Text="ยังไม่มีงานที่อยู่ในประกัน" SupportingText="เมื่อปิดงานซ่อม Overhaul หรือบำรุงรักษาแผนจ้างที่มีประกันของผู้รับจ้าง รายการจะมาอยู่ที่นี่" />;
  }

  return (
    <>
      <PageHeader Title={car.plate} onBack={() => router.push(LIST_HREF)} crumbs={[{ Text: VEHICLE_ROOT }, { Text: LIST_TITLE, href: LIST_HREF }, { Text: car.plate }]} />
      <section className="flex flex-col gap-6">
        {/* แท็บ Overhaul (ลำดับ 4) มีในแถบ ไม่มีจอเนื้อหา ⇒ ไม่ส่ง onClick */}
        <Tabs>{MA_VTABS.map((t, i) => <TabItem key={t} Text={t} Active={i === tab} onClick={i < 4 ? () => go(i) : undefined} />)}</Tabs>
        {body}
      </section>
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? [{ ...MENU[0], Disabled: !menu.r.fromJob, onClick: () => view(menu.r) }] : []} onClose={() => setMenu(null)} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><MaDetail /></Suspense></AppFrame>;
}
