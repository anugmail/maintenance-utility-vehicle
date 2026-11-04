"use client";
/* ฟอร์มแผนบำรุงรักษา planForm() ใน screens.js — ใช้ร่วม S1 สร้างแผน (/new/) และ S19 แก้ไขแผน (/edit/?id=) · S21 เปิดจากตารางรถ/อะไหล่ของฟอร์มนี้
   Content ช่องไฟ 32:
     (แก้ไข) Alert — ส่งกลับแก้ไข: Error "ผู้อนุมัติส่งกลับให้แก้ไข" + เหตุผล · อนุมัติแล้ว: Warning "แผนนี้อนุมัติแล้ว"
     ข้อมูลแผน (Section header) — ชื่อแผน (Text input) · ปีงบประมาณ (สร้าง: Input dropdown · แก้ไข: Text input State=Readonly — เลขที่ MR ผูกกับปี)
     เลือกรถเข้าแผนและจัดลงไตรมาส (Section header + ป้าย "ในแผน n คัน") — ภาค · เขต · ประเภทรถ (Input dropdown with badges เลือกได้หลายค่า เขตปิดจนเลือกภาค ประเภทรถปิดจนเลือกเขต)
       ครบแล้ว: Tabs ไตรมาส 1–4 (ป้ายจำนวนรถ) + ช่อง "เลือกรถ" (Input dropdown ค้นหาได้ + Dropdown list บอก "ไตรมาส n") · ยังไม่ครบ / ไม่มีรถ: Empty state/Data empty
     รถในไตรมาส n — Table (แก้ไข → S21 ของคันนั้น · ลบ = เอารถออกจากไตรมาส) / Empty state
     อะไหล่ในไตรมาส n — ปุ่ม "เพิ่มอะไหล่" (S21 คันแรกของไตรมาส) · Table (อะไหล่จากคลัง + รายการเพิ่มเติม หมวด "เพิ่มเอง" · แก้ไข → S21 · ลบ = ยืนยันแล้วเอาออกจากทุกคันในไตรมาส) / Empty state
     ปุ่ม ย้อนกลับ (แก้ไข: ยกเลิก) · บันทึกและส่งอนุมัติ (Size=lg ชิดซ้าย–ขวา · มือถือแบ่งครึ่ง)
   popup ยืนยัน: เอาภาค/เขต/ประเภทรถที่มีรถจัดไว้ออก · เอาอะไหล่ออก · ออกจากหน้าเมื่อมีการแก้ไข · (แก้ไข) ยืนยันการแก้ไข */
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { Alert } from "@/components/vms/Alert";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { InputDropdownWithBadges } from "@/components/vms/InputDropdownWithBadges";
import { MobileCards } from "@/components/vms/MobileTable";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TabItem } from "@/components/vms/TabItem";
import { Table, type TableColumn, type TableValue } from "@/components/vms/Table";
import { Tabs } from "@/components/vms/Tabs";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { CAND, DISTRICTS, QUARTERS, REGIONS, VEHICLE_TYPES, YEARS, dCode, type Plan } from "@/lib/mock/data";
import { carsFor, emptyDraft, inQuarter, isDirty, planFromDraft, thaiToday, type Draft } from "@/lib/mock/plan";
import { carParam, carRow, draftFromPlan, draftKey, dropQuarterRow, planId, planWithDraft, quarterRows, type QuarterRow } from "@/lib/mock/planFlow";
import { notify, setMock, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

/* CARP_COLS · PART_COLS.slice(0, 5) + ไอคอน (screens.js) */
export const CARP_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 180 },
  { head: "น้ำมันไฮโดรลิก", width: 140 }, { head: "เปลี่ยนล่าสุด", width: 120 }, { head: "อะไหล่", width: 120 }, { head: "", width: 104, Style: "Action icons" },
];
export const PART_COLS: TableColumn[] = [
  { head: "รายการอะไหล่", Style: "Lead text", SortIcon: "Swap" }, { head: "รหัส", width: 100 }, { head: "หมวด", width: 110 },
  { head: "ตามแผน", width: 100 }, { head: "หน่วย", width: 90 }, { head: "", width: 104, Style: "Action icons" },
];
/* S19: Alert เหนือฟอร์มแก้ไข (ALERT_RETURNED · ALERT_APPROVED) */
const ALERT_APPROVED = ["แผนนี้อนุมัติแล้ว", "เมื่อบันทึก แผนจะกลับเป็นสถานะรออนุมัติ และต้องให้ผู้อนุมัติตรวจสอบอีกครั้ง"] as const;

type Open = "" | "year" | "region" | "district" | "type" | "car";
type Pending = { spec: ConfirmSpec; run: () => void };

