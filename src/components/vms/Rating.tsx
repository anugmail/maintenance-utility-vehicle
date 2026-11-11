"use client";
/* Figma: "Rating" — ไฟล์ (Component) VMS Plus หน้า Rating (node 107:2628) · สเปก figma-spec/Rating.json + figma-spec/_Rating star base.json
   variant: Point = 0 | 0.5 | 1 | … | 5 · ลูก = "_Rating star base" ×5 (Fill = Full | Half | Empty · State = Default | Hover)
   ค่า: แถวแนวนอน กว้าง 240 สูง 48 ไม่มีช่องไฟ · ดาวละ 48×48 ไอคอน star-48-300-round-fill
        Full = Color/component/utility/warning/500 (= token warning-600) · Empty = Color/icon/tertiary (= token gray-300) · Hover สีเดียวกับ Default
   ใช้แบบฟอร์มประเมินผู้รับจ้าง (contractor-eval-plugin question()): Input label แล้ว Rating ใต้ข้อความ · ดาวเริ่มว่าง (Point=0)
   onChange = กดดาวที่ n ⇒ Point=n · ไม่ส่ง onChange = แสดงผลอย่างเดียว · Point ครึ่งดวงแสดงได้ (Half) แต่การกดให้ค่าเต็มดวง */
import { cx } from "@/lib/cx";
import { Ms } from "./Ms";

export function Rating({ Point = 0, onChange, label, className }: { Point?: number; onChange?: (n: number) => void; label?: string; className?: string }) {
  const fill = (i: number) => (Point >= i ? "Full" : Point >= i - 0.5 ? "Half" : "Empty");
  return (
    <div role={onChange ? "radiogroup" : "img"} aria-label={label ? label + (onChange ? "" : " " + Point + " จาก 5") : undefined} className={cx("flex h-12 w-60 items-center", className)}>
      {[1, 2, 3, 4, 5].map((i) => {
        const f = fill(i);
        const star = f === "Half"
          ? <span className="relative inline-flex"><Ms name="star-48-300-round-fill" size={48} className="text-gray-300" /><span className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"><Ms name="star-48-300-round-fill" size={48} className="text-warning-600" /></span></span>
          : <Ms name="star-48-300-round-fill" size={48} className={f === "Full" ? "text-warning-600" : "text-gray-300"} />;
        return onChange ? (
          <button key={i} type="button" role="radio" aria-checked={Point === i} aria-label={String(i)} onClick={() => onChange(i)}
            className="inline-flex size-12 cursor-pointer items-center justify-center rounded-sm focus-visible:shadow-ring focus-visible:outline-none" data-star={i}>{star}</button>
        ) : <span key={i} className="inline-flex size-12 items-center justify-center" data-star={i}>{star}</span>;
      })}
    </div>
  );
}
