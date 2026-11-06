/* Figma: "Metric item" — ไฟล์ (Component) VMS Plus หน้า Metrics (node 2011:13829) · สเปก figma-spec/Metric item.json
   variant: Breakpoint = Desktop | Mobile · property: Number · Text · Featured icon (instance ซ้อน · Color ตั้งได้แบบ metric() ใน screens.js)
   Desktop: กว้าง FILL สูง 156 · ขอบใน 20/16 · ช่องไฟ 20 (SPACE_BETWEEN) · รัศมี 12 (Radius/300) · พื้น white (Color/surface/primary) · ขอบ 1 gray-300 (Color/border/primary)
            Icon and text = Featured icon Size=md (48) + Text 16 SemiBold black ช่องไฟ 12 · Number 32 SemiBold black (IBM/Headline/03)
   Mobile: 156×104 (ในแถวยืดเต็มช่อง) · ขอบใน 12 · ช่องไฟ 12 · Icon and text = Text 14 SemiBold black (ซ้าย) + Featured icon Size=sm (36 · ขวา) ช่องไฟ 8 · Number 20 SemiBold (IBM/Title/01)
   Featured icon ค่าตั้งต้นของไลบรารี Color=Info ไอคอน info-24-300-round · แดชบอร์ด S4 ใช้ Brand / Success ตาม DASH_METRICS (ไอคอนคงเดิม) */
import { cx } from "@/lib/cx";
import { useBreakpoint, type Breakpoint } from "@/lib/useBreakpoint";
import { FeaturedIcon, type FeaturedIconColor } from "./FeaturedIcon";

export interface MetricItemProps {
  Breakpoint?: Breakpoint;
  Number: string | number;
  Text: string;
  /** Color ของ Featured icon ที่ซ้อนอยู่ (ค่าตั้งต้นของไลบรารี Info) */
  FeaturedIconColor?: FeaturedIconColor;
  /** Icon swap ของ Featured icon ที่ซ้อนอยู่ */
  IconSwap?: string;
  className?: string;
}

export function MetricItem({ Breakpoint: bp, Number: num, Text, FeaturedIconColor = "Info", IconSwap, className }: MetricItemProps) {
  const mob = useBreakpoint(bp) === "Mobile";
  if (mob) {
    return (
      <div className={cx("flex min-h-[104px] min-w-0 flex-col justify-between gap-3 rounded-lg border border-gray-300 bg-white p-3", className)}>
        <div className="flex items-start gap-2">
          <span className="min-w-0 flex-1 text-sm font-semibold text-black">{Text}</span>
          <FeaturedIcon Color={FeaturedIconColor} Size="sm" IconSwap={IconSwap} />
        </div>
        <span className="text-lg font-semibold text-black">{num}</span>
      </div>
    );
  }
  return (
    <div className={cx("flex min-h-[156px] min-w-0 flex-col justify-between gap-5 rounded-lg border border-gray-300 bg-white px-4 py-5", className)}>
      <div className="flex items-center gap-3">
        <FeaturedIcon Color={FeaturedIconColor} Size="md" IconSwap={IconSwap} />
        <span className="min-w-0 flex-1 text-md font-semibold text-black">{Text}</span>
      </div>
      <span className="text-title font-semibold text-black">{num}</span>
    </div>
  );
}
