"use client";
import { Checkbox } from "@/components/vms/Checkbox";
import { CheckboxTextCard } from "@/components/vms/CheckboxTextCard";
import { InputLabel } from "@/components/vms/InputLabel";
import { RadioButton } from "@/components/vms/RadioButton";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TextArea } from "@/components/vms/TextArea";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { ChecklistCard, TH, td } from "./_checklist";

export interface ReceiptItem {
  name: string;
  has?: boolean | null;
  damaged?: boolean;
  wrongModel?: boolean;
  note?: string;
  battery?: { brand: string; qty: string; unit?: string };
}

export interface ReceiptChecklistProps {
  Title?: string;
  Badge?: string | number | null;
  items: ReceiptItem[];
  onChange?: (i: number, patch: Partial<ReceiptItem>) => void;
  onAdd?: () => void;
  readonly?: boolean;
  Breakpoint?: Breakpoint;
  className?: string;
}

export function ReceiptChecklist({ Title = "รายการเอกสารรับยานพาหนะ", Badge, items, onChange, onAdd, readonly, Breakpoint: bp, className }: ReceiptChecklistProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  const set = (i: number, p: Partial<ReceiptItem>) => !readonly && onChange?.(i, p);
  const head = <SectionHeader Title={Title} Badge={Badge ?? items.length} Breakpoint={bp} />;
  const add = !readonly && <SecondaryButton Text="เพิ่มรายการ" Size="lg" LeadingIconSwap="add-24-300-round" onClick={onAdd} className={mob ? "w-full" : undefined} />;
  const battery = (it: ReceiptItem, i: number) => it.battery && (
    <span className="flex items-center gap-2">
      <TextInput Label={false} Text={it.battery.brand} Placeholder="ยี่ห้อ" readOnly={readonly} onChange={(v) => set(i, { battery: { ...it.battery!, brand: v } })} className="w-[149px]" aria-label={it.name + " ยี่ห้อ"} />
      <TextInput Label={false} Text={it.battery.qty} Placeholder="จำนวน" readOnly={readonly} onChange={(v) => set(i, { battery: { ...it.battery!, qty: v } })} className="w-[98px]" aria-label={it.name + " จำนวน"} />
      <span className="text-md text-black">{it.battery.unit ?? "ลูก"}</span>
    </span>
  );
  if (mob) {
    return (
      <section className={cx("flex flex-col gap-4", className)}>
        {head}
        {items.map((it, i) => (
          <ChecklistCard key={i}>
            <SectionLabel Title={it.name} className="min-h-10" />
            {battery(it, i)}
            <div className="flex gap-4 [&>*]:flex-1 [&>*]:basis-0">
              <RadioTextCard compact Text="มี" Selected={it.has === true} onClick={() => set(i, { has: true })} />
              <RadioTextCard compact Text="ไม่มี" Selected={it.has === false} onClick={() => set(i, { has: false, damaged: false, wrongModel: false })} />
            </div>
            {it.has === true && (
              <div className="flex flex-col gap-2">
                <InputLabel LabelText="สภาพ" Optional />
                <div className="flex gap-4 [&>*]:flex-1 [&>*]:basis-0">
                  <CheckboxTextCard Text="ชำรุด" Selected={!!it.damaged} onChange={(v) => set(i, { damaged: v })} />
                  <CheckboxTextCard Text="ผิดรุ่น" Selected={!!it.wrongModel} onChange={(v) => set(i, { wrongModel: v })} />
                </div>
              </div>
            )}
            <TextArea LabelText="หมายเหตุ" Optional Text={it.note} Placeholder="ระบุหมายเหตุ" readOnly={readonly} onChange={(v) => set(i, { note: v })} />
          </ChecklistCard>
        ))}
        {add}
      </section>
    );
  }
  return (
    <section className={cx("flex flex-col gap-4", className)}>
      {head}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1296px] border-separate border-spacing-0">
          <colgroup><col /><col className="w-25" /><col className="w-25" /><col className="w-25" /><col className="w-25" /><col className="w-[450px]" /></colgroup>
          <thead>
            <tr className="h-[74px]">
              <th scope="col" className={cx(TH, "rounded-tl-lg")}>รายการ</th>
              {["มี", "ไม่มี", "ชำรุด", "ผิดรุ่น", "หมายเหตุ"].map((h) => <th key={h} scope="col" className={TH}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className={td(i)}><span className="flex items-center gap-2 text-md text-black"><span className={it.battery ? "w-[88px] shrink-0" : undefined}>{it.name}</span>{battery(it, i)}</span></td>
                <td className={td(i)}><RadioButton Selected={it.has === true} label={it.name + " มี"} State={readonly ? "Disabled" : "Default"} onChange={() => set(i, { has: true })} /></td>
                <td className={td(i)}><RadioButton Selected={it.has === false} label={it.name + " ไม่มี"} State={readonly ? "Disabled" : "Default"} onChange={() => set(i, { has: false, damaged: false, wrongModel: false })} /></td>
                <td className={td(i)}><Checkbox Type={it.damaged ? "Selected" : "Unselected"} State={readonly || it.has !== true ? "Disabled" : "Default"} label={it.name + " ชำรุด"} onChange={(v) => set(i, { damaged: v })} /></td>
                <td className={td(i)}><Checkbox Type={it.wrongModel ? "Selected" : "Unselected"} State={readonly || it.has !== true ? "Disabled" : "Default"} label={it.name + " ผิดรุ่น"} onChange={(v) => set(i, { wrongModel: v })} /></td>
                <td className={td(i)}><TextInput Label={false} Text={it.note} Placeholder="ระบุหมายเหตุ" readOnly={readonly} onChange={(v) => set(i, { note: v })} aria-label={it.name + " หมายเหตุ"} /></td>
              </tr>
            ))}
            {add && <tr><td className="h-14 bg-white px-4 py-2" colSpan={6}>{add}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
