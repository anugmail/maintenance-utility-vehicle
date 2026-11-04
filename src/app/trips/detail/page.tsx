"use client";
/* /trips/detail/?trip=T1 — รายละเอียดแผนเดินทาง (สถานะงานรายคัน) S10 S12 (ตรวจเองและแผนจ้าง) · ส่งออก static: อ่าน query ใน Suspense */
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { TripDetail } from "./TripDetail";

export default function Page() {
  return <AppFrame><Suspense><TripDetail /></Suspense></AppFrame>;
}
