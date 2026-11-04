"use client";
/* Figma: "_Dropdown menu item" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/_Dropdown menu item.json
   ชิ้นซ้อนใน Dropdown menu
   variant: Type = Shortcut | Badge · State = Default | Hover | Focused | Disabled · Divider = False | True
   property: Text · Icon (swap) · Shortcut (ปิด) · Badge
   ค่า: สูง 40 · ขอบนอกซ้าย/ขวา 4 · Content ขอบใน 8/12 รัศมี 8 · ไอคอน 16 + ข้อความ 14 Medium black ห่าง 8
        Hover พื้น gray-100 · Focused พื้น gray-50 · Divider=True สูง 9 เส้น 1 gray-200 */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface DropdownMenuItemProps {
  Text?: string;
  IconSwap?: string;
  State?: "Default" | "Hover" | "Focused" | "Disabled";
  Divider?: boolean;
  onClick?: () => void;
}

export function DropdownMenuItem({ Text, IconSwap, State = "Default", Divider, onClick }: DropdownMenuItemProps) {
  if (Divider) return <div role="separator" className="py-1"><div className="h-px bg-gray-200" /></div>;
  const off = State === "Disabled";
  return (
    <div className="px-1">
      <button
        type="button"
        role="menuitem"
        disabled={off}
        onClick={onClick}
        className={cx("flex h-10 w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium", off ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-black hover:bg-gray-100", State === "Hover" && "bg-gray-100", State === "Focused" && "bg-gray-50")}
      >
        {IconSwap && <Ms name={IconSwap} size={16} />}
        <span className="truncate">{Text}</span>
      </button>
    </div>
  );
}
