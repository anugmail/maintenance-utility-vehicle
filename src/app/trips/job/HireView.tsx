"use client";
/* งานรายคันของแผนจ้างดำเนินการ หลังปิดงาน/แจ้งไม่ได้ — hireJob() ใน screens.js · แยก view ตามบทบาท (เจ้าของงาน 4 พ.ย. 2569 "อยากให้แยก view")
   JobView เรียกหน้านี้เมื่อสถานะ ดำเนินการบำรุงรักษาแล้ว / แจ้งบำรุงรักษาไม่ได้ / รอตรวจรับ / ส่งกลับแก้ไข (ยังไม่เริ่ม/อยู่ระหว่างบำรุงรักษา = JobPage · เสร็จสิ้น = WorkDetail · บำรุงรักษาไม่ได้ = CannotView)
   ผู้รับจ้าง (S23 V.6–V.14): แก้ไข ลบ เพิ่ม อะไหล่ที่ใช้จริง อะไหล่ส่งคืน และภาพได้จนถึงตรวจรับ · "ส่งตรวจงาน" ทีละคัน
     ดำเนินการบำรุงรักษาแล้ว = "แก้ไขงาน" (หน้าปิดงาน) + "ส่งตรวจงาน" · แจ้งบำรุงรักษาไม่ได้ = "แก้ไขงาน" (popup สาเหตุ) + "ส่งตรวจงาน"
     ส่งกลับแก้ไข = Alert เหตุผลของ กบค. + คันที่ปิดงานแล้ว "แก้ไขงาน" · คันที่แจ้งไม่ได้ "บำรุงรักษาไม่ได้" + "เริ่มงาน"/"ปิดงาน"
   กบค. (S11 J.2–J.8): รอตรวจรับ = ดูอย่างเดียว + ผลการพิจารณาแบบการ์ด S2 (อนุมัติ / ส่งกลับแก้ไข + เหตุผล) · สถานะอื่นดูอย่างเดียว
   ข้อมูลจาก lib/mock/jobs.ts (ที่เก็บเดียว) · เปลี่ยนสถานะผ่าน lib/mock/hire.ts
   อ้างอิง: Page header · Alert · Section label · Table · File upload · Radio text card · Text area ของไฟล์ Component + VehicleAndReporterInfo · IncidentPhotoGallery ของไฟล์ Maintain-D
            + หน้า RP & MA Job ของ UI Release#2 (Page header Badge + ปุ่มขวา ตาม screens.js) */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { Alert } from "@/components/vms/Alert";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { TextArea } from "@/components/vms/TextArea";
import { approveJob, hireAddPart, hireCannot, hireDeletePart, hireEditUsed, hireRows, hireWork, isCannotJob, returnJob, sendJob, type WorkItem } from "@/lib/mock/hire";
import { JOB_TIMES, OIL_DEFAULT, OIL_JOB_OPTS, PEOPLE, retRows, WSTAT, type Job, type JobTrip, type TripCar } from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { badgeOf, BeforePhotos, ButtonRow, CannotPopup, DataTable, useCrumbs, jobHref, PartAddModal, PartEditModal, RET_COLS, Section, tripHref, useBack } from "../_lib/ui";
import { appointmentPairs, vehiclePairs } from "./JobPage";

/* WORK_COLS2 (ใช้จริง) · คอลัมน์ไอคอนแก้ไข + ลบ กว้าง 104 */
const WORK_COLS2: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ที่ใช้", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "จำนวนที่ใช้จริง", width: 140 }, { head: "หน่วย", width: 110 }];
const ICON_COL: TableColumn = { head: "", width: 104, Style: "Action icons" };
const DECISIONS = [
  { Text: "อนุมัติ", SupportingText: "งานของรถคันนี้ผ่านการตรวจรับ และรับคืนอะไหล่ตามรายการ" },
  { Text: "ส่งกลับแก้ไข", SupportingText: "แจ้งเหตุผลให้ผู้รับจ้างแก้ไขแล้วส่งตรวจงานใหม่" },
];
const T = JOB_TIMES.hire;
type Pending = { spec: ConfirmSpec; run: () => void };

