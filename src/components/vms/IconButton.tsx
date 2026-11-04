"use client";
/* Figma: "Icon button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Icon button.json
   ปุ่มวงกลมไอคอนอย่างเดียว (ปุ่มเลื่อนภาพใน Images / IncidentPhotoGallery)
   variant: State = Default | Hover | Focused | Disabled · property: Icon swap
   ค่า: 40×40 · ขอบใน 8 · รัศมี 9999 · พื้น white ขอบ 1 gray-300 · ไอคอน 20 gray-600 · Hover พื้น gray-200 · Focused + วงโฟกัส gray · Disabled พื้น gray-100 ขอบ gray-200 ไอคอน gray-400 */
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
