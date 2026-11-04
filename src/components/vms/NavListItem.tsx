"use client";
/* Figma: "Nav list item" — ไฟล์ (Component) VMS Plus หน้า Sidebar navigation (node 2:2) · สเปก figma-spec/Nav list item.json
   เมนูย่อยใต้หัวกลุ่ม (Nav item) ใน "sub items" ของ Nav menu หน้า "Sidebar Navigation" (277:230639) ของ UI Release#2
   variant: State = Default | Hover | Active | Focused | Disabled · property: Text · Badge (Pill color)
   ค่า: กว้างเต็ม (248) สูง 40 · ขอบใน 8 / ซ้าย 40 / ขวา 16 · ช่องไฟ 4 · รัศมี 8 · พื้น white (Hover/Active gray-200 · Focused gray-50)
        Text 14 Regular black (Active brand-900 · Disabled gray-400) · Pill color Brand (Disabled = Color Disabled) */
import Link from "next/link";
import { cx } from "@/lib/cx";
import { navBg, type NavState } from "./NavItem";
import { PillColor } from "./PillColor";

export interface NavListItemProps {
  Text: string;
  State?: NavState;
  /** property Badge — แสดง Pill color */
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
