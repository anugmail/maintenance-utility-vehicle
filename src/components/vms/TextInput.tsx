"use client";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { InputLabel } from "./InputLabel";
import { Ms } from "./Ms";

export type TextInputState = "Default" | "Filled" | "Hover" | "Focused" | "Disabled" | "Readonly" | "Error" | "Error Hover" | "Error Focused" | "Error Readonly";

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "onChange" | "value"> {
  State?: TextInputState;
  Size?: "md" | "lg";
  Label?: boolean;
  LabelText?: string;
  Optional?: boolean;
  InfoIcon?: boolean;
  Text?: string;
  Placeholder?: string;
  LeadingIconSwap?: string;
  TrailingIconSwap?: string;
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
  if (state === "Error Focused") return "bg-white border-error-500 text-black shadow-ring-error";
  if (err) return "bg-white border-error-500 text-black focus-within:shadow-ring-error";
  if (state === "Focused") return "bg-white border-brand-800 text-black shadow-ring";
  if (state === "Hover") return "bg-white border-brand-800 text-black";
  return "bg-white border-gray-300 text-black hover:border-brand-800 focus-within:border-brand-800 focus-within:shadow-ring";
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
