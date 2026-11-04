"use client";
/* S10 P4 · รับรถเข้าบำรุงรักษา (กดเริ่มงาน) — receivePage() ใน screens.js
   Page header "รับรถเข้าบำรุงรักษา · <ทะเบียน>" → VehicleAndReporterInfo "ข้อมูลยานพาหนะ" (6 คู่ + วันที่รับรถ)
   → ReceiptChecklist "รายการเอกสารรับรถ" (13 รายการ · ไฟล์ Maintain-D) → HandoverSignature "ลงนามการรับมอบรถ" (ผู้ส่งมอบ หน่วยงานเจ้าของรถ · ผู้รับมอบ กบค.)
   → Section header "ภาพก่อนเริ่มงาน" + File upload 2 ช่อง ("รูปรถ + ทะเบียน" · "อะไหล่ใหม่") → ปุ่ม "ย้อนกลับ" · "ยืนยันรับรถและเริ่มงาน" (กดได้เมื่อลงนามครบทั้งสองฝั่ง)
   "เซ็นลงนาม" → Modal Signature "ลงนามการรับมอบรถ" (วาดลายเซ็นได้จริง) · ยืนยัน → อยู่ระหว่างบำรุงรักษา + toast "เริ่มงานบำรุงรักษาแล้ว"
   ค่าที่กรอกเก็บเป็นร่างในข้อมูลจำลอง (ออกจากหน้าแล้วกลับมาไม่หาย)
   แผนจ้างดำเนินการใช้หน้าเดียวกัน กบค. เป็นผู้รับมอบ (ใบจ้างไม่มีพนักงานในใบ ⇒ ตัวเลือก = พนักงาน กบค. ทั้งหมด staffOf · COMPOSED.md) */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HandoverSignature } from "@/components/maintain-d/HandoverSignature";
import { ModalSignature } from "@/components/maintain-d/ModalSignature";
import { ReceiptChecklist } from "@/components/maintain-d/ReceiptChecklist";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { FileUpload } from "@/components/vms/FileUpload";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { BEFORE, emptyReceive, patchJob, PEOPLE, SIGN_DATE, staffOf, startJob, tripLoc, tripPhone, type ReceiveForm } from "@/lib/mock/jobs";
import { notify } from "@/lib/mock/store";
import { ButtonRow, useCrumbs, jobHref, Section, toUpload, useBack, useTripCar } from "../../_lib/ui";

const SLOTS = [
  { LabelText: "ผู้ส่งมอบรถ (หน่วยงานเจ้าของรถ)", Placeholder: "เลือกผู้ส่งมอบรถ (หน่วยงานเจ้าของรถ)" },
  { LabelText: "ผู้รับมอบรถ (กบค.)", Placeholder: "เลือกผู้รับมอบรถ (กบค.)" },
];

export function ReceivePage() {
  const crumbs = useCrumbs();
  const router = useRouter();
  const back = useBack();
  const { trip, car, job, actor } = useTripCar();
  const [sign, setSign] = useState(-1);
  if (!trip || !car || !job) return <EmptyStateSearchNotFound />;
  const f: ReceiveForm = job.receive ?? emptyReceive();
  const put = (fn: (f: ReceiveForm) => ReceiveForm) => patchJob(trip.id, car.id, (j) => ({ ...j, receive: fn(j.receive ?? emptyReceive()) }));
  const options = [[PEOPLE.ownerSigner], staffOf(trip)];
  const signed = f.signers.every((x) => !!x.sig);
  const confirm = () => {
    if (!signed || !actor) return;
    startJob(trip, car.id);
    notify("เริ่มงานบำรุงรักษาแล้ว");
    router.push(jobHref(trip, car.id));
  };
  const jobPage = jobHref(trip, car.id);

  return (
    <>
      <PageHeader Title={"รับรถเข้าบำรุงรักษา · " + car.plate} crumbs={crumbs.job(trip, "รับรถ")} onBack={() => back(jobPage)} />
      <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะ" pairs={[["ทะเบียน", car.plate], ["ยี่ห้อ/รุ่น", car.model], ["หน่วยงานเจ้าของรถ", car.owner],
        ["สถานที่บำรุงรักษา", tripLoc(trip, car)], ["เบอร์ติดต่อ", tripPhone(trip, car)], ["วันที่รับรถ", SIGN_DATE]]} />
      <ReceiptChecklist Title="รายการเอกสารรับรถ" items={f.items} readonly={!actor}
        onChange={(i, p) => put((x) => ({ ...x, items: x.items.map((it, k) => (k === i ? { ...it, ...p } : it)) }))} />
      <HandoverSignature Title="ลงนามการรับมอบรถ"
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
        <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={() => back(jobPage)} />
        <PrimaryButton Text="ยืนยันรับรถและเริ่มงาน" Size="lg" State={signed && actor ? "Default" : "Disabled"} onClick={confirm} />
      </ButtonRow>
      <ModalSignature open={sign >= 0} Title="ลงนามการรับมอบรถ" signer={[SLOTS[Math.max(0, sign)].LabelText, f.signers[Math.max(0, sign)].name ?? ""]}
        value={sign >= 0 && f.signers[sign].sig !== "sample" ? f.signers[sign].sig : null}
        onSave={(url) => { const i = sign; put((x) => ({ ...x, signers: x.signers.map((s, k) => (k === i ? { ...s, sig: url } : s)) as ReceiveForm["signers"] })); setSign(-1); }}
        onClose={() => setSign(-1)} />
    </>
  );
}
