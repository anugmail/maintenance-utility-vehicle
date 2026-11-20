"use client";
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
import { PST, machineOf, uniq } from "@/lib/mock/data";
import { FilterShell } from "@/app/vehicles/_lib/ui";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { TableHeader } from "@/components/vms/TableHeader";
import { applySample, getJob, jobsOf, WSTAT } from "@/lib/mock/jobs";
import { MAINT_CONFIRM, MAINT_ITEM, carPlanParts, cannotTrip, maintainCar, moveCar, movedInto, quarterFinished, quarterPartRows } from "@/lib/mock/moves";
import { QPART_COLS, qpartRow } from "@/lib/mock/plan";
import { useSeed } from "@/lib/mock/seedB";
import { setMock } from "@/lib/mock/store";
import { useSample, type SampleMap } from "@/lib/useSample";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { MoveModal, type MoveTarget } from "../_shared/MoveModal";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { canManage, usePlanGate } from "@/lib/mock/planFlow";
import { TST, addQuarterCars, badgeOf, ctrlCell, editQuarterCar, putTrip, qEditOf, quarterCars, quarterPool, quarterTrips, removeQuarterCar, tripBy, tripPlaces, tripRange, vTrip, type TripCar } from "@/lib/mock/trips";
import { UNIT_COL, tripVCells, tripVCols, tripWork, workOf } from "@/lib/mock/tripCols";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { TripCarEditModal } from "../_shared/TripCarEditModal";
import { TripCarPicker } from "../_shared/TripCarPicker";
import { useRowActions } from "@/components/patterns/RowActions";
import { carArea } from "@/lib/mock/carArea";
import { Content, DataTable, PagedTable, Section, go, planDetailHref, quarterCrumbs, useBack } from "../_shared/ui";

const Q_DROP = { drop: ["สถานที่บำรุงรักษา", "ยี่ห้อ/รุ่น", "วันดำเนินการ"] };
const [Q_PLATE, Q_TYPE, ...Q_REST] = tripVCols(Q_DROP);
const TRIP_Q_COLS: TableColumn[] = [{ ...Q_PLATE, width: 170 }, { ...Q_TYPE, width: 145 }, { head: "ยี่ห้อเครื่องจักร", width: 130 }, { head: "รุ่นเครื่องจักร", width: 130 },
  ...Q_REST.map((c) => (c.head === UNIT_COL ? { head: c.head } : c)), { head: "แผนเดินทาง", width: 210 }];
const TRIP_COLS: TableColumn[] = [
  { head: "ชื่อแผนเดินทาง", Style: "Lead text" }, { head: "ช่วงวัน", width: 220 }, { head: "ยานพาหนะ (คัน)", width: 100 },
  { head: "ผู้ดำเนินการ", width: 260 }, { head: "สถานะ", width: 150, Style: "Badge" }, { head: "", width: 72, Style: "Action icons" },
];

const SAMPLES: SampleMap = { S25: { role: "หน่วยงาน (กบผ.)", apply: () => { applySample("T1_afterCannot"); setMock((s) => ({ ...s, moves: (s.moves ?? []).filter((m) => m.planId !== "Z7000001"), qcars: Object.fromEntries(Object.entries(s.qcars ?? {}).filter(([k]) => !k.startsWith("Z7000001-"))) })); } } };
const MOVE_ICON = "swap_driving_apps_wheel-24-300-round";

