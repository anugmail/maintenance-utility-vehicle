"use client";
/* S1 · หน้า สร้างแผนบำรุงรักษา — planForm() ใน screens.js · เงื่อนไขตามตาราง Condition ของ Scenario 1 ในไฟล์ 14-บำรุงรักษา-userflow.md
   Content ช่องไฟ 32:
     ข้อมูลแผน (Section header) — ชื่อแผน (Text input) · ปีงบประมาณ (Input dropdown)
     เลือกรถเข้าแผนและจัดลงไตรมาส (Section header + ป้าย "ในแผน n คัน") — ภาค · เขต · ประเภทรถ (Input dropdown with badges เลือกได้หลายค่า เขตปิดจนเลือกภาค ประเภทรถปิดจนเลือกเขต)
       ครบแล้ว: Tabs ไตรมาส 1–4 (ป้ายจำนวนรถ) + ช่อง "เลือกรถ" (Input dropdown ค้นหาได้ + Dropdown list บอก "ไตรมาส n") · ยังไม่ครบ / ไม่มีรถ: Empty state/Data empty
     รถในไตรมาส n — Table (แก้ไข → S21 · ลบ = เอารถออกจากไตรมาส) / Empty state
     อะไหล่ในไตรมาส n — ปุ่ม "เพิ่มอะไหล่" (S21) · Table (แก้ไข → S21 · ลบ = ยืนยันแล้วเอาออกจากทุกคันในไตรมาส) / Empty state
     ปุ่ม ย้อนกลับ · บันทึกและส่งอนุมัติ (Size=lg ชิดซ้าย–ขวา · มือถือแบ่งครึ่ง)
   popup ยืนยัน: เอาภาค/เขต/ประเภทรถที่มีรถจัดไว้ออก · เอาอะไหล่ออก · ออกจากหน้าเมื่อมีการแก้ไข */
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
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
import { CAND, DISTRICTS, LAST_OIL, OIL_OPTS, PARTS, QUARTERS, REGIONS, VEHICLE_TYPES, YEARS, dCode } from "@/lib/mock/data";
import { carsFor, emptyDraft, inQuarter, isDirty, planFromDraft, quarterParts, thaiToday, type Draft } from "@/lib/mock/plan";
import { notify, setMock, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

/* CARP_COLS · PART_COLS.slice(0, 5) + ไอคอน (screens.js) */
const CARP_COLS: TableColumn[] = [
  { head: "ทะเบียน", width: 230, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "หน่วยงานเจ้าของรถ", width: 180 },
  { head: "น้ำมันไฮโดรลิก", width: 140 }, { head: "เปลี่ยนล่าสุด", width: 120 }, { head: "อะไหล่", width: 120 }, { head: "", width: 104, Style: "Action icons" },
];
const PART_COLS: TableColumn[] = [
  { head: "รายการอะไหล่", Style: "Lead text", SortIcon: "Swap" }, { head: "รหัส", width: 100 }, { head: "หมวด", width: 110 },
  { head: "ตามแผน", width: 100 }, { head: "หน่วย", width: 90 }, { head: "", width: 104, Style: "Action icons" },
];

type Open = "" | "year" | "region" | "district" | "type" | "car";
type Pending = { spec: ConfirmSpec; run: () => void };

export default function PlanForm() {
  const router = useRouter();
  const mob = useBreakpoint() === "Mobile";
  const mock = useMock();
  const d: Draft = mock.draft ?? emptyDraft();
  const [open, setOpen] = useState<Open>("");
  const [query, setQuery] = useState("");
  const [errors, setErrors] = useState(false);
  const [pending, setPending] = useState<Pending | null>(null);

  const put = (patch: Partial<Draft>) => setMock((s) => ({ ...s, draft: { ...(s.draft ?? emptyDraft()), ...patch } }));
  const toggle = (k: Open) => (v: boolean) => setOpen(v ? k : "");

  /* ---------- ภาค เขต ประเภทรถ (เอาค่าออกแล้วรถที่จัดไว้ของค่านั้นออก ต้องยืนยันก่อน) ---------- */
  const applyArea = (regions: string[], districts: string[], types: string[], label: string, kind: "ภาค" | "เขต" | "ประเภทรถ") => {
    const out = Object.keys(d.alloc).map(Number).filter((i) => !districts.includes(dCode(CAND[i])) || !types.includes(CAND[i].type));
    const run = () => {
      const alloc = { ...d.alloc }, picks = { ...d.picks };
      out.forEach((i) => { delete alloc[i]; delete picks[i]; });
      put({ regions, districts, types, alloc, picks });
    };
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
    const alloc = { ...d.alloc }, picks = { ...d.picks };
    if (alloc[i] === d.q) { delete alloc[i]; delete picks[i]; }   // กดคันที่ติ๊กไว้อีกครั้ง = เอาออก
    else alloc[i] = d.q;                                          // คันที่อยู่ไตรมาสอื่น = ย้ายมาไตรมาสนี้
    put({ alloc, picks });
  };
  const dropCar = (i: number) => { const alloc = { ...d.alloc }, picks = { ...d.picks }; delete alloc[i]; delete picks[i]; put({ alloc, picks }); };
  const partCount = (i: number) => (d.picks[i] || []).length;
  const qParts = quarterParts(d);
  const dropPart = (pi: number) => setPending({
    spec: { danger: true, title: "ยืนยันการเอาอะไหล่ออก", sub: PARTS[pi].name + " จะถูกเอาออกจากรถทุกคันในไตรมาส " + d.q, cancel: "ยกเลิก", ok: "เอาออก" },
    run: () => { const picks = { ...d.picks }; inQ.forEach((c) => { picks[c] = (picks[c] || []).filter((x) => x !== pi); }); put({ picks }); },
  });

  /* ---------- ตรวจและบันทึก ---------- */
  const E = (m: string, when: boolean) => (errors && when ? m : undefined);
  const valid = !!d.name.trim() && !!d.year && ready && nIn > 0;
  const leave = () => {
    const go = () => { setMock((s) => ({ ...s, draft: null })); router.push("/plans/"); };
    if (!isDirty(d)) return go();
    setPending({ spec: { title: "ยืนยันการออก", sub: "ข้อมูลที่กรอกไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ออก" }, run: go });
  };
  const save = () => {
    if (!valid) { setErrors(true); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (mock.failSave) { notify("general error", "Error"); return; }
    setMock((s) => ({ ...s, draft: null, plans: [planFromDraft(d, s.plans, thaiToday()), ...s.plans] }));
    notify("ส่งแผนบำรุงรักษาเพื่ออนุมัติสำเร็จ");
    router.push("/plans/");
  };

  const table = (cols: TableColumn[], rows: TableValue[][]) => (mob ? <MobileCards columns={cols} rows={rows} /> : <Table columns={cols} rows={rows} />);
  const row = (kids: ReactNode, n: number) => <div className={cx(mob ? "flex flex-col gap-4" : n === 3 ? "grid grid-cols-3 gap-6" : "grid grid-cols-2 gap-6")}>{kids}</div>;
  const empty = (t: string, s: string) => <EmptyStateDataEmpty Text={t} SupportingText={s} />;
  const toS21 = (qs: string) => router.push("/soon/?s=S21&" + qs);

  const carList = cars.filter(([c]) => !query || c.plate.includes(query));

  return (
    <AppFrame>
      <PageHeader Title="สร้างแผนบำรุงรักษา" onBack={leave} crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: "สร้างแผน" }]} />
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <SectionHeader Title="ข้อมูลแผน" />
          {row(<>
            <TextInput LabelText="ชื่อแผน" Text={d.name} Placeholder="ระบุชื่อแผน" onChange={(v) => put({ name: v })}
              State={E("x", !d.name.trim()) ? "Error" : undefined} HelperText={E("กรุณาระบุชื่อแผน", !d.name.trim())} />
            <InputDropdown LabelText="ปีงบประมาณ" Text={d.year} Placeholder="เลือกปีงบประมาณ" open={open === "year"} onOpenChange={toggle("year")}
              State={E("x", !d.year) ? (open === "year" ? "Error Focused" : "Error") : undefined} HelperText={E("กรุณาเลือกปีงบประมาณ", !d.year)}>
              <DropdownList>{YEARS.map((y) => <DropdownListItem key={y} Text={y} State={y === d.year ? "Selected" : "Default"} onClick={() => { put({ year: y }); setOpen(""); }} />)}</DropdownList>
            </InputDropdown>
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
              ? table(CARP_COLS, inQ.map((i) => [CAND[i].plate, CAND[i].model, CAND[i].owner, OIL_OPTS[(d.picks[i] || []).includes(0) ? 1 : 0], LAST_OIL[i], partCount(i) ? partCount(i) + " รายการ" : "ยังไม่เลือก",
                  { actions: [{ IconSwap: "stylus-24-300-round", label: "แก้ไขอะไหล่ " + CAND[i].plate, onClick: () => toS21("car=" + i) }, { IconSwap: "delete-24-300-round", label: "เอา " + CAND[i].plate + " ออกจากไตรมาส", onClick: () => dropCar(i) }] }]))
              : empty("ยังไม่มีรถในไตรมาสนี้", "ค้นทะเบียนในช่องเลือกรถเพื่อเพิ่มรถเข้าไตรมาสนี้")}
          </section>
        )}

        <section className="flex flex-col gap-4">
          <SectionHeader Title={"อะไหล่ในไตรมาส" + (ready && !noCars ? " " + d.q : "")} Badge={qParts.length || null}
            Actions={<SecondaryButton Text="เพิ่มอะไหล่" LeadingIconSwap="add-24-300-round" State={inQ.length ? "Default" : "Disabled"} onClick={() => toS21("q=" + d.q)} />} />
          {qParts.length
            ? table(PART_COLS, qParts.map(([pi, n]) => [PARTS[pi].name, PARTS[pi].code, PARTS[pi].group, String(n), PARTS[pi].unit,
                { actions: [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + PARTS[pi].name, onClick: () => toS21("q=" + d.q) }, { IconSwap: "delete-24-300-round", label: "เอา " + PARTS[pi].name + " ออก", onClick: () => dropPart(pi) }] }]))
            : empty("ยังไม่มีรายการอะไหล่", inQ.length ? "กดเพิ่มอะไหล่เพื่อเลือกอะไหล่ของรถในไตรมาสนี้" : "เลือกรถเข้าไตรมาสนี้ก่อน แล้วจึงเพิ่มอะไหล่ได้")}
        </section>

        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={leave} />
          <PrimaryButton Text="บันทึกและส่งอนุมัติ" Size="lg" onClick={save} />
        </div>
      </div>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </AppFrame>
  );
}
