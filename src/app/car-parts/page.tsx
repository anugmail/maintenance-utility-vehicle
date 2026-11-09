"use client";
/* S21 · หน้า จัดการอะไหล่ของรถ (/car-parts/?id=new|Z7000004&q=1&car=82-6789) — carPartsScreen() ใน screens.js (Figma เสร็จ 5 พ.ย. 2569 · BACKLOG ข้อ 11) · เฉพาะหน่วยงานผู้สร้างแผน (PLAN_ROLES)
   เปิดจากไอคอนแก้ไขที่แถวรถในแท็บไตรมาส n ของฟอร์มแผน (S1 สร้าง · S19 แก้ไข) · บันทึกแล้วกลับแท็บไตรมาสเดิม
   ตาม Page header · Input dropdown · Section header · Radio text card · Text input (Readonly) · Table · Empty state/Data empty · Modal Type=Form (Card form row Input 1/Input 2) ของไฟล์ Component
   + PartsInventoryPanel ของไฟล์ Maintain-D (คลังอะไหล่ของงานซ่อม) + หน้า Spare Part Request ของ RP & MA Job ใน UI Release#2
   Page header "จัดการอะไหล่ของรถ {ทะเบียน}" · Breadcrumbs บำรุงรักษาตามวาระ › สร้างแผน (แก้ไข: แก้ไขแผน MR …) › จัดการอะไหล่ของรถ
   Content ช่องไฟ 32:
     1. Input dropdown "รถ" (ครึ่งกว้างบน desktop · ไอคอน search) — รถของไตรมาสที่เปิดมาเท่านั้น (สลับคันในหน้าเดิม ที่แก้ของทุกคันค้างไว้จนบันทึก)
     1.5 Section label "การเบิกอะไหล่" + Radio text card 2 ใบ (6 พ.ย. 2569 เจ้าของงาน "อยากเพิ่มการเบิก โดยอยากให้มีการเลือกว่า ว่าเบิกอะใหล่ หรือไม่เบิก ด้วย" · radioPick label ของ carPartsScreen)
        "เบิกอะไหล่" (เลือกอะไหล่ที่ต้องเบิกให้รถคันนี้) / "ไม่เบิกอะไหล่" (รถคันนี้ไม่ใช้อะไหล่จากการเบิก) · ไม่มีค่าเริ่มต้น (เลือกอะไหล่ไว้แล้ว = เบิก) · ไม่เบิก = ซ่อนข้อ 3 และ 4 คันนี้ไม่รวมในอะไหล่ในไตรมาส
     2. Section header "น้ำมันไฮโดรลิก" + Radio text card 3 ใบ (เก็บตัวอย่าง ค่าเริ่มต้น · เปลี่ยนน้ำมัน · เก็บตัวอย่างและเปลี่ยน)
        เปลี่ยนน้ำมัน: แถว Input dropdown "เบอร์น้ำมัน" (ISO VG 32/46/68) · Text input "รหัสน้ำมัน" · "จำนวน (ลิตร)" · แถว Text input Readonly "เปลี่ยนน้ำมันครั้งล่าสุด"
     3. (เบิกอะไหล่) PartsInventoryPanel คลังอะไหล่ (ไส้กรองและอะไหล่ ไม่รวมน้ำมันไฮโดรลิก) — กดเลือก/เอาออก
     4. (เบิกอะไหล่) Section header "อะไหล่อื่นๆ" (Badge จำนวน) + Secondary button "ระบุอะไหล่เพิ่มเติม" → Table ชื่อ · ยี่ห้อ · รุ่น · รหัส · จำนวน · หน่วย · ไอคอนแก้ไข ลบ / Empty state
     5. ปุ่ม ย้อนกลับ · บันทึกอะไหล่ของรถ (lg · กดได้เมื่อเลือกไม่เบิก หรือเลือกเบิกแล้วมีอะไหล่อย่างน้อย 1 รายการ) → toast "บันทึกอะไหล่ของรถ {ทะเบียน} แล้ว"
   popup "ระบุอะไหล่เพิ่มเติม" (MANUAL_FIELDS): ชื่ออะไหล่ | ยี่ห้อ · รุ่น | รหัสอะไหล่ (ถ้ามี) · จำนวน | หน่วย · ปุ่ม ยกเลิก / เพิ่ม · มือถือ bottom sheet
   ย้อนกลับเมื่อมีการแก้ไข → ยืนยันการออก "อะไหล่ที่แก้ไขไว้จะไม่ถูกบันทึก" */
