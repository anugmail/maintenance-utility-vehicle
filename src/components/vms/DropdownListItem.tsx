"use client";
/* Figma: "Dropdown list item" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Dropdown list item.json
   variant: State = Default | Hover | Selected | Selected Hover | Disabled
   property: Text · Supporting · Supporting text · Supporting 2 · Supporting text 2 · Avatar (ปิด — สี avatar ไม่มี token ดู COMPOSED.md)
   ค่า: สูง 40 · ขอบในซ้าย/ขวา 8 · ช่องไฟ 8 · รัศมี 4 · ข้อความ 16 Regular black (Selected brand-900 · Disabled gray-400)
        บรรทัดรอง 12 gray-600 คั่นด้วยขีด gray-300 · Hover พื้น gray-200 · Selected มีไอคอน check 24 brand-900 ท้ายแถว */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export type DropdownListItemState = "Default" | "Hover" | "Selected" | "Selected Hover" | "Disabled";

export interface DropdownListItemProps {
  Text: string;
  State?: DropdownListItemState;
  SupportingText?: string;
  SupportingText2?: string;
  onClick?: () => void;
  className?: string;
}

export function DropdownListItem({ Text, State = "Default", SupportingText, SupportingText2, onClick, className }: DropdownListItemProps) {
  const sel = State.startsWith("Selected");
  const off = State === "Disabled";
  return (
    <button
      type="button"
      role="option"
      aria-selected={sel}
      disabled={off}
      onClick={onClick}
      className={cx("flex min-h-10 w-full shrink-0 items-center gap-2 rounded-xs px-2 py-1 text-left", State.endsWith("Hover") ? "bg-gray-200" : "bg-white", off ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-200", className)}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cx("truncate text-md", off ? "text-gray-400" : sel ? "text-brand-900" : "text-black")}>{Text}</span>
        {(SupportingText || SupportingText2) && (
          <span className={cx("flex items-center gap-1 text-xs", off ? "text-gray-400" : "text-gray-600")}>
            {SupportingText && <span className="truncate">{SupportingText}</span>}
            {SupportingText2 && <><span className="h-px w-2 bg-gray-300" /><span className="truncate">{SupportingText2}</span></>}
          </span>
        )}
      </span>
      {sel && <Ms name="check-24-300-round" size={24} className="text-brand-900" />}
    </button>
  );
}
