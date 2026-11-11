"use client";
/* ส่วน "เครื่องมือกล" ของหน้ารายละเอียดยานพาหนะ แท็บข้อมูลยานพาหนะ (S24 · BACKLOG ข้อ 68 · เจ้าของงาน 11 พ.ย. 2569 · ทำเว็บก่อน Figma)
   Section label "เครื่องมือกล (n)" + Actions Secondary button "เพิ่มเครื่องมือกล" (ไอคอน add · เฉพาะผู้แก้ได้)
   → Table (desktop) / Mobile table: ประเภทเครื่องมือกล · ยี่ห้อ/รุ่น (บรรทัดรอง หมายเลข HC) · รหัสทรัพย์สิน · รหัสทรัพย์สินย่อย · พิกัดยก (กก.) · ชั่วโมงเครื่องยนต์ · ชั่วโมงเครน · ไอคอนแก้ไข
     ไม่มีเครื่อง = Empty state/Data empty "ยังไม่มีเครื่องมือกล"
   เพิ่ม/แก้ไข = PopupModal (Modal ของไลบรารี · มือถือ Bottom sheet · แบบ popup ของ S10 S26) ช่อง 2 คอลัมน์ (Grid · มือถือเรียงลง):
     ประเภทเครื่องมือกล (Input dropdown · บังคับ) · ยี่ห้อ · รุ่น · รหัสทรัพย์สิน 12 หลัก · รหัสทรัพย์สินย่อย 4 หลัก (บังคับ · คู่รหัสห้ามซ้ำทั้งระบบ)
     · พิกัดยก กก. (บังคับ ยกเว้นถังฉีดน้ำ/อื่นๆ) · ชั่วโมงเครื่องยนต์ · ชั่วโมงเครน (บังคับ จำนวนเต็ม ≥ 0 · Cumulative_working_hours NOT NULL)
     · หมายเลข HC · หมายเลขเครื่อง (Serial No.) (ถ้ามี)
     ตรวจตอนกดบันทึก: ช่องผิด = Text input State Error + Helper text · ผ่าน = toast "บันทึกเครื่องมือกลสำเร็จ"
   แก้ได้เฉพาะ กบค. (ผู้ดูแลข้อมูลยานพาหนะ ตามทะเบียนเครื่องมือกลเดิม · เสนอ — PERMISSIONS.md) · บทบาทอื่นดูอย่างเดียว */
import { useState } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { EmptyStateDataEmpty } from "@/components/vms/EmptyStateDataEmpty";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionLabel } from "@/components/vms/SectionLabel";
import type { TableColumn } from "@/components/vms/Table";
import { TextInput } from "@/components/vms/TextInput";
import type { Car } from "@/lib/mock/data";
import { LIFT_UNIT, MACHINE_TYPES, NO_LIFT, nf0, saveMachine, usedAssets, useMachines, type Machine } from "@/lib/mock/machines";
import { notify, useMock, useRole } from "@/lib/mock/store";
import { useProtoForm } from "@/lib/protoForm";
import { useBreakpoint } from "@/lib/useBreakpoint";
import { cx } from "@/lib/cx";
import { MaGrid, type MaValue } from "./ui";

export const MACHINE_EDIT_ROLES = ["กบค."] as const;
const COLS: TableColumn[] = [
  { head: "ประเภทเครื่องมือกล", width: 150, Style: "Lead text" }, { head: "ยี่ห้อ/รุ่น" }, { head: "รหัสทรัพย์สิน", width: 150 }, { head: "รหัสทรัพย์สินย่อย", width: 140 },
  { head: "พิกัดยก (" + LIFT_UNIT + ")", width: 120 }, { head: "ชั่วโมงเครื่องยนต์", width: 150 }, { head: "ชั่วโมงเครน", width: 130 }, { head: "", width: 64, Style: "Action icons" },
];

