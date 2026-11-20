"use client";
import { cx } from "@/lib/cx";

export function BackgroundOverlay({ onClick, className }: { onClick?: () => void; className?: string }) {
  return <div aria-hidden="true" onClick={onClick} className={cx("fixed inset-0 z-40 bg-overlay animate-fade-in", className)} />;
}
