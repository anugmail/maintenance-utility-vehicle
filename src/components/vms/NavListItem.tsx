"use client";
import Link from "next/link";
import { cx } from "@/lib/cx";
import { navBg, type NavState } from "./NavItem";
import { PillColor } from "./PillColor";

export interface NavListItemProps {
  Text: string;
  State?: NavState;
  Badge?: boolean;
  BadgeText?: string;
  href?: string;
  onClick?: () => void;
}

export function NavListItem({ Text, State = "Default", Badge, BadgeText = "1", href, onClick }: NavListItemProps) {
  const off = State === "Disabled";
  const cls = cx(
    "flex h-10 w-full shrink-0 items-center gap-1 rounded-md py-2 pr-4 pl-10 text-left text-sm",
    navBg(State),
    off ? "cursor-not-allowed text-gray-400" : cx("cursor-pointer hover:bg-gray-200", State === "Active" ? "text-brand-900" : "text-black"),
  );
  const inner = (
    <>
      <span className="min-w-0 flex-1">{Text}</span>
      {Badge && <PillColor Text={BadgeText} Color={off ? "Disabled" : "Brand"} />}
    </>
  );
  if (href && !off) return <Link href={href} aria-current={State === "Active" ? "page" : undefined} className={cls}>{inner}</Link>;
  return <button type="button" disabled={off} onClick={onClick} className={cls}>{inner}</button>;
}
