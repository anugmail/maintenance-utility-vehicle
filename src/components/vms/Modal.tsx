"use client";
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
  Header: ReactNode;
  children?: ReactNode;
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
        <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} data-type={Type} onClick={(e) => e.stopPropagation()} className={cx("flex max-h-full max-w-full flex-col overflow-y-auto rounded-lg bg-white animate-fade-in", WIDTH[Size])}>
          {Header}
          {children && <div className="flex flex-col gap-3 px-6">{children}</div>}
          {Footer}
        </div>
      </div>
    </>
  );
}
