"use client";
import { cx } from "@/lib/cx";
import { FeaturedIcon, type FeaturedIconColor } from "./FeaturedIcon";
import { TertiaryButton } from "./TertiaryButton";

export interface ModalHeaderProps {
  Alignment?: "Center" | "Left";
  Title: string;
  SupportingText?: string;
  FeaturedIcon?: boolean;
  FeaturedIconSwap?: string;
  FeaturedIconColor?: FeaturedIconColor;
  onClose?: () => void;
  onBack?: () => void;
  Divider?: boolean;
  id?: string;
}

export function ModalHeader({ Alignment = "Center", Title, SupportingText, FeaturedIcon: fi = true, FeaturedIconSwap, FeaturedIconColor = "Brand", onClose, onBack, Divider, id }: ModalHeaderProps) {
  const close = onClose && <TertiaryButton LeadingIconSwap="close-24-300-round" ButtonText={false} aria-label="ปิด" onClick={onClose} />;
  if (Alignment === "Left") {
    const row = (
      <div className={cx("flex items-center gap-2 px-6 pt-6", !Divider && "pb-4")}>
        {onBack && <TertiaryButton LeadingIconSwap="keyboard_arrow_left-20-400-round" ButtonText={false} aria-label="ย้อนกลับ" onClick={onBack} />}
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {fi && <FeaturedIcon Color={FeaturedIconColor} IconSwap={FeaturedIconSwap} />}
          <div className="flex min-w-0 flex-col gap-1">
            <h2 id={id} className="text-lg font-semibold text-black">{Title}</h2>
            {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
          </div>
        </div>
        {close}
      </div>
    );
    if (!Divider) return row;
    return <div className="pb-4">{row}<div className="pt-5"><div className="h-px bg-gray-300" /></div></div>;
  }
  return (
    <div className="relative flex flex-col items-center gap-4 px-6 pt-6 pb-4 text-center">
      {fi && <FeaturedIcon Color={FeaturedIconColor} IconSwap={FeaturedIconSwap} />}
      <div className="flex flex-col items-center gap-1">
        <h2 id={id} className="text-lg font-semibold text-black">{Title}</h2>
        {SupportingText && <p className="text-md text-gray-600">{SupportingText}</p>}
      </div>
      {close && <div className={cx("absolute top-4 right-4")}>{close}</div>}
    </div>
  );
}
