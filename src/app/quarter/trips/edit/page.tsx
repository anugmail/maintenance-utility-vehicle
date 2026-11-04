"use client";
/* S6 E.14 — แก้ไขแผนเดินทางที่ผู้อนุมัติส่งกลับ (/quarter/trips/edit/?trip=T1) — ฟอร์มเดียวกับสร้าง (quarter/_shared/TripForm) · Alert เหตุผล · ปุ่ม "ส่งอนุมัติใหม่" */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { useMock } from "@/lib/mock/store";
import { findTrip } from "@/lib/mock/trips";
import { TripForm } from "../../_shared/TripForm";

function EditTrip() {
  const sp = useSearchParams();
  const mock = useMock();
  const t = findTrip(mock, sp.get("trip"));
  if (!t) return null;   // ก่อนอ่าน localStorage / ไม่มีใบนี้
  return <TripForm key={t.id} planId={t.planId} q={t.quarter} edit={t} />;
}

export default function Page() {
  return <AppFrame><Suspense><EditTrip /></Suspense></AppFrame>;
}
