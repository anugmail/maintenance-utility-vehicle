"use client";
/* S10 P2 · งานรายคัน ยังไม่เริ่ม / อยู่ระหว่างบำรุงรักษา — jobPage() ใน screens.js (มุมผู้รับจ้าง jobPage({vendor}) ของ S23 ใช้ไฟล์เดียวกัน)
   Page header (ทะเบียน · ป้ายสถานะงาน · ปุ่ม "บำรุงรักษาไม่ได้" + "เริ่มงาน"/"ปิดงาน")
   → VehicleAndReporterInfo "ข้อมูลยานพาหนะ" (6) · "การนัดหมาย" (+ เริ่มงาน ผู้เริ่มงาน เมื่ออยู่ระหว่างบำรุงรักษา)
   → (อยู่ระหว่างบำรุงรักษา) IncidentPhotoGallery "ภาพก่อนเริ่มงาน (n)" (ผู้รับจ้าง: File upload แก้ไขได้) · Section header "น้ำมันไฮโดรลิก" + Radio text card 3 ใบ + เปลี่ยนน้ำมันครั้งล่าสุด
   → Section label "รายการงานและอะไหล่ตามแผน (n)" + Secondary button "เพิ่มอะไหล่" + Table JOB_COLS (ไอคอนแก้ไข → popup แก้ไขอะไหล่ · ลบ → ยืนยันเอาอะไหล่ออก · เพิ่ม → popup เพิ่มอะไหล่ที่ใช้จริง — BACKLOG ข้อ 4)
     ผู้รับจ้างเริ่มงานแล้ว (S23 V.4 V.5): ภาพก่อนเริ่มงานเป็น File upload (BeforePhotos) · ไอคอนแก้ไข = popup แก้ไขอะไหล่ · "เพิ่มอะไหล่" = popup เพิ่มอะไหล่ที่ใช้จริง
     (เก็บเป็นร่างของหน้าปิดงาน — lib/mock/hire.ts hireRows)
   popup "บำรุงรักษาไม่ได้ · <ทะเบียน>" (cannotModal) → ยืนยัน → กลับหน้ารายละเอียดแผนเดินทาง + toast "บันทึกบำรุงรักษาไม่ได้แล้ว" */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import { hireAddPart, hireDeletePart, hireEditUsed, hireWork } from "@/lib/mock/hire";
import {
  cannotJob, jobWork, ODOMETER, OIL_DEFAULT, patchJob, thaiNow, tripLoc, tripPhone, tripRange, WORK, WSTAT, JOB_TIMES,
  type Job, type JobTrip, type PlanPart, type TripCar,
} from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { badgeOf, BeforePhotos, CannotPopup, DataTable, useCrumbs, jobHref, LastOil, OilCards, PartAddModal, PartEditModal, Section, tripHref, useBack } from "../_lib/ui";

const JOB_COLS: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ตามแผน", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "หน่วย", width: 110 }, { head: "", width: 104, Style: "Action icons" }];

/* กล่อง "ข้อมูลยานพาหนะ" (6 คู่) — เลขไมล์/ชั่วโมงเครื่องจักรสะสมเป็นค่าคงที่ของจอ Figma (ตรวจเอง / จ้าง) */
export const vehiclePairs = (t: JobTrip, c: TripCar): [string, string][] => {
  const [km, hr] = t.mode === "hire" ? ODOMETER.hire : ODOMETER.self;
  return [["ทะเบียน", c.plate], ["ยี่ห้อ/รุ่น", c.model], ["ประเภท", c.type], ["หน่วยงานเจ้าของรถ", c.owner], ["เลขไมล์สะสม", km], ["ชั่วโมงเครื่องจักรสะสม", hr]];
};
/* กล่อง "การนัดหมาย" — ตรวจเอง: แผนเดินทาง ช่วงวันเดินทาง · จ้าง: แผนเดินทาง ผู้รับจ้าง ช่วงวันทำงาน · + สถานที่ เบอร์ (+ เริ่มงาน ผู้เริ่มงาน) */
export const appointmentPairs = (t: JobTrip, c: TripCar, j?: Job): [string, string][] => [
  ...((t.mode === "hire" ? [["แผนเดินทาง", t.name], ["ผู้รับจ้าง", t.vendor ?? "-"], ["ช่วงวันทำงาน", tripRange(t)]] : [["แผนเดินทาง", t.name], ["ช่วงวันเดินทาง", tripRange(t)]]) as [string, string][]),
  ["สถานที่บำรุงรักษา", tripLoc(t, c)], ["เบอร์ติดต่อ", tripPhone(t, c)],
  ...((j?.status === "doing" ? [["เริ่มงาน", j.startedAt ?? "-"], ["ผู้เริ่มงาน", j.startedBy ?? "-"]] : []) as [string, string][]),
];
/* ใช้ไปแล้วตอนแจ้งบำรุงรักษาไม่ได้ระหว่างบำรุงรักษา — ตัวอย่างจอ I.16 (CANNOT_USED: น้ำมัน 30 ไส้กรองไฮโดรลิก 2) · ยังไม่เริ่ม = 0 */
const usedWhileDoing = (parts: PlanPart[]) => parts.map((p) => (p.part === WORK[0].part ? 30 : p.part === WORK[1].part ? 2 : 0));

