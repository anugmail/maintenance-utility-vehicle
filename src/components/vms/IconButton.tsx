"use client";
import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  IconSwap: string;
  State?: "Default" | "Hover" | "Focused" | "Disabled";
}

export function IconButton({ IconSwap, State = "Default", className, disabled, type, ...rest }: IconButtonProps) {
  const off = disabled || State === "Disabled";
  return (
    <button type={type ?? "button"} disabled={off} {...rest}
      className={cx("inline-flex size-10 shrink-0 items-center justify-center rounded-pill border p-2",
        off ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
          : cx("cursor-pointer border-gray-300 text-gray-600 hover:bg-gray-200 focus-visible:shadow-ring-gray focus-visible:outline-none", State === "Hover" ? "bg-gray-200" : "bg-white", State === "Focused" && "shadow-ring-gray"),
        className)}>
      <Ms name={IconSwap} size={20} />
    </button>
  );
}
