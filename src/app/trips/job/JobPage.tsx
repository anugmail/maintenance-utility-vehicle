"use client";
/* S10 P2 · งานรายคัน ยังไม่เริ่ม — jobPage() ใน screens.js · แผนจ้างดำเนินการ = jobPage({ hire: true }) (กบค. ปิดงานแทนผู้รับจ้าง 4 พ.ย. 2569)
   Page header (ทะเบียน · ป้ายสถานะงาน · ปุ่ม "บำรุงรักษาไม่ได้" + "เริ่มงาน") — กดเริ่มงาน = อยู่ระหว่างบำรุงรักษาทันที + toast "เริ่มงานบำรุงรักษาแล้ว" → Step 1 (5 พ.ย. 2569)
   (อยู่ระหว่างบำรุงรักษา: กบค. เข้าขั้นที่ค้างจาก JobView · หน้านี้แบบอยู่ระหว่างบำรุงรักษาเหลือไว้ให้บทบาทอื่นดูอย่างเดียว)
   → VehicleAndReporterInfo "ข้อมูลยานพาหนะ" (6) · "การนัดหมาย" (+ เริ่มงาน ผู้เริ่มงาน เมื่ออยู่ระหว่างบำรุงรักษา · แผนจ้าง: ผู้รับจ้าง ช่วงวันทำงาน แทนช่วงวันเดินทาง)
   → (อยู่ระหว่างบำรุงรักษา) IncidentPhotoGallery "ภาพก่อนเริ่มงาน (n)" · Section header "น้ำมันไฮโดรลิก" + Radio text card 3 ใบ + เปลี่ยนน้ำมันครั้งล่าสุด
   → Section label "รายการงานและอะไหล่ตามแผน (n)" + Secondary button "เพิ่มอะไหล่" + Table JOB_COLS (ไอคอนแก้ไข → popup แก้ไขอะไหล่ · ลบ → ยืนยันเอาอะไหล่ออก · เพิ่ม → popup เพิ่มอะไหล่ที่ใช้จริง — BACKLOG ข้อ 4)
     (เก็บเป็นร่างของหน้าปิดงาน — workItems() ใน lib/mock/jobs.ts) · แผนจ้างมีปุ่ม ตาราง ไอคอนชุดเดียวกัน กบค. เป็นผู้กด
   popup "บำรุงรักษาไม่ได้ · <ทะเบียน>" (cannotModal) → ยืนยัน → กลับหน้ารายละเอียดแผนเดินทาง + toast "บันทึกบำรุงรักษาไม่ได้แล้ว"
   S23 ผู้รับจ้าง (jobPage({ vendor }) · R87 · V.3): ปุ่มหัวเหมือนกัน (บำรุงรักษาไม่ได้ · เริ่มงาน) · อะไหล่ตามแผนดูอย่างเดียว ไม่มีปุ่ม "เพิ่มอะไหล่" ไม่มีคอลัมน์ไอคอน (JOB_COLS 4 คอลัมน์)
     · ผู้เริ่มงาน = ผู้รับจ้าง (HIRE_BY) · บำรุงรักษาไม่ได้ = สถานะ "แจ้งบำรุงรักษาไม่ได้" รอส่งตรวจงาน
     · ส่งกลับแก้ไขคันที่แจ้งไม่ได้ไว้ (V.21) ปุ่มกลับเป็นแบบนี้ — VendorJob */
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
import { badgeOf, CannotPopup, DataTable, useCrumbs, jobHref, LastOil, OilCards, PartAddModal, PartEditModal, Section, tripHref, useBack } from "../_lib/ui";

const JOB_COLS: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ตามแผน", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "หน่วย", width: 110 }, { head: "", width: 104, Style: "Action icons" }];

/* กล่อง "ข้อมูลยานพาหนะ" (6 คู่) — เลขไมล์/ชั่วโมงเครื่องจักรสะสมเป็นค่าคงที่ของจอ Figma (ค่าเดียวทั้งตรวจเองและใบจ้าง) */
export const vehiclePairs = (t: JobTrip, c: TripCar): [string, string][] => {
  const [km, hr] = ODOMETER;
  return [["ทะเบียน", c.plate], ["ยี่ห้อ/รุ่น", c.model], ["ประเภท", c.type], ["หน่วยงานเจ้าของยานพาหนะ", c.owner], ["เลขไมล์สะสม", km], ["ชั่วโมงเครื่องจักรสะสม", hr]];
};
/* กล่อง "การนัดหมาย" — ตรวจเอง: แผนเดินทาง ช่วงวันเดินทาง · จ้าง: แผนเดินทาง ผู้รับจ้าง ช่วงวันทำงาน · + สถานที่ เบอร์ติดต่อ ผู้ดูแลยานพาหนะ (+ เริ่มงาน ผู้เริ่มงาน = กบค. ทั้งสองแบบ)
   9 พ.ย. 2569 เบอร์ก่อนชื่อผู้ดูแล ตามคอลัมน์เบอร์ติดต่อ (jobBoxes · Figma c28dd82) */
