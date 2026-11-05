"use client";
/* S6 P1 · หน้า "ไตรมาส n" (/quarter/trips/?id=Z7000001&q=1) — tripList() ใน screens.js · spec S6.md (E.1 E.9 E.11 E.13 E.15 · S9 H.7)
   ทางเข้า (รีวิว 5 พ.ย. 2569): เมนูบำรุงรักษาตามวาระ → รายการแผน → "…" ดูรายละเอียด (แผนอนุมัติแล้ว/ดำเนินการ) → รายละเอียดแผน → "ไปหน้าไตรมาส n" → หน้านี้
   Page header "ไตรมาส n" + Badge สถานะแผน (ย้อนกลับ) · Breadcrumbs บำรุงรักษาตามวาระ › <ชื่อแผน> › ไตรมาส n → Content ช่องไฟ 32:
     รายละเอียดแผน (VehicleAndReporterInfo ของไฟล์ Maintain-D · มือถือ DisplayBox) — PLAN_KV ไตรมาส "(n คัน)" · รถของไตรมาส = quarterCars() (แผนจากฟอร์ม S1 = รถที่จัดลงไตรมาส · แผนตัวอย่าง = TRIP_CARS 10 คัน)
     Section label "รถในไตรมาส 1 (n)" + Secondary button "เพิ่มรถ" (กบค.) + Table (TRIP_Q_COLS + ไอคอนแก้ไข ลบ) — รถที่ยังไม่มีใบ = Pill Gray "ยังไม่มีแผนเดินทาง" · เกิน 10 คันแบ่งหน้า
     E.16–E.20 (เพิ่ม ลด แก้ไข รถในไตรมาส 4 พ.ย. 2569 · tripList o.added o.removed · Q_EXTRA · Q_REMOVE_CONFIRM · qAddModal): popup "เพิ่มรถเข้าไตรมาส n" (TripCarPicker)
       · ไอคอนแก้ไข = TripCarEditModal (คันที่อยู่ในแผนเดินทางแล้ว = แก้ที่ใบนั้น) · ไอคอนลบ = ConfirmDialog "ยืนยันการเอารถออกจากไตรมาส n" · ไม่ต้องส่งอนุมัติแผนใหม่
     Section label "แผนเดินทาง (n)" + Tertiary brand button "สร้างแผนเดินทาง" → Table (TRIP_COLS ไอคอน ›) / Empty state/Data empty + Primary button "สร้างแผนเดินทาง"
       รถทุกคันอยู่ในแผนเดินทางแล้ว = ปุ่ม "สร้างแผนเดินทาง" Disabled (5 พ.ย. 2569 "สร้างแผนได้จนกว่าจะไม่เหลือรถ" · ตัด popup "รถทุกคันของไตรมาสอยู่ในแผนเดินทางแล้ว")
   S25 (5 พ.ย. 2569 · BACKLOG ข้อ 12): รถที่งาน "บำรุงรักษาไม่ได้" = Pill Error แทนชื่อแผนเดินทาง + ปุ่ม "…" เมนูเดียว "ย้ายไปไตรมาสอื่น" (ไตรมาส 4 = Disabled)
     · มือถือ Mobile table item Style=Action buttons ปุ่มเดียว · MoveModal → ยืนยัน → กลับหน้านี้ รถคันนั้นหาย + toast · ไตรมาสใหม่ รถขึ้นก่อน บรรทัดรอง "ย้ายมาจากไตรมาส n"
   ไอคอน ›: อนุมัติแล้ว → รายละเอียดแผนเดินทาง (/trips/detail/ · batch C) · ส่งกลับแก้ไข → แก้ไข (E.14) · รออนุมัติ = ไม่มีจอ (ไม่มีไอคอน) */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog } from "@/components/patterns/ConfirmDialog";
import { VehicleAndReporterInfo } from "@/components/maintain-d/VehicleAndReporterInfo";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn, TableValue } from "@/components/vms/Table";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { mrOf, planKv, planOf } from "@/lib/mock/closeout";
import { PST } from "@/lib/mock/data";
import { applySample, WSTAT } from "@/lib/mock/jobs";
import { carPlanParts, cannotTrip, moveCar, movedInto } from "@/lib/mock/moves";
import { useSeed } from "@/lib/mock/seedB";
import { setMock } from "@/lib/mock/store";
import { useSample, type SampleMap } from "@/lib/useSample";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { MoveModal, type MoveTarget } from "../_shared/MoveModal";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { TST, addQuarterCars, badgeOf, editQuarterCar, phoneCell, putTrip, qEditOf, quarterCars, quarterPool, quarterTrips, removeQuarterCar, tripBy, tripPlaces, tripRange, type TripCar } from "@/lib/mock/trips";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { TripCarEditModal } from "../_shared/TripCarEditModal";
import { TripCarPicker } from "../_shared/TripCarPicker";
import { Content, DataTable, PagedTable, Section, go, planDetailHref, quarterCrumbs, useBack } from "../_shared/ui";