export function JobPage({ trip, car, job, actor, vendor, kbk }: { trip: JobTrip; car: TripCar; job: Job; actor: boolean; vendor: boolean; kbk: boolean }) {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const doing = job.status === "doing" || (job.status === "returned" && !!job.startedAt && !job.closedAt);
  const [cannot, setCannot] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState(false);
  const [del, setDel] = useState<{ part: string; k: number } | null>(null);
  const [editK, setEditK] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);

  /* อะไหล่ตามแผน: กบค. เพิ่ม แก้ไข ลบ ได้ตอนยังไม่เริ่ม/อยู่ระหว่างบำรุงรักษา · ผู้รับจ้าง ยังไม่เริ่ม = ดูอย่างเดียว · เริ่มแล้วแก้ได้ (S23) */
  const editParts = actor && (kbk || doing);
  const oil = job.oilChoice ?? OIL_DEFAULT;
  /* แก้ไข = popup แก้ไขอะไหล่ (partEditModal) · เพิ่ม = popup เพิ่มอะไหล่ที่ใช้จริง (partAddModal) · ลบ = ยืนยันการเอาอะไหล่ออก (PART_DEL_CONFIRM)
     ทั้ง กบค. และผู้รับจ้าง — ค่าที่แก้เก็บเป็นร่างของหน้าปิดงาน (lib/mock/hire.ts hireRows) ⇒ เป็นค่าตั้งต้นของตาราง "รายการสภาพวัสดุอะไหล่" ตอนปิดงาน (BACKLOG ข้อ 4) */
  const work = editParts ? hireWork(job) : jobWork(job.parts, doing ? oil : 1).map((p) => ({ ...p, usedQty: p.planQty, k: job.parts.indexOf(p) }));
  const cols = editParts ? JOB_COLS : JOB_COLS.slice(0, 4);
  const rows = work.map((w) => {
    const r = [w.task, w.part, String(w.planQty), w.unit];
    const acts = [
      { IconSwap: "stylus-24-300-round", label: "แก้ไข " + w.part, onClick: () => setEditK(w.k) },
      { IconSwap: "delete-24-300-round", label: "ลบ " + w.part, onClick: () => setDel({ part: w.part, k: w.k }) },
    ];
    return editParts ? [...r, { actions: acts, mobileActions: acts }] : r;
  });
  const editItem = editK == null ? null : work.find((w) => w.k === editK) ?? null;
  const used = doing ? usedWhileDoing(job.parts) : null;
  const confirmCannot = () => {
    if (!reason.trim()) { setErr(true); return; }
    cannotJob(trip, car.id, reason.trim(), used ?? job.parts.map(() => 0), vendor, trip.mode === "hire" ? JOB_TIMES.hire.reported : thaiNow());
    setCannot(false);
    notify("บันทึกบำรุงรักษาไม่ได้แล้ว");
    router.push(tripHref(trip));
  };
  const size = mob ? "lg" : "md";
  const actions = actor ? <>
    <SecondaryButton Text="บำรุงรักษาไม่ได้" Size={size} onClick={() => { setReason(""); setErr(false); setCannot(true); }} />
    {doing
      ? <PrimaryButton Text="ปิดงาน" Size={size} onClick={() => router.push(jobHref(trip, car.id, "close/"))} />
      : <PrimaryButton Text="เริ่มงาน" Size={size} onClick={() => router.push(jobHref(trip, car.id, "receive/"))} />}
  </> : undefined;
  const photos = job.photos ?? [];

  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} Actions={actions} />
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={vehiclePairs(trip, car)} />
      <VehicleAndReporterInfo Title="การนัดหมาย" pairs={appointmentPairs(trip, car, job)} />
      {doing && (vendor && actor
        ? <BeforePhotos trip={trip} car={car} photos={photos} />
        : <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + photos.length + ")"} photos={photos.map((p) => ({ alt: p.name }))} />)}
      {doing && (
        <Section>
          <SectionHeader Title="น้ำมันไฮโดรลิก" />
          <OilCards value={oil} Disabled={!actor} onChange={(k) => patchJob(trip.id, car.id, (j) => ({ ...j, oilChoice: k, close: j.close && { ...j.close, oilChoice: k } }))} />
          <LastOil car={car} />
        </Section>
      )}
      <Section>
        <SectionLabel Title={"รายการงานและอะไหล่ตามแผน (" + work.length + ")"}
          Actions={editParts ? <SecondaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" Size={size} onClick={() => setAdding(true)} /> : undefined} />
        <DataTable cols={cols} rows={rows} />
      </Section>
      <CannotPopup open={cannot} car={car} parts={job.parts} used={used} reason={reason} error={err}
        onReason={(v) => { setReason(v); if (v.trim()) setErr(false); }} onOk={confirmCannot} onCancel={() => setCannot(false)} />
      <ConfirmDialog spec={del ? { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: del.part + " จะถูกเอาออกจากรถคันนี้", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onOk={() => { if (del) hireDeletePart(trip, car, del.k); setDel(null); }} onCancel={() => setDel(null)} />
      <PartEditModal item={editItem && { ...editItem, used: editItem.usedQty }} onCancel={() => setEditK(null)}
        onSave={(v) => { if (editItem) hireEditUsed(trip, car, editItem.k, v.used); setEditK(null); }} />
      <PartAddModal open={adding} onCancel={() => setAdding(false)} onAdd={(p) => { hireAddPart(trip, car, p); setAdding(false); }} />
    </>
  );
}
