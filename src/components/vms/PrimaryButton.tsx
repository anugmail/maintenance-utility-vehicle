"use client";
import { ButtonBase, type ButtonProps, type Look } from "./_button";

const LOOK: Look = { base: "bg-brand-900 text-white", hover: "bg-brand-800 text-white", hoverCls: "hover:bg-brand-800", disabled: "bg-gray-100 text-gray-400", ring: "brand" };

export function PrimaryButton(props: ButtonProps) {
  return <ButtonBase look={LOOK} {...props} />;
}
