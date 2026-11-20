"use client";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";
import { TertiaryButton } from "./TertiaryButton";

export type AlertColor = "Brand" | "Success" | "Warning" | "Error" | "Info" | "Gray";

const LOOK: Record<AlertColor, [string, string, string]> = {
  Brand: ["bg-brand-50 border-brand-200", "info-20-300-round-fill", "text-brand-800"],
  Success: ["bg-success-50 border-success-200", "check_circle-20-300-round-fill", "text-success-600"],
  Warning: ["bg-warning-50 border-warning-200", "warning_circle-20-300-round-fill", "text-warning-600"],
  Error: ["bg-error-50 border-error-200", "cancel_circle-20-300-round-fill", "text-error-500"],
  Info: ["bg-info-50 border-info-200", "info-20-300-round-fill", "text-info-600"],
  Gray: ["bg-gray-50 border-gray-300", "info-20-300-round-fill", "text-gray-500"],
};

export function Alert({ Color = "Brand", Text, SupportingText, LeadingIcon = true, onClose, className }: { Color?: AlertColor; Text: string; SupportingText?: string; LeadingIcon?: boolean; onClose?: () => void; className?: string }) {
  const [box, icon, ic] = LOOK[Color];
  return (
    <div role="status" className={cx("flex items-center gap-3 rounded-md border p-3", box, className)}>
      {LeadingIcon && <Ms name={icon} size={24} className={ic} />}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-md font-semibold text-black">{Text}</p>
        {SupportingText && <p className="text-sm text-gray-600">{SupportingText}</p>}
      </div>
      {onClose && <TertiaryButton LeadingIconSwap="close-24-300-round" ButtonText={false} aria-label="ปิด" onClick={onClose} />}
    </div>
  );
}
