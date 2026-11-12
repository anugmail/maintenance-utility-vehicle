"use client";
/* ส่วน "เครื่องมือกล" ของหน้ารายละเอียดยานพาหนะ แท็บข้อมูลยานพาหนะ (S24 · BACKLOG ข้อ 68 · เจ้าของงาน 11 พ.ย. 2569 · ทำเว็บก่อน Figma)
   Section label "เครื่องมือกล (n)" + Actions Secondary button "เพิ่มเครื่องมือกล" (ไอคอน add · เฉพาะผู้แก้ได้)
   → การ์ด 1 ใบต่อเครื่อง (ข้อ 84 · 12 พ.ย. 2569 แทนตาราง Table/Mobile table เดิม · ดู MachineBody) · วางต่อจากข้อมูลการจดทะเบียน (ข้อ 83 · VehicleInfo.tsx)
   เพิ่ม/แก้ไข = PopupModal (Modal ของไลบรารี · มือถือ Bottom sheet · แบบ popup ของ S10 S26) ช่อง 2 คอลัมน์ (Grid · มือถือเรียงลง):
     ประเภทเครื่องมือกล (Input dropdown · บังคับ) · ยี่ห้อ · รุ่น · รหัสทรัพย์สิน 12 หลัก · รหัสทรัพย์สินย่อย 4 หลัก (บังคับ · คู่รหัสห้ามซ้ำทั้งระบบ)
     · พิกัดยก กก. (บังคับ ยกเว้นถังฉีดน้ำ/อื่นๆ) · ชั่วโมงเครื่องยนต์ · ชั่วโมงเครื่องจักร (บังคับ จำนวนเต็ม ≥ 0 · Cumulative_working_hours NOT NULL)
     · หมายเลข HC · หมายเลขประจำเครื่องจักร (Serial No.) · หมายเลขเครื่องยนต์ (ส่วนเครื่องจักร) (ถ้ามี)
     12 พ.ย. 2569 ข้อ 72 (เจ้าของงาน 12 พ.ย. 2569 เลือกตามไฟล์สรุปประชุม VMS Plus (Notion "meeting 11/11/68" หัวข้อ 9)): เพิ่มหมายเลขเครื่องยนต์ (ส่วนเครื่องจักร) ไม่บังคับ ต่อจาก Serial No. · ป้าย "หมายเลขเครื่อง (Serial No.)" → "หมายเลขประจำเครื่องจักร (Serial No.)"
     12 พ.ย. 2569 ข้อ 73 (เจ้าของงาน 12 พ.ย. 2569 "ใช้เป็น ชั่วโมงเครื่องจักร"): ป้าย "ชั่วโมงเครน" → "ชั่วโมงเครื่องจักร" ทั้งหัวคอลัมน์ ช่องใน popup และข้อความ error · ชื่อช่องข้อมูลคง craneHours (ไม่เปลี่ยนรูปแบบข้อมูลที่เก็บ)
     ค่าที่แมปจากฐานข้อมูลได้ขึ้นเป็นค่าตั้งต้นและแก้ได้ (เจ้าของงาน "ถ้าแมปข้อมูลจากฐานข้อมูลได้ ก็เอามาแสดง แต่สามารถแก้ไขได้") · (ตารางเดิมวางหมายเลขเครื่องยนต์ในบรรทัดรอง · การ์ดข้อ 84 มีแถวของตัวเอง)
     ตรวจตอนกดบันทึก: ช่องผิด = Text input State Error + Helper text · ผ่าน = toast "บันทึกเครื่องมือกลสำเร็จ"
   แก้ได้เฉพาะ กบค. (ผู้ดูแลข้อมูลยานพาหนะ ตามทะเบียนเครื่องมือกลเดิม · เสนอ — PERMISSIONS.md) · บทบาทอื่นดูอย่างเดียว */
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
  /* ปุ่มต้นแบบ (CLAUDE.md ข้อ 17): กรอกข้อมูลตัวอย่าง = กระเช้า Aichi SK17A รหัสถัดไป พิกัด 200 ชั่วโมง 0 · ล้างค่า = ค่าเริ่มของ popup */
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
        {f("craneHours", "ชั่วโมงเครื่องจักร", { num: true, ph: "ชั่วโมง" })}
        {f("hc", "หมายเลข HC", { optional: true, ph: "เช่น HC - 9001" })}
        {f("serial", "หมายเลขประจำเครื่องจักร (Serial No.)", { optional: true, ph: "ระบุหมายเลขประจำเครื่องจักร" })}
        {f("engineNo", "หมายเลขเครื่องยนต์ (ส่วนเครื่องจักร)", { optional: true, ph: "ระบุหมายเลขเครื่องยนต์ของเครื่องจักร" })}
      </div>
    </PopupModal>
  );
}

/** ข้อ 68ก: รหัสข้างรถนอกกลุ่ม (ตารางอ้างอิง REF_VEHICLE_TYPE hasEquipment = false) ⇒ ไม่แสดงส่วนนี้ */
export function MachineSection({ carId, car }: { carId: string; car: Car }) {
  return hasEquipment(sideCodeOf(car)) ? <MachineBody carId={carId} car={car} /> : null;
}

