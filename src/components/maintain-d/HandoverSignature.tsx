"use client";
import { useState } from "react";
import { DropdownList } from "@/components/vms/DropdownList";
import { DropdownListItem } from "@/components/vms/DropdownListItem";
import { InputDropdown } from "@/components/vms/InputDropdown";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export interface SignerSlot {
  LabelText: string;
  Placeholder: string;
  options: string[];
  value?: string | null;
  signed?: boolean;
  HelperText?: string;
}

export function HandoverSignature({ Title = "ลงนามการรับมอบยานพาหนะ", slots, onPick, onSign, Breakpoint: bp, className }: {
  Title?: string; slots: SignerSlot[]; onPick?: (i: number, name: string) => void; onSign?: (i: number) => void; Breakpoint?: Breakpoint; className?: string;
}) {
  const mob = useBreakpoint(bp) === "Mobile";
  const [open, setOpen] = useState(-1);
  return (
    <section className={cx("flex flex-col gap-4", className)}>
      <SectionHeader Title={Title} Breakpoint={bp} />
      <div className={cx("flex gap-4", mob ? "flex-col" : "[&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0")}>
        {slots.map((s, i) => (
          <div key={s.LabelText} className="flex flex-col justify-center gap-4">
            <InputDropdown LabelText={s.LabelText} Placeholder={s.Placeholder} Text={s.value ?? undefined} open={open === i} onOpenChange={(o) => setOpen(o ? i : -1)}
              State={s.HelperText ? (open === i ? "Error Focused" : "Error") : undefined} HelperText={s.HelperText}>
              <DropdownList>{s.options.map((o) => <DropdownListItem key={o} Text={o} State={o === s.value ? "Selected" : "Default"} onClick={() => { onPick?.(i, o); setOpen(-1); }} />)}</DropdownList>
            </InputDropdown>
            {s.signed ? (
              <div className="flex items-center gap-4">
                <SecondaryButton Text="แก้ไขลงนาม" onClick={() => onSign?.(i)} />
                <span className="inline-flex items-center rounded-pill border border-success-200 bg-success-50 px-2.5 py-0.5 text-sm font-medium text-success-700">เซ็นลงนามแล้ว</span>
              </div>
            ) : (
              <div className="flex"><SecondaryButton Text="เซ็นลงนาม" State={s.value ? "Default" : "Disabled"} onClick={() => onSign?.(i)} /></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
