"use client";
import { useState } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TertiaryBrandButton } from "@/components/vms/TertiaryBrandButton";
import { CardItemRow } from "@/components/vms/CardItemRow";
import { TextInput } from "@/components/vms/TextInput";
import type { Car } from "@/lib/mock/data";
import { LIFT_UNIT, MACHINE_TYPES, NO_LIFT, nf0, saveMachine, usedAssets, useMachines, type Machine } from "@/lib/mock/machines";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { hasEquipment, sideCodeOf } from "@/lib/mock/vehicleTypes";
import { useProtoForm } from "@/lib/protoForm";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { cx } from "@/lib/cx";

export const MACHINE_EDIT_ROLES = ["กบค."] as const;

interface Draft { type: string; brand: string; model: string; asset: string; subAsset: string; lift: string; engineHours: string; craneHours: string; hc: string; serial: string; engineNo: string }
const toDraft = (x?: Machine): Draft => ({
  type: x?.type ?? "", brand: x?.brand ?? "", model: x?.model ?? "", asset: x?.asset ?? "", subAsset: x?.subAsset ?? "",
  lift: x?.lift != null ? String(x.lift) : "", engineHours: x ? String(x.engineHours) : "", craneHours: x ? String(x.craneHours) : "", hc: x?.hc ?? "", serial: x?.serial ?? "", engineNo: x?.engineNo ?? "",
});
const intOk = (v: string) => /^\d+$/.test(v.replace(/,/g, ""));
const toInt = (v: string) => Number(v.replace(/,/g, ""));
const withSep = (v: string) => { const d = v.replace(/[^\d]/g, ""); return d ? Number(d).toLocaleString("en-US") : ""; };

