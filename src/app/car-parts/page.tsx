"use client";
/* S21 · หน้า อะไหล่ของรถ (/car-parts/?id=new|Z7000004&q=1&car=82-6789) — carPartsScreen() ใน screens.js · เฉพาะบทบาท กบค.
   เปิดจากฟอร์มแผน (S1 สร้าง · S19 แก้ไข): ปุ่ม "เพิ่มอะไหล่" (คันแรกของไตรมาส) · ไอคอนแก้ไขของแถวรถ / แถวอะไหล่ · บันทึกแล้วกลับฟอร์มเดิม
   Content ช่องไฟ 32:
     1. Input dropdown "รถ" (ครึ่งกว้างบน desktop · ไอคอน search) — Dropdown list = รถของไตรมาสที่เปิดมาเท่านั้น
     2. Section header "น้ำมันไฮโดรลิก" + Radio text card เก็บตัวอย่าง (ค่าเริ่มต้น) · เปลี่ยนน้ำมัน (เปลี่ยนน้ำมัน = น้ำมันเข้ารายการอะไหล่ · เก็บตัวอย่าง = เอาออก)
        + Text input State=Readonly "เปลี่ยนน้ำมันครั้งล่าสุด" (ครึ่งกว้าง · ไม่มีประวัติ "ไม่มีข้อมูล")
     3. PartRequestStepPanel (ไฟล์ Maintain-D · CLAUDE.md ข้อ 12): PartsInventoryPanel คลังอะไหล่ (Smart Inventory · คลังสำรอง ไม่มี "แนะนำ")
        | RequestedPartsPanel "อะไหล่ของรถคันนี้" — Spare Part Card Item V2 รายการที่เลือก (แก้จำนวน/เอาออก) + การ์ด "รายการเพิ่มเติม" (ระบุเอง) + รวมค่าอะไหล่ (ต้องจัดซื้อ = 0 ช่วงวางแผน)
        มือถือ: แผงเรียงลง (คลังบน · ที่เลือกล่าง — COMPOSED.md)
     4. ปุ่ม ย้อนกลับ · บันทึกอะไหล่ของรถ (lg) — บันทึกปิดไว้จนกว่ารายการเพิ่มเติมจะกรอกชื่อและราคาต่อหน่วยครบ (Condition: ชื่อ ราคา บังคับ · รหัสไม่บังคับ)
   เลือกรถคันอื่น = สลับคันในหน้าเดิม (ที่แก้ของทุกคันค้างไว้จนบันทึก) · ย้อนกลับเมื่อมีการแก้ไข → ยืนยันการออก */
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { PartRequestStepPanel } from "@/components/maintain-d/PartRequestStepPanel";
import { PartsInventoryPanel } from "@/components/maintain-d/PartsInventoryPanel";
import { RequestedPartsPanel } from "@/components/maintain-d/RequestedPartsPanel";
import { SparePartCardItem, type SparePart } from "@/components/maintain-d/SparePartCardItem";
import { ConfirmDialog, type ConfirmSpec } from "@/components/patterns/ConfirmDialog";
import { AppFrame } from "@/components/shell/AppFrame";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { PageHeader } from "@/components/vms/PageHeader";
import { PrimaryButton } from "@/components/vms/PrimaryButton";
import { RadioTextCards } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { CAND, CAR_QTY, LAST_OIL, OIL_OPTS, PARTS, PART_PRICE, PART_WH, type ManualPart } from "@/lib/mock/data";
import { inQuarter, type Draft } from "@/lib/mock/plan";
import { carCost, carIndexOf, carParam, findPlan, useRoleGuard } from "@/lib/mock/planFlow";
import { notify, setMock, useMock } from "@/lib/mock/store";
import { useBreakpoint } from "@/lib/useBreakpoint";

/* อะไหล่ในคลัง (PARTS + WH + PRICE ของ screens.js) */
const STOCK: SparePart[] = PARTS.map((p, i) => ({ name: p.name, code: p.code, unit: p.unit, price: PART_PRICE[i], warehouse: PART_WH[i], stock: p.stock }));

