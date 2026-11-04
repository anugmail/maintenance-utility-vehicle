"use client";
/* Figma: "Nav button" — ไฟล์ (Component) VMS Plus หน้า Sidebar navigation (node 2:2) · สเปก figma-spec/Nav button.json
   variant: State = Active | Default | Disabled | Focused | Hover · property: Icon swap · Indicator · Text (tooltip ตอน Hover)
   ค่า: 40×40 · ขอบใน 8 · รัศมี 8 · พื้น white (Active/Hover gray-200 · Focused gray-50) · ไอคอน 24 gray-500 (Active brand-900 · Disabled gray-400)
        Icon swap ในหน้าจอ UI Release#2 "Sidebar Navigation" (277:230639) สลับเป็น Avatar ที่ปุ่มผู้ใช้
        Indicator จุด 6 brand-900 (Disabled gray-400) — แสดงเมื่อ Indicator=true (เช่นกระดิ่งมีแจ้งเตือนใหม่ ตาม bell() ใน screens.js) */
import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface NavButtonProps {
  /** property Icon swap — ชื่อไอคอน หรือ element (ปุ่มผู้ใช้ใน Footer menu สลับเป็น Avatar) */
  IconSwap: string | ReactNode;
  State?: "Active" | "Default" | "Disabled" | "Focused" | "Hover";
  Indicator?: boolean;
  /** property Text — ป้ายบอก (title / aria-label) */
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
