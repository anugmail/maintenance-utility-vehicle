"use client";
/* Figma: "List with checkbox item" — ไฟล์ (Component) VMS Plus หน้า List (node 3285:58382) · สเปก figma-spec/List with checkbox item.json
   variant: State = Default | Hover | Selected | Selected Hover | Disabled · property: Text · Supporting · Supporting text · Supporting 2 · Supporting text 2 · Avatar (ปิดตาม mobileCards())
   ค่า: ขอบใน 8/16 · ช่องไฟ 16 · พื้น white (Hover gray-100) · เส้นล่าง 1 gray-200 (sws [0,0,1,0])
        Text 16 Regular black (Selected brand-900 · Disabled gray-400) · Supporting 12 gray-600 ช่องไฟ 4 · Checkbox ชิดขวา */
import { cx } from "@/lib/cx";
import { Checkbox } from "./Checkbox";
import { linkPlate } from "@/components/patterns/PlateLink";

export type ListItemState = "Default" | "Hover" | "Selected" | "Selected Hover" | "Disabled";

export function ListWithCheckboxItem({ Text, SupportingText, SupportingText2, Selected = false, State, onChange }: {
  Text: string; SupportingText?: string; SupportingText2?: string; Selected?: boolean; State?: ListItemState; onChange?: (next: boolean) => void;
}) {
  const st: ListItemState = State ?? (Selected ? "Selected" : "Default");
  const off = st === "Disabled";
  const on = st.startsWith("Selected");
  return (
    <div onClick={() => !off && onChange?.(!on)}
      className={cx("flex min-h-14 items-center gap-4 border-b border-gray-200 px-4 py-2", st.endsWith("Hover") ? "bg-gray-100" : "bg-white", off ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-100")}>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className={cx("text-md", off ? "text-gray-400" : on ? "text-brand-900" : "text-black")}>{linkPlate(Text)}</span>
        {(SupportingText || SupportingText2) && (
          <span className={cx("flex items-center gap-1 text-xs", off ? "text-gray-400" : "text-gray-600")}>{SupportingText}{SupportingText2 && <span>{SupportingText2}</span>}</span>
        )}
      </div>
      <span onClick={(e) => e.stopPropagation()}><Checkbox Type={on ? "Selected" : "Unselected"} State={off ? "Disabled" : "Default"} onChange={onChange} label={Text} /></span>
    </div>
  );
}
