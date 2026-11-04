"use client";
/* Figma: "_File upload base" — ไฟล์ (Component) VMS Plus หน้า File upload (node 2123:5261) · สเปก figma-spec/_File upload base.json
   กล่องเลือก/ลากไฟล์ใน File upload
   variant: State = Default | Hover | Focused | Disabled | Error · property: Supporting text
   ค่า: สูง 124 · ขอบใน 16 · รัศมี 8 · พื้น white ขอบ 1 gray-300 (Hover/Focused brand-800 · Error error-500 · Disabled พื้น gray-50)
        Featured icon Gray sm ไอคอน cloud_upload (Disabled = Color Disabled) → ข้อความ ห่าง 12 · "คลิกเพื่อเลือกไฟล์" 14 SemiBold brand-900 (Disabled gray-400)
        + "หรือลากไฟล์มาวางบริเวณนี้" 14 gray-600 ช่องไฟ 4 · Supporting text 12 gray-600 ห่าง 4 · จัดกลาง */
import { useRef } from "react";
import { cx } from "@/lib/cx";
import { FeaturedIcon } from "./FeaturedIcon";

export type FileUploadBaseState = "Default" | "Hover" | "Focused" | "Disabled" | "Error";

export function FileUploadBase({ State = "Default", SupportingText, accept, multiple = true, onFiles, className }: {
  State?: FileUploadBaseState; SupportingText?: string; accept?: string; multiple?: boolean; onFiles?: (files: File[]) => void; className?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const off = State === "Disabled";
  return (
    <div role="button" tabIndex={off ? -1 : 0} aria-disabled={off}
      onClick={() => !off && ref.current?.click()}
      onKeyDown={(e) => { if (!off && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); ref.current?.click(); } }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); if (!off) onFiles?.(Array.from(e.dataTransfer.files)); }}
      className={cx("flex h-31 flex-col items-center justify-center gap-4 rounded-md border p-4 text-center",
        off ? "cursor-not-allowed border-gray-300 bg-gray-50"
          : cx("cursor-pointer bg-white focus-visible:shadow-ring focus-visible:outline-none",
            State === "Error" ? "border-error-500" : State === "Hover" || State === "Focused" ? "border-brand-800" : "border-gray-300 hover:border-brand-800",
            State === "Focused" && "shadow-ring"),
        className)}>
      <div className="flex flex-col items-center gap-3">
        <FeaturedIcon Color={off ? "Disabled" : "Gray"} Size="sm" IconSwap="cloud_upload-24-300-round" />
        <div className="flex flex-col items-center gap-1">
          <p className="flex flex-wrap justify-center gap-1 text-sm">
            <span className={cx("font-semibold", off ? "text-gray-400" : "text-brand-900")}>คลิกเพื่อเลือกไฟล์</span>
            <span className="text-gray-600">หรือลากไฟล์มาวางบริเวณนี้</span>
          </p>
          {SupportingText && <p className="text-xs text-gray-600">{SupportingText}</p>}
        </div>
      </div>
      <input ref={ref} type="file" hidden accept={accept} multiple={multiple} disabled={off} onChange={(e) => { onFiles?.(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
    </div>
  );
}
