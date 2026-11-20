"use client";
import { useEffect, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { BackgroundOverlay } from "./BackgroundOverlay";
import { BottomSheetHeader } from "./BottomSheetHeader";

export interface BottomSheetProps {
  open: boolean;
  onClose?: () => void;
  Title?: string;
  ActionText?: string;
  onAction?: () => void;
  children?: ReactNode;
  Footer?: ReactNode;
  flush?: boolean;
  labelledBy?: string;
}

export function BottomSheet({ open, onClose, Title, ActionText, onAction, children, Footer, flush, labelledBy }: BottomSheetProps) {
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
      <div role="dialog" aria-modal="true" aria-labelledby={labelledBy} className="fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col overflow-y-auto rounded-t-sheet bg-white animate-sheet-up">
        <BottomSheetHeader Text={Title} ActionText={ActionText} onAction={onAction} />
        {children && <div className={cx("flex flex-col gap-4", flush ? "" : "px-4")}>{children}</div>}
        {Footer}
      </div>
    </>
  );
}
