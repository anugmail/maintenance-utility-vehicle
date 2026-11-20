"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { BadgeOutline, type BadgeOutlineColor } from "./BadgeOutline";
import { PillOutline, type PillColor } from "./PillOutline";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { TertiaryButton } from "./TertiaryButton";

export interface PageHeaderProps {
  Breakpoint?: Breakpoint;
  Title: string;
  Badge?: [string, BadgeOutlineColor];
  Pill?: [string, PillColor];
  SupportingText?: string;
  onBack?: () => void;
  crumbs?: Crumb[];
  Actions?: ReactNode;
  className?: string;
}

export function PageHeader({ Breakpoint: bp, Title, Badge, Pill, SupportingText, onBack, crumbs, Actions, className }: PageHeaderProps) {
  const b = useBreakpoint(bp);
  if (b === "Mobile") {
    return (
      <div className={cx("flex flex-col gap-4", className)}>
        <div className="flex gap-2">
          {onBack && <TertiaryButton LeadingIconSwap="keyboard_arrow_left-20-400-round" ButtonText={false} aria-label="ย้อนกลับ" onClick={onBack} />}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex min-h-10 flex-wrap items-center gap-3">
              <h1 className="text-lg font-semibold text-black">{Title}</h1>
              {Pill ? <PillOutline Text={Pill[0]} Color={Pill[1]} /> : Badge && <BadgeOutline Text={Badge[0]} Color={Badge[1]} />}
            </div>
            {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
          </div>
        </div>
        {Actions && <div className="flex gap-4 [&>*]:flex-1">{Actions}</div>}
      </div>
    );
  }
  return (
    <div className={cx("flex flex-col gap-6", className)}>
      {crumbs && <Breadcrumbs links={crumbs} />}
      <div className="flex items-end gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-title font-semibold text-black">{Title}</h1>
            {Pill ? <PillOutline Text={Pill[0]} Color={Pill[1]} /> : Badge && <BadgeOutline Text={Badge[0]} Color={Badge[1]} />}
          </div>
          {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
        </div>
        {Actions && <div className="flex shrink-0 gap-3">{Actions}</div>}
      </div>
    </div>
  );
}
