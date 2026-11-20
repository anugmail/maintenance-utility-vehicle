"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { RadioDot } from "./RadioButton";

export type CardState = "Default" | "Hover" | "Focused" | "Disabled";

export function cardTone(Selected: boolean, State: CardState) {
  if (State === "Disabled") return cx("cursor-not-allowed bg-gray-50 border-gray-300", Selected ? "border-2 p-[15px]" : "border");
  return cx("cursor-pointer bg-white focus-visible:outline-none focus-visible:shadow-ring",
    Selected ? "border-2 p-[15px]" : "border",
    State === "Hover" || State === "Focused" ? "border-brand-800" : Selected ? "border-brand-900 hover:border-brand-800" : "border-gray-300 hover:border-brand-800",
    State === "Focused" && "shadow-ring");
}

export interface RadioTextCardProps {
  Text: ReactNode;
  SupportingText?: ReactNode;
  Selected?: boolean;
  State?: CardState;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}

export function RadioTextCard({ Text, SupportingText, Selected = false, State = "Default", onClick, compact, className }: RadioTextCardProps) {
  const off = State === "Disabled";
  return (
    <button type="button" role="radio" aria-checked={Selected} disabled={off} onClick={onClick}
      className={cx("group flex min-w-0 flex-col gap-4 rounded-md p-4 text-left", cardTone(Selected, State), className)}>
      <span className={cx("flex gap-3", compact && "items-center")}>
        <RadioDot Selected={Selected} State={off ? "Disabled" : "Default"} interactive={false} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={cx(compact ? "text-sm" : "text-md", "font-semibold", off ? "text-gray-400" : "text-black")}>{Text}</span>
          {SupportingText && <span className={cx("text-sm", off ? "text-gray-400" : "text-gray-600")}>{SupportingText}</span>}
        </span>
      </span>
    </button>
  );
}

export function RadioTextCards({ options, value, onChange, Breakpoint: bp, row, Disabled, className }: {
  options: { Text: string; SupportingText?: string }[]; value?: string | null; onChange?: (v: string) => void;
  Breakpoint?: Breakpoint; row?: boolean; Disabled?: boolean; className?: string;
}) {
  const mob = useBreakpoint(bp) === "Mobile";
  return (
    <div role="radiogroup" className={cx("flex", mob && !row ? "flex-col gap-3" : cx("[&>*]:flex-1 [&>*]:basis-0", mob ? "gap-2" : "gap-4"), className)}>
      {options.map((o) => <RadioTextCard key={o.Text} Text={o.Text} SupportingText={o.SupportingText} Selected={o.Text === value} State={Disabled ? "Disabled" : "Default"} onClick={() => onChange?.(o.Text)} />)}
    </div>
  );
}
