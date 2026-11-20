"use client";
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "bg-error-600 text-white", hover: "bg-error-500 text-white", hoverCls: "hover:bg-error-500", disabled: "bg-gray-100 text-gray-400", ring: "error" };

export function PrimaryDangerButton(props: ButtonProps) {
  return <ButtonBase look={LOOK} {...props} />;
}
