"use client";
/* งานรายคันของแผนจ้างดำเนินการ (/trips/hire/job/?trip=TV&car=<ทะเบียน>) — แยก view ตามบทบาท (เจ้าของงาน 4 พ.ย. 2569 "อยากให้แยก view")
   ผู้รับจ้าง (S23):
     ยังไม่เริ่ม / อยู่ระหว่างบำรุงรักษา = jobPage({ vendor }) V.3–V.5 · ปุ่ม "บำรุงรักษาไม่ได้" + "เริ่มงาน"/"ปิดงาน"
       ยังไม่เริ่ม: อะไหล่ตามแผนดูอย่างเดียว (4 คอลัมน์ ไม่มีปุ่ม) · เริ่มแล้ว: ภาพก่อนเริ่มงานเป็น File upload (ไอคอนภาพ + แถบความคืบหน้า) · น้ำมันไฮโดรลิก · อะไหล่มีไอคอนแก้ไข ลบ + "เพิ่มอะไหล่"
     ดำเนินการบำรุงรักษาแล้ว / แจ้งบำรุงรักษาไม่ได้ / รอตรวจรับ / ส่งกลับแก้ไข = hireJob() V.6–V.14 · แก้ไข ลบ เพิ่ม อะไหล่ที่ใช้จริง อะไหล่ส่งคืน และภาพได้ · "ส่งตรวจงาน" ทีละคัน
     เสร็จสิ้น / บำรุงรักษาไม่ได้ (หลัง กบค. อนุมัติ) = hireJob ดูอย่างเดียว (จอ Figma ไม่ได้วาด)
   กบค. (S11): รอตรวจรับ = hireJob({ kbk }) J.2–J.8 ดูอย่างเดียว + ผลการพิจารณาแบบการ์ด S2 (อนุมัติ / ส่งกลับแก้ไข + เหตุผล) · สถานะอื่นดูอย่างเดียว
   หน้ารับรถ / ปิดงาน ใช้หน้าเดียวกับ S10 (/trips/job/receive/ · /trips/job/close/ ของชุด C1) — หน้านั้นเรียก hireStarted / hireClosed ใน lib/mock/hire
   อ้างอิง: Page header · Alert · Section label · Table · File upload · Radio text card · Text area ของไฟล์ Component + VehicleAndReporterInfo · IncidentPhotoGallery ของไฟล์ Maintain-D
            + หน้า RP & MA Job ของ UI Release#2 (Page header Badge + ปุ่มขวา ตาม screens.js) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { Alert } from "@/components/vms/Alert";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { FileUpload, type UploadFile } from "@/components/vms/FileUpload";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { TertiaryButton } from "@/components/vms/TertiaryButton";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput } from "@/components/vms/TextInput";
import {
  JOB_STATUS, JOB_TEXT, JOB_TIMES, LAST_OIL_JOB, ODOMETER, OIL_JOB_OPTIONS, PEOPLE, applyHireSample, badgeOf, carOf, fileSize, isCannotJob, jobWork, oilSampled, retCells,
  tripLoc, tripPhone, updateJob, useHire, type HireJob, type WorkItem,
} from "@/lib/mock/hire";
import { notify, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { BtnRow, tripHref, useSample } from "../../../_c2/ui";
import { CannotModal, PartAddModal, PartEditModal, RET_COLS, Row } from "./popups";

/* JOB_COLS (ตามแผน) · WORK_COLS2 (ใช้จริง) · คอลัมน์ไอคอนแก้ไข + ลบ กว้าง 104 */
const JOB_COLS: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ตามแผน", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "หน่วย", width: 110 }];
const WORK_COLS2: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ที่ใช้", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "จำนวนที่ใช้จริง", width: 140 }, { head: "หน่วย", width: 110 }];
const ICON_COL: TableColumn = { head: "", width: 104, Style: "Action icons" };
const SAMPLES = { S23: { role: "ผู้รับจ้าง" as const, apply: () => applyHireSample("S23") }, S11: { role: "กบค." as const, apply: () => applyHireSample("S11") } };
const DECISIONS = [
  { Text: "อนุมัติ", SupportingText: "งานของรถคันนี้ผ่านการตรวจรับ และรับคืนอะไหล่ตามรายการ" },
  { Text: "ส่งกลับแก้ไข", SupportingText: "แจ้งเหตุผลให้ผู้รับจ้างแก้ไขแล้วส่งตรวจงานใหม่" },
];
const T = JOB_TIMES.hire;
/* หน้ารับรถ / ปิดงานของ S10 (ชุด C1) */
const receiveHref = (car: string) => "/trips/job/receive/?trip=TV&car=" + car;
const closeHref = (car: string) => "/trips/job/close/?trip=TV&car=" + car;

