"use client";
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "text-gray-600", hover: "bg-gray-100 text-gray-700", hoverCls: "hover:bg-gray-100 hover:text-gray-700", disabled: "text-gray-400", tertiary: true };

export function TertiaryButton(props: Omit<ButtonProps, "Size">) {
  return <ButtonBase look={LOOK} {...props} />;
}
