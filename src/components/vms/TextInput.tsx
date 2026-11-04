"use client";
/* Figma: "Text input" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Text input.json
   variant: State = Default | Filled | Hover | Focused | Disabled | Readonly | Error | Error Hover | Error Focused | Error Readonly · Size = md | lg
   property: Label · Label text · Optional · Info icon · Text · Show Placeholder · Leading icon (swap) · Trailing icon (swap) · Helper · Helper text
   ค่า: กว้างตั้งต้น 352 · ป้าย (Input label) → ช่อง ห่าง 8 · ช่อง md สูง 40 / lg 48 · ขอบใน 8/12 · ช่องไฟ 8 · รัศมี 8 · ขอบ 1 gray-300
        Hover/Focused ขอบ brand-800 · Error ขอบ error-500 · Disabled/Readonly พื้น gray-100 · Error Readonly ขอบ error-200
        ตัวอักษร 16 Regular (ค่า black · placeholder gray-400) · ไอคอน 24/20 gray-500 · Helper 12 Regular gray-600 (Error error-600) */
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { InputLabel } from "./InputLabel";
import { Ms } from "./Ms";

export type TextInputState = "Default" | "Filled" | "Hover" | "Focused" | "Disabled" | "Readonly" | "Error" | "Error Hover" | "Error Focused" | "Error Readonly";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value"> {
  State?: TextInputState;
  Size?: "md" | "lg";
  /** property Label (แสดงป้าย) */
  Label?: boolean;
  LabelText?: string;
  Optional?: boolean;
  InfoIcon?: boolean;
  /** property Text = ค่าในช่อง */
  Text?: string;
  /** ข้อความ placeholder (Figma: Text ตอน Show Placeholder) */
  Placeholder?: string;
  LeadingIconSwap?: string;
  TrailingIconSwap?: string;
  /** property Helper text (ใส่ = เปิด Helper) */
  HelperText?: string;
  LabelButton?: ReactNode;
  onChange?: (v: string) => void;
  className?: string;
  inputClassName?: string;
}

export function containerTone(state: string): string {
  const err = state.startsWith("Error");
  if (state === "Disabled") return "bg-gray-100 border-gray-300 text-gray-400";
  if (state === "Error Readonly") return "bg-gray-100 border-error-200 text-black";
  if (state === "Readonly") return "bg-gray-100 border-gray-300 text-black";
  if (err) return "bg-white border-error-500 text-black";
  if (state === "Hover" || state === "Focused") return "bg-white border-brand-800 text-black";
  return "bg-white border-gray-300 text-black hover:border-brand-800 focus-within:border-brand-800";
}

export function TextInput({ State, Size = "md", Label = true, LabelText, Optional, InfoIcon, Text, Placeholder, LeadingIconSwap, TrailingIconSwap, HelperText, LabelButton, onChange, className, inputClassName, disabled, readOnly, id, ...rest }: TextInputProps) {
  const auto = useId();
  const st: TextInputState = State ?? (disabled ? "Disabled" : readOnly ? "Readonly" : Text ? "Filled" : "Default");
  const err = st.startsWith("Error");
  return (
    <div className={cx("flex min-w-0 flex-col gap-2", className)}>
      {Label && LabelText && <InputLabel LabelText={LabelText} Optional={Optional} InfoIcon={InfoIcon} Button={LabelButton} htmlFor={id ?? auto} />}
      <div className={cx("flex items-center gap-2 rounded-md border px-3 py-2", Size === "lg" ? "h-12" : "h-10", containerTone(st))}>
        {LeadingIconSwap && <Ms name={LeadingIconSwap} size={24} className="text-gray-500" />}
        <input
          id={id ?? auto}
          value={Text ?? ""}
          placeholder={Placeholder}
          disabled={disabled || st === "Disabled"}
          readOnly={readOnly || st.endsWith("Readonly")}
          onChange={(e) => onChange?.(e.target.value)}
          className={cx("min-w-0 flex-1 bg-transparent text-md outline-none placeholder:text-gray-400 disabled:text-gray-400", inputClassName)}
          {...rest}
        />
        {TrailingIconSwap && <Ms name={TrailingIconSwap} size={20} className="text-gray-500" />}
      </div>
      {HelperText && <p className={cx("text-xs", err ? "text-error-600" : "text-gray-600")}>{HelperText}</p>}
    </div>
  );
}
