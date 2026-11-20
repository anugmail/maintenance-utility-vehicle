"use client";
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
  if (!t) return null;
  return <TripForm key={t.id} planId={t.planId} q={t.quarter} edit={t} />;
}

export default function Page() {
  return <AppFrame><Suspense><EditTrip /></Suspense></AppFrame>;
}
