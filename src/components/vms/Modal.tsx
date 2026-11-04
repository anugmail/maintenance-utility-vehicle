"use client";
/* Figma: "Modal" — ไฟล์ (Component) VMS Plus หน้า Modals (node 2:16) · สเปก figma-spec/Modal.json
   variant: Type = Centered image | Centered image with input | Destructive centered image with input | Form | Card list | Left aligned image | Centered image carousel
            Size = md (กว้าง 500) | lg (800) | xl (1140)
   โครง: Background overlay + กล่อง Modal (รัศมี 12 พื้น white) = Modal header + เนื้อหา (Content / Form ขอบในข้าง 24 ช่องไฟ 12) + Modal footer
   ใช้แบบ confirm() / formModal() ใน core.js: confirm = Centered image ซ่อนรูป (Content) · ลบ = Destructive (ซ่อน Form) ปุ่มหลัก Primary danger button
   มือถือใช้ BottomSheet แทน (กติกาข้อ 6) · เงาไม่มีในดัมป์ → shadow-float */
import { useEffect, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { BackgroundOverlay } from "./BackgroundOverlay";

export type ModalType = "Centered image" | "Centered image with input" | "Destructive centered image with input" | "Form" | "Card list" | "Left aligned image" | "Centered image carousel";

const WIDTH = { md: "w-[500px]", lg: "w-[800px]", xl: "w-[1140px]" } as const;

export interface ModalProps {
  Type?: ModalType;
  Size?: "md" | "lg" | "xl";
  open: boolean;
  onClose?: () => void;
  /** ModalHeader */
  Header: ReactNode;
  /** Content / Form */
  children?: ReactNode;
  /** ModalFooter */
  Footer?: ReactNode;
  labelledBy?: string;
}

export function Modal({ Type = "Centered image", Size = "md", open, onClose, Header, children, Footer, labelledBy }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <BackgroundOverlay onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} data-type={Type} onClick={(e) => e.stopPropagation()} className={cx("flex max-h-full max-w-full flex-col overflow-y-auto rounded-lg bg-white shadow-float animate-fade-in", WIDTH[Size])}>
          {Header}
          {children && <div className="flex flex-col gap-3 px-6">{children}</div>}
          {Footer}
        </div>
      </div>
    </>
  );
}
