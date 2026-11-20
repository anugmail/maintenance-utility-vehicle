"use client";
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
