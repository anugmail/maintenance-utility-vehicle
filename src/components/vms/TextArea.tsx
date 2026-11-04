"use client";
/* Figma: "Text area" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Text area.json
   variant: State = Default | Filled | Hover | Focused | Disabled | Readonly | Error | Error Hover | Error Focused | Error Readonly · Size = md
   property: Label · Label text · Optional · Info icon · Text · Show Placeholder · Helper · Helper text · Trailing icon (ปิด)
   ค่า: กว้างตั้งต้น 352 · ป้าย (Input label) → ช่อง ห่าง 8 · ช่องสูง 120 · ขอบใน 8/8/8/12 · รัศมี 8 · ขอบ 1 gray-300 (สีตาม State เหมือน Text input — containerTone)
        ตัวอักษร 16 Regular (ค่า black · placeholder gray-400) · มุมขวาล่าง ไอคอน resize-right 16 (กราฟิกจาก figma-spec/svg) · Helper 12 gray-600 (Error error-600) */
import { useId, type TextareaHTMLAttributes } from "react";
import { asset } from "@/lib/basePath";
import { cx } from "@/lib/cx";
import { InputLabel } from "./InputLabel";
import { containerTone, type TextInputState } from "./TextInput";

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  State?: TextInputState;
  Label?: boolean;
  LabelText?: string;
  Optional?: boolean;
  InfoIcon?: boolean;
  Text?: string;
  Placeholder?: string;
  HelperText?: string;
  onChange?: (v: string) => void;
  className?: string;
}

export function TextArea({ State, Label = true, LabelText, Optional, InfoIcon, Text, Placeholder, HelperText, onChange, className, disabled, readOnly, id, ...rest }: TextAreaProps) {
  const auto = useId();
  const st: TextInputState = State ?? (disabled ? "Disabled" : readOnly ? "Readonly" : Text ? "Filled" : "Default");
  const err = st.startsWith("Error");
  return (
    <div className={cx("flex min-w-0 flex-col gap-2", className)}>
      {Label && LabelText && <InputLabel LabelText={LabelText} Optional={Optional} InfoIcon={InfoIcon} htmlFor={id ?? auto} />}
      <div className={cx("relative flex h-30 flex-col rounded-md border py-2 pr-2 pl-3", containerTone(st))}>
        <textarea
          id={id ?? auto}
          value={Text ?? ""}
          placeholder={Placeholder}
          disabled={disabled || st === "Disabled"}
          readOnly={readOnly || st.endsWith("Readonly")}
          onChange={(e) => onChange?.(e.target.value)}
          className="min-h-0 w-full flex-1 resize-none bg-transparent pr-4 text-md outline-none placeholder:text-gray-400 disabled:text-gray-400"
          {...rest}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/figma-svg/resize-right.svg")} alt="" aria-hidden="true" width={16} height={16} className="pointer-events-none absolute right-2 bottom-2" />
      </div>
      {HelperText && <p className={cx("text-xs", err ? "text-error-600" : "text-gray-600")}>{HelperText}</p>}
    </div>
  );
}
