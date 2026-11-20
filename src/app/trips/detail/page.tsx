"use client";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { TripDetail } from "./TripDetail";

export default function Page() {
  return <AppFrame><Suspense><TripDetail /></Suspense></AppFrame>;
}