/* ที่แก้ของรถแต่ละคันในหน้านี้ (ยังไม่บันทึกลงฟอร์ม) */
interface CarEdit { picks: number[]; qty: Record<number, number>; manual: ManualPart[] }
type Buffer = Record<number, CarEdit>;
const bufferOf = (d: Draft, cars: number[]): Buffer =>
  Object.fromEntries(cars.map((c) => [c, { picks: [...(d.picks[c] || [])], qty: { ...(d.qty?.[c] ?? {}) }, manual: (d.manual?.[c] ?? []).map((m) => ({ ...m })) }]));
const manualOk = (m: ManualPart) => !!m.name.trim() && !!m.price.trim();

function CarParts() {
  const router = useRouter();
  const sp = useSearchParams();
  const mob = useBreakpoint() === "Mobile";
  const ok = useRoleGuard(["กบค."]);
  const mock = useMock();
  const id = sp.get("id") ?? "new";
  const plan = id === "new" ? undefined : findPlan(mock.plans, id);
  const d = id === "new" ? mock.draft : mock.edit && plan && mock.edit.editOf === plan.mr ? mock.edit : null;
  const q = Number(sp.get("q")) || d?.q || 1;
  const cars = d ? inQuarter(d, q) : [];
  const formHref = id === "new" ? "/new/" : "/edit/?id=" + id + (sp.get("from") ? "&from=" + sp.get("from") : "");
  const formCrumb = plan ? "แก้ไขแผน " + plan.mr : "สร้างแผน";

  const [buf, setBuf] = useState<Buffer | null>(null);
  const [orig, setOrig] = useState("");
  const [openCar, setOpenCar] = useState(false);
  const [query, setQuery] = useState("");
  const [invQuery, setInvQuery] = useState("");
  const [pending, setPending] = useState<{ spec: ConfirmSpec; run: () => void } | null>(null);
  useEffect(() => {
    if (!ok) return;
    if (!d || !cars.length) { router.replace(formHref); return; }   // ไม่มีฟอร์มค้าง / ไตรมาสไม่มีรถ → กลับฟอร์ม
    if (!buf) { const b = bufferOf(d, cars); setBuf(b); setOrig(JSON.stringify(b)); }
  }, [ok, d, cars, buf, formHref, router]);
  if (!ok || !d || !buf) return null;

  const pIdx = carIndexOf(sp.get("car"));
  const car = cars.includes(pIdx) ? pIdx : cars[0];
  const e = buf[car];
  const set = (patch: Partial<CarEdit>) => setBuf({ ...buf, [car]: { ...e, ...patch } });
  const togglePart = (pi: number) => {
    if (e.picks.includes(pi)) { const { [pi]: _x, ...qty } = e.qty; void _x; set({ picks: e.picks.filter((x) => x !== pi), qty }); }
    else set({ picks: [...e.picks, pi] });
  };
  const oil = OIL_OPTS[e.picks.includes(0) ? 1 : 0];
  const setOil = (v: string) => { if ((v === OIL_OPTS[1]) !== e.picks.includes(0)) togglePart(0); };
  const qtyOf = (pi: number) => e.qty[pi] ?? CAR_QTY[pi];
  const setManual = (k: number, patch: Partial<ManualPart>) => set({ manual: e.manual.map((m, j) => (j === k ? { ...m, ...patch } : m)) });
  const dirty = JSON.stringify(buf) !== orig;
  const canSave = Object.values(buf).every((c) => c.manual.every(manualOk));
  const goCar = (i: number) => { setOpenCar(false); setQuery(""); router.replace("/car-parts/?id=" + id + "&q=" + q + "&car=" + carParam(i) + (sp.get("from") ? "&from=" + sp.get("from") : "")); };

  const leave = () => {
    if (!dirty) return router.push(formHref);
    setPending({ spec: { title: "ยืนยันการออก", sub: "อะไหล่ที่แก้ไขไว้จะไม่ถูกบันทึก", cancel: "ปิด", ok: "ออก" }, run: () => router.push(formHref) });
  };
  const save = () => {
    if (mock.failSave) { notify("general error", "Error"); return; }
    const key = id === "new" ? "draft" : "edit";
    setMock((s) => {
      const cur = s[key];
      if (!cur) return s;
      const picks = { ...cur.picks }, qty = { ...(cur.qty ?? {}) }, manual = { ...(cur.manual ?? {}) };
      Object.entries(buf).forEach(([c, v]) => {
        const i = Number(c);
        picks[i] = v.picks;
        qty[i] = Object.fromEntries(Object.entries(v.qty).filter(([pi]) => v.picks.includes(Number(pi))));
        manual[i] = v.manual.map((m) => ({ ...m, name: m.name.trim(), code: m.code.trim(), price: m.price.trim() }));
      });
      return { ...s, [key]: { ...cur, picks, qty, manual, q } };
    });
    notify("บันทึกอะไหล่ของรถ " + CAND[car].plate + " แล้ว");
    router.push(formHref);
  };

  const half = (kid: ReactNode) => <div className={cx(mob ? "flex flex-col" : "grid grid-cols-2 gap-6")}>{kid}{!mob && <span />}</div>;
  const carList = cars.filter((i) => !query || CAND[i].plate.includes(query));
  const nPicked = e.picks.length + e.manual.length;

  return (
    <>
      <PageHeader Title="อะไหล่ของรถ" onBack={leave} crumbs={[{ Text: "บำรุงรักษาตามวาระ", onClick: leave }, { Text: formCrumb, onClick: leave }, { Text: "อะไหล่ของรถ" }]} />
      <div className="flex flex-col gap-8">
        {half(
          <InputDropdown LabelText="รถ" Text={openCar ? query : CAND[car].plate} Placeholder="เลือกรถในไตรมาสนี้" LeadingIconSwap="search-24-300-round"
            onQuery={setQuery} open={openCar} onOpenChange={(v) => { setOpenCar(v); setQuery(""); }}>
            <DropdownList>{carList.map((i) => <DropdownListItem key={i} Text={CAND[i].plate} State={i === car ? "Selected" : "Default"} onClick={() => goCar(i)} />)}</DropdownList>
          </InputDropdown>,
        )}
        <section className="flex flex-col gap-4">
          <SectionHeader Title="น้ำมันไฮโดรลิก" />
          <RadioTextCards options={OIL_OPTS.map((t) => ({ Text: t }))} value={oil} onChange={setOil} />
          {half(<TextInput LabelText="เปลี่ยนน้ำมันครั้งล่าสุด" Text={LAST_OIL[car]} State="Readonly" readOnly />)}
        </section>
        <PartRequestStepPanel
          Inventory={<PartsInventoryPanel parts={STOCK} picked={e.picks.map((pi) => PARTS[pi].code)} onPick={(p) => togglePart(PARTS.findIndex((x) => x.code === p.code))} query={invQuery} onQuery={setInvQuery} />}
          Requested={
            <RequestedPartsPanel Title="อะไหล่ของรถคันนี้" SupportingText="เลือกจากคลังหรือระบุเพิ่มเอง แก้จำนวนหรือเอาออกได้" Badge={nPicked || null}
              onAddManual={() => set({ manual: [...e.manual, { name: "", code: "", price: "", qty: 1 }] })}
              costs={[["เบิกจากคลัง", carCost(e.picks, e.qty, e.manual)], ["ต้องจัดซื้อ", 0]]}>
              {e.picks.map((pi) => <SparePartCardItem key={pi} อะไหล่="V2 รายการที่เลือก" part={STOCK[pi]} qty={qtyOf(pi)} onQty={(n) => set({ qty: { ...e.qty, [pi]: n } })} onDelete={() => togglePart(pi)} />)}
              {e.manual.map((m, k) => <SparePartCardItem key={"m" + k} อะไหล่="เพิ่มอะไหล่" manual={m} qty={m.qty} onManual={(p) => setManual(k, p)} onQty={(n) => setManual(k, { qty: n })} onDelete={() => set({ manual: e.manual.filter((_, j) => j !== k) })} />)}
            </RequestedPartsPanel>
          } />
        <div className={cx("flex", mob ? "gap-4 [&>*]:flex-1 [&>*]:basis-0" : "justify-between gap-3")}>
          <SecondaryButton Text="ย้อนกลับ" Size="lg" onClick={leave} />
          <PrimaryButton Text="บันทึกอะไหล่ของรถ" Size="lg" State={canSave ? "Default" : "Disabled"} onClick={() => canSave && save()} />
        </div>
      </div>
      <ConfirmDialog spec={pending?.spec ?? null} onCancel={() => setPending(null)} onOk={() => { pending?.run(); setPending(null); }} />
    </>
  );
}

export default function Page() {
  return <AppFrame><Suspense><CarParts /></Suspense></AppFrame>;
}
