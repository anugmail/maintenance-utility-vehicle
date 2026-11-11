"use client";
/* S10 Step 1 · ตรวจสภาพก่อนบำรุงรักษา (/trips/job/receive/) — stepPage({ step: 1 }) + inspectStep() ใน screens.js (รีวิวทีมออกแบบ 5 พ.ย. 2569 · R86 9 พ.ย. 2569 Figma bc2571f)
   กรอบ StepFrame (แถบขั้นตอน 1/2 · ข้อมูลยานพาหนะ · การนัดหมาย · ปุ่ม "บำรุงรักษาไม่ได้" ที่หัว — คืนอะไหล่ตามแผนทั้งหมด)
   → Section header "วันเวลาเริ่มงาน" (11 พ.ย. 2569 แทน "วันดำเนินการ" R83 ที่เอาออก) Text input ไอคอน calendar_month ครึ่งแถว · กด = popup แก้ไขวันเวลาเริ่มงาน (ผู้ดำเนินการ)
   → แบบตรวจสภาพตามประเภทยานพาหนะ (R86 · แทนรายการเอกสารรับยานพาหนะ ReceiptChecklist เดิม): กระเช้าแก้ไฟ/กระเช้าฮอทไลน์ = แบบกระเช้า 30 รายการ · รถพ่วงฉีดน้ำ = แบบรถพ่วงฉีดน้ำ 19 รายการ (inspectForm)
     VehicleAndReporterInfo ชื่อแบบเป็นหัว + ข้อมูลส่วนบนของใบตรวจ (มือถือ DisplayBox) → patterns/CheckTable "รายการตรวจสภาพ" + Badge จำนวน (รายการ · ปกติ · แก้ไข · หมายเหตุ + เพิ่มรายการ · มือถือการ์ดรายข้อ)
   → SignRequest "ลงนามการตรวจสภาพอะไหล่" (ผู้ตรวจ · ผู้รับการตรวจ — SIGN_IN 9 พ.ย. 2569 · บังคับ "เรื่องลงนาม require" · 11 พ.ย. 2569 เลือกชื่อ ส่งให้ลงนาม ผู้ลงนามยืนยัน แทนวาดลายเซ็น)
   11 พ.ย. 2569 เจ้าของงาน: เอาส่วน "วันดำเนินการ" ออกจาก Step 1 · แสดง "วันเวลาเริ่มงาน" จาก popup เริ่มงาน แก้ได้ (DateTimeModal)
   → Section header "ภาพก่อนเริ่มงาน" + File upload 2 ช่อง → ปุ่ม "ย้อนกลับ" (หน้ารายละเอียดแผนเดินทาง) · "ยืนยันการตรวจสภาพ" (Disabled จนลงนามครบทั้งสองฝั่ง) → Step 2
   ค่าที่กรอกเก็บเป็นร่าง (ออกจากหน้าแล้วกลับมาไม่หาย) · ผู้ลงนามยืนยันผ่านแถบต้นแบบ "คำขอลงนาม" (จำลองการเข้าระบบแล้วยืนยัน)
   แผนจ้างดำเนินการใช้หน้าเดียวกัน กบค. เป็นผู้รับมอบ (ใบจ้างไม่มีพนักงานในใบ ⇒ ตัวเลือก = พนักงาน กบค. ทั้งหมด staffOf · COMPOSED.md)
   S23 ผู้รับจ้าง (stepPage({ vendor, step: 1 }) · R87 · V.4–V.6): (เดิม) ช่อง "วันดำเนินการ" State=Readonly (ผู้รับจ้างแก้ข้อมูลยานพาหนะในแผนเดินทางไม่ได้ · ยังไม่เคาะ)
     · ผู้ตรวจฝั่งผู้ดำเนินการ = ช่างผู้รับจ้าง (vendorSign · HIRE_TECH) */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { CheckTable } from "@/components/patterns/CheckTable";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { FileUpload } from "@/components/vms/FileUpload";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TextInput } from "@/components/vms/TextInput";
