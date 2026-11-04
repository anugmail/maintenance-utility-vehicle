"use client";
/* Figma: "Tertiary brand button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Tertiary brand button.json
   variant: State = Default | Hover | Focused | Disabled (ไม่มี Size · สูง 40)
   property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
   สี: ตัวอักษร brand-900 · Hover พื้น gray-100 · Disabled ตัวอักษร gray-400 */
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "text-brand-900", hover: "bg-gray-100 text-brand-900", hoverCls: "hover:bg-gray-100", disabled: "text-gray-400", tertiary: true };

export function TertiaryBrandButton(props: Omit<ButtonProps, "Size">) {
  return <ButtonBase look={LOOK} {...props} />;
}
