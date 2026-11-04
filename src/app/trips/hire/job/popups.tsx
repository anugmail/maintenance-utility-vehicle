"use client";
/* popup ของหน้างานรายคัน (แผนจ้าง) — ตาม screens.js: partEditModal · partAddModal · cannotModal (popupModal 640/800 · มือถือ Bottom sheet)
   แก้ไขอะไหล่ = รายการงาน (Readonly) + จำนวนตามแผน (Readonly) · จำนวนที่ใช้จริง (Text input) · จำนวนที่คืน (Readonly คำนวณ = ตามแผน − ใช้จริง)
   เพิ่มอะไหล่ที่ใช้จริง = ชื่ออะไหล่ · รหัสอะไหล่ (ถ้ามี) · จำนวนที่ใช้จริง + หน่วย (Input dropdown) — ไม่มีข้อความ error ในสเปก ⇒ ปุ่ม "เพิ่ม" กดได้เมื่อกรอกครบ
   บำรุงรักษาไม่ได้ = Text area สาเหตุ (error "กรุณาระบุสาเหตุที่บำรุงรักษาไม่ได้") + Section header "อะไหล่ส่งคืน" + Table RET_COLS
   อ้างอิง: Text input · Input dropdown · Text area · Section header · Table ของไฟล์ Component + popupModal ของจอ S10/S23 (UI Release#2 ผ่าน screens.js) */
import { useState, type ReactNode } from "react";
import { PopupModal } from "@/components/patterns/PopupModal";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { MobileCards } from "@/components/vms/MobileTable";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { Table, type TableColumn } from "@/components/vms/Table";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { retCells, type WorkItem } from "@/lib/mock/hire";
import { useBreakpoint } from "@/lib/useBreakpoint";

/* RET_COLS */
export const RET_COLS: TableColumn[] = [{ head: "ชื่ออะไหล่", Style: "Lead text" }, { head: "จำนวนตามแผน", width: 170 }, { head: "จำนวนที่ใช้", width: 170 }, { head: "จำนวนที่คืน", width: 170 }];
/* หน่วยของอะไหล่ในข้อมูลตัวอย่าง (PARTS: ลิตร · ชิ้น) */
const UNITS = ["ชิ้น", "ลิตร"];

/* row() ของ core.js: desktop แถวเดียว ช่องไฟ 24 กว้างเท่ากัน · มือถือ เรียงลง ช่องไฟ 16 */
export function Row({ children }: { children: ReactNode }) {
  const mob = useBreakpoint() === "Mobile";
  return <div className={cx("flex", mob ? "flex-col gap-4" : "gap-6 [&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0")}>{children}</div>;
}

const qtyOk = (s: string, max?: number) => /^\d+$/.test(s.trim()) && (max == null || +s <= max);

export function PartEditModal({ item, onSave, onCancel }: { item: WorkItem | null; onSave: (used: number) => void; onCancel: () => void }) {
  const [v, setV] = useState<string | null>(null);
  if (!item) return null;
  const val = v ?? String(item.usedQty);
  const max = item.planQty > 0 ? item.planQty : undefined;
  const ok = qtyOk(val, max);
  const ret = ok ? Math.max(0, item.planQty - +val) : Math.max(0, item.planQty - item.usedQty);
  const close = () => { setV(null); onCancel(); };
  return (
    <PopupModal open title={"แก้ไขอะไหล่ · " + item.part} ok="บันทึก" okDisabled={!ok} onCancel={close} onOk={() => { onSave(+val); setV(null); }}>
      <TextInput LabelText="รายการงาน" Text={item.task} State="Readonly" readOnly />
      <Row>
        <TextInput LabelText="จำนวนตามแผน" Text={item.planQty + " " + item.unit} State="Readonly" readOnly />
        <TextInput LabelText={"จำนวนที่ใช้จริง (" + item.unit + ")"} Text={val} inputMode="numeric" onChange={setV} />
        <TextInput LabelText="จำนวนที่คืน" Text={ret + " " + item.unit} State="Readonly" readOnly />
      </Row>
    </PopupModal>
  );
}

export interface NewPart { name: string; code: string; qty: string; unit: string }
const EMPTY: NewPart = { name: "", code: "", qty: "", unit: "" };
export function PartAddModal({ open, onAdd, onCancel }: { open: boolean; onAdd: (p: NewPart) => void; onCancel: () => void }) {
  const [p, setP] = useState<NewPart>(EMPTY);
  const [unitOpen, setUnitOpen] = useState(false);
  if (!open) return null;
  const ok = !!p.name.trim() && qtyOk(p.qty) && +p.qty > 0 && !!p.unit;
  const close = () => { setP(EMPTY); onCancel(); };
  return (
    <PopupModal open title="เพิ่มอะไหล่ที่ใช้จริง" ok="เพิ่ม" okDisabled={!ok} onCancel={close} onOk={() => { onAdd(p); setP(EMPTY); }}>
      <TextInput LabelText="ชื่ออะไหล่" Text={p.name} Placeholder="ระบุชื่ออะไหล่" onChange={(name) => setP({ ...p, name })} />
      <TextInput LabelText="รหัสอะไหล่" Optional Text={p.code} Placeholder="ระบุรหัสอะไหล่" onChange={(code) => setP({ ...p, code })} />
      <Row>
        <TextInput LabelText="จำนวนที่ใช้จริง" Text={p.qty} Placeholder="0" inputMode="numeric" onChange={(qty) => setP({ ...p, qty })} />
        <InputDropdown LabelText="หน่วย" Text={p.unit} Placeholder="เลือกหน่วย" open={unitOpen} onOpenChange={setUnitOpen}>
          <DropdownList>
            {UNITS.map((u) => <DropdownListItem key={u} Text={u} State={u === p.unit ? "Selected" : "Default"} onClick={() => { setP({ ...p, unit: u }); setUnitOpen(false); }} />)}
          </DropdownList>
        </InputDropdown>
      </Row>
    </PopupModal>
  );
}

/** popup บำรุงรักษาไม่ได้ (cannotModal) — rows = อะไหล่ส่งคืน (ใช้ = จำนวนที่ใช้ไปแล้ว) */
export function CannotModal({ open, plate, rows, reason: init, onOk, onCancel }: { open: boolean; plate: string; rows: WorkItem[]; reason?: string; onOk: (reason: string) => void; onCancel: () => void }) {
  const mob = useBreakpoint() === "Mobile";
  const [reason, setReason] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  if (!open) return null;
  const r = reason ?? init ?? "";
  const close = () => { setReason(null); setErr(false); onCancel(); };
  const data = rows.map(retCells);
  return (
    <PopupModal open width={800} title={"บำรุงรักษาไม่ได้ · " + plate} ok="ยืนยัน" onCancel={close}
      onOk={() => { if (!r.trim()) { setErr(true); return; } onOk(r.trim()); setReason(null); setErr(false); }}>
      <TextArea LabelText="สาเหตุที่บำรุงรักษาไม่ได้" Text={r} Placeholder="ระบุสาเหตุที่บำรุงรักษาไม่ได้" onChange={(v) => { setReason(v); if (v.trim()) setErr(false); }}
        State={err ? "Error" : undefined} HelperText={err ? "กรุณาระบุสาเหตุที่บำรุงรักษาไม่ได้" : undefined} />
      <section className="flex flex-col gap-4">
        <SectionHeader Title="อะไหล่ส่งคืน" Badge={data.length} />
        {mob ? <MobileCards columns={RET_COLS} rows={data} /> : <Table columns={RET_COLS} rows={data} />}
      </section>
    </PopupModal>
  );
}
