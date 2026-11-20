"use client";
import type { MouseEvent, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Checkbox } from "./Checkbox";
import { PillOutline, type PillColor } from "./PillOutline";
import { TertiaryButton } from "./TertiaryButton";
import { linkPlate } from "@/components/patterns/PlateLink";

export type TableCellStyle = "Text" | "Lead text" | "Badge" | "Action icons" | "Multiple badges" | "Lead checkbox";

export interface CellAction { IconSwap: string; label: string; onClick?: (e: MouseEvent<HTMLButtonElement>) => void }

export interface TableCellProps {
  Style?: TableCellStyle;
  AlternatingFills?: boolean;
  Text?: ReactNode;
  SupportingText?: string;
  Pills?: [string, PillColor][];
  Actions?: CellAction[];
  checked?: boolean;
  onCheck?: (next: boolean) => void;
  checkDisabled?: boolean;
  className?: string;
}

export function TableCell({ Style = "Text", AlternatingFills, Text, SupportingText, Pills, Actions, checked, onCheck, checkDisabled, className }: TableCellProps) {
  const gap = Style === "Badge" ? "gap-2" : Style === "Action icons" || Style === "Multiple badges" ? "gap-1" : "gap-3";
  return (
    <td className={cx("h-14 border-b border-gray-200 px-4 py-2 align-middle", AlternatingFills ? "bg-gray-50" : "bg-white", className)}>
      <div className={cx("flex items-center", gap)}>
        {Style === "Lead checkbox" && <Checkbox Type={checked ? "Selected" : "Unselected"} State={checkDisabled ? "Disabled" : "Default"} onChange={checkDisabled ? undefined : onCheck} label={typeof Text === "string" ? Text : undefined} />}
        {(Style === "Badge" || Style === "Multiple badges") && (Pills ?? []).map(([t, c], i) => <PillOutline key={i} Text={t} Color={c} />)}
        {Style === "Action icons" && (Actions ?? []).map((a) => <TertiaryButton key={a.label} LeadingIconSwap={a.IconSwap} ButtonText={false} aria-label={a.label} title={a.label} onClick={a.onClick} />)}
        {(Style === "Text" || Style === "Lead text" || Style === "Lead checkbox") && (
          <div className="flex min-w-0 flex-col">
            <span className={cx("text-sm text-black", Style === "Lead text" && "font-medium")}>{linkPlate(Text)}</span>
            {SupportingText && <span className="text-xs text-gray-600">{SupportingText}</span>}
          </div>
        )}
      </div>
    </td>
  );
}