import { BEFORE, confirmInspect, requestSign, setStartedAt, thaiNow, emptyReceive, filledReceive, INSPECT_OPTS, inspectForm, patchJob, PEOPLE, staffOf, type ReceiveForm } from "@/lib/mock/jobs";
import { ButtonRow, DateTimeModal, Grid, jobHref, Section, SignRequest, toUpload, tripHref, useTripCar } from "../../_lib/ui";
import { notify } from "@/lib/mock/store";
import { StepFrame } from "../StepFrame";
import { useProtoForm } from "@/lib/protoForm";

/* SIGN_IN ของ screens.js (9 พ.ย. 2569 ตามท้ายใบตรวจ · เดิม ผู้ส่งมอบ / ผู้รับมอบ) · ช่องเลือกชื่อ placeholder "เลือก" + ป้าย (signSection) */
export const SLOTS = [
  { LabelText: "ผู้ตรวจ (หน่วยงานผู้ดำเนินการ)", Placeholder: "เลือกผู้ตรวจ (หน่วยงานผู้ดำเนินการ)" },
  { LabelText: "ผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ)", Placeholder: "เลือกผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ)" },
];

export function ReceivePage() {
  const router = useRouter();
  const { trip, car, job, actor, vendor } = useTripCar();
  const [editAt, setEditAt] = useState(false);
  const away = !!trip && !!car && !!job && job.status !== "doing";   // ยังไม่เริ่ม / ปิดแล้ว → หน้างานรายคัน
  /* เปิดหน้านี้ตอนงานไม่ได้อยู่ระหว่างบำรุงรักษา → หน้างานรายคัน · ปิดงาน/บำรุงรักษาไม่ได้จากหน้านี้เอง (สถานะเปลี่ยนระหว่างอยู่หน้า) ไม่พาไปไหน ให้ปุ่มพากลับหน้าแผนเดินทาง */
  const [awayAtOpen] = useState(() => ({ v: null as boolean | null }));
  if (awayAtOpen.v === null && trip && car && job) awayAtOpen.v = away;
  useEffect(() => { if (awayAtOpen.v && trip && car) router.replace(jobHref(trip, car.id)); }, [awayAtOpen, trip, car, router]);
  /* ปุ่มต้นแบบ (แถบต้นแบบ · lib/protoForm.ts): กรอกข้อมูลตัวอย่าง = รายการตรวจครบ (ปกติ · 1 รายการแก้ไขพร้อมหมายเหตุ) · ผู้ตรวจ ผู้รับการตรวจ ลงนามแล้ว · ภาพก่อนเริ่มงาน 2 ภาพ ⇒ ปุ่มยืนยันการตรวจสภาพกดได้
     ล้างค่า = Step 1 ของคันนี้กลับค่าเริ่มต้น (emptyReceive) */
  useProtoForm(trip && car && job && actor && !awayAtOpen.v ? {
    fill: () => {
      const x = filledReceive(vendor ? PEOPLE.vendorTech : staffOf(trip)[0] ?? PEOPLE.kbk, car);
      patchJob(trip.id, car.id, (j) => ({ ...j, receive: { ...x, signers: [{ name: vendor ? PEOPLE.vendorTech : staffOf(trip)[0] ?? x.signers[0].name, sig: "sample", at: thaiNow() }, { ...x.signers[1], at: thaiNow() }] } }));
    },
    clear: () => patchJob(trip.id, car.id, (j) => ({ ...j, receive: emptyReceive(car) })),
    dirty: !!job.receive && JSON.stringify(job.receive) !== JSON.stringify(emptyReceive(car)),
  } : null);
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  if (awayAtOpen.v) return null;
  const f: ReceiveForm = job.receive ?? emptyReceive(car);
  const put = (fn: (f: ReceiveForm) => ReceiveForm) => patchJob(trip.id, car.id, (j) => ({ ...j, receive: fn(j.receive ?? emptyReceive(car)) }));
  const options = [vendor ? [PEOPLE.vendorTech] : staffOf(trip), [PEOPLE.ownerSigner]];
  const fm = inspectForm(car, trip.planMr);
  const signed = f.signers.every((x) => !!x.sig);
  const confirm = () => {
    if (!signed || !actor) return;
    confirmInspect(trip, car.id);
    router.push(jobHref(trip, car.id, "close/"));
  };

  return (
    <StepFrame trip={trip} car={car} job={job} step={1} used={job.parts.map(() => 0)} actor={actor} vendor={vendor}>
      {/* วันเวลาเริ่มงาน (11 พ.ย. 2569 เจ้าของงาน "เอาวันดำเนินการในหน้าตรวจสภาพก่อนบำรุงรักษา Step1 ออก … เลือกมาแล้วก็มาแสดงในตอนสเต็ปแรก") — ค่าจาก popup เริ่มงาน แก้ได้ */}
      <Section>
        <SectionHeader Title="วันเวลาเริ่มงาน" />
        <Grid>
          <TextInput LabelText="เริ่มงาน" LeadingIconSwap="calendar_month-24-300-round" Text={job.startedAt ?? "-"} readOnly State={actor ? "Filled" : "Readonly"}
            onClick={() => actor && setEditAt(true)} aria-haspopup="dialog" />
        </Grid>
      </Section>
      <VehicleAndReporterInfo Title={fm.title} pairs={fm.kv} />
      <CheckTable Title="รายการตรวจสภาพ" options={INSPECT_OPTS} items={f.items} readonly={!actor}
        onChange={(i, p) => put((x) => ({ ...x, items: x.items.map((it, k) => (k === i ? { ...it, ...p } : it)) }))} />
      {/* 11 พ.ย. 2569 เลือกชื่อ → ส่งให้ลงนาม → ผู้ลงนามยืนยัน (แทนวาดลายเซ็น) · คำ "ลงนามการตรวจสภาพอะไหล่" */}
      <SignRequest Title="ลงนามการตรวจสภาพอะไหล่" readonly={!actor}
        slots={SLOTS.map((s, i) => ({ ...s, options: options[i], ...f.signers[i] }))}
        onPick={(i, name) => put((x) => ({ ...x, signers: x.signers.map((s, k) => (k === i ? (s.name === name ? s : { name, sig: null }) : s)) as ReceiveForm["signers"] }))}
        onSend={(i) => { requestSign(trip, car, "receive", i); notify("ส่งให้ " + (f.signers[i].name ?? "") + " ลงนามแล้ว · รอผู้ลงนามยืนยัน"); }} />
      <Section>
        <SectionHeader Title="ภาพก่อนเริ่มงาน" />
        {BEFORE.map((label, i) => (
          <FileUpload key={label} LabelText={label} files={f.photos[i] ?? []} hint="JPG, PNG · 1 ภาพ" accept=".jpg,.jpeg,.png" readonly={!actor}
            onFiles={(fs) => fs.length && put((x) => ({ ...x, photos: x.photos.map((p, k) => (k === i ? [toUpload(fs[0])] : p)) }))}
            onDelete={() => put((x) => ({ ...x, photos: x.photos.map((p, k) => (k === i ? [] : p)) }))} />
        ))}
      </Section>
      <ButtonRow>
        <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => router.push(tripHref(trip))} />
        <PrimaryButton Text="ยืนยันการตรวจสภาพ" Size="lg" State={signed && actor ? "Default" : "Disabled"} onClick={confirm} />
      </ButtonRow>
      <DateTimeModal open={editAt} title={"แก้ไขวันเวลาเริ่มงาน · " + car.plate} label="เริ่มงาน" value={job.startedAt ?? ""} ok="บันทึก"
        onCancel={() => setEditAt(false)} onOk={(at) => { setStartedAt(trip, car.id, at); setEditAt(false); }} />
    </StepFrame>
  );
}
