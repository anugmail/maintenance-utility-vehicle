"use client";
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "text-brand-900", hover: "bg-gray-100 text-brand-900", hoverCls: "hover:bg-gray-100", disabled: "text-gray-400", tertiary: true };

export function TertiaryBrandButton(props: Omit<ButtonProps, "Size">) {
  return <ButtonBase look={LOOK} {...props} />;
}
