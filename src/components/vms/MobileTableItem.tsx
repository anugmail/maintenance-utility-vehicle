"use client";
/* Figma: "Mobile table item" — ไฟล์ (Component) VMS Plus หน้า Table (node 2:14) · สเปก figma-spec/Mobile table item.json
   แถวในการ์ด Mobile table
   variant: Style = Text | Lead text | Badge | Action icons | Action buttons (Avatar · Lead avatar ไม่ใช้)
   property: Header · Text · Supporting · Supporting text · View · Edit · Print · Delete
   ค่า: Text/Lead text/Badge: ขอบใน 8/12 ช่องไฟ 8 เส้นล่าง gray-200 · หัว 14 SemiBold black ครึ่งซ้าย · ค่า 14 (Lead text Medium) ชิดขวา + Supporting text 12 gray-600
        Action icons: ขอบใน 12 ช่องไฟ 4 Tertiary button ไอคอน 40 · Action buttons: ขอบใน 16/12 ช่องไฟ 12 Secondary button Size=lg */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { PillOutline, type PillColor } from "./PillOutline";
import type { CellAction } from "./TableCell";
import { TertiaryButton } from "./TertiaryButton";

export type MobileTableItemStyle = "Text" | "Lead text" | "Badge" | "Action icons" | "Action buttons";

export interface MobileTableItemProps {
  Style?: MobileTableItemStyle;
  Header?: string;
  Text?: ReactNode;
  SupportingText?: string;
  Pill?: [string, PillColor];
  Actions?: CellAction[];
  /** Action buttons — ปุ่ม Secondary button Size=lg */
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
        {Style === "Badge" && Pill ? <PillOutline Text={Pill[0]} Color={Pill[1]} /> : <span className={cx("text-sm text-black", Style === "Lead text" && "font-medium")}>{Text}</span>}
        {Style !== "Badge" && SupportingText && <span className="text-xs text-gray-600">{SupportingText}</span>}
      </div>
    </div>
  );
}
