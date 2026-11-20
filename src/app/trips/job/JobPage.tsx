"use client";
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
import {
  addJobPart, cannotJob, deleteJobPart, editPartUsed, ODOMETER, OIL_DEFAULT, patchJob, plannedOil, startJob, thaiNow, tripCtrl, tripLoc, tripPhone, tripRange, WORK, workShown, WSTAT,
  type Job, type JobTrip, type PlanPart, type TripCar,
} from "@/lib/mock/jobs";
import { notify, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { tripWork } from "@/lib/mock/tripCols";
import { badgeOf, CannotPopup, DataTable, DateTimeModal, useCrumbs, jobHref, LastOil, OilCards, PartAddModal, PartEditModal, Section, tripHref, useBack } from "../_lib/ui";

const JOB_COLS: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ตามแผน", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "หน่วย", width: 110 }, { head: "", width: 104, Style: "Action icons" }];

export const vehiclePairs = (t: JobTrip, c: TripCar): [string, string][] => {
  const [km, hr] = ODOMETER;
  return [["ทะเบียน", c.plate], ["ยี่ห้อ/รุ่น", c.model], ["ประเภท", c.type], ["หน่วยงานเจ้าของยานพาหนะ", c.owner], ["เลขไมล์สะสม", km], ["ชั่วโมงเครื่องจักรสะสม", hr]];
};
export const appointmentPairs = (t: JobTrip, c: TripCar, j?: Job): [string, string][] => [
  ...((t.mode === "hire" ? [["แผนเดินทาง", t.name], ["ผู้รับจ้าง", t.vendor ?? "-"], ["ช่วงวันทำงาน", tripRange(t)]] : [["แผนเดินทาง", t.name], ["ช่วงวันเดินทาง", tripRange(t)]]) as [string, string][]),
  ["วันดำเนินการ", tripWork({ d1: t.d1, d2: t.d2, works: t.works }, c.id)],
  ["สถานที่บำรุงรักษา", tripLoc(t, c)], ["เบอร์ติดต่อ", tripPhone(t, c)], ["ผู้ดูแลยานพาหนะ", tripCtrl(t, c)],
  ...((j?.status === "doing" ? [["เริ่มงาน", j.startedAt ?? "-"], ["ผู้เริ่มงาน", j.startedBy ?? "-"]] : []) as [string, string][]),
];
const usedWhileDoing = (parts: PlanPart[]) => parts.map((p) => (p.part === WORK[0].part ? 30 : p.part === WORK[1].part ? 2 : 0));

export function JobPage({ trip, car, job, actor, vendor = false }: { trip: JobTrip; car: TripCar; job: Job; actor: boolean; vendor?: boolean }) {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const doing = job.status === "doing";
  const [cannot, setCannot] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState(false);
  const [del, setDel] = useState<{ part: string; k: number } | null>(null);
  const [editK, setEditK] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [starting, setStarting] = useState(false);

  const editParts = actor && !vendor;
  const oil = job.oilChoice ?? OIL_DEFAULT;
  const planned = plannedOil(useMock().plans, trip.planId, car.id);
  const work = editParts ? workShown(doing ? job : { ...job, oilChoice: job.oilChoice ?? planned }) : workShown({ ...job, close: undefined, oilChoice: doing ? oil : planned });
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
    cannotJob(trip, car.id, reason.trim(), used ?? job.parts.map(() => 0), thaiNow(), vendor);
    setCannot(false);
    notify("บันทึกบำรุงรักษาไม่ได้แล้ว");
    router.push(tripHref(trip));
  };
  const size = mob ? "lg" : "md";
  const actions = actor ? <>
    <SecondaryButton Text="บำรุงรักษาไม่ได้" Size={size} onClick={() => { setReason(""); setErr(false); setCannot(true); }} />
    {doing
      ? <PrimaryButton Text="ปิดงาน" Size={size} onClick={() => router.push(jobHref(trip, car.id, "close/"))} />
      : <PrimaryButton Text="เริ่มงาน" Size={size} onClick={() => setStarting(true)} />}
  </> : undefined;
  const photos = job.photos ?? [];

  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} Pill={job.status === "doing" ? WSTAT.doing : undefined} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} Actions={actions} />
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={vehiclePairs(trip, car)} />
      <VehicleAndReporterInfo Title="การนัดหมาย" pairs={appointmentPairs(trip, car, job)} />
      {doing && <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + photos.length + ")"} photos={photos.map((p) => ({ alt: p.name }))} />}
      {doing && (
        <Section>
          <SectionHeader Title="น้ำมันไฮดรอลิก" />
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
      <ConfirmDialog spec={del ? { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: del.part + " จะถูกเอาออกจากยานพาหนะคันนี้", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onOk={() => { if (del) deleteJobPart(trip, car, del.k); setDel(null); }} onCancel={() => setDel(null)} />
      <PartEditModal item={editItem && { ...editItem, used: editItem.usedQty }} onCancel={() => setEditK(null)}
        onSave={(v) => { if (editItem) editPartUsed(trip, car, editItem.k, v.used); setEditK(null); }} />
      <PartAddModal open={adding} onCancel={() => setAdding(false)} onAdd={(p) => { addJobPart(trip, car, p); setAdding(false); }} />
      <DateTimeModal open={starting} title={"เริ่มงาน · " + car.plate} sub="ระบุวันและเวลาที่เริ่มงานบำรุงรักษาของยานพาหนะคันนี้ แก้ไขได้ที่ขั้นตรวจสภาพก่อนบำรุงรักษา" label="เริ่มงาน"
        value={thaiNow()} ok="เริ่มงาน" onCancel={() => setStarting(false)}
        onOk={(at) => { setStarting(false); startJob(trip, car.id, planned, vendor, at); notify("เริ่มงานบำรุงรักษาแล้ว"); router.push(jobHref(trip, car.id, "receive/")); }} />
    </>
  );
}
