"use client";
/* Figma: "Input dropdown" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Input dropdown.json
   variant: State = Default | Selected | Hover | Focused | Disabled | Error | Error Hover | Error Focused · Size = md | lg
   property: Label · Label text · Optional · Info icon · Text · Placeholder · Leading icon (swap) · Supporting · Supporting text · Helper · Helper text
   ค่า: เหมือน Text input (ป้าย → ช่อง 8 · ช่อง 40/48 · ขอบใน 8/12 · รัศมี 8) · ลูกศร keyboard_arrow_down 20 gray-500 (Focused = keyboard_arrow_up)
        Selected/Focused ค่า 16 black · Default placeholder gray-400 · Supporting text 16 gray-600 ต่อท้ายค่า
   property Cursor = ช่องพิมพ์ค้นได้ (ส่ง onQuery) — ใช้กับช่อง "เลือกรถ" แบบ carPick() ใน screens.js (Text = คำค้น · Leading icon search)
   รายการที่เปิด (Dropdown list) ส่งเป็น children — วางใต้ช่อง ห่าง 4 กว้างเท่าช่อง (ตาม comboAt ใน core.js) */
import { useCallback, useRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useOutside } from "@/lib/useOutside";
import { InputLabel } from "./InputLabel";
import { Ms } from "./Ms";
import { containerTone } from "./TextInput";

export type InputDropdownState = "Default" | "Selected" | "Hover" | "Focused" | "Disabled" | "Error" | "Error Hover" | "Error Focused";

export interface InputDropdownProps {
  State?: InputDropdownState;
  Size?: "md" | "lg";
  Label?: boolean;
  LabelText?: string;
  Optional?: boolean;
  InfoIcon?: boolean;
  /** ค่าที่เลือก (property Text) */
  Text?: string;
  /** ข้อความเมื่อยังไม่เลือก */
  Placeholder?: string;
  LeadingIconSwap?: string;
  SupportingText?: string;
  HelperText?: string;
  /** รายการเปิดอยู่ (State=Focused) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** property Cursor — ส่งเมื่อช่องพิมพ์ค้นได้ (Text = คำค้น) */
  onQuery?: (q: string) => void;
  /** Dropdown list ที่แสดงเมื่อเปิด */
  children?: ReactNode;
  className?: string;
}

export function InputDropdown({ State, Size = "md", Label = true, LabelText, Optional, InfoIcon, Text, Placeholder = "เลือก", LeadingIconSwap, SupportingText, HelperText, open, onOpenChange, onQuery, children, className }: InputDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => onOpenChange?.(false), [onOpenChange]);
  useOutside(ref, !!open, close);
  const st: InputDropdownState = State ?? (open ? "Focused" : Text ? "Selected" : "Default");
  const off = st === "Disabled";
  const err = st.startsWith("Error");
  return (
    <div ref={ref} className={cx("relative flex min-w-0 flex-col gap-2", className)}>
      {Label && LabelText && <InputLabel LabelText={LabelText} Optional={Optional} InfoIcon={InfoIcon} />}
      {onQuery ? (
        <div className={cx("flex w-full items-center gap-2 rounded-md border px-3 py-2 text-md", Size === "lg" ? "h-12" : "h-10", containerTone(err && open ? "Error Focused" : open ? "Focused" : st))}>
          {LeadingIconSwap && <Ms name={LeadingIconSwap} size={24} className="text-gray-500" />}
          <input
            role="combobox"
            aria-expanded={!!open}
            aria-label={LabelText}
            value={Text ?? ""}
            placeholder={Placeholder}
            disabled={off}
            onFocus={() => onOpenChange?.(true)}
            onClick={() => onOpenChange?.(true)}
            onChange={(e) => { onQuery(e.target.value); onOpenChange?.(true); }}
            className="min-w-0 flex-1 bg-transparent text-black outline-none placeholder:text-gray-400"
          />
          <button type="button" tabIndex={-1} aria-label={open ? "ปิดรายการ" : "เปิดรายการ"} onClick={() => onOpenChange?.(!open)} className="inline-flex cursor-pointer">
            <Ms name={open ? "keyboard_arrow_up-20-400-round" : "keyboard_arrow_down-20-400-round"} size={20} className="text-gray-500" />
          </button>
        </div>
      ) : (
      <button
        type="button"
        disabled={off}
        aria-haspopup="listbox"
        aria-expanded={!!open}
        aria-label={LabelText}
        onClick={() => onOpenChange?.(!open)}
        className={cx("flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-md", Size === "lg" ? "h-12" : "h-10", containerTone(err && open ? "Error Focused" : open ? "Focused" : st), off ? "cursor-not-allowed" : "cursor-pointer")}
      >
        {LeadingIconSwap && <Ms name={LeadingIconSwap} size={24} className="text-gray-500" />}
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className={cx("truncate", Text && !off ? "text-black" : "text-gray-400")}>{Text || Placeholder}</span>
          {SupportingText && <span className="truncate text-gray-600">{SupportingText}</span>}
        </span>
        <Ms name={open ? "keyboard_arrow_up-20-400-round" : "keyboard_arrow_down-20-400-round"} size={20} className={off ? "text-gray-400" : "text-gray-500"} />
      </button>
      )}
      {HelperText && <p className={cx("text-xs", err ? "text-error-600" : "text-gray-600")}>{HelperText}</p>}
      {open && children && <div className={cx("absolute right-0 left-0 z-30", HelperText ? "top-[calc(100%-22px)]" : "top-[calc(100%+4px)]")}>{children}</div>}
    </div>
  );
}
