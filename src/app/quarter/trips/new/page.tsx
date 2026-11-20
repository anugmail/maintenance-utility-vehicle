"use client";
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
