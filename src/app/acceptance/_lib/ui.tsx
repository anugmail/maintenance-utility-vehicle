"use client";
import { ButtonBase, type ButtonProps, type Look } from "@/components/vms/_button";

const ACK_LOOK: Look = { base: "bg-success-600 text-white", hover: "bg-success-600 text-white", hoverCls: "hover:bg-success-600", disabled: "bg-gray-100 text-gray-400", ring: "brand" };

export function AckButton(props: ButtonProps) {
  return <ButtonBase look={ACK_LOOK} Text="รับทราบ" LeadingIconSwap="check-24-300-round" {...props} />;
}
