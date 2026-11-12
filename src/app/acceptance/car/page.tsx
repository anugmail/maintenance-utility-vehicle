"use client";
/* S13 L.2–L.5 · หน้า ผลการบำรุงรักษา · {ทะเบียน} (/acceptance/car/?trip=T1&car=82-6789) — ackResult() ใน screens.js (Figma 9607c3b · R89 · 10 พ.ย. 2569)
   Page header ป้าย "รอรับทราบ" / "รับทราบแล้ว" (คันที่บำรุงรักษาไม่ได้ก็รอรับทราบ สาเหตุอยู่ในเนื้อหา) · Breadcrumbs บำรุงรักษาตามวาระ › ผลการบำรุงรักษารอรับทราบ › ทะเบียน
   Content ช่องไฟ 32: ข้อมูลยานพาหนะและงาน (ทะเบียน · ยี่ห้อ/รุ่น · ประเภทยานพาหนะ · หน่วยงานเจ้าของยานพาหนะ · แผนเดินทาง · เลขที่ MR · ผู้ดูแลยานพาหนะ
     + ปิดงานแล้ว: วันดำเนินการ · เริ่มงาน · ปิดงาน · ผู้ดำเนินการ · น้ำมันไฮดรอลิก · เลขไมล์หลังทำ | บำรุงรักษาไม่ได้: วันดำเนินการ · ผู้แจ้ง · แจ้งเมื่อ · + รับทราบเมื่อ)
   → ปิดงานแล้ว: ผลการตรวจสภาพก่อนบำรุงรักษา (Step 1 ของ S10: แบบตรวจตามประเภทยานพาหนะ + รายการตรวจ + ลงนามการตรวจสภาพอะไหล่ SignRequest ดูอย่างเดียว · สถานะรอยืนยัน/ยืนยันแล้ว 11 พ.ย. 2569) · ภาพก่อนเริ่มงาน
       · รายการงานและอะไหล่ที่ใช้จริง — แทนไฟล์ PDF แบบเดิม
       · ไม่มีการประเมินในหน้านี้แล้ว (เจ้าของงาน 11 พ.ย. 2569 "ย้ายออกจาก S13 ไปอยู่ view ใหม่" — แบบประเมินความพึงพอใจของ กบค. อยู่หน้า /satisfaction/ S27 · R94)
       · 12 พ.ย. 2569 แบบประเมินความพึงพอใจเป็นเรื่องแยก เมนูของตัวเอง (_"เรื่องการประเมินเป็นเรื่องแยกที่จะไปผูกตาม flow ต่างๆ เลยอยากแยกใว้"_ · BACKLOG ข้อ 75)
         ⇒ S13 ยังรับทราบอย่างเดียว · ทางเข้าการประเมิน = รับทราบแล้ว (ผู้ดูแลยานพาหนะ · ไม่ใช่คันที่บำรุงรักษาไม่ได้ · ยังไม่ได้ประเมิน) ปุ่ม "ประเมินความพึงพอใจ" แทนที่ปุ่มรับทราบ
           → ฟอร์มประเมินของงานนี้ในเมนูแบบประเมินความพึงพอใจ (/satisfaction/form/?id=ma.<แผนเดินทาง>.<ยานพาหนะ>) · ประเมินแล้วปุ่มหาย (เสนอ · ยังไม่มีจอ Figma)
     บำรุงรักษาไม่ได้: สาเหตุที่บำรุงรักษาไม่ได้ (สาเหตุ · ผู้บันทึก · วันที่บันทึก) แทนผลงาน · ไม่มีประเมิน (เสนอ Q59)
   → ปุ่ม ย้อนกลับ + "รับทราบ" สีเขียว (AckButton) — กดได้ทันที (รับทราบอย่างเดียว · 11 พ.ย. 2569) · กดแล้วบันทึกทันที ไม่มี popup → ปุ่มหาย ป้ายรับทราบแล้ว + toast "รับทราบผลการบำรุงรักษา {ทะเบียน} แล้ว"
   กดได้เฉพาะบทบาท ผู้ดูแลยานพาหนะ (Permission S13) · บทบาทอื่นเห็นปุ่มย้อนกลับอย่างเดียว · รับทราบครบทุกคันในแผนแล้วแผนปิดงานเอง (acceptCar · S16 S17 ตัดออก Figma 6299e1d)
   อ้างอิง: Section label · Table · Images · Primary button (พื้น Color/surface/success) · Radio text card ของไฟล์ Component + VehicleAndReporterInfo · IncidentPhotoGallery
            · SignRequest (ประกอบจาก Input dropdown + Pill outline · COMPOSED.md ษ.) + จอ L.2–L.5 ของ screens.js + ปุ่มหน้า 5.14 - 5.15 Cost & Expense Check ของ UI Release#2 */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { DisplayBox } from "@/components/patterns/DisplayBox";
import { CheckTable } from "@/components/patterns/CheckTable";
import { IncidentPhotoGallery } from "@/components/maintain-d/IncidentPhotoGallery";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { PageHeader } from "@/components/vms/PageHeader";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { type TableColumn } from "@/components/vms/Table";
import { PagedTable } from "@/app/quarter/_shared/ui";
import { ACCEPT_SAMPLES, ACCEPT_STATUS, ACK_AT, ACK_LIST, acceptCar, accRecord, workRows } from "@/lib/mock/acceptance";
import { BEFORE, INSPECT_OPTS, OIL_DEFAULT, OIL_JOB_OPTS, emptyReceive, inspectForm, tripCtrl } from "@/lib/mock/jobs";
import { workOf } from "@/lib/mock/tripCols";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { evalRecord, maEvalId, satFormHref } from "@/lib/mock/survey";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { useSample } from "@/lib/useSample";
import { badgeOf, ButtonRow, SignRequest } from "../../trips/_lib/ui";
import { SLOTS } from "../../trips/job/receive/ReceivePage";
import { AckButton } from "../_lib/ui";