interface Draft { type: string; brand: string; model: string; asset: string; subAsset: string; lift: string; engineHours: string; craneHours: string; hc: string; serial: string }
const toDraft = (x?: Machine): Draft => ({
  type: x?.type ?? "", brand: x?.brand ?? "", model: x?.model ?? "", asset: x?.asset ?? "", subAsset: x?.subAsset ?? "",
  lift: x?.lift != null ? String(x.lift) : "", engineHours: x ? String(x.engineHours) : "", craneHours: x ? String(x.craneHours) : "", hc: x?.hc ?? "", serial: x?.serial ?? "",
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
  /* เปิดใหม่ = ค่าของเครื่องที่แก้ หรือค่าว่าง (เพิ่ม · รหัสทรัพย์สินตั้งต้น = ของเครื่องแรก · รหัสย่อยถัดไปที่ยังว่าง แบบทะเบียนเครื่องมือกลเดิม) */
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
    craneHours: !intOk(d.craneHours) ? "กรุณาระบุชั่วโมงเครนเป็นจำนวนเต็มตั้งแต่ 0" : undefined,
  };
  const bad = Object.values(err).some(Boolean);
  const save = () => {
    setTried(true);
    if (bad) return;
    saveMachine(carId, car, {
      key: edit?.key ?? "m" + Date.now(), type: d.type, brand: d.brand.trim(), model: d.model.trim(), asset: d.asset, subAsset: d.subAsset,
      lift: d.lift ? toInt(d.lift) : undefined, engineHours: toInt(d.engineHours), craneHours: toInt(d.craneHours), hc: d.hc.trim() || undefined, serial: d.serial.trim() || undefined,
    });
    notify("บันทึกเครื่องมือกลสำเร็จ");
    onClose();
  };
  /* ปุ่มต้นแบบ (CLAUDE.md ข้อ 17): กรอกข้อมูลตัวอย่าง = กระเช้า Aichi SK17A รหัสถัดไป พิกัด 200 ชั่วโมง 0 · ล้างค่า = ค่าเริ่มของ popup */
  useProtoForm(open ? {
    fill: () => setD((x) => ({ ...x, type: x.type || "กระเช้า", brand: x.brand || "Aichi", model: x.model || "SK17A", lift: x.lift || "200", engineHours: x.engineHours || "0", craneHours: x.craneHours || "0" })),
    clear: () => { setSeen(null); },
    dirty: edit ? JSON.stringify(d) !== JSON.stringify(toDraft(edit)) : !!(d.type || d.brand || d.model || d.lift || d.engineHours || d.craneHours || d.hc || d.serial),
  } : null);
  const f = (k: keyof Draft, label: string, o: { optional?: boolean; num?: boolean; ph?: string; max?: number } = {}) => (
    <TextInput LabelText={label} Optional={o.optional} Text={d[k]} Placeholder={o.ph ?? "ระบุ" + label.replace(/ \(.*\)$/, "")} inputMode={o.num ? "numeric" : undefined} maxLength={o.max}
      State={tried && err[k] ? "Error" : undefined} HelperText={tried ? err[k] : undefined} Size={mob ? "lg" : "md"}
      onChange={(v) => put(k)(o.num ? withSep(v) : o.max ? v.replace(/\D/g, "") : v)} />
  );
  return (
    <PopupModal open={open} title={edit ? "แก้ไขเครื่องมือกล" : "เพิ่มเครื่องมือกล"} sub={car.plate} width={800} ok="บันทึก" onOk={save} onCancel={onClose}>
      {/* มือถือ: Bottom sheet header ไม่มี Supporting text ⇒ ทะเบียนเป็นบรรทัดแรกของเนื้อหา (แบบ popup ผลการตรวจ ปจ.2) */}
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
        {f("craneHours", "ชั่วโมงเครน", { num: true, ph: "ชั่วโมง" })}
        {f("hc", "หมายเลข HC", { optional: true, ph: "เช่น HC - 9001" })}
        {f("serial", "หมายเลขเครื่อง (Serial No.)", { optional: true, ph: "ระบุหมายเลขเครื่อง" })}
      </div>
    </PopupModal>
  );
}

export function MachineSection({ carId, car }: { carId: string; car: Car }) {
  const role = useRole();
  const mob = useBreakpoint() === "Mobile";
  const list = useMachines(carId, car);
  const canEdit = (MACHINE_EDIT_ROLES as readonly string[]).includes(role);
  const [edit, setEdit] = useState<Machine | null>(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const openEdit = (x: Machine | null) => { setEdit(x); setOpen(true); };
  const rows: MaValue[][] = list.map((x) => {
    const a = canEdit ? [{ IconSwap: "edit-24-300-round", label: "แก้ไข " + x.type + " " + x.subAsset, onClick: () => openEdit(x) }] : [];
    return [x.type, { text: [x.brand, x.model].filter(Boolean).join(" ") || "-", sub: [x.hc, x.serial ? "S/N " + x.serial : ""].filter(Boolean).join(" · ") || undefined },
      x.asset, x.subAsset, nf0(x.lift), nf0(x.engineHours), nf0(x.craneHours), { actions: a, mobileActions: a }];
  });
  const add = canEdit ? <SecondaryButton Text="เพิ่มเครื่องมือกล" LeadingIconSwap="add-24-300-round" Size={mob ? "lg" : "md"} onClick={() => openEdit(null)} /> : undefined;
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel Title={"เครื่องมือกล (" + list.length + ")"} Actions={add} />
      {rows.length ? <MaGrid cols={COLS} rows={rows} page={page} onPage={setPage} />
        : <EmptyStateDataEmpty Text="ยังไม่มีเครื่องมือกล" SupportingText={canEdit ? "กดเพิ่มเครื่องมือกลเพื่อบันทึกยี่ห้อ รุ่น รหัสทรัพย์สิน และพิกัดยก" : undefined} />}
      {canEdit && <MachineModal open={open} carId={carId} car={car} edit={edit} list={list} onClose={() => setOpen(false)} />}
    </section>
  );
}
