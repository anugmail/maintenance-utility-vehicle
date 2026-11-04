"use client";
/* S10 P2 · งานรายคัน ยังไม่เริ่ม / อยู่ระหว่างบำรุงรักษา — jobPage() ใน screens.js (มุมผู้รับจ้าง jobPage({vendor}) ของ S23 ใช้ไฟล์เดียวกัน)
   Page header (ทะเบียน · ป้ายสถานะงาน · ปุ่ม "บำรุงรักษาไม่ได้" + "เริ่มงาน"/"ปิดงาน")
   → VehicleAndReporterInfo "ข้อมูลยานพาหนะ" (6) · "การนัดหมาย" (+ เริ่มงาน ผู้เริ่มงาน เมื่ออยู่ระหว่างบำรุงรักษา)
   → (อยู่ระหว่างบำรุงรักษา) IncidentPhotoGallery "ภาพก่อนเริ่มงาน (n)" (ผู้รับจ้าง: File upload แก้ไขได้) · Section header "น้ำมันไฮโดรลิก" + Radio text card 3 ใบ + เปลี่ยนน้ำมันครั้งล่าสุด
   → Section label "รายการงานและอะไหล่ตามแผน (n)" + Tertiary button "เพิ่มอะไหล่" + Table JOB_COLS (ไอคอนแก้ไข → หน้าอะไหล่ของรถ S21 · ลบ → ยืนยันเอาอะไหล่ออก)
   popup "บำรุงรักษาไม่ได้ · <ทะเบียน>" (cannotModal) → ยืนยัน → กลับหน้ารายละเอียดแผนเดินทาง + toast "บันทึกบำรุงรักษาไม่ได้แล้ว" */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { FileUpload } from "@/components/vms/FileUpload";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import {
  cannotJob, jobWork, ODOMETER, OIL_DEFAULT, patchJob, thaiNow, tripLoc, tripPhone, tripRange, WORK, WSTAT, JOB_TIMES,
  type Job, type JobTrip, type PlanPart, type TripCar,
} from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { badgeOf, CannotPopup, DataTable, jobCrumbs, jobHref, LastOil, OilCards, Section, toUpload, tripHref, useBack } from "../_lib/ui";

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
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const doing = job.status === "doing" || (job.status === "returned" && !!job.startedAt && !job.closedAt);
  const [cannot, setCannot] = useState(false);
  const [reason, setReason] = useState("");
  const [err, setErr] = useState(false);
  const [del, setDel] = useState<PlanPart | null>(null);

  /* อะไหล่ตามแผน: กบค. เพิ่ม แก้ไข ลบ ได้ตอนยังไม่เริ่ม/อยู่ระหว่างบำรุงรักษา · ผู้รับจ้าง ยังไม่เริ่ม = ดูอย่างเดียว · เริ่มแล้วแก้ได้ (S23) */
  const editParts = actor && (kbk || doing);
  const oil = job.oilChoice ?? OIL_DEFAULT;
  const work = jobWork(job.parts, doing ? oil : 1);
  const toParts = () => router.push("/soon/?s=" + (vendor ? "S23" : "S21") + "&car=" + car.id);
  const cols = editParts ? JOB_COLS : JOB_COLS.slice(0, 4);
  const rows = work.map((w) => {
    const r = [w.task, w.part, String(w.planQty), w.unit];
    return editParts ? [...r, { actions: [
      { IconSwap: "stylus-24-300-round", label: "แก้ไข " + w.part, onClick: toParts },
      { IconSwap: "delete-24-300-round", label: "ลบ " + w.part, onClick: () => setDel(w) },
    ] }] : r;
  });
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
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[job.status])} crumbs={jobCrumbs(trip, car.plate)} onBack={() => back(tripHref(trip))} Actions={actions} />
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={vehiclePairs(trip, car)} />
      <VehicleAndReporterInfo Title="การนัดหมาย" pairs={appointmentPairs(trip, car, job)} />
      {doing && (vendor && actor
        ? <FileUpload LabelText="ภาพก่อนเริ่มงาน" files={photos} hint="JPG, PNG · สูงสุด 10 ภาพ" bar accept=".jpg,.jpeg,.png"
            onFiles={(fs) => patchJob(trip.id, car.id, (j) => ({ ...j, photos: [...(j.photos ?? []), ...fs.map(toUpload)].slice(0, 10) }))}
            onDelete={(i) => patchJob(trip.id, car.id, (j) => ({ ...j, photos: (j.photos ?? []).filter((_, k) => k !== i) }))} />
        : <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + photos.length + ")"} photos={photos.map((p) => ({ alt: p.name }))} />)}
      {doing && (
        <Section>
          <SectionHeader Title="น้ำมันไฮโดรลิก" />
          <OilCards value={oil} Disabled={!actor} onChange={(k) => patchJob(trip.id, car.id, (j) => ({ ...j, oilChoice: k }))} />
          <LastOil car={car} />
        </Section>
      )}
      <Section>
        <SectionLabel Title={"รายการงานและอะไหล่ตามแผน (" + work.length + ")"}
          Actions={editParts ? <TertiaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" onClick={toParts} /> : undefined} />
        <DataTable cols={cols} rows={rows} />
      </Section>
      <CannotPopup open={cannot} car={car} parts={job.parts} used={used} reason={reason} error={err}
        onReason={(v) => { setReason(v); if (v.trim()) setErr(false); }} onOk={confirmCannot} onCancel={() => setCannot(false)} />
      <ConfirmDialog spec={del ? { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: del.part + " จะถูกเอาออกจากรถคันนี้", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onOk={() => { if (del) patchJob(trip.id, car.id, (j) => ({ ...j, parts: j.parts.filter((p) => p.part !== del.part) })); setDel(null); }} onCancel={() => setDel(null)} />
    </>
  );
}