import { PagedTable } from "@/app/quarter/_shared/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { PartsInventoryPanel } from "@/components/maintain-d/PartsInventoryPanel";
import type { SparePart } from "@/components/maintain-d/SparePartCardItem";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { FormModal } from "@/components/patterns/FormModal";
import { AppFrame } from "@/components/shell/AppFrame";
import { CardFormRow } from "@/components/vms/CardFormRow";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { type TableValue } from "@/components/vms/Table";
import { CARP_PART_COLS } from "./cols";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { CAND, CAR_QTY, LAST_OIL, OIL_GRADES, OIL_PLAN_OPTS, OIL_SPEC, PARTS, PART_BM, PART_PRICE, PART_WH, oilChanges, type ManualPart, type OilSpec } from "@/lib/mock/data";
import { inQuarter, type Draft } from "@/lib/mock/plan";
import { PLAN_ROLES, carIndexOf, carParam, findPlan, oilChoice, useRoleGuard, usePlanGate } from "@/lib/mock/planFlow";
import { notify, setMock, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

/* อะไหล่ในคลัง = ไส้กรองและอะไหล่ (PARTS 1–4 · น้ำมันไฮโดรลิกมีส่วนของตัวเอง — carWarehouse()) */
const STOCK: SparePart[] = PARTS.map((p, i) => ({ name: p.name, code: p.code, unit: p.unit, price: PART_PRICE[i], warehouse: PART_WH[i], stock: p.stock }));
const OTHER = PARTS.map((_, i) => i).filter((i) => i > 0);
/* CARP_PART_COLS (ใช้ร่วมกับหน้าดูอะไหล่ของยานพาหนะ /car-parts/view/) */
const COLS = CARP_PART_COLS;

/* ที่แก้ของรถแต่ละคันในหน้านี้ (ยังไม่บันทึกลงฟอร์ม) — picks/qty = อะไหล่จากคลัง (ไม่รวมน้ำมัน) */
/* draw: "" = ยังไม่เลือก · take = เบิกอะไหล่ · none = ไม่เบิกอะไหล่ (6 พ.ย. 2569) */
type Draw = "" | "take" | "none";
const DRAW_OPTS = [{ Text: "เบิกอะไหล่", SupportingText: "เลือกอะไหล่ที่ต้องเบิกให้ยานพาหนะคันนี้" }, { Text: "ไม่เบิกอะไหล่", SupportingText: "ยานพาหนะคันนี้ไม่ใช้อะไหล่จากการเบิก" }];
interface CarEdit { oil: number; spec: OilSpec; picks: number[]; qty: Record<number, number>; manual: ManualPart[]; draw: Draw }
type Buffer = Record<number, CarEdit>;
const bufferOf = (d: Draft, cars: number[]): Buffer => Object.fromEntries(cars.map((c) => {
  const sp = d.oilSpec?.[c], litre = d.qty?.[c]?.[0];
  return [c, {
    oil: oilChoice(d, c) ?? 0, spec: { grade: sp?.grade ?? "", code: sp?.code ?? "", litre: sp?.litre ?? (litre != null ? String(litre) : "") },
    picks: (d.picks[c] || []).filter((x) => x !== 0), qty: Object.fromEntries(Object.entries(d.qty?.[c] ?? {}).filter(([k]) => k !== "0")),
    manual: (d.manual?.[c] ?? []).map((m) => ({ ...m })),
    draw: d.draw?.[c] === "none" ? "none" : (d.picks[c] || []).some((x) => x !== 0) || (d.manual?.[c] ?? []).length ? "take" : "",
  }];
}));
type Manual = { name: string; brand: string; model: string; code: string; qty: string; unit: string };
const EMPTY_M: Manual = { name: "", brand: "", model: "", code: "", qty: "", unit: "" };
/* แก้แถว: k = ลำดับในรายการเพิ่มเติม · pi = อะไหล่จากคลัง (แก้จำนวนได้อย่างเดียว) */
type Editing = { kind: "new" } | { kind: "manual"; k: number } | { kind: "stock"; pi: number };

function CarParts() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(PLAN_ROLES);
  const mock = useMock();
  const id = sp.get("id") ?? "new";
  const plan = id === "new" ? undefined : findPlan(mock.plans, id);
  const denied = usePlanGate(plan, "own");   // หน่วยงานเปิดแผนของหน่วยงานอื่น → หน้ารายการ (ตรวจสิทธิ์ 9 พ.ย. 2569)
  const d = id === "new" ? mock.draft : mock.edit && plan && mock.edit.editOf === plan.mr ? mock.edit : null;
  const q = Number(sp.get("q")) || d?.q || 1;
  const cars = d ? inQuarter(d, q) : [];
  const formHref = id === "new" ? "/new/" : "/edit/?id=" + id + (sp.get("from") ? "&from=" + sp.get("from") : "");
  const formCrumb = plan ? "แก้ไขแผน " + plan.mr : "สร้างแผน";

  const [buf, setBuf] = useState<Buffer | null>(null);
  const [orig, setOrig] = useState("");
  const [open, setOpen] = useState<"" | "car" | "grade">("");
  const [query, setQuery] = useState("");
  const [invQuery, setInvQuery] = useState("");
  const [editing, setEditing] = useState<Editing | null>(null);
  const [m, setM] = useState<Manual>(EMPTY_M);
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  useEffect(() => {
    if (!ok) return;
    if (!d || !cars.length) { router.replace(formHref); return; }   // ไม่มีฟอร์มค้าง / ไตรมาสไม่มีรถ → กลับฟอร์ม
    if (!buf) { const b = bufferOf(d, cars); setBuf(b); setOrig(JSON.stringify(b)); }
  }, [ok, d, cars, buf, formHref, router]);
  if (!ok || !d || !buf) return null;
  if (denied) return null;

  const pIdx = carIndexOf(sp.get("car"));
  const car = cars.includes(pIdx) ? pIdx : cars[0];
  const e = buf[car];
  const set = (patch: Partial<CarEdit>) => setBuf({ ...buf, [car]: { ...e, ...patch } });
  const togglePart = (pi: number) => {
    if (e.picks.includes(pi)) { const { [pi]: _x, ...qty } = e.qty; void _x; set({ picks: e.picks.filter((x) => x !== pi), qty }); }
    else set({ picks: [...e.picks, pi] });
  };
  /* เลือกเปลี่ยนน้ำมัน: รหัสและจำนวนลิตรตั้งต้นตาม OIL_SPEC (จอ "เลือกเปลี่ยนน้ำมัน — ระบุเบอร์น้ำมัน รหัส จำนวนลิตร") · เบอร์ให้เลือกเอง */
  const setOil = (v: string) => {
    const k = OIL_PLAN_OPTS.indexOf(v);
    set({ oil: k, spec: oilChanges(k) ? { grade: e.spec.grade, code: e.spec.code || OIL_SPEC.code, litre: e.spec.litre || OIL_SPEC.litre } : e.spec });
  };
  const setSpec = (p: Partial<OilSpec>) => set({ spec: { ...e.spec, ...p } });
  const qtyOf = (pi: number) => e.qty[pi] ?? CAR_QTY[pi];
  const dirty = JSON.stringify(buf) !== orig;
  const canSave = e.draw === "none" || (e.draw === "take" && e.picks.length + e.manual.length > 0);
  const goCar = (i: number) => { setOpen(""); setQuery(""); router.replace("/car-parts/?id=" + id + "&q=" + q + "&car=" + carParam(i) + (sp.get("from") ? "&from=" + sp.get("from") : "")); };

  /* popup ระบุอะไหล่เพิ่มเติม / แก้ไขแถว */
  const openNew = () => { setM(EMPTY_M); setEditing({ kind: "new" }); };
  const openManual = (k: number) => { const x = e.manual[k]; setM({ name: x.name, brand: x.brand ?? "", model: x.model ?? "", code: x.code, qty: String(x.qty), unit: x.unit ?? "" }); setEditing({ kind: "manual", k }); };
  const openStock = (pi: number) => { setM({ name: PARTS[pi].name, brand: PART_BM[pi][0], model: PART_BM[pi][1], code: PARTS[pi].code, qty: String(qtyOf(pi)), unit: PARTS[pi].unit }); setEditing({ kind: "stock", pi }); };
  const nQty = Number(m.qty.replace(/,/g, ""));
  const mOk = editing?.kind === "stock" ? nQty > 0 : !!m.name.trim() && !!m.brand.trim() && !!m.model.trim() && nQty > 0 && !!m.unit.trim();
  const saveM = () => {
    if (!editing || !mOk) return;
    if (editing.kind === "stock") set({ qty: { ...e.qty, [editing.pi]: nQty } });
    else {
      const row: ManualPart = { name: m.name.trim(), brand: m.brand.trim(), model: m.model.trim(), code: m.code.trim(), qty: nQty, unit: m.unit.trim() };
      set({ manual: editing.kind === "new" ? [...e.manual, row] : e.manual.map((x, j) => (j === editing.k ? row : x)) });
    }
    setEditing(null);
  };

  const leave = () => {
    if (!dirty) return router.push(formHref);
    setPending({ spec: { title: "ยืนยันการออก", sub: "อะไหล่ที่แก้ไขไว้จะไม่ถูกบันทึก", cancel: "ยกเลิก", ok: "ยืนยัน" }, run: () => router.push(formHref) });
  };
  const save = () => {
    if (!canSave) return;
    if (mock.failSave) { notify("general error", "Error"); return; }
    const key = id === "new" ? "draft" : "edit";
    setMock((s) => {
      const cur = s[key];
      if (!cur) return s;
      const picks = { ...cur.picks }, qty = { ...(cur.qty ?? {}) }, manual = { ...(cur.manual ?? {}) }, oils = { ...(cur.oils ?? {}) }, oilSpec = { ...(cur.oilSpec ?? {}) }, draw = { ...(cur.draw ?? {}) };
      Object.entries(buf).forEach(([c, b]) => {
        const i = Number(c), change = oilChanges(b.oil), litre = Number(b.spec.litre) || 0;
        /* ไม่เบิกอะไหล่ = เก็บแค่น้ำมันไฮโดรลิก ไม่มีอะไหล่จากคลังและรายการเพิ่มเติม */
        const v = b.draw === "none" ? { ...b, picks: [], qty: {}, manual: [] } : b;
        if (b.draw === "none") draw[i] = "none"; else delete draw[i];
        oils[i] = v.oil;
        oilSpec[i] = v.spec;
        picks[i] = change ? [0, ...v.picks] : v.picks;   // เปลี่ยนน้ำมัน = น้ำมันไฮโดรลิกเข้ารายการอะไหล่ (ลิตร = จำนวน)
        const q2: Record<number, number> = Object.fromEntries(Object.entries(v.qty).filter(([pi]) => v.picks.includes(Number(pi))));
        if (change) q2[0] = litre;
        qty[i] = q2;
        manual[i] = v.manual;
      });
      return { ...s, [key]: { ...cur, picks, qty, manual, oils, oilSpec, draw, q } };
    });
    notify("บันทึกอะไหล่ของยานพาหนะ " + CAND[car].plate + " แล้ว");
    router.push(formHref);
  };

  const half = (kid: ReactNode) => <div className={cx(mob ? "flex flex-col" : "grid grid-cols-2 gap-6")}>{kid}{!mob && <span />}</div>;
  const third = (kids: ReactNode, spacers = 0) => <div className={cx(mob ? "flex flex-col gap-4" : "grid grid-cols-3 gap-6")}>{kids}{!mob && Array.from({ length: spacers }, (_, k) => <span key={k} />)}</div>;
  const carList = cars.filter((i) => !query || CAND[i].plate.includes(query));
  const icons = (label: string, onEdit: () => void, onDel: () => void) => {
    const a = [{ IconSwap: "stylus-24-300-round", label: "แก้ไข " + label, onClick: onEdit }, { IconSwap: "delete-24-300-round", label: "ลบ " + label, onClick: onDel }];
    return { actions: a, mobileActions: a };
  };
  const rows: TableValue[][] = [
    ...e.picks.map((pi) => [PARTS[pi].name, PART_BM[pi][0], PART_BM[pi][1], PARTS[pi].code, String(qtyOf(pi)), PARTS[pi].unit, icons(PARTS[pi].name, () => openStock(pi), () => togglePart(pi))]),
    ...e.manual.map((x, k) => [x.name, x.brand || "-", x.model || "-", x.code || "-", String(x.qty), x.unit || "-", icons(x.name, () => openManual(k), () => set({ manual: e.manual.filter((_, j) => j !== k) }))]),
  ];
  const stockEdit = editing?.kind === "stock";
  const fld = (label: string, k: keyof Manual, placeholder: string, opt?: boolean) => (
    <TextInput LabelText={label} Optional={opt} Text={m[k]} Placeholder={placeholder} State={stockEdit && k !== "qty" ? "Readonly" : undefined} readOnly={stockEdit && k !== "qty"}
      onChange={(v) => setM({ ...m, [k]: v })} />
  );

  return (
    <>
      <PageHeader Title={"จัดการอะไหล่ของยานพาหนะ " + CAND[car].plate} onBack={leave}
        crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: formCrumb, onClick: leave }, { Text: "จัดการอะไหล่ของยานพาหนะ" }]} />
      <div className="flex flex-col gap-8">
        {half(
          <InputDropdown LabelText="ยานพาหนะ" Text={open === "car" ? query : CAND[car].plate} Placeholder="เลือกยานพาหนะในไตรมาสนี้" LeadingIconSwap="search-24-300-round"
            onQuery={setQuery} open={open === "car"} onOpenChange={(v) => { setOpen(v ? "car" : ""); setQuery(""); }}>
            <DropdownList>{carList.map((i) => <DropdownListItem key={i} Text={CAND[i].plate} State={i === car ? "Selected" : "Default"} onClick={() => goCar(i)} />)}</DropdownList>
          </InputDropdown>,
        )}
        <section className="flex flex-col gap-4">
          <SectionLabel Title="การเบิกอะไหล่" />
          <RadioTextCards options={DRAW_OPTS} value={e.draw === "take" ? DRAW_OPTS[0].Text : e.draw === "none" ? DRAW_OPTS[1].Text : null}
            onChange={(v) => set({ draw: v === DRAW_OPTS[1].Text ? "none" : "take" })} />
        </section>
        <section className="flex flex-col gap-4">
          <SectionHeader Title="น้ำมันไฮโดรลิก" />
          <RadioTextCards options={OIL_PLAN_OPTS.map((t) => ({ Text: t }))} value={OIL_PLAN_OPTS[e.oil]} onChange={setOil} />
          {oilChanges(e.oil) && third(<>
            <InputDropdown LabelText="เบอร์น้ำมัน" Text={e.spec.grade} Placeholder="เลือกเบอร์น้ำมัน" open={open === "grade"} onOpenChange={(v) => setOpen(v ? "grade" : "")}>
              <DropdownList>{OIL_GRADES.map((g) => <DropdownListItem key={g} Text={g} State={g === e.spec.grade ? "Selected" : "Default"} onClick={() => { setSpec({ grade: g }); setOpen(""); }} />)}</DropdownList>
            </InputDropdown>
            <TextInput LabelText="รหัสน้ำมัน" Text={e.spec.code} Placeholder="ระบุรหัสน้ำมัน" onChange={(v) => setSpec({ code: v })} />
            <TextInput LabelText="จำนวน (ลิตร)" Text={e.spec.litre} Placeholder="0" inputMode="numeric" onChange={(v) => setSpec({ litre: v.replace(/[^\d.]/g, "") })} />
          </>)}
          {third(<TextInput LabelText="เปลี่ยนน้ำมันครั้งล่าสุด" Text={LAST_OIL[car]} State="Readonly" readOnly />, 2)}
        </section>
        {e.draw === "take" && <PartsInventoryPanel parts={OTHER.map((i) => STOCK[i])} picked={e.picks.map((pi) => PARTS[pi].code)} onPick={(p) => togglePart(PARTS.findIndex((x) => x.code === p.code))} query={invQuery} onQuery={setInvQuery} />}
        {e.draw === "take" && <section className="flex flex-col gap-4">
          <SectionHeader Title="อะไหล่อื่นๆ" Badge={rows.length || null}
            Actions={<SecondaryButton Text="ระบุอะไหล่เพิ่มเติม" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={openNew} />} />
          {rows.length
            ? <PagedTable columns={COLS} rows={rows} />
            : <EmptyStateDataEmpty Text="ยังไม่มีรายการอะไหล่" SupportingText="เลือกไส้กรองหรืออะไหล่อื่นจากคลัง หรือกดระบุอะไหล่เพิ่มเติม" />}
        </section>}
        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={leave} />
          <PrimaryButton Text="บันทึกอะไหล่ของยานพาหนะ" Size="lg" State={canSave ? "Default" : "Disabled"} onClick={save} />
        </div>
      </div>
      <FormModal open={!!editing} title={editing?.kind === "new" ? "ระบุอะไหล่เพิ่มเติม" : "แก้ไขอะไหล่"} ok={editing?.kind === "new" ? "เพิ่ม" : "บันทึก"} cancel="ยกเลิก"
        okDisabled={!mOk} onOk={saveM} onCancel={() => setEditing(null)}>
        {mob ? <>
          {fld("ชื่ออะไหล่", "name", "ระบุชื่ออะไหล่")}{fld("ยี่ห้อ", "brand", "ระบุยี่ห้อ")}{fld("รุ่น", "model", "ระบุรุ่น")}
          {fld("รหัสอะไหล่", "code", "ระบุรหัสอะไหล่", true)}{fld("จำนวน", "qty", "0")}{fld("หน่วย", "unit", "ระบุหน่วย")}
        </> : <>
          <CardFormRow Input1={fld("ชื่ออะไหล่", "name", "ระบุชื่ออะไหล่")} Input2={fld("ยี่ห้อ", "brand", "ระบุยี่ห้อ")} />
          <CardFormRow Input1={fld("รุ่น", "model", "ระบุรุ่น")} Input2={fld("รหัสอะไหล่", "code", "ระบุรหัสอะไหล่", true)} />
          <CardFormRow Input1={fld("จำนวน", "qty", "0")} Input2={fld("หน่วย", "unit", "ระบุหน่วย")} />
        </>}
      </FormModal>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><CarParts /></Suspense></AppFrame>;
}
