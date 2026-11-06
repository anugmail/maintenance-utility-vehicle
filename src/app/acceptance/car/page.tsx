"use client";
/* S13 L.2–L.4 · หน้า ผลการตรวจบำรุงรถ (/acceptance/car/?trip=T1&car=82-6789) — carResult() ใน screens.js
   ข้อมูลจากงานรายคัน (jobs.ts) ของแผนเดินทาง ?trip= · รถ ?car= (งานที่เสร็จสิ้น/บำรุงรักษาไม่ได้เท่านั้น ไม่ใช่ = ไม่พบ)
   ข้อมูลยานพาหนะ (6) → (ปกติ) เอกสารการตรวจบำรุงรถ (2) [ไฟล์ดาวน์โหลดได้อย่างเดียว] · ภาพก่อนเริ่มงาน (2) · รายการงานและอะไหล่ที่ใช้จริง (แถวปิดงาน)
                      → (บำรุงรักษาไม่ได้) สาเหตุที่บำรุงรักษาไม่ได้ (สาเหตุ · ผู้บันทึก · วันที่บันทึก)
   → ปุ่ม ย้อนกลับ · ยอมรับผลการตรวจบำรุงรถ (ยืนยันก่อน) · ยอมรับแล้ว = Alert Success แทนแถวปุ่ม
   ตัดตามเจ้าของงาน 4 พ.ย. 2569: กล่องเตือน "(Q19)" ของกรณีบำรุงรักษาไม่ได้ออก (Q19 ตอบแล้ว: บำรุงรักษาไม่ได้ = สาเหตุ + อะไหล่ส่งคืน) · ตัดรหัสอ้างอิงภายใน "(S14)" ออกจากข้อความบนจอ
   อ้างอิง: Section label · _File upload item base · Images · Table · Alert ของไฟล์ Component + VehicleAndReporterInfo · IncidentPhotoGallery ของไฟล์ Maintain-D
            + จอ carResult ของ UI Release#2 ผ่าน screens.js */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { Alert } from "@/components/vms/Alert";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { Table, type TableColumn } from "@/components/vms/Table";
import { ACCEPTANCE_DOCS, ACCEPT_DATES, ACCEPT_SAMPLES, ACCEPT_STATUS, acceptCar, accRecord, workRows } from "@/lib/mock/acceptance";
import { BEFORE, WSTAT } from "@/lib/mock/jobs";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { useSample } from "@/lib/useSample";
import { badgeOf, ButtonRow } from "../../trips/_lib/ui";
import { DocList } from "../_lib/ui";

/* WORK_COLS2 */
const WORK_COLS2: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ที่ใช้", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "จำนวนที่ใช้จริง", width: 140 }, { head: "หน่วย", width: 110 }];

function CarResult() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(ACCEPT_SAMPLES);
  const mob = useBreakpoint() === "Mobile";
  const owner = useRole() === "หน่วยงานเจ้าของยานพาหนะ";
  const mock = useMock();
  const [confirm, setConfirm] = useState(false);
  if (pending) return null;
  const rec = accRecord(mock, sp.get("trip"), sp.get("car"));
  if (!rec) return <EmptyStateSearchNotFound />;
  const { car, cannot, job } = rec;
  const ok = rec.accepted;
  const work = workRows(job);
  const plateNo = car.plate.split(" ")[0];
  const back = () => router.push("/acceptance/");
  const accept = () => {
    acceptCar(rec);
    setConfirm(false);
    notify("ยอมรับผลการตรวจบำรุงยานพาหนะ " + car.plate + " สำเร็จ");
    back();
  };

  return (
    <>
      <PageHeader Title={"ผลการตรวจบำรุงยานพาหนะ · " + car.plate} Badge={badgeOf(cannot ? WSTAT.cannot : ok ? ACCEPT_STATUS.ok : ACCEPT_STATUS.wait)} onBack={back}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: "รอตรวจสอบ", href: "/acceptance/" }, { Text: car.plate }]} />
      <div className="flex flex-col gap-8">
        <VehicleAndReporterInfo pairs={[["ทะเบียน", car.plate], ["ยี่ห้อ/รุ่น", car.model], ["หน่วยงานเจ้าของยานพาหนะ", car.owner], ["เลขที่ MR", rec.mr], ["วันที่บำรุง", rec.date], ["ผู้ทำ", rec.by]]} />
        {cannot ? (
          <DisplayBox Title="สาเหตุที่บำรุงรักษาไม่ได้" pairs={[["สาเหตุ", job.cannot?.reason ?? "-"], ["ผู้บันทึก", rec.by], ["วันที่บันทึก", rec.date]]} />
        ) : (
          <>
            <section className="flex flex-col gap-4">
              <SectionLabel Title="เอกสารการตรวจบำรุงยานพาหนะ (2)" />
              <DocList LabelText="ใบตรวจสภาพอะไหล่ · ใบตรวจสภาพงานบำรุงรักษา" files={ACCEPTANCE_DOCS(plateNo)} />
            </section>
            <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + BEFORE.length + ")"} photos={BEFORE.map((alt) => ({ alt }))} />
            <section className="flex flex-col gap-4">
              <SectionLabel Title={"รายการงานและอะไหล่ที่ใช้จริง (" + work.length + ")"} />
              {(() => { const rows = work.map((w) => [w.task, w.part, w.planQty, w.usedQty, w.unit]); return mob ? <MobileCards columns={WORK_COLS2} rows={rows} /> : <Table columns={WORK_COLS2} rows={rows} />; })()}
            </section>
          </>
        )}
        {ok ? (
          <Alert Color="Success" Text={"ยอมรับผลการตรวจบำรุงยานพาหนะแล้ว " + ACCEPT_DATES.car} SupportingText="รอคันอื่นในแผนครบแล้วจึงตรวจหลักฐานทั้งแผน" />
        ) : (
          <ButtonRow>
            <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
            {owner && <PrimaryButton Text="ยอมรับผลการตรวจบำรุงยานพาหนะ" Size="lg" onClick={() => setConfirm(true)} />}
          </ButtonRow>
        )}
      </div>
      <ConfirmDialog spec={confirm ? { title: "ยืนยันยอมรับผลการตรวจบำรุงยานพาหนะ", sub: car.plate + " · บำรุงรักษาวันที่ " + rec.date, ok: "ยอมรับผล" } : null} onOk={accept} onCancel={() => setConfirm(false)} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><CarResult /></Suspense></AppFrame>;
}
