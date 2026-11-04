"use client";
/* Figma: "Primary button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Primary button.json
   variant: State = Default | Hover | Focused | Disabled · Size = md | lg
   property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
   สี: พื้น brand-900 · Hover brand-800 · ตัวอักษร white · Disabled พื้น gray-100 ตัวอักษร gray-400 */
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "bg-brand-900 text-white", hover: "bg-brand-800 text-white", hoverCls: "hover:bg-brand-800", disabled: "bg-gray-100 text-gray-400", ring: "brand" };

export function PrimaryButton(props: ButtonProps) {
  return <ButtonBase look={LOOK} {...props} />;
}