const TRIP_Q_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 170, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 160 },
  { head: "เบอร์ติดต่อ", width: 150 }, { head: "ช่วงวันเดินทาง", width: 210 }, { head: "แผนเดินทาง", width: 240 },
];
const TRIP_COLS: TableColumn[] = [
  { head: "ชื่อแผนเดินทาง", Style: "Lead text" }, { head: "ช่วงวัน", width: 220 }, { head: "รถ (คัน)", width: 100 },
  { head: "ผู้ดำเนินการ", width: 260 }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 72, Style: "Action icons" },
];

/* ?sample=S25 (หน้า /scenarios/): ใบ T1 อนุมัติแล้ว 80-9981 ลำปาง บำรุงรักษาไม่ได้ (T1_afterCannot) · ล้างการย้ายและรถในไตรมาสที่แก้ของแผนตัวอย่าง */
const SAMPLES: SampleMap = { S25: { role: "กบค.", apply: () => { applySample("T1_afterCannot"); setMock((s) => ({ ...s, moves: (s.moves ?? []).filter((m) => m.planId !== "Z7000001"), qcars: Object.fromEntries(Object.entries(s.qcars ?? {}).filter(([k]) => !k.startsWith("Z7000001-"))) })); } } };
const MOVE_ICON = "swap_driving_apps_wheel-24-300-round";

