"use client";
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