type Pending = { spec: ConfirmSpec; run: () => void };
interface Uploading extends UploadFile { id: number; progress: number }

function HireJobPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending0 = useSample(SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const role = useRole();
  const h = useHire();
  const carId = sp.get("car") ?? "";
  const j = h.jobs[carId];
  const c = carOf(carId);

  const [editK, setEditK] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [cannot, setCannot] = useState<null | { rows: WorkItem[]; edit: boolean }>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [dec, setDec] = useState("อนุมัติ");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState(false);
  const [uploads, setUploads] = useState<Uploading[]>([]);

  /* อัปโหลดภาพ: แถบความคืบหน้าเดินทีละ 20% (จำลอง) · ครบ 100% แล้วเข้ารายการภาพของงาน */
  const active = uploads.some((u) => !u.err);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setUploads((us) => us.map((u) => (u.err ? u : { ...u, progress: Math.min(100, u.progress + 20) }))), 700);
    return () => clearInterval(t);
  }, [active]);
  useEffect(() => {
    const done = uploads.filter((u) => !u.err && u.progress >= 100);
    if (!done.length) return;
    updateJob(carId, (x) => ({ ...x, photos: [...x.photos, ...done.map((u) => ({ name: u.name, size: u.size ?? "" }))] }));
    setUploads((us) => us.filter((u) => !done.some((d) => d.id === u.id)));
  }, [uploads, carId]);

  if (pending0) return null;
  if (sp.get("trip") !== "TV" || !j || !c || !h.trip.carIds.includes(carId)) return <EmptyStateSearchNotFound />;

  const vendor = role === "ผู้รับจ้าง", kbk = role === "กบค.";
  const s = j.status;
  const pre = s === "todo" || s === "doing";
  const isCannot = isCannotJob(j);
  const ed = vendor && (s === "doing" || s === "worked" || s === "reported" || s === "wait" || s === "returned");   // ผู้รับจ้างแก้ไข ลบ อะไหล่และภาพได้ ตั้งแต่เริ่มงานจนถึงตรวจรับ
  const review = kbk && s === "wait";
  const put = (fn: (x: HireJob) => HireJob) => updateJob(carId, fn);

  /* ---------- การกระทำ ---------- */
  const openCannot = (edit: boolean) => {
    const rows = s === "doing"
      ? j.work.map((w, k) => ({ ...w, usedQty: Math.min(w.planQty, JOB_TEXT.usedWhenCannot[k] ?? 0) }))   // CANNOT_USED ตัวอย่างของจอ (ช่องในตารางเป็นข้อความ)
      : j.work.map((w) => (isCannot || s === "todo" ? w : { ...w, usedQty: 0 }));
    setCannot({ rows, edit });
  };
  const saveCannot = (r: string) => {
    if (!cannot) return;
    const rows = cannot.rows;
    put((x) => ({ ...x, status: "reported", cannotReason: r, reportedBy: x.reportedBy && cannot.edit ? x.reportedBy : PEOPLE.vendorBy, reportedAt: cannot.edit && x.reportedAt ? x.reportedAt : T.reported,
      work: rows, usedWhenCannot: rows.map((w) => w.usedQty) }));
    setCannot(null);
    if (!cannot.edit) { notify("บันทึกบำรุงรักษาไม่ได้แล้ว"); router.push(tripHref); }
  };
  const send = () => setPending({
    spec: { title: "ยืนยันส่งตรวจงาน · " + c.plate, sub: "งานของรถคันนี้จะส่งให้ กบค. ตรวจรับ", ok: "ส่งตรวจงาน" },
    run: () => { put((x) => ({ ...x, status: "wait", sentAt: isCannot ? T.sentCannot : T.sent, sentBy: PEOPLE.vendorBy, returnReason: undefined })); notify("ส่งตรวจงานแล้ว"); },
  });
  const decide = () => {
    if (dec === "ส่งกลับแก้ไข") {
      if (!reason.trim()) { setErr(true); return; }
      setPending({
        spec: { title: "ยืนยันส่งกลับแก้ไข", sub: "งานของรถคันนี้จะกลับไปให้ผู้รับจ้างแก้ไขตามเหตุผลที่ระบุ แล้วส่งตรวจงานใหม่", ok: "ส่งกลับ" },
        run: () => { put((x) => ({ ...x, status: "returned", returnReason: reason.trim() })); notify("ส่งกลับให้ผู้รับจ้างแก้ไขแล้ว"); router.push(tripHref); },
      });
      return;
    }
    setPending({
      spec: { title: "ยืนยันอนุมัติงานบำรุงรักษา · " + c.plate, sub: "รถคันนี้จะเป็น \"" + (isCannot ? "บำรุงรักษาไม่ได้" : "เสร็จสิ้น") + "\" และรับคืนอะไหล่ตามรายการ", ok: "อนุมัติ" },
      run: () => {
        put((x) => ({ ...x, status: isCannot ? "cannot" : "done", reviewedBy: PEOPLE.jobBy, oil: !isCannot && oilSampled(x.oilChoice ?? -1) ? "wait" : undefined }));
        notify("อนุมัติงานบำรุงรักษาแล้ว");
        router.push(tripHref);
      },
    });
  };
  const delPart = (k: number) => setPending({
    spec: { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: j.work[k].part + " จะถูกเอาออกจากรถคันนี้", cancel: "ยกเลิก", ok: "เอาออก" },
    run: () => put((x) => ({ ...x, work: x.work.filter((_, i) => i !== k), codes: undefined, usedWhenCannot: isCannot ? x.work.filter((_, i) => i !== k).map((w) => w.usedQty) : x.usedWhenCannot })),
  });
  const onFiles = (fs: File[]) => {
    const room = 10 - j.photos.length - uploads.length;
    const next = fs.slice(0, Math.max(0, room)).map((f, i) => ({ id: Date.now() + i, name: f.name, size: fileSize(f.size), progress: 0, err: !/\.(jpe?g|png)$/i.test(f.name) }));
    setUploads((us) => [...us, ...next]);
  };
  const onDeletePhoto = (i: number) => {
    if (i < j.photos.length) put((x) => ({ ...x, photos: x.photos.filter((_, k) => k !== i) }));
    else { const u = uploads[i - j.photos.length]; setUploads((us) => us.filter((x) => x.id !== u?.id)); }
  };

  /* ---------- ปุ่มหัวหน้า ---------- */
  const size = mob ? "lg" : "md";
  const B2 = (a: [string, () => void], b: [string, () => void]) => <>
    <SecondaryButton Text={a[0]} Size={size} onClick={a[1]} />
    <PrimaryButton Text={b[0]} Size={size} onClick={b[1]} />
  </>;
  const go = (href: string) => () => router.push(href);
  let actions = null;
  if (vendor) {
    if (s === "todo") actions = B2(["บำรุงรักษาไม่ได้", () => openCannot(false)], ["เริ่มงาน", go(receiveHref(carId))]);
    else if (s === "doing") actions = B2(["บำรุงรักษาไม่ได้", () => openCannot(false)], ["ปิดงาน", go(closeHref(carId))]);
    else if (s === "worked") actions = B2(["แก้ไขงาน", go(closeHref(carId))], ["ส่งตรวจงาน", send]);
    else if (s === "reported") actions = B2(["แก้ไขงาน", () => openCannot(true)], ["ส่งตรวจงาน", send]);
    else if (s === "returned") actions = isCannot
      ? B2(["บำรุงรักษาไม่ได้", () => openCannot(false)], j.startedAt ? ["ปิดงาน", go(closeHref(carId))] : ["เริ่มงาน", go(receiveHref(carId))])
      : <PrimaryButton Text="แก้ไขงาน" Size={size} onClick={go(closeHref(carId))} />;
  }

  /* ---------- เนื้อหา ---------- */
  const t = h.trip;
  const odo = pre ? ODOMETER.selfJob : ODOMETER.hireJob;   // jobPage ใช้ค่าคงที่ของ S10 · hireJob ใช้ 176,050 / 5,840 (mock-data.md §6 ข้อ 3)
  const appt: [string, string][] = [["แผนเดินทาง", t.name], ["ผู้รับจ้าง", t.vendor ?? "-"], ["ช่วงวันทำงาน", t.d1 + " – " + t.d2], ["สถานที่บำรุงรักษา", tripLoc(t, c)], ["เบอร์ติดต่อ", tripPhone(t, c)]];
  if (s === "doing") appt.push(["เริ่มงาน", j.startedAt ?? T.start], ["ผู้เริ่มงาน", j.startedBy ?? PEOPLE.vendorBy]);
  if (s === "wait") appt.push(["ส่งตรวจงานเมื่อ", j.sentAt ?? T.sent], ["ผู้ส่ง", j.sentBy ?? PEOPLE.vendorBy]);

  const icons = (k: number, w: WorkItem): TableValue => ({ actions: [
    { IconSwap: "stylus-24-300-round", label: "แก้ไข " + w.part, onClick: () => setEditK(k) },
    { IconSwap: "delete-24-300-round", label: "ลบ " + w.part, onClick: () => delPart(k) },
  ] });
  const addBtn = <TertiaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" onClick={() => setAdding(true)} />;
  const tbl = (cols: TableColumn[], rows: TableValue[][]) => (mob ? <MobileCards columns={cols} rows={rows} /> : <Table columns={cols} rows={rows} />);
  const photosFiles = <FileUpload LabelText="ภาพก่อนเริ่มงาน" hint="JPG, PNG · สูงสุด 10 ภาพ" bar accept="image/jpeg,image/png" files={[...j.photos, ...uploads]} onFiles={onFiles} onDelete={onDeletePhoto} onDownload={() => {}} />;
  const gallery = <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + j.photos.length + ")"} photos={j.photos.map((p) => ({ alt: p.name }))} />;
  const work = jobWork(j);
  const retRowsAll = j.work.map((w, k) => ({ w, k }));

  const body = [];
  if (s === "returned" && j.returnReason) body.push(<Alert key="back" Color="Error" Text="กบค. ส่งกลับให้แก้ไข" SupportingText={j.returnReason} />);
  body.push(<VehicleAndReporterInfo key="veh" pairs={[["ทะเบียน", c.plate], ["ยี่ห้อ/รุ่น", c.model], ["ประเภท", c.type], ["หน่วยงานเจ้าของรถ", c.ownerUnit], ["เลขไมล์สะสม", odo.km], ["ชั่วโมงเครื่องจักรสะสม", odo.hours]]} />);
  body.push(<VehicleAndReporterInfo key="appt" Title="การนัดหมาย" pairs={appt} />);
  if (pre) {
    if (s === "doing") {
      body.push(<div key="ph">{vendor ? photosFiles : gallery}</div>);
      body.push(
        <section key="oil" className="flex flex-col gap-4">
          <SectionHeader Title="น้ำมันไฮโดรลิก" />
          <RadioTextCards options={OIL_JOB_OPTIONS.map((o) => ({ Text: o }))} value={OIL_JOB_OPTIONS[j.oilChoice ?? 2]} Disabled={!vendor}
            onChange={(v) => put((x) => ({ ...x, oilChoice: OIL_JOB_OPTIONS.indexOf(v) as 0 | 1 | 2 }))} />
          <Row><TextInput LabelText="เปลี่ยนน้ำมันครั้งล่าสุด" Text={LAST_OIL_JOB} State="Readonly" readOnly />{!mob && <div />}</Row>
        </section>,
      );
    }
    const canEdit = vendor && s === "doing";
    body.push(
      <section key="plan" className="flex flex-col gap-4">
        <SectionLabel Title={"รายการงานและอะไหล่ตามแผน (" + work.length + ")"} Actions={canEdit ? addBtn : undefined} />
        {tbl(canEdit ? [...JOB_COLS, ICON_COL] : JOB_COLS, work.map(({ w, k }) => [w.task, w.part, w.planQty, w.unit, ...(canEdit ? [icons(k, w)] : [])]))}
      </section>,
    );
  } else {
    if (isCannot) {
      body.push(<VehicleAndReporterInfo key="cannot" Title="บำรุงรักษาไม่ได้" pairs={[["สาเหตุที่บำรุงรักษาไม่ได้", j.cannotReason ?? ""], ["ผู้แจ้ง", j.reportedBy ?? PEOPLE.vendorBy], ["แจ้งเมื่อ", j.reportedAt ?? T.reported]]} />);
    } else {
      body.push(<VehicleAndReporterInfo key="res" Title="ผลการบำรุงรักษา" pairs={[["เริ่มงาน", j.startedAt ?? T.start], ["ปิดงาน", j.closedAt ?? T.end], ["ผู้บันทึก", j.recordedBy ?? PEOPLE.vendorBy],
        ["เลขไมล์หลังทำ", j.kmAfter ?? T.kmAfter], ["ชั่วโมงเครื่องจักรหลังทำ", j.hoursAfter ?? T.hoursAfter], ["น้ำมันไฮโดรลิก", OIL_JOB_OPTIONS[j.oilChoice ?? 2]]]} />);
      body.push(<div key="ph">{ed ? photosFiles : gallery}</div>);
      body.push(
        <section key="work" className="flex flex-col gap-4">
          <SectionLabel Title={"รายการงานและอะไหล่ที่ใช้จริง (" + work.length + ")"} Actions={ed ? addBtn : undefined} />
          {tbl(ed ? [...WORK_COLS2, ICON_COL] : WORK_COLS2, work.map(({ w, k }) => [w.task, w.part, w.planQty, w.usedQty, w.unit, ...(ed ? [icons(k, w)] : [])]))}
        </section>,
      );
    }
    body.push(
      <section key="ret" className="flex flex-col gap-4">
        <SectionLabel Title={"อะไหล่ส่งคืน (" + retRowsAll.length + ")"} Actions={ed ? addBtn : undefined} />
        {tbl(ed ? [...RET_COLS, ICON_COL] : RET_COLS, retRowsAll.map(({ w, k }) => [...retCells(w), ...(ed ? [icons(k, w)] : [])]))}
      </section>,
    );
  }
  if (review) {
    body.push(
      <section key="dec" className="flex flex-col gap-4">
        <SectionLabel Title="ผลการพิจารณา" />
        <RadioTextCards options={DECISIONS} value={dec} onChange={(v) => { setDec(v); setErr(false); }} />
        {dec === "ส่งกลับแก้ไข" && (
          <TextArea LabelText="เหตุผลที่ส่งกลับ" Text={reason} Placeholder="ระบุเหตุผลที่ส่งกลับ" onChange={(v) => { setReason(v); if (v.trim()) setErr(false); }}
            State={err ? "Error" : undefined} HelperText={err ? "กรุณาระบุเหตุผลที่ส่งกลับ" : undefined} />
        )}
      </section>,
      <BtnRow key="btn">
        <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={go(tripHref)} />
        <PrimaryButton Text="ยืนยันผลการพิจารณา" Size="lg" onClick={decide} />
      </BtnRow>,
    );
  }

  const editItem = editK != null ? j.work[editK] ?? null : null;
  return (
    <>
      <PageHeader Title={c.plate} Badge={badgeOf(JOB_STATUS[s])} onBack={go(tripHref)} Actions={actions ?? undefined}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "แผนเดินทาง ไตรมาส 1", href: kbk ? "/quarter/trips/?id=Z7000001&q=1" : undefined }, { Text: t.name, href: tripHref }, { Text: c.plate }]} />
      <div className="flex flex-col gap-8">{body}</div>

      <PartEditModal key={editK ?? -1} item={editItem} onCancel={() => setEditK(null)}
        onSave={(used) => { const k = editK!; put((x) => { const w = x.work.map((it, i) => (i === k ? { ...it, usedQty: used } : it)); return { ...x, work: w, usedWhenCannot: isCannot ? w.map((it) => it.usedQty) : x.usedWhenCannot }; }); setEditK(null); }} />
      <PartAddModal open={adding} onCancel={() => setAdding(false)}
        onAdd={(p) => { put((x) => ({ ...x, work: [...x.work, { task: "-", part: p.name.trim(), planQty: 0, usedQty: +p.qty, unit: p.unit }], codes: { ...x.codes, [x.work.length]: p.code.trim() } })); setAdding(false); }} />
      <CannotModal open={!!cannot} plate={c.plate} rows={cannot?.rows ?? []} reason={cannot?.edit || s === "returned" ? j.cannotReason : undefined} onCancel={() => setCannot(null)} onOk={saveCannot} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { const p = pending; setPending(null); p?.run(); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><HireJobPage /></Suspense></AppFrame>;
}
