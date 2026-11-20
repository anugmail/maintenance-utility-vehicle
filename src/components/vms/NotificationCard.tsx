"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { BadgeOutline } from "./BadgeOutline";
import { PrimaryButton } from "./PrimaryButton";

export function NotificationCard({ Badge, children, Header = true, Footer = true, FooterText = "ลบข้อความแจ้งเตือนทั้งหมด", onFooter, className }: {
  Badge?: string; children: ReactNode; Header?: boolean; Footer?: boolean; FooterText?: string; onFooter?: () => void; className?: string;
}) {
  return (
    <div className={cx("flex w-[314px] max-w-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg-lib", className)}>
      {Header && (
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 p-3">
          <span className="text-[18px] leading-[27px] font-semibold text-black">แจ้งเตือน</span>
          {Badge && <BadgeOutline Text={Badge} Color="Gray" />}
        </div>
      )}
      <div className="flex max-h-100 flex-col overflow-y-auto">{children}</div>
      {Footer && <div className="border-t border-gray-200 p-3"><PrimaryButton Text={FooterText} className="w-full" onClick={onFooter} /></div>}
    </div>
  );
}
