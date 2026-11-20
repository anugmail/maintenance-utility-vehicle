"use client";
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "text-error-600", hover: "bg-gray-200 text-error-700", hoverCls: "hover:bg-gray-200 hover:text-error-700", disabled: "text-gray-400", tertiary: true };

export function TertiaryDangerButton(props: Omit<ButtonProps, "Size">) {
  return <ButtonBase look={LOOK} {...props} />;
}
