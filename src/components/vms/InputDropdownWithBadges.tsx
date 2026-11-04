"use client";
/* Figma: "Input dropdown with badges" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Input dropdown with badges.json
   เลือกได้หลายค่า ค่าที่เลือกเป็นชิป Badge outline with remove icon (Color=Gray) ในช่อง
   variant: State = Default | Selected | Hover | Focused | Disabled | Error | Error Hover | Error Focused · Size = md
   property: Label · Label text · Optional · Info icon · Text · Leading icon (swap) · Helper · Helper text
   ค่า: ช่องเหมือน Input dropdown (40 · ขอบใน 8/12 · รัศมี 8) · ชิปห่าง 8 · Selected แสดง 4 ชิป · Focused 2 ชิป + ช่องพิมพ์ (Text)
        ค่าเกินจำนวนชิป → ชิปสุดท้ายเป็น "+n" (ตาม multiDropdown ใน core.js) */
import { useCallback, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useOutside } from "@/lib/useOutside";
import { BadgeOutlineWithRemoveIcon } from "./BadgeOutlineWithRemoveIcon";
import { InputLabel } from "./InputLabel";
import { Ms } from "./Ms";
import { containerTone } from "./TextInput";

export type InputDropdownWithBadgesState = "Default" | "Selected" | "Hover" | "Focused" | "Disabled" | "Error" | "Error Hover" | "Error Focused";

export interface InputDropdownWithBadgesProps {
  State?: InputDropdownWithBadgesState;
  Label?: boolean;
  LabelText?: string;
  Optional?: boolean;
  InfoIcon?: boolean;
  /** ค่าที่เลือก = ชิป */
  values: string[];
  /** ข้อความเมื่อยังไม่เลือก (property Text ตอนว่าง) */
  Placeholder?: string;
  LeadingIconSwap?: string;
  HelperText?: string;
  onRemove?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export function InputDropdownWithBadges({ State, Label = true, LabelText, Optional, InfoIcon, values, Placeholder = "เลือก", LeadingIconSwap, HelperText, onRemove, open, onOpenChange, children, className }: InputDropdownWithBadgesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onOpenChange?.(false), [onOpenChange]);
  useOutside(ref, !!open, close);
  const st: InputDropdownWithBadgesState = State ?? (open ? "Focused" : values.length ? "Selected" : "Default");
  const off = st === "Disabled";
  const err = st.startsWith("Error");
  const slots = open || st.endsWith("Focused") ? 2 : 4;
  const shown = values.length > slots ? values.slice(0, slots - 1) : values;
  const more = values.length - shown.length;
  return (
    <div ref={ref} className={cx("relative flex min-w-0 flex-col gap-2", className)}>
      {Label && LabelText && <InputLabel LabelText={LabelText} Optional={Optional} InfoIcon={InfoIcon} />}
      <div
        role="button"
        tabIndex={off ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={!!open}
        aria-label={LabelText}
        aria-disabled={off}
        onClick={() => !off && onOpenChange?.(!open)}
        onKeyDown={(e) => { if (!off && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onOpenChange?.(!open); } }}
        className={cx("flex h-10 w-full items-center gap-2 overflow-hidden rounded-md border px-3 py-2 text-md", containerTone(err && open ? "Error Focused" : open ? "Focused" : st), off ? "cursor-not-allowed" : "cursor-pointer")}
      >
        {LeadingIconSwap && <Ms name={LeadingIconSwap} size={24} className="text-gray-500" />}
        <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
          {values.length === 0 && <span className="truncate text-gray-400">{Placeholder}</span>}
          {shown.map((v) => <BadgeOutlineWithRemoveIcon key={v} Text={v} Color={off ? "Disabled" : "Gray"} onRemove={onRemove && !off ? () => onRemove(v) : undefined} className="min-w-0" />)}
          {more > 0 && <BadgeOutlineWithRemoveIcon Text={"+" + more} Color="Gray" />}
        </span>
        <Ms name={open ? "keyboard_arrow_up-20-400-round" : "keyboard_arrow_down-20-400-round"} size={20} className={off ? "text-gray-400" : "text-gray-500"} />
      </div>
      {HelperText && <p className={cx("text-xs", err ? "text-error-600" : "text-gray-600")}>{HelperText}</p>}
      {open && children && <div className={cx("absolute right-0 left-0 z-30", HelperText ? "top-[calc(100%-22px)]" : "top-[calc(100%+4px)]")}>{children}</div>}
    </div>
  );
}
