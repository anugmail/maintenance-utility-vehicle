/* Figma: "Status" — ไฟล์ (Component) VMS Plus หน้า Header navigation (node 2:4) · สเปก figma-spec/Status.json
   จุดสถานะในรายการแจ้งเตือน · variant: State = Success | Warning | Error | Brand | Info
   ค่า: วงกลม 12 · Success success-600 · Warning warning-600 · Error error-500 · Brand brand-900 · Info info-600 (hex ตรง token ทุกตัว) */
import { cx } from "@/lib/cx";

export type StatusState = "Success" | "Warning" | "Error" | "Brand" | "Info";
const BG: Record<StatusState, string> = { Success: "bg-success-600", Warning: "bg-warning-600", Error: "bg-error-500", Brand: "bg-brand-900", Info: "bg-info-600" };

export function Status({ State = "Brand", className }: { State?: StatusState; className?: string }) {
  return <span aria-hidden="true" className={cx("inline-block size-3 shrink-0 rounded-pill", BG[State], className)} />;
}
