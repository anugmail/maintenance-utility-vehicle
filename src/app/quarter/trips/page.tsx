"use client";
/* S6 P1 · แผนเดินทางของไตรมาส (/quarter/trips/?id=Z7000001&q=1) — tripList() ใน screens.js · spec S6.md (E.1 E.9 E.11 E.13 E.15 · S9 H.7)
   Page header "หมายเลขแผน MR Z7000001" + Badge สถานะแผน (ย้อนกลับ) → Content ช่องไฟ 32:
     รายละเอียดแผน (VehicleAndReporterInfo ของไฟล์ Maintain-D · มือถือ DisplayBox) — PLAN_KV ไตรมาส "(n คัน)" · รถของไตรมาส = quarterCars() (แผนจากฟอร์ม S1 = รถที่จัดลงไตรมาส · แผนตัวอย่าง = TRIP_CARS 10 คัน)
     Section label "รถในไตรมาส 1 (n)" + Table ดูอย่างเดียว (TRIP_Q_COLS) — รถที่ยังไม่มีใบ = Pill Gray "ยังไม่มีแผนเดินทาง"
     Section label "แผนเดินทาง (n)" + Tertiary brand button "สร้างแผนเดินทาง" → Table (TRIP_COLS ไอคอน ›) / Empty state/Data empty + Primary button "สร้างแผนเดินทาง"
   ไอคอน ›: อนุมัติแล้ว → รายละเอียดแผนเดินทาง (/trips/detail/ · batch C) · ส่งกลับแก้ไข → แก้ไข (E.14) · รออนุมัติ = ไม่มีจอ (ไม่มีไอคอน) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { mrOf, planKv, planOf } from "@/lib/mock/closeout";
import { PST } from "@/lib/mock/data";
import { useSeed } from "@/lib/mock/seedB";
import { useMock, useRole } from "@/lib/mock/store";
import { TST, quarterCars, badgeOf, phoneCell, quarterTrips, tripBy, tripPlaces, tripRange } from "@/lib/mock/trips";
import { Content, DataTable, MENU_HOME, Section, go, planDetailHref, quarterHref, useBack } from "../_shared/ui";

const TRIP_Q_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 170, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 160 },
  { head: "เบอร์ติดต่อ", width: 150 }, { head: "ช่วงวันเดินทาง", width: 210 }, { head: "แผนเดินทาง", width: 240 },
];
const TRIP_COLS: TableColumn[] = [
  { head: "ชื่อแผนเดินทาง", Style: "Lead text" }, { head: "ช่วงวัน", width: 220 }, { head: "รถ (คัน)", width: 100 },
  { head: "ผู้ดำเนินการ", width: 260 }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 72, Style: "Action icons" },
];

function TripList() {
  useSeed();
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const kbk = useRole() === "กบค.";
  const id = sp.get("id") ?? "Z7000001", q = Number(sp.get("q") ?? 1);
  const nowQ = "ไตรมาส " + q;
  const plan = planOf(mock, id);
  const trips = quarterTrips(mock, id, q);
  const cars = quarterCars(mock, id, q);
  const back = useBack(quarterHref(id, q));
  const newHref = "/quarter/trips/new/?id=" + id + "&q=" + q;

  const carRows: TableValue[][] = cars.map((c) => {
    const t = trips.find((x) => x.carIds.includes(c.id));
    return [c.plate, c.model, c.owner, phoneCell(t ?? null, c), t ? tripRange(t) : "—", t ? t.name : { pills: [["ยังไม่มีแผนเดินทาง", "Gray"]] }];
  });
  const open = (tid: string, st: string) => (st === "approved" ? router.push("/trips/detail/?trip=" + tid) : router.push("/quarter/trips/edit/?trip=" + tid));
  const tripRows: TableValue[][] = trips.map((t) => [{ text: t.name, sub: tripPlaces(t) }, tripRange(t), String(t.carIds.length), tripBy(t), { pills: [TST[t.status]] },
    t.status === "review" ? null : go("เปิด " + t.name, () => open(t.id, t.status))]);
  const create = (Btn: typeof PrimaryButton | typeof TertiaryBrandButton) => kbk ? <Btn Text="สร้างแผนเดินทาง" LeadingIconSwap="add-24-300-round" onClick={() => router.push(newHref)} /> : undefined;

  return (
    <>
      <PageHeader Title={"หมายเลขแผน " + mrOf(id)} Badge={badgeOf(PST[plan?.status ?? "active"])} onBack={back}
        crumbs={[{ Text: MENU_HOME, href: "/" }, { Text: "แผน " + mrOf(id), onClick: () => router.push(planDetailHref(id)) }, { Text: nowQ, href: quarterHref(id, q) }, { Text: "แผนเดินทาง" }]} />
      <Content>
        {plan && <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan, " (" + cars.length + " คัน)")} />}
        <Section>
          <SectionLabel Title={"รถใน" + nowQ + " (" + cars.length + ")"} />
          <DataTable columns={TRIP_Q_COLS} rows={carRows} rowKey={(r) => String(r[0])} />
        </Section>
        <Section>
          <SectionLabel Title={"แผนเดินทาง (" + trips.length + ")"} Actions={create(TertiaryBrandButton)} />
          {trips.length
            ? <DataTable columns={TRIP_COLS} rows={tripRows} />
            : <EmptyStateDataEmpty Text="ยังไม่มีแผนเดินทาง" SupportingText="สร้างแผนเดินทางเพื่อนัดวันเข้าตรวจ แจ้งเจ้าของรถและ กรย." Actions={create(PrimaryButton)} />}
        </Section>
      </Content>
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><TripList /></Suspense></AppFrame>;
}
