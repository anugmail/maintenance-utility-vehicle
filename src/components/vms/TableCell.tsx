"use client";
/* Figma: "Table cell" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Table cell.json
   variant: Style = Text | Lead text | Badge | Action icons | Multiple badges | Lead checkbox (ที่ต้นแบบใช้) · Alternating fills = False | True
   property: Text · Supporting · Supporting text · View · Edit · Print · Delete (ปุ่มไอคอนของ Action icons)
   ค่า: สูง 56 · ขอบใน 8/16 · ช่องไฟ 12 (Badge 8 · Action icons/Multiple badges 4) · พื้น white / gray-50 (Alternating fills=True) · เส้นล่าง gray-200
        Text 14 Regular black · Lead text 14 Medium · Supporting text 12 Regular gray-600 · Action icons = Tertiary button ไอคอนอย่างเดียว 40 */
import type { MouseEvent, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Checkbox } from "./Checkbox";
import { PillOutline, type PillColor } from "./PillOutline";
import { TertiaryButton } from "./TertiaryButton";

export type TableCellStyle = "Text" | "Lead text" | "Badge" | "Action icons" | "Multiple badges" | "Lead checkbox";

export interface CellAction { IconSwap: string; label: string; onClick?: (e: MouseEvent<HTMLButtonElement>) => void }

export interface TableCellProps {
  Style?: TableCellStyle;
  AlternatingFills?: boolean;
  Text?: ReactNode;
  SupportingText?: string;
  /** Badge / Multiple badges */
  Pills?: [string, PillColor][];
  /** Action icons — ค่าเริ่มของไลบรารี View quick_reference_all · Edit stylus · Print print · Delete delete */
  Actions?: CellAction[];
  /** Lead checkbox */
  checked?: boolean;
  onCheck?: (next: boolean) => void;
  className?: string;
}

export function TableCell({ Style = "Text", AlternatingFills, Text, SupportingText, Pills, Actions, checked, onCheck, className }: TableCellProps) {
  const gap = Style === "Badge" ? "gap-2" : Style === "Action icons" || Style === "Multiple badges" ? "gap-1" : "gap-3";
  return (
    <td className={cx("h-14 border-b border-gray-200 px-4 py-2 align-middle", AlternatingFills ? "bg-gray-50" : "bg-white", className)}>
      <div className={cx("flex items-center", gap)}>
        {Style === "Lead checkbox" && <Checkbox Type={checked ? "Selected" : "Unselected"} onChange={onCheck} label={typeof Text === "string" ? Text : undefined} />}
        {(Style === "Badge" || Style === "Multiple badges") && (Pills ?? []).map(([t, c], i) => <PillOutline key={i} Text={t} Color={c} />)}
        {Style === "Action icons" && (Actions ?? []).map((a) => <TertiaryButton key={a.label} LeadingIconSwap={a.IconSwap} ButtonText={false} aria-label={a.label} title={a.label} onClick={a.onClick} />)}
        {(Style === "Text" || Style === "Lead text" || Style === "Lead checkbox") && (
          <div className="flex min-w-0 flex-col">
            <span className={cx("text-sm text-black", Style === "Lead text" && "font-medium")}>{Text}</span>
            {SupportingText && <span className="text-xs text-gray-600">{SupportingText}</span>}
          </div>
        )}
      </div>
    </td>
  );
}
