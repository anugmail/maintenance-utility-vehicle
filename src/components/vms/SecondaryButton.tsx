"use client";
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "border border-gray-300 bg-white text-gray-600", hover: "border border-gray-300 bg-gray-200 text-gray-600", hoverCls: "hover:bg-gray-200", disabled: "border border-gray-200 bg-gray-100 text-gray-400", ring: "gray" };

export function SecondaryButton(props: ButtonProps) {
  return <ButtonBase look={LOOK} {...props} />;
}
