"use client";
import { useId } from "react";
import { cx } from "@/lib/cx";
import { RadioDot } from "./RadioButton";

export interface HorizontalRadioGroupsProps {
  Label?: string;
  Optional?: boolean;
  options: string[];
  value?: string | null;
  onChange?: (v: string) => void;
  HelperText?: string;
  Error?: boolean;
  Disabled?: boolean;
  className?: string;
}

export function HorizontalRadioGroups({ Label, Optional, options, value, onChange, HelperText, Error, Disabled, className }: HorizontalRadioGroupsProps) {
  const id = useId();
  return (
    <div role="radiogroup" aria-labelledby={Label ? id : undefined} className={cx("flex flex-col justify-center gap-2", className)}>
      {Label && (
        <div id={id} className="flex min-h-6 items-center gap-1 text-md">
          <span className="font-semibold text-gray-600">{Label}</span>
          {Optional && <span className="text-gray-400">(ถ้ามี)</span>}
        </div>
      )}
      <div className="flex min-h-10 flex-wrap items-center gap-x-4">
        {options.map((o) => {
          const on = o === value;
          return (
            <button key={o} type="button" role="radio" aria-checked={on} disabled={Disabled} onClick={() => onChange?.(o)}
              className={cx("group flex h-10 items-center text-md text-black focus-visible:outline-none", on ? "gap-3" : "gap-2", Disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer")}>
              <RadioDot Selected={on} State={Disabled ? "Disabled" : "Default"} />
              {o}
            </button>
          );
        })}
      </div>
      {HelperText && <p className={cx("text-xs", Error ? "text-error-600" : "text-gray-600")}>{HelperText}</p>}
    </div>
  );
}
