"use client";
/* /trips/job/close/?trip=T1&car=82-6789 — ปิดงานบำรุงรักษา (S10 · S12 K.1 · แผนจ้างใช้หน้าเดียวกัน กบค. กรอกแทนผู้รับจ้าง) */
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { ClosePage } from "./ClosePage";

export default function Page() {
  return <AppFrame><Suspense><ClosePage /></Suspense></AppFrame>;
}
