"use client";
/* Figma: "Images" — ไฟล์ (Component) VMS Plus หน้า Images (node 2648:43267) · สเปก figma-spec/Images.json
   variant: Size = md (รัศมี 12) | sm (รัศมี 8) · Type = Image | Empty · property: Indicator pagination · Buttons (ปุ่มเลื่อน Icon button)
   ค่า: Image = พื้นภาพ (src) · Empty = พื้น gray-200 + ไอคอน imagesmode 48 (เติม) gray-300 กลางกรอบ
   ต้นแบบไม่มีไฟล์ภาพจริง → ไม่ส่ง src = Type Empty (ช่องภาพของไลบรารี) · ขนาดกำหนดจากที่วาง (className) เช่น gallery 175×156 */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export function Images({ Size = "sm", src, alt = "", className }: { Size?: "md" | "sm"; src?: string; alt?: string; className?: string }) {
  const r = Size === "md" ? "rounded-lg" : "rounded-md";
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={cx("object-cover", r, className)} />;
  }
  return (
    <div role="img" aria-label={alt || "ภาพ"} className={cx("flex items-center justify-center bg-gray-200", r, className)}>
      <Ms name="imagesmode-48-300-round-filled" size={48} className="text-gray-300" />
    </div>
  );
}
