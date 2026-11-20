"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";

export function PartRequestStepPanel({ Inventory, Requested, Breakpoint: bp, className }: { Inventory: ReactNode; Requested: ReactNode; Breakpoint?: Breakpoint; className?: string }) {
  const mob = useBreakpoint(bp) === "Mobile";
  return (
    <div className={cx("flex gap-4", mob ? "flex-col" : "items-start", className)}>
      <div className={mob ? undefined : "w-[421px] shrink-0"}>{Inventory}</div>
      <div className="min-w-0 flex-1">{Requested}</div>
    </div>
  );
}