/* + "วันดำเนินการ" ของคันนี้ต่อจากช่วงวันเดินทาง/ช่วงวันทำงาน (R83 · jobBoxes ของ screens.js Figma 5963d05 · 9 พ.ย. 2569 ค่ำ เจ้าของงาน "ในรายคันอยากให้เห็นว่าแต่ละคันจะดำเนินการเมื่อไร") */
export const appointmentPairs = (t: JobTrip, c: TripCar, j?: Job): [string, string][] => [
  ...((t.mode === "hire" ? [["แผนเดินทาง", t.name], ["ผู้รับจ้าง", t.vendor ?? "-"], ["ช่วงวันทำงาน", tripRange(t)]] : [["แผนเดินทาง", t.name], ["ช่วงวันเดินทาง", tripRange(t)]]) as [string, string][]),
  ["วันดำเนินการ", tripWork({ d1: t.d1, d2: t.d2, works: t.works }, c.id)],
  ["สถานที่บำรุงรักษา", tripLoc(t, c)], ["เบอร์ติดต่อ", tripPhone(t, c)], ["ผู้ดูแลยานพาหนะ", tripCtrl(t, c)],   // jobBoxes 9 พ.ย. 2569
  ...((j?.status === "doing" ? [["เริ่มงาน", j.startedAt ?? "-"], ["ผู้เริ่มงาน", j.startedBy ?? "-"]] : []) as [string, string][]),
];
/* ใช้ไปแล้วตอนแจ้งบำรุงรักษาไม่ได้ระหว่างบำรุงรักษา — ตัวอย่างจอ I.16 (CANNOT_USED: น้ำมัน 30 ไส้กรองไฮโดรลิก 2) · ยังไม่เริ่ม = 0 */
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

  /* อะไหล่ตามแผน: กบค. เพิ่ม แก้ไข ลบ ได้ตอนยังไม่เริ่ม/อยู่ระหว่างบำรุงรักษา (แผนจ้างด้วย) · บทบาทอื่นดูอย่างเดียว */
  const editParts = actor && !vendor;
  const oil = job.oilChoice ?? OIL_DEFAULT;
  /* แก้ไข = popup แก้ไขอะไหล่ (partEditModal) · เพิ่ม = popup เพิ่มอะไหล่ที่ใช้จริง (partAddModal) · ลบ = ยืนยันการเอาอะไหล่ออก (PART_DEL_CONFIRM)
     ค่าที่แก้เก็บเป็นร่างของหน้าปิดงาน (workItems) ⇒ เป็นค่าตั้งต้นของตาราง "รายการสภาพวัสดุอะไหล่" ตอนปิดงาน (BACKLOG ข้อ 4) · ยังไม่เริ่ม = ตามแผน (เปลี่ยนน้ำมัน) */
  /* ยังไม่เริ่ม: แถวงานตามน้ำมันที่วางแผนไว้ (S21 · plannedOil) · อยู่ระหว่างบำรุงรักษา (บทบาทอื่นดู): ตามที่เลือกหน้างาน */
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
      : <PrimaryButton Text="เริ่มงาน" Size={size} onClick={() => { startJob(trip, car.id, planned, vendor); notify("เริ่มงานบำรุงรักษาแล้ว"); router.push(jobHref(trip, car.id, "receive/")); }} />}
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
      <ConfirmDialog spec={del ? { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: del.part + " จะถูกเอาออกจากยานพาหนะคันนี้", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onOk={() => { if (del) deleteJobPart(trip, car, del.k); setDel(null); }} onCancel={() => setDel(null)} />
      <PartEditModal item={editItem && { ...editItem, used: editItem.usedQty }} onCancel={() => setEditK(null)}
        onSave={(v) => { if (editItem) editPartUsed(trip, car, editItem.k, v.used); setEditK(null); }} />
      <PartAddModal open={adding} onCancel={() => setAdding(false)} onAdd={(p) => { addJobPart(trip, car, p); setAdding(false); }} />
    </>
  );
}