/* WORK_COLS2 */
const WORK_COLS2: TableColumn[] = [{ head: "รายการงาน" }, { head: "อะไหล่ที่ใช้", width: 320 }, { head: "จำนวนตามแผน", width: 140 }, { head: "จำนวนที่ใช้จริง", width: 140 }, { head: "หน่วย", width: 110 }];

function AckResult() {
  const router = useRouter();
  const sp = useSearchParams();
  const pending = useSample(ACCEPT_SAMPLES);
  const keeper = useRole() === "ผู้ดูแลยานพาหนะ";
  const mock = useMock();
  if (pending) return null;
  const rec = accRecord(mock, sp.get("trip"), sp.get("car"));
  if (!rec) return <EmptyStateSearchNotFound />;
  const { car, cannot, job, trip } = rec;
  const done = rec.accepted;
  const back = () => router.push("/acceptance/");
  const ack = () => {
    acceptCar(rec);
    notify("รับทราบผลการบำรุงรักษา " + car.plate + " แล้ว");
  };

  const jobPairs: [string, string][] = cannot
    ? [["วันดำเนินการ", workOf(trip, car.id)[0] || "-"], ["ผู้แจ้ง", rec.by], ["แจ้งเมื่อ", job.cannot?.at ?? "-"]]
    : [["วันดำเนินการ", rec.date || "-"], ["เริ่มงาน", job.startedAt ?? "-"], ["ปิดงาน", job.closedAt ?? "-"], ["ผู้ดำเนินการ", rec.by],
      ["น้ำมันไฮดรอลิก", OIL_JOB_OPTS[job.close?.oilChoice ?? job.oilChoice ?? OIL_DEFAULT]], ["เลขไมล์หลังทำ", job.kmAfter ?? "-"]];
  const pairs: [string, string][] = [["ทะเบียน", car.plate], ["ยี่ห้อ/รุ่น", car.model], ["ประเภทยานพาหนะ", car.type], ["หน่วยงานเจ้าของยานพาหนะ", car.owner],
    ["แผนเดินทาง", trip.name], ["เลขที่ MR", rec.mr], ["ผู้ดูแลยานพาหนะ", tripCtrl(trip, car)], ...jobPairs, ...(done ? [["รับทราบเมื่อ", job.acceptedAt ?? ACK_AT] as [string, string]] : [])];
  const ev = evalRecord(mock, maEvalId(trip.id, car.id));   // งานนี้ในเมนูแบบประเมินความพึงพอใจ (มีเมื่อรับทราบแล้ว)
  const rcv = job.receive ?? emptyReceive(car);
  const fm = inspectForm(car, trip.planMr);
  const photos = job.photos?.length ? job.photos.map((p) => ({ alt: p.name })) : BEFORE.map((alt) => ({ alt }));
  const work = workRows(job).map((w) => [w.task, w.part, w.planQty, w.usedQty, w.unit]);

  return (
    <>
      <PageHeader Title={"ผลการบำรุงรักษา · " + car.plate} Badge={badgeOf(done ? ACCEPT_STATUS.ok : ACCEPT_STATUS.wait)} onBack={back}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", href: "/" }, { Text: ACK_LIST, href: "/acceptance/" }, { Text: car.plate }]} />
      <div className="flex flex-col gap-8">
        <VehicleAndReporterInfo Title="ข้อมูลยานพาหนะและงาน" pairs={pairs} />
        {cannot ? (
          <DisplayBox Title="สาเหตุที่บำรุงรักษาไม่ได้" pairs={[["สาเหตุ", job.cannot?.reason ?? "-"], ["ผู้บันทึก", rec.by], ["วันที่บันทึก", rec.date]]} />
        ) : (
          <>
            <section className="flex flex-col gap-4">
              <SectionLabel Title="ผลการตรวจสภาพก่อนบำรุงรักษา" />
              <VehicleAndReporterInfo Title={fm.title} pairs={fm.kv} />
              <CheckTable Title="รายการตรวจสภาพ" options={INSPECT_OPTS} items={rcv.items} readonly />
              <SignRequest Title="ลงนามการตรวจสภาพอะไหล่" readonly slots={SLOTS.map((s, i) => ({ ...s, options: rcv.signers[i].name ? [rcv.signers[i].name!] : [], ...rcv.signers[i] }))} onPick={() => {}} onSend={() => {}} />
            </section>
            <IncidentPhotoGallery Title={"ภาพก่อนเริ่มงาน (" + photos.length + ")"} photos={photos} />
            <section className="flex flex-col gap-4">
              <SectionLabel Title={"รายการงานและอะไหล่ที่ใช้จริง (" + work.length + ")"} />
              <PagedTable columns={WORK_COLS2} rows={work} />
            </section>
          </>
        )}
        <ButtonRow>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={back} />
          {!done && keeper && <AckButton Size="lg" onClick={ack} />}
          {done && keeper && !cannot && ev && !ev.evaluated && <PrimaryButton Text="ประเมินความพึงพอใจ" LeadingIconSwap="star-24-300-round" Size="lg" onClick={() => router.push(satFormHref(ev))} />}
        </ButtonRow>
      </div>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><AckResult /></Suspense></AppFrame>;
}
