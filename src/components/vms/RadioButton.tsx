"use client";
import { cx } from "@/lib/cx";

export interface RadioButtonProps {
  Selected?: boolean;
  State?: "Default" | "Hover" | "Focused" | "Disabled";
  onChange?: () => void;
  label?: string;
  bare?: boolean;
  className?: string;
}

export function radioLook(Selected: boolean, State: RadioButtonProps["State"] = "Default", interactive = true) {
  const off = State === "Disabled";
  const ring = off ? "" : State === "Hover" || State === "Focused" ? (Selected ? "shadow-ring" : "shadow-ring-gray")
    : !interactive ? "" : Selected ? "group-hover:shadow-ring" : "group-hover:shadow-ring-gray";
  return cx("relative inline-flex size-5 shrink-0 items-center justify-center rounded-pill",
    off ? "border-2 border-gray-300 bg-gray-200" : Selected ? "bg-brand-900" : "border-2 border-gray-300 bg-white", ring);
}

export function RadioDot({ Selected = false, State = "Default", interactive = true }: { Selected?: boolean; State?: RadioButtonProps["State"]; interactive?: boolean }) {
  return (
    <span aria-hidden="true" className={radioLook(Selected, State, interactive)}>
      {Selected && <span className={cx("size-2 rounded-pill", State === "Disabled" ? "bg-gray-300" : "bg-white")} />}
    </span>
  );
}

export function RadioButton({ Selected = false, State = "Default", onChange, label, bare, className }: RadioButtonProps) {
  if (bare) return <span className={className}><RadioDot Selected={Selected} State={State} interactive={false} /></span>;
  const off = State === "Disabled";
  return (
    <button type="button" role="radio" aria-checked={Selected} aria-label={label} disabled={off} onClick={onChange}
      className={cx("group inline-flex rounded-pill focus-visible:outline-none", off ? "cursor-not-allowed" : "cursor-pointer", className)}>
      <RadioDot Selected={Selected} State={State} />
    </button>
  );
}
