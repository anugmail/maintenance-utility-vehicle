"use client";
import type { ReactNode } from "react";
import { SecondaryButton } from "@/components/vms/SecondaryButton";
import { SectionHeader } from "@/components/vms/SectionHeader";
import { cx } from "@/lib/cx";
import { baht } from "./SparePartCardItem";

export function RequestedPartsPanel({ Title = "อะไหล่ที่ต้องการใช้งาน", SupportingText, Badge, children, onAddManual, costs, className }: {
  Title?: string; SupportingText?: string; Badge?: string | number | null;
  children?: ReactNode;
  onAddManual?: () => void;
  costs: [string, number][];
  className?: string;
}) {
  const total = costs.reduce((a, [, n]) => a + n, 0);
  const filled = !!children && (!Array.isArray(children) || children.length > 0);
  return (
    <div className={cx("flex min-w-0 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-[17px]", className)}>
      <SectionHeader Title={Title} SupportingText={SupportingText} Badge={Badge} Breakpoint="Desktop" />
      {filled ? <div className="flex flex-col gap-4">{children}</div> : (
        <div className="flex flex-col items-center justify-center gap-1 py-16 text-center">
          <p className="text-md font-semibold text-black">ยังไม่ได้เพิ่มอะไหล่</p>
          <p className="text-xs text-gray-600">กรุณาเลือกอะไหล่จากคลังอะไหล่หรือระบุอะไหล่เพิ่มเติม</p>
        </div>
      )}
      <div className="flex"><SecondaryButton Text="ระบุอะไหล่เพิ่มเติม" Size="lg" LeadingIconSwap="add-24-300-round" onClick={onAddManual} /></div>
      <div className="flex flex-col gap-4 border-t border-gray-200 pt-4">
        <SectionHeader Title="รวมค่าอะไหล่" Breakpoint="Desktop" />
        <div className="flex flex-col gap-2">
          {costs.map(([k, n]) => <div key={k} className="flex gap-4 text-sm text-gray-600"><span className="flex-1">{k}</span><span className="flex-1 font-semibold">{baht(n)}</span></div>)}
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold text-gray-600"><span className="flex-1">รวมทั้งหมด</span><span className="flex-1">{baht(total)}</span></div>
      </div>
    </div>
  );
}
