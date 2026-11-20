"use client";
import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export const TH = "bg-gray-100 px-4 py-3 text-left align-middle text-sm font-semibold text-black";
export const td = (i: number, extra?: string) => cx("h-14 px-4 py-2 align-middle", i % 2 ? "bg-gray-50" : "bg-white", extra);

export function ChecklistCard({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-4">{children}</div>;
}
