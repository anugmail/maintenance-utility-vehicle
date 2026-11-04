"use client";
/* Figma: "Radio text card" — ไฟล์ (Component) VMS Plus หน้า Radio button (node 2:17) · สเปก figma-spec/Radio text card.json
   variant: State = Default | Hover | Focused | Disabled · Selected = False | True · property: Text · Supporting · Supporting text
   ค่า: กว้างตั้งต้น 240 (FILL ในแถว) · ขอบใน 16 · รัศมี 8 · พื้น white · ขอบ 1 gray-300 (Selected ขอบ 2 brand-900)
        Hover/Focused ขอบ brand-800 (Focused + วงโฟกัส 4 brand-900 ทึบ 12%) · Disabled พื้น gray-50 ขอบ gray-300 ตัวอักษร gray-400
        Content: Radio button + Text and supporting text ช่องไฟ 12 · Text 16 SemiBold black · Supporting text 14 Regular gray-600 ห่าง 4
   ใช้แบบ radioPick() ใน core.js: desktop แถวเดียว ช่องไฟ 16 การ์ดกว้าง/สูงเท่ากัน · มือถือ เรียงลง ช่องไฟ 12 (ห่อเองด้วย RadioTextCards) */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { RadioDot } from "./RadioButton";

export type CardState = "Default" | "Hover" | "Focused" | "Disabled";

export function cardTone(Selected: boolean, State: CardState) {
  if (State === "Disabled") return cx("cursor-not-allowed bg-gray-50 border-gray-300", Selected ? "border-2 p-[15px]" : "border");
  return cx("cursor-pointer bg-white focus-visible:outline-none focus-visible:shadow-ring",
    Selected ? "border-2 p-[15px]" : "border",
    State === "Hover" || State === "Focused" ? "border-brand-800" : Selected ? "border-brand-900 hover:border-brand-800" : "border-gray-300 hover:border-brand-800",
    State === "Focused" && "shadow-ring");
}

export interface RadioTextCardProps {
  Text: ReactNode;
  SupportingText?: ReactNode;
  Selected?: boolean;
  State?: CardState;
  onClick?: () => void;
  /** ข้อความ 14 (ค่า override ของ instance ในการ์ด ReceiptChecklistCard / InspectionChecklistCard ไฟล์ Maintain-D) */
  compact?: boolean;
  className?: string;
}

export function RadioTextCard({ Text, SupportingText, Selected = false, State = "Default", onClick, compact, className }: RadioTextCardProps) {
  const off = State === "Disabled";
  return (
    <button type="button" role="radio" aria-checked={Selected} disabled={off} onClick={onClick}
      className={cx("group flex min-w-0 flex-col gap-4 rounded-md p-4 text-left", cardTone(Selected, State), className)}>
      <span className={cx("flex gap-3", compact && "items-center")}>
        <RadioDot Selected={Selected} State={off ? "Disabled" : "Default"} interactive={false} />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={cx(compact ? "text-sm" : "text-md", "font-semibold", off ? "text-gray-400" : "text-black")}>{Text}</span>
          {SupportingText && <span className={cx("text-sm", off ? "text-gray-400" : "text-gray-600")}>{SupportingText}</span>}
        </span>
      </span>
    </button>
  );
}

/* แถวการ์ดตาม radioPick(): desktop แถวเดียว ช่องไฟ 16 กว้าง/สูงเท่ากัน · มือถือ เรียงลง ช่องไฟ 12 · row=true บังคับแถวเดียวบนมือถือ (คะแนน 1–5 ช่องไฟ 8 · การ์ด มี/ไม่มี) */
export function RadioTextCards({ options, value, onChange, Breakpoint: bp, row, Disabled, className }: {
  options: { Text: string; SupportingText?: string }[]; value?: string | null; onChange?: (v: string) => void;
  Breakpoint?: Breakpoint; row?: boolean; Disabled?: boolean; className?: string;
}) {
  const mob = useBreakpoint(bp) === "Mobile";
  return (
    <div role="radiogroup" className={cx("flex", mob && !row ? "flex-col gap-3" : cx("[&>*]:flex-1 [&>*]:basis-0", mob ? "gap-2" : "gap-4"), className)}>
      {options.map((o) => <RadioTextCard key={o.Text} Text={o.Text} SupportingText={o.SupportingText} Selected={o.Text === value} State={Disabled ? "Disabled" : "Default"} onClick={() => onChange?.(o.Text)} />)}
    </div>
  );
}
