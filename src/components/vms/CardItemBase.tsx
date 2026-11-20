import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export type CardItemType = "Text" | "Text with supporting" | "Text with component" | "Text with label" | "Text with label and component" | "Vertical text with label";

export interface CardItemBaseProps {
  Type?: CardItemType;
  LeadingIcon?: boolean;
  IconSwap?: string;
  Label?: ReactNode;
  Text?: ReactNode;
  SupportingText?: ReactNode;
  InstanceSwap?: ReactNode;
  TextAlign?: "Left" | "Right";
  className?: string;
}

export function CardItemBase({ Type = "Text", LeadingIcon = true, IconSwap = "crop_free-24-300-round", Label, Text, SupportingText, InstanceSwap, TextAlign = "Left", className }: CardItemBaseProps) {
  const icon = LeadingIcon && <Ms name={IconSwap} size={24} className="shrink-0 text-brand-900" />;
  const label = <span className="min-w-0 flex-1 text-sm font-semibold break-words text-black">{Label}</span>;
  const text = <span className={cx("min-w-0 text-sm break-words text-black", (Type === "Text with label" || Type === "Text") && "flex-1", TextAlign === "Right" && "text-right")}>{Text}</span>;
  if (Type === "Vertical text with label") {
    return (
      <div className={cx("flex min-w-0 items-start gap-2", className)}>
        {icon}
        <div className="flex min-w-0 flex-1 flex-col gap-1">{label}{text}</div>
      </div>
    );
  }
  return (
    <div className={cx("flex min-h-6 min-w-0 items-center gap-2", className)}>
      {icon}
      {Type !== "Text" && Type !== "Text with supporting" && Type !== "Text with component" && label}
      {Type === "Text with label and component" && <span className="flex shrink-0">{InstanceSwap}</span>}
      {text}
      {Type === "Text with supporting" && <span className="min-w-0 flex-1 text-sm text-gray-600">{SupportingText}</span>}
      {Type === "Text with component" && <span className="flex shrink-0">{InstanceSwap}</span>}
    </div>
  );
}
