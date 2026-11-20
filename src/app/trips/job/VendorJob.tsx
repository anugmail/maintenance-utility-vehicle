"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { FormModal } from "@/components/patterns/FormModal";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TextInput } from "@/components/vms/TextInput";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { Alert } from "@/components/vms/Alert";
import { FileUpload } from "@/components/vms/FileUpload";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import {
  acceptVendorJob, addJobPart, cannotJob, deleteJobPart, returnVendorJob, editCannotReason, editPartUsed, OIL_DEFAULT, OIL_JOB_OPTS, patchJob, plannedOil, retRows, sendJob, startJob, thaiNow, workItems, workShown, WSTAT,
  type Job, type JobTrip, type TripCar, type WorkItem,
} from "@/lib/mock/jobs";
import { notify, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { badgeOf, CannotPopup, DataTable, DateTimeModal, Grid, jobHref, PartAddModal, PartEditModal, RET_COLS, Section, toUpload, tripHref, useBack, useCrumbs } from "../_lib/ui";
import { vehiclePairs } from "./JobPage";

const WORK_COLS2: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ที่ใช้", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "จำนวนที่ใช้จริง", width: 140 }, { head: "หน่วย", width: 110 }];
const ICON_COL: TableColumn = { head: "", width: 104, Style: "Action icons" };

export function VendorJob({ trip, car, job, vendor, kbk }: { trip: JobTrip; car: TripCar; job: Job; vendor: boolean; kbk?: boolean }) {
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

  const openCannot = (edit: boolean) => { setWhy(job.cannot?.reason ?? ""); setWhyErr(false); setCannot({ edit }); };
  const saveCannot = () => {
    if (!cannot) return;
    if (!why.trim()) { setWhyErr(true); return; }
    if (cannot.edit) editCannotReason(trip, car.id, why.trim());
    else { cannotJob(trip, car.id, why.trim(), job.cannot?.used ?? job.parts.map(() => 0), thaiNow(), true); notify("บันทึกบำรุงรักษาไม่ได้แล้ว"); router.push(tripHref(trip)); }
    setCannot(null);
  };
  const send = () => setPending({
    spec: { title: "ยืนยันส่งตรวจงาน · " + car.plate, sub: "งานของยานพาหนะคันนี้จะส่งให้หน่วยงานตรวจรับ", cancel: "ยกเลิก", ok: "ส่งตรวจงาน" },
    run: () => { sendJob(trip, car.id); notify("ส่งตรวจงานแล้ว"); },
  });
  const delPart = (w: WorkItem) => setPending({
    spec: { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: w.part + " จะถูกเอาออกจากยานพาหนะคันนี้", cancel: "ยกเลิก", ok: "เอาออก" },
    run: () => deleteJobPart(trip, car, w.k),
  });
  const [starting, setStarting] = useState(false);
  const start = () => setStarting(true);
  const doStart = (at: string) => { setStarting(false); startJob(trip, car.id, planned, true, at); notify("เริ่มงานบำรุงรักษาแล้ว"); router.push(jobHref(trip, car.id, "receive/")); };

  const review = !!kbk && !vendor && s === "wait";
  const digits = (v: string) => { const d = v.replace(/\D/g, ""); return d ? Number(d).toLocaleString("en-US") : ""; };
  const [wage, setWage] = useState(job.hireCost?.wage ?? ""), [travel, setTravel] = useState(job.hireCost?.travel ?? "");
  const [costTouched, setCostTouched] = useState(false);
  const [backWhy, setBackWhy] = useState<string | null>(null);
  const costOk = !!wage && !!travel;
  const accept = () => {
    if (!costOk) { setCostTouched(true); return; }
    setPending({
      spec: { title: "ยืนยันตรวจรับงาน · " + car.plate, sub: "ค่าจ้าง " + wage + " บาท · ค่าเดินทาง " + travel + " บาท · งานของยานพาหนะคันนี้จะเป็น" + (isCannot ? "บำรุงรักษาไม่ได้" : "เสร็จสิ้น") + " และรวมในต้นทุนการบำรุงรักษา", cancel: "ยกเลิก", ok: "ตรวจรับ" },
      run: () => { acceptVendorJob(trip, car.id, { wage, travel }); notify("ตรวจรับงานแล้ว"); },
    });
  };

  const size = mob ? "lg" : "md";
  const editWork = () => (isCannot ? openCannot(true) : router.push(jobHref(trip, car.id, "close/")));
  const actions = review ? <><SecondaryButton Text="ส่งกลับแก้ไข" Size={size} onClick={() => setBackWhy("")} /><PrimaryButton Text="ตรวจรับ" Size={size} State={costOk ? "Default" : "Disabled"} onClick={accept} /></>
    : !ed ? undefined
    : s === "worked" || s === "reported" ? <><SecondaryButton Text="แก้ไขงาน" Size={size} onClick={editWork} /><PrimaryButton Text="ส่งตรวจงาน" Size={size} onClick={send} /></>
    : s === "returned" ? (isCannot
      ? <><SecondaryButton Text="บำรุงรักษาไม่ได้" Size={size} onClick={() => openCannot(false)} /><PrimaryButton Text="เริ่มงาน" Size={size} onClick={start} /></>
      : <PrimaryButton Text="แก้ไขงาน" Size={size} onClick={editWork} />)
    : undefined;

  const jobKv: [string, string][] = isCannot
    ? [["สาเหตุที่บำรุงรักษาไม่ได้", job.cannot?.reason ?? "-"], ["ผู้แจ้ง", job.cannot?.by ?? "-"], ["แจ้งเมื่อ", job.cannot?.at ?? "-"]]
    : [["เริ่มงาน", job.startedAt ?? "-"], ["ปิดงาน", job.closedAt ?? "-"], ["ผู้บันทึก", job.recordedBy ?? "-"], ["น้ำมันไฮดรอลิก", OIL_JOB_OPTS[job.oilChoice ?? OIL_DEFAULT]],
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

      {review && (
        <Section>
          <SectionHeader Title="ค่าใช้จ่ายของยานพาหนะคันนี้ (บาท)" />
          <Grid>
            <TextInput LabelText="ค่าจ้าง (บาท)" Text={wage} Placeholder="0" inputMode="numeric" onChange={(v) => setWage(digits(v))} onBlur={() => setCostTouched(true)}
              State={costTouched && !wage ? "Error" : undefined} HelperText={costTouched && !wage ? "กรุณาระบุค่าจ้าง" : undefined} />
            <TextInput LabelText="ค่าเดินทาง (บาท)" Text={travel} Placeholder="0" inputMode="numeric" onChange={(v) => setTravel(digits(v))} onBlur={() => setCostTouched(true)}
              State={costTouched && !travel ? "Error" : undefined} HelperText={costTouched && !travel ? "กรุณาระบุค่าเดินทาง" : undefined} />
          </Grid>
        </Section>
      )}
      <FormModal open={backWhy !== null} title={"ส่งกลับแก้ไข · " + car.plate} fields={[{ label: "เหตุผลที่ส่งกลับ", value: backWhy ?? "", area: true }]} onField={(_, v) => setBackWhy(v)}
        ok="ส่งกลับ" okDisabled={!backWhy?.trim()} onCancel={() => setBackWhy(null)}
        onOk={() => { if (backWhy?.trim()) { returnVendorJob(trip, car.id, backWhy.trim()); notify("ส่งกลับให้ผู้รับจ้างแก้ไขแล้ว"); } setBackWhy(null); }} />
      <DateTimeModal open={starting} title={"เริ่มงาน · " + car.plate} sub="ระบุวันและเวลาที่เริ่มงานบำรุงรักษาของยานพาหนะคันนี้ แก้ไขได้ที่ขั้นตรวจสภาพก่อนบำรุงรักษา" label="เริ่มงาน"
        value={thaiNow()} ok="เริ่มงาน" onCancel={() => setStarting(false)} onOk={doStart} />
      <PartEditModal item={editItem && { ...editItem, used: editItem.usedQty }} onCancel={() => setEditK(null)}
        onSave={(v) => { if (editItem) editPartUsed(trip, car, editItem.k, v.used); setEditK(null); }} />
      <PartAddModal open={adding} onCancel={() => setAdding(false)} onAdd={(p) => { addJobPart(trip, car, p); setAdding(false); }} />
      <CannotPopup open={!!cannot} car={car} parts={job.parts} used={job.cannot?.used ?? null} reason={why} error={whyErr}
        onReason={(v) => { setWhy(v); if (v.trim()) setWhyErr(false); }} onOk={saveCannot} onCancel={() => setCannot(null)} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { const p = pending; setPending(null); p?.run(); }} />
    </>
  );
}