function TripList() {
  useSeed();
  const sampling = useSample(SAMPLES);
  const router = useRouter();
  const sp = useSearchParams();
  const mock = useMock();
  const role = useRole();
  const id = sp.get("id") ?? "Z7000001", q = Number(sp.get("q") ?? 1);
  const nowQ = "ไตรมาส " + q;
  const plan = planOf(mock, id);
  const kbk = !!plan && canManage(role, plan);
  const denied = usePlanGate(plan);
  const trips = quarterTrips(mock, id, q);
  const cars = quarterCars(mock, id, q);
  const mob = useBreakpoint() === "Mobile";
  const [adding, setAdding] = useState(false);
  const [editCar, setEditCar] = useState<TripCar | null>(null);
  const [dropCar, setDropCar] = useState<TripCar | null>(null);
  const rowActs = useRowActions();
  const [menu, setMenu] = useState<{ car: TripCar; anchor: MenuAnchor } | null>(null);
  const [moving, setMoving] = useState<MoveTarget | null>(null);
  const [maint, setMaint] = useState<TripCar | null>(null);
  const [query, setQuery] = useState("");
  const [brandF, setBrandF] = useState<string[]>([]);
  const [panel, setPanel] = useState<string[] | null>(null);
  const [brandOpen, setBrandOpen] = useState(false);
  const back = useBack(planDetailHref(id));
  const newHref = "/quarter/trips/new/?id=" + id + "&q=" + q;

  const edits = qEditOf(mock, id, q);
  const tripOf = (c: TripCar) => trips.find((x) => x.carIds.includes(c.id));
  const moved = new Map(movedInto(mock, id, q).map((m) => [m.carId, m]));
  const finished = quarterFinished(mock, id, q);
  const lastQ = q >= 4;
  const openMove = (c: TripCar) => {
    if (lastQ) return;
    const x = cannotTrip(mock, id, q, c.id);
    if (x) return setMoving({ car: c, tripName: x.trip.name, reason: x.reason, parts: carPlanParts(mock, id, c.id, x.trip.id) });
    if (!tripOf(c)) setMoving({ car: c, tripName: "ยังไม่มีแผนเดินทาง", reason: "", parts: carPlanParts(mock, id, c.id) });
  };
  const brands = uniq(cars.map((c) => machineOf(c.model).brand).filter((b) => b !== "-")).sort();
  const kq = query.trim().toLowerCase();
  const shownCars = cars.filter((c) => (!kq || (c.plate + " " + c.model).toLowerCase().includes(kq)) && (!brandF.length || brandF.includes(machineOf(c.model).brand)));
  const carRows: TableValue[][] = shownCars.map((c) => {
    const t = tripOf(c), cannot = t ? cannotTrip(mock, id, q, c.id) : null, from = moved.get(c.id);
    const done = !!t && t.status === "approved" && getJob(jobsOf(mock), t.id, c.id).status === "done";
    const acts = [{ IconSwap: "stylus-24-300-round", Text: "แก้ไข", onClick: () => setEditCar(c) },
      ...(t || lastQ ? [] : [{ IconSwap: MOVE_ICON, Text: "ย้ายไปไตรมาสอื่น", onClick: () => openMove(c) }]),
      ...(t ? [] : [{ IconSwap: "delete-24-300-round", Text: "ลบ", onClick: () => setDropCar(c) }])];
    const [, type, ...rest] = tripVCells(c, t ? vTrip(t) : { phones: edits.phones, names: edits.names }, Q_DROP);
    const mc = machineOf(c.model);
    const plate: TableValue = { text: c.plate, sub: mc.vehicle + (from ? " · ย้ายมาจาก" + "ไตรมาส " + from.from : "") };
    const r: TableValue[] = [plate, type, mc.brand, mc.model, ...rest, cannot ? { pills: [WSTAT.cannot] } : done ? { pills: [WSTAT.done] } : t ? { text: t.name, sub: "วันดำเนินการ " + tripWork(vTrip(t), c.id) } : { pills: [["ยังไม่มีแผนเดินทาง", "Gray"]] }];
    if (!kbk || done) return done && kbk ? [...r, null] : r;
    if (cannot) return [...r, { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setMenu({ car: c, anchor: anchorOf(e.currentTarget) }) }],
      mobileButtons: <div className="flex flex-col gap-3 [&>*]:w-full">
        <SecondaryButton Text={MAINT_ITEM.Text} LeadingIconSwap={MAINT_ITEM.IconSwap} Size="lg" onClick={() => setMaint(c)} />
        <SecondaryButton Text="ย้ายไปไตรมาสอื่น" LeadingIconSwap={MOVE_ICON} Size="lg" State={lastQ ? "Disabled" : "Default"} onClick={() => openMove(c)} />
      </div> }];
    return [...r, rowActs.cell(acts, c.plate)];
  });
  const editTrip = editCar ? tripOf(editCar) : undefined;
  const open = (tid: string, st: string) => (st === "approved" ? router.push("/trips/detail/?trip=" + tid) : router.push("/quarter/trips/edit/?trip=" + tid));
  const canOpen = (st: string) => st === "approved" || (st === "returned" && kbk);
  const tripRows: TableValue[][] = trips.map((t) => [{ text: t.name, sub: tripPlaces(t) }, tripRange(t), String(t.carIds.length), tripBy(t), { pills: [TST[t.status]] },
    !canOpen(t.status) ? null : go("เปิด " + t.name, () => open(t.id, t.status))]);
  const qparts = quarterPartRows(mock, id, q);
  const partRows: TableValue[][] = qparts.map((r) => { const v = qpartRow(r); return r.sub ? [{ text: r.name, sub: r.sub }, ...v.slice(1)] : v; });
  const free = cars.some((c) => !tripOf(c));
  const create = (Btn: typeof PrimaryButton | typeof TertiaryBrandButton) => kbk ? <Btn Text="สร้างแผนเดินทาง" LeadingIconSwap="add-24-300-round" State={free ? "Default" : "Disabled"} onClick={() => free && router.push(newHref)} /> : undefined;

  if (sampling) return null;
  if (denied) return null;
  return (
    <>
      <PageHeader Title={nowQ} Badge={badgeOf(PST[plan?.status ?? "active"])} onBack={back} crumbs={quarterCrumbs(id, plan?.name ?? mrOf(id), q)} />
      <Content>
        {plan && <VehicleAndReporterInfo Title="รายละเอียดแผน" pairs={planKv(plan).map(([k, v]): [string, string] => (k === "ไตรมาส" ? [k, nowQ + " (" + cars.length + " คัน)"] : [k, v]))} />}
        <Section>
          <SectionLabel Title={"ยานพาหนะใน" + nowQ + " (" + cars.length + ")"}
            Actions={kbk ? <SecondaryButton Text="เพิ่มยานพาหนะ" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} State={finished ? "Disabled" : "Default"} onClick={() => !finished && setAdding(true)} /> : undefined} />
          {cars.length > 0 && <TableHeader Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query} onQuery={setQuery} onFilter={() => setPanel([...brandF])} FilterCount={brandF.length}
            Filters={brandF} onRemoveFilter={(b) => setBrandF(brandF.filter((x) => x !== b))} />}
          {cars.length > 0 && !shownCars.length
            ? <EmptyStateSearchNotFound Actions={<SecondaryButton Text="ล้างตัวกรอง" Size={mob ? "lg" : "md"} onClick={() => { setQuery(""); setBrandF([]); }} />} />
            : <PagedTable key={kq + brandF.join()} columns={kbk ? [...TRIP_Q_COLS, { head: "", width: 136, Style: "Action icons" }] : TRIP_Q_COLS} rows={carRows} rowKey={(r) => (r[0] as { text: string }).text} />}
        </Section>
        <Section>
          <SectionLabel Title={"อะไหล่ใน" + nowQ} />
          {partRows.length
            ? <DataTable columns={QPART_COLS} rows={partRows} rowKey={(_, i) => qparts[i].key} />
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText="ไตรมาสนี้ไม่มีอะไหล่ที่ต้องเบิก" />}
        </Section>
        <Section>
          <SectionLabel Title={"แผนเดินทาง (" + trips.length + ")"} Actions={create(TertiaryBrandButton)} />
          {trips.length
            ? <DataTable columns={TRIP_COLS} rows={tripRows} />
            : <EmptyStateDataEmpty Text="ยังไม่มีแผนเดินทาง" SupportingText="สร้างแผนเดินทางเพื่อนัดวันเข้าตรวจ แจ้งผู้ดูแลยานพาหนะและ กรย." Actions={create(PrimaryButton)} />}
        </Section>
      </Content>
      <FilterShell open={panel !== null} onClose={() => { setPanel(null); setBrandOpen(false); }} onClear={() => setPanel([])} onApply={() => { setBrandF(panel ?? []); setPanel(null); setBrandOpen(false); }}>
        <InputDropdownWithBadges LabelText="ยี่ห้อเครื่องจักร" Optional values={panel ?? []} Placeholder="เลือกยี่ห้อเครื่องจักร" open={brandOpen} onOpenChange={setBrandOpen}
          onRemove={(b) => setPanel((p) => (p ?? []).filter((x) => x !== b))}>
          <DropdownList>{brands.map((b) => <DropdownListItem key={b} Text={b} State={(panel ?? []).includes(b) ? "Selected" : "Default"}
            onClick={() => setPanel((p) => ((p ?? []).includes(b) ? (p ?? []).filter((x) => x !== b) : [...(p ?? []), b]))} />)}</DropdownList>
        </InputDropdownWithBadges>
      </FilterShell>
      {rowActs.Menu}
      <TripCarPicker open={adding} pool={quarterPool(mock, id, q)} nowQ={nowQ}
        sub="ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน รวมยานพาหนะที่รับมอบระหว่างปี" emptyText="ไม่มียานพาหนะที่เพิ่มเข้าไตรมาสนี้ได้" areaOf={carArea}
        onCancel={() => setAdding(false)} onAdd={(ids) => { addQuarterCars(id, q, ids); setAdding(false); notify("เพิ่มยานพาหนะเข้า" + nowQ + " สำเร็จ"); }} />
      <RowMenu anchor={menu?.anchor ?? null} items={menu ? [{ ...MAINT_ITEM, onClick: () => setMaint(menu.car) }, { Text: "ย้ายไปไตรมาสอื่น", IconSwap: MOVE_ICON, Disabled: lastQ, onClick: () => openMove(menu.car) }] : []} onClose={() => setMenu(null)} />
      <ConfirmDialog spec={maint ? MAINT_CONFIRM(maint.plate, q) : null} onCancel={() => setMaint(null)}
        onOk={() => { if (maint) { const x = cannotTrip(mock, id, q, maint.id); if (x) maintainCar(maint, q, x.trip.id); } setMaint(null); }} />
      <MoveModal target={moving} cur={q} counts={(k) => quarterCars(mock, id, k).length} onCancel={() => setMoving(null)}
        onMove={(k) => { if (moving) { const tid = cannotTrip(mock, id, q, moving.car.id)?.trip.id ?? ""; moveCar(id, moving.car, q, k, tid); } setMoving(null); }} />
      <TripCarEditModal car={editCar} trip={editTrip ?? edits} work={editTrip && editCar ? { d1: editTrip.d1, d2: editTrip.d2, value: workOf(editTrip, editCar.id) } : undefined} onCancel={() => setEditCar(null)}
        onSave={(o, w) => {
          if (editTrip && editCar) { const works = { ...(editTrip.works ?? {}) }; if (w) works[editCar.id] = w; else delete works[editCar.id]; putTrip({ ...editTrip, ...o, works }); }
          else editQuarterCar(id, q, o);
          setEditCar(null);
        }} />
      <ConfirmDialog spec={dropCar ? { danger: true, title: "ยืนยันการเอายานพาหนะออกจาก" + nowQ, sub: dropCar.plate + " จะถูกเอาออกจาก" + nowQ + " ของแผนนี้ และอะไหล่ของยานพาหนะคันนี้ออกจากรายการเบิกของไตรมาส", cancel: "ยกเลิก", ok: "เอาออก" } : null}
        onCancel={() => setDropCar(null)} onOk={() => { if (dropCar) { removeQuarterCar(id, q, dropCar.id); notify("เอายานพาหนะออกจาก" + nowQ + " สำเร็จ"); } setDropCar(null); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><TripList /></Suspense></AppFrame>;
}
