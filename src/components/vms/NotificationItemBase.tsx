"use client";
/* Figma: "_Notification item base" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/_Notification item base.json
   แถวแจ้งเตือนใน Notification card · property: Show status (Status) · Text · Supporting text (เวลา) · Show button (Secondary button — ปิดตาม fillNotiItem())
   ค่า: ขอบใน 12 · ช่องไฟ 8 · เส้นล่าง 1 gray-200 · Status 12 (ขอบในบน 5) · Text 14 Regular black · Supporting text 12 gray-600 ห่าง 4 · ปุ่มห่าง 12 */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Status, type StatusState } from "./Status";

export function NotificationItemBase({ Text, SupportingText, StatusState, Button, onClick }: { Text: ReactNode; SupportingText?: string; StatusState?: StatusState; Button?: ReactNode; onClick?: () => void }) {
  return (
    <div onClick={onClick} className={cx("flex gap-2 border-b border-gray-200 p-3", onClick && "cursor-pointer hover:bg-gray-50")}>
      {StatusState && <span className="flex shrink-0 pt-[5px]"><Status State={StatusState} /></span>}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-black">{Text}</p>
          {SupportingText && <p className="text-xs text-gray-600">{SupportingText}</p>}
        </div>
        {Button && <div className="flex">{Button}</div>}
      </div>
    </div>
  );
}
