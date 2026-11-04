"use client";
/* Figma: "Background overlay" — ไฟล์ (Component) VMS Plus หน้า Background overlay (node 2428:4927) · สเปก figma-spec/Background overlay.json
   สี่เหลี่ยมเต็มจอ พื้น black ทึบ 40% (paint ในดัมป์ · Variable Color/background/overlay) = token --overlay (bg-overlay) */
import { cx } from "@/lib/cx";

export function BackgroundOverlay({ onClick, className }: { onClick?: () => void; className?: string }) {
  return <div aria-hidden="true" onClick={onClick} className={cx("fixed inset-0 z-40 bg-overlay animate-fade-in", className)} />;
}
