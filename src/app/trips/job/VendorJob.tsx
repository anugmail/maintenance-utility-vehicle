"use client";
/* S23 · หน้างานรายคันของผู้รับจ้าง หลังปิดงานหรือแจ้งบำรุงรักษาไม่ได้ — vendorJob() ใน screens.js (เอากลับ 10 พ.ย. 2569 R87 · component-rules §5.35 · บล็อก V V.11–V.16 V.19–V.21)
   เจ้าของงาน 10 พ.ย. 2569 _"scen s23 อยากปรับ ui ให้เหมือนกับ s10 แต่ว่า เงื่อนไขการมองเห็น เมนูต่างๆ ยังเป็นเหมือนเดิม"_ ⇒ โครงเดียวกับหน้างานที่ปิดแล้วของ S10 (WorkDetail / workDetail)
   Page header (ทะเบียน · ป้ายสถานะ = Pill outline สีตามตาราง headPill · ปุ่มตามสถานะ)
     ดำเนินการบำรุงรักษาแล้ว / แจ้งบำรุงรักษาไม่ได้ = "แก้ไขงาน" + "ส่งตรวจงาน" · รอตรวจรับ = ไม่มีปุ่ม
     ส่งกลับแก้ไข = คันที่ปิดงานไว้ "แก้ไขงาน" · คันที่แจ้งไม่ได้ "บำรุงรักษาไม่ได้" + "เริ่มงาน" (ปุ่มกลับเป็นแบบก่อนแจ้ง)
   → (ส่งกลับแก้ไข) Alert Error "หน่วยงานส่งกลับให้แก้ไข" + เหตุผล
   → VehicleAndReporterInfo "ข้อมูลยานพาหนะและงาน" กล่องเดียว: ข้อมูลยานพาหนะ 6 ช่อง + (ปิดงาน) เริ่มงาน ปิดงาน ผู้บันทึก น้ำมันไฮโดรลิก เลขไมล์และชั่วโมงหลังทำ
       / (แจ้งไม่ได้) สาเหตุที่บำรุงรักษาไม่ได้ ผู้แจ้ง แจ้งเมื่อ + (รอตรวจรับ) ส่งตรวจงานเมื่อ ผู้ส่ง
   → (ปิดงาน) File upload "ภาพก่อนเริ่มงาน" รายการไฟล์ลบได้อัปโหลดใหม่ได้ (photoFiles · JPG, PNG · สูงสุด 10 ภาพ)
       + Section label "รายการงานและอะไหล่ที่ใช้จริง (n)" + Secondary button "เพิ่มอะไหล่" + Table WORK_COLS2 + คอลัมน์ไอคอนแก้ไข ลบ 104
   → Section label "อะไหล่ส่งคืน (n)" + "เพิ่มอะไหล่" + Table RET_COLS + ไอคอนแก้ไข ลบ (retTable(used, label, edit))
   ไม่มีส่วนค่าใช้จ่ายและราคา (เจ้าของงาน 10 พ.ย. 2569 _"จะไม่มีเรื่องทั้ง section ค่าใช้จ่ายรายคัน"_)
   popup: แก้ไขอะไหล่ (partEditModal) · เพิ่มอะไหล่ที่ใช้จริง (partAddModal) · ยืนยันการเอาอะไหล่ออก (PART_DEL_CONFIRM สีแดง) · ยืนยันส่งตรวจงาน (HIRE_SEND_CONFIRM) → toast "ส่งตรวจงานแล้ว"
   แก้ไข ลบ เพิ่ม อะไหล่และภาพได้เมื่อสถานะ ดำเนินการบำรุงรักษาแล้ว · แจ้งบำรุงรักษาไม่ได้ · รอตรวจรับ · ส่งกลับแก้ไข (ตาราง Condition ของ Scenario 23) — เฉพาะผู้รับจ้าง · บทบาทอื่นดูอย่างเดียว
   ตาม `Page header` `Pill outline` `Alert` `Section label` `Table` `File upload` `Secondary button` `Primary button` ของไฟล์ Component + VehicleAndReporterInfo ของไฟล์ Maintain-D
     + หน้า `RP & MA Job` ของ UI Release#2 (Page header Job detail Badge + ปุ่มขวา · popup) */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { Alert } from "@/components/vms/Alert";