function TripList() {
  useSeed();
  const sampling = useSample(SAMPLES);
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const kbk = useRole() === "กบค.";
  const id = sp.get("id") ?? "Z7000001", q = Number(sp.get("q") ?? 1);
  const nowQ = "ไตรมาส " + q;
  const plan = planOf(mock, id);
  const trips = quarterTrips(mock, id, q);
  const cars = quarterCars(mock, id, q);
  const mob = useBreakpoint() === "Mobile";
  const [adding, setAdding] = useState(false);
  const [editCar, setEditCar] = useState<TripCar | null>(null);
  const [dropCar, setDropCar] = useState<TripCar | null>(null);
  const [menu, setMenu] = useState<{ car: TripCar; anchor: MenuAnchor } | null>(null);
  const [moving, setMoving] = useState<MoveTarget | null>(null);
  const back = useBack(planDetailHref(id));
  const newHref = "/quarter/trips/new/?id=" + id + "&q=" + q;

  /* E.1 เพิ่ม ลด แก้ไข รถในไตรมาส (กบค.) — ไอคอนแก้ไข = เบอร์ติดต่อและสถานที่ · ลบ = เอาออกจากไตรมาส (คันที่อยู่ในแผนเดินทางแล้วมีแค่แก้ไข) */
  const edits = qEditOf(mock, id, q);
  const tripOf = (c: TripCar) => trips.find((x) => x.carIds.includes(c.id));
  const moved = new Map(movedInto(mock, id, q).map((m) => [m.carId, m]));
  const lastQ = q >= 4;   // ไตรมาสสุดท้ายของแผน = ย้ายไม่ได้ (Disabled · ยังไม่เคาะเรื่องแผนปีถัดไป)
  const openMove = (c: TripCar) => {
    const x = cannotTrip(mock, id, q, c.id); if (!x || lastQ) return;
    setMoving({ car: c, tripName: x.trip.name, reason: x.reason, parts: carPlanParts(mock, id, c.id, x.trip.id) });
  };
  const carRows: TableValue[][] = cars.map((c) => {
    const t = tripOf(c), cannot = t ? cannotTrip(mock, id, q, c.id) : null, from = moved.get(c.id);
    const acts = [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + c.plate, onClick: () => setEditCar(c) },
      ...(t ? [] : [{ IconSwap: "delete-24-300-round", label: "ลบ " + c.plate, onClick: () => setDropCar(c) }])];
    const r: TableValue[] = [from ? { text: c.plate, sub: "ย้ายมาจาก" + "ไตรมาส " + from.from } : c.plate, c.model, c.owner, phoneCell(t ?? edits, c), t ? tripRange(t) : "—",
      cannot ? { pills: [WSTAT.cannot] } : t ? t.name : { pills: [["ยังไม่มีแผนเดินทาง", "Gray"]] }];
    if (!kbk) return r;
    if (cannot) return [...r, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setMenu({ car: c, anchor: anchorOf(e.currentTarget) }) }],
      mobileButtons: <SecondaryButton Text="ย้ายไปไตรมาสอื่น" LeadingIconSwap={MOVE_ICON} Size="lg" State={lastQ ? "Disabled" : "Default"} onClick={() => openMove(c)} /> }];
    return [...r, { actions: acts, mobileActions: acts }];
  });
  const editTrip = editCar ? tripOf(editCar) : undefined;
  const open = (tid: string, st: string) => (st === "approved" ? router.push("/trips/detail/?trip=" + tid) : router.push("/quarter/trips/edit/?trip=" + tid));
  const tripRows: TableValue[][] = trips.map((t) => [{ text: t.name, sub: tripPlaces(t) }, tripRange(t), String(t.carIds.length), tripBy(t), { pills: [TST[t.status]] },
    t.status === "review" ? null : go("เปิด " + t.name, () => open(t.id, t.status))]);
  const free = cars.some((c) => !tripOf(c));   // รถที่ยังไม่อยู่ในแผนเดินทางใด
  const create = (Btn: typeof PrimaryButton | typeof TertiaryBrandButton) => kbk ? <Btn Text="สร้างแผนเดินทาง" LeadingIconSwap="add-24-300-round" State={free ? "Default" : "Disabled"} onClick={() => free && router.push(newHref)} /> : undefined;

  if (sampling) return null;
  return (
    <>
      <PageHeader Title={nowQ} Badge={badgeOf(PST[plan?.status ?? "active"])} onBack={back} crumbs={quarterCrumbs(id, plan?.name ?? mrOf(id), q)} />
      <Content>
        {plan && <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan, " (" + cars.length + " คัน)")} />}
        <Section>
          <SectionLabel Title={"รถใน" + nowQ + " (" + cars.length + ")"}
            Actions={kbk ? <SecondaryButton Text="เพิ่มรถ" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setAdding(true)} /> : undefined} />
          <PagedTable columns={kbk ? [...TRIP_Q_COLS, { head: "", width: 104, Style: "Action icons" }] : TRIP_Q_COLS} rows={carRows} rowKey={(r) => String(r[0])} />
        </Section>
        <Section>
          <SectionLabel Title={"แผนเดินทาง (" + trips.length + ")"} Actions={create(TertiaryBrandButton)} />
          {trips.length
            ? <DataTable columns={TRIP_COLS} rows={tripRows} />
            : <EmptyStateDataEmpty Text="ยังไม่มีแผนเดินทาง" SupportingText="สร้างแผนเดินทางเพื่อนัดวันเข้าตรวจ แจ้งเจ้าของรถและ กรย." Actions={create(PrimaryButton)} />}
        </Section>
      </Content>
      <TripCarPicker open={adding} pool={quarterPool(mock, id, q)} nowQ={nowQ} title={"เพิ่มรถเข้า" + nowQ}
        sub="รถในขอบเขตของแผน (ภาค เขต และประเภทรถเดียวกัน) ที่ยังไม่อยู่ในไตรมาสใด" okText={"เพิ่มเข้า" + nowQ} emptyText="ไม่มีรถที่เพิ่มเข้าไตรมาสนี้ได้"
        onCancel={() => setAdding(false)} onAdd={(ids) => { addQuarterCars(id, q, ids); setAdding(false); notify("เพิ่มรถเข้า" + nowQ + " สำเร็จ"); }} />
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? [{ Text: "ย้ายไปไตรมาสอื่น", IconSwap: MOVE_ICON, Disabled: lastQ, onClick: () => openMove(menu.car) }] : []} onClose={() => setMenu(null)} />
      <MoveModal target={moving} cur={q} counts={(k) => quarterCars(mock, id, k).length} onCancel={() => setMoving(null)}
        onMove={(k) => { if (moving) { const tid = cannotTrip(mock, id, q, moving.car.id)?.trip.id ?? ""; moveCar(id, moving.car, q, k, tid); } setMoving(null); }} />
      <TripCarEditModal car={editCar} trip={editTrip ?? edits} onCancel={() => setEditCar(null)}
        onSave={(o) => { if (editTrip) putTrip({ ...editTrip, ...o }); else editQuarterCar(id, q, o); setEditCar(null); }} />
      <ConfirmDialog spec={dropCar ? { danger: true, title: "ยืนยันการเอารถออกจาก" + nowQ, sub: dropCar.plate + " จะถูกเอาออกจาก" + nowQ + " ของแผนนี้ และอะไหล่ของรถคันนี้ออกจากรายการเบิกของไตรมาส", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onCancel={() => setDropCar(null)} onOk={() => { if (dropCar) { removeQuarterCar(id, q, dropCar.id); notify("เอารถออกจาก" + nowQ + " สำเร็จ"); } setDropCar(null); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><TripList /></Suspense></AppFrame>;
}
