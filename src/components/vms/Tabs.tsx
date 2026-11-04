/* Figma: "Tabs" — ไฟล์ (Component) VMS Plus หน้า Tabs (node 2:9) · สเปก figma-spec/Tabs.json
   แถว Tab item (ไลบรารีมี 5 ช่อง ซ่อนช่องที่เกินตาม tabs() ใน screens.js) · พื้น white เส้นล่าง gray-300 · มือถือเลื่อนแนวนอน */
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export function Tabs({ children, className }: { children: ReactNode; className?: string }) {
  return <div role="tablist" className={cx("flex overflow-x-auto border-b border-gray-300 bg-white", className)}>{children}</div>;
}
