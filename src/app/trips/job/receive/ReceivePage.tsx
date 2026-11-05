"use client";
/* S10 Step 1 · ตรวจสภาพก่อนบำรุงรักษา (/trips/job/receive/) — stepPage({ step: 1 }) + receiptPanel() ใน screens.js (รีวิวทีมออกแบบ 5 พ.ย. 2569)
   กรอบ StepFrame (แถบขั้นตอน 1/2 · ข้อมูลยานพาหนะ · การนัดหมาย · ปุ่ม "บำรุงรักษาไม่ได้" ที่หัว — คืนอะไหล่ตามแผนทั้งหมด)
   → ReceiptChecklist "รายการเอกสารรับรถ" (13 รายการ · ไฟล์ Maintain-D) → HandoverSignature "ลงนามการตรวจสภาพ" (ผู้ส่งมอบรถ (หน่วยงานเจ้าของรถ) · ผู้รับมอบรถ (กบค.) · บังคับ "เรื่องลงนาม require")
   → Section header "ภาพก่อนเริ่มงาน" + File upload 2 ช่อง → ปุ่ม "ย้อนกลับ" (หน้ารายละเอียดแผนเดินทาง) · "ยืนยันการตรวจสภาพ" (Disabled จนลงนามครบทั้งสองฝั่ง) → Step 2
   "เซ็นลงนาม" → Modal Signature "ลงนามการตรวจสภาพ" (วาดลายเซ็นได้จริง) · ค่าที่กรอกเก็บเป็นร่าง (ออกจากหน้าแล้วกลับมาไม่หาย)
   แผนจ้างดำเนินการใช้หน้าเดียวกัน กบค. เป็นผู้รับมอบ (ใบจ้างไม่มีพนักงานในใบ ⇒ ตัวเลือก = พนักงาน กบค. ทั้งหมด staffOf · COMPOSED.md) */
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HandoverSignature } from "@/components/maintain-d/HandoverSignature";
import { ModalSignature } from "@/components/maintain-d/ModalSignature";
import { ReceiptChecklist } from "@/components/maintain-d/ReceiptChecklist";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { FileUpload } from "@/components/vms/FileUpload";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { BEFORE, confirmInspect, emptyReceive, patchJob, PEOPLE, staffOf, type ReceiveForm } from "@/lib/mock/jobs";
import { ButtonRow, jobHref, Section, toUpload, tripHref, useTripCar } from "../../_lib/ui";
import { StepFrame } from "../StepFrame";

const SLOTS = [
  { LabelText: "ผู้ส่งมอบรถ (หน่วยงานเจ้าของรถ)", Placeholder: "เลือกผู้ส่งมอบรถ (หน่วยงานเจ้าของรถ)" },
  { LabelText: "ผู้รับมอบรถ (กบค.)", Placeholder: "เลือกผู้รับมอบรถ (กบค.)" },
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
  const f: ReceiveForm = job.receive ?? emptyReceive();
  const put = (fn: (f: ReceiveForm) => ReceiveForm) => patchJob(trip.id, car.id, (j) => ({ ...j, receive: fn(j.receive ?? emptyReceive()) }));
  const options = [[PEOPLE.ownerSigner], staffOf(trip)];
  const signed = f.signers.every((x) => !!x.sig);
  const confirm = () => {
    if (!signed || !actor) return;
    confirmInspect(trip, car.id);
    router.push(jobHref(trip, car.id, "close/"));
  };

  return (
    <StepFrame trip={trip} car={car} job={job} step={1} used={job.parts.map(() => 0)} actor={actor}>
      <ReceiptChecklist Title="รายการเอกสารรับรถ" items={f.items} readonly={!actor}
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
