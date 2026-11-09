"use client";
/* S10 Step 1 · ตรวจสภาพก่อนบำรุงรักษา (/trips/job/receive/) — stepPage({ step: 1 }) + inspectStep() ใน screens.js (รีวิวทีมออกแบบ 5 พ.ย. 2569 · R86 9 พ.ย. 2569 Figma bc2571f)
   กรอบ StepFrame (แถบขั้นตอน 1/2 · ข้อมูลยานพาหนะ · การนัดหมาย · ปุ่ม "บำรุงรักษาไม่ได้" ที่หัว — คืนอะไหล่ตามแผนทั้งหมด)
   → แบบตรวจสภาพตามประเภทยานพาหนะ (R86 · แทนรายการเอกสารรับยานพาหนะ ReceiptChecklist เดิม): กระเช้าแก้ไฟ/กระเช้าฮอทไลน์ = แบบกระเช้า 30 รายการ · รถพ่วงฉีดน้ำ = แบบรถพ่วงฉีดน้ำ 19 รายการ (inspectForm)
     VehicleAndReporterInfo ชื่อแบบเป็นหัว + ข้อมูลส่วนบนของใบตรวจ (มือถือ DisplayBox) → patterns/CheckTable "รายการตรวจสภาพ" + Badge จำนวน (รายการ · ปกติ · แก้ไข · หมายเหตุ + เพิ่มรายการ · มือถือการ์ดรายข้อ)
   → HandoverSignature "ลงนามการตรวจสภาพ" (ผู้ตรวจ (กบค.) · ผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ) — SIGN_IN 9 พ.ย. 2569 · บังคับ "เรื่องลงนาม require")
   → Section header "ภาพก่อนเริ่มงาน" + File upload 2 ช่อง → ปุ่ม "ย้อนกลับ" (หน้ารายละเอียดแผนเดินทาง) · "ยืนยันการตรวจสภาพ" (Disabled จนลงนามครบทั้งสองฝั่ง) → Step 2
   "เซ็นลงนาม" → Modal Signature "ลงนามการตรวจสภาพ" (วาดลายเซ็นได้จริง) · ค่าที่กรอกเก็บเป็นร่าง (ออกจากหน้าแล้วกลับมาไม่หาย)
   แผนจ้างดำเนินการใช้หน้าเดียวกัน กบค. เป็นผู้รับมอบ (ใบจ้างไม่มีพนักงานในใบ ⇒ ตัวเลือก = พนักงาน กบค. ทั้งหมด staffOf · COMPOSED.md) */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HandoverSignature } from "@/components/maintain-d/HandoverSignature";
import { ModalSignature } from "@/components/maintain-d/ModalSignature";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { CheckTable } from "@/components/patterns/CheckTable";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { FileUpload } from "@/components/vms/FileUpload";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { BEFORE, confirmInspect, emptyReceive, INSPECT_OPTS, inspectForm, patchJob, PEOPLE, staffOf, type ReceiveForm } from "@/lib/mock/jobs";
import { ButtonRow, jobHref, Section, toUpload, tripHref, useTripCar } from "../../_lib/ui";
import { StepFrame } from "../StepFrame";

/* SIGN_IN ของ screens.js (9 พ.ย. 2569 ตามท้ายใบตรวจ · เดิม ผู้ส่งมอบ / ผู้รับมอบ) · ช่องเลือกชื่อ placeholder "เลือก" + ป้าย (signSection) */
const SLOTS = [
  { LabelText: "ผู้ตรวจ (หน่วยงานผู้ดำเนินการ)", Placeholder: "เลือกผู้ตรวจ (หน่วยงานผู้ดำเนินการ)" },
  { LabelText: "ผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ)", Placeholder: "เลือกผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ)" },
];

export function ReceivePage() {
  const router = useRouter();
  const { trip, car, job, actor } = useTripCar();
  const [sign, setSign] = useState(-1);
  const away = !!trip && !!car && !!job && job.status !== "doing";   // ยังไม่เริ่ม / ปิดแล้ว → หน้างานรายคัน
  /* เปิดหน้านี้ตอนงานไม่ได้อยู่ระหว่างบำรุงรักษา → หน้างานรายคัน · ปิดงาน/บำรุงรักษาไม่ได้จากหน้านี้เอง (สถานะเปลี่ยนระหว่างอยู่หน้า) ไม่พาไปไหน ให้ปุ่มพากลับหน้าแผนเดินทาง */
  const [awayAtOpen] = useState(() => ({ v: null as boolean | null }));
  if (awayAtOpen.v === null && trip && car && job) awayAtOpen.v = away;
  useEffect(() => { if (awayAtOpen.v && trip && car) router.replace(jobHref(trip, car.id)); }, [awayAtOpen, trip, car, router]);
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  if (awayAtOpen.v) return null;
  const f: ReceiveForm = job.receive ?? emptyReceive(car);
  const put = (fn: (f: ReceiveForm) => ReceiveForm) => patchJob(trip.id, car.id, (j) => ({ ...j, receive: fn(j.receive ?? emptyReceive(car)) }));
  const options = [staffOf(trip), [PEOPLE.ownerSigner]];
  const fm = inspectForm(car, trip.planMr);
  const signed = f.signers.every((x) => !!x.sig);
  const confirm = () => {
    if (!signed || !actor) return;
    confirmInspect(trip, car.id);
    router.push(jobHref(trip, car.id, "close/"));
  };

  return (
    <StepFrame trip={trip} car={car} job={job} step={1} used={job.parts.map(() => 0)} actor={actor}>
      <VehicleAndReporterInfo Title={fm.title} pairs={fm.kv} />
      <CheckTable Title="รายการตรวจสภาพ" options={INSPECT_OPTS} items={f.items} readonly={!actor}
        onChange={(i, p) => put((x) => ({ ...x, items: x.items.map((it, k) => (k === i ? { ...it, ...p } : it)) }))} />
      <HandoverSignature Title="ลงนามการตรวจสภาพ"
        slots={SLOTS.map((s, i) => ({ ...s, options: options[i], value: f.signers[i].name, signed: !!f.signers[i].sig }))}
        onPick={(i, name) => put((x) => ({ ...x, signers: x.signers.map((s, k) => (k === i ? { name, sig: s.name === name ? s.sig : null } : s)) as ReceiveForm["signers"] }))}
        onSign={(i) => setSign(i)} />
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
      <ModalSignature open={sign >= 0} Title="ลงนามการตรวจสภาพ" signer={[SLOTS[Math.max(0, sign)].LabelText, f.signers[Math.max(0, sign)].name ?? ""]}
        value={sign >= 0 && f.signers[sign].sig !== "sample" ? f.signers[sign].sig : null}
        onSave={(url) => { const i = sign; put((x) => ({ ...x, signers: x.signers.map((s, k) => (k === i ? { ...s, sig: url } : s)) as ReceiveForm["signers"] })); setSign(-1); }}
        onClose={() => setSign(-1)} />
    </StepFrame>
  );
}
