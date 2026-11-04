"use client";
/* S10 P1 · รายละเอียดแผนเดินทาง (สถานะงานรายคัน) — tripDetail() ใน screens.js · ใช้ร่วม S11 S12 S23
   Page header (ชื่อแผนเดินทาง · ป้าย "อนุมัติแล้ว") → VehicleAndReporterInfo "รายละเอียดแผนเดินทาง" (tripKv + ความคืบหน้า)
   → Section label "รถในแผนเดินทาง (n)" + Table TRIP_JOB_COLS (สถานะงาน = Badge · เสร็จสิ้น + ผลน้ำมัน = Multiple badges S12)
   เมนู "…" ตามสถานะ (กบค.: ยังไม่เริ่ม ดู แก้ไข ลบ · อยู่ระหว่างบำรุงรักษา ดู แก้ไข · อื่นๆ ดู · ผู้รับจ้าง: ดู อย่างเดียว) · กดแถว = ดูรายละเอียด
   มือถือ: Mobile table รายคัน (ป้ายผลน้ำมันเป็นแถว "ผลตรวจน้ำมัน" ของตัวเอง) + ไอคอนดู แก้ไข ลบ กางบนการ์ด (CLAUDE.md ข้อ 14)
   ?sample=<ชุดตัวอย่าง> (จากหน้า /scenarios/) ใส่สถานะงานตามจอ Figma แล้วล้างพารามิเตอร์ */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { FormModal } from "@/components/patterns/FormModal";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { MobileTable } from "@/components/vms/MobileTable";
import { MobileTableItem } from "@/components/vms/MobileTableItem";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { MENU } from "@/lib/mock/data";
import {
  applySample, carOf, editTripCar, getJob, menuCount, OIL_TAG, oilTag, phoneEdited, removeTripCar, SAMPLES, tripKv, tripLoc, tripPhone, tripProgress, WSTAT,
  type SampleName, type TripCar,
} from "@/lib/mock/jobs";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { DataTable, jobHref, Section, tripCrumbs, useBack, useTripCar } from "../_lib/ui";

const TRIP_JOB_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 190, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "เบอร์ติดต่อ", width: 150 },
  { head: "สถานที่บำรุงรักษา", width: 260 }, { head: "สถานะงาน", width: 320, Style: "Badge" }, { head: "", width: 72, Style: "Action icons" },
];

export function TripDetail() {
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const { s, sp, trip, vendor, kbk } = useTripCar();
  const [menu, setMenu] = useState<{ car: string; anchor: MenuAnchor } | null>(null);
  const [edit, setEdit] = useState<{ car: TripCar; phone: string; loc: string } | null>(null);
  const [del, setDel] = useState<TripCar | null>(null);

  const sample = sp.get("sample");
  useEffect(() => {
    if (!sample || !(SAMPLES as readonly string[]).includes(sample)) return;
    applySample(sample as SampleName);
    router.replace("/trips/detail/?trip=" + (sp.get("trip") ?? ""));
  }, [sample, sp, router]);

  if (!trip) return <EmptyStateSearchNotFound />;
  const cars = trip.carIds.map((id) => carOf(id)!).filter(Boolean);
  const open = (c: TripCar) => router.push(jobHref(trip, c.id));
  /* รายการเมนูตามสถานะ: ดูรายละเอียด · แก้ไข (เบอร์ติดต่อและสถานที่) · ลบ (เอารถออกจากแผนเดินทาง) — แก้ไข ลบ เฉพาะ กบค. */
  const items = (c: TripCar) => {
    const st = getJob(s, trip.id, c.id).status;
    const run = [() => open(c), () => setEdit({ car: c, phone: tripPhone(trip, c), loc: tripLoc(trip, c) }), () => setDel(c)];
    return MENU.slice(0, kbk ? menuCount(st, vendor) : 1).map((m, i) => ({ ...m, onClick: run[i] }));
  };
  const status = (c: TripCar) => { const j = getJob(s, trip.id, c.id); const tag = oilTag(j); return { pill: WSTAT[j.status], tag: tag ? OIL_TAG[tag] : undefined }; };
  const phoneCell = (c: TripCar) => (phoneEdited(trip, c) ? { text: tripPhone(trip, c), sub: "แก้จากเบอร์เจ้าของรถ" } : tripPhone(trip, c));

  const rows: TableValue[][] = cars.map((c) => {
    const { pill, tag } = status(c);
    return [{ text: c.plate, sub: c.owner }, c.model, phoneCell(c), tripLoc(trip, c), { pills: tag ? [pill, tag] : [pill] },
      { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setMenu({ car: c.id, anchor: anchorOf(e.currentTarget) }) }] }];
  });
  const menuCar = cars.find((c) => c.id === menu?.car);

  return (
    <>
      <PageHeader Title={trip.name} Badge={["อนุมัติแล้ว", "Success"]} crumbs={tripCrumbs(trip)} onBack={() => back()} />
      <VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={[...tripKv(trip), ["ความคืบหน้า", tripProgress(s, trip)]]} />
      <Section>
        <SectionLabel Title={"รถในแผนเดินทาง (" + cars.length + ")"} />
        {mob ? (
          <div className="flex flex-col gap-3">
            {cars.map((c) => {
              const { pill, tag } = status(c);
              const p = phoneCell(c);
              return (
                <MobileTable key={c.id}>
                  <MobileTableItem Style="Lead text" Header="ทะเบียน" Text={c.plate} SupportingText={c.owner} />
                  <MobileTableItem Header="ยี่ห้อ/รุ่น" Text={c.model} />
                  <MobileTableItem Header="เบอร์ติดต่อ" Text={typeof p === "string" ? p : p.text} SupportingText={typeof p === "string" ? undefined : p.sub} />
                  <MobileTableItem Header="สถานที่บำรุงรักษา" Text={tripLoc(trip, c)} />
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
      <RowMenu anchor={menu?.anchor ?? null} items={menuCar ? items(menuCar) : []} onClose={() => setMenu(null)} />
      <FormModal open={!!edit} title={"แก้ไขเบอร์ติดต่อและสถานที่ · " + (edit?.car.plate ?? "")}
        fields={edit ? [{ label: "เบอร์ติดต่อ", value: edit.phone }, { label: "สถานที่บำรุงรักษา", value: edit.loc }] : []}
        onField={(i, v) => setEdit((e) => (e ? (i === 0 ? { ...e, phone: v } : { ...e, loc: v }) : e))}
        onOk={() => { if (edit) editTripCar(trip, edit.car, edit.phone, edit.loc); setEdit(null); }} onCancel={() => setEdit(null)} />
      <ConfirmDialog spec={del ? { danger: true, title: "ยืนยันการเอารถออกจากแผนเดินทาง", sub: del.plate + " จะถูกเอาออกจากแผนเดินทางนี้ และเลือกเข้าแผนเดินทางใบอื่นของไตรมาสได้อีก", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onOk={() => { if (del) removeTripCar(trip, del.id); setDel(null); }} onCancel={() => setDel(null)} />
    </>
  );
}
