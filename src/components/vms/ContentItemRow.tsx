"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ContentItemBase, type ContentItemBaseProps } from "./ContentItemBase";

export type KvPair = [ReactNode, ReactNode];

export function ContentItemRow({ items, perRow = 4, ColumnWidth = "Full", gap = "gap-6", className }: {
  items: (KvPair | ContentItemBaseProps)[]; perRow?: number; ColumnWidth?: "Full" | "50% first column" | "50% last column";
  gap?: "gap-6" | "gap-4"; className?: string;
}) {
  const cells = items.map((it, i) => (Array.isArray(it) ? <ContentItemBase key={i} Label={it[0]} Text={it[1]} /> : <ContentItemBase key={i} {...it} />));
  const pad = Array.from({ length: Math.max(0, perRow - cells.length) }, (_, i) => <span key={"pad" + i} aria-hidden="true" />);
  if (ColumnWidth !== "Full" && perRow > 1) {
    const [first, ...rest] = cells;
    const half = <div className={cx("grid min-w-0 flex-1 grid-cols-2", gap)}>{rest}</div>;
    return <div className={cx("flex", gap, className)}>{ColumnWidth === "50% first column" ? <><div className="min-w-0 flex-1">{first}</div>{half}</> : <>{half}<div className="min-w-0 flex-1">{first}</div></>}</div>;
  }
  return <div className={cx("grid", gap, perRow === 1 ? "grid-cols-1" : perRow === 2 ? "grid-cols-2" : perRow === 3 ? "grid-cols-3" : "grid-cols-4", className)}>{cells}{pad}</div>;
}
