"use client";
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
