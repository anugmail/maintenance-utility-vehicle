"use client";
import { cx } from "@/lib/cx";
import { PillOutline } from "./PillOutline";

export interface TabItemProps {
  Text: string;
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
