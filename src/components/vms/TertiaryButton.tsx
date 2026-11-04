"use client";
/* Figma: "Tertiary button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Tertiary button.json
   variant: State = Default | Hover | Focused | Disabled · Size = md
   property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
   สี: ตัวอักษร gray-600 · Hover พื้น gray-100 ตัวอักษร gray-700 · Disabled ตัวอักษร gray-400 */
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "text-gray-600", hover: "bg-gray-100 text-gray-700", hoverCls: "hover:bg-gray-100 hover:text-gray-700", disabled: "text-gray-400", tertiary: true };

export function TertiaryButton(props: Omit<ButtonProps, "Size">) {
  return <ButtonBase look={LOOK} {...props} />;
}
