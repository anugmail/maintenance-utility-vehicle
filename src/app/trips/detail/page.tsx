"use client";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { useBell } from "@/app/trips-view/_shared/Bell";
import { useRole } from "@/lib/mock/store";
import { TripDetail } from "./TripDetail";

export default function Page() {
  const vendor = useRole() === "ผู้รับจ้าง";
  const { bell, panel } = useBell(vendor);
  return <AppFrame bell={vendor ? bell : undefined}><Suspense><TripDetail /></Suspense>{vendor && panel}</AppFrame>;
}
