/* Figma: "Progress bar" — ไฟล์ (Component) VMS Plus หน้า Progress bar (node 2843:13902) · สเปก figma-spec/Progress bar.json
   variant: Label = Right (ที่ต้นแบบใช้) | Top left · Progress = 0%…100% (ต้นแบบรับตัวเลขใดก็ได้ 0–100) · Size = md · property: Percentage
   ค่า: Label=Right: แถบ + ตัวเลข ช่องไฟ 8 · แถบสูง 8 รัศมี 9999 · ราง gray-300 · แถบ brand-900 · ตัวเลข 14 Regular gray-600 ชิดขวา กว้าง 40
   ในรายการไฟล์ (_File upload item base State=Completed) แถบ 100% เป็นสีเขียว success-500 → Color="Success" */
import { cx } from "@/lib/cx";

export function ProgressBar({ Progress, Percentage = true, Color = "Brand", className }: { Progress: number; Percentage?: boolean; Color?: "Brand" | "Success"; className?: string }) {
  const p = Math.max(0, Math.min(100, Math.round(Progress)));
  return (
    <div className={cx("flex items-center gap-2", className)} role="progressbar" aria-valuenow={p} aria-valuemin={0} aria-valuemax={100}>
      <div className="relative h-2 min-w-0 flex-1 overflow-hidden rounded-pill bg-gray-300">
        {p > 0 && <div className={cx("absolute inset-y-0 left-0 rounded-pill", Color === "Success" ? "bg-success-500" : "bg-brand-900")} style={{ width: p + "%" }} />}
      </div>
      {Percentage && <span className="w-10 shrink-0 text-right text-sm text-gray-600">{p}%</span>}
    </div>
  );
}
