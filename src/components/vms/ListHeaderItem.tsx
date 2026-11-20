"use client";
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
