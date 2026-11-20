"use client";
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
  const ev = evalRecord(mock, maEvalId(trip.id, car.id));
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
