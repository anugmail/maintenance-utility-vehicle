"use client";
import { PagedTable } from "@/app/quarter/_shared/ui";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { RowMenu, anchorOf, type MenuAnchor } from "@/components/patterns/RowMenu";
import { PopupModal } from "@/components/patterns/PopupModal";
import { Alert } from "@/components/vms/Alert";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { EmptyStateSearchNotFound } from "@/components/vms/EmptyStateSearchNotFound";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TabItem } from "@/components/vms/TabItem";
import { type TableColumn, type TableValue } from "@/components/vms/Table";
import { TableHeader } from "@/components/vms/TableHeader";
import { TablePagination } from "@/components/vms/TablePagination";
import { Tabs } from "@/components/vms/Tabs";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { CAND, CAR_PICK, MENU, QUARTERS, UNIT_FLEET, YEARS, type Plan } from "@/lib/mock/data";
import { carArea } from "@/lib/mock/carArea";
import { QPART_COLS, carsComplete, decided, draftComplete, emptyDraft, inQuarter, isDirty, matchQuery, planCars, planFromDraft, qpartRow, removeCar, thaiToday, unassignedCars, type Draft } from "@/lib/mock/plan";
import { allQuarterRows, carParam, roleUnit, draftFromPlan, draftKey, fillDraft, oilCellOf, otherCellOf, planId, planWithDraft, quarterRows } from "@/lib/mock/planFlow";
import { useProtoForm } from "@/lib/protoForm";
import { notify, setMock, useMock, useRole } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { isLive, liveLocks, saveLive } from "@/lib/mock/liveEdit";
import { CheckTable, type CheckRow } from "./CheckTable";
import { TripCarPicker } from "@/app/quarter/_shared/TripCarPicker";

export const CARP_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของยานพาหนะ", width: 180 },
  { head: "น้ำมันไฮดรอลิก", width: 140 }, { head: "เปลี่ยนล่าสุด", width: 120 }, { head: "อะไหล่", width: 120 }, { head: "", width: 104, Style: "Action icons" },
];
const PICK_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 260 }, { head: "ประเภทยานพาหนะ", width: 160 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, { head: "ไตรมาส", width: 170, Style: "Badge" }, { head: "อะไหล่อื่นๆ", width: 200 }, { head: "", width: 60, Style: "Action icons" }];
const Q_COLS: TableColumn[] = [{ head: "ทะเบียน", width: 240 }, { head: "ประเภทยานพาหนะ", width: 130 }, { head: "เขต / หน่วยงานเจ้าของยานพาหนะ" }, { head: "น้ำมันไฮดรอลิก", width: 200 }, { head: "อะไหล่อื่นๆ", width: 200 }, { head: "", width: 60, Style: "Action icons" }];
const PER = 10;
const MOVE_ITEM = { Text: "ย้ายไปไตรมาสอื่น", IconSwap: "swap_driving_apps_wheel-24-300-round" };
const OUT_Q_ITEM = { Text: "เอาออกจากไตรมาส", IconSwap: "remove-24-300-round" };
const NO_Q = "ยังไม่จัดไตรมาส";
const ADD_PLAN_FIRST = "เพิ่มยานพาหนะเข้าแผนที่แท็บทั้งหมดก่อน แล้วจึงจัดเข้าไตรมาส";
const ALERT_APPROVED = ["แผนนี้อนุมัติแล้ว", "เมื่อบันทึก แผนจะกลับเป็นสถานะรออนุมัติ และต้องให้ผู้อนุมัติตรวจสอบอีกครั้ง"] as const;
const ALERT_LIVE = ["แผนนี้อยู่ระหว่างดำเนินการ", "แก้ไขได้เฉพาะไตรมาสที่ยังบำรุงรักษาไม่เสร็จ และยานพาหนะที่ยังไม่ปิดงาน เมื่อบันทึกจะมีผลทันที ไม่ต้องส่งอนุมัติใหม่"] as const;

type Pending = { spec: ConfirmSpec; run: () => void };

