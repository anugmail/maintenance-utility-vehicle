"use client";
/* Figma: "Notification" — ไฟล์ (Component) VMS Plus หน้า Notifications (node 1873:44383) · สเปก figma-spec/Notification.json
   toast มุมล่างขวา (ตาม notify() ใน core.js: วางชิดขวาล่างของจอ · ปิด Supporting text และ Actions)
   variant: Type = Default | Success | Warning | Error | Info · Breakpoint = Desktop (กล่องกว้าง 400 · ขอบนอกบน/ขวา 24) | Mobile (กว้างเต็มลบขอบ 16)
   property: Text · Supporting text · Actions
   ค่า: ขอบใน 16 · ช่องไฟ 16 · รัศมี 12 · พื้น gray-950 · ขอบ 1 gray-dark-600 · ไอคอนทึบ 24 (Success/Default check_circle success-600 · Warning warning_circle warning-600 · Error cancel_circle error-500 · Info info info-600)
        หัวข้อ 16 SemiBold gray-dark-50 · Supporting 14 gray-dark-300 · ปุ่มปิด Tertiary button gray-dark-300 */
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
  /** true = วางลอยมุมจอ (toast) · false = แสดงในที่ (หน้า kit) */
  floating?: boolean;
}

export function Notification({ Type = "Success", Breakpoint: bp, Text, SupportingText, onClose, floating = true }: NotificationProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  const [icon, ic] = ICON[Type];
  return (
    <div role="status" aria-live="polite" className={cx(floating && "fixed z-[60] animate-fade-in", floating && (mob ? "inset-x-4 bottom-4" : "right-6 bottom-6"), mob ? "" : "w-[400px] max-w-full")}>
      <div className="flex gap-4 rounded-lg border border-gray-dark-600 bg-gray-950 p-4">
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
