"use client";
/* S10 P1 · รายละเอียดแผนเดินทาง (สถานะงานรายคัน) — tripDetail() ใน screens.js · ใช้ร่วม S12 · ใบจ้าง = tripDetail({ trip: HIRE_T }) จอ I.22
   Page header (ชื่อแผนเดินทาง · ป้าย "อนุมัติแล้ว" · Secondary button "ส่งออก" R84) → VehicleAndReporterInfo "รายละเอียดแผนเดินทาง" (tripKv + ความคืบหน้า)
   → Section header "ยานพาหนะในแผนเดินทาง" + Table TRIP_JOB_COLS = ชุดกลาง TRIP_V_COLS (R82) หน่วยงานเป็นบรรทัดรองของทะเบียน + สถานะงาน (Badge · เสร็จสิ้น + ผลน้ำมัน = Multiple badges S12) + ปุ่ม …
   → Section label "อะไหล่ของแผนเดินทาง" (ไม่มีตัวเลขจำนวนชนิด 9 พ.ย. 2569) (R84) · เมนูแก้ไข = popup "แก้ไขยานพาหนะในแผนเดินทาง" มีวันดำเนินการ (R83) · ส่งออก = TripExportPopup
   เมนู "…" ตามสถานะ (กบค.: ยังไม่เริ่ม ดู แก้ไข ลบ · อยู่ระหว่างบำรุงรักษา ดู แก้ไข · อื่นๆ ดู · บทบาทอื่น: ดู อย่างเดียว) · กดแถว = ดูรายละเอียด
   มือถือ: Mobile table รายคัน (ป้ายผลน้ำมันเป็นแถว "ผลตรวจน้ำมัน" ของตัวเอง) + ไอคอนดู แก้ไข ลบ กางบนการ์ด (CLAUDE.md ข้อ 14)
   ใช้หน้าเดียวทั้งแผนตรวจเอง (?trip=T1) และแผนจ้าง (?trip=TV · หน่วยงานปิดงานแทนผู้รับจ้าง เมนูชุดเดียวกัน)
   S23 ผู้รับจ้าง (tripDetail({ vendor }) · R87 · V.1 V.2 V.10 V.22): เมนู "…" ดูรายละเอียดอย่างเดียวทุกสถานะ (VENDOR_MENU · มือถือไอคอนดูอย่างเดียว) ไม่มีแก้ไข ลบ
     · ตัวนับ "ตรวจแล้ว x/y" x = ดำเนินการบำรุงรักษาแล้ว + รอตรวจรับ + เสร็จสิ้น · y = ทั้งหมด − แจ้งบำรุงรักษาไม่ได้ − บำรุงรักษาไม่ได้ (เสนอ ยังไม่เคาะ) · ความคืบหน้าเขียนจำนวนตามชื่อสถานะ
   ?sample=<ชุดตัวอย่าง> (จากหน้า /scenarios/: T1_start … TV_mid) ใส่สถานะงานตามจอ Figma + สลับบทบาท แล้วล้างพารามิเตอร์ · ชื่อที่ไม่รู้จัก (เช่น S23 S11 เดิม) = ข้ามไป */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { MobileTable } from "@/components/vms/MobileTable";
import { MobileTableItem } from "@/components/vms/MobileTableItem";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionHeader } from "@/components/vms/SectionHeader";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { MENU } from "@/lib/mock/data";
import {
  applySample, carOf, getJob, menuCount, OIL_TAG, oilTag, patchTrip, tripCounter, removeTripCar, SAMPLE_ROLE, SAMPLES, tripKv, tripProgress, WSTAT,
  type TripCar,
} from "@/lib/mock/jobs";
import { useSample, type SampleMap } from "@/lib/useSample";
import { unitOf } from "@/lib/mock/data";
import { tripPartRows } from "@/lib/mock/moves";
import { useMock } from "@/lib/mock/store";
import { CREATOR } from "@/lib/mock/trips";
import { tripVCells, tripVCols, workOf, type VCar, type VTrip } from "@/lib/mock/tripCols";
import { TripCarEditModal } from "../../quarter/_shared/TripCarEditModal";
import { TripExportButton, TripExportPopup, TripPartsSection } from "../_lib/TripExport";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { DataTable, jobHref, Section, useCrumbs, useBack, useTripCar } from "../_lib/ui";

const SAMPLE_MAP: SampleMap = Object.fromEntries(SAMPLES.map((n) => [n, { role: SAMPLE_ROLE[n], apply: () => applySample(n) }]));

/* TRIP_JOB_COLS ของ screens.js = tripVCols({ unitSub }) + สถานะงาน (260 = สองป้าย) + ปุ่ม … (Table ของไลบรารี 8 คอลัมน์ · R82) */
const UNIT_SUB = { unitSub: true };
const TRIP_JOB_COLS: TableColumn[] = [...tripVCols(UNIT_SUB), { head: "สถานะงาน", width: 260, Style: "Badge" }, { head: "", width: 72, Style: "Action icons" }];
const vcar = (c: TripCar): VCar => ({ id: c.id, plate: c.plate, model: c.model, owner: c.owner, ctrl: c.ctrl, phone: c.ownerPhone });

