/* Figma: "Mobile progress steps" (Collapsed=True) + "Step circles / 4 steps" — ไฟล์ (Component) VMS Plus หน้า Progress steps · สเปก figma-spec/Mobile progress steps.json · figma-spec/Step circles _ 4 steps.json
   property: Text · Supporting · Supporting text · Stepper item swap (วง Step circles) · Collapsed=True (ใช้)
   กรอบ ขอบใน 16 ช่องไฟ 16 พื้น white ขอบ 1 gray-300 รัศมี 8 · วง 72 (Track gray-300 Color/component/progress/track · Progress brand-900 Color/component/progress/progress)
   ตัวเลขกลางวง "ปัจจุบัน / ทั้งหมด" 12 (ตัวเลข SemiBold black · "/" gray-400) · ข้อความขั้น 16 SemiBold black · "ถัดไป:" 12 SemiBold gray-600 + ชื่อขั้นถัดไป 12 gray-600
   mtStepper() ใน screens.js: 2 ขั้น = วง Step=2 (ครึ่ง) / Step=4 (เต็ม) แสดง 1/2 · 2/2 · ไอคอน keyboard_arrow_down ท้าย (Collapsed — ต้นแบบไม่กางรายการขั้น)
   วงความคืบหน้า = conic-gradient ตามสัดส่วน + วงในสีพื้น (ดัมป์ไม่มีข้อมูล arc ของ ellipse — COMPOSED.md) */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export function MobileProgressSteps({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  const pct = Math.round((current / steps.length) * 100);
  const next = steps[current];
  return (
    <div aria-label="ขั้นตอน" className={cx("flex items-center gap-4 rounded-md border border-gray-300 bg-white p-4", className)}>
      <span className="relative inline-flex size-18 shrink-0 items-center justify-center rounded-pill" style={{ background: `conic-gradient(var(--brand-900) 0 ${pct}%, var(--gray-300) 0)` }}>
        <span className="absolute inset-1.5 rounded-pill bg-white" />
        <span className="relative flex items-center gap-1 text-xs"><b className="font-semibold text-black">{current}</b><span className="text-gray-400">/</span><b className="font-semibold text-black">{steps.length}</b></span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <span className="text-md font-semibold text-black">{steps[current - 1]}</span>
        {next && <span className="flex items-center gap-1 text-xs text-gray-600"><b className="font-semibold">ถัดไป:</b>{next}</span>}
      </div>
      <Ms name="keyboard_arrow_down-20-400-round" size={20} className="text-gray-600" />
    </div>
  );
}
