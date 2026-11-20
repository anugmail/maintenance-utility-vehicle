"use client";
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

export const SLOTS = [
  { LabelText: "ผู้ตรวจ (หน่วยงานผู้ดำเนินการ)", Placeholder: "เลือกผู้ตรวจ (หน่วยงานผู้ดำเนินการ)" },
  { LabelText: "ผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ)", Placeholder: "เลือกผู้รับการตรวจ (หน่วยงานเจ้าของยานพาหนะ)" },
];

export function ReceivePage() {
  const router = useRouter();
  const { trip, car, job, actor, vendor } = useTripCar();
  const [editAt, setEditAt] = useState(false);
  const away = !!trip && !!car && !!job && job.status !== "doing";
  const [awayAtOpen] = useState(() => ({ v: null as boolean | null }));
  if (awayAtOpen.v === null && trip && car && job) awayAtOpen.v = away;
  useEffect(() => { if (awayAtOpen.v && trip && car) router.replace(jobHref(trip, car.id)); }, [awayAtOpen, trip, car, router]);
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
