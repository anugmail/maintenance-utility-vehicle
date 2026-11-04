"use client";
/* /trips/job/?trip=T1&car=82-6789 — งานรายคัน แสดงตามบทบาท + สถานะงาน (ดู JobView) */
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { JobView } from "./JobView";

export default function Page() {
  return <AppFrame><Suspense><JobView /></Suspense></AppFrame>;
}
