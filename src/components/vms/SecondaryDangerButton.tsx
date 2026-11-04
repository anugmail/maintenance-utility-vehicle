"use client";
/* Figma: "Secondary danger button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Secondary danger button.json
   variant: State = Default | Hover | Focused | Disabled · Size = md | lg
   property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
   สี: พื้น white ขอบ gray-300 ตัวอักษร error-600 · Hover พื้น gray-200 · Disabled พื้น gray-100 ขอบ gray-200 ตัวอักษร gray-400 */
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "border border-gray-300 bg-white text-error-600", hover: "border border-gray-300 bg-gray-200 text-error-600", hoverCls: "hover:bg-gray-200", disabled: "border border-gray-200 bg-gray-100 text-gray-400" };

export function SecondaryDangerButton(props: ButtonProps) {
  return <ButtonBase look={LOOK} {...props} />;
}