function MachineModal({ open, carId, car, edit, list, onClose }: { open: boolean; carId: string; car: Car; edit: Machine | null; list: Machine[]; onClose: () => void }) {
  const m = useMock();
  const mob = useBreakpoint() === "Mobile";
  const [d, setD] = useState<Draft>(toDraft());
  const [tried, setTried] = useState(false);
  const [dd, setDd] = useState(false);
  const [seen, setSeen] = useState<string | null>(null);
  const key = open ? (edit?.key ?? "new") : null;
  if (key !== seen) {
    if (key) {
      const base = list[0]?.asset ?? "";
      const nextSub = String(Math.max(0, ...list.map((x) => Number(x.subAsset) || 0)) + 1).padStart(4, "0");
      setD(edit ? toDraft(edit) : { ...toDraft(), asset: base, subAsset: nextSub });
      setTried(false); setDd(false);
    }
    setSeen(key);
  }
  const put = (k: keyof Draft) => (v: string) => setD((x) => ({ ...x, [k]: v }));
  const needLift = !NO_LIFT.includes(d.type);
  const dup = usedAssets(m, edit ? { carId, key: edit.key } : undefined).has(d.asset + "-" + d.subAsset);
  const err: Partial<Record<keyof Draft, string>> = {
    type: !d.type ? "กรุณาเลือกประเภทเครื่องมือกล" : undefined,
    brand: !d.brand.trim() ? "กรุณาระบุยี่ห้อ" : undefined,
    model: !d.model.trim() ? "กรุณาระบุรุ่น" : undefined,
    asset: !/^\d{12}$/.test(d.asset) ? "กรุณาระบุรหัสทรัพย์สิน 12 หลัก" : undefined,
    subAsset: !/^\d{4}$/.test(d.subAsset) ? "กรุณาระบุรหัสทรัพย์สินย่อย 4 หลัก" : dup ? "รหัสทรัพย์สิน " + d.asset + " - " + d.subAsset + " ถูกใช้แล้ว" : undefined,
    lift: needLift && (!intOk(d.lift) || toInt(d.lift) <= 0) ? "กรุณาระบุพิกัดยกเป็นตัวเลขมากกว่า 0" : !needLift && d.lift && !intOk(d.lift) ? "กรุณาระบุพิกัดยกเป็นตัวเลข" : undefined,
    engineHours: !intOk(d.engineHours) ? "กรุณาระบุชั่วโมงเครื่องยนต์เป็นจำนวนเต็มตั้งแต่ 0" : undefined,
    craneHours: !intOk(d.craneHours) ? "กรุณาระบุชั่วโมงเครื่องจักรเป็นจำนวนเต็มตั้งแต่ 0" : undefined,
  };
  const bad = Object.values(err).some(Boolean);
  const save = () => {
    setTried(true);
    if (bad) return;
    saveMachine(carId, car, {
      key: edit?.key ?? "m" + Date.now(), type: d.type, brand: d.brand.trim(), model: d.model.trim(), asset: d.asset, subAsset: d.subAsset,
      lift: d.lift ? toInt(d.lift) : undefined, engineHours: toInt(d.engineHours), craneHours: toInt(d.craneHours), hc: d.hc.trim() || undefined, serial: d.serial.trim() || undefined, engineNo: d.engineNo.trim() || undefined,
    });
    notify("บันทึกเครื่องมือกลสำเร็จ");
    onClose();
  };
  useProtoForm(open ? {
    fill: () => setD((x) => ({ ...x, type: x.type || "กระเช้า", brand: x.brand || "Aichi", model: x.model || "SK17A", lift: x.lift || "200", engineHours: x.engineHours || "0", craneHours: x.craneHours || "0" })),
    clear: () => { setSeen(null); },
    dirty: edit ? JSON.stringify(d) !== JSON.stringify(toDraft(edit)) : !!(d.type || d.brand || d.model || d.lift || d.engineHours || d.craneHours || d.hc || d.serial || d.engineNo),
  } : null);
  const f = (k: keyof Draft, label: string, o: { optional?: boolean; num?: boolean; ph?: string; max?: number } = {}) => (
    <TextInput LabelText={label} Optional={o.optional} Text={d[k]} Placeholder={o.ph ?? "ระบุ" + label.replace(/ \(.*\)$/, "")} inputMode={o.num ? "numeric" : undefined} maxLength={o.max}
      State={tried && err[k] ? "Error" : undefined} HelperText={tried ? err[k] : undefined} Size={mob ? "lg" : "md"}
      onChange={(v) => put(k)(o.num ? withSep(v) : o.max ? v.replace(/\D/g, "") : v)} />
  );
  return (
    <PopupModal open={open} title={edit || !list.length ? "แก้ไขเครื่องมือกล" : "เพิ่มเครื่องมือกล"} sub={car.plate} width={800} ok="บันทึก" onOk={save} onCancel={onClose}>
      {mob && <p className="text-sm text-gray-600">{car.plate}</p>}
      <div className={cx(mob ? "flex flex-col gap-4" : "grid grid-cols-2 gap-x-6 gap-y-4")}>
        <InputDropdown LabelText="ประเภทเครื่องมือกล" Size={mob ? "lg" : "md"} Text={d.type} Placeholder="เลือกประเภทเครื่องมือกล" open={dd} onOpenChange={setDd}
          State={tried && err.type ? "Error" : undefined} HelperText={tried ? err.type : undefined}>
          <DropdownList>{MACHINE_TYPES.map((t) => <DropdownListItem key={t} Text={t} State={t === d.type ? "Selected" : "Default"} onClick={() => { put("type")(t); setDd(false); }} />)}</DropdownList>
        </InputDropdown>
        {f("lift", "พิกัดยก (" + LIFT_UNIT + ")", { optional: !needLift, num: true, ph: "เช่น 200" })}
        {f("brand", "ยี่ห้อ")}
        {f("model", "รุ่น")}
        {f("asset", "รหัสทรัพย์สิน", { ph: "12 หลัก", max: 12 })}
        {f("subAsset", "รหัสทรัพย์สินย่อย", { ph: "4 หลัก เช่น 0001", max: 4 })}
        {f("engineHours", "ชั่วโมงเครื่องยนต์", { num: true, ph: "ชั่วโมง" })}
        {f("craneHours", "ชั่วโมงเครื่องจักร", { num: true, ph: "ชั่วโมง" })}
        {f("hc", "หมายเลข HC", { optional: true, ph: "เช่น HC - 9001" })}
        {f("serial", "หมายเลขประจำเครื่องจักร (Serial No.)", { optional: true, ph: "ระบุหมายเลขประจำเครื่องจักร" })}
        {f("engineNo", "หมายเลขเครื่องยนต์ (ส่วนเครื่องจักร)", { optional: true, ph: "ระบุหมายเลขเครื่องยนต์ของเครื่องจักร" })}
      </div>
    </PopupModal>
  );
}

