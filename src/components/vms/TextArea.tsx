"use client";
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
