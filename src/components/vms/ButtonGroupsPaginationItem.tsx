"use client";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface PaginationItemProps {
  Type?: "Previous" | "Next" | "Number";
  State?: "Default" | "Hover/Active" | "Focused" | "Disabled";
  Number?: string;
  onClick?: () => void;
  last?: boolean;
}

export function ButtonGroupsPaginationItem({ Type = "Number", State = "Default", Number: n = "1", onClick, last }: PaginationItemProps) {
  const off = State === "Disabled";
  return (
    <button
      type="button"
      disabled={off}
      onClick={onClick}
      aria-label={Type === "Previous" ? "หน้าก่อน" : Type === "Next" ? "หน้าถัดไป" : "หน้า " + n}
      aria-current={State === "Hover/Active" ? "page" : undefined}
      className={cx("inline-flex size-10 items-center justify-center text-sm", !last && "border-r border-gray-300", State === "Hover/Active" ? "bg-gray-200" : State === "Focused" ? "bg-gray-50" : "bg-white", off ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-gray-600 hover:bg-gray-200")}
    >
      {Type === "Number" ? n : <Ms name={Type === "Previous" ? "keyboard_arrow_left-20-400-round" : "keyboard_arrow_right-20-400-round"} size={20} className={off ? "text-gray-400" : "text-gray-500"} />}
    </button>
  );
}
