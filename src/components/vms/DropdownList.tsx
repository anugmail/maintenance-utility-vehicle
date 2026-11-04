/* Figma: "Dropdown list" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Dropdown list.json
   รายการใต้ Input dropdown / ช่องค้นหา (ตาม comboAt ใน core.js) · ลูก = Dropdown list item
   ค่า: ขอบใน 12/8 · ช่องไฟ 8 · รัศมี 8 · พื้น white · ขอบ 1 gray-300 · สูงสุด 256 แล้วเลื่อน
   เงา: ดัมป์ไม่มีค่า effect → ใช้ token --shadow-pop (shadow-float) ดู COMPOSED.md */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function DropdownList({ children, className, emptyText }: { children?: ReactNode; className?: string; emptyText?: string }) {
  return (
    <div role="listbox" className={cx("flex max-h-64 flex-col gap-2 overflow-y-auto rounded-md border border-gray-300 bg-white px-2 py-3 shadow-float", className)}>
      {children}
      {emptyText && <p className="px-2 py-2 text-sm text-gray-600">{emptyText}</p>}
    </div>
  );
}