import { FileUpload } from "@/components/vms/FileUpload";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import {
  addJobPart, cannotJob, deleteJobPart, editCannotReason, editPartUsed, OIL_DEFAULT, OIL_JOB_OPTS, patchJob, plannedOil, retRows, sendJob, startJob, thaiNow, workItems, workShown, WSTAT,
  type Job, type JobTrip, type TripCar, type WorkItem,
} from "@/lib/mock/jobs";
import { notify, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { badgeOf, CannotPopup, DataTable, jobHref, PartAddModal, PartEditModal, RET_COLS, Section, toUpload, tripHref, useBack, useCrumbs } from "../_lib/ui";
import { vehiclePairs } from "./JobPage";

/* WORK_COLS2 (อะไหล่ที่ใช้จริง) · คอลัมน์ไอคอนแก้ไข + ลบ กว้าง 104 (EDIT_ICONS) */
const WORK_COLS2: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ที่ใช้", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "จำนวนที่ใช้จริง", width: 140 }, { head: "หน่วย", width: 110 }];
const ICON_COL: TableColumn = { head: "", width: 104, Style: "Action icons" };

export function VendorJob({ trip, car, job, vendor }: { trip: JobTrip; car: TripCar; job: Job; vendor: boolean }) {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const planned = plannedOil(useMock().plans, trip.planId, car.id);
  const [editK, setEditK] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [cannot, setCannot] = useState<{ edit: boolean } | null>(null);
  const [why, setWhy] = useState("");
  const [whyErr, setWhyErr] = useState(false);
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);

  const s = job.status, isCannot = !!job.cannot, ed = vendor;
  const rows = workItems(job), work = workShown(job, rows);
  const editItem = editK == null ? null : rows.find((w) => w.k === editK) ?? null;

  /* ---------- การกระทำ ---------- */
  /* แก้ไขงาน (แจ้งไม่ได้) = แก้สาเหตุ · ส่งกลับคันที่แจ้งไม่ได้ "บำรุงรักษาไม่ได้" = แก้สาเหตุแล้วแจ้งใหม่ (ตาราง Condition S23) ⇒ ตั้งต้นด้วยสาเหตุเดิม */
  const openCannot = (edit: boolean) => { setWhy(job.cannot?.reason ?? ""); setWhyErr(false); setCannot({ edit }); };
  const saveCannot = () => {
    if (!cannot) return;
    if (!why.trim()) { setWhyErr(true); return; }
    if (cannot.edit) editCannotReason(trip, car.id, why.trim());
    else { cannotJob(trip, car.id, why.trim(), job.cannot?.used ?? job.parts.map(() => 0), thaiNow(), true); notify("บันทึกบำรุงรักษาไม่ได้แล้ว"); router.push(tripHref(trip)); }
    setCannot(null);
  };
  const send = () => setPending({
    spec: { title: "ยืนยันส่งตรวจงาน · " + car.plate, sub: "งานของยานพาหนะคันนี้จะส่งให้หน่วยงานตรวจรับ", cancel: "ยกเลิก", ok: "ส่งตรวจงาน" },   // HIRE_SEND_CONFIRM
    run: () => { sendJob(trip, car.id); notify("ส่งตรวจงานแล้ว"); },
  });
  const delPart = (w: WorkItem) => setPending({
    spec: { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: w.part + " จะถูกเอาออกจากยานพาหนะคันนี้", cancel: "ยกเลิก", ok: "เอาออก" },   // PART_DEL_CONFIRM
    run: () => deleteJobPart(trip, car, w.k),
  });
  const start = () => { startJob(trip, car.id, planned, true); notify("เริ่มงานบำรุงรักษาแล้ว"); router.push(jobHref(trip, car.id, "receive/")); };

  /* ---------- ปุ่มหัวหน้า (vendorJob acts) ---------- */
  const size = mob ? "lg" : "md";
  const editWork = () => (isCannot ? openCannot(true) : router.push(jobHref(trip, car.id, "close/")));
  const actions = !ed ? undefined
    : s === "worked" || s === "reported" ? <><SecondaryButton Text="แก้ไขงาน" Size={size} onClick={editWork} /><PrimaryButton Text="ส่งตรวจงาน" Size={size} onClick={send} /></>
    : s === "returned" ? (isCannot
      ? <><SecondaryButton Text="บำรุงรักษาไม่ได้" Size={size} onClick={() => openCannot(false)} /><PrimaryButton Text="เริ่มงาน" Size={size} onClick={start} /></>
      : <PrimaryButton Text="แก้ไขงาน" Size={size} onClick={editWork} />)
    : undefined;   // รอตรวจรับ = ไม่มีปุ่ม

  /* ---------- เนื้อหา ---------- */
  const jobKv: [string, string][] = isCannot
    ? [["สาเหตุที่บำรุงรักษาไม่ได้", job.cannot?.reason ?? "-"], ["ผู้แจ้ง", job.cannot?.by ?? "-"], ["แจ้งเมื่อ", job.cannot?.at ?? "-"]]
    : [["เริ่มงาน", job.startedAt ?? "-"], ["ปิดงาน", job.closedAt ?? "-"], ["ผู้บันทึก", job.recordedBy ?? "-"], ["น้ำมันไฮโดรลิก", OIL_JOB_OPTS[job.oilChoice ?? OIL_DEFAULT]],
      ["เลขไมล์หลังทำ", job.kmAfter ?? "-"], ["ชั่วโมงเครื่องจักรหลังทำ", job.hoursAfter ?? "-"]];
  const sent: [string, string][] = s === "wait" ? [["ส่งตรวจงานเมื่อ", job.sentAt ?? "-"], ["ผู้ส่ง", job.sentBy ?? "-"]] : [];
  const icons = (w: WorkItem): TableValue => {
    const acts = [
      { IconSwap: "stylus-24-300-round", label: "แก้ไข " + w.part, onClick: () => setEditK(w.k) },
      { IconSwap: "delete-24-300-round", label: "ลบ " + w.part, onClick: () => delPart(w) },
    ];
    return { actions: acts, mobileActions: acts };
  };
  const addBtn = ed ? <SecondaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" Size={size} onClick={() => setAdding(true)} /> : undefined;
  const ret = retRows(rows, rows.map((w) => w.usedQty));
  const photos = job.photos ?? [];

  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[s])} Pill={WSTAT[s]} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} Actions={actions} />
      {s === "returned" && <Alert Color="Error" Text="หน่วยงานส่งกลับให้แก้ไข" SupportingText={job.returnReason ?? "-"} />}
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะและงาน" pairs={[...vehiclePairs(trip, car), ...jobKv, ...sent]} />
      {!isCannot && (
        <>
          <FileUpload LabelText="ภาพก่อนเริ่มงาน" files={photos} hint="JPG, PNG · สูงสุด 10 ภาพ" bar readonly={!ed} accept=".jpg,.jpeg,.png"
            onFiles={(fs) => patchJob(trip.id, car.id, (j) => ({ ...j, photos: [...(j.photos ?? []), ...fs.map(toUpload)].slice(0, 10) }))}
            onDelete={(i) => patchJob(trip.id, car.id, (j) => ({ ...j, photos: (j.photos ?? []).filter((_, k) => k !== i) }))} />
          <Section>
            <SectionLabel Title={"รายการงานและอะไหล่ที่ใช้จริง (" + work.length + ")"} Actions={addBtn} />
            <DataTable cols={ed ? [...WORK_COLS2, ICON_COL] : WORK_COLS2} rows={work.map((w) => [w.task, w.part, String(w.planQty), String(w.usedQty), w.unit, ...(ed ? [icons(w)] : [])])} />
          </Section>
        </>
      )}
      <Section>
        <SectionLabel Title={"อะไหล่ส่งคืน (" + rows.length + ")"} Actions={addBtn} />
        <DataTable cols={ed ? [...RET_COLS, ICON_COL] : RET_COLS} rows={rows.map((w, i) => [...ret[i], ...(ed ? [icons(w)] : [])])} />
      </Section>

      <PartEditModal item={editItem && { ...editItem, used: editItem.usedQty }} onCancel={() => setEditK(null)}
        onSave={(v) => { if (editItem) editPartUsed(trip, car, editItem.k, v.used); setEditK(null); }} />
      <PartAddModal open={adding} onCancel={() => setAdding(false)} onAdd={(p) => { addJobPart(trip, car, p); setAdding(false); }} />
      <CannotPopup open={!!cannot} car={car} parts={job.parts} used={job.cannot?.used ?? null} reason={why} error={whyErr}
        onReason={(v) => { setWhy(v); if (v.trim()) setWhyErr(false); }} onOk={saveCannot} onCancel={() => setCannot(null)} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { const p = pending; setPending(null); p?.run(); }} />
    </>
  );
}
