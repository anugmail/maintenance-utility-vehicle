"use client";
/* Figma: "Tertiary danger button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Tertiary danger button.json
   variant: State = Default | Hover | Focused | Disabled (ไม่มี Size · สูง 40)
   property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
   สี: ตัวอักษร error-600 · Hover พื้น gray-200 ตัวอักษร error-700 · Disabled ตัวอักษร gray-400 */
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "text-error-600", hover: "bg-gray-200 text-error-700", hoverCls: "hover:bg-gray-200 hover:text-error-700", disabled: "text-gray-400", tertiary: true };

export function TertiaryDangerButton(props: Omit<ButtonProps, "Size">) {
  return <ButtonBase look={LOOK} {...props} />;
}
