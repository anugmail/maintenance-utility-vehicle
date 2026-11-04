"use client";
/* S8 P2 · แผนเดินทาง ดูอย่างเดียว (/trips-view/detail/?trip=T1 · กรย. · หน่วยงานเจ้าของรถ) — tripView() ใน screens.js · spec S8.md (G.3 G.5)
   Page header ชื่อแผนเดินทาง + Badge "อนุมัติแล้ว" (ย้อนกลับ) → รายละเอียดแผนเดินทาง (7 คู่) + Section label "รถในแผนเดินทาง (n)" | "รถของหน่วยงานในแผนเดินทาง (n)" + Table (TRIP_VIEW_COLS)
   ไม่มีปุ่ม · หน่วยงานเจ้าของรถเห็นเฉพาะรถของหน่วยงาน */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { mrOf, planOf } from "@/lib/mock/closeout";
import { useMock } from "@/lib/mock/store";
import { OWN_UNIT, TST, badgeOf, findTrip, locCell, tripCars, tripViewKv } from "@/lib/mock/trips";
import { Content, DataTable, MENU_HOME, Section, TRIP_VIEW_COLS, useBack } from "../../quarter/_shared/ui";
import { useBell, useViewer } from "../_shared/Bell";

function TripView() {
  const sp = useSearchParams();
  const mock = useMock();
  const own = useViewer() === "owner";
  const back = useBack("/trips-view/");
  const t = findTrip(mock, sp.get("trip"));
  if (!t) return null;   // ก่อนอ่าน localStorage / ไม่มีใบนี้
  const plan = planOf(mock, t.planId);
  const rows = tripCars(t, own ? OWN_UNIT : undefined).map((c) => [c.plate, c.model, c.owner, locCell(t, c)]);
  return (
    <>
      <PageHeader Title={t.name} Badge={badgeOf(TST[t.status])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "แผนเดินทางบำรุงรักษา", href: "/trips-view/" }, { Text: t.name }]} />
      <Content>
        <VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={tripViewKv(t, mrOf(t.planId) + " " + (plan?.name ?? ""))} />
        <Section>
          <SectionLabel Title={(own ? "รถของหน่วยงานในแผนเดินทาง" : "รถในแผนเดินทาง") + " (" + rows.length + ")"} />
          <DataTable columns={TRIP_VIEW_COLS} rows={rows} />
        </Section>
      </Content>
    </>
  );
}

function Frame() {
  const { bell, panel } = useBell();
  return <AppFrame bell={bell}><Suspense><TripView /></Suspense>{panel}</AppFrame>;
}

export default function Page() {
  return <Suspense><Frame /></Suspense>;
}