/* ข้อ 84 (เจ้าของงาน 12 พ.ย. 2569 _"ส่วน section ของการเพิ่มเครื่องจักร อยากให้เป็น คล้ายๆ การ์ด ในcomponent 1 การ์ด แล้วข้อมูลข้างใน ถ้ามีข้อมูลจาก api ก็แสดง
   ถ้าไม่มี ก็ให้เป็นข้อมูลที่สามารถเพิ่มได้ และที่ แสดง ก็สามารถแก้ไขได้"_) — ตาราง → การ์ด 1 ใบต่อเครื่อง
   การ์ดตามการ์ด "การใช้งานล่าสุด" (Last usage) ของเฟรม Vehicle info หน้า 5.2 Vehicle Management · UI Release#2:
     กรอบ white ขอบ gray-200 รัศมี 16 ขอบใน 16 ช่องไฟ 16 · หัวการ์ด = Section label (ชื่อ ประเภท ยี่ห้อ รุ่น · Supporting text รหัสทรัพย์สิน · Primary action Tertiary brand button "แก้ไข")
     แถว = Card item row Type=1 Row · Card item base Type=Text with label (Leading icon ปิด · Text ชิดขวาแบบ Last usage) ช่องละแถว 11 ช่องตาม popup
   ช่องที่มีค่า (ค่าจาก vms_mas_vehicle_mechanic = ค่าตั้งต้นของ machines.ts) แสดงค่า · ช่องว่าง: กบค. = Tertiary brand button "เพิ่ม" (ไอคอน add) เปิด popup แก้ไขของเครื่องนั้น · บทบาทอื่น "-"
     พิกัดยกของถังฉีดน้ำ/อื่นๆ (ไม่มีพิกัดยก) = "-" ไม่มีปุ่มเพิ่ม
   ยังไม่มีเครื่อง = การ์ดว่างแบบ Fleet card Status=Empty ("ไม่มีบัตรเติมน้ำมัน" · "ยานพาหนะคันนี้ยังไม่มีบัตรเติมน้ำมัน" · Secondary button lg "เพิ่มบัตร"):
     กล่อง gray-50 รัศมี 8 ขอบใน 12/16 · "ไม่มีเครื่องมือกล" 16 SemiBold · "ยานพาหนะคันนี้ยังไม่มีข้อมูลเครื่องมือกล" 14 gray-600 · ปุ่ม "เพิ่มเครื่องมือกล" (กบค.)
   มีเครื่องแล้ว: ปุ่ม "เพิ่มเครื่องมือกล" ที่ Section label ของส่วน (เครื่องที่ 2 ขึ้นไป · แบบเดิม) · popup เพิ่ม/แก้ไข (MachineModal) เดิมทุกอย่าง
   ประกอบจากชิ้นไลบรารี — COMPOSED.md ศ5. */
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
      <SectionLabel Title={"เครื่องมือกล (" + list.length + ")"} Actions={add} className="min-h-10" />
      {list.length ? list.map((x) => <MachineCard key={x.key} x={x} canEdit={canEdit} onEdit={() => openEdit(x)} />) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4" data-machine-empty>
          <div className={cx("flex gap-3 rounded-md bg-gray-50 px-4 py-3", mob ? "flex-col" : "items-center")}>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="text-md font-semibold text-black">ไม่มีเครื่องมือกล</p>
              <p className="text-sm text-gray-600">ยานพาหนะคันนี้ยังไม่มีข้อมูลเครื่องมือกล</p>
            </div>
            {canEdit && <SecondaryButton Text="เพิ่มเครื่องมือกล" LeadingIconSwap="add-24-400-round" Size="lg" onClick={() => openEdit(null)} />}
          </div>
        </div>
      )}
      {canEdit && <MachineModal open={open} carId={carId} car={car} edit={edit} list={list} onClose={() => setOpen(false)} />}
    </section>
  );
}

function MachineCard({ x, canEdit, onEdit }: { x: Machine; canEdit: boolean; onEdit: () => void }) {
  const noLift = NO_LIFT.includes(x.type);
  const name = [x.type, x.brand, x.model].filter(Boolean).join(" ");
  /* [ป้าย, ค่า (ว่าง = ไม่มีข้อมูล), ไม่เกี่ยว (แสดง "-" ไม่มีปุ่มเพิ่ม)] — ลำดับเดียวกับ popup */
  const fields: [string, string | undefined, boolean?][] = [
    ["ประเภทเครื่องมือกล", x.type], ["ยี่ห้อ", x.brand], ["รุ่น", x.model],
    ["พิกัดยก (" + LIFT_UNIT + ")", x.lift != null ? nf0(x.lift) : undefined, noLift],
    ["รหัสทรัพย์สิน", x.asset], ["รหัสทรัพย์สินย่อย", x.subAsset],
    ["ชั่วโมงเครื่องยนต์", nf0(x.engineHours)], ["ชั่วโมงเครื่องจักร", nf0(x.craneHours)],
    ["หมายเลข HC", x.hc], ["หมายเลขประจำเครื่องจักร (Serial No.)", x.serial], ["หมายเลขเครื่องยนต์ (ส่วนเครื่องจักร)", x.engineNo],
  ];
  const value = ([label, v, na]: (typeof fields)[number]) => (v ? v : na || !canEdit ? "-"
    : <TertiaryBrandButton Text="เพิ่ม" LeadingIconSwap="add-24-300-round" aria-label={"เพิ่ม" + label + " " + name} className="-my-2 -mr-2" onClick={onEdit} data-machine-add />);
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4" data-machine-card>
      <SectionLabel Title={name || "เครื่องมือกล"} SupportingText={"รหัสทรัพย์สิน " + x.asset + " - " + x.subAsset}
        Actions={canEdit ? <TertiaryBrandButton Text="แก้ไข" aria-label={"แก้ไข " + name + " " + x.subAsset} className="-my-2" onClick={onEdit} data-machine-edit /> : undefined} />
      {fields.map((f) => <CardItemRow key={f[0]} items={[{ Type: "Text with label", LeadingIcon: false, Label: f[0], Text: value(f), TextAlign: "Right" }]} />)}
    </div>
  );
}
