"use client";
/* /trips/job/receive/?trip=T1&car=82-6789 — รับรถเข้าบำรุงรักษา (S10 · ผู้รับจ้าง S23 ใช้หน้าเดียวกัน) */
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ReceivePage } from "./ReceivePage";

export default function Page() {
  return <AppFrame><Suspense><ReceivePage /></Suspense></AppFrame>;
}
