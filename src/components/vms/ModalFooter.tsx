"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export interface ModalFooterProps {
  Alignment?: "Horizontal fill" | "Horizontal right" | "Vertical fill";
  Divider?: boolean;
  PaddingTop?: boolean;
  SecondaryAction?: ReactNode;
  PrimaryAction?: ReactNode;
  TertiaryAction?: ReactNode;
}

export function ModalFooter({ Alignment = "Horizontal fill", SecondaryAction, PrimaryAction, TertiaryAction, Divider, PaddingTop = true }: ModalFooterProps) {
  return (
    <div className={cx("px-6 pb-6", PaddingTop && "pt-6")}>
      {Divider && <div className="-mx-6 pb-5"><div className="h-px bg-gray-300" /></div>}
      {Alignment === "Vertical fill" ? (
        <div className="flex flex-col gap-3 [&>*]:w-full">{PrimaryAction}{SecondaryAction}</div>
      ) : Alignment === "Horizontal right" ? (
        <div className="flex items-center gap-3">{TertiaryAction}<div className="ml-auto flex gap-3">{SecondaryAction}{PrimaryAction}</div></div>
      ) : (
        <div className={cx("flex gap-3 [&>*]:flex-1 [&>*]:basis-0")}>{SecondaryAction}{PrimaryAction}</div>
      )}
    </div>
  );
}