export function PlanForm({ mode, plan, from }: { mode: "create" | "edit"; plan?: Plan; from?: string }) {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const edit = mode === "edit" && plan;
  const base = (): Draft => (edit ? draftFromPlan(plan, mock) : emptyDraft());
  const live = !!edit && isLive(plan);
  const locks = live ? liveLocks(mock, plan) : null;
  const lockedCar = (i: number) => !!locks?.locked(i);
  const qLocked = (n: number) => !!locks?.finished.has(n);
  const d: Draft = (edit ? mock.edit : mock.draft) ?? base();
  const [yearOpen, setYearOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [qAdd, setQAdd] = useState(false);
  const [move, setMove] = useState<{ cars: number[]; to: number } | null>(null);
  const [assign, setAssign] = useState<{ cars: number[]; skip: number; to: number } | null>(null);
  const [touched, setTouched] = useState<{ name?: boolean; year?: boolean }>({});
  const [pending, setPending] = useState<Pending | null>(null);
  const [carMenu, setCarMenu] = useState<{ car: number; anchor: MenuAnchor } | null>(null);
  const role = useRole();

  const put = (patch: Partial<Draft>) => setMock((s) => (edit ? { ...s, edit: { ...(s.edit ?? base()), ...patch } } : { ...s, draft: { ...(s.draft ?? emptyDraft()), ...patch } }));
  const toggleYear = (v: boolean) => {
    if (!v && yearOpen && !d.year) setTouched((t) => ({ ...t, year: true }));
    setYearOpen(v);
  };
  const reset = () => { setPage(1); setTicked([]); };

  const cars = planCars(d);
  const q = d.q;
  const inQ = (k: number) => inQuarter(d, k);
  const k = query.trim();
  const shown = (q ? inQ(q) : cars).filter((i) => matchQuery(i, k));
  const last = Math.max(1, Math.ceil(shown.length / PER)), pg = Math.min(page, last);
  const rowsOnPage = shown.slice((pg - 1) * PER, pg * PER);
  const nTicked = ticked.length;
  const qPill = (i: number): [string, "Brand" | "Gray"] => (d.alloc[i] ? ["ไตรมาส " + d.alloc[i], "Brand"] : [NO_Q, "Gray"]);
  const carQuery = (car: number) => "?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&car=" + carParam(car) + (from === "detail" ? "&from=detail" : "");
  const toS21 = (car: number) => router.push("/car-parts/" + carQuery(car));
  const untick = (car: number) => setTicked((t) => t.filter((x) => x !== String(car)));
  const outOfPlan = (car: number) => {
    const n = d.alloc[car];
    setPending({
      spec: { danger: true, title: "ยืนยันการลบยานพาหนะออกจากแผน", cancel: "ยกเลิก", ok: "ลบ",
        sub: CAND[car].plate + (n ? " จะออกจากไตรมาส " + n + " และไม่อยู่ในแผนนี้" + (live ? " รวมถึงออกจากแผนเดินทางของไตรมาสนี้เมื่อบันทึก" : "") : " จะไม่อยู่ในแผนนี้") + " เพิ่มกลับได้จากปุ่มเพิ่มยานพาหนะ" },
      run: () => {
        put(removeCar(d, car));
        untick(car);
        notify("ลบยานพาหนะออกจากแผนสำเร็จ");
      },
    });
  };
  const outOfQ = (car: number) => {
    const n = d.alloc[car];
    put({ alloc: { ...d.alloc, [car]: 0 } });
    untick(car);
    notify("เอายานพาหนะออกจากไตรมาส " + n + " แล้ว");
  };
  const doMove = () => {
    if (!move?.to) return;
    const alloc = { ...d.alloc };
    move.cars.forEach((c) => { alloc[c] = move.to; });
    put({ alloc });
    setTicked((t) => t.filter((x) => !move.cars.includes(Number(x))));
    notify(move.cars.length === 1 ? "ย้ายยานพาหนะ " + CAND[move.cars[0]].plate + " ไปไตรมาส " + move.to + " สำเร็จ" : "ย้ายยานพาหนะ " + move.cars.length + " คันไปไตรมาส " + move.to + " สำเร็จ");
    setMove(null);
  };
  const doAssign = () => {
    if (!assign?.to) return;
    const alloc = { ...d.alloc };
    assign.cars.forEach((c) => { alloc[c] = assign.to; });
    put({ alloc });
    setTicked([]);
    notify("เพิ่มยานพาหนะ " + assign.cars.length + " คันเข้าไตรมาส " + assign.to + " สำเร็จ");
    setAssign(null);
  };
  const carMenuItems = (car: number) => {
    const view = { ...MENU[0], act: () => router.push("/car-parts/view/" + carQuery(car)) };
    if (lockedCar(car)) return [view];
    const change = { ...MENU[1], act: () => toS21(car) };
    return q
      ? [view, change, { ...MOVE_ITEM, act: () => setMove({ cars: [car], to: 0 }) }, { ...OUT_Q_ITEM, act: () => outOfQ(car) }]
      : [view, change, { ...MENU[2], act: () => outOfPlan(car) }];
  };
  const carItems = carMenu ? carMenuItems(carMenu.car).map(({ act, ...m }) => ({ ...m, onClick: act })) : [];
  const lockSubOf = (i: number) => (lockedCar(i) ? (locks?.closed.has(i) ? "ปิดงานแล้ว · " : "ไตรมาสบำรุงรักษาเสร็จแล้ว · ") : "");
  const txt = (v: string | { text: string }) => (typeof v === "string" ? v : v.text);
  const rows: CheckRow[] = rowsOnPage.map((i) => {
    const c = CAND[i], lockSub = lockSubOf(i);
    const other = otherCellOf(d, i);
    const mobileActions = carMenuItems(i).map((m) => ({ IconSwap: m.IconSwap, label: m.Text + " " + c.plate, onClick: m.act }));
    const menu: TableValue = { actions: [{ IconSwap: "more_horiz-20-400-round", label: "เมนู " + c.plate, onClick: (e) => setCarMenu({ car: i, anchor: anchorOf(e.currentTarget) }) }] };
    const base = { key: String(i), text: c.plate, sub: lockSub + c.model, disabled: lockedCar(i), mobileActions };
    if (!q) return { ...base, mobileSub: lockSub + c.model + " · " + qPill(i)[0] + " · อะไหล่อื่นๆ " + txt(other), cells: [c.type, c.owner, { pills: [qPill(i)] }, other, menu] };
    const oil = oilCellOf(d, i);
    return { ...base, mobileSub: lockSub + "น้ำมัน " + txt(oil) + " · อะไหล่อื่นๆ " + txt(other), cells: [c.type, c.owner, oil, other, menu] };
  });
  const toBulk = () => router.push("/car-parts/?id=" + (edit ? planId(plan) : "new") + "&q=" + q + "&cars=" + ticked.map((x) => carParam(Number(x))).join(",") + (from === "detail" ? "&from=detail" : ""));
  const pickCar = (i: number) => { const c = CAND[i]; return { id: String(i), plate: c.plate, model: c.model, owner: c.owner, phone: "", ctrl: "" }; };
  const addPool = !qAdd ? [] : (q ? unassignedCars(d) : UNIT_FLEET.filter((i) => d.alloc[i] == null)).map(pickCar);
  const addCars = (ids: string[]) => {
    const alloc = { ...d.alloc };
    ids.forEach((x) => { alloc[Number(x)] = q; });
    put({ alloc });
    notify(q ? "เพิ่มยานพาหนะ " + ids.length + " คันเข้าไตรมาส " + q + " สำเร็จ" : "เพิ่มยานพาหนะ " + ids.length + " คันเข้าแผนสำเร็จ");
    setQAdd(false);
  };
  const canAdd = q > 0 ? !qLocked(q) : true;

  const qCars = q ? inQ(q) : [];
  const qRows = q ? quarterRows(d, q) : allQuarterRows(d);

  const back = from === "detail" && plan ? "/detail/?id=" + planId(plan) : "/";
  const complete = live ? !!d.name.trim() && carsComplete(d) : draftComplete(d);
  const saved = edit ? draftFromPlan(plan, mock) : emptyDraft();
  useProtoForm({
    fill: () => {
      if (live) {
        const picks = { ...d.picks }, oils = { ...(d.oils ?? {}) }, alloc = { ...d.alloc }, open = [1, 2, 3, 4].find((n) => !qLocked(n));
        cars.forEach((i) => { if (!alloc[i] && open) alloc[i] = open; });
        cars.filter((i) => !lockedCar(i) && !decided(d, i)).forEach((i) => { picks[i] = [...CAR_PICK]; oils[i] = 0; });
        put({ name: d.name.trim() ? d.name : plan.name, alloc, picks, oils });
      } else setMock((s) => (edit ? { ...s, edit: fillDraft(d) } : { ...s, draft: fillDraft(d) }));
      setTicked([]);
    },
    clear: () => { setMock((s) => (edit ? { ...s, edit: { ...saved } } : { ...s, draft: { ...saved } })); setTicked([]); setQuery(""); },
    dirty: edit ? draftKey(d) !== draftKey(saved) : isDirty(d),
  });
  const qDone = q ? inQ(q).filter((i) => decided(d, i)).length : 0;
  const leave = () => {
    if (edit) {
      const go = () => { setMock((s) => ({ ...s, edit: null })); router.push(back); };
      if (draftKey(d) === draftKey(draftFromPlan(plan, mock))) return go();
      return setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่แก้ไขไว้จะไม่ถูกบันทึก", cancel: "ยกเลิก", ok: "ยืนยัน" }, run: go });
    }
    const go = () => { setMock((s) => ({ ...s, draft: null })); router.push("/"); };
    if (!isDirty(d)) return go();
    setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ยกเลิก", ok: "ยืนยัน" }, run: go });
  };
  const save = () => {
    if (!complete) return;
    if (live) {
      if (mock.failSave) { notify("general error", "Error"); return; }
      saveLive(plan, d);
      notify("บันทึกการแก้ไขแผนสำเร็จ");
      router.push("/detail/?id=" + planId(plan));
      return;
    }
    if (edit) {
      return setPending({
        spec: { title: "ยืนยันการแก้ไข", sub: "แผนจะกลับเป็นสถานะรออนุมัติ และส่งให้ผู้อนุมัติตรวจสอบอีกครั้ง โปรดตรวจสอบก่อนยืนยัน", cancel: "ยกเลิก", ok: "ยืนยัน" },
        run: () => {
          if (mock.failSave) { notify("general error", "Error"); return; }
          setMock((s) => ({ ...s, edit: null, plans: s.plans.map((p) => (p.mr === plan.mr ? planWithDraft(p, d, thaiToday()) : p)) }));
          notify("บันทึกการแก้ไขแผนและส่งอนุมัติสำเร็จ");
          router.push("/");
        },
      });
    }
    if (mock.failSave) { notify("general error", "Error"); return; }
    setMock((s) => ({ ...s, draft: null, plans: [planFromDraft(d, s.plans, thaiToday(), s.retiredMr, roleUnit(role)), ...s.plans] }));
    notify("ส่งแผนบำรุงรักษาเพื่ออนุมัติสำเร็จ");
    router.push("/");
  };

  const table = (cols: TableColumn[], rs: TableValue[][]) => <PagedTable key={"t" + q} columns={cols} rows={rs} />;
  const row = (kids: ReactNode, n: number) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const heading = edit ? "แก้ไขแผน " + plan.mr : "สร้างแผนบำรุงรักษา";
  const nameErr = touched.name && !d.name.trim();
  const yearErr = touched.year && !d.year;
  const addBtn = (text: string, primary = false) => primary
    ? <PrimaryButton Text={text} LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => setQAdd(true)} />
    : <SecondaryButton key="add" Text={text} LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} State={canAdd ? "Default" : "Disabled"} onClick={() => canAdd && setQAdd(true)} />;

  const carBody = shown.length
    ? <CheckTable key={"c" + q} columns={q ? Q_COLS : PICK_COLS} rows={rows} ticked={ticked} onTicked={setTicked}
        Pagination={<TablePagination total={shown.length} page={pg} perPage={PER} onPage={setPage} />} />
    : k
      ? <EmptyStateSearchNotFound />
      : q
        ? <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในไตรมาสนี้" SupportingText="เลือกจากยานพาหนะในแผนที่ยังไม่จัดไตรมาส" Graphic="vehicle"
            Actions={canAdd ? addBtn("เพิ่มยานพาหนะเข้าไตรมาส " + q, true) : undefined} />
        : <EmptyStateDataEmpty Text="ยังไม่มียานพาหนะในแผน" SupportingText="กดเพิ่มยานพาหนะเพื่อเลือกยานพาหนะเข้าแผน แล้วจึงจัดเข้าไตรมาส" Graphic="vehicle"
            Actions={addBtn("เพิ่มยานพาหนะเข้าแผน", true)} />;
  const mq = move ? d.alloc[move.cars[0]] : 0;
  const tickedIds = ticked.map(Number), unassignedTicked = tickedIds.filter((i) => !d.alloc[i]);

  return (
    <>
      <PageHeader Title={heading} onBack={leave} crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: edit ? heading : "สร้างแผน" }]} />
      <div className="flex flex-col gap-8">
        {edit && plan.status === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        {edit && plan.status === "approved" && <Alert Color="Warning" Text={ALERT_APPROVED[0]} SupportingText={ALERT_APPROVED[1]} />}
        {live && <Alert Color="Info" Text={ALERT_LIVE[0]} SupportingText={ALERT_LIVE[1]} />}
        <section className="flex flex-col gap-4">
          <SectionHeader Title="ข้อมูลแผน" />
          {row(<>
            <TextInput LabelText="ชื่อแผน" Text={d.name} Placeholder="ระบุชื่อแผน" onChange={(v) => put({ name: v })} onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              State={nameErr ? "Error" : undefined} HelperText={nameErr ? "กรุณาระบุชื่อแผน" : undefined} />
            {edit ? <TextInput LabelText="ปีงบประมาณ" Text={d.year} State="Readonly" readOnly /> : (
              <InputDropdown LabelText="ปีงบประมาณ" Text={d.year} Placeholder="เลือกปีงบประมาณ" open={yearOpen} onOpenChange={toggleYear}
                State={yearErr ? (yearOpen ? "Error Focused" : "Error") : undefined} HelperText={yearErr ? "กรุณาเลือกปีงบประมาณ" : undefined}>
                <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === d.year ? "Selected" : "Default"} onClick={() => { put({ year: y }); setYearOpen(false); }} />)}</DropdownList>
              </InputDropdown>
            )}
          </>, 2)}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title="ยานพาหนะในแผน" Badge={"ในแผน " + cars.length + " คัน"} />
          <Tabs>
            <TabItem Text="ทั้งหมด" Badge={cars.length} Active={q === 0} onClick={() => { put({ q: 0 }); reset(); }} />
            {QUARTERS.map((_, i) => <TabItem key={i} Text={"ไตรมาส " + (i + 1)} Badge={inQ(i + 1).length} Active={q === i + 1} onClick={() => { put({ q: i + 1 }); reset(); }} />)}
          </Tabs>
          <TableHeader Title={q ? "ยานพาหนะในไตรมาส " + q : "ยานพาหนะทั้งหมดในแผน"} Badge={q ? "กำหนดอะไหล่แล้ว " + qDone + "/" + inQ(q).length + " คัน" : cars.length + " คัน"} Placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น" query={query}
            onQuery={(v) => { setQuery(v); setPage(1); }} FilterButton={false}
            Actions={[...(nTicked ? [<SecondaryButton key="parts" Text={"กำหนดอะไหล่ (" + nTicked + ")"} Size={mob ? "lg" : "md"} onClick={toBulk} />] : []),
              ...(q && nTicked ? [<SecondaryButton key="move" Text={"ย้ายไตรมาส (" + nTicked + ")"} Size={mob ? "lg" : "md"} onClick={() => setMove({ cars: tickedIds, to: 0 })} />] : []),
              ...(!q && unassignedTicked.length ? [<SecondaryButton key="assign" Text={"จัดเข้าไตรมาส (" + unassignedTicked.length + ")"} Size={mob ? "lg" : "md"} onClick={() => setAssign({ cars: unassignedTicked, skip: nTicked - unassignedTicked.length, to: 0 })} />] : []),
              addBtn("เพิ่มยานพาหนะ")]} />
          {live && q > 0 && qLocked(q) && <Alert Color="Success" Text={"ไตรมาส " + q + " บำรุงรักษาเสร็จทุกคันแล้ว"} SupportingText="ดูอย่างเดียว เพิ่ม ย้าย เอาออก หรือกำหนดอะไหล่ของยานพาหนะในไตรมาสนี้ไม่ได้" />}
          {carBody}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title={q ? "อะไหล่ในไตรมาส " + q : "อะไหล่รวมทุกไตรมาส"} />
          {qRows.length
            ? table(QPART_COLS, qRows.map(qpartRow))
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText={!q ? "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะในแท็บไตรมาส รายการจะรวมมาที่นี่" : qCars.length ? "จัดการอะไหล่ทีละคันจากปุ่ม … ที่แถวยานพาหนะ รายการจะรวมมาที่นี่" : "เพิ่มยานพาหนะเข้าไตรมาสนี้ก่อน แล้วจึงจัดการอะไหล่ทีละคันได้"} />}
        </section>

        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text={edit ? "ยกเลิก" : "ย้อนกลับ"} Size="lg" onClick={leave} />
          <PrimaryButton Text={live ? "บันทึก" : "บันทึกและส่งอนุมัติ"} Size="lg" State={complete ? "Default" : "Disabled"} onClick={save} />
        </div>
      </div>
      <PopupModal open={move !== null} title={"ย้ายไปไตรมาสอื่น · " + (move ? (move.cars.length === 1 ? CAND[move.cars[0]].plate : move.cars.length + " คัน") : "")}
        sub={move && move.cars.length > 1 ? "ยานพาหนะ " + move.cars.length + " คันและอะไหล่ที่กำหนดไว้จะย้ายไปไตรมาสที่เลือก" : "ยานพาหนะและอะไหล่ที่กำหนดไว้ของยานพาหนะคันนี้จะย้ายไปไตรมาสที่เลือก"} ok="ย้ายยานพาหนะ" okDisabled={!move?.to}
        onCancel={() => setMove(null)} onOk={doMove}>
        <div role="radiogroup" className="flex flex-col gap-3">
          {QUARTERS.map((t, i) => {
            const n = i + 1, off = n === mq || qLocked(n);
            return <RadioTextCard key={t} Text={t} SupportingText={n === mq ? "ไตรมาสปัจจุบัน" : qLocked(n) ? "บำรุงรักษาเสร็จทุกคันแล้ว" : undefined} State={off ? "Disabled" : "Default"} Selected={move?.to === n} onClick={() => !off && move && setMove({ ...move, to: n })} />;
          })}
        </div>
      </PopupModal>
      <PopupModal open={assign !== null} title={"จัดเข้าไตรมาส · " + (assign?.cars.length ?? 0) + " คัน"} sub="ยานพาหนะที่ยังไม่จัดไตรมาสจะเข้าไตรมาสที่เลือก พร้อมอะไหล่ที่กำหนดไว้" ok="จัดเข้าไตรมาส" okDisabled={!assign?.to}
        onCancel={() => setAssign(null)} onOk={doAssign}>
        <div className="flex flex-col gap-3">
          {!!assign?.skip && <Alert Color="Info" Text={"ยานพาหนะ " + assign.skip + " คันอยู่ในไตรมาสแล้ว ไม่เปลี่ยน"} SupportingText="ย้ายไตรมาสของคันเหล่านั้นได้ที่แท็บไตรมาส" />}
          <div role="radiogroup" className="flex flex-col gap-3">
            {QUARTERS.map((t, i) => {
              const n = i + 1, off = qLocked(n);
              return <RadioTextCard key={t} Text={t} SupportingText={off ? "บำรุงรักษาเสร็จทุกคันแล้ว" : undefined} State={off ? "Disabled" : "Default"} Selected={assign?.to === n} onClick={() => !off && assign && setAssign({ ...assign, to: n })} />;
            })}
          </div>
        </div>
      </PopupModal>
      <TripCarPicker open={qAdd} pool={addPool} nowQ={"ไตรมาส " + q} title={q ? "เพิ่มยานพาหนะเข้าไตรมาส " + q : "เพิ่มยานพาหนะเข้าแผน"} okText={q ? "เพิ่มเข้าไตรมาส " + q : "เพิ่มเข้าแผน"}
        sub={q ? "ยานพาหนะในแผนที่ยังไม่จัดไตรมาส" : "ยานพาหนะที่ยังไม่อยู่ในแผนนี้ เพิ่มได้ทุกคัน"} areaOf={carArea}
        emptyText={!q ? "ยานพาหนะทุกคันอยู่ในแผนแล้ว" : cars.length ? "ยานพาหนะในแผนจัดเข้าไตรมาสครบแล้ว" : "ยังไม่มียานพาหนะในแผน"}
        emptySub={q ? ADD_PLAN_FIRST : "ไม่มียานพาหนะที่เพิ่มเข้าแผนนี้ได้"}
        onCancel={() => setQAdd(false)} onAdd={addCars} />
      <RowMenu anchor={carMenu?.anchor ?? null} items={carItems} onClose={() => setCarMenu(null)} />
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}
