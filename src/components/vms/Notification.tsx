"use client";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { Ms } from "./Ms";

export type NotificationType = "Default" | "Success" | "Warning" | "Error" | "Info";

const ICON: Record<NotificationType, [string, string]> = {
  Default: ["check_circle-20-300-round-fill", "text-success-600"],
  Success: ["check_circle-20-300-round-fill", "text-success-600"],
  Warning: ["warning_circle-20-300-round-fill", "text-warning-600"],
  Error: ["cancel_circle-20-300-round-fill", "text-error-500"],
  Info: ["info-20-300-round-fill", "text-info-600"],
};

export interface NotificationProps {
  Type?: NotificationType;
  Breakpoint?: Breakpoint;
  Text: string;
  SupportingText?: string;
  onClose?: () => void;
  floating?: boolean;
}

export function Notification({ Type = "Success", Breakpoint: bp, Text, SupportingText, onClose, floating = true }: NotificationProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  const [icon, ic] = ICON[Type];
  return (
    <div role="status" aria-live="polite" className={cx(floating && "fixed z-[60] animate-fade-in", floating && (mob ? "inset-x-4 bottom-4" : "right-6 bottom-6"), mob ? "" : "w-[400px] max-w-full")}>
      <div className="flex gap-4 rounded-lg border border-gray-dark-600 bg-gray-950 p-4 shadow-lg-lib">
        <div className="flex min-w-0 flex-1 gap-2 pr-8">
          <Ms name={icon} size={24} className={ic} />
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-md font-semibold text-gray-dark-50">{Text}</p>
            {SupportingText && <p className="text-sm text-gray-dark-300">{SupportingText}</p>}
          </div>
        </div>
        {onClose && (
          <button type="button" aria-label="ปิด" onClick={onClose} className="-m-2 inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-dark-300">
            <Ms name="close-24-300-round" size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
