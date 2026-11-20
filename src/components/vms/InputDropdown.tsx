"use client";
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
  Text?: string;
  Placeholder?: string;
  LeadingIconSwap?: string;
  SupportingText?: string;
  HelperText?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onQuery?: (q: string) => void;
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
