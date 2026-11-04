"use client";
/* Figma: "Primary danger button" — ไฟล์ (Component) VMS Plus หน้า Button (node 2:5) · สเปก figma-spec/Primary danger button.json
   variant: State = Default | Hover | Focused | Disabled · Size = md | lg
   property: Text · Leading icon (swap) · Trailing icon (swap) · Button text
   สี: พื้น error-600 · Hover error-500 · ตัวอักษร white · Disabled พื้น gray-100 ตัวอักษร gray-400 */
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "bg-error-600 text-white", hover: "bg-error-500 text-white", hoverCls: "hover:bg-error-500", disabled: "bg-gray-100 text-gray-400", ring: "error" };

export function PrimaryDangerButton(props: ButtonProps) {
  return <ButtonBase look={LOOK} {...props} />;
}
