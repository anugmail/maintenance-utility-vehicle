/* Figma: "Input label" — ไฟล์ (Component) VMS Plus หน้า Inputs (node 2:6) · สเปก figma-spec/Input label.json
   ป้ายเหนือช่องกรอกทุกแบบ (Text input · Input dropdown · Input dropdown with badges)
   property: Label text · Optional ("(ถ้ามี)") · Info icon (ปิดตามกติกา R4) · button (Tertiary brand button ขวา)
   ค่า: สูง 24 · ช่องไฟ 4 · ป้าย 16 SemiBold gray-600 · "(ถ้ามี)" 16 Regular gray-400 · ไอคอน info 24 gray-300 */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface InputLabelProps {
  LabelText: string;
  Optional?: boolean;
  InfoIcon?: boolean;
  /** property button — ปุ่ม Tertiary brand button ท้ายป้าย */
  Button?: ReactNode;
  htmlFor?: string;
  className?: string;
}

export function InputLabel({ LabelText, Optional, InfoIcon, Button, htmlFor, className }: InputLabelProps) {
  return (
    <div className={cx("flex min-h-6 items-center gap-1", className)}>
      <label htmlFor={htmlFor} className="flex min-w-0 flex-1 items-center gap-1 text-md">
        <span className="font-semibold text-gray-600">{LabelText}</span>
        {Optional && <span className="text-gray-400">(ถ้ามี)</span>}
        {InfoIcon && <Ms name="info-24-300-round" size={24} className="text-gray-300" />}
      </label>
      {Button}
    </div>
  );
}
