"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";
import type { CardState } from "./RadioTextCard";

export interface CheckboxTextCardProps {
  Text: ReactNode;
  SupportingText?: ReactNode;
  Selected?: boolean;
  State?: CardState;
  onChange?: (next: boolean) => void;
  className?: string;
}

export function CheckboxTextCard({ Text, SupportingText, Selected = false, State = "Default", onChange, className }: CheckboxTextCardProps) {
  const off = State === "Disabled";
  return (
    <button type="button" role="checkbox" aria-checked={Selected} disabled={off} onClick={() => onChange?.(!Selected)}
      className={cx("flex min-w-0 flex-col gap-4 rounded-md p-4 text-left",
        off ? cx("cursor-not-allowed border-gray-300 bg-gray-50", Selected ? "border-2 p-[15px]" : "border")
          : cx("cursor-pointer bg-white focus-visible:shadow-ring focus-visible:outline-none", Selected ? "border-2 p-[15px]" : "border",
            State === "Hover" || State === "Focused" ? "border-brand-800" : Selected ? "border-brand-900 hover:border-brand-800" : "border-gray-200 hover:border-brand-800",
            State === "Focused" && "shadow-ring"),
        className)}>
      <span className="flex gap-3">
        <span aria-hidden="true" className={cx("inline-flex size-5 shrink-0 items-center justify-center rounded-xs", off ? "border-2 border-gray-300 bg-gray-200 text-gray-300" : Selected ? "bg-brand-900 text-white" : "border-2 border-gray-300 bg-white")}>
          {Selected && <Ms name="check-20-400-round" size={20} />}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={cx("text-sm font-semibold", off ? "text-gray-400" : "text-black")}>{Text}</span>
          {SupportingText && <span className={cx("text-sm", off ? "text-gray-400" : "text-gray-600")}>{SupportingText}</span>}
        </span>
      </span>
    </button>
  );
}