export function TripDetail() {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const { s, trip, kbk, vendor } = useTripCar();
  const pending = useSample(SAMPLE_MAP);
  const [menu, setMenu] = useState<{ car: string; anchor: MenuAnchor } | null>(null);
  const mock = useMock();
  const [edit, setEdit] = useState<TripCar | null>(null);
  const [exp, setExp] = useState(false);
  const [del, setDel] = useState<TripCar | null>(null);

  if (pending) return null;
  if (!trip) return <EmptyStateSearchNotFound />;
  const cars = trip.carIds.map((id) => carOf(id)!).filter(Boolean);
  const open = (c: TripCar) => router.push(jobHref(trip, c.id));
  /* รายการเมนูตามสถานะ: ดูรายละเอียด · แก้ไข (ผู้ดูแลยานพาหนะและสถานที่) · ลบ (เอารถออกจากแผนเดินทาง) — แก้ไข ลบ เฉพาะ กบค. */
  const items = (c: TripCar) => {
    const st = getJob(s, trip.id, c.id).status;
    const run = [() => open(c), () => setEdit(c), () => setDel(c)];
    return MENU.slice(0, kbk ? menuCount(st) : 1).map((m, i) => ({ ...m, onClick: run[i] }));
  };
  const status = (c: TripCar) => { const j = getJob(s, trip.id, c.id); const tag = oilTag(j); return { pill: WSTAT[j.status], tag: tag ? OIL_TAG[tag] : undefined }; };
  /* ช่องตามชุดกลาง (R82): เบอร์ติดต่อ = เบอร์ + ชื่อผู้ดูแลยานพาหนะบรรทัดรอง (9 พ.ย. 2569) · วันดำเนินการรายคัน (R83) */
  const vt: VTrip = { d1: trip.d1, d2: trip.d2, works: trip.works, locs: trip.locs, phones: trip.phones, names: trip.names, hire: trip.mode === "hire" };
  const cells = (c: TripCar) => tripVCells(vcar(c), vt, UNIT_SUB);
  const parts = tripPartRows(mock, { planId: trip.planId, quarter: trip.q, carIds: trip.carIds });

  const rows: TableValue[][] = cars.map((c) => {
    const { pill, tag } = status(c);
    return [...cells(c), { pills: tag ? [pill, tag] : [pill] },
      { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setMenu({ car: c.id, anchor: anchorOf(e.currentTarget) }) }] }];
  });
  const menuCar = cars.find((c) => c.id === menu?.car);

  return (
    <>
      <PageHeader Title={trip.name} Badge={["อนุมัติแล้ว", "Success"]} crumbs={crumbs.trip(trip)} onBack={() => back()} Actions={<TripExportButton onClick={() => setExp(true)} />} />
      <VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={[...tripKv(trip), ["ความคืบหน้า", tripProgress(s, trip, vendor)]]} />
      <Section>
        {/* ตัวนับ "ตรวจแล้ว x/y" = Badge outline ใน Section header (R71 · แบบ "รายการยานพาหนะในสัญญา" หน้า 5.1 Rental Contract Management ของ UI Release#2 — Section label ไม่มีช่อง Badge) */}
        <SectionHeader Title="ยานพาหนะในแผนเดินทาง" Badge={tripCounter(s, trip, vendor)} />
        {mob ? (
          <div className="flex flex-col gap-3">
            {cars.map((c) => {
              const { pill, tag } = status(c);
              const cs = cells(c);
              return (
                <MobileTable key={c.id}>
                  {tripVCols(UNIT_SUB).map((col, k) => {
                    const v = cs[k], o = v && typeof v === "object" && "text" in v ? v : null;
                    return <MobileTableItem key={col.head} Style={k === 0 ? "Lead text" : "Text"} Header={col.head} Text={o ? o.text : String(v ?? "")} SupportingText={o?.sub || undefined} />;
                  })}
                  <MobileTableItem Style="Badge" Header="สถานะงาน" Pill={pill} />
                  {tag && <MobileTableItem Style="Badge" Header="ผลตรวจน้ำมัน" Pill={tag} />}
                  <MobileTableItem Style="Action icons" Actions={items(c).map((m) => ({ IconSwap: m.IconSwap, label: m.Text + " " + c.plate, onClick: m.onClick }))} />
                </MobileTable>
              );
            })}
          </div>
        ) : (
          <DataTable cols={TRIP_JOB_COLS} rows={rows} rowKey={(r, i) => cars[i].id} onRow={(i) => open(cars[i])} />
        )}
      </Section>
      <TripPartsSection parts={parts} />
      <RowMenu anchor={menu?.anchor ?? null} items={menuCar ? items(menuCar) : []} onClose={() => setMenu(null)} />
      {/* เมนูแก้ไข = popup "แก้ไขยานพาหนะในแผนเดินทาง · {ทะเบียน}" ผู้ดูแลยานพาหนะ เบอร์ สถานที่ และวันดำเนินการ (R83) */}
      <TripCarEditModal car={edit ? vcar(edit) : null} trip={trip} work={edit ? { d1: trip.d1, d2: trip.d2, value: workOf(vt, edit.id) } : undefined} onCancel={() => setEdit(null)}
        onSave={(o, w) => {
          if (edit) patchTrip(trip.id, (x) => { const works = { ...(x.works ?? {}) }; if (w) works[edit.id] = w; else delete works[edit.id]; return { ...x, ...o, works }; });
          setEdit(null);
        }} />
      <TripExportPopup open={exp} onClose={() => setExp(false)}
        doc={{ name: trip.name, unit: unitOf(trip.planMr), planLabel: trip.planMr + " " + trip.planName, printer: CREATOR, kv: tripKv(trip), cars: cars.map(vcar), trip: vt, parts }} />
      <ConfirmDialog spec={del ? { danger: true, title: "ยืนยันการเอายานพาหนะออกจากแผนเดินทาง", sub: del.plate + " จะถูกเอาออกจากแผนเดินทางนี้ และเลือกเข้าแผนเดินทางใบอื่นของไตรมาสได้อีก", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onOk={() => { if (del) removeTripCar(trip, del.id); setDel(null); }} onCancel={() => setDel(null)} />
    </>
  );
}
