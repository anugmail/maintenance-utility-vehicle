"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { BadgeOutline } from "./BadgeOutline";

export interface SectionHeaderProps {
  Breakpoint?: Breakpoint;
  Title: string;
  Badge?: string | number | null;
  SupportingText?: string;
  Actions?: ReactNode;
  className?: string;
}

export function SectionHeader({ Breakpoint: bp, Title, Badge, SupportingText, Actions, className }: SectionHeaderProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  return (
    <div className={cx("flex", mob ? "flex-col gap-5" : "items-start gap-3", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1 shrink-0 rounded-pill bg-brand-900" />
          <h2 className="text-lg font-semibold text-black">{Title}</h2>
          {Badge != null && Badge !== "" && <BadgeOutline Text={String(Badge)} Color="Gray" />}
        </div>
        {SupportingText && <p className="text-sm text-gray-600">{SupportingText}</p>}
      </div>
      {Actions && <div className={cx("flex shrink-0", mob ? "gap-4" : "gap-3")}>{Actions}</div>}
    </div>
  );
}