export function HireView({ trip, car, job, actor, kbk }: { trip: JobTrip; car: TripCar; job: Job; actor: boolean; kbk: boolean }) {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const mob = useBreakpoint() === "Mobile";
  const [editK, setEditK] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [cannot, setCannot] = useState<{ edit: boolean } | null>(null);
  const [why, setWhy] = useState("");
  const [whyErr, setWhyErr] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);
  const [dec, setDec] = useState("อนุมัติ");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState(false);

  const s = job.status;
  const isCannot = isCannotJob(job);
  const ed = actor;   // ผู้รับจ้างของแผนนี้: แก้ไข ลบ อะไหล่และภาพได้ ตั้งแต่ปิดงาน/แจ้งไม่ได้จนถึงตรวจรับ
  const review = kbk && s === "wait";
  const toTrip = () => router.push(tripHref(trip));
  const rows = hireRows(job);
  const work = hireWork(job, rows);

  /* ---------- การกระทำ ---------- */
  const openCannot = (edit: boolean) => { setWhy(edit || s === "returned" ? job.cannot?.reason ?? "" : ""); setWhyErr(false); setCannot({ edit }); };
  const saveCannot = () => {
    if (!cannot) return;
    if (!why.trim()) { setWhyErr(true); return; }
    hireCannot(trip, job, why.trim(), cannot.edit);
    setCannot(null);
    if (!cannot.edit) { notify("บันทึกบำรุงรักษาไม่ได้แล้ว"); toTrip(); }
  };
  const send = () => setPending({
    spec: { title: "ยืนยันส่งตรวจงาน · " + car.plate, sub: "งานของรถคันนี้จะส่งให้ กบค. ตรวจรับ", ok: "ส่งตรวจงาน" },
    run: () => { sendJob(trip, car.id); notify("ส่งตรวจงานแล้ว"); },
  });
  const decide = () => {
    if (dec === "ส่งกลับแก้ไข") {
      if (!reason.trim()) { setErr(true); return; }
      setPending({
        spec: { title: "ยืนยันส่งกลับแก้ไข", sub: "งานของรถคันนี้จะกลับไปให้ผู้รับจ้างแก้ไขตามเหตุผลที่ระบุ แล้วส่งตรวจงานใหม่", ok: "ส่งกลับ" },
        run: () => { returnJob(trip, car.id, reason.trim()); notify("ส่งกลับให้ผู้รับจ้างแก้ไขแล้ว"); toTrip(); },
      });
      return;
    }
    setPending({
      spec: { title: "ยืนยันอนุมัติงานบำรุงรักษา · " + car.plate, sub: "รถคันนี้จะเป็น \"" + (isCannot ? "บำรุงรักษาไม่ได้" : "เสร็จสิ้น") + "\" และรับคืนอะไหล่ตามรายการ", ok: "อนุมัติ" },
      run: () => { approveJob(trip, car.id); notify("อนุมัติงานบำรุงรักษาแล้ว"); toTrip(); },
    });
  };
  const delPart = (w: WorkItem) => setPending({
    spec: { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: w.part + " จะถูกเอาออกจากรถคันนี้", cancel: "ยกเลิก", ok: "เอาออก" },
    run: () => hireDeletePart(trip, car, w.k),
  });

  /* ---------- ปุ่มหัวหน้า ---------- */
  const size = mob ? "lg" : "md";
  const B2 = (a: [string, () => void], b: [string, () => void]) => <>
    <SecondaryButton Text={a[0]} Size={size} onClick={a[1]} />
    <PrimaryButton Text={b[0]} Size={size} onClick={b[1]} />
  </>;
  const go = (sub: string) => () => router.push(jobHref(trip, car.id, sub));
  let actions = null;
  if (actor) {
    if (s === "worked") actions = B2(["แก้ไขงาน", go("close/")], ["ส่งตรวจงาน", send]);
    else if (s === "reported") actions = B2(["แก้ไขงาน", () => openCannot(true)], ["ส่งตรวจงาน", send]);
    else if (s === "returned") actions = isCannot
      ? B2(["บำรุงรักษาไม่ได้", () => openCannot(false)], job.startedAt ? ["ปิดงาน", go("close/")] : ["เริ่มงาน", go("receive/")])
      : <PrimaryButton Text="แก้ไขงาน" Size={size} onClick={go("close/")} />;
  }

  /* ---------- เนื้อหา ---------- */
  const appt = appointmentPairs(trip, car);
  if (s === "wait") appt.push(["ส่งตรวจงานเมื่อ", job.sentAt ?? T.sent], ["ผู้ส่ง", job.sentBy ?? PEOPLE.vendor]);
  const icons = (w: WorkItem): TableValue => ({ actions: [
    { IconSwap: "stylus-24-300-round", label: "แก้ไข " + w.part, onClick: () => setEditK(w.k) },
    { IconSwap: "delete-24-300-round", label: "ลบ " + w.part, onClick: () => delPart(w) },
  ] });
  const addBtn = <TertiaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" onClick={() => setAdding(true)} />;
  const photos = job.photos ?? [];
  const ret = retRows(rows, rows.map((w) => w.usedQty));
  const editItem = editK == null ? null : rows.find((w) => w.k === editK) ?? null;

  return (
    <>
      <PageHeader Title={car.plate} Badge={badgeOf(WSTAT[s])} crumbs={crumbs.job(trip, car.plate)} onBack={() => back(tripHref(trip))} Actions={actions ?? undefined} />
      {s === "returned" && job.returnReason && <Alert Color="Error" Text="กบค. ส่งกลับให้แก้ไข" SupportingText={job.returnReason} />}
      <VehicleAndReporterInfo pairs={vehiclePairs(trip, car)} />
      <VehicleAndReporterInfo Title="การนัดหมาย" pairs={appt} />
      {isCannot ? (
        <VehicleAndReporterInfo Title="บำรุงรักษาไม่ได้" pairs={[["สาเหตุที่บำรุงรักษาไม่ได้", job.cannot?.reason ?? ""], ["ผู้แจ้ง", job.cannot?.by ?? PEOPLE.vendor], ["แจ้งเมื่อ", job.cannot?.at ?? T.reported]]} />
      ) : (
        <>
          <VehicleAndReporterInfo Title="ผลการบำรุงรักษา" pairs={[["เริ่มงาน", job.startedAt ?? T.start], ["ปิดงาน", job.closedAt ?? T.end], ["ผู้บันทึก", job.recordedBy ?? PEOPLE.vendor],
            ["เลขไมล์หลังทำ", job.kmAfter ?? "-"], ["ชั่วโมงเครื่องจักรหลังทำ", job.hoursAfter ?? "-"], ["น้ำมันไฮโดรลิก", OIL_JOB_OPTS[job.oilChoice ?? OIL_DEFAULT]]]} />
          {ed ? <BeforePhotos trip={trip} car={car} photos={photos} /> : <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + photos.length + ")"} photos={photos.map((p) => ({ alt: p.name }))} />}
          <Section>
            <SectionLabel Title={"รายการงานและอะไหล่ที่ใช้จริง (" + work.length + ")"} Actions={ed ? addBtn : undefined} />
            <DataTable cols={ed ? [...WORK_COLS2, ICON_COL] : WORK_COLS2} rows={work.map((w) => [w.task, w.part, String(w.planQty), String(w.usedQty), w.unit, ...(ed ? [icons(w)] : [])])} />
          </Section>
        </>
      )}
      <Section>
        <SectionLabel Title={"อะไหล่ส่งคืน (" + rows.length + ")"} Actions={ed ? addBtn : undefined} />
        <DataTable cols={ed ? [...RET_COLS, ICON_COL] : RET_COLS} rows={rows.map((w, i) => [...ret[i], ...(ed ? [icons(w)] : [])])} />
      </Section>
      {review && (
        <>
          <Section>
            <SectionLabel Title="ผลการพิจารณา" />
            <RadioTextCards options={DECISIONS} value={dec} onChange={(v) => { setDec(v); setErr(false); }} />
            {dec === "ส่งกลับแก้ไข" && (
              <TextArea LabelText="เหตุผลที่ส่งกลับ" Text={reason} Placeholder="ระบุเหตุผลที่ส่งกลับ" onChange={(v) => { setReason(v); if (v.trim()) setErr(false); }}
                State={err ? "Error" : undefined} HelperText={err ? "กรุณาระบุเหตุผลที่ส่งกลับ" : undefined} />
            )}
          </Section>
          <ButtonRow>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={toTrip} />
            <PrimaryButton Text="ยืนยันผลการพิจารณา" Size="lg" onClick={decide} />
          </ButtonRow>
        </>
      )}

      <PartEditModal item={editItem && { ...editItem, used: editItem.usedQty }} onCancel={() => setEditK(null)}
        onSave={(v) => { if (editItem) hireEditUsed(trip, car, editItem.k, v.used); setEditK(null); }} />
      <PartAddModal open={adding} onCancel={() => setAdding(false)} onAdd={(p) => { hireAddPart(trip, car, p); setAdding(false); }} />
      <CannotPopup open={!!cannot} car={car} parts={job.parts} used={isCannot ? job.cannot!.used : null} reason={why} error={whyErr}
        onReason={(v) => { setWhy(v); if (v.trim()) setWhyErr(false); }} onOk={saveCannot} onCancel={() => setCannot(null)} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { const p = pending; setPending(null); p?.run(); }} />
    </>
  );
}
