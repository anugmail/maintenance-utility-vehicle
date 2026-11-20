"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";
import { PillColor } from "./PillColor";

export type NavState = "Default" | "Hover" | "Active" | "Focused" | "Disabled";

export interface NavItemProps {
  Text: string;
  State?: NavState;
  LeadingIcon?: boolean;
  LeadingIconSwap?: string | ReactNode;
  TrailingIcon?: boolean;
  TrailingIconSwap?: string;
  Badge?: boolean;
  BadgeText?: string;
  ShowDescription?: boolean;
  SupportingText?: string;
  href?: string;
  onClick?: () => void;
  expanded?: boolean;
}

export const navBg = (s: NavState) => (s === "Hover" || s === "Active" ? "bg-gray-200" : s === "Focused" ? "bg-gray-50" : "bg-white");

export function NavItem({ Text, State = "Default", LeadingIcon = true, LeadingIconSwap = "crop_free-24-300-round", TrailingIcon = false, TrailingIconSwap = "keyboard_arrow_down-20-400-round", Badge, BadgeText = "1", ShowDescription, SupportingText, href, onClick, expanded }: NavItemProps) {
  const off = State === "Disabled";
  const cls = cx(
    "flex h-10 w-full shrink-0 items-center gap-2 rounded-md p-2 text-left",
    navBg(State),
    off ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-200",
    ShowDescription && SupportingText && "h-auto min-h-10",
  );
  const inner = (
    <>
      {LeadingIcon && (typeof LeadingIconSwap === "string"
        ? <Ms name={LeadingIconSwap} size={24} className={off ? "text-gray-400" : State === "Active" ? "text-brand-900" : "text-gray-500"} />
        : <span className="inline-flex size-6 shrink-0 items-center justify-center">{LeadingIconSwap}</span>)}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cx("text-sm font-semibold", off ? "text-gray-400" : State === "Active" ? "text-brand-900" : "text-black")}>{Text}</span>
        {ShowDescription && SupportingText && <span className={cx("text-xs", off ? "text-gray-400" : "text-gray-600")}>{SupportingText}</span>}
      </span>
      {Badge && <PillColor Text={BadgeText} Color={off ? "Disabled" : "Brand"} />}
      {TrailingIcon && <Ms name={TrailingIconSwap} size={20} className={off ? "text-gray-400" : "text-gray-500"} />}
    </>
  );
  if (href && !off) return <Link href={href} aria-current={State === "Active" ? "page" : undefined} className={cls}>{inner}</Link>;
  return <button type="button" disabled={off} aria-expanded={expanded} onClick={onClick} className={cls}>{inner}</button>;
}