export function MachineSection({ carId, car }: { carId: string; car: Car }) {
  return hasEquipment(sideCodeOf(car)) ? <MachineBody carId={carId} car={car} /> : null;
}

function MachineBody({ carId, car }: { carId: string; car: Car }) {
  const role = useRole();
  const mob = useBreakpoint() === "Mobile";
  const list = useMachines(carId, car);
  const canEdit = (MACHINE_EDIT_ROLES as readonly string[]).includes(role);
  const [edit, setEdit] = useState<Machine | null>(null);
  const [open, setOpen] = useState(false);
  const openEdit = (x: Machine | null) => { setEdit(x); setOpen(true); };
  const size = mob ? "lg" : "md";
  const add = canEdit && list.length ? <SecondaryButton Text="เพิ่มเครื่องมือกล" LeadingIconSwap="add-24-300-round" Size={size} onClick={() => openEdit(null)} /> : undefined;
  return (
    <section className="flex flex-col gap-2" aria-label="เครื่องมือกล" data-machine-section>
      <SectionLabel Title={list.length ? "เครื่องมือกล (" + list.length + ")" : "เครื่องมือกล"} Actions={add} className="min-h-10" />
      {list.length ? list.map((x) => <MachineCard key={x.key} x={x} canEdit={canEdit} onEdit={() => openEdit(x)} />)
        : <MachineCard x={null} canEdit={canEdit} onEdit={() => openEdit(null)} />}
      {canEdit && <MachineModal open={open} carId={carId} car={car} edit={edit} list={list} onClose={() => setOpen(false)} />}
    </section>
  );
}

function MachineCard({ x, canEdit, onEdit }: { x: Machine | null; canEdit: boolean; onEdit: () => void }) {
  const name = x ? [x.type, x.brand, x.model].filter(Boolean).join(" ") : "";
  const fields: [string, string | undefined][] = [
    ["ประเภทเครื่องมือกล", x?.type], ["ยี่ห้อ", x?.brand], ["รุ่น", x?.model],
    ["พิกัดยก (" + LIFT_UNIT + ")", x?.lift != null ? nf0(x.lift) : undefined],
    ["รหัสทรัพย์สิน", x?.asset], ["รหัสทรัพย์สินย่อย", x?.subAsset],
    ["ชั่วโมงเครื่องยนต์", x ? nf0(x.engineHours) : undefined], ["ชั่วโมงเครื่องจักร", x ? nf0(x.craneHours) : undefined],
    ["หมายเลข HC", x?.hc], ["หมายเลขประจำเครื่องจักร (Serial No.)", x?.serial], ["หมายเลขเครื่องยนต์ (ส่วนเครื่องจักร)", x?.engineNo],
  ];
  const asset = x?.asset ? x.asset + " - " + x.subAsset : "-";
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4" data-machine-card={x ? "" : "blank"}>
      <SectionLabel Title={name || "เครื่องมือกล"} SupportingText={"รหัสทรัพย์สิน " + asset}
        Actions={canEdit ? <TertiaryBrandButton Text="แก้ไข" aria-label={"แก้ไข " + (name || "เครื่องมือกล") + (x ? " " + x.subAsset : "")} className="-my-2" onClick={onEdit} data-machine-edit /> : undefined} />
      {fields.map((f) => <CardItemRow key={f[0]} items={[{ Type: "Text with label", LeadingIcon: false, Label: f[0], Text: f[1] || "-", TextAlign: "Right" }]} />)}
    </div>
  );
}
