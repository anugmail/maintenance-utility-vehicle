"use client";
import { Suspense } from "react";
import { AppFrame } from "@/components/shell/AppFrame";
import { JobView } from "./JobView";

export default function Page() {
  return <AppFrame><Suspense><JobView /></Suspense></AppFrame>;
}
