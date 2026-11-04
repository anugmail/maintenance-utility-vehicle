"use client";
/* Figma: "Tab item" — ไฟล์ (Component) VMS Plus หน้า Tabs (node 2:9) · สเปก figma-spec/Tab item.json
   variant: State = Default | Hover | Focused · Active = True | False · property: Text · Badge (Pill outline Color=Brand)
   ค่า: สูง 48 · ขอบใน 12/24 · ช่องไฟ 8 · ข้อความ 14 SemiBold (Active black · ไม่ Active gray-600) · Hover พื้น gray-200 · Focused gray-50
        เส้นล่าง: ไม่ Active gray-300 · Active ไลบรารีเป็นสีม่วงที่ไม่มี token → ใช้ brand-900 (ดู COMPOSED.md) */
import { cx } from "@/lib/cx";
import { PillOutline } from "./PillOutline";

export interface TabItemProps {
  Text: string;
  /** property Badge — ตัวเลขในป้าย (ไม่ใส่ = ปิด) */
  Badge?: string | number | null;
  Active?: boolean;
  State?: "Default" | "Hover" | "Focused";
  onClick?: () => void;
}

export function TabItem({ Text, Badge, Active, State = "Default", onClick }: TabItemProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={!!Active}
      onClick={onClick}
      className={cx(
        "-mb-px inline-flex h-12 shrink-0 cursor-pointer items-center gap-2 px-6 py-3 text-sm font-semibold whitespace-nowrap",
        Active ? "border-b-2 border-brand-900 text-black" : "border-b border-gray-300 text-gray-600 hover:text-black",
        State === "Hover" ? "bg-gray-200" : State === "Focused" ? "bg-gray-50" : "bg-white hover:bg-gray-200",
      )}
    >
      {Text}
      {Badge != null && <PillOutline Text={String(Badge)} Color="Brand" />}
    </button>
  );
}
