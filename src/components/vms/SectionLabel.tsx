"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface SectionLabelProps {
  Title: string;
  SupportingText?: string;
  Actions?: ReactNode;
  className?: string;
}

export function SectionLabel({ Title, SupportingText, Actions, className }: SectionLabelProps) {
  return (
    <div className={cx("flex items-center gap-3", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-md font-semibold text-black">{Title}</h3>
        {SupportingText && <p className="text-xs text-gray-600">{SupportingText}</p>}
      </div>
      {Actions && <div className="flex shrink-0 items-center">{Actions}</div>}
    </div>
  );
}