/** mode="create" = S1 (ฟอร์มใน mock.draft) · mode="edit" = S19 (ฟอร์มใน mock.edit ของแผน plan) · from = หน้าที่เปิดฟอร์มแก้ไขมา (ยกเลิกแล้วกลับไป) */
export function PlanForm({ mode, plan, from }: { mode: "create" | "edit"; plan?: Plan; from?: string }) {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const edit = mode === "edit" && plan;
  const base = (): Draft => (edit ? draftFromPlan(plan) : emptyDraft());
  const d: Draft = (edit ? mock.edit : mock.draft) ?? base();
  const [open, setOpen] = useState<Open>("");
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  const put = (patch: Partial<Draft>) => setMock((s) => (edit ? { ...s, edit: { ...(s.edit ?? base()), ...patch } } : { ...s, draft: { ...(s.draft ?? emptyDraft()), ...patch } }));
  const toggle = (k: Open) => (v: boolean) => setOpen(v ? k : "");
  /* เอารถออกจากแผน: ล้างไตรมาส อะไหล่ จำนวน และรายการเพิ่มเติมของคันนั้น */
  const without = (cars: number[]) => {
    const alloc = { ...d.alloc }, picks = { ...d.picks }, qty = { ...(d.qty ?? {}) }, manual = { ...(d.manual ?? {}) };
    cars.forEach((i) => { delete alloc[i]; delete picks[i]; delete qty[i]; delete manual[i]; });
    return { alloc, picks, qty, manual };
  };

  /* ---------- ภาค เขต ประเภทรถ (เอาค่าออกแล้วรถที่จัดไว้ของค่านั้นออก ต้องยืนยันก่อน) ---------- */
  const applyArea = (regions: string[], districts: string[], types: string[], label: string, kind: "ภาค" | "เขต" | "ประเภทรถ") => {
    const out = Object.keys(d.alloc).map(Number).filter((i) => !districts.includes(dCode(CAND[i])) || !types.includes(CAND[i].type));
    const run = () => put({ regions, districts, types, ...without(out) });
    if (!out.length) return run();
    setOpen("");
    setPending({ spec: { title: "ยืนยันการเอา" + kind + "ออก", sub: "รถของ " + label + " ที่จัดไว้ " + out.length + " คัน จะถูกเอาออกจากทุกไตรมาส", cancel: "ปิด", ok: "ยืนยัน" }, run });
  };
  const removeRegion = (r: string) => applyArea(d.regions.filter((x) => x !== r), d.districts.filter((x) => !DISTRICTS[r].includes(x)), d.types, r, "ภาค");
  const removeDistrict = (x: string) => applyArea(d.regions, d.districts.filter((y) => y !== x), d.types, x, "เขต");
  const removeType = (t: string) => applyArea(d.regions, d.districts, d.types.filter((y) => y !== t), t, "ประเภทรถ");
  const flip = (list: string[], v: string, remove: (v: string) => void, add: (next: string[]) => void) => (list.includes(v) ? remove(v) : add([...list, v]));

  /* ---------- รถ ---------- */
  const ready = d.regions.length > 0 && d.districts.length > 0 && d.types.length > 0;
  const cars = carsFor(d);
  const noCars = ready && cars.length === 0;
  const nIn = Object.keys(d.alloc).length;
  const inQ = inQuarter(d);
  const pickCar = (i: number) => {
    if (d.alloc[i] === d.q) return put(without([i]));   // กดคันที่ติ๊กไว้อีกครั้ง = เอาออก
    put({ alloc: { ...d.alloc, [i]: d.q } });           // คันที่อยู่ไตรมาสอื่น = ย้ายมาไตรมาสนี้
  };
  const qRows = quarterRows(d, d.q);
  const dropPart = (r: QuarterRow) => setPending({
    spec: { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: r.name + " จะถูกเอาออกจากรถทุกคันในไตรมาส " + d.q, cancel: "ยกเลิก", ok: "เอาออก" },
    run: () => put(dropQuarterRow(d, d.q, r)),
  });

  /* ---------- ออก / ตรวจและบันทึก ---------- */
  const back = from === "detail" && plan ? "/detail/?id=" + planId(plan) : "/";
  const E = (m: string, when: boolean) => (errors && when ? m : undefined);
  const valid = !!d.name.trim() && !!d.year && ready && nIn > 0;
  const leave = () => {
    if (edit) {
      const go = () => { setMock((s) => ({ ...s, edit: null })); router.push(back); };
      if (draftKey(d) === draftKey(draftFromPlan(plan))) return go();
      return setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่แก้ไขไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ยืนยัน" }, run: go });
    }
    const go = () => { setMock((s) => ({ ...s, draft: null })); router.push("/"); };
    if (!isDirty(d)) return go();
    setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ออก" }, run: go });
  };
  const save = () => {
    if (!valid) { setErrors(true); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
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
    setMock((s) => ({ ...s, draft: null, plans: [planFromDraft(d, s.plans, thaiToday(), s.retiredMr), ...s.plans] }));
    notify("ส่งแผนบำรุงรักษาเพื่ออนุมัติสำเร็จ");
    router.push("/");
  };

  const table = (cols: TableColumn[], rows: TableValue[][]) => (mob ? <MobileCards columns={cols} rows={rows} /> : <Table columns={cols} rows={rows} />);
  const row = (kids: ReactNode, n: number) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const empty = (t: string, s: string) => <EmptyStateDataEmpty Text={t} SupportingText={s} />;
  /* S21 อะไหล่ของรถ: ?id=new (ฟอร์มสร้าง) หรือ id ของแผนที่แก้ · q = ไตรมาสที่เปิด · car = ทะเบียน */
  const toS21 = (car: number) => router.push("/car-parts/?id=" + (edit ? planId(plan) : "new") + "&q=" + d.q + "&car=" + carParam(car) + (from === "detail" ? "&from=detail" : ""));
  const firstWith = (r: QuarterRow) => inQ.find((c) => (r.pi != null ? (d.picks[c] || []).includes(r.pi) : (d.manual?.[c] || []).some((m) => "m" + m.name + "|" + m.code === r.key))) ?? inQ[0];

  const carList = cars.filter(([c]) => !query || c.plate.includes(query));
  const heading = edit ? "แก้ไขแผน " + plan.mr : "สร้างแผนบำรุงรักษา";

  return (
    <>
      <PageHeader Title={heading} onBack={leave} crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: edit ? heading : "สร้างแผน" }]} />
      <div className="flex flex-col gap-8">
        {edit && plan.status === "returned" && <Alert Color="Error" Text="ผู้อนุมัติส่งกลับให้แก้ไข" SupportingText={plan.returnReason} />}
        {edit && plan.status === "approved" && <Alert Color="Warning" Text={ALERT_APPROVED[0]} SupportingText={ALERT_APPROVED[1]} />}
        <section className="flex flex-col gap-4">
          <SectionHeader Title="ข้อมูลแผน" />
          {row(<>
            <TextInput LabelText="ชื่อแผน" Text={d.name} Placeholder="ระบุชื่อแผน" onChange={(v) => put({ name: v })}
              State={E("x", !d.name.trim()) ? "Error" : undefined} HelperText={E("กรุณาระบุชื่อแผน", !d.name.trim())} />
            {edit ? <TextInput LabelText="ปีงบประมาณ" Text={d.year} State="Readonly" readOnly /> : (
              <InputDropdown LabelText="ปีงบประมาณ" Text={d.year} Placeholder="เลือกปีงบประมาณ" open={open === "year"} onOpenChange={toggle("year")}
                State={E("x", !d.year) ? (open === "year" ? "Error Focused" : "Error") : undefined} HelperText={E("กรุณาเลือกปีงบประมาณ", !d.year)}>
                <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === d.year ? "Selected" : "Default"} onClick={() => { put({ year: y }); setOpen(""); }} />)}</DropdownList>
              </InputDropdown>
            )}
          </>, 2)}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader Title="เลือกรถเข้าแผนและจัดลงไตรมาส" Badge={nIn ? "ในแผน " + nIn + " คัน" : null} />
          {row(<>
            <InputDropdownWithBadges LabelText="ภาค" values={d.regions} Placeholder="เลือกภาค" onRemove={removeRegion} open={open === "region"} onOpenChange={toggle("region")}
              State={E("x", !d.regions.length) ? (open === "region" ? "Error Focused" : "Error") : undefined} HelperText={E("กรุณาเลือกภาค", !d.regions.length)}>
              <DropdownList>{REGIONS.map((r) => <DropdownListItem key={r} Text={r} State={d.regions.includes(r) ? "Selected" : "Default"} onClick={() => flip(d.regions, r, removeRegion, (regions) => put({ regions }))} />)}</DropdownList>
            </InputDropdownWithBadges>
            <InputDropdownWithBadges LabelText="เขต" values={d.districts} Placeholder="เลือกเขต" onRemove={removeDistrict} open={open === "district"} onOpenChange={toggle("district")}
              State={!d.regions.length ? "Disabled" : E("x", !d.districts.length) ? (open === "district" ? "Error Focused" : "Error") : undefined} HelperText={E("กรุณาเลือกเขต", d.regions.length > 0 && !d.districts.length)}>
              <DropdownList>{d.regions.flatMap((r) => DISTRICTS[r]).map((x) => <DropdownListItem key={x} Text={x} State={d.districts.includes(x) ? "Selected" : "Default"} onClick={() => flip(d.districts, x, removeDistrict, (districts) => put({ districts }))} />)}</DropdownList>
            </InputDropdownWithBadges>
            <InputDropdownWithBadges LabelText="ประเภทรถ" values={d.types} Placeholder="เลือกประเภทรถ" onRemove={removeType} open={open === "type"} onOpenChange={toggle("type")}
              State={!d.districts.length ? "Disabled" : E("x", !d.types.length) ? (open === "type" ? "Error Focused" : "Error") : undefined} HelperText={E("กรุณาเลือกประเภทรถ", d.districts.length > 0 && !d.types.length)}>
              <DropdownList>{VEHICLE_TYPES.map((t) => <DropdownListItem key={t} Text={t} State={d.types.includes(t) ? "Selected" : "Default"} onClick={() => flip(d.types, t, removeType, (types) => put({ types }))} />)}</DropdownList>
            </InputDropdownWithBadges>
          </>, 3)}
          {ready && !noCars ? (
            <>
              <Tabs>{QUARTERS.map((t, i) => <TabItem key={t} Text={t} Badge={inQuarter(d, i + 1).length} Active={d.q === i + 1} onClick={() => put({ q: i + 1 })} />)}</Tabs>
              {row(<>
                <InputDropdown LabelText="เลือกรถ" Text={query} Placeholder="ค้นหาทะเบียน, จังหวัด" LeadingIconSwap="search-24-300-round" onQuery={setQuery}
                  open={open === "car"} onOpenChange={toggle("car")}
                  State={E("x", nIn === 0) ? (open === "car" ? "Error Focused" : "Error") : undefined} HelperText={E("กรุณาเลือกรถเข้าแผนอย่างน้อย 1 คัน", nIn === 0)}>
                  <DropdownList emptyText={carList.length ? undefined : "ไม่พบทะเบียนที่ค้นหา"}>
                    {carList.map(([c, i]) => <DropdownListItem key={c.plate} Text={c.plate} SupportingText={d.alloc[i] ? "ไตรมาส " + d.alloc[i] : undefined} State={d.alloc[i] === d.q ? "Selected" : "Default"} onClick={() => pickCar(i)} />)}
                  </DropdownList>
                </InputDropdown>
                {!mob && <span />}
              </>, 2)}
            </>
          ) : (
            empty("ยังไม่มีรายการรถ", noCars ? "ไม่มีรถที่ตรงกับเขตและประเภทรถที่เลือก" : errors ? "กรุณาเลือกรถเข้าแผนอย่างน้อย 1 คัน — เลือกภาค เขต และประเภทรถก่อน" : "เลือกภาค เขต และประเภทรถเพื่อแสดงรายการรถในเขต")
          )}
        </section>

        {ready && !noCars && (
          <section className="flex flex-col gap-4">
            <SectionHeader Title={"รถในไตรมาส " + d.q} Badge={inQ.length ? inQ.length + " คัน" : null} />
            {inQ.length
              ? table(CARP_COLS, inQ.map((i) => [...carRow(d, i),
                  { actions: [{ IconSwap: "stylus-24-300-round", label: "แก้ไขอะไหล่ " + CAND[i].plate, onClick: () => toS21(i) }, { IconSwap: "delete-24-300-round", label: "เอา " + CAND[i].plate + " ออกจากไตรมาส", onClick: () => put(without([i])) }] }]))
              : empty("ยังไม่มีรถในไตรมาสนี้", "ค้นทะเบียนในช่องเลือกรถเพื่อเพิ่มรถเข้าไตรมาสนี้")}
          </section>
        )}

        <section className="flex flex-col gap-4">
          <SectionHeader Title={"อะไหล่ในไตรมาส" + (ready && !noCars ? " " + d.q : "")} Badge={qRows.length || null}
            Actions={<SecondaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" State={inQ.length ? "Default" : "Disabled"} onClick={() => inQ.length && toS21(inQ[0])} />} />
          {qRows.length
            ? table(PART_COLS, qRows.map((r) => [r.name, r.code, r.group, String(r.qty), r.unit,
                { actions: [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + r.name, onClick: () => toS21(firstWith(r)) }, { IconSwap: "delete-24-300-round", label: "เอา " + r.name + " ออก", onClick: () => dropPart(r) }] }]))
            : empty("ยังไม่มีรายการอะไหล่", inQ.length ? "กดเพิ่มอะไหล่เพื่อเลือกอะไหล่ของรถในไตรมาสนี้" : "เลือกรถเข้าไตรมาสนี้ก่อน แล้วจึงเพิ่มอะไหล่ได้")}
        </section>

        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text={edit ? "ยกเลิก" : "ย้อนกลับ"} Size="lg" onClick={leave} />
          <PrimaryButton Text="บันทึกและส่งอนุมัติ" Size="lg" onClick={save} />
        </div>
      </div>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}
