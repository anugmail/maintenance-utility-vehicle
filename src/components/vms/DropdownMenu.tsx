/* Figma: "Dropdown menu" — ไฟล์ (Component) VMS Plus หน้า Dropdowns (node 2:8) · สเปก figma-spec/Dropdown menu.json
   เมนู "…" ท้ายแถว (ตาม menuAt / planMenu ใน core.js) · _Dropdown menu header ซ่อน · เส้นคั่นก่อนรายการที่ 3 (น้อยกว่า 3 รายการไม่มีเส้น)
   ค่า: กว้าง 240 · รัศมี 8 · พื้น white · ขอบ 1 gray-200 · Menu items ขอบในบน/ล่าง 4
   เงา: ดัมป์ไม่มีค่า effect → token shadow-float ดู COMPOSED.md
   mobile: เมนูอยู่ใน bottom sheet (ไม่มีกรอบ) — ส่ง bare */
import { cx } from "@/lib/cx";
import { DropdownMenuItem } from "./DropdownMenuItem";

export interface MenuEntry { Text: string; IconSwap?: string; onClick?: () => void; Disabled?: boolean }

export function DropdownMenu({ items, bare, className }: { items: MenuEntry[]; bare?: boolean; className?: string }) {
  return (
    <div role="menu" className={cx("flex flex-col bg-white py-1", bare ? "" : "w-60 rounded-md border border-gray-200 shadow-float", className)}>
      {items.map((it, i) => (
        <div key={it.Text}>
          {i === 2 && <DropdownMenuItem Divider />}
          <DropdownMenuItem Text={it.Text} IconSwap={it.IconSwap} State={it.Disabled ? "Disabled" : "Default"} onClick={it.onClick} />
        </div>
      ))}
    </div>
  );
}
