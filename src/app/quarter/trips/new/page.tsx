"use client";
/* S6 E.2–E.8 E.10 E.12 · S9 H.1–H.6 — สร้างแผนเดินทาง (/quarter/trips/new/?id=Z7000001&q=1 · ?mode=hire เปิดแบบจ้างดำเนินการ) — ฟอร์มอยู่ที่ quarter/_shared/TripForm */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { useSeed } from "@/lib/mock/seedB";
import { TripForm } from "../../_shared/TripForm";

function NewTrip() {
  const seeding = useSeed();
  const sp = useSearchParams();
  if (seeding) return null;
  return <TripForm planId={sp.get("id") ?? "Z7000001"} q={Number(sp.get("q") ?? 1)} initialMode={sp.get("mode") === "hire" ? "hire" : "self"} />;
}

export default function Page() {
  return <AppFrame><Suspense><NewTrip /></Suspense></AppFrame>;
}
