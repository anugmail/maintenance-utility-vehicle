"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { PageHeader } from "@/components/vms/PageHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { mrOf, planOf } from "@/lib/mock/closeout";
import { useMock } from "@/lib/mock/store";
import { CREATOR, OWN_UNIT, TST, badgeOf, findTrip, tripCars, tripViewKv, vTrip } from "@/lib/mock/trips";
import { tripPartRows } from "@/lib/mock/moves";
import { TRIP_V_COLS, tripVCells } from "@/lib/mock/tripCols";
import { unitOf } from "@/lib/mock/data";
import { Content, DataTable, MENU_HOME, Section, useBack } from "../../quarter/_shared/ui";
import { TripExportButton, TripExportPopup, TripPartsSection } from "../../trips/_lib/TripExport";
import { useBell, useViewer } from "../_shared/Bell";

function TripView() {
  const sp = useSearchParams();
  const mock = useMock();
  const own = useViewer() === "owner";
  const back = useBack("/trips-view/");
  const t = findTrip(mock, sp.get("trip"));
  const [exp, setExp] = useState(false);
  if (!t) return null;
  const plan = planOf(mock, t.planId);
  const cars = tripCars(t, own ? OWN_UNIT : undefined);
  const rows = cars.map((c) => tripVCells(c, vTrip(t)));
  const parts = tripPartRows(mock, t, own ? (id) => cars.some((c) => c.id === id) : undefined);
  const planLabel = mrOf(t.planId) + " " + (plan?.name ?? "");
  const kv = tripViewKv(t, planLabel);
  return (
    <>
      <PageHeader Title={t.name} Badge={badgeOf(TST[t.status])} onBack={back} Actions={<TripExportButton onClick={() => setExp(true)} />}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "แผนเดินทางบำรุงรักษา", href: "/trips-view/" }, { Text: t.name }]} />
      <Content>
        <VehicleAndReporterInfo Title="รายละเอียดแผนเดินทาง" pairs={kv} />
        <Section>
          <SectionLabel Title={(own ? "ยานพาหนะของหน่วยงานในแผนเดินทาง" : "ยานพาหนะในแผนเดินทาง") + " (" + rows.length + ")"} />
          <DataTable columns={TRIP_V_COLS} rows={rows} />
        </Section>
        <TripPartsSection parts={parts} />
      </Content>
      <TripExportPopup open={exp} onClose={() => setExp(false)}
        doc={{ name: t.name, unit: unitOf("MR" + t.planId, plan?.unit), planLabel, printer: CREATOR, kv, cars, trip: vTrip(t), parts }} />
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
