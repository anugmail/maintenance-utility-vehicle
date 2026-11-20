"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { PillOutline, type PillColor } from "./PillOutline";
import type { CellAction } from "./TableCell";
import { TertiaryButton } from "./TertiaryButton";
import { linkPlate } from "@/components/patterns/PlateLink";

export type MobileTableItemStyle = "Text" | "Lead text" | "Badge" | "Action icons" | "Action buttons";

export interface MobileTableItemProps {
  Style?: MobileTableItemStyle;
  Header?: string;
  Text?: ReactNode;
  SupportingText?: string;
  Pill?: [string, PillColor];
  Actions?: CellAction[];
  Buttons?: ReactNode;
  last?: boolean;
}

export function MobileTableItem({ Style = "Text", Header, Text, SupportingText, Pill, Actions, Buttons, last }: MobileTableItemProps) {
  if (Style === "Action icons") return <div className="flex items-center gap-1 p-3">{(Actions ?? []).map((a) => <TertiaryButton key={a.label} LeadingIconSwap={a.IconSwap} ButtonText={false} aria-label={a.label} title={a.label} onClick={a.onClick} />)}</div>;
  if (Style === "Action buttons") return <div className="flex items-center gap-3 px-3 py-4 [&>*]:flex-1">{Buttons}</div>;
  return (
    <div className={cx("flex min-h-10 items-center gap-2 px-3 py-2", !last && "border-b border-gray-200")}>
      <span className="w-1/2 shrink-0 text-sm font-semibold text-black">{Header}</span>
      <div className="flex min-w-0 flex-1 flex-col items-end text-right">
        {Style === "Badge" && Pill ? <PillOutline Text={Pill[0]} Color={Pill[1]} /> : <span className={cx("text-sm text-black", Style === "Lead text" && "font-medium")}>{linkPlate(Text)}</span>}
        {Style !== "Badge" && SupportingText && <span className="text-xs text-gray-600">{SupportingText}</span>}
      </div>
    </div>
  );
}
