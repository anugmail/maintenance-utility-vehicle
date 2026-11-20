"use client";
import Link from "next/link";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export interface Crumb { Text: string; href?: string; onClick?: () => void }

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
