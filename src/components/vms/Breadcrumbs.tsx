"use client";
/* Figma: "Breadcrumbs" — ไฟล์ (Component) VMS Plus หน้า Breadcrumbs (node 2:7) · สเปก figma-spec/Breadcrumbs.json + _Breadcrumbs item / Link.json
   โครง: Home (home 20 gray-600) · Link 1–3 · Truncate link (ซ่อน) · Current link — คั่นด้วย keyboard_arrow_right 20 gray-300 ช่องไฟ 4
   _Breadcrumbs item / Link: ขอบใน 4 · 12 Regular · Current=False gray-600 (Hover gray-700) · Current=True brand-900 */
import Link from "next/link";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface Crumb { Text: string; href?: string; /** กดแล้วถามก่อนออก (ฟอร์มที่แก้ค้าง) แทนการไปทันที */ onClick?: () => void }

export function Breadcrumbs({ links, homeHref = "/", className }: { links: Crumb[]; homeHref?: string; className?: string }) {
  return (
    <nav aria-label="breadcrumb" className={cx("flex flex-wrap items-center gap-1", className)}>
      <Link href={homeHref} aria-label="หน้าแรก" className="inline-flex text-gray-600"><Ms name="home-20-300-round" size={20} /></Link>
      {links.map((l, i) => {
        const cur = i === links.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            <Ms name="keyboard_arrow_right-20-300-round" size={20} className="text-gray-300" />
            {cur || (!l.href && !l.onClick)
              ? <span aria-current={cur ? "page" : undefined} className={cx("p-1 text-xs", cur ? "text-brand-900" : "text-gray-600")}>{l.Text}</span>
              : l.onClick
                ? <button type="button" onClick={l.onClick} className="cursor-pointer p-1 text-xs text-gray-600 hover:text-gray-700">{l.Text}</button>
                : <Link href={l.href ?? "/"} className="p-1 text-xs text-gray-600 hover:text-gray-700">{l.Text}</Link>}
          </span>
        );
      })}
    </nav>
  );
}
