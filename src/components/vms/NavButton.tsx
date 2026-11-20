"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface NavButtonProps {
  IconSwap: string | ReactNode;
  State?: "Active" | "Default" | "Disabled" | "Focused" | "Hover";
  Indicator?: boolean;
  Text: string;
  href?: string;
  onClick?: () => void;
}

export function NavButton({ IconSwap, State = "Default", Indicator, Text, href, onClick }: NavButtonProps) {
  const cls = cx(
    "relative inline-flex size-10 shrink-0 items-center justify-center rounded-md p-2",
    State === "Active" || State === "Hover" ? "bg-gray-200" : State === "Focused" ? "bg-gray-50" : "bg-white",
    State === "Disabled" ? "cursor-not-allowed text-gray-400" : State === "Active" ? "text-brand-900" : "cursor-pointer text-gray-500 hover:bg-gray-200",
  );
  const inner = (
    <>
      {typeof IconSwap === "string" ? <Ms name={IconSwap} size={24} /> : IconSwap}
      {Indicator && <span className={cx("absolute top-2 right-2 size-1.5 rounded-pill", State === "Disabled" ? "bg-gray-400" : "bg-brand-900")} />}
    </>
  );
  if (href && State !== "Disabled") return <Link href={href} aria-label={Text} aria-current={State === "Active" ? "page" : undefined} className={cls}>{inner}</Link>;
  return <button type="button" aria-label={Text} disabled={State === "Disabled"} onClick={onClick} className={cls}>{inner}</button>;
}
