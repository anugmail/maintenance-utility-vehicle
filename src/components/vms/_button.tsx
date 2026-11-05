"use client";
/* ฐานร่วมของปุ่ม 7 แบบในหน้า Button (2:5) ของไลบรารี — ไม่ใช่ component ของไลบรารีเอง ไฟล์ปุ่มแต่ละแบบเรียกใช้
   ค่าจาก figma-spec/<ชื่อปุ่ม>.json: สูง md 40 / lg 48 · ขอบใน 8/12 (Tertiary 8/8) · ช่องไฟ 4 · รัศมี 8 · ไอคอน 20 · ตัวอักษร SemiBold md 14 / lg 16
   State=Focused: วงโฟกัส effect DROP_SHADOW spread 4 ทึบ 12% — Primary brand-900 · Secondary/Secondary danger gray-500 · Primary danger error-600 · Tertiary ไม่มี (ดัมป์ 4 พ.ย. 2569)
   prop ตามชื่อ property ของ Figma (ตัดช่องว่าง): Text · State · Size · LeadingIcon/LeadingIconSwap · TrailingIcon/TrailingIconSwap · ButtonText */
import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";
import { PillOutline } from "./PillOutline";

export type ButtonState = "Default" | "Hover" | "Focused" | "Disabled";
export type ButtonSize = "md" | "lg";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** property Text */
  Text?: string;
  /** variant State — Hover/Focused ใช้แสดงในหน้า kit · ปกติปล่อยให้ CSS :hover ทำงาน · Disabled = ปุ่มกดไม่ได้ */
  State?: ButtonState;
  /** variant Size (Tertiary button มีแค่ md · Tertiary brand/danger ไม่มี Size) */
  Size?: ButtonSize;
  /** property Leading icon swap = ชื่อไอคอน เช่น "add-24-300-round" (ใส่ = เปิด Leading icon) */
  LeadingIconSwap?: string;
  /** property Trailing icon swap */
  TrailingIconSwap?: string;
  /** property Button text — false = ปุ่มไอคอนอย่างเดียว (ต้องส่ง aria-label) */
  ButtonText?: boolean;
  /** Pill outline Color=Brand ต่อท้ายข้อความ — ชั้นของปุ่ม "Filters" ใน Table header (ดัมป์ 2096:36080 · จำนวนตัวกรองที่ใช้อยู่) · ไม่ใส่ = ไม่มี */
  Pill?: string | number | null;
}

export interface Look {
  base: string;      // พื้น/ขอบ/ตัวอักษร State=Default
  hover: string;     // State=Hover (บังคับแสดง)
  hoverCls: string;  // เหมือน hover แต่นำหน้า hover: (เขียนเต็มให้ Tailwind เห็น)
  disabled: string;  // State=Disabled
  focused?: string;  // State=Focused ถ้าต่างจาก Default
  tertiary?: boolean; // ขอบใน 8/8
  ring?: keyof typeof RING; // วงโฟกัส State=Focused (ไม่ใส่ = ไม่มี)
}

/* [State=Focused บังคับแสดง, โฟกัสจริงด้วยคีย์บอร์ด] — เขียนเต็มให้ Tailwind เห็น */
const RING = {
  brand: ["shadow-ring", "focus-visible:shadow-ring focus-visible:outline-none"],
  gray: ["shadow-ring-gray", "focus-visible:shadow-ring-gray focus-visible:outline-none"],
  error: ["shadow-ring-error", "focus-visible:shadow-ring-error focus-visible:outline-none"],
} as const;

export function ButtonBase({ look, Text, State = "Default", Size = "md", LeadingIconSwap, TrailingIconSwap, ButtonText = true, Pill, className, disabled, type, ...rest }: ButtonProps & { look: Look }) {
  const off = disabled || State === "Disabled";
  const iconOnly = ButtonText === false || !Text;
  return (
    <button
      type={type ?? "button"}
      disabled={off}
      className={cx(
        "inline-flex shrink-0 items-center justify-center gap-1 rounded-md font-semibold whitespace-nowrap transition-colors",
        Size === "lg" ? "h-12 text-md" : "h-10 text-sm",
        iconOnly ? "w-10 p-2" : look.tertiary ? "px-2 py-2" : "px-3 py-2",
        off ? cx(look.disabled, "cursor-not-allowed") : cx(State === "Hover" ? look.hover : State === "Focused" && look.focused ? look.focused : look.base, "cursor-pointer", look.hoverCls,
          look.ring && (State === "Focused" ? RING[look.ring][0] : RING[look.ring][1])),
        className,
      )}
      {...rest}
    >
      {LeadingIconSwap && <Ms name={LeadingIconSwap} size={20} />}
      {!iconOnly && <span className="truncate">{Text}</span>}
      {Pill != null && Pill !== "" && <PillOutline Text={String(Pill)} Color="Brand" />}
      {TrailingIconSwap && <Ms name={TrailingIconSwap} size={20} />}
    </button>
  );
}
