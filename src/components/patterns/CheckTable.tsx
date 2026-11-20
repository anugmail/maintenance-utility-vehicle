"use client";
import { ChecklistCard, TH, td } from "@/components/maintain-d/_checklist";
import { RadioButton } from "@/components/vms/RadioButton";
import { RadioTextCard } from "@/components/vms/RadioTextCard";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { SectionLabel } from "@/components/vms/SectionLabel";
import { TextInput } from "@/components/vms/TextInput";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export interface CheckRow {
  name: string;
  sel: number | null;
  note: string;
}

export interface CheckTableProps {
  Title: string;
  Badge?: string | number | null;
  options: string[];
  items: CheckRow[];
  onChange?: (i: number, patch: Partial<CheckRow>) => void;
  onAdd?: () => void;
  readonly?: boolean;
  Breakpoint?: Breakpoint;
  className?: string;
}

const label = (it: CheckRow, i: number) => i + 1 + ". " + it.name;

export function CheckTable({ Title, Badge, options, items, onChange, onAdd, readonly, Breakpoint: bp, className }: CheckTableProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  const set = (i: number, p: Partial<CheckRow>) => !readonly && onChange?.(i, p);
  const head = <SectionHeader Title={Title} Badge={Badge ?? items.length} Breakpoint={bp} />;
  const add = !readonly && <SecondaryButton Text="เพิ่มรายการ" Size={mob ? "lg" : "md"} LeadingIconSwap="add-24-300-round" onClick={onAdd} className={mob ? "w-full" : undefined} />;
  if (mob) {
    return (
      <section className={cx("flex flex-col gap-4", className)}>
        {head}
        {items.map((it, i) => (
          <ChecklistCard key={i}>
            <SectionLabel Title={label(it, i)} className="min-h-10" />
            <div className="flex gap-4 [&>*]:flex-1 [&>*]:basis-0">
              {options.map((o, k) => <RadioTextCard key={o} compact Text={o} Selected={it.sel === k} State={readonly ? "Disabled" : "Default"} onClick={() => set(i, { sel: k })} />)}
            </div>
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
          <colgroup><col />{options.map((o) => <col key={o} className="w-25" />)}<col className="w-[448px]" /></colgroup>
          <thead>
            <tr>
              <th scope="col" className={cx(TH, "rounded-tl-lg")}>รายการ</th>
              {options.map((o) => <th key={o} scope="col" className={TH}>{o}</th>)}
              <th scope="col" className={TH}>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className={td(i, "text-md text-black")}>{label(it, i)}</td>
                {options.map((o, k) => (
                  <td key={o} className={td(i)}><RadioButton Selected={it.sel === k} label={label(it, i) + " " + o} State={readonly ? "Disabled" : "Default"} onChange={() => set(i, { sel: k })} /></td>
                ))}
                <td className={td(i)}><TextInput Label={false} Text={it.note} Placeholder="ระบุหมายเหตุ" readOnly={readonly} onChange={(v) => set(i, { note: v })} aria-label={label(it, i) + " หมายเหตุ"} /></td>
              </tr>
            ))}
            {add && <tr><td className={td(items.length)} colSpan={options.length + 2}>{add}</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
