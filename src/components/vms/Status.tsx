import { cx } from "@/lib/cx";

export type StatusState = "Success" | "Warning" | "Error" | "Brand" | "Info";
const BG: Record<StatusState, string> = { Success: "bg-success-600", Warning: "bg-warning-600", Error: "bg-error-500", Brand: "bg-brand-900", Info: "bg-info-600" };

export function Status({ State = "Brand", className }: { State?: StatusState; className?: string }) {
  return <span aria-hidden="true" className={cx("inline-block size-3 shrink-0 rounded-pill", BG[State], className)} />;
}
