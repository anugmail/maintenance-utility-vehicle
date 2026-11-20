import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";
import { linkPlate } from "@/components/patterns/PlateLink";

export type ContentItemType = "Text" | "Text with label" | "Attachment" | "Big" | "Component swap";

export interface ContentItemBaseProps {
  Type?: ContentItemType;
  Label?: ReactNode;
  Text?: ReactNode;
  SupportingText?: ReactNode;
  LeadingIconSwap?: string;
  InstanceSwap?: ReactNode;
  className?: string;
}

export function ContentItemBase({ Type = "Text with label", Label, Text, SupportingText, LeadingIconSwap, InstanceSwap, className }: ContentItemBaseProps) {
  const icon = LeadingIconSwap && <Ms name={LeadingIconSwap} size={24} className="text-brand-900" />;
  if (Type === "Text") {
    return (
      <div className={cx("flex min-w-0 items-center gap-2 text-md", className)}>
        {icon}<span className="text-black">{linkPlate(Text)}</span>{SupportingText && <span className="text-gray-600">{SupportingText}</span>}
      </div>
    );
  }
  const big = Type === "Big";
  return (
    <div className={cx("flex min-w-0 gap-2", className)}>
      {icon}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <span className={cx("font-semibold break-words text-black", big ? "text-lg" : "text-md")}>{Label}</span>
        {Type === "Component swap" ? <span className="flex">{InstanceSwap}</span>
          : <span className={cx("break-words", big ? "text-lg" : "text-md", Type === "Attachment" ? "text-info-700 underline-offset-2 hover:underline" : "text-black")}>{linkPlate(Text)}</span>}
      </div>
    </div>
  );
}
