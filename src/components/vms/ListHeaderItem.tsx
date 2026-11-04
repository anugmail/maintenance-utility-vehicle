"use client";
/* Figma: "List header item" — ไฟล์ (Component) VMS Plus หน้า List (node 3285:58382) · สเปก figma-spec/List header item.json
   หัวของ List with checkbox: Title + Badge outline Gray (ปิดได้) + Checkbox เลือกทั้งหมด ชิดขวา
   ค่า: สูง 40 · ขอบในข้าง 16 · ช่องไฟ 16 · รัศมี 4 · พื้น gray-200 · Title 16 SemiBold black · Content ช่องไฟ 12 */
import { BadgeOutline } from "./BadgeOutline";
import { Checkbox, type CheckboxType } from "./Checkbox";

export function ListHeaderItem({ Title, Badge, checkType = "Unselected", onCheck }: { Title: string; Badge?: string | number | null; checkType?: CheckboxType; onCheck?: (next: boolean) => void }) {
  return (
    <div className="flex h-10 items-center gap-4 rounded-xs bg-gray-200 px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="truncate text-md font-semibold text-black">{Title}</span>
        {Badge != null && Badge !== "" && <BadgeOutline Text={String(Badge)} Color="Gray" />}
      </div>
      <Checkbox Type={checkType} onChange={onCheck} label={"เลือกทั้งหมด " + Title} />
    </div>
  );
}
